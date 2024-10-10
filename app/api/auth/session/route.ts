import { auth } from '@/auth';
import { NextResponse } from "next/server";

//must force
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await auth();
  
        if (session) {
            // If there is a session, return it in the response body as JSON
            // Create a new response with JSON.stringify(session) as the body
            const responseBody = JSON.stringify(session);
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
