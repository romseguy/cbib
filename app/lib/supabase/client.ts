import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient;

export default () => {
  if (!client)
    client = createClient(
      `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co`,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
    );
  return client;
};
