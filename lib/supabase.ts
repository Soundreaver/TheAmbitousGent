import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Only create client if we have valid credentials
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseInstance

// Export a function to create a new client instance
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.')
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Create admin client with service role key (bypasses RLS)
export function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase service role key not configured. Please set SUPABASE_SERVICE_ROLE_KEY in your .env.local file.')
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Check if Supabase is configured
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
