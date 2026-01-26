"use client";
import {  SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import {Authenticated , Unauthenticated} from "convex/react"

const Header = () => {
  return (
    <>
      <nav className='fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-3xl z-20 border-b'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
            {/* {logo} */}
            <Link href={"/"} className='flex items-center'>
            <Image
            src="/logo.png"
            alt='logo-png'
            height={500}
            width={500}
            className="w-full h-11 rounded-2xl"
            priority
            />
            </Link>

            {/* {search bar and location for desktop} */}

            {/* {right side section} */}
            <div className='flex items-center'>
               <Authenticated>
                {/* create event */}
              <UserButton />
            </Authenticated> 
            
                 <Unauthenticated>
              <SignInButton mode='modal'>
                <Button size='sm'>Sign In</Button>
              </SignInButton>
              
            </Unauthenticated>

            </div>
        </div>
        {/* search and location for mobile only */}

      </nav>

      {/* Modals */}
    </>
  )
}

export default Header
