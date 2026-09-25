// Protegida: JWT válido + papel admin. Retorna até 5.000 leads, do mais recente ao mais antigo.
import { json, preflight } from '../_shared/http.ts';
import { requireAdmin } from '../_shared/admin.ts';

const COLUMNS =
  'id,created_at,updated_at,nome,email,whatsapp,interesse,origem,cidade,estado,pais,' +
  'utm_source,utm_medium,utm_campaign,utm_content,utm_term,consentimento,consentimento_em';

Deno.serve(async (req) => {
  const early = preflight(req);
  if (early) return early;

  const auth = await requireAdmin(req);
  if (!auth.ok) return json(req, auth.status, { error: auth.error });

  const { data, error } = await auth.service
    .from('leads')
    .select(COLUMNS)
    .order('created_at', { ascending: false })
    .limit(5000);
  if (error) {
    console.error('list-leads failed', error.code);
    return json(req, 500, { error: 'list_failed' });
  }
  return json(req, 200, { leads: data, email: auth.email });
});
