"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";
import { z } from "zod";
const path = require('path');
const fs = require('fs');

export async function getStartupProfile(team_id: number){    
  try {
    const statement = `
      SELECT 
        teams.team_name,
        projects.startup_name AS original_name,
        teams.team_image,
        teams.problem_statement_text,
        teams.startup_technology AS startup_technology,
        teams.acceptance_letter,
        teams.ownership_statement
      FROM teams 
      INNER JOIN projects ON teams.project_id = projects.project_id 
      WHERE teams.team_id = $1
    `;
    const data = await query(statement, [team_id]);
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch startup profile data.`);
  }
}

const FormSchema = z.object({
  startupName: z.string(),
  problemStatement: z.string(),
  startupTechnology: z.string(),
  teamImage: z.nullable(z.object({
    size: z.number(),
    type: z.string(),
    name: z.string(),
    lastModified: z.number()
  })),
  acceptanceLetter: z.nullable(z.object({
    size: z.number(),
    type: z.string(),
    name: z.string(),
    lastModified: z.number()
  })),
  ownershipStatement: z.nullable(z.object({
    size: z.number(),
    type: z.string(),
    name: z.string(),
    lastModified: z.number()
  })),
})

export async function canEditProfile() {
  const session = await auth();
  return session?.user?.role === 'admin' || session?.user?.role === 'founder'
}

export async function patchStartupProfile(team_id: number, formData: FormData) {
  const session = await auth();
  if (session?.user?.role != 'admin' && session?.user?.role != 'founder') {
    return 'Your permission does not allow this action.';
  }
  
  let formObject = {
    startupName: formData.get("startupName"),
    problemStatement: formData.get("problemStatement"),
    startupTechnology: formData.get("startupTechnology"),
    teamImage: formData.get("uploadedImage"),
    acceptanceLetter: formData.get("acceptanceLetter"),
    ownershipStatement: formData.get("ownershipStatement"),
  };

  const validatedFields = FormSchema.safeParse(formObject);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to submit application.",
    };
  }

  let statement = 'UPDATE teams SET team_name = $1, problem_statement_text = $2, startup_technology = $3';
  let params = [formObject.startupName, formObject.problemStatement, formObject.startupTechnology];
  let paramIndex = 4

  try {
    let team_image_path, acceptance_letter_path, ownership_statement_path = ''

    if (formObject.teamImage) {
      const img = formObject.teamImage as File;
      team_image_path = '/startup_logos/startup_' + team_id + '.' + img.type.split('/')[1]
      await saveFile(img, 'public' + team_image_path);
      statement += `, team_image = $${paramIndex}`;
      params.push(team_image_path);
      paramIndex++;
    }
    if (formObject.acceptanceLetter) {
      const document = formObject.acceptanceLetter as File;
      acceptance_letter_path = '/startup_files/acceptance_letters/startup_' + team_id + '.' + document.type.split('/')[1]
      await saveFile(document, 'public' + acceptance_letter_path);
      statement += `, acceptance_letter = $${paramIndex}`;
      params.push(acceptance_letter_path);
      paramIndex++;
    }
    if (formObject.ownershipStatement) {
      const document = formObject.ownershipStatement as File;
      ownership_statement_path = '/startup_files/ownership_statements/startup_' + team_id + '.' + document.type.split('/')[1]
      await saveFile(document, 'public' + ownership_statement_path);
      statement += `, ownership_statement = $${paramIndex}`;
      params.push(ownership_statement_path);
      paramIndex++;
    }

    statement += ` WHERE team_id = ${team_id}`;
    await query(statement, params);
    console.log('success')
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to patch startup profile data.`);
  }
}

async function saveFile(file: File, dest: string) {
  const filePath = path.join(process.cwd(), dest);
  const fileBuffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(fileBuffer));
}
