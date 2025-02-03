"use client";

import { SignIn } from "@clerk/nextjs";
import { ThemeToggle } from "~/components/theme-toggle";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            CareerAI
          </h1>
          <p className="text-muted-foreground">
            Sign in to manage your career journey
          </p>
        </div>
        <SignIn 
          routing="hash"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card shadow-md border border-border",
              headerTitle: "text-card-foreground",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              socialButtonsBlockButton: "bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border",
              formFieldLabel: "text-muted-foreground",
              formFieldInput: "bg-input border-input text-foreground",
              footerActionText: "text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary/90",
              dividerText: "text-muted-foreground",
              formFieldInputShowPasswordButton: "text-muted-foreground"
            }
          }}
          redirectUrl="/dashboard"
          afterSignInUrl="/dashboard"
        />
      </div>
    </main>
  );
} 