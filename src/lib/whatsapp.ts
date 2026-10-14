import { business } from '../config/business';

/** DDDs válidos no Brasil (Anatel). */
const VALID_DDD = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68,
  69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95,
  96, 97, 98, 99,
]);

/**
 * Valida um número brasileiro no formato E.164 sem "+":
 * 55 + DDD (2 dígitos) + 8 dígitos (fixo, inicia em 2–5) ou 9 dígitos (celular, inicia em 9).
 */
export function isValidBrazilianNumber(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (!digits.startsWith('55')) return false;
  const ddd = Number(digits.slice(2, 4));
  const local = digits.slice(4);
  if (!VALID_DDD.has(ddd)) return false;
  if (local.length === 8) return /^[2-5]/.test(local);
  if (local.length === 9) return local.startsWith('9');
  return false;
}

const WA_NUMBER = business.whatsappE164.replace(/\D/g, '');
export const whatsappAvailable = isValidBrazilianNumber(WA_NUMBER);

if (!whatsappAvailable && import.meta.env.DEV) {
  console.warn(`[Princecar] Número de WhatsApp inválido: "${business.whatsappE164}". Os links de WhatsApp foram desativados.`);
}

/** Monta um link wa.me com mensagem pré-preenchida (ou `null` se o número for inválido). */
export function whatsappLink(message?: string): string | null {
  if (!whatsappAvailable) return null;
  const base = `https://wa.me/${WA_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Fallback seguro: se o WhatsApp estiver indisponível, usa ligação telefônica. */
export function contactHref(message?: string): string {
  return whatsappLink(message) ?? `tel:+${business.phoneE164}`;
}

export const telHref = `tel:+${business.phoneE164}`;

export const messages = {
  general: 'Olá, Princecar! Vim pelo site e gostaria de falar com um consultor.',
  visit: 'Olá, Princecar! Gostaria de combinar uma visita à loja. Qual o melhor horário?',
};

const vehicleName = (v: { brand: string; model: string; version: string; yearFab: number; yearModel: number }) =>
  `${v.brand} ${v.model} ${v.version} ${v.yearFab}/${v.yearModel}`;

export const vehicleMessages = {
  availability: (v: Parameters<typeof vehicleName>[0] & { id: string }) =>
    `Olá, Princecar! Vi no site o ${vehicleName(v)} (ref. ${v.id}) e gostaria de saber se ele ainda está disponível.`,
  negotiate: (v: Parameters<typeof vehicleName>[0] & { id: string }) =>
    `Olá, Princecar! Tenho interesse no ${vehicleName(v)} (ref. ${v.id}). Podemos conversar sobre valores e condições de pagamento?`,
  favorites: (list: (Parameters<typeof vehicleName>[0] & { id: string })[]) =>
    `Olá, Princecar! Separei estes veículos no site e gostaria de mais informações:\n${list
      .map((v, i) => `${i + 1}. ${vehicleName(v)} (ref. ${v.id})`)
      .join('\n')}`,
};
