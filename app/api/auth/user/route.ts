import { createUserByEmail, getUserByEmail } from '@/app/lib/user';
import { NextResponse } from "next/server";


// Define the structure of your expected request body using an interface
interface RequestBody {
  email: string;
  password: string;
  name: string;
  image: string;
  role: string;
}

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { email, password, name, image, role }: RequestBody = await req.json();

      // If email already exist
      const exist = await getUserByEmail(email);
      if(exist) return new NextResponse(JSON.stringify({ success: false, error: 'Email already exists' }), { status: 409 });


      // Create the user
      const user = await createUserByEmail(email, password, name, image, role);
      return new NextResponse(JSON.stringify({ success: true, user }), { status: 201 });
    } catch (error) {
      console.error('Error creating user:', error);
      // In case of an error, return a 500 Internal Server Error
      return new NextResponse(JSON.stringify({ success: false, error: 'Error creating user' }), { status: 500 });
    }
  } else {
    // Method not allowed
    return new NextResponse(JSON.stringify({ success: false, error: 'Method not allowedsss' }), { status: 405 });
  }
}
