import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { LandingPage } from './LandingPage';

// O painel (e o supabase-js com Auth) só carrega em /leads-panel.
const LeadsPanel = lazy(() => import('./admin/LeadsPanel'));

const isPanel = window.location.pathname.replace(/\/+$/, '') === '/leads-panel';

if (isPanel) {
  const robots = document.querySelector('meta[name="robots"]');
  robots?.setAttribute('content', 'noindex, nofollow');
  document.title = 'Leads — Crediário Rei do Pano';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPanel ? (
      <Suspense fallback={<p className="p-8 text-center text-muted">Carregando painel…</p>}>
        <LeadsPanel />
      </Suspense>
    ) : (
      <LandingPage />
    )}
  </StrictMode>,
);
