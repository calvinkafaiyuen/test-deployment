import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { Providers } from "./providers";
import { SessionProvider } from 'next-auth/react';
import { auth, signOut } from '@/auth';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.min.css";
import '@/public/css/ag-grid-custom-hatchery.css';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Hatchery Dashboard',
    default: 'Hatchery Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
    <html lang="en" className="light w-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>        
      <body className={`${inter.className} antialiased`}>
            <Providers>
              {children}
            </Providers>
          <div>
          {/* {session && (
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <button>Sign Out</button>
              <p></p>
            </form>
          )} */}
        </div>
        </body>
    </html>
    </SessionProvider>
  );
}
