"use client";

import { SignIn } from "@clerk/nextjs";
import { ThemeToggle } from "~/components/theme-toggle";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFFFFF] dark:bg-[#000000]">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#000000] dark:text-[#FFFFFF] mb-2">
            CareerAI
          </h1>
          <p className="text-[#71717A] dark:text-[#A1A1AA]">
            Sign in to manage your career journey
          </p>
        </div>
        <SignIn 
          routing="hash"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-[#FFFFFF] dark:bg-[#000000] shadow-md border border-[#E4E4E7] dark:border-[#27272A]",
              headerTitle: "text-[#000000] dark:text-[#FFFFFF]",
              headerSubtitle: "text-[#71717A] dark:text-[#A1A1AA]",
              formButtonPrimary: "bg-[#000000] hover:bg-[#27272A] dark:bg-[#FFFFFF] dark:hover:bg-[#E4E4E7] text-[#FFFFFF] dark:text-[#000000]",
              socialButtonsBlockButton: "bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-[#E4E4E7] dark:hover:bg-[#3F3F46] text-[#000000] dark:text-[#FFFFFF] border-[#E4E4E7] dark:border-[#3F3F46]",
              formFieldLabel: "text-[#71717A] dark:text-[#A1A1AA]",
              formFieldInput: "bg-[#FFFFFF] dark:bg-[#18181B] border-[#E4E4E7] dark:border-[#27272A] text-[#000000] dark:text-[#FFFFFF]",
              footerActionText: "text-[#71717A] dark:text-[#A1A1AA]",
              footerActionLink: "text-[#000000] dark:text-[#FFFFFF] hover:text-[#27272A] dark:hover:text-[#E4E4E7]",
              dividerText: "text-[#71717A] dark:text-[#A1A1AA]",
              formFieldInputShowPasswordButton: "text-[#71717A] dark:text-[#A1A1AA]",
              footer: "bg-[#FFFFFF] dark:bg-[#000000] border-t border-[#E4E4E7] dark:border-[#27272A]",
              card__main: "bg-[#FFFFFF] dark:bg-[#000000]",
              otherMethods: "bg-[#FFFFFF] dark:bg-[#000000]",
              identityPreview: "bg-[#FFFFFF] dark:bg-[#000000]",
              formFieldInput__identifier: "bg-[#FFFFFF] dark:bg-[#18181B]",
              alert: "bg-[#FFFFFF] dark:bg-[#000000] border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA]",
              alertText: "text-[#71717A] dark:text-[#A1A1AA]",
              identityPreviewText: "text-[#71717A] dark:text-[#A1A1AA]",
              identityPreviewEditButton: "text-[#000000] dark:text-[#FFFFFF] hover:text-[#27272A] dark:hover:text-[#E4E4E7]"
            },
            variables: {
              colorBackground: "#FFFFFF",
              colorInputBackground: "#FFFFFF",
              colorInputText: "#000000",
              colorTextOnPrimaryBackground: "#FFFFFF",
              colorTextSecondary: "#71717A",
              colorPrimary: "#000000",
              colorDanger: "#EF4444",
              colorSuccess: "#10B981"
            }
          }}
          redirectUrl="/dashboard"
          afterSignInUrl="/dashboard"
        />
      </div>
    </main>
  );
} 