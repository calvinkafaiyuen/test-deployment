'use client';

import { lusitana } from '@/app/ui/fonts';
import {redirect, useSearchParams} from 'next/navigation';
import { Image} from "@nextui-org/react";
import { useSession } from 'next-auth/react';



import {
    KeyIcon,
    ExclamationCircleIcon,
    FaceSmileIcon
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormStatus } from 'react-dom';
import {useState} from "react";
import * as bcrypt from 'bcrypt-ts';

export default function ResetPasswordForm() {
    const { data: session } = useSession();
    if(session) redirect('/');
    const searchParams = useSearchParams();
    const token = searchParams.get('token');


    const [errorMessage, setErrorMessage] = useState('');
    const [pending, setPending] = useState(false);
    const [successMessage, setSuccessMessage] = useState('')
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        setErrorMessage('');

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setPending(false);
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password: hashedPassword }),
            });
            console.log(response)
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
            setErrorMessage(error.name.toString() + ' and ' + error.message.toString());
        } finally {
            setPending(false);
        }
    };

    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative items-center mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <a className="w-full flex justify-center" href="/">
                    <Image
                        src="/webpeditor_hatchery_rect.webp"
                        width={300}
                        height={200}
                        className="md:block mb-4"
                        alt="Hatchery Logo"
                    />
                </a>
                <form onSubmit={handleSubmit} className="w-full space-y-3">
                    <div className="flex-1 rounded-lg px-6 pb-4 pt-8">
                        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                            Reset Password.
                        </h1>
                        <p className="mb-3 block text-xs font-medium text-gray-900">Please enter your new password below.</p>
                        <div className="w-full">
                            <div>
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                    htmlFor="newpwd"
                                >
                                    NewPassword
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        id="newpwd"
                                        name="newpwd"
                                        placeholder="Enter your new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />                                </div>
                                <div>

                                </div>
                                <div className="relative mt-2">
                                    <input
                                        type="password"
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        id="newpwd_re"
                                        name="newpwd_re"
                                        placeholder="Re-enter your new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    {/* You can add error handling here if needed */}
                                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>

                            </div>
                            {/*<a href="/signin" className="mb-3 mt-5 block text-xs font-medium text-blue-600 hover:underline">Already have an account?</a>*/}

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
            Submit <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    );
}
