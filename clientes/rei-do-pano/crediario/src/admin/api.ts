import { getSupabase } from '../lib/supabase';

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  nome: string;
  email: string;
  whatsapp: string;
  interesse: string;
  origem: string;
  cidade: string;
  estado: string;
  pais: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  consentimento: boolean;
  consentimento_em: string | null;
};

export type LeadInput = Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'consentimento_em'>>;

export class ApiError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
  }
}

async function call<T>(fn: 'list-leads' | 'manage-lead', body: unknown): Promise<T> {
  const supabase = getSupabase();
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new ApiError(401, 'missing_token');
  const url = `${import.meta.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/${fn}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      apikey: import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body ?? {}),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string; fields?: string[] } & T;
  if (!res.ok) throw new ApiError(res.status, json.fields?.length ? `invalid:${json.fields.join(',')}` : json.error ?? 'error');
  return json;
}

export const listLeads = () => call<{ leads: Lead[]; email: string }>('list-leads', {});
export const createLead = (data: LeadInput) => call<{ ok: true; id: string }>('manage-lead', { action: 'create', data });
export const updateLead = (id: string, data: LeadInput) => call<{ ok: true }>('manage-lead', { action: 'update', id, data });
export const deleteLead = (id: string) => call<{ ok: true }>('manage-lead', { action: 'delete', id });
