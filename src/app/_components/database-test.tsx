"use client";

import { useState, useEffect } from "react";
import { supabasePublic } from "~/lib/supabase";
import type { Database } from "~/types/database.types";

type Job = Database['public']['Tables']['jobs']['Row'];
type User = Database['public']['Tables']['users']['Row'];

export function DatabaseTest() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    console.log('Debug:', info);
    setDebugInfo(prev => [...prev, info]);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        addDebugInfo("Starting database queries...");

        // Query jobs table
        addDebugInfo("Querying jobs table...");
        const { data: jobsData, error: jobsError } = await supabasePublic
          .from('jobs')
          .select('*');

        if (jobsError) {
          addDebugInfo(`Jobs query error: ${jobsError.message}`);
          throw jobsError;
        }

        addDebugInfo(`Found ${jobsData.length} jobs`);
        setJobs(jobsData);

        // Query users table
        addDebugInfo("Querying users table...");
        const { data: usersData, error: usersError } = await supabasePublic
          .from('users')
          .select('*');

        if (usersError) {
          addDebugInfo(`Users query error: ${usersError.message}`);
          throw usersError;
        }

        addDebugInfo(`Found ${usersData.length} users`);
        setUsers(usersData);

      } catch (err) {
        console.error('Database query error:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        addDebugInfo(`Error caught: ${errorMessage}`);
        setError(errorMessage);
      }
    }

    void fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white/5 rounded-lg max-w-2xl w-full">
      <h2 className="text-xl font-bold">Database Tables</h2>
      
      {error && (
        <div className="text-red-400">
          Error: {error}
        </div>
      )}

      {jobs.length > 0 && (
        <div className="mt-4 w-full">
          <h3 className="font-semibold">Jobs:</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Skills Required</th>
                  <th className="text-left p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} className="border-b border-white/10">
                    <td className="p-2">{job.title}</td>
                    <td className="p-2">{job.skills_required}</td>
                    <td className="p-2 max-w-xs truncate">{job.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {users.length > 0 && (
        <div className="mt-4 w-full">
          <h3 className="font-semibold">Users:</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">LinkedIn</th>
                  <th className="text-left p-2">GitHub</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-white/10">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      {user.linkedin_url && (
                        <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          Profile
                        </a>
                      )}
                    </td>
                    <td className="p-2">
                      {user.github_url && (
                        <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          Profile
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4 w-full">
        <h3 className="font-semibold">Debug Log:</h3>
        <pre className="bg-black/30 p-4 rounded-lg text-sm overflow-x-auto">
          {debugInfo.map((info, i) => (
            <div key={i}>{info}</div>
          ))}
        </pre>
      </div>
    </div>
  );
} 