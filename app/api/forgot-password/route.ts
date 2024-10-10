import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
import { generateJWTToken, generateResetPwdLink, sendResetPwdLink } from '@/app/lib/utils';
import query from "@/app/lib/pgdb";


export async function POST(request: Request) {
    const email = await request.json();

    // Check if the user exists in the User table
    const user = await query('select * from "User" where email = $1', [email]); //

    if (user.length == 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the user exists in the reset_password table
    const user_reset = await query('select * from "reset_password" where email = $1', [email]); //

    if (user_reset.length > 0) {
        return NextResponse.json({ error: 'Email already sent' }, { status: 404 });
    }

    // Generate a JWT token
    const resetToken = generateJWTToken({ email });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1); // Token expires in 24 hours

    // Store the token and email in a new table
    await query('insert into reset_password (email, token, "expiryDate") values($1, $2, $3)', [email, resetToken, expiryDate]);

    const reset_link = generateResetPwdLink(resetToken);
    // Send the reset password email to the user

    await sendResetPwdLink(reset_link, email);

    return NextResponse.json({ message: 'Reset password link sent to your email'}, { status: 200 });
}