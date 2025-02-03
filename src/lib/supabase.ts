import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";

// Create a client for public usage (with anon key)
export const supabasePublic = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create a server-side client (only use in server components or API routes)
export const createServerSupabaseClient = () => createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
); 