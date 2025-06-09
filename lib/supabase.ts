import { createClient } from "@supabase/supabase-js"
import { env, validateEnv } from "./env"

// Singleton pattern for client-side Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const isEnvValid = validateEnv()
    if (!isEnvValid) {
      console.error("Environment variables missing, Supabase functionality will be limited")
      // Return a dummy client or handle this case appropriately
      return null as any
    }

    supabaseClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }
  return supabaseClient
}

export const supabase = getSupabaseClient()

// Types for our database
export interface UserProfile {
  id: string
  username: string | null
  created_at: string
  updated_at: string
  best_wpm: number
  avg_wpm: number
  total_tests: number
  sound_enabled: boolean
}

export interface TestResult {
  id?: string
  user_id: string
  wpm: number
  accuracy: number
  errors: number
  time_limit: number
  words_typed: number
  characters_typed: number
  test_mode: string
  created_at?: string
}
