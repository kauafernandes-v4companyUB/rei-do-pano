import { useId, useRef, useState, type FormEvent, type ReactNode, type SyntheticEvent } from 'react';
import { Logo, WhatsappIcon } from './components/Logo';
import { preloadLeadClient, submitLeadNonBlocking, type LeadPayload } from './lib/lead';
import { FORM_ID, pushDataLayer, readUtms } from './lib/tracking';
import { WHATSAPP_NUMBER, buildWhatsappUrl } from './lib/whatsapp';
import {
  INTERESSES,
  INTERESSE_PADRAO,
  maskWhatsapp,
  normalizeSpaces,
  validateLeadForm,
  type LeadErrors,
} from '../supabase/functions/_shared/validation';

const icone = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {path}
  </svg>
);

const BENEFICIOS: { titulo: string; texto: string; icone: ReactNode }[] = [
  {
    titulo: 'Até 6x sem juros',
    texto: 'Parcelamos suas compras em até 6x sem juros.',
    icone: <span className="font-display text-base font-extrabold">6x</span>,
  },
  {
    titulo: 'Crediário próprio',
    texto: 'Condições especiais através do crediário próprio Rei do Pano.',
    icone: icone(<path d="M3 18h18M4 15l-1-9 5 4 4-6 4 6 5-4-1 9z" />),
  },
  {
    titulo: 'Também no cartão',
    texto: 'Compras no cartão também podem ser parceladas em até 6x sem juros.',
    icone: icone(<><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 10h19M6 15h4" /></>),
  },
];

type Campos = { nome: string; email: string; whatsapp: string; interesse: string; consentimento: boolean };
const VAZIO: Campos = { nome: '', email: '', whatsapp: '', interesse: '', consentimento: false };
const ORDEM: (keyof LeadErrors)[] = ['nome', 'email', 'whatsapp', 'consentimento'];

let formStartEnviado = false; // uma vez por carregamento da página

export function LandingPage() {
  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<LeadErrors>({});
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const enviando = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const uid = useId();
  const id = (campo: string) => `${uid}-${campo}`;

  function atualizar<K extends keyof Campos>(campo: K, valor: Campos[K]) {
    setCampos((c) => ({ ...c, [campo]: valor }));
    if (erros[campo as keyof LeadErrors]) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  function aoInteragir(e: SyntheticEvent) {
    if (formStartEnviado) return;
    const alvo = e.target as HTMLElement;
    if (!alvo.matches('input, select, textarea') || alvo.id === id('website')) return;
    formStartEnviado = true;
    pushDataLayer({ event: 'form_start_crediario', form_id: FORM_ID });
    preloadLeadClient();
  }

  function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando.current) return;

    // PASSO 1: validação. Com erro, nada de POST, evento ou WhatsApp.
    const encontrados = validateLeadForm(campos);
    setErros(encontrados);
    const primeiro = ORDEM.find((k) => encontrados[k]);
    if (primeiro) {
      document.getElementById(id(primeiro))?.focus();
      return;
    }
    enviando.current = true;
    setTimeout(() => (enviando.current = false), 3000);

    // PASSO 2: objeto do lead.
    const utms = readUtms();
    const nome = normalizeSpaces(campos.nome);
    const email = campos.email.trim().toLowerCase();
    const interesse = campos.interesse || INTERESSE_PADRAO;
    const lead: LeadPayload = {
      nome,
      email,
      whatsapp: campos.whatsapp,
      interesse,
      origem: 'lp_crediario',
      cidade: 'Vilhena',
      estado: 'RO',
      pais: 'Brasil',
      consentimento: true,
      website: honeypot.current?.value ?? '',
      ...utms,
    };

    // PASSO 3: salvamento sem bloqueio. Não é aguardado.
    void submitLeadNonBlocking(lead);

    // PASSO 4: eventos síncronos, antes de abrir o WhatsApp.
    pushDataLayer({ event: 'lead', form_id: FORM_ID, interesse, ...utms });
    pushDataLayer({ event: 'click_whatsapp', whatsapp_number: WHATSAPP_NUMBER, origin: 'form_submit' });

    // PASSO 5: WhatsApp em nova aba; a landing page continua aberta.
    const url = buildWhatsappUrl({ nome, email, whatsapp: campos.whatsapp, interesse });
    window.open(url, '_blank', 'noopener,noreferrer');
    setWaUrl(url);
  }

  const campoBase =
    'mt-1.5 block w-full rounded-lg border bg-white px-3.5 py-3 text-base text-ink placeholder:text-muted/70 ' +
    'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';
  const borda = (campo: keyof LeadErrors) => (erros[campo] ? 'border-brand' : 'border-neutral-300');

  const erro = (campo: keyof LeadErrors) =>
    erros[campo] ? (
      <p id={id(`${campo}-erro`)} role="alert" className="mt-1.5 text-sm font-medium text-brand">
        {erros[campo]}
      </p>
    ) : null;

  const aria = (campo: keyof LeadErrors) => ({
    id: id(campo),
    'aria-invalid': Boolean(erros[campo]),
    'aria-describedby': erros[campo] ? id(`${campo}-erro`) : undefined,
  });

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-5 pb-3">
        <Logo />
        <span className="hidden text-xs font-semibold uppercase tracking-widest text-muted sm:block">Vilhena · RO</span>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-5 pb-12 lg:grid-cols-[1fr_440px] lg:items-start lg:gap-14 lg:pt-8">
        <section aria-labelledby="titulo" className="pt-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Crediário Fácil Rei do Pano</p>
          <h1 id="titulo" className="mt-3 font-display text-[2rem] leading-[1.12] font-extrabold text-brand sm:text-5xl">
            Facilidade para você comprar o que precisa e pagar do seu jeito!
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
            Faça seu pré-cadastro e continue o atendimento pelo WhatsApp com a equipe do Rei do Pano em Vilhena.
          </p>

          <ul className="mt-5 divide-y divide-brand/10 rounded-xl border border-brand/10 bg-white shadow-sm">
            {BENEFICIOS.map((b) => (
              <li key={b.titulo} className="flex items-start gap-3 px-4 py-3 lg:py-4">
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-gold-mid"
                >
                  {b.icone}
                </span>
                <div>
                  <p className="font-bold text-ink">{b.titulo}</p>
                  <p className="mt-0.5 text-sm leading-snug text-ink-soft">{b.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="titulo-form" className="rounded-2xl border border-brand/10 bg-white p-5 shadow-lg shadow-brand/5 sm:p-7">
          {waUrl ? (
            <div className="py-4 text-center" role="status">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white">
                <WhatsappIcon className="h-7 w-7" />
              </div>
              <h2 id="titulo-form" className="mt-4 font-display text-2xl font-extrabold text-brand">
                Continue no WhatsApp
              </h2>
              <p className="mt-2 text-base leading-relaxed text-ink-soft">
                Abrimos o WhatsApp com seus dados preenchidos. Agora é só tocar em enviar para falar com a nossa equipe.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-5 font-bold text-white hover:bg-whatsapp-deep"
              >
                <WhatsappIcon /> Abrir o WhatsApp de novo
              </a>
            </div>
          ) : (
            <>
              <h2 id="titulo-form" className="font-display text-2xl font-extrabold text-ink">
                Faça seu pré-cadastro
              </h2>
              <p className="mt-1 text-sm text-ink-soft">Leva menos de um minuto.</p>

              <form
                id="form-pre-cadastro"
                data-form="pre-cadastro-crediario"
                noValidate
                onSubmit={aoEnviar}
                onFocusCapture={aoInteragir}
                onPointerDownCapture={aoInteragir}
                className="mt-5 grid gap-4"
              >
                <div>
                  <label htmlFor={id('nome')} className="text-sm font-semibold text-ink">Nome completo</label>
                  <input
                    {...aria('nome')}
                    type="text"
                    autoComplete="name"
                    autoCapitalize="words"
                    placeholder="Seu nome e sobrenome"
                    value={campos.nome}
                    onChange={(e) => atualizar('nome', e.target.value)}
                    className={`${campoBase} ${borda('nome')}`}
                  />
                  {erro('nome')}
                </div>

                <div>
                  <label htmlFor={id('email')} className="text-sm font-semibold text-ink">E-mail</label>
                  <input
                    {...aria('email')}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="voce@email.com"
                    value={campos.email}
                    onChange={(e) => atualizar('email', e.target.value)}
                    className={`${campoBase} ${borda('email')}`}
                  />
                  {erro('email')}
                </div>

                <div>
                  <label htmlFor={id('whatsapp')} className="text-sm font-semibold text-ink">WhatsApp</label>
                  <input
                    {...aria('whatsapp')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="(69) 99999-9999"
                    value={campos.whatsapp}
                    onChange={(e) => atualizar('whatsapp', maskWhatsapp(e.target.value))}
                    className={`${campoBase} ${borda('whatsapp')}`}
                  />
                  {erro('whatsapp')}
                </div>

                <div>
                  <label htmlFor={id('interesse')} className="text-sm font-semibold text-ink">
                    Interesse <span className="font-normal text-muted">(opcional)</span>
                  </label>
                  <select
                    id={id('interesse')}
                    value={campos.interesse}
                    onChange={(e) => atualizar('interesse', e.target.value)}
                    className={`${campoBase} border-neutral-300`}
                  >
                    <option value="">Selecione uma opção</option>
                    {INTERESSES.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>

                <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor={id('website')}>Não preencha</label>
                  <input ref={honeypot} id={id('website')} type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div>
                  <div className="flex items-start gap-3">
                    <input
                      {...aria('consentimento')}
                      type="checkbox"
                      checked={campos.consentimento}
                      onChange={(e) => atualizar('consentimento', e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-brand"
                    />
                    <label htmlFor={id('consentimento')} className="text-sm leading-snug text-ink-soft">
                      Autorizo o Rei do Pano a usar meus dados para entrar em contato sobre o crediário e o atendimento
                      que solicitei.
                    </label>
                  </div>
                  {erro('consentimento')}
                </div>

                <button
                  id="btn-continuar-whatsapp"
                  data-event="submit_lead"
                  type="submit"
                  className="mt-1 inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-lg bg-whatsapp px-5 py-3.5 text-base font-bold text-white shadow-md shadow-whatsapp/30 hover:bg-whatsapp-deep active:translate-y-px"
                >
                  <WhatsappIcon />
                  Continuar pelo WhatsApp
                </button>

                <p className="text-center text-xs leading-relaxed text-muted">
                  Seus dados são usados apenas para este atendimento, conforme a LGPD. Ao continuar, o WhatsApp abre com
                  a sua mensagem pronta.
                </p>
              </form>
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-brand/10 px-5 py-6 text-center text-xs leading-relaxed text-muted">
        <p className="font-semibold text-ink-soft">Rei do Pano — Vilhena/RO</p>
        <p>Av. Major Amarante, 3295 — Centro, Vilhena/RO · WhatsApp (65) 99927-9546</p>
        <p className="mt-1">
          <a href="https://lp.reidopano.com.br/" className="underline decoration-brand/30 underline-offset-2 hover:text-brand">
            Conheça a loja
          </a>
          {' · '}
          <button type="button" data-abrir-cookies className="underline decoration-brand/30 underline-offset-2 hover:text-brand">
            Preferências de cookies
          </button>
        </p>
      </footer>
    </div>
  );
}
