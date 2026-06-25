export type DataMode = "mock" | "supabase";

type ViteEnv = {
  VITE_DATA_MODE?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

const viteEnv = (import.meta as ImportMeta & { env: ViteEnv }).env;
const dataMode = (viteEnv.VITE_DATA_MODE ?? "supabase") as DataMode;

export const env = {
  supabaseUrl: viteEnv.VITE_SUPABASE_URL,
  supabaseAnonKey: viteEnv.VITE_SUPABASE_ANON_KEY,
  dataMode,
};

export function assertSupabaseEnv(): void {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  }
}
