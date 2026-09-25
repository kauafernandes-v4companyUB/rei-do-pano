import { useState, type FormEvent } from 'react';
import {
  INTERESSES,
  INTERESSE_PADRAO,
  formatWhatsapp,
  isValidEmail,
  isValidNome,
  isValidWhatsapp,
  maskWhatsapp,
} from '../../supabase/functions/_shared/validation';
import { ApiError, createLead, updateLead, type Lead, type LeadInput } from './api';

type Props = { lead: Lead | null; onClose: () => void; onSaved: () => void };

const TEXTO = ['origem', 'cidade', 'estado', 'pais', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
type CampoTexto = (typeof TEXTO)[number];

export function LeadEditor({ lead, onClose, onSaved }: Props) {
  const [form, setForm] = useState(() => ({
    nome: lead?.nome ?? '',
    email: lead?.email ?? '',
    whatsapp: lead ? formatWhatsapp(lead.whatsapp) : '',
    interesse: lead?.interesse ?? INTERESSE_PADRAO,
    consentimento: lead?.consentimento ?? false,
    origem: lead?.origem ?? 'painel',
    cidade: lead?.cidade ?? 'Vilhena',
    estado: lead?.estado ?? 'RO',
    pais: lead?.pais ?? 'Brasil',
    utm_source: lead?.utm_source ?? '',
    utm_medium: lead?.utm_medium ?? '',
    utm_campaign: lead?.utm_campaign ?? '',
    utm_content: lead?.utm_content ?? '',
    utm_term: lead?.utm_term ?? '',
  }));
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (!isValidNome(form.nome)) return setErro('Nome precisa ter nome e sobrenome.');
    if (!isValidEmail(form.email)) return setErro('E-mail inválido.');
    if (!isValidWhatsapp(form.whatsapp)) return setErro('WhatsApp inválido (DDD + número).');
    setErro(null);
    setSalvando(true);
    const data: LeadInput = { ...form, utm_source: form.utm_source || null, utm_medium: form.utm_medium || null, utm_campaign: form.utm_campaign || null, utm_content: form.utm_content || null, utm_term: form.utm_term || null };
    try {
      if (lead) await updateLead(lead.id, data);
      else await createLead(data);
      onSaved();
    } catch (err) {
      setErro(err instanceof ApiError && err.code.startsWith('invalid:') ? `Campos inválidos: ${err.code.slice(8)}` : 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  const input = 'mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base sm:text-sm focus:border-brand focus:outline-none';
  const label = 'text-xs font-semibold uppercase tracking-wide text-muted';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/50 p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="titulo-editor">
      <form onSubmit={salvar} noValidate className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="titulo-editor" className="font-display text-xl font-extrabold text-brand">
          {lead ? 'Editar lead' : 'Novo lead'}
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className={label}>Nome completo</span>
            <input autoFocus className={input} value={form.nome} onChange={(e) => set('nome', e.target.value)} />
          </label>
          <label>
            <span className={label}>E-mail</span>
            <input type="email" className={input} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </label>
          <label>
            <span className={label}>WhatsApp</span>
            <input type="tel" inputMode="tel" className={input} value={form.whatsapp} onChange={(e) => set('whatsapp', maskWhatsapp(e.target.value))} />
          </label>
          <label className="sm:col-span-2">
            <span className={label}>Interesse</span>
            <select className={input} value={form.interesse} onChange={(e) => set('interesse', e.target.value)}>
              {[INTERESSE_PADRAO, ...INTERESSES].map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </label>
          {TEXTO.map((k: CampoTexto) => (
            <label key={k}>
              <span className={label}>{k}</span>
              <input className={input} maxLength={k === 'estado' ? 2 : 200} value={form[k]} onChange={(e) => set(k, e.target.value)} />
            </label>
          ))}
          <label className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" className="h-4 w-4 accent-brand" checked={form.consentimento} onChange={(e) => set('consentimento', e.target.checked)} />
            <span className="text-sm text-ink-soft">O lead autorizou o contato (LGPD)</span>
          </label>
        </div>

        {erro && <p role="alert" className="mt-4 text-sm font-medium text-brand">{erro}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="min-h-10 rounded-lg border border-neutral-300 px-4 text-sm font-semibold">Cancelar</button>
          <button type="submit" disabled={salvando} className="min-h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white disabled:opacity-50">
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
