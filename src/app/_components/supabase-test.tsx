"use client";

import { useState, useEffect } from "react";
import { supabasePublic } from "~/lib/supabase";

export function SupabaseTest() {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    console.log('Debug:', info);
    setDebugInfo(prev => [...prev, info]);
  };

  useEffect(() => {
    async function testSupabase() {
      try {
        addDebugInfo("Starting Supabase test...");

        // Test 1: List buckets
        addDebugInfo("Attempting to list buckets...");
        const { data: bucketsData, error: bucketsError } = await supabasePublic
          .storage
          .listBuckets();

        if (bucketsError) {
          addDebugInfo(`Bucket list error: ${bucketsError.message}`);
          throw bucketsError;
        }

        addDebugInfo(`Found ${bucketsData.length} buckets`);
        setBuckets(bucketsData.map(b => b.name));

        // Test 2: Try to create a test file
        const testBucket = bucketsData[0]?.name;
        if (!testBucket) {
          const noBucketsError = "No storage buckets found. Please create a bucket in your Supabase dashboard.";
          addDebugInfo(noBucketsError);
          setError(noBucketsError);
          return;
        }

        addDebugInfo(`Attempting to upload test file to bucket: ${testBucket}`);
        const { error: uploadError } = await supabasePublic
          .storage
          .from(testBucket)
          .upload('test.txt', new Blob(['test content']), {
            upsert: true
          });

        if (uploadError) {
          addDebugInfo(`Upload error: ${uploadError.message}`);
          throw uploadError;
        }

        addDebugInfo("File upload successful!");
        setTestResult("✅ Supabase storage is working correctly!");
      } catch (err) {
        console.error('Supabase test error:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        addDebugInfo(`Error caught: ${errorMessage}`);
        setError(errorMessage);
      }
    }

    void testSupabase();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white/5 rounded-lg max-w-2xl w-full">
      <h2 className="text-xl font-bold">Supabase Storage Test</h2>
      
      {error ? (
        <div className="text-red-400">
          Error: {error}
        </div>
      ) : testResult ? (
        <div className="text-green-400">
          {testResult}
        </div>
      ) : (
        <div className="text-yellow-400">
          Testing Supabase connection...
        </div>
      )}

      {buckets.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Available buckets:</h3>
          <ul className="list-disc list-inside">
            {buckets.map(bucket => (
              <li key={bucket}>{bucket}</li>
            ))}
          </ul>
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