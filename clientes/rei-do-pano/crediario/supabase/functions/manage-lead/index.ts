// Protegida: JWT válido + papel admin. Ações create, update e delete com whitelist de campos.
import { z } from 'npm:zod@3';
import { json, preflight, readJson } from '../_shared/http.ts';
import { requireAdmin } from '../_shared/admin.ts';
import { adminLeadPatchSchema, adminLeadSchema, issueFields } from '../_shared/lead-schema.ts';

const requestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('create'), data: z.unknown() }).strict(),
  z.object({ action: z.literal('update'), id: z.string().uuid(), data: z.unknown() }).strict(),
  z.object({ action: z.literal('delete'), id: z.string().uuid() }).strict(),
]);

Deno.serve(async (req) => {
  const early = preflight(req);
  if (early) return early;

  const auth = await requireAdmin(req);
  if (!auth.ok) return json(req, auth.status, { error: auth.error });

  const request = requestSchema.safeParse(await readJson(req));
  if (!request.success) return json(req, 400, { error: 'invalid_request' });
  const db = auth.service;
  const r = request.data;

  if (r.action === 'delete') {
    const { error, count } = await db.from('leads').delete({ count: 'exact' }).eq('id', r.id);
    if (error) {
      console.error('manage-lead delete failed', error.code);
      return json(req, 500, { error: 'delete_failed' });
    }
    return count ? json(req, 200, { ok: true }) : json(req, 404, { error: 'not_found' });
  }

  if (r.action === 'create') {
    const parsed = adminLeadSchema.safeParse({ origem: 'painel', ...(r.data as object) });
    if (!parsed.success) return json(req, 400, { error: 'invalid', fields: issueFields(parsed.error) });
    const lead = parsed.data;
    const { data, error } = await db
      .from('leads')
      .insert({
        ...lead,
        consentimento: lead.consentimento ?? false,
        consentimento_em: lead.consentimento ? new Date().toISOString() : null,
      })
      .select('id')
      .single();
    if (error) {
      console.error('manage-lead create failed', error.code);
      return json(req, 500, { error: 'create_failed' });
    }
    return json(req, 201, { ok: true, id: data.id });
  }

  const parsed = adminLeadPatchSchema.safeParse(r.data);
  if (!parsed.success) return json(req, 400, { error: 'invalid', fields: issueFields(parsed.error) });
  // Campos ausentes do payload não entram no update (o Zod transforma ausentes em null nos opcionais).
  const sent = Object.keys((r.data ?? {}) as object);
  const patch = Object.fromEntries(Object.entries(parsed.data).filter(([k]) => sent.includes(k)));
  if (Object.keys(patch).length === 0) return json(req, 400, { error: 'empty_update' });
  const { error, count } = await db.from('leads').update(patch, { count: 'exact' }).eq('id', r.id);
  if (error) {
    console.error('manage-lead update failed', error.code);
    return json(req, 500, { error: 'update_failed' });
  }
  return count ? json(req, 200, { ok: true }) : json(req, 404, { error: 'not_found' });
});
