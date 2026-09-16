// Optional Vite environment overrides support local Supabase and staging.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://rpkttbmlvjshkbjrmnvo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwa3R0Ym1sdmpzaGtianJtbnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NjI5NjYsImV4cCI6MjA2NDMzODk2Nn0.XXe7sV_k3ngs4sjwWL8Y2LeBakCfxT8ByRXrLsQ-8Kg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
