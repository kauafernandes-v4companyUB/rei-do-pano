import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabase';
import { downloadCsv, toCsv, type CsvColumn } from '../lib/csv';
import { LogoMark } from '../components/Logo';
import { formatWhatsapp } from '../../supabase/functions/_shared/validation';
import { ApiError, deleteLead, listLeads, type Lead } from './api';
import { LeadEditor } from './LeadEditor';

const TZ = 'America/Porto_Velho'; // Vilhena/RO
const dataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { timeZone: TZ, dateStyle: 'short', timeStyle: 'short' });

const CSV_COLUMNS: CsvColumn<Lead>[] = [
  { header: 'data', value: (l) => dataHora(l.created_at) },
  { header: 'nome', value: (l) => l.nome },
  { header: 'email', value: (l) => l.email },
  // Com espaços o Excel trata como texto (sem notação científica) e o Meta normaliza.
  { header: 'whatsapp', value: (l) => `55 ${l.whatsapp.slice(0, 2)} ${l.whatsapp.slice(2)}` },
  { header: 'interesse', value: (l) => l.interesse },
  { header: 'cidade', value: (l) => l.cidade },
  { header: 'estado', value: (l) => l.estado },
  { header: 'pais', value: (l) => l.pais },
  { header: 'origem', value: (l) => l.origem },
  { header: 'utm_source', value: (l) => l.utm_source },
  { header: 'utm_medium', value: (l) => l.utm_medium },
  { header: 'utm_campaign', value: (l) => l.utm_campaign },
  { header: 'utm_content', value: (l) => l.utm_content },
  { header: 'utm_term', value: (l) => l.utm_term },
  { header: 'consentimento', value: (l) => (l.consentimento ? 'sim' : 'nao') },
];

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'login'; erro?: string }
  | { tipo: 'negado'; email: string }
  | { tipo: 'painel' };

const btn = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:opacity-50';
const btnPrimario = `${btn} bg-brand text-white hover:bg-brand-mid`;
const btnSecundario = `${btn} border border-neutral-300 bg-white text-ink hover:border-brand hover:text-brand`;

export default function LeadsPanel() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });
  const [session, setSession] = useState<Session | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [email, setEmail] = useState('');
  const [busca, setBusca] = useState('');
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [editando, setEditando] = useState<Lead | 'novo' | null>(null);
  const [excluindo, setExcluindo] = useState<Lead | null>(null);

  const carregar = useCallback(async () => {
    setCarregandoLista(true);
    setAviso(null);
    try {
      const res = await listLeads();
      setLeads(res.leads);
      setEmail(res.email);
      setEstado({ tipo: 'painel' });
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        const { data } = await getSupabase().auth.getUser();
        setEstado({ tipo: 'negado', email: data.user?.email ?? '' });
      } else if (err instanceof ApiError && err.status === 401) {
        setEstado({ tipo: 'login', erro: 'Sua sessão expirou. Entre novamente.' });
      } else {
        setAviso('Não foi possível carregar os leads. Tente atualizar.');
        setEstado((e) => (e.tipo === 'carregando' ? { tipo: 'painel' } : e));
      }
    } finally {
      setCarregandoLista(false);
    }
  }, []);

  useEffect(() => {
    let supabase;
    try {
      supabase = getSupabase();
    } catch {
      setEstado({ tipo: 'login', erro: 'Painel sem configuração do Supabase.' });
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setEstado({ tipo: 'login' });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      if (!s) setEstado({ tipo: 'login' });
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const token = session?.access_token;
  useEffect(() => {
    if (token) void carregar();
  }, [token, carregar]);

  async function entrarComGithub() {
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/leads-panel` },
    });
    if (error) setEstado({ tipo: 'login', erro: 'Não foi possível iniciar o login com GitHub.' });
  }

  async function sair() {
    await getSupabase().auth.signOut();
    setLeads([]);
    setEstado({ tipo: 'login' });
  }

  async function confirmarExclusao() {
    if (!excluindo) return;
    try {
      await deleteLead(excluindo.id);
      setExcluindo(null);
      await carregar();
    } catch {
      setAviso('Não foi possível excluir o lead.');
      setExcluindo(null);
    }
  }

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return leads;
    const digits = q.replace(/\D/g, '');
    return leads.filter(
      (l) =>
        l.nome.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (digits.length >= 3 && l.whatsapp.includes(digits)) ||
        (l.utm_campaign ?? '').toLowerCase().includes(q),
    );
  }, [leads, busca]);

  function exportar(sep: ';' | ',') {
    const hoje = new Date().toISOString().slice(0, 10);
    const sufixo = sep === ';' ? 'excel' : 'ferramentas';
    downloadCsv(toCsv(filtrados, CSV_COLUMNS, sep), `leads-crediario-rei-do-pano-${hoje}-${sufixo}.csv`);
  }

  if (estado.tipo === 'carregando') {
    return <p className="p-8 text-center text-muted">Carregando…</p>;
  }

  if (estado.tipo === 'login' || estado.tipo === 'negado') {
    return (
      <main className="grid min-h-dvh place-items-center px-5">
        <div className="w-full max-w-sm rounded-2xl border border-brand/10 bg-white p-7 text-center shadow-lg">
          <div className="mx-auto w-fit"><LogoMark size={56} /></div>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-brand">Painel de leads</h1>
          <p className="mt-1 text-sm text-muted">Crediário Fácil Rei do Pano</p>

          {estado.tipo === 'negado' ? (
            <div role="alert" className="mt-6 rounded-lg bg-brand/5 p-4 text-left">
              <p className="font-bold text-brand">Acesso negado</p>
              <p className="mt-1 text-sm text-ink-soft">
                A conta {estado.email || 'utilizada'} não tem permissão de administrador neste painel.
              </p>
              <button type="button" onClick={sair} className={`${btnSecundario} mt-4 w-full`}>
                Sair e usar outra conta
              </button>
            </div>
          ) : (
            <>
              {estado.erro && (
                <p role="alert" className="mt-5 text-sm font-medium text-brand">{estado.erro}</p>
              )}
              <button type="button" onClick={entrarComGithub} className={`${btnPrimario} mt-6 w-full min-h-12`}>
                <svg viewBox="0 0 16 16" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                Entrar com GitHub
              </button>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-brand/10 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <LogoMark size={36} />
            <div>
              <h1 className="font-display text-lg font-extrabold text-brand">Leads do crediário</h1>
              <p className="text-xs text-muted">{email}</p>
            </div>
          </div>
          <button type="button" onClick={sair} className={btnSecundario}>Sair</button>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-ink-soft">
              <strong className="text-ink">{filtrados.length}</strong>
              {filtrados.length !== leads.length ? ` de ${leads.length}` : ''} lead{leads.length === 1 ? '' : 's'}
            </p>
            <label className="mt-2 block">
              <span className="sr-only">Buscar</span>
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar nome, e-mail, WhatsApp ou campanha"
                className="w-72 max-w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base sm:text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void carregar()} disabled={carregandoLista} className={btnSecundario}>
              {carregandoLista ? 'Atualizando…' : 'Atualizar'}
            </button>
            <button type="button" onClick={() => exportar(';')} disabled={!filtrados.length} className={btnSecundario}>
              CSV (Excel)
            </button>
            <button type="button" onClick={() => exportar(',')} disabled={!filtrados.length} className={btnSecundario}>
              CSV (Meta/ferramentas)
            </button>
            <button type="button" onClick={() => setEditando('novo')} className={btnPrimario}>
              Novo lead
            </button>
          </div>
        </div>

        {aviso && <p role="alert" className="mt-4 rounded-lg bg-brand/5 p-3 text-sm font-medium text-brand">{aviso}</p>}

        <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-muted">
              <tr>
                {['Data/hora', 'Nome', 'E-mail', 'WhatsApp', 'Interesse', 'Origem', 'Cidade', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', ''].map((h) => (
                  <th key={h} scope="col" className="whitespace-nowrap px-3 py-2.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtrados.map((l) => (
                <tr key={l.id} className="hover:bg-cream">
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted">{dataHora(l.created_at)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-ink">{l.nome}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">{l.email}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <a href={`https://wa.me/55${l.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-whatsapp-deep underline-offset-2 hover:underline">
                      {formatWhatsapp(l.whatsapp)}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">{l.interesse}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">{l.origem}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">{l.cidade}/{l.estado}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted">{l.utm_source ?? '—'}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted">{l.utm_medium ?? '—'}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted">{l.utm_campaign ?? '—'}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted">{l.utm_content ?? '—'}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted">{l.utm_term ?? '—'}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right">
                    <button type="button" onClick={() => setEditando(l)} className="font-semibold text-ink hover:text-brand">Editar</button>
                    <button type="button" onClick={() => setExcluindo(l)} className="ml-3 font-semibold text-brand hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
              {!filtrados.length && (
                <tr>
                  <td colSpan={13} className="px-3 py-10 text-center text-muted">
                    {leads.length ? 'Nenhum lead encontrado para essa busca.' : 'Nenhum lead ainda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {editando && (
        <LeadEditor
          lead={editando === 'novo' ? null : editando}
          onClose={() => setEditando(null)}
          onSaved={() => {
            setEditando(null);
            void carregar();
          }}
        />
      )}

      {excluindo && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-5" role="dialog" aria-modal="true" aria-labelledby="titulo-excluir">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 id="titulo-excluir" className="font-display text-xl font-extrabold text-brand">Excluir lead?</h2>
            <p className="mt-2 text-sm text-ink-soft">
              O lead de <strong>{excluindo.nome}</strong> será removido de forma definitiva.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" autoFocus onClick={() => setExcluindo(null)} className={btnSecundario}>Cancelar</button>
              <button type="button" onClick={() => void confirmarExclusao()} className={btnPrimario}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
