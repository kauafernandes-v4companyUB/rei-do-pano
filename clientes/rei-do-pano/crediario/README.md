# Crediário Fácil Rei do Pano

Landing page de pré-cadastro do crediário (Vilhena/RO) e painel de leads.

- LP: https://crediario.reidopano.com.br/ (enquanto o DNS não propaga: https://crediario-rei-do-pano.vercel.app/)
- Painel: https://crediario.reidopano.com.br/leads-panel
- A LP institucional (`lp.reidopano.com.br`) é outro projeto Vercel (`rei-do-pano-clone`) e não é tocada por este.

## Stack

React 18 + Vite + TypeScript + Tailwind v4 · Supabase (Postgres, Auth com GitHub, Edge Functions Deno) · Vercel · GTM `GTM-KFKG4QMG`.

| Recurso | Onde |
| --- | --- |
| Projeto Vercel | `crediario-rei-do-pano` |
| Supabase | `xjqhltnywbqfzigkdwif` (sa-east-1), provisionado pela integração Supabase da Vercel |
| Migration | `supabase/migrations/20260925000000_crediario_init.sql` |
| Functions | `supabase/functions/{submit-lead,list-leads,manage-lead}` |
| Regras de validação (front + back) | `supabase/functions/_shared/validation.ts` |

## Fluxo do formulário

1. Valida no cliente (nome com 2 palavras, e-mail, WhatsApp com DDD válido, consentimento). Com erro: nada de POST, evento ou WhatsApp.
2. Monta o lead com UTMs lidas da URL no submit (nada vai para localStorage).
3. `supabase.functions.invoke('submit-lead')` sem `await` (timeout de 10 s; falha é engolida).
4. `dataLayer.push({ event: 'lead', ... })` e depois `dataLayer.push({ event: 'click_whatsapp', ... })`.
5. `window.open('https://wa.me/5565999279546?text=...', '_blank', 'noopener,noreferrer')`. A LP continua aberta e mostra um botão para reabrir o WhatsApp.

`form_start_crediario` dispara uma vez, no primeiro foco ou toque em um campo.

## Segurança

- `leads` e `user_roles` com RLS ligado, sem policies e sem grants para `anon`/`authenticated`. Só as functions (service role) acessam.
- `has_role(user_id, role)` é `security definer` e só executável pelo `service_role`.
- `submit-lead`: pública, Zod, honeypot, 8 req/min por IP (memória + contagem no banco). Falha de banco responde `{ "saved": false }` sem detalhes.
- `list-leads` / `manage-lead`: JWT validado com `auth.getUser`, depois papel `admin` (401 sem token, 403 sem papel). `manage-lead` aceita só os campos da whitelist.
- Allowlist: secret `ADMIN_EMAILS` (separado por vírgula). No primeiro acesso, um e-mail confirmado da lista recebe o papel `admin` em `user_roles`.

## Comandos

```bash
npm install
npm run dev          # http://localhost:5173 (usa .env.local da Vercel: vercel env pull)
npm run lint && npm run typecheck && npm test && npm run build
python3 scripts/e2e.py                          # e2e local, backend simulado fora do ar
MODE=live python3 scripts/e2e.py https://crediario-rei-do-pano.vercel.app   # e2e com backend real (cria 1 lead de teste)
```

Deploy:

```bash
vercel deploy --prod
npx supabase functions deploy submit-lead list-leads manage-lead --project-ref xjqhltnywbqfzigkdwif --use-api
npx supabase secrets set --project-ref xjqhltnywbqfzigkdwif ADMIN_EMAILS=... ALLOWED_ORIGINS=...
npx supabase config push --project-ref xjqhltnywbqfzigkdwif   # URLs de retorno do Auth
```

## Variáveis

| Variável | Onde | Observação |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel (integração) | Públicas; o Vite lê o prefixo `NEXT_PUBLIC_` |
| `ADMIN_EMAILS` | Secret do Supabase | E-mails de admin, separados por vírgula (valor só no Supabase, fora do repositório) |
| `ALLOWED_ORIGINS` | Secret do Supabase | Domínio final, `crediario-rei-do-pano.vercel.app` e localhost |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Injetadas pelo runtime das functions | Nunca no frontend |

## Pendências externas

1. **DNS (Cloudflare, zona `reidopano.com.br`)**: criar registro `A`, nome `crediario`, valor `76.76.21.21`, proxy **DNS only** (nuvem cinza), TTL Auto. Mesmo padrão do `lp`. A Vercel emite o certificado sozinha depois que o registro propagar.
2. **Login com GitHub** (grátis):
   - GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: `https://crediario.reidopano.com.br`
   - Authorization callback URL: `https://xjqhltnywbqfzigkdwif.supabase.co/auth/v1/callback`
   - Gerar um Client Secret e colar Client ID + Secret no Supabase → Authentication → Sign In / Providers → GitHub → ativar.
3. **Allowlist**: `ADMIN_EMAILS` compara com o e-mail principal verificado da conta GitHub. Novos admins: `supabase secrets set ADMIN_EMAILS=...`.
4. **Cookies**: a página já tem aviso de cookies com Consent Mode v2 (padrão negado). No GTM, exigir `ad_storage` nas tags do Meta e `analytics_storage` nas do Clarity. Detalhes em `../orientacoes-gestor-tagueamento-lp.md`, seção 10.
5. **GTM**: no `GTM-KFKG4QMG`, criar acionadores para `form_start_crediario`, `lead` e `click_whatsapp`, filtrando por `Page Hostname` = `crediario.reidopano.com.br`, e mapear para GA4 (`form_start`, `generate_lead`, `click_whatsapp`), Meta (`Lead`, `Contact`) e Google Ads.
