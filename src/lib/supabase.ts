import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create a single Supabase client for interacting with your database
export const supabasePublic = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // Don't persist as we're using Clerk for auth
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    db: {
      schema: 'public'
    }
  }
);

// Create a server-side client (only use in server components or API routes)
export const createServerSupabaseClient = () => createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// User profile functions
export async function updateUserProfile(userId: string, data: { 
  linkedin_url?: string; 
  github_url?: string;
}, clerkUser?: {
  name?: string | null;
  email?: string | null;
}) {
  try {
    // First check if user exists
    const { data: existingUser, error: checkError } = await supabasePublic
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // Ignore "not found" error
      console.error('Error checking user:', checkError);
      throw new Error(checkError.message);
    }

    const now = new Date().toISOString();
    
    if (!existingUser) {
      // Create new user if doesn't exist
      const { error: insertError } = await supabasePublic
        .from('users')
        .insert({
          id: userId,
          name: clerkUser?.name || null,
          email: clerkUser?.email || null,
          linkedin_url: data.linkedin_url || null,
          github_url: data.github_url || null,
          created_at: now,
          updated_at: now
        });

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        throw new Error(insertError.message);
      }
    } else {
      // Update existing user
      const updateData: Database['public']['Tables']['users']['Update'] = {
        linkedin_url: data.linkedin_url || null,
        github_url: data.github_url || null,
        updated_at: now
      };
      
      // Only include name and email in update if provided
      if (clerkUser?.name !== undefined) {
        updateData.name = clerkUser.name;
      }
      if (clerkUser?.email !== undefined) {
        updateData.email = clerkUser.email;
      }

      const { error: updateError } = await supabasePublic
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        throw new Error(updateError.message);
      }
    }
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabasePublic
      .from('users')
      .select('linkedin_url, github_url')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore "not found" error
      console.error('Error fetching profile:', error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error; // Propagate the original error
  }
}

// Resume functions
export async function uploadResume(userId: string, file: File) {
  try {
    // 1. Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    // 2. Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }

    // 3. Create a unique filename with user ID prefix
    const fileExt = file.name.split('.').pop();
    const uniqueId = Math.random().toString(36).substring(2);
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${userId}/${timestamp}-${sanitizedFileName}`;

    // 4. Upload file to Supabase Storage with retries
    let uploadError = null;
    let uploadData = null;
    const maxRetries = 3;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await supabasePublic.storage
          .from('resumes')
          .upload(filename, file, {
            cacheControl: '3600',
            contentType: 'application/pdf',
            upsert: false
          });
        
        uploadError = result.error;
        uploadData = result.data;
        
        if (!uploadError) break;
        
        // If error is not permission-related, break the retry loop
        if (!uploadError.message.includes('security')) break;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      } catch (err) {
        uploadError = err;
      }
    }

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    if (!uploadData?.path) {
      throw new Error('Upload successful but file path is missing');
    }

    // 5. Get the public URL
    const { data: { publicUrl } } = supabasePublic.storage
      .from('resumes')
      .getPublicUrl(uploadData.path);

    // 6. Create resume record in the database
    const { data: resumeData, error: dbError } = await supabasePublic
      .from('resumes')
      .insert([
        {
          user_id: userId,
          file_url: publicUrl,
          file_path: uploadData.path,
          ats_score: 0,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (dbError) {
      // If database insert fails, try to clean up the uploaded file
      await supabasePublic.storage
        .from('resumes')
        .remove([uploadData.path])
        .catch(console.error);

      console.error('Error creating resume record:', dbError);
      throw new Error(dbError.message);
    }

    if (!resumeData) {
      throw new Error('Resume record created but data is missing');
    }

    return resumeData;
  } catch (error) {
    console.error('Error in uploadResume:', error);
    throw error instanceof Error ? error : new Error('Failed to upload resume');
  }
}

export async function getUserResumes(userId: string) {
  try {
    const { data, error } = await supabasePublic
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resumes:', error);
      throw new Error(error.message);
    }
    return data || [];
  } catch (error) {
    console.error('Error in getUserResumes:', error);
    throw error; // Propagate the original error
  }
}

export async function updateResumeATSScore(resumeId: string, score: number) {
  const { error } = await supabasePublic
    .from('resumes')
    .update({ 
      ats_score: score,
      updated_at: new Date().toISOString()
    })
    .eq('id', resumeId);

  if (error) {
    console.error('Error updating ATS score:', error);
    throw new Error('Failed to update ATS score');
  }
} 