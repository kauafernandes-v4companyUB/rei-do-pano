// Camada única de tracking: tudo passa pelo dataLayer do GTM.

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export const FORM_ID = 'form-pre-cadastro';

export function pushDataLayer(payload: DataLayerEvent): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export type Utms = Record<(typeof UTM_KEYS)[number], string>;

/** Lê as UTMs da URL atual. Nada é guardado no navegador. Ausente = ''. */
export function readUtms(search: string = window.location.search): Utms {
  const params = new URLSearchParams(search);
  return Object.fromEntries(
    UTM_KEYS.map((k) => [k, (params.get(k) ?? '').trim().slice(0, 200)]),
  ) as Utms;
}
