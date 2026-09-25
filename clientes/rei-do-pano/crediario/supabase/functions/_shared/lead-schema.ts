// Schemas Zod dos leads (Deno). Reutilizam as regras de validation.ts.
import { z } from 'npm:zod@3';
import {
  isValidEmail,
  isValidNome,
  isValidWhatsapp,
  normalizeInteresse,
  normalizeSpaces,
  normalizeWhatsapp,
} from './validation.ts';

const shortText = (max: number) =>
  z
    .string()
    .max(max * 4)
    .transform((s) => normalizeSpaces(s).slice(0, max))
    .optional()
    .nullable()
    .transform((s) => (s ? s : null));

export const utmFields = {
  utm_source: shortText(200),
  utm_medium: shortText(200),
  utm_campaign: shortText(200),
  utm_content: shortText(200),
  utm_term: shortText(200),
};

export const coreFields = {
  nome: z.string().max(200).transform(normalizeSpaces).refine(isValidNome, 'nome'),
  email: z
    .string()
    .max(254)
    .transform((s) => s.trim().toLowerCase())
    .refine(isValidEmail, 'email'),
  whatsapp: z.string().max(40).refine(isValidWhatsapp, 'whatsapp').transform(normalizeWhatsapp),
  interesse: z.unknown().optional().transform(normalizeInteresse),
};

const place = {
  origem: shortText(60).transform((v) => v ?? 'lp_crediario'),
  cidade: shortText(80).transform((v) => v ?? 'Vilhena'),
  estado: shortText(2).transform((v) => (v ?? 'RO').toUpperCase()),
  pais: shortText(40).transform((v) => v ?? 'Brasil'),
};

/** Payload público do formulário (submit-lead). */
export const submitLeadSchema = z.object({
  ...coreFields,
  ...place,
  ...utmFields,
  consentimento: z.literal(true),
  website: z.string().max(200).optional(), // honeypot: humanos não preenchem
});

/** Campos que o painel pode criar/editar (manage-lead). Whitelist explícita. */
export const adminLeadSchema = z
  .object({
    ...coreFields,
    ...place,
    ...utmFields,
    consentimento: z.boolean().optional(),
  })
  .strict();

export const adminLeadPatchSchema = adminLeadSchema.partial().strict();

export function issueFields(error: z.ZodError): string[] {
  return [...new Set(error.issues.map((i) => String(i.path[0] ?? 'payload')))];
}
