import type { Category, Fuel, Transmission, Usage, Vehicle } from '../data/types';
import { normalize } from './format';

export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { id: 'ate-60', label: 'Até R$ 60 mil', min: 0, max: 60000 },
  { id: '60-90', label: 'R$ 60 a 90 mil', min: 60000, max: 90000 },
  { id: '90-120', label: 'R$ 90 a 120 mil', min: 90000, max: 120000 },
  { id: 'acima-120', label: 'Acima de R$ 120 mil', min: 120000, max: Infinity },
];

export const CATEGORIES: Category[] = ['Hatch', 'Sedan', 'SUV', 'Picape', 'Utilitário'];
export const TRANSMISSIONS: Transmission[] = ['Automático', 'Manual'];
export const FUELS: Fuel[] = ['Flex', 'Gasolina', 'Diesel'];
export const YEAR_OPTIONS = [2015, 2018, 2020, 2022, 2024];

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'km-asc';
export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'relevance', label: 'Destaques primeiro' },
  { id: 'price-asc', label: 'Menor preço' },
  { id: 'price-desc', label: 'Maior preço' },
  { id: 'year-desc', label: 'Mais novos' },
  { id: 'year-asc', label: 'Mais antigos' },
  { id: 'km-asc', label: 'Menor quilometragem' },
];

export interface Filters {
  query: string;
  brand: string;
  price: string;
  yearFrom: number | null;
  category: Category | '';
  transmission: Transmission | '';
  fuel: Fuel | '';
  favoritesOnly: boolean;
}

export const EMPTY_FILTERS: Filters = {
  query: '',
  brand: '',
  price: '',
  yearFrom: null,
  category: '',
  transmission: '',
  fuel: '',
  favoritesOnly: false,
};

export const inPriceRange = (v: Vehicle, rangeId: string) => {
  const r = PRICE_RANGES.find((p) => p.id === rangeId);
  if (!r) return true;
  if (v.price == null) return false;
  return v.price >= r.min && v.price < r.max;
};

const haystack = (v: Vehicle) =>
  normalize([v.brand, v.model, v.version, v.category, v.color, v.fuel, v.transmission, v.yearModel, v.engine].join(' '));

export function filterVehicles(list: Vehicle[], f: Filters, favorites: Set<string>): Vehicle[] {
  const terms = normalize(f.query).split(/\s+/).filter(Boolean);
  return list.filter((v) => {
    if (f.brand && v.brand !== f.brand) return false;
    if (f.price && !inPriceRange(v, f.price)) return false;
    if (f.yearFrom && v.yearModel < f.yearFrom) return false;
    if (f.category && v.category !== f.category) return false;
    if (f.transmission && v.transmission !== f.transmission) return false;
    if (f.fuel && v.fuel !== f.fuel) return false;
    if (f.favoritesOnly && !favorites.has(v.id)) return false;
    if (terms.length) {
      const h = haystack(v);
      if (!terms.every((t) => h.includes(t))) return false;
    }
    return true;
  });
}

export function sortVehicles(list: Vehicle[], key: SortKey): Vehicle[] {
  const out = [...list];
  const price = (v: Vehicle) => v.price ?? Number.MAX_SAFE_INTEGER;
  switch (key) {
    case 'price-asc': return out.sort((a, b) => price(a) - price(b));
    case 'price-desc': return out.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    case 'year-desc': return out.sort((a, b) => b.yearModel - a.yearModel || a.km - b.km);
    case 'year-asc': return out.sort((a, b) => a.yearModel - b.yearModel);
    case 'km-asc': return out.sort((a, b) => a.km - b.km);
    default: return out.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }
}

export function countActiveFilters(f: Filters): number {
  return [f.brand, f.price, f.yearFrom, f.category, f.transmission, f.fuel, f.favoritesOnly].filter(Boolean).length;
}

/** Veículos semelhantes: mesma categoria e/ou preço próximo. */
export function similarVehicles(target: Vehicle, list: Vehicle[], limit = 3): Vehicle[] {
  return list
    .filter((v) => v.id !== target.id)
    .map((v) => {
      let score = 0;
      if (v.category === target.category) score += 3;
      if (v.transmission === target.transmission) score += 1;
      if (v.brand === target.brand) score += 1;
      if (v.price && target.price) score += Math.max(0, 2 - Math.abs(v.price - target.price) / 25000);
      return { v, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.v);
}

/* ---------- Experiência guiada "Encontre seu próximo carro" ---------- */

export interface Preferences {
  category: Category | 'any' | null;
  budget: string | null; // id de PRICE_RANGES ou 'any'
  transmission: Transmission | 'any' | null;
  usage: Usage | null;
}

export interface MatchResult {
  exact: Vehicle[];
  /** Alternativas próximas quando não há correspondência exata. */
  close: Vehicle[];
}

export function matchVehicles(list: Vehicle[], p: Preferences): MatchResult {
  const okCategory = (v: Vehicle) => !p.category || p.category === 'any' || v.category === p.category;
  const okBudget = (v: Vehicle) => !p.budget || p.budget === 'any' || inPriceRange(v, p.budget);
  const okTransmission = (v: Vehicle) => !p.transmission || p.transmission === 'any' || v.transmission === p.transmission;
  const usageScore = (v: Vehicle) => (p.usage ? (v.usage[0] === p.usage ? 2 : v.usage.includes(p.usage) ? 1 : 0) : 0);

  const rank = (arr: Vehicle[]) =>
    [...arr].sort((a, b) => usageScore(b) - usageScore(a) || Number(!!b.featured) - Number(!!a.featured) || b.yearModel - a.yearModel);

  const exact = rank(list.filter((v) => okCategory(v) && okBudget(v) && okTransmission(v) && (!p.usage || usageScore(v) > 0)));
  if (exact.length) return { exact, close: [] };

  // Relaxa um critério por vez, priorizando manter categoria e orçamento.
  const relaxed = rank(
    list.filter((v) => {
      const misses = [okCategory(v), okBudget(v), okTransmission(v), !p.usage || usageScore(v) > 0].filter((ok) => !ok).length;
      return misses === 1;
    }),
  ).slice(0, 6);
  return { exact: [], close: relaxed };
}
