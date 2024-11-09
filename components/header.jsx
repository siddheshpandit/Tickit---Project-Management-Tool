import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import UserMenu from "./user-menu";
import UserLoading from "./user-loading";
import {checkUser} from "../lib/clerkUser"
const Header = async() => {

  await checkUser();
  return (
    <header>
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Tickit Logo"
            width={200}
            className="h-10 w-auto object-contain"
            height={300}
          />
        </Link>
        <div className="flex items-center gap-8">
          <Link href={"/project/create-project"}>
            <Button variant={"outline"}>
              <PenBox size={18}/>
              <span>Create Project</span>
            </Button>
          </Link>
          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
            <Button variant={"outline"}>Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
      <UserLoading/>
    </header>
  );
};

export default Header;
