// Pública. Recebe o pré-cadastro do formulário, valida no servidor e grava em public.leads.
// Nunca expõe detalhes do banco: em falha de persistência responde { saved: false }.
import { clientIp, json, preflight, readJson } from '../_shared/http.ts';
import { serviceClient } from '../_shared/admin.ts';
import { issueFields, submitLeadSchema } from '../_shared/lead-schema.ts';

const LIMIT = 8;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

// Limite por instância (memória). O banco faz a segunda checagem, que vale entre instâncias.
function rateLimitedInMemory(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > LIMIT;
}

Deno.serve(async (req) => {
  const early = preflight(req);
  if (early) return early;

  const ip = clientIp(req);
  if (ip && rateLimitedInMemory(ip)) return json(req, 429, { saved: false, error: 'rate_limited' });

  const body = await readJson(req);
  const parsed = submitLeadSchema.safeParse(body);
  if (!parsed.success) {
    return json(req, 400, { saved: false, error: 'invalid', fields: issueFields(parsed.error) });
  }

  const { website, ...lead } = parsed.data;
  if (website) return json(req, 200, { saved: true }); // bot: finge sucesso e descarta

  try {
    const db = serviceClient();

    if (ip) {
      const since = new Date(Date.now() - WINDOW_MS).toISOString();
      const { count } = await db
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .eq('ip', ip)
        .gte('created_at', since);
      if ((count ?? 0) >= LIMIT) return json(req, 429, { saved: false, error: 'rate_limited' });
    }

    const { error } = await db.from('leads').insert({
      ...lead,
      consentimento: true,
      consentimento_em: new Date().toISOString(),
      ip,
      user_agent: (req.headers.get('user-agent') ?? '').slice(0, 400) || null,
    });
    if (error) {
      console.error('submit-lead insert failed', error.code);
      return json(req, 200, { saved: false });
    }
    return json(req, 201, { saved: true });
  } catch (err) {
    console.error('submit-lead unexpected', err instanceof Error ? err.name : 'unknown');
    return json(req, 200, { saved: false });
  }
});
