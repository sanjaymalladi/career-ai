"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabasePublic } from "~/lib/supabase";

export default function ResumePage() {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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

    setIsUploading(true);
    try {
      // Upload file to Supabase Storage
      const filename = `${user.id}-${Date.now()}.pdf`;
      const { error: uploadError } = await supabasePublic.storage
        .from("resumes")
        .upload(filename, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabasePublic.storage
        .from("resumes")
        .getPublicUrl(filename);

      // Save resume record in the database
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
      // Reset file input
      const fileInput = document.getElementById("resume") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Error uploading resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-medium text-gray-900 dark:text-white">Resume</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload your resume in PDF format.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Resume (PDF)
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  name="resume"
                  id="resume"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-indigo-50 file:text-indigo-700
                    dark:file:bg-indigo-900 dark:file:text-indigo-300
                    hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Please upload your resume in PDF format only.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading || !file}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 