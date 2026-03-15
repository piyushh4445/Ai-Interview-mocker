"use client"
import { UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import Link from "next/link"

function Header() {

  const path = usePathname();

  useEffect(() => {
    console.log(path)
  }, [])

  return (
    <div className='flex h-16 px-6 items-center justify-between bg-secondary shadow-sm'>

      {/* LOGO */}
      <Image src={'/logo.svg'} width={200} height={200} alt='logo'/>

      {/* NAVIGATION */}
      <ul className='hidden md:flex gap-6'>

        <li className={`hover:text-purple-700 hover:font-bold transition-all cursor-pointer ${path === "/" && "text-purple-700 font-bold"}`}>
          <Link href="/">
            Home
          </Link>
        </li>

        <li className={`hover:text-purple-700 hover:font-bold transition-all cursor-pointer ${path === '/dashboard' && 'text-purple-700 font-bold'}`}>
          <Link href="/dashboard">
            Dashboard
          </Link>
        </li>

        <li className={`hover:text-purple-700 hover:font-bold transition-all cursor-pointer ${path === "/how-it-works" && "text-purple-700 font-bold"}`}>
          <Link href="/how-it-works">
            How it works
          </Link>
        </li>

        <li className={`hover:text-purple-700 hover:font-bold transition-all cursor-pointer ${path === '/dashboard/upgrade' && 'text-purple-700 font-bold'}`}>
          <Link href="/dashboard/upgrade">
            Upgrade
          </Link>
        </li>

        <li className={`hover:text-purple-700 hover:font-bold transition-all cursor-pointer ${path === "/about-us" && "text-purple-700 font-bold"}`}>
          <Link href="/about-us">
            About us
          </Link>
        </li>

      </ul>


      {/* AUTH BUTTON */}
      <div>

        {/* If user NOT logged in */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        {/* If user logged in */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

      </div>

    </div>
  )
}

export default Header