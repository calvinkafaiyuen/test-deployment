import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.zohocloud.ca",
    port: 465,
    secure: true,
    auth: {
      user: "ethan.hatchery@zohomailcloud.ca",
      pass: process.env.CONTACT_US_PASS,
    },
  });

export const sendEmail = async(mailOptions: nodemailer.SendMailOptions) => {
    try {
        await transporter.sendMail(mailOptions)
        console.log("email sent successfully");
    }
    catch (error) {
        console.log("email send failed", error);
        throw error;
    }
}