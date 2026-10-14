const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const int = new Intl.NumberFormat('pt-BR');

export const formatPrice = (value: number | null) => (value == null ? 'Sob consulta' : brl.format(value));
export const formatKm = (km: number) => `${int.format(km)} km`;
export const formatInt = (n: number) => int.format(n);

/** Remove acentos e normaliza para busca. */
export const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
