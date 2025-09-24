import { createBrowserClient as cbc } from "@supabase/ssr";

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_ID;

  if (!url || !key) {
    throw new Error("MISSING_SUPABASE_URL_OR_KEY");
  }

  return cbc(url, key);
}
