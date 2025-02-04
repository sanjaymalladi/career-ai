"use client";

import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "~/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#000000]">
      {/* Header */}
      <nav className="bg-white dark:bg-black border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#000000] dark:text-[#FFFFFF]">
                CareerAI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}
    </div>
  );
} 