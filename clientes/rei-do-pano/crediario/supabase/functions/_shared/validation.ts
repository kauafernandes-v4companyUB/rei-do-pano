// Regras de validação compartilhadas entre o frontend (Vite) e as Edge Functions (Deno).
// Sem dependências e sem APIs específicas de runtime.

export const INTERESSES = [
  'Cama, Mesa & Banho',
  'Tecidos & Aviamentos',
  'Eletros & Utilidades',
  'Cortinas Sob Medida',
  'Quero conhecer as opções',
  'Outro',
] as const;

export const INTERESSE_PADRAO = 'Não informado';

// DDDs brasileiros válidos (Anatel).
const DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function normalizeSpaces(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** Nome com pelo menos duas palavras de 2+ letras. */
export function isValidNome(value: string): boolean {
  const nome = normalizeSpaces(value);
  if (nome.length < 5 || nome.length > 120) return false;
  const palavras = nome.split(' ').filter((p) => /\p{L}{2,}/u.test(p));
  return palavras.length >= 2;
}

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email) && !email.includes('..');
}

/** Só dígitos, sem o 55 do país. */
export function normalizeWhatsapp(value: string): string {
  let digits = value.replace(/\D/g, '');
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    digits = digits.slice(2);
  }
  return digits;
}

/** 10 dígitos (fixo, começa com 2-5) ou 11 dígitos (celular, começa com 9), com DDD válido. */
export function isValidWhatsapp(value: string): boolean {
  const digits = normalizeWhatsapp(value);
  if (digits.length !== 10 && digits.length !== 11) return false;
  if (!DDDS.has(Number(digits.slice(0, 2)))) return false;
  const first = digits[2];
  if (digits.length === 11) return first === '9';
  return first >= '2' && first <= '5';
}

/** Máscara (00) 00000-0000 / (00) 0000-0000 aplicada enquanto a pessoa digita. */
export function maskWhatsapp(value: string): string {
  const d = normalizeWhatsapp(value).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function formatWhatsapp(digits: string): string {
  return maskWhatsapp(digits);
}

export function normalizeInteresse(value: unknown): string {
  if (typeof value !== 'string') return INTERESSE_PADRAO;
  const v = normalizeSpaces(value);
  return (INTERESSES as readonly string[]).includes(v) ? v : INTERESSE_PADRAO;
}

export type LeadErrors = Partial<Record<'nome' | 'email' | 'whatsapp' | 'consentimento', string>>;

export function validateLeadForm(input: {
  nome: string;
  email: string;
  whatsapp: string;
  consentimento: boolean;
}): LeadErrors {
  const errors: LeadErrors = {};
  if (!isValidNome(input.nome)) errors.nome = 'Informe seu nome completo (nome e sobrenome).';
  if (!isValidEmail(input.email)) errors.email = 'Informe um e-mail válido.';
  if (!isValidWhatsapp(input.whatsapp)) errors.whatsapp = 'Informe um WhatsApp válido com DDD.';
  if (input.consentimento !== true) errors.consentimento = 'Para continuar, autorize o contato.';
  return errors;
}
