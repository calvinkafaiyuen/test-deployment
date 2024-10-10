import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
// Define the structure of your expected request body using an interface
interface RequestBody {
    url: string;
    email: string;
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { url, email }: RequestBody =
            await request.json();

        const transporter = nodemailer.createTransport({
            service: "zoho",
            host: "smtpro.zoho.com",
            port: 465,
            secure: true,
            auth: {
                user: "jacky.hatchery@zohomail.com",
                pass: process.env.CONTACT_US_PASS,
            },
        });

        const mailOptions = {
            from: "jacky.hatchery@zohomail.com",
            to: email,
            subject: "UofT Hathcery - Reset Password Link",
            html: `
      <a href="https://"> url: ${url}</a>
      <a> Email: ${email}</a>`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: "Email sent successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: "Email send failed" }, { status: 500 });
    }
}
