'use server'

import query from "@/app/lib/pgdb";
import { redirect } from "next/navigation";
import { z } from 'zod';

const FormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  utorid: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9]+$/),
  linkedin: z.string().url(),
  program: z.string().min(1),
  gradyear: z.string().regex(/^\+?[0-9]+$/),
});

export async function applyToAbassador(previousState: any, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    firstName: formData.get('First Name'),
    lastName: formData.get('Last Name'),
    utorid: formData.get('Utorid'),
    email: formData.get('Email'),
    phone: formData.get('Phone'),
    linkedin: formData.get('Linkedin'),
    program: formData.get('Program'),
    gradyear: formData.get('Grad. Year'),
  })

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to Submit Application.',
    };
  }

  const {firstName, lastName, utorid, email, phone, linkedin, program, gradyear} = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  const status = 'Pending'

  try {
    const insertQuery = `INSERT INTO "ambassadors" ("firstname", "lastname", "utorid", "email", "phone", "linkedin", "program", "gradyear", "date", "status")
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const insertValues = [firstName, lastName, utorid, email, phone, linkedin, program, gradyear, date, status];
    await query(insertQuery, insertValues);

  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Submit Application.',
    };
  }
  redirect('/engage/confirmation');
}