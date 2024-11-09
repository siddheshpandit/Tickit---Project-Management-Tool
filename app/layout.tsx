import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import {shadesOfPurple} from '@clerk/themes';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tickit",
  description: "A Project Management Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{baseTheme:shadesOfPurple,
      variables: {
        colorPrimary: '#3b82fc',
        colorBackground:'#1a202c',
        colorInputBackground:'#2d3748',
        colorInputText: '#F3F4F6',
      },
      elements:{
        formButtonPrimary:'text-white',
        card:'bg-gray-800'
      }
    }}>
    <html lang="en">
      <body className={`${inter.className} dotted-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header/>
          <main className="min-h-screen">{children}</main>
          <Toaster richColors/>
          <footer className="bg-gray-900 py-12">
            <div className="container mx-auto text-center text-grey-200 px-4">
              Made with ❤ By Siddhesh
            </div>
            </footer>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
