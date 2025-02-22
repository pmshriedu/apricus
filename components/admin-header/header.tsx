// File: /components/Header.tsx (continued)
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-blue-500 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          MyApp
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </li>
          {session ? (
            <>
              <li>
                <Link href="/admin/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={() => signOut()} className="hover:underline">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/admin/login" className="hover:underline">
                Admin Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
