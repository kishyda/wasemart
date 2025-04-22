'use client';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Header({session}:{session:Session}) {
    return (
        <header className="border-b bg-red-600 p-4 flex items-center justify-between">
            <Link
            className="text-white font-bold text-2xl"
            href="/">
                Wase-Mart
            </Link>
            <nav className="flex gap-4 *:rounded">
                <Link href="/new" className="border border-blue-600 bg-white text-blue-600 inline-flex gap-1 items-center px-2 mr-4">
                    <FontAwesomeIcon icon={faPlus} className="h-4"/>
                    <span>Post an ad</span>
                </Link>
                <span className="border-r"></span>
                {!session?.user && (
                    <>
                        <button className="border-0 text-white px-2">Sign up</button>
                        <button 
                            onClick={() => signIn('google')}
                            className="bg-blue-600 text-white border-0 px-4">
                            Login
                        </button>
                    </>
                )}
                {session?.user && (
                    <>
                        {<button 
                            onClick={() => signOut()}
                            className="mx-4 border-0 text-white px-2">
                            Logout
                        </button>}
                        <Link href={'/account'}>
                        <Image src={session.user.image as string} alt={'avatar'} width={34} height={34}
                        className="rounded-md"
                        />
                        </Link>
                    </>
                )
            }
            </nav>
        </header>
    );
}