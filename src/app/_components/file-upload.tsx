"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { supabasePublic } from "~/lib/supabase";

export function FileUpload() {
  const { userId } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || !e.target.files[0]) return;
      if (!userId) {
        alert("Please sign in to upload files");
        return;
      }

      const file = e.target.files[0];
      setUploading(true);

      // Upload file to Supabase storage
      const { data, error } = await supabasePublic.storage
        .from("files")
        .upload(`${userId}/${file.name}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicUrl } = supabasePublic.storage
        .from("files")
        .getPublicUrl(data.path);

      setUploadedUrl(publicUrl.publicUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </label>
      </div>

      {uploadedUrl && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <p>File uploaded successfully!</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            View uploaded file
          </a>
        </div>
      )}
    </div>
  );
} 