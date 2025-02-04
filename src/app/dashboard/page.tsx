"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { FileIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { getUserProfile, updateUserProfile, uploadResume, getUserResumes } from "~/lib/supabase";
import type { Database } from "~/types/database.types";

type Resume = Database['public']['Tables']['resumes']['Row'];

// Server-side date formatting to prevent hydration mismatch
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(date));
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [formData, setFormData] = useState({
    linkedin_url: "",
    github_url: ""
  });

  useEffect(() => {
    if (isLoaded && user?.id) {
      void loadUserData();
    }
  }, [isLoaded, user?.id]);

  async function loadUserData() {
    try {
      setError(null);
      const [profile, userResumes] = await Promise.all([
        getUserProfile(user!.id),
        getUserResumes(user!.id)
      ]);

      if (profile) {
        setFormData({
          linkedin_url: profile.linkedin_url || "",
          github_url: profile.github_url || ""
        });
      }
      setResumes(userResumes);
    } catch (err) {
      console.error("Error loading user data:", err);
      setError(err instanceof Error ? err.message : "Failed to load user data");
    }
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      await updateUserProfile(user.id, formData, {
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress
      });
      // Reload user data to show updated values
      await loadUserData();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      alert(err instanceof Error ? err.message : "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file");
      e.target.value = "";
      setFile(null);
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("File size must be less than 10MB");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !user?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      await uploadResume(user.id, file);
      setFile(null);
      await loadUserData(); // Reload resumes
      // Reset file input
      const fileInput = document.getElementById("resume") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error("Error uploading resume:", err);
      setError(err instanceof Error ? err.message : "Failed to upload resume");
      alert(err instanceof Error ? err.message : "Failed to upload resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Get the latest ATS score
  const latestATSScore = resumes[0]?.ats_score || 0;

  // Don't render until user is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <div className="container py-8">
      {error && (
        <div className="mb-8 p-4 bg-destructive/15 text-destructive rounded-md">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile & Jobs */}
        <div className="space-y-8">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Links</CardTitle>
              <CardDescription>Connect your professional profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => 
                      setFormData({ ...formData, linkedin_url: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => 
                      setFormData({ ...formData, github_url: e.target.value })
                    }
                    placeholder="https://github.com/..."
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Resume & ATS Score */}
        <div className="lg:col-span-2 space-y-8">
          {/* ATS Score */}
          <Card>
            <CardHeader>
              <CardTitle>ATS Score</CardTitle>
              <CardDescription>Resume compatibility score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full max-w-xs">
                  <Progress value={latestATSScore} className="h-4" />
                </div>
                <p className="text-4xl font-bold text-primary">{latestATSScore}%</p>
                <p className="text-sm text-muted-foreground text-center">
                  Your resume is {latestATSScore >= 75 ? "well-optimized" : "needs improvement"} for ATS systems
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Resume Management</CardTitle>
              <CardDescription>Upload and manage your resumes</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resume">Upload Resume (PDF)</Label>
                  <Input
                    id="resume"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !file}
                >
                  {isLoading ? "Uploading..." : "Upload Resume"}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-semibold">Your Resumes</h3>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-4">
                    {resumes.map((resume) => (
                      <div
                        key={resume.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileIcon className="h-6 w-6 text-muted-foreground" />
                          <span className="ml-2 text-sm">
                            Resume {formatDate(resume.created_at)}
                          </span>
                        </div>
                        <Button 
                          asChild
                          className="text-sm"
                        >
                          <a
                            href={resume.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            View
                            <ExternalLinkIcon className="ml-1 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 