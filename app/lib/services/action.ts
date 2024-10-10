'use server'

import { z } from 'zod';
import query from "@/app/lib/pgdb";

interface Education {
  id: number,
  educationLevel: string;
  program: string;
  university: string;
  gradYear: number;
}

interface Profile {
  firstName: string;
  lastName: string;
  primaryEmail: string;
  personalEmail: string;
  phone: string;
  linkedIn: string;
  gender: string;
  expertise: string;
  interest: string;
  about: string;
  education: Education[];
}

interface BatData {
  batType: string;
  startupDescription: string;
  startupLocation: string;
  problemStatement: string;
  startupTechnology: string;
  skills: { [key: string]: string[] };
  skillsOtherOption: { [key: string]: string };
  profile: Profile;
  startupImage: string;
  profileImage: string;
}

const Education = z.object({
  id: z.number().nonnegative(),
  educationLevel: z.string().min(1),
  program: z.string().min(1),
  university: z.string().min(1),
  gradYear: z.number().positive()
});

const Profile = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  primaryEmail: z.string().email().min(1),
  personalEmail: z.string().email().min(1),
  phone: z.string().min(1),
  linkedIn: z.string().url().min(1),
  gender: z.string().min(1),
  expertise: z.string().min(1),
  interest: z.string().min(1),
  about: z.string().min(1),
  education: z.array(Education)
});

function validateWordCount(str: string, max: number) {
  return str.trim().split(/\s+/).length <= max;
}

const BatData = z.object({
  batType: z.string().min(1),
  cofounderTitle: z.string(), // only required for cofounder search
  cofounderDescription: z.string(), // only required for cofounder search
  startupDescription: z.string().min(1),
  startupLocation: z.string().min(1),
  problemStatement: z.string(), // only required for cofounder search
  startupTechnology: z.string(), // only required for cofounder search
  skills: z.record(z.array(z.string())), 
  skillsOtherOption: z.record(z.string()), 
  profile: Profile,
  startupImage: z.string(),
  profileImage: z.string(),
}).refine(data => {
  return data.batType !== "Cofounder Search" || data.cofounderTitle;
}, {
  message: "Cofounder Title: Required" 
}).refine(data => {
  return data.batType !== "Cofounder Search" || data.cofounderDescription;
}, {
  message: "Cofounder Description: Required" 
}).refine(data => {
  return data.batType !== "Cofounder Search" || data.problemStatement;
}, {
  message: "Problem Statement: Required" 
}).refine(data => {
  return data.batType !== "Cofounder Search" || data.startupTechnology;
}, {
  message: "Startup Technology: Required" 
}).refine(data => {
  return validateWordCount(data.cofounderDescription, 50);
}, {
  message: "Cofounder Description: Exceeds maximum number of words 50"
}).refine(data => {
  return validateWordCount(data.problemStatement, 200);
}, {
  message: "Problem Statement: Exceeds maximum number of words 200"
}).refine(data => {
  return validateWordCount(data.startupTechnology, 100);
}, {
  message: "Startup Technology: Exceeds maximum number of words 100"
}).refine(data => {
  for (const key in data.skills) {
    if (!data.skills[key].length) {
      return false;
    }
    if (data.skills[key].includes("Other")) {
      if (!data.skillsOtherOption[key]) {
        return false;
      }
    }
  }
  return true;
}, {
  message: "Build a Team information contains missing required fields (either no option has been selected or 'other' checkbox description option has not been filled out)" 
});

function processList(inputList: any[]) {
  let processedList: (string | number)[] = [];
  inputList.forEach(item => {
    if (typeof item === 'string') {
      if (item === "linkedIn") {
        processedList.push("LinkedIn");
      } else {
        let capitalizedItem = item.split(/(?=[A-Z])/).join(' ');
        capitalizedItem = capitalizedItem.charAt(0).toUpperCase() + capitalizedItem.slice(1);
        processedList.push(capitalizedItem);
      }
    } else if (typeof item === 'number') {
      processedList.push(item + 1);
    } else {
      processedList.push(item);
    }
  });
  return processedList;
}

function generateErrorList(errors: any[]) {
  const errorMessages: { [key: string]: string } = {
    "String must contain at least 1 character(s)": "Required",
    "Invalid email": "Must be a valid email address",
    "Number must be greater than 0": "Must be a valid year",
    "Array must contain at least 1 element(s)": "At least one is required"
    // Add more error messages as needed
  };

  const errorList: any[] = [];
  
  errors.forEach((validationError: any) => {
    const path = processList(validationError.path).join(" ");
    const message = errorMessages[validationError.message] || validationError.message;
    if (path) {
      errorList.push(path + ": " + message);
    } else {
      errorList.push(message);
    }
  });

  return errorList
}

export async function batSubmit(batData: BatData) {
  const validatedFields = BatData.safeParse(batData);

  if (!validatedFields.success) {
    const errorList = generateErrorList(validatedFields.error.errors);
    return { success: false, errors: errorList };
  }

  try {
    const data = validatedFields.data;

    // get program
    let cohort;
    const currentDate = new Date();
    const thisYearDeadline = new Date(currentDate.getFullYear(), 3, 30);
    const nextYearDeadline = new Date(currentDate.getFullYear() + 1, 3, 30);
    if (currentDate > thisYearDeadline && currentDate < nextYearDeadline) {
      cohort = "Cohort " + (currentDate.getFullYear() + 1);
    } else {
      cohort = "Cohort " + currentDate.getFullYear();
    }

    // parse skills data
    let skills = data.skills;
    let otherSkills = data.skillsOtherOption;
    let suggestedSkills = null;
    for (const key in skills) {
      if (skills[key].includes("Other")) {
        const index = skills[key].indexOf("Other");
        skills[key][index] = otherSkills[key];
      }
    }
    suggestedSkills = skills;

    if (data.batType === "Cofounder Search") {
      const projectID = (await saveProjects(data.problemStatement, data.startupDescription))[0].project_id;
      console.log("Finished saving projects with project_id: " + projectID);

      const teamID = (await saveTeamsDocuments(data.startupDescription, projectID, cohort, data.problemStatement))[0].team_id
      console.log("Finished saving teams with team_id: " + teamID);
      
      await saveTeamProjectRlshp(teamID, projectID, cohort);
      console.log("Finished saving team_project_rlshp with team_id: " + teamID + ", project_id: " + projectID + ", program: " + cohort);
      
      const studentNum = (await saveStudent(teamID, cohort, data.profile, suggestedSkills))[0].student_num;
      console.log("Saved a student with student number: " + studentNum);

      await saveBookmark(teamID, data.cofounderTitle, data.cofounderDescription, studentNum, data.profile.primaryEmail, suggestedSkills);

      await saveTeamMemberRlshp(data.profile.primaryEmail, teamID);
      console.log("Finished saving team_member_rlshp with team_id: " + teamID + ", student_number: " + studentNum);
    } else{
      const studentNum = (await saveStudent(null, cohort, data.profile, suggestedSkills))[0].student_num;
      console.log("Saved a student with student number: " + studentNum);

      await saveBookmark(null, data.startupDescription, null, studentNum, data.profile.primaryEmail, suggestedSkills);
    }
    console.log("Application submitted");
    return { success: true }
  } catch (err) {
    console.log(err);
    return { success: false, errors: ["Database Error: Failed to submit application"] };
  }

  // create project
  async function saveProjects(problemStatement: string, startupName: string) {
    const insertQuery = `
      INSERT INTO projects (project_logo, problem_statement, startup_name) 
      VALUES ($1, $2, $3)
      RETURNING project_id
    `;
    const insertValues = ['/programs/placeholder-team.png', problemStatement, startupName];
    return await query(insertQuery, insertValues);
  }

  // create team
  async function saveTeamsDocuments(teamName: string, projectID: number, program: string, problemStatement: string) {
    const insertQuery = `
      INSERT INTO teams (team_name, project_id, cohort, problem_statement_text, team_image, status) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING team_id
    `;
    const insertValues = [teamName, projectID, program, problemStatement, '/programs/placeholder-team.png', 'pending'];
    return await query(insertQuery, insertValues);
  }

  // create team project relation
  async function saveTeamProjectRlshp(teamID: number, projectID: number, program: string) {
    const insertQuery = `
      INSERT INTO team_project_rlshp (team_id, project_id, cohort_id, date_joined) 
      VALUES ($1, $2, $3, $4)
    `;
    const insertValues = [teamID, projectID, program, new Date()];
    return await query(insertQuery, insertValues);
  }

  // create student profile
  async function saveStudent(teamID: any, program: any, profile: any, suggestedSkills: any,) {
    const degreeCount = profile.education.length;
    const education = profile.education[0];
    const extraEducation = profile.education.slice(1);

    const insertStudentQuery = `
      INSERT INTO students (
        firstname, 
        lastname, 
        uoft_email, 
        hatchery_id, 
        personal_email, 
        phone, 
        linkedin_url, 
        gender, 
        expertise, 
        interests, 
        bio, 
        degree, 
        program, 
        university, 
        expected_grad_year, 
        degrees, 
        extra_degrees, 
        source, 
        profile_pic_url, 
        team_id, 
        suggested_skills
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING student_num
    `;

    const insertStudentValues = [
      profile.firstName, 
      profile.lastName, 
      profile.primaryEmail, 
      profile.primaryEmail,
      profile.personalEmail, 
      profile.phone, 
      profile.linkedIn,
      profile.gender,
      profile.expertise,
      profile.interest,
      profile.about,
      education.educationLevel, 
      education.program, 
      education.university,
      education.gradYear,
      degreeCount, 
      extraEducation, 
      program,
      '/programs/placeholder-profile.png',
      teamID,
      suggestedSkills,
    ];

    return await query(insertStudentQuery, insertStudentValues);
  }

  // create bookmark search
  async function saveBookmark(
    teamID: any, 
    searchTerm: any, 
    description: any, 
    studentNum: any, 
    studentEmail: any, 
    suggestedSkills: any) 
  {
    const insertQuery = `
      INSERT INTO bookmark_searches (
        search_term,
        search_description,
        industry_selection,
        business_selection,
        technical_selection,
        student_email,
        student_id_number,
        team_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    
    const insertValues = [
      searchTerm,
      description,
      suggestedSkills['industry'],
      suggestedSkills['business'],
      suggestedSkills['technical'],
      studentEmail,
      studentNum,
      teamID,
    ];

    return query(insertQuery, insertValues);
  }

  // create team member relation
  async function saveTeamMemberRlshp(studentID: any, teamID: any) {
    const insertQuery = `
      INSERT INTO team_member_rlshp (
        student_id,
        team_id,
        date_joined
      )
      VALUES ($1, $2, $3)
    `;

    const insertValues = [
      studentID,
      teamID,
      new Date()
    ];

    return query(insertQuery, insertValues);
  }
}
