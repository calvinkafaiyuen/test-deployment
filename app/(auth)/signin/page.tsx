import SigninForm from '@/app/ui/signin-form'; 
import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Image} from "@nextui-org/react";

 
export const metadata: Metadata = {
    title: 'Sign In',
};

export default async function SigninPage() {
  const session = await auth();
  if(session) redirect('/redirect');
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative items-center mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
          <div className="text-white">
            <a href="/">
              <Image
                  src="/webpeditor_hatchery_rect.webp"
                  width={300}
                  height={200}
                  className="md:block mb-4"
                  alt="Hatchery Logo"
              />
            </a>
          </div>
        <SigninForm />
      </div>
    </main>
  );
}