import { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Briefcase, Building2, Car, CarFront, Check, Mountain, Package, RotateCcw, Route, Shuffle,
  SlidersHorizontal, Truck, Users, type LucideIcon,
} from 'lucide-react';
import type { Category, Transmission, Vehicle } from '../data/types';
import { vehicles } from '../data/vehicles.demo';
import { VehicleCard } from '../components/VehicleCard';
import { WhatsAppIcon } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { DemoBadge } from '../components/DemoBadge';
import { EMPTY_FILTERS, PRICE_RANGES, matchVehicles, type Filters, type Preferences } from '../lib/inventory';
import { contactHref } from '../lib/whatsapp';
import { btn, button, cx, eyebrow } from '../lib/ui';

interface Option<T> {
  value: T;
  label: string;
  hint?: string;
  icon?: LucideIcon;
  glyph?: string;
}

interface Step<K extends keyof Preferences> {
  key: K;
  title: string;
  question: string;
  options: Option<NonNullable<Preferences[K]>>[];
}

const STEPS = [
  {
    key: 'category',
    title: 'Categoria',
    question: 'Qual categoria você procura?',
    options: [
      { value: 'Hatch', label: 'Hatch', hint: 'Compacto e ágil', icon: Car },
      { value: 'Sedan', label: 'Sedan', hint: 'Conforto e porta-malas', icon: CarFront },
      { value: 'SUV', label: 'SUV', hint: 'Posição de dirigir elevada', icon: Mountain },
      { value: 'Picape', label: 'Picape', hint: 'Versatilidade com caçamba', icon: Truck },
      { value: 'Utilitário', label: 'Utilitário', hint: 'Feito para o trabalho', icon: Package },
      { value: 'any', label: 'Estou aberto', hint: 'Quero ver opções', icon: Shuffle },
    ],
  } satisfies Step<'category'>,
  {
    key: 'budget',
    title: 'Investimento',
    question: 'Qual faixa de preço pretende considerar?',
    options: [
      ...PRICE_RANGES.map((p) => ({ value: p.id, label: p.label, glyph: 'R$' })),
      { value: 'any', label: 'Ainda não defini', hint: 'Quero conhecer as opções', icon: Shuffle },
    ],
  } satisfies Step<'budget'>,
  {
    key: 'transmission',
    title: 'Câmbio',
    question: 'Prefere câmbio automático ou manual?',
    options: [
      { value: 'Automático', label: 'Automático', hint: 'Conforto no trânsito', glyph: 'A' },
      { value: 'Manual', label: 'Manual', hint: 'Controle total', glyph: 'M' },
      { value: 'any', label: 'Tanto faz', hint: 'Os dois me atendem', icon: Shuffle },
    ],
  } satisfies Step<'transmission'>,
  {
    key: 'usage',
    title: 'Uso principal',
    question: 'Qual será o principal uso do veículo?',
    options: [
      { value: 'cidade', label: 'Dia a dia na cidade', hint: 'Economia e praticidade', icon: Building2 },
      { value: 'familia', label: 'Família', hint: 'Espaço e conforto', icon: Users },
      { value: 'trabalho', label: 'Trabalho e carga', hint: 'Robustez e capacidade', icon: Briefcase },
      { value: 'estrada', label: 'Viagens e estrada', hint: 'Desempenho e estabilidade', icon: Route },
    ],
  } satisfies Step<'usage'>,
] as const;

const EMPTY: Preferences = { category: null, budget: null, transmission: null, usage: null };

const answerLabel = (p: Preferences, i: number) => {
  const step = STEPS[i];
  const value = p[step.key];
  if (!value) return null;
  return (step.options as readonly Option<string>[]).find((o) => o.value === value)?.label ?? null;
};

export function Finder({ onOpen, favorites, onToggleFavorite, onApplyToInventory }: {
  onOpen: (v: Vehicle) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onApplyToInventory: (f: Filters) => void;
}) {
  const [prefs, setPrefs] = useState<Preferences>(EMPTY);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<number | undefined>(undefined);

  const result = useMemo(() => (done ? matchVehicles(vehicles, prefs) : null), [done, prefs]);
  const current = STEPS[step];

  const focusPanel = () => requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));

  const choose = (value: string) => {
    setPrefs((p) => ({ ...p, [current.key]: value }));
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      if (step < STEPS.length - 1) setStep(step + 1);
      else setDone(true);
      focusPanel();
    }, 260);
  };

  const restart = () => {
    setPrefs(EMPTY);
    setStep(0);
    setDone(false);
    focusPanel();
  };
  const adjust = () => {
    setDone(false);
    setStep(0);
    focusPanel();
  };

  const summary = STEPS.map((_, i) => answerLabel(prefs, i)).filter(Boolean).join(' · ');
  const profileMessage = `Olá, Princecar! Usei o "Encontre seu próximo carro" no site. Meu perfil: ${STEPS.map(
    (s, i) => `${s.title}: ${answerLabel(prefs, i) ?? '—'}`,
  ).join('; ')}. Podem me indicar opções?`;

  const applyToInventory = () =>
    onApplyToInventory({
      ...EMPTY_FILTERS,
      category: prefs.category && prefs.category !== 'any' ? (prefs.category as Category) : '',
      price: prefs.budget && prefs.budget !== 'any' ? prefs.budget : '',
      transmission: prefs.transmission && prefs.transmission !== 'any' ? (prefs.transmission as Transmission) : '',
    });

  const shown = result ? (result.exact.length ? result.exact : result.close) : [];

  return (
    <section id="encontre" aria-labelledby="encontre-titulo" className="relative overflow-hidden bg-graphite py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-0 size-[40rem] rounded-full bg-red/[0.07] blur-[120px]" />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Coluna de contexto */}
          <div className="lg:col-span-4">
            <Reveal>
              <p className={cx(eyebrow, 'flex items-center gap-3 text-red')}>
                <span className="tabular text-paper/40">03</span> Experiência guiada
              </p>
              <h2 id="encontre-titulo" className="mt-5 font-wide text-[clamp(2rem,4.4vw,3.4rem)] font-[820] uppercase leading-[0.95] tracking-[-0.02em]">
                Encontre seu próximo carro
              </h2>
              <p className="mt-5 max-w-sm text-paper/60">
                Quatro perguntas rápidas. No final, mostramos os veículos que combinam com o seu momento.
              </p>
            </Reveal>

            <ol className="mt-10 hidden space-y-1 lg:block" aria-label="Etapas">
              {STEPS.map((s, i) => {
                const answered = answerLabel(prefs, i);
                const isCurrent = !done && i === step;
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      disabled={!answered && !isCurrent}
                      onClick={() => {
                        setDone(false);
                        setStep(i);
                      }}
                      className={cx(
                        'flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition',
                        isCurrent ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03] disabled:hover:bg-transparent',
                      )}
                    >
                      <span
                        className={cx(
                          'inline-flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold tabular transition',
                          answered ? 'border-red bg-red text-white' : isCurrent ? 'border-paper text-paper' : 'border-white/15 text-paper/40',
                        )}
                      >
                        {answered ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className={cx('block text-sm font-semibold', isCurrent || answered ? 'text-paper' : 'text-paper/40')}>{s.title}</span>
                        {answered && <span className="block truncate text-xs text-paper/50">{answered}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Painel interativo */}
          <div className="lg:col-span-8">
            <div
              ref={panelRef}
              tabIndex={-1}
              className="relative rounded-[1.75rem] border border-white/[0.08] bg-ink/70 p-5 outline-none backdrop-blur sm:p-8 lg:p-10"
              aria-live="polite"
            >
              {!done ? (
                <div key={step} className="animate-rise">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">
                      Passo <span className="text-paper tabular">{step + 1}</span> de {STEPS.length}
                    </p>
                    {step > 0 && (
                      <button type="button" onClick={() => setStep(step - 1)} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-paper/60 transition hover:bg-white/5 hover:text-paper">
                        <ArrowLeft className="size-4" /> Voltar
                      </button>
                    )}
                  </div>
                  <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-red transition-[width] duration-700 ease-out-expo" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
                  </div>

                  <h3 className="mt-8 font-semiwide text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight">{current.question}</h3>

                  <div role="radiogroup" aria-label={current.question} className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {(current.options as readonly Option<string>[]).map((o) => {
                      const selected = prefs[current.key] === o.value;
                      const Icon = o.icon;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => choose(o.value)}
                          className={cx(
                            'group relative flex min-h-[5.5rem] items-center gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 active:scale-[0.98] sm:min-h-[7rem] sm:flex-col sm:items-start sm:justify-between sm:p-5',
                            selected
                              ? 'border-red bg-red/10'
                              : 'border-white/10 bg-white/[0.02] hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.05]',
                          )}
                        >
                          <span className={cx('inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors', selected ? 'bg-red text-white' : 'bg-white/[0.06] text-paper/80 group-hover:text-paper')}>
                            {Icon ? <Icon className="size-5" strokeWidth={1.75} /> : <span className="font-wide text-[0.8rem] font-[850]">{o.glyph}</span>}
                          </span>
                          <span>
                            <span className="block font-semibold text-paper">{o.label}</span>
                            {o.hint && <span className="mt-0.5 block text-xs text-paper/50">{o.hint}</span>}
                          </span>
                          {selected && <Check className="absolute right-4 top-4 size-4 text-red" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="animate-rise">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red">Seu perfil</p>
                      <h3 className="mt-2 font-semiwide text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-tight">
                        {result?.exact.length
                          ? `${result.exact.length} ${result.exact.length === 1 ? 'veículo combina' : 'veículos combinam'} com você`
                          : 'Nenhuma combinação exata — mas temos alternativas'}
                      </h3>
                      <p className="mt-2 text-sm text-paper/55">{summary}</p>
                    </div>
                    <DemoBadge className="self-start" label="Resultados demonstrativos" />
                  </div>

                  {!result?.exact.length && (
                    <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-paper/70">
                      {result?.close.length
                        ? 'Os veículos abaixo atendem quase todas as suas preferências (diferem em apenas um critério). Você também pode ajustar suas respostas ou falar com a equipe.'
                        : 'Não encontramos veículos próximos do seu perfil no estoque demonstrativo. Ajuste as preferências ou envie seu perfil para a equipe — ela pode ajudar a encontrar o carro ideal.'}
                    </p>
                  )}

                  {shown.length > 0 && (
                    <ul className="mt-8 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                      {shown.slice(0, 6).map((v) => (
                        <li key={v.id}>
                          <VehicleCard vehicle={v} tone="dark" favorite={favorites.has(v.id)} onToggleFavorite={onToggleFavorite} onOpen={onOpen} />
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:flex-wrap">
                    <a href={contactHref(profileMessage)} target="_blank" rel="noopener noreferrer" className={btn.primary}>
                      <WhatsAppIcon className="size-4" /> Enviar meu perfil para um consultor
                    </a>
                    <button type="button" onClick={applyToInventory} className={btn.ghost}>
                      Ver no estoque <ArrowRight className="size-4" />
                    </button>
                    <button type="button" onClick={adjust} className={btn.ghost}>
                      <SlidersHorizontal className="size-4" /> Ajustar preferências
                    </button>
                    <button type="button" onClick={restart} className={button('subtle')}>
                      <RotateCcw className="size-4" /> Recomeçar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
