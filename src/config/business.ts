/**
 * Informações institucionais da Princecar Veículos.
 *
 * Fonte: dados fornecidos para o briefing do projeto. Antes de publicar,
 * confirme cada item com a empresa (veja README → "Informações a confirmar").
 */
export const business = {
  name: 'Princecar Veículos',
  shortName: 'Princecar',
  city: 'Joinville',
  state: 'SC',
  address: {
    street: 'Rua XV de Novembro, 2734',
    district: 'Glória',
    city: 'Joinville',
    state: 'SC',
    /** CEP não informado no briefing — preencher após confirmação. */
    zip: null as string | null,
  },
  /** Telefone informado: (47) 3435-6262. Armazenado no formato E.164 sem o "+". */
  phoneE164: '554734356262',
  phoneDisplay: '(47) 3435-6262',
  /**
   * Número usado para WhatsApp. Por padrão é o mesmo telefone informado —
   * é um número fixo, o que é compatível com o WhatsApp Business, mas
   * PRECISA ser confirmado com a loja antes da publicação.
   */
  whatsappE164: '554734356262',
  instagram: {
    handle: '@princecarveiculosjoinville',
    url: 'https://www.instagram.com/princecarveiculosjoinville/',
  },
  currentSite: 'https://princecar.com.br',
  /** Indicadores informados pela empresa (validar antes de publicar). */
  stats: {
    years: 26,
    carsSold: 5000,
    googleRating: 4.7,
    googleReviews: 150,
  },
  /**
   * Horário de funcionamento NÃO informado. Mantenha `null` até a loja
   * confirmar; a interface exibe um aviso de "a confirmar".
   */
  openingHours: null as { days: string; hours: string }[] | null,
} as const;

export const fullAddress = `${business.address.street} — ${business.address.district}, ${business.address.city}/${business.address.state}`;

const mapsQuery = encodeURIComponent(
  `Princecar Veículos, ${business.address.street}, ${business.address.district}, ${business.address.city} - ${business.address.state}`,
);

export const mapsLinks = {
  search: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
  embed: `https://maps.google.com/maps?q=${mapsQuery}&z=16&output=embed`,
  reviews: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
};
