import { createClient as createServerClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const createClient = () => {
  return createServerClient<Database>(supabaseUrl || "", supabaseAnonKey || "")
}

export { createClient }
