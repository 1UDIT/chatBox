'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';

function Navbar() {
  const { data: session } = useSession();
  const user: Session["user"] = session?.user;
  const router = useRouter();
  const username =
    user?.username ??
    user?.email?.split("@")[0];
  const pathname = usePathname();
  const isChatBox = pathname.startsWith('/chatBox/');
  const isDashboard = pathname.startsWith('/dashBoard/');
  console.log(pathname, "path")



  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>
        <span>Welcome, {username}</span>
        {session && username ? (
          <div className="flex gap-3 items-center">

            {/* 🔁 Toggle Buttons Based on Route */}
            {isChatBox && (
              <Button
                variant="outline"
                onClick={() => router.push(`/dashBoard/${username}`)}
                className='w-full md:w-auto bg-slate-100 text-black hover:cursor-pointer hover:bg-blue-300'
              >
                Console
              </Button>
            )}

            {isDashboard && (
              <Button
                variant="outline"
                onClick={() => router.push(`/chatBox/${username}`)}
                className='w-full md:w-auto bg-slate-100 text-black hover:cursor-pointer hover:bg-blue-300'
              >
                Feedback
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: '/Sign-in' })}
              className='w-full md:w-auto bg-slate-100 text-black hover:cursor-pointer  hover:bg-blue-300'
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/Sign-in">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;