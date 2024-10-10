'use server'

import query from "@/app/lib/pgdb";
import { redirect } from "next/navigation";
import { z } from 'zod';

const FormSchema = z.object({
  initial: z.string().min(1),
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9]+$/),
  linkedin: z.string().url(),
  twitter: z.union([z.string().url(), z.literal('')]),
  resume: z.object({
    size: z.number().refine(val => val > 0, {message: "Must upload a resume"}),
    type: z.string(),
    name: z.string(),
    lastModified: z.number()
  }),
  industry: z.string().optional(),
});

export async function applyToMentor(previousState: any, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    initial: formData.get('Initial'),
    firstName: formData.get('First Name'),
    middleName: formData.get('Middle Name'),
    lastName: formData.get('Last Name'),
    email: formData.get('Email'),
    phone: formData.get('Phone'),
    linkedin: formData.get('Linkedin'),
    twitter: formData.get('Twitter'),
    resume: formData.get('Resume'),
    industry: formData.get('Industry')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to Submit Application.',
    };
  }

  const {initial, firstName, middleName, lastName, email, phone, linkedin, twitter, resume, industry} = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];

  try {
    const insertQuery = `INSERT INTO "mentors" ("mentors_initials", 
                                                "first_name", 
                                                "middle_name", 
                                                "last_name", 
                                                "mentor_email", 
                                                "mentor_phone", 
                                                "linkedin", 
                                                "mentor_twitter", 
                                                "resume", 
                                                "industry", 
                                                "date_submitted")
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
    const insertValues = [initial, firstName, middleName, lastName, email, phone, linkedin, twitter, resume, industry, date];
    await query(insertQuery, insertValues);
    
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Submit Application.',
    };
  }
  redirect('/engage/confirmation');
}
