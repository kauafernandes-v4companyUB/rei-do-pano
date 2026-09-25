export const WHATSAPP_NUMBER = '5565999279546';

export function buildWhatsappUrl(lead: {
  nome: string;
  email: string;
  whatsapp: string;
  interesse: string;
}): string {
  const texto =
    'Olá! Acabei de fazer meu pré-cadastro no Crediário Fácil Rei do Pano e gostaria de continuar o atendimento.\n\n' +
    `Nome: ${lead.nome}\n` +
    `E-mail: ${lead.email}\n` +
    `WhatsApp: ${lead.whatsapp}\n` +
    `Interesse: ${lead.interesse}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}
