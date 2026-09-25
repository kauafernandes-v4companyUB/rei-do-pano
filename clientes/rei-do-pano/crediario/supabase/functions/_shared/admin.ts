// Autenticação + papel admin para list-leads e manage-lead.
import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';

export type AdminCheck =
  | { ok: true; service: SupabaseClient; userId: string; email: string }
  | { ok: false; status: 401 | 403 | 500; error: string };

export function serviceClient(): SupabaseClient {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function allowlist(): string[] {
  return (Deno.env.get('ADMIN_EMAILS') ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(req: Request): Promise<AdminCheck> {
  const header = req.headers.get('authorization') ?? '';
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
  if (!token) return { ok: false, status: 401, error: 'missing_token' };

  const service = serviceClient();
  const { data, error } = await service.auth.getUser(token);
  if (error || !data.user) return { ok: false, status: 401, error: 'invalid_token' };

  const user = data.user;
  const email = (user.email ?? '').toLowerCase();

  const { data: isAdmin, error: roleError } = await service.rpc('has_role', {
    _user_id: user.id,
    _role: 'admin',
  });
  if (roleError) {
    console.error('has_role failed', roleError.code);
    return { ok: false, status: 500, error: 'role_check_failed' };
  }
  if (isAdmin === true) return { ok: true, service, userId: user.id, email };

  // Bootstrap: e-mail na allowlist (ADMIN_EMAILS) e confirmado pelo provedor recebe o papel admin.
  const confirmed = Boolean(user.email_confirmed_at);
  if (confirmed && email && allowlist().includes(email)) {
    const { error: insertError } = await service
      .from('user_roles')
      .upsert({ user_id: user.id, role: 'admin' }, { onConflict: 'user_id,role' });
    if (insertError) {
      console.error('grant admin failed', insertError.code);
      return { ok: false, status: 500, error: 'role_grant_failed' };
    }
    return { ok: true, service, userId: user.id, email };
  }

  return { ok: false, status: 403, error: 'forbidden' };
}
