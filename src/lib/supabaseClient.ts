import { createClient } from "@supabase/supabase-js";

import { assertSupabaseEnv, env } from "./env";

export function createSupabaseClient() {
  assertSupabaseEnv();

  return createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    auth: {
      persistSession: false,
    },
  });
}
