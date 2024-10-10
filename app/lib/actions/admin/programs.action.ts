"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";
import { generateLikeClause, generateParameters } from "./(utils)/helpers";
import { deleteHandler } from "./(utils)/delete.action";


interface Program {
    like: string;
    is_bat: number;
}

const programs: Record<string, Program> = {
    "nest": { like: "%Cohort%", is_bat: 0 },
    "launch-lab": { like: "%Launch Lab%", is_bat: 0 },
    "utias": { like: "%Utias%", is_bat: 0 },
    "social": { like: "%Social%", is_bat: 0 },
    "alumni": { like: "%Alumni%", is_bat: 0 },
    "bat": { like: "%Cohort%", is_bat: 1 },
    "triage": { like: "%%", is_bat: 0 }, // For general triage filtering
    "go-to-market": { like: "%YES%", is_bat: 0 } // Assuming the logic for 'go-to-market' should follow a similar pattern
};

const statuses: Record<string, string> = {
    all: "%%",
    pending: "%pending%",
    accepted: "%accepted%",
    declined: "%declined%",
    interview: "%interview%",
    not_eligible: "%not eligible%",
    withdrawn: "%withdrawn%",
    conditional: "%conditional%",
    launched: "%launched%",
    reviewing: "%reviewing%",
    funded: "%funded%"
};

export async function getProgramApplications(program: string, searchQuery: string, status: string = 'all') {
    const session = await auth();
    if (session?.user?.role != 'admin') {
        return 'Your permission does not allow access to this information.';
    }

    try {
        let whereClause = "";
        const programConfig = programs[program];
        const statusLike = statuses[status];

        let startIndex = 1;

        if (program === "triage") {
            whereClause = `a.triage LIKE '%YES%'`;
        } else if(program === "go-to-market"){
            whereClause = `a.go_to_market LIKE '%YES%'`;
        }else {
            whereClause = `LOWER(a.cohort) LIKE LOWER($1) AND a.status LIKE $2 AND a.bat_cohort = $3`;
            startIndex = 4;
        }

        const searchColumns = [
          "a.team_id", 
          "a.bat_cohort", 
          "a.status", 
          "a.team_name", 
          "c.original_name", 
          "a.cohort", 
          "a.time_registered", 
          "a.promo", 
          "a.go_to_market", 
          "a.triage", 
          "a.progress", 
          "a.nomination", 
          "a.demo_day", 
          "a.prizes", 
          "b.size", 
          "a.problem_statement_text", 
          "a.development_solution", 
          "a.development_solution_link", 
          "a.startup_technology"
        ]

        const statement = `
            SELECT a.team_id, a.bat_cohort, a.status, a.team_name, c.original_name, a.cohort, a.time_registered AS date, a.promo, a.go_to_market, a.triage, a.progress, a.nomination, a.demo_day, a.prizes, b.size, a.problem_statement_text, a.development_solution, a.development_solution_link, a.startup_technology
            FROM teams a
            INNER JOIN (SELECT project_id, startup_name AS original_name FROM projects) c ON a.project_id = c.project_id
            INNER JOIN (SELECT team_member_rlshp.team_id, COUNT(*) AS size FROM team_member_rlshp GROUP BY team_member_rlshp.team_id) b ON a.team_id = b.team_id
            WHERE ${whereClause} AND (${generateLikeClause(searchColumns, startIndex)})
            ORDER BY a.cohort DESC, a.time_registered DESC`;

        let parameters = program === "triage" || program === "go-to-market" ? [] : [programConfig.like, statusLike, programConfig.is_bat];
        parameters = parameters.concat(generateParameters(searchColumns, searchQuery));

        const applications = await query(statement, parameters);

        return {
            columnDefs: [],
            rowData: applications
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch ${program} applications.`);
    }
}

export async function updateCohorts(selectedRowsData: any, cohort: string) {
  const session = await auth();
  if (session?.user?.role != 'admin') {
      return 'Your permission does not allow access to this information.';
  }

  try {
      
    const statement = `
        UPDATE teams
        SET cohort = $2
        WHERE team_id = ANY($1::int[])
        RETURNING *`

    const values = selectedRowsData.map((row: { [key: string]: any }) => row['team_id']);

    const res = await query(statement, [values, cohort]);
    return res;

  } catch (error) {
      console.error('Database Error:', error);
      throw new Error(`Failed to update cohorts.`);
  }
}

export async function deleteProgramApplications(selectedRowsData: any) {

  const option = "program";
  const optionToTable = { "program": "teams" }
  const optionToPrimaryKey = { "program": "team_id" }

  return await deleteHandler(selectedRowsData, option, optionToTable, optionToPrimaryKey);
}

export async function getAllAdvisors(teamId: number) {
  const session = await auth();
  if (session?.user?.role != 'admin') {
      return 'Your permission does not allow access to this information.';
  }

  try {
      
    const currentAdvisorsQuery = `
        (SELECT 'm' AS role, mentors.first_name AS first_name, mentors.last_name AS last_name, mentors.id, mentors.mentors_id AS email
        FROM mentors 
        INNER JOIN project_mentor_rlshp ON mentors.mentors_id = project_mentor_rlshp.mentor_id 
        INNER JOIN teams ON project_mentor_rlshp.project_id = teams.project_id 
        WHERE teams.team_id = $1)
        UNION
        (SELECT 'c' AS role, connectors.firstname AS first_name, connectors.lastname AS last_name, connectors.id, connectors.email
        FROM connectors
        INNER JOIN project_connector_rlshp ON connectors.id = project_connector_rlshp.connector_id 
        INNER JOIN teams ON project_connector_rlshp.project_id = teams.project_id
        WHERE teams.team_id = $1)
        UNION
        (SELECT 's' AS role, MIN(employment.firstname) AS first_name, MIN(employment.lastname) AS last_name, MIN(employment.reference), employment.email
        FROM employment
        INNER JOIN team_staff_rlshp ON team_staff_rlshp.staff_id = employment.email 
        INNER JOIN teams ON team_staff_rlshp.team_id = teams.team_id
        WHERE teams.team_id = $1
        GROUP BY employment.email)
        ORDER BY role ASC, first_name ASC
    `

    const allAdvisorsQuery = `
        (SELECT 'm' AS role, mentors.first_name AS first_name, mentors.last_name AS last_name, mentors.id, mentors.mentors_id AS email
        FROM mentors)
        UNION
        (SELECT 'c' AS role, connectors.firstname AS first_name, connectors.lastname AS last_name, connectors.id, connectors.email
        FROM connectors)
        UNION
        (SELECT 's' AS role, MIN(employment.firstname) AS first_name, MIN(employment.lastname) AS last_name, MIN(employment.reference) AS id, employment.email
        FROM employment
        GROUP BY employment.email)
        ORDER BY role ASC, first_name ASC
    `

    const currentAdvisors = await query(currentAdvisorsQuery, [teamId]);
    const allAdvisors = await query(allAdvisorsQuery);

    const res = allAdvisors.map(advisor => {
      const foundAdvisor = currentAdvisors.find(ca => ca.email === advisor.email);
      if (foundAdvisor) {
        return { ...advisor, selected: true, label: `${advisor.first_name} ${advisor.last_name}`, value: advisor.id };
      }
      return { ...advisor, selected: false, label: `${advisor.first_name} ${advisor.last_name}`, value: advisor.id };
    })

    return res;

  } catch (error) {
      console.error('Database Error:', error);
      throw new Error(`Failed to fetch advisors.`);
  }
}

export async function addAdvisor(teamId: number, type: string, advisorId: string) {
  const session = await auth();
  if (session?.user?.role != 'admin') {
      return 'Your permission does not allow access to this information.';
  }

  try {

    let id = teamId;

    if (type !== 's') {
      const projectIdQuery = `
          SELECT project_id 
          FROM teams 
          WHERE team_id = $1
      `
      id = (await query(projectIdQuery, [teamId]))[0].project_id;
    }

    let insertQuery = ``;

    switch (type) {

      case 'c':
        insertQuery = `
          INSERT INTO project_connector_rlshp (project_id, connector_id)
          VALUES ($1, $2)
          RETURNING *
        `
        break;
      
      case 'm':
        insertQuery = `
          INSERT INTO project_mentor_rlshp (project_id, mentor_id)
          VALUES ($1, $2)
          RETURNING *
        `
        break;

      case 's':
        insertQuery = `
          INSERT INTO team_staff_rlshp (team_id, staff_id)
          VALUES ($1, $2)
          RETURNING *
        `
        break;
    }

    const res = await query(insertQuery, [id, advisorId]);
    return res;

  } catch (error) {
      console.error('Database Error:', error);
      throw new Error(`Failed to add advisor.`);
  }
}

export async function removeAdvisor(teamId: number, type: string, advisorId: string) {
  const session = await auth();
  if (session?.user?.role != 'admin') {
      return 'Your permission does not allow access to this information.';
  }

  try {

    let id = teamId;

    if (type !== 's') {
      const projectIdQuery = `
          SELECT project_id 
          FROM teams 
          WHERE team_id = $1
      `
      id = (await query(projectIdQuery, [teamId]))[0].project_id;
    }

    let deleteQuery = ``;

    switch (type) {

      case 'c':
        deleteQuery = `
          DELETE FROM project_connector_rlshp 
          WHERE project_id = $1 AND connector_id = $2 
          RETURNING *
        `
        break;
      
      case 'm':
        deleteQuery = `
          DELETE FROM project_mentor_rlshp 
          WHERE project_id = $1 AND mentor_id = $2 
          RETURNING *
        `
        break;

      case 's':
        deleteQuery = `
          DELETE FROM team_staff_rlshp 
          WHERE team_id = $1 AND staff_id = $2 
          RETURNING *
        `
        break;
    }

    const res = await query(deleteQuery, [id, advisorId]);
    return res;

  } catch (error) {
      console.error('Database Error:', error);
      throw new Error(`Failed to remove advisor.`);
  }
}
