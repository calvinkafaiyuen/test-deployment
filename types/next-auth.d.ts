import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string;
      email?: string;
      id?: int;
      name?: string;
      image?: string;
    }
  }
}

declare module 'next-auth' {
  interface User {
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user:{
      role?:string;
    }
    role?: string;
  }
}
