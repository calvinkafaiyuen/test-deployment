import NextAuth, { type Session }  from "next-auth";
import {authConfig} from "./auth.config"
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from "./app/lib/db"
import { getUserByEmail } from "@/app/lib/user"
import { type JWT } from 'next-auth/jwt';


declare module "next-auth" {
  export interface User {
    role?: string,
  }
  export interface Session {
    accessToken?: any,
  }
}

export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  callbacks: {
    async signIn({user, account}) {
      //here we can have a api check if user is verified or not.
      //If not verified => return false
      //Else return => true
      console.log('something')
      if(user && user.role === 'admin') return true;
      return true;
    },
    async jwt({ token }) {
      if(token.email){
        const dbUser = await getUserByEmail(token?.email);
        console.log('dbUser', dbUser);
        if (!dbUser) return token;

        token.name = dbUser.name;
        token.email = dbUser.email;
        token.image = dbUser.image;
        token.role = dbUser.role;
      }
      // console.log('token:', token)
      return token;
    },
    async session({ token, session }: { token?: JWT; session: Session }) {
      console.log('Inside token', token);
      console.log('Inside session', session);

      if (token && session.user) { // Ensure token is not undefined
        if (token.sub) {
          session.user.id = token.sub;
        } 
    
        if (token.email) {
          session.user.email = token.email;
        }
    
        // Use optional chaining for properties that might not be defined on token
        session.user.name = token.name ?? session.user.name; // Fallback to existing session.user.name if token.name is undefined
        session.user.image = token.picture ?? session.user.image; // Fallback to existing session.user.image if token.picture is undefined
        session.user.role = token.role ?? session.user.role;
        session.accessToken = token;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt'},
  ...authConfig
})
