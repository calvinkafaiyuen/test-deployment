import { z } from "zod";
import query from "@/app/lib/pgdb";

// Define the schema as before
const FormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9]+$/),
  linkedin: z.string().url(),
  bio: z.string(),
});

export async function applyToMentor(formData: FormData) {
  "use server";
  console.log("invest committee submisson in progress");
  let formObject = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    linkedin: formData.get("linkedin"),
    bio: formData.get("bio"),
  };
  const dateString = new Date().toISOString();
  // Validate the form data
  const validatedFields = FormSchema.safeParse(formObject);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to submit application.",
    };
  }
  // Proceed with the validated data
  try {
    console.log(formObject);
    await query(
      "INSERT INTO investment_committee (first_name, last_name, email, phone, middle_name, status, date_submitted) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        formObject.firstName,
        formObject.lastName,
        formObject.email,
        formObject.phone,
        " ",
        "pending",
        dateString,
      ]
    );
    console.log("Application submitted successfully.");
    return {
      message: "Application submitted successfully.",
    };
  } catch (error) {
    console.log("Database error: Failed to submit application");
    return {
      message: "Database error: Failed to submit application.",
    };
  }
}
