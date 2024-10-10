'use client';
 
import { lusitana } from '@/app/ui/fonts';
import { redirect } from 'next/navigation';
import { Image} from "@nextui-org/react";
import { useSession } from 'next-auth/react';



import {
  AtSymbolIcon,
  ExclamationCircleIcon,
    FaceSmileIcon
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormStatus } from 'react-dom';
import {useState} from "react";

export default function ForgotPasswordForm() {
  const { data: session } = useSession();
  if(session) redirect('/');
  

    const [errorMessage, setErrorMessage] = useState('');
    const [pending, setPending] = useState(false);
    const [successMessage, setSuccessMessage] = useState('')
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        setErrorMessage('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email')?.toString();

        if (!email) {
            setErrorMessage('Please enter a valid email address');
            setPending(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(email),
            });
            // console.log(response)
            if (response.ok) {
                // Handle success case
                // Create a link and send an email to the user
                const success = await response.json();
                setSuccessMessage(success.message.toString());
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error.toString() );
            }
            //@ts-ignore
        } catch (error : DOMException) {
            setErrorMessage(error.name.toString() + ' and ' + error.message.toString()); // 'An unkown error occurred'
        } finally {
            setPending(false);
        }
    };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative items-center mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
      <a href="/">
        <Image
            src="/webpeditor_hatchery_rect.webp"
            width={300}
            height={200}
            className="md:block mb-4"
            alt="Hatchery Logo"
        />
      </a>
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex-1 rounded-lg px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                Forgot password?
                </h1>
                <p className="mb-3 block text-xs font-medium text-gray-900">Please enter your email to receive reset password link.</p>
                <div className="w-full">
                <div>
                    <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="email"
                    >
                    Email
                    </label>
                    <div className="relative">
                    <input
                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        required
                    />
                    <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                </div>
                <a href="/signin" className="mb-3 mt-5 block text-xs font-medium text-blue-600 hover:underline">Already have an account?</a>

                </div>
                <LoginButton />
                <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
                >
                {errorMessage && (
                    <>
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                )}
                </div>
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {successMessage && (
                        <>
                            <FaceSmileIcon className="h-5 w-5 text-green-500" />
                            <p className="text-sm text-green-500">{successMessage}</p>
                        </>
                    )}
                </div>
                <div className="flex h-8 items-end space-x-1">
                {/* Add form errors here */}
                </div>
            </div>
        </form>
      </div>
    </main>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
 
  return (
    <Button className="mt-4 w-full" aria-disabled={pending} type="submit">
      Send link <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
