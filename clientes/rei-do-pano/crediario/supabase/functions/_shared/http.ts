// Utilitários HTTP das Edge Functions (Deno).

const DEFAULT_ORIGINS = [
  'https://crediario.reidopano.com.br',
  'http://localhost:5173',
  'http://localhost:4173',
];

function allowedOrigins(): string[] {
  const env = Deno.env.get('ALLOWED_ORIGINS');
  return env ? env.split(',').map((o) => o.trim()).filter(Boolean) : DEFAULT_ORIGINS;
}

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  const list = allowedOrigins();
  // Previews da Vercel deste projeto também podem chamar as functions.
  const ok = list.includes(origin) || /^https:\/\/crediario-rei-do-pano-[a-z0-9-]+\.vercel\.app$/.test(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : list[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function json(req: Request, status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export function preflight(req: Request): Response | null {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });
  if (req.method !== 'POST') return json(req, 405, { error: 'method_not_allowed' });
  return null;
}

export function clientIp(req: Request): string | null {
  const raw =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0] ??
    '';
  const ip = raw.trim();
  // Aceita só IPv4/IPv6 plausíveis, para o cast para inet não falhar.
  return /^[0-9a-fA-F:.]{3,45}$/.test(ip) ? ip : null;
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
