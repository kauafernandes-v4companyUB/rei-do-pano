// Cliente Supabase criado sob demanda: não entra no caminho crítico da landing page.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
  const key = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) throw new Error('Supabase não configurado');
  client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
  });
  return client;
}
