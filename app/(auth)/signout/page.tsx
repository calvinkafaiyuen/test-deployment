import { Metadata } from 'next';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { Image} from "@nextui-org/react";

export const metadata: Metadata = {
    title: 'The Entrepreneurship Hatchery - Sign Out',
};

export default async function Page() {
    const session = await auth();
    if(!session) redirect('/');
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <a href="/">
        <Image
            src="/webpeditor_hatchery_rect.webp"
            width={300}
            height={200}
            className="md:block mb-4"
            alt="Hatchery Logo"
        />
      </a>
      <form
            action={async () => {
            'use server';
            await signOut();
            }}
        >
            <h6 className="text-lg font-bold dark:text-white pb-2">Are you sure you want to sign out?</h6>
            <button color="primary" className="m-2 hover:text-blue-600 underline">Yes</button> | 
            <a href="/redirect" className="text-sm m-2 hover:text-blue-600 underline">No, I want to go back to previous page.</a>
        </form>
    </main>
  );
}