import { describe, expect, it } from 'vitest';
import {
  isValidEmail,
  isValidNome,
  isValidWhatsapp,
  maskWhatsapp,
  normalizeInteresse,
  normalizeWhatsapp,
  validateLeadForm,
} from '../../supabase/functions/_shared/validation';
import { readUtms } from './tracking';
import { buildWhatsappUrl, WHATSAPP_NUMBER } from './whatsapp';
import { toCsv } from './csv';

describe('validação', () => {
  it('nome exige duas palavras', () => {
    expect(isValidNome('Maria')).toBe(false);
    expect(isValidNome('Maria Silva')).toBe(true);
    expect(isValidNome('  José   da  Costa ')).toBe(true);
    expect(isValidNome('A B')).toBe(false);
  });
  it('e-mail', () => {
    expect(isValidEmail('a@b.com')).toBe(true);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('a..b@c.com')).toBe(false);
    expect(isValidEmail('com espaço@x.com')).toBe(false);
  });
  it('WhatsApp com DDD válido, 10 ou 11 dígitos', () => {
    expect(isValidWhatsapp('(69) 99999-8888')).toBe(true);
    expect(isValidWhatsapp('+55 65 99927-9546')).toBe(true);
    expect(isValidWhatsapp('(69) 3321-4080')).toBe(true);
    expect(isValidWhatsapp('(20) 99999-8888')).toBe(false); // DDD inexistente
    expect(isValidWhatsapp('(69) 89999-8888')).toBe(false); // celular sem 9
    expect(isValidWhatsapp('9999-8888')).toBe(false);
    expect(normalizeWhatsapp('+55 (65) 99927-9546')).toBe('65999279546');
  });
  it('máscara', () => {
    expect(maskWhatsapp('69999998888')).toBe('(69) 99999-8888');
    expect(maskWhatsapp('6933214080')).toBe('(69) 3321-4080');
    expect(maskWhatsapp('699')).toBe('(69) 9');
  });
  it('interesse fora da lista vira Não informado', () => {
    expect(normalizeInteresse('')).toBe('Não informado');
    expect(normalizeInteresse('<script>')).toBe('Não informado');
    expect(normalizeInteresse('Cortinas Sob Medida')).toBe('Cortinas Sob Medida');
  });
  it('formulário sem consentimento é inválido', () => {
    const e = validateLeadForm({ nome: 'Maria Silva', email: 'm@x.com', whatsapp: '(69) 99999-8888', consentimento: false });
    expect(Object.keys(e)).toEqual(['consentimento']);
  });
});

describe('UTMs', () => {
  it('lê as cinco UTMs da URL', () => {
    const u = readUtms('?utm_source=instagram&utm_medium=organic_social&utm_campaign=rei_do_pano_crediario&utm_content=link_bio&utm_term=crediario');
    expect(u).toEqual({ utm_source: 'instagram', utm_medium: 'organic_social', utm_campaign: 'rei_do_pano_crediario', utm_content: 'link_bio', utm_term: 'crediario' });
  });
  it('ausentes viram string vazia', () => {
    expect(readUtms('')).toEqual({ utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '', utm_term: '' });
  });
});

describe('WhatsApp', () => {
  it('usa o número da operação e codifica a mensagem', () => {
    const url = buildWhatsappUrl({ nome: 'Maria Silva', email: 'm@x.com', whatsapp: '(69) 99999-8888', interesse: 'Cama, Mesa & Banho' });
    expect(url.startsWith(`https://wa.me/${WHATSAPP_NUMBER}?text=`)).toBe(true);
    const texto = decodeURIComponent(url.split('?text=')[1]);
    expect(texto).toContain('Nome: Maria Silva');
    expect(texto).toContain('Interesse: Cama, Mesa & Banho');
    expect(url).not.toContain('&B'); // "&" codificado
  });
});

describe('CSV', () => {
  it('BOM, separador e escape', () => {
    const csv = toCsv([{ a: 'x;y', b: '=1+1' }], [{ header: 'a', value: (r) => r.a }, { header: 'b', value: (r) => r.b }], ';');
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv).toContain('"x;y"');
    expect(csv).toContain("'=1+1");
  });
});
