"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabasePublic } from "~/lib/supabase";
import type { Database } from "~/lib/database.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { FileIcon, ExternalLinkIcon } from "@radix-ui/react-icons";

type Job = Database["public"]["Tables"]["jobs"]["Row"];
type Resume = Database["public"]["Tables"]["resumes"]["Row"];

export default function DashboardPage() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [atsScore, setAtsScore] = useState(75); // Placeholder score
  const [formData, setFormData] = useState({
    linkedin_url: "",
    github_url: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchJobs();
    fetchResumes();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabasePublic
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          linkedin_url: data.linkedin_url || "",
          github_url: data.github_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabasePublic
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchResumes = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabasePublic
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabasePublic
        .from("users")
        .upsert({
          id: user.id,
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
        });

      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        alert("Please select a PDF file");
        e.target.value = "";
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) return;

    setIsLoading(true);
    try {
      const filename = `${user.id}-${Date.now()}.pdf`;
      const { error: uploadError } = await supabasePublic.storage
        .from("resumes")
        .upload(filename, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabasePublic.storage
        .from("resumes")
        .getPublicUrl(filename);

      const { error: dbError } = await supabasePublic
        .from("resumes")
        .insert({
          user_id: user.id,
          file_path: filename,
          public_url: publicUrl,
        });

      if (dbError) throw dbError;

      alert("Resume uploaded successfully!");
      setFile(null);
      fetchResumes();
      const fileInput = document.getElementById("resume") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Error uploading resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
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

            {/* Recent Jobs Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>Latest job opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <Card key={job.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {job.company} • {job.location}
                              </p>
                            </div>
                            {job.salary_range && (
                              <Badge>
                                {job.salary_range}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {job.description}
                          </p>
                          <Button 
                            className="mt-2 p-0 h-auto"
                            asChild
                          >
                            <a
                              href={job.application_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              Apply Now
                              <ExternalLinkIcon className="ml-1 h-4 w-4" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
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
                    <Progress value={atsScore} className="h-4" />
                  </div>
                  <p className="text-4xl font-bold text-primary">{atsScore}%</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Your resume is {atsScore >= 75 ? "well-optimized" : "needs improvement"} for ATS systems
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
                              Resume {new Date(resume.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <Button 
                            asChild
                            className="text-sm"
                          >
                            <a
                              href={resume.public_url}
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
    </div>
  );
} 