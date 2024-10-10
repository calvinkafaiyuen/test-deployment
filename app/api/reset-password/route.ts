import { NextResponse } from 'next/server';
import query from "@/app/lib/pgdb";


export async function POST(req: Request) {
    const body = await req.json();
    const { token, password } = body;
    let isValid = false;
    let errorMessage = '';

    try {
        // Check if token expired
        const expDateResult = await query(
            'SELECT "expiryDate", email FROM reset_password WHERE token = $1',
            [token]
        );

        if (expDateResult.length > 0) { // Check if rows were returned
            const expiryDateString = expDateResult[0].expiryDate;
            const email = expDateResult[0].email;

            if (expiryDateString !== null) {
                const expiryDate = new Date(expiryDateString);
                const currentDate = new Date();

                // Compare expiryDate to currentDate
                if (expiryDate >= currentDate) {
                    isValid = true;
                    if (isValid) {
                        try {
                            await query(
                                'UPDATE "User" SET password = $1 WHERE email = $2',
                                [password, email]
                            );
                            await query(
                                'DELETE FROM reset_password WHERE email = $1',
                                [email]
                            );
                            // delete the token from reset_password table
                        } catch (updateError) {
                            console.error('Error updating password:', updateError);
                            errorMessage = 'Internal Server Error';
                            return NextResponse.json({ error: errorMessage }, { status: 500 });
                        }
                    }
                } else {
                    errorMessage = 'Token Expired';
                }
            } else {
                errorMessage = 'Invalid Token Data';
            }

        } else {
            errorMessage = 'User not found';
        }

    } catch (error) {
        console.error('Error fetching token expiry data:', error);
        errorMessage = 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, {status: 500});
    }

    if (isValid) {
        return NextResponse.json({ message: 'Successfully reset the password' }, { status: 200 });
    } else {
        return NextResponse.json({ error: errorMessage }, { status: 401 }); // 401 Unauthorized
    }
}