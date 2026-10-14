import type { Dispatch, SetStateAction } from 'react';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownUp, Heart, RotateCcw, Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import type { Vehicle } from '../data/types';
import { brands, vehicles } from '../data/vehicles.demo';
import { VehicleCard } from '../components/VehicleCard';
import { Select } from '../components/Select';
import { DemoBadge } from '../components/DemoBadge';
import { WhatsAppIcon } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import {
  CATEGORIES, EMPTY_FILTERS, FUELS, PRICE_RANGES, SORT_OPTIONS, TRANSMISSIONS, YEAR_OPTIONS,
  countActiveFilters, filterVehicles, sortVehicles, type Filters, type SortKey,
} from '../lib/inventory';
import { contactHref, vehicleMessages } from '../lib/whatsapp';
import { useDialogA11y, useLockBody } from '../hooks/useMisc';
import { btn, button, cx, eyebrow } from '../lib/ui';

const PAGE = 9;

interface Props {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpen: (v: Vehicle) => void;
}

export function Inventory({ filters, setFilters, sort, setSort, favorites, onToggleFavorite, onOpen }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE);
  const deferredQuery = useDeferredValue(filters.query);
  const searchRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => sortVehicles(filterVehicles(vehicles, { ...filters, query: deferredQuery }, favorites), sort),
    [filters, deferredQuery, favorites, sort],
  );
  const active = countActiveFilters(filters);
  const hasAnything = active > 0 || filters.query.trim() !== '';

  useEffect(() => setVisible(PAGE), [filters, sort]);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }));
  const clearAll = () => setFilters(EMPTY_FILTERS);

  const chips = [
    filters.category && { key: 'category' as const, label: filters.category },
    filters.brand && { key: 'brand' as const, label: filters.brand },
    filters.price && { key: 'price' as const, label: PRICE_RANGES.find((p) => p.id === filters.price)?.label ?? '' },
    filters.yearFrom && { key: 'yearFrom' as const, label: `A partir de ${filters.yearFrom}` },
    filters.transmission && { key: 'transmission' as const, label: filters.transmission },
    filters.fuel && { key: 'fuel' as const, label: filters.fuel },
    filters.favoritesOnly && { key: 'favoritesOnly' as const, label: 'Favoritos' },
  ].filter(Boolean) as { key: keyof Filters; label: string }[];

  const favoriteVehicles = vehicles.filter((v) => favorites.has(v.id));
  const helpMessage = `Olá, Princecar! Estou procurando um veículo${filters.category ? ` (${filters.category})` : ''}${
    filters.brand ? ` da ${filters.brand}` : ''
  }${filters.price ? `, ${PRICE_RANGES.find((p) => p.id === filters.price)?.label.toLowerCase()}` : ''}${
    filters.query ? `, busca: "${filters.query}"` : ''
  } e não encontrei no site. Vocês podem me ajudar?`;

  return (
    <section id="estoque" aria-labelledby="estoque-titulo" className="relative bg-paper py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-2xl">
            <p className={cx(eyebrow, 'flex items-center gap-3 text-red')}>
              <span className="tabular text-ink/35">02</span> Estoque
            </p>
            <h2 id="estoque-titulo" className="mt-5 font-wide text-[clamp(2rem,5vw,3.75rem)] font-[820] uppercase leading-[0.95] tracking-[-0.02em]">
              Explore. Compare.<br />Escolha o seu.
            </h2>
          </Reveal>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <DemoBadge tone="light" label="Estoque demonstrativo" />
            <p className="max-w-xs text-sm text-ink/55 md:text-right">
              Veículos fictícios para ilustrar a experiência. Fotos: publicações da Princecar, usadas como referência visual.
            </p>
          </div>
        </div>

        {/* Busca */}
        <div className="mt-12">
          <label htmlFor="busca" className="sr-only">Buscar veículos</label>
          <div className="group relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-ink/40 transition-colors group-focus-within:text-red" aria-hidden="true" />
            <input
              ref={searchRef}
              id="busca"
              type="search"
              inputMode="search"
              autoComplete="off"
              value={filters.query}
              onChange={(e) => set('query', e.target.value)}
              placeholder="Busque por marca, modelo, versão, cor ou ano"
              className="h-16 w-full rounded-2xl border border-ink/10 bg-white pl-14 pr-14 text-base text-ink shadow-[0_20px_40px_-30px_rgb(11_11_13/0.4)] outline-none transition placeholder:text-ink/40 hover:border-ink/25 focus:border-ink/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red/15 sm:text-[1.05rem] [&::-webkit-search-cancel-button]:hidden"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => {
                  set('query', '');
                  searchRef.current?.focus();
                }}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-ink/50 transition hover:bg-ink/5 hover:text-ink"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        </div>

        {/* Categorias rápidas */}
        <div className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="group" aria-label="Filtrar por categoria">
          {(['', ...CATEGORIES] as const).map((c) => {
            const selected = filters.category === c;
            const count = c ? vehicles.filter((v) => v.category === c).length : vehicles.length;
            return (
              <button
                key={c || 'todos'}
                type="button"
                aria-pressed={selected}
                onClick={() => set('category', c)}
                className={cx(
                  'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition active:scale-95',
                  selected ? 'border-ink bg-ink text-paper' : 'border-ink/12 bg-transparent text-ink/70 hover:border-ink/40 hover:text-ink',
                )}
              >
                {c || 'Todos'}
                <span className={cx('text-xs tabular', selected ? 'text-paper/50' : 'text-ink/35')}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Filtros — desktop */}
        <div className="mt-8 hidden gap-3 lg:grid lg:grid-cols-[repeat(5,minmax(0,1fr))_auto]">
          <FilterFields filters={filters} set={set} />
          <div className="flex items-end">
            <FavoritesToggle count={favorites.size} active={filters.favoritesOnly} onClick={() => set('favoritesOnly', !filters.favoritesOnly)} />
          </div>
        </div>

        {/* Barra de resultados */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 bg-white px-4 text-sm font-semibold transition hover:border-ink/40 lg:hidden"
              aria-haspopup="dialog"
            >
              <SlidersHorizontal className="size-4" />
              Filtros
              {active > 0 && <span className="inline-flex size-5 items-center justify-center rounded-full bg-red text-[0.65rem] font-bold text-white">{active}</span>}
            </button>
            <p className="text-sm text-ink/60" aria-live="polite" aria-atomic="true">
              <strong className="font-semibold text-ink tabular">{results.length}</strong>{' '}
              {results.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasAnything && (
              <button type="button" onClick={clearAll} className="hidden h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink/60 transition hover:bg-ink/5 hover:text-ink sm:inline-flex">
                <RotateCcw className="size-3.5" /> Limpar filtros
              </button>
            )}
            <div className="relative flex items-center">
              <ArrowDownUp className="pointer-events-none absolute left-3.5 size-4 text-ink/50" aria-hidden="true" />
              <label htmlFor="ordenar" className="sr-only">Ordenar por</label>
              <select
                id="ordenar"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-11 appearance-none rounded-full border border-ink/15 bg-white pl-10 pr-4 text-sm font-semibold outline-none transition hover:border-ink/40 focus-visible:ring-2 focus-visible:ring-red/40"
              >
                {SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Filtros ativos */}
        {chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Filtros ativos">
            {chips.map((c) => (
              <li key={c.key}>
                <button
                  type="button"
                  onClick={() => set(c.key, EMPTY_FILTERS[c.key] as never)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ink/[0.06] pl-3 pr-2 text-xs font-semibold text-ink transition hover:bg-ink/10"
                  aria-label={`Remover filtro ${c.label}`}
                >
                  {c.label} <X className="size-3.5 text-ink/50" />
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={clearAll} className="inline-flex h-8 items-center px-2 text-xs font-semibold text-red underline-offset-4 hover:underline">
                Limpar tudo
              </button>
            </li>
          </ul>
        )}

        {/* Favoritos */}
        {favoriteVehicles.length > 0 && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-ink p-4 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="flex items-center gap-3 text-sm">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-red"><Heart className="size-4 fill-current" /></span>
              <span>
                <strong className="font-semibold">{favoriteVehicles.length} {favoriteVehicles.length === 1 ? 'favorito' : 'favoritos'}</strong>
                <span className="text-paper/60"> salvos neste navegador</span>
              </span>
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => set('favoritesOnly', !filters.favoritesOnly)} className={button('ghost', 'sm')}>
                {filters.favoritesOnly ? 'Ver todos' : 'Ver favoritos'}
              </button>
              <a href={contactHref(vehicleMessages.favorites(favoriteVehicles))} target="_blank" rel="noopener noreferrer" className={button('primary', 'sm')}>
                <WhatsAppIcon className="size-4" /> Enviar lista
              </a>
            </div>
          </div>
        )}

        {/* Resultados */}
        {results.length > 0 ? (
          <>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {results.slice(0, visible).map((v, i) => (
                <li key={v.id} className="animate-rise" style={{ animationDelay: `${Math.min(i % PAGE, 8) * 45}ms` }}>
                  <VehicleCard vehicle={v} favorite={favorites.has(v.id)} onToggleFavorite={onToggleFavorite} onOpen={onOpen} />
                </li>
              ))}
            </ul>
            {visible < results.length && (
              <div className="mt-12 flex flex-col items-center gap-3">
                <p className="text-sm text-ink/50 tabular">Exibindo {visible} de {results.length}</p>
                <button type="button" onClick={() => setVisible((n) => n + PAGE)} className={btn.dark}>
                  Mostrar mais veículos
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-[1.5rem] border border-dashed border-ink/15 px-6 py-16 text-center sm:py-20">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-ink/5 text-ink/60">
              <SearchX className="size-6" strokeWidth={1.5} />
            </span>
            <h3 className="mt-6 font-semiwide text-xl font-bold">Nenhum veículo com essa combinação</h3>
            <p className="mt-2 max-w-md text-ink/60">
              {filters.favoritesOnly && favorites.size === 0
                ? 'Você ainda não salvou favoritos. Toque no coração de um veículo para guardá-lo aqui.'
                : 'Tente ampliar a faixa de preço, remover algum filtro ou fale com a nossa equipe — podemos ajudar a encontrar o que você procura.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={clearAll} className={btn.dark}>
                <RotateCcw className="size-4" /> Limpar filtros
              </button>
              <a href={contactHref(helpMessage)} target="_blank" rel="noopener noreferrer" className={btn.ghostDark}>
                <WhatsAppIcon className="size-4" /> Pedir ajuda à equipe
              </a>
            </div>
          </div>
        )}
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        set={set}
        clearAll={clearAll}
        resultCount={results.length}
        favoritesCount={favorites.size}
      />
    </section>
  );
}

type Setter = <K extends keyof Filters>(key: K, value: Filters[K]) => void;

function FilterFields({ filters, set }: { filters: Filters; set: Setter }) {
  return (
    <>
      <Select label="Marca" value={filters.brand} onChange={(v) => set('brand', v)} placeholder="Todas" options={brands.map((b) => ({ value: b, label: b }))} />
      <Select label="Faixa de preço" value={filters.price} onChange={(v) => set('price', v)} placeholder="Qualquer valor" options={PRICE_RANGES.map((p) => ({ value: p.id, label: p.label }))} />
      <Select
        label="Ano"
        value={filters.yearFrom ? String(filters.yearFrom) : ''}
        onChange={(v) => set('yearFrom', v ? Number(v) : null)}
        placeholder="Qualquer ano"
        options={YEAR_OPTIONS.map((y) => ({ value: String(y), label: `A partir de ${y}` }))}
      />
      <Select label="Câmbio" value={filters.transmission} onChange={(v) => set('transmission', v as Filters['transmission'])} placeholder="Todos" options={TRANSMISSIONS.map((t) => ({ value: t, label: t }))} />
      <Select label="Combustível" value={filters.fuel} onChange={(v) => set('fuel', v as Filters['fuel'])} placeholder="Todos" options={FUELS.map((t) => ({ value: t, label: t }))} />
    </>
  );
}

function FavoritesToggle({ count, active, onClick }: { count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition',
        active ? 'border-red bg-red text-white' : 'border-ink/10 bg-white text-ink hover:border-ink/30',
      )}
    >
      <Heart className={cx('size-4', active && 'fill-current')} />
      Favoritos <span className="tabular opacity-60">{count}</span>
    </button>
  );
}

interface SheetProps {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  set: Setter;
  clearAll: () => void;
  resultCount: number;
  favoritesCount: number;
}

/** Painel de filtros no celular (bottom sheet). */
function FilterSheet({ open, onClose, filters, set, clearAll, resultCount, favoritesCount }: SheetProps) {
  useLockBody(open);
  const ref = useDialogA11y(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="presentation">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filtros-titulo"
        className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-[1.75rem] bg-paper text-ink animate-rise"
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-ink/15" aria-hidden="true" />
        <div className="flex items-center justify-between px-6 pb-2 pt-4">
          <h2 id="filtros-titulo" className="font-semiwide text-lg font-bold">Filtros</h2>
          <button type="button" onClick={onClose} aria-label="Fechar filtros" className="inline-flex size-10 items-center justify-center rounded-full hover:bg-ink/5">
            <X className="size-5" />
          </button>
        </div>
        <div className="grid gap-4 overflow-y-auto px-6 pb-6 pt-2">
          <Select
            label="Categoria"
            value={filters.category}
            onChange={(v) => set('category', v as Filters['category'])}
            placeholder="Todas"
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <FilterFields filters={filters} set={set} />
          <FavoritesToggle count={favoritesCount} active={filters.favoritesOnly} onClick={() => set('favoritesOnly', !filters.favoritesOnly)} />
        </div>
        <div className="flex gap-3 border-t border-ink/10 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <button type="button" onClick={clearAll} className={cx(btn.ghostDark, 'flex-1')}>Limpar</button>
          <button type="button" onClick={onClose} className={cx(btn.dark, 'flex-[2]')} data-autofocus>
            Ver {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
          </button>
        </div>
      </div>
    </div>
  );
}
