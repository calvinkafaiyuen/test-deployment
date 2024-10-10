import { auth } from "@/auth";
import { NextResponse } from "next/server";
import query from "@/app/lib/pgdb";

//Must force
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await auth();
  
        if (session?.user?.role == 'admin') {

            const students = await query(`SELECT * FROM students`);

            const responseBody = JSON.stringify(students);
            return new NextResponse(responseBody, {
                status: 200,
                // Set appropriate headers for JSON response
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            // If there is no session, return a 403 Forbidden status code
            return new NextResponse(null, { status: 403 });
        }
    } catch (error) {
        console.error('Error fetching session:', error);
        // In case of an error, return a 500 Internal Server Error
        return new NextResponse(null, { status: 500 });
    }
}
