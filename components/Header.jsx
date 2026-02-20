"use client";
import {  SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import {Authenticated , Unauthenticated} from "convex/react"
import {BarLoader} from "react-spinners"
import { useStoreUserEffect } from '@/hooks/useStoreUserEffect';
import { Building, Plus, Ticket } from 'lucide-react';
import { OnBoardingModal } from './OnBoardingModal';
import { useOnboarding } from '@/hooks/use-onboarding';
import SearchLocationBar from './SearchLocationBar';

const Header = () => {

  const {isLoading} = useStoreUserEffect();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const {showOnboarding,handleOnboardingComplete,handleOnboardingSkip} = useOnboarding();

  return (
    <>
      <nav className='fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-3xl z-20 border-b'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
            {/* {logo} */}
            <Link href="/" className="flex items-center">
            <Image
             src="/logo6.png"
             alt="Evenza Logo"
             width={250}
             height={200}
             className="h-13 w-auto md:h-20 transition-all duration-300 hover:scale-110 rounded-2xl"
             />
           </Link>

            {/* {search bar and location for desktop} */}

            <div className="hidden md:flex flex-1 justify-center">
                  <SearchLocationBar />
            </div>

            {/* {right side section} */}
            <div className='flex items-center'>
                {/* create event */}
                <Button variant='ghost' size='sm' onClick={() => setShowUpgradeModal(true)}>Pricing</Button>
                <Button variant='ghost' size='sm' asChild className={'mr-2'}>
                  <Link href={'/explore'}>Explore</Link>
                </Button>
               <Authenticated>
                <Button size='sm' asChild className={'flex gap-2 mr-4'}>
                  <Link href={'/create-event'}>
                  <Plus className='w-4 h-4'/>
                  <span className='hidden sm:inline'>Create Event</span>
                  </Link>
                </Button>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                  label='My Tickets'
                  labelIcon={<Ticket size={16} />}
                  href='/my-tickets'
                  />
                  <UserButton.Link
                  label='My Events'
                  labelIcon={<Building size={16} />}
                  href='/my-events'
                  />
                  <UserButton.Action label='Manage-Account'/>
                </UserButton.MenuItems>
              </UserButton>
            </Authenticated> 
            
                 <Unauthenticated>
              <SignInButton mode='modal'>
                <Button size='sm'>Sign In</Button>
              </SignInButton>
              
            </Unauthenticated>

            </div>
          
        </div>

        {/* search and location for mobile only */}

           <div className="md:hidden border-t px-3 py-3">
                  <SearchLocationBar />
            </div>

        {/* Loader */}
       { isLoading && <div className='absolute bottom-0 left-0 w-full'>
            <BarLoader width={'100%'} color='#a855f7' />
        </div>
        }
      </nav>

      {/* Modals */}
        <OnBoardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingSkip}
        onComplete={handleOnboardingComplete}
        />
    </>
  )
}

export default Header
