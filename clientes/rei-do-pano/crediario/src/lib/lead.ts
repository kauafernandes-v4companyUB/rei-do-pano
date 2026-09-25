// Envio do lead ao backend: fire-and-forget. Nunca lança, nunca bloqueia o WhatsApp.
import type { Utms } from './tracking';

export type LeadPayload = Utms & {
  nome: string;
  email: string;
  whatsapp: string;
  interesse: string;
  origem: string;
  cidade: string;
  estado: string;
  pais: string;
  consentimento: true;
  website: string;
};

const TIMEOUT_MS = 10_000;

export function preloadLeadClient(): void {
  void import('./supabase').catch(() => undefined);
}

export async function submitLeadNonBlocking(lead: LeadPayload): Promise<boolean> {
  try {
    const { getSupabase } = await import('./supabase');
    const call = getSupabase().functions.invoke('submit-lead', { body: lead });
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS),
    );
    const { data, error } = await Promise.race([call, timeout]);
    if (error) throw error;
    return Boolean((data as { saved?: boolean } | null)?.saved);
  } catch (err) {
    console.warn('[crediario] lead não salvo; seguindo para o WhatsApp.', err instanceof Error ? err.message : err);
    return false;
  }
}
