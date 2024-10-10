import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { sendEmail } from "@/app/lib/services/email/emailService";
// Define the structure of your expected request body using an interface
interface RequestBody {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { first_name, last_name, email, phone, message }: RequestBody =
      await request.json();

    const mailOptions = {
      from: "ethan.hatchery@zohomailcloud.ca",
      to: "ethan.stmp.hatchery@gmail.com",
      subject: "UofT Hatchery Contacts Us Form Submission",
      html: `
      <li> Name: ${first_name + last_name}</li>
      <li> Email: ${email}</li>
      <li> Phone : ${phone}</li>
      <li>Message: ${message}</li>`,
    };

    await sendEmail(mailOptions);
    
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Email send failed" }, { status: 500 });
  }
}
