import { createClient } from "@supabase/supabase-js"
import { env, validateEnv } from "./env"

const isEnvValid = validateEnv()
if (!isEnvValid) {
  console.error("Environment variables missing, Supabase server functionality will be limited")
}

export const supabaseServer = isEnvValid
  ? createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  : (null as any)
