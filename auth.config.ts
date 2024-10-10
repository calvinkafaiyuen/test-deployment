import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "@/app/lib/user";
import { compare } from 'bcrypt-ts';
import { z } from 'zod';



export const authConfig =  {
  providers: [
    Credentials({
      async authorize(credentials) {
        const token = credentials.token
        const LoginSchema = z.object({
          email: z.string().email({
            message: 'Email is required'
          }),
          password: z.string().min(1, {
            message: 'Password is required'
          })
        })

        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await compare(
            password,
            user.password,
          );
          // console.log('passwordsMatch', passwordsMatch)

          // console.log('user', user)
          if (passwordsMatch) return { email: user.email, name: user.name, role: user.role, image: user.image, accessToken:token } as any;
          return false;
        }
      }
    })
  ]
} satisfies NextAuthConfig