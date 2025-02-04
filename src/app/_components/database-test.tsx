"use client";

import { useEffect, useState } from "react";
import { supabasePublic } from "~/lib/supabase";
import type { Database } from "~/types/database.types";

type User = Database['public']['Tables']['users']['Row'];
type Resume = Database['public']['Tables']['resumes']['Row'];

export default function DatabaseTest() {
  const [users, setUsers] = useState<User[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch users
        const { data: userData, error: userError } = await supabasePublic
          .from('users')
          .select('*');

        if (userError) throw userError;
        setUsers(userData || []);

        // Fetch resumes
        const { data: resumeData, error: resumeError } = await supabasePublic
          .from('resumes')
          .select('*');

        if (resumeError) throw resumeError;
        setResumes(resumeData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Database Test</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Users</h3>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Resumes</h3>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(resumes, null, 2)}
        </pre>
      </div>
    </div>
  );
} 