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

interface Cofounder {
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

interface ProgramData {
  program: string;
  startupName: string;
  problemStatement: string;
  devSolution: string;
  cofounders: Cofounder[];
  LFCofounders: boolean;
  LFCofounderTitle: string;
  LFCofounderDescription: string;
  LFCofounderSkills: { [key: string]: string[] };
  LFCofounderOtherOption: { [key: string]: string };
  LFCofounderOtherText: { [key: string]: string };
  learnAboutHatchery: string;
}

const Education = z.object({
  id: z.number().nonnegative(),
  educationLevel: z.string().min(1),
  program: z.string().min(1),
  university: z.string().min(1),
  gradYear: z.number().positive()
});

const Cofounder = z.object({
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

const ProgramData = z.object({
  program: z.string().min(1),
  startupName: z.string().min(1),
  problemStatement: z.string().min(1),
  devSolution: z.string(), // Not required by default, see condition below
  cofounders: z.array(Cofounder).min(1),
  LFCofounders: z.boolean(),
  LFCofounderTitle: z.string(), // Mandatory if LFCofounders is true
  LFCofounderDescription: z.string(), // Mandatory if LFCofounders is true
  LFCofounderSkills: z.record(z.array(z.string())), // Mandatory if LFCofounders is true
  LFCofounderOtherOption: z.record(z.string()), // Mandatory if LFCofounders is true and LFCofounderSkills contains "Other"
  LFCofounderOtherText: z.record(z.string()), // Mandatory if LFCofounders is true
  learnAboutHatchery: z.string().min(1)
}).refine(data => {
  // Check condition for devSolution based on program
  if (data.program !== "NEST") {
    return data.devSolution;
  }
  return true;
}, {
  message: "Basis For Development of Solution: Required"
}).refine(data => {
  // All "LFCofounder..." fields must be present if LFCofounders is true
  if (data.LFCofounders) {
    for (const key in data.LFCofounderSkills) {
      if (data.LFCofounderSkills[key].includes("Other")) {
        if (!data.LFCofounderOtherOption[key]) {
          return false;
        }
      }
    }
    return (
      data.LFCofounderTitle &&
      data.LFCofounderDescription
    );
  }
  return true;
}, {
  message: "Looking for cofounders information has not been filled out correctly or contains missing required fields (either the title, description, or 'other' checkbox description option has not been filled out)"
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

export async function applyToProgram(programData: ProgramData) {

  const validatedFields = ProgramData.safeParse(programData);

  if (!validatedFields.success) {
    const errorList = generateErrorList(validatedFields.error.errors);
    return { success: false, errors: errorList };
  }

  try {
    const data = validatedFields.data;

    if (data.program === "NEST") {
      const currentDate = new Date();
      const thisYearDeadline = new Date(currentDate.getFullYear(), 3, 30);
      const nextYearDeadline = new Date(currentDate.getFullYear() + 1, 3, 30);
      if (currentDate > thisYearDeadline && currentDate < nextYearDeadline) {
        data.program = "Cohort " + (currentDate.getFullYear() + 1);
      } else {
        data.program = "Cohort " + currentDate.getFullYear();
      }
    }

    // saveProjects
    const projectID = (await saveProjects(data.problemStatement, data.startupName))[0].project_id;
    console.log("Finished saving projects with project_id: " + projectID);

    const teamID = (await saveTeamsDocuments(data.startupName, projectID, data.program, data.problemStatement, data.devSolution))[0].team_id
    console.log("Finished saving teams with team_id: " + teamID);

    await saveTeamProjectRlshp(teamID, projectID, data.program);
    console.log("Finished saving team_project_rlshp with team_id: " + teamID + ", project_id: " + projectID + ", program: " + data.program);

    await saveStudents(
      teamID, 
      data.program, 
      data.cofounders, 
      data.learnAboutHatchery, 
      data.LFCofounders, 
      data.LFCofounderTitle, 
      data.LFCofounderDescription, 
      data.LFCofounderSkills, 
      data.LFCofounderOtherOption, 
      data.LFCofounderOtherText
    )
    console.log("Finished saving students");

    console.log("Application submitted");

    return { success: true };

  } catch (err) {
    console.log(err);
    return { success: false, errors: ["Database Error: Failed to submit application"] };
  }
}

async function saveProjects(problemStatement: string, startupName: string) {
  const insertQuery = `
    INSERT INTO projects (project_logo, problem_statement, startup_name) 
    VALUES ($1, $2, $3)
    RETURNING project_id
  `;
  const insertValues = ['/programs/placeholder-team.png', problemStatement, startupName];
  return await query(insertQuery, insertValues);
}

async function saveTeamsDocuments(teamName: string, projectID: number, cohort: string, problemStatement: string, devSolution: string) {
  const insertQuery = `
    INSERT INTO teams (team_name, project_id, cohort, problem_statement_text, team_image, development_solution, status) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING team_id
  `;
  const insertValues = [teamName, projectID, cohort, problemStatement, '/programs/placeholder-team.png', devSolution, 'pending'];
  return await query(insertQuery, insertValues);
}

async function saveTeamProjectRlshp(teamID: number, projectID: number, cohort: string) {
  const insertQuery = `
    INSERT INTO team_project_rlshp (team_id, project_id, cohort_id, date_joined) 
    VALUES ($1, $2, $3, $4)
  `;
  const insertValues = [teamID, projectID, cohort, new Date()];
  return await query(insertQuery, insertValues);
}

async function saveStudents(
  teamID: any, 
  program: any, 
  cofounders: any, 
  learnAboutHatchery: any, 
  LFCofounder: any,
  LFCofounderTitle: any, 
  LFCofounderDescription: any, 
  LFCofounderSkills: any, 
  LFCofounderOtherOption: any, 
  LFCofounderOtherText: any
) {
  
  let suggestedSkills = null;

  if (LFCofounder) {
    for (const key in LFCofounderSkills) {
      if (LFCofounderSkills[key].includes("Other")) {
        const index = LFCofounderSkills[key].indexOf("Other");
        LFCofounderSkills[key][index] = LFCofounderOtherOption[key];
      }
      if (LFCofounderOtherText[key]) {
        LFCofounderSkills[key].push(LFCofounderOtherText[key]);
      }
    }
  
    suggestedSkills = LFCofounderSkills;
  }
  
  for (const cofounder of cofounders) {

    const degreeCount = cofounder.education.length;
    const education = cofounder.education[0];
    const extraEducation = cofounder.education.slice(1);

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
        has_team, 
        has_search, 
        team_id, 
        hatchery_refer, 
        suggested_skills
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      RETURNING student_num
    `;

    const insertStudentValues = [
      cofounder.firstName, 
      cofounder.lastName, 
      cofounder.primaryEmail, 
      cofounder.primaryEmail,
      cofounder.personalEmail, 
      cofounder.phone, 
      cofounder.linkedIn,
      cofounder.gender,
      cofounder.expertise,
      cofounder.interest,
      cofounder.about,
      education.educationLevel, 
      education.program, 
      education.university,
      education.gradYear,
      degreeCount, 
      extraEducation, 
      program,
      '/programs/placeholder-profile.png',
      '1',
      '1',
      teamID,
      learnAboutHatchery,
      suggestedSkills,
    ];

    const studentNum = (await query(insertStudentQuery, insertStudentValues))[0].student_num;

    if (LFCofounder) {

      const insertSearchQuery = `
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

      const insertSearchValues = [
        LFCofounderTitle,
        LFCofounderDescription,
        LFCofounderSkills['industry'],
        LFCofounderSkills['business'],
        LFCofounderSkills['technical'],
        cofounder.primaryEmail,
        studentNum,
        teamID
      ];

      await query(insertSearchQuery, insertSearchValues);
    }

    // create user afterwards

    const insertTeamMemberRlshpQuery = `
        INSERT INTO team_member_rlshp (
          student_id,
          team_id,
          date_joined
        )
        VALUES ($1, $2, $3)
      `;

      const insertTeamMemberRlshpValues = [
        cofounder.primaryEmail,
        teamID,
        new Date()
      ];

      await query(insertTeamMemberRlshpQuery, insertTeamMemberRlshpValues);

      console.log("Saved a student");
  }
}
