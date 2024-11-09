"use client"
import { OrganizationSwitcher, SignedIn } from '@clerk/clerk-react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import React from 'react'

const OrgSwitcher = () => {
    const {isLoaded} = useOrganization();
    const {isLoaded:isUserLoaded} = useUser();
    const pathname = usePathname();
    if(!isLoaded || !isUserLoaded){
        return null;
    }
  return (
    <div>
        <SignedIn>
            <OrganizationSwitcher
            hidePersonal
            afterSelectOrganizationUrl={"/organization/:slug"}
            afterCreateOrganizationUrl={"/organization/:slug"}
            createOrganizationMode={
                pathname==='/onboarding'?'navigation':'modal'
            }
            createOrganizationUrl='/onboarding'
            appearance={{
                elements:{
                    organizationSwitcherTrigger:"border border-gray-300 rounded-md px-5 py-2",
                    organizationSwitcherTriggerIcon:"text-white"
                }
            }
            }
            />
        </SignedIn>
    </div>
  )
}

export default OrgSwitcher;