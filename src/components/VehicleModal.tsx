import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Cog, DoorOpen, Droplet, Fuel, Gauge,
  Heart, Link2, Palette, Phone, Tag, X,
} from 'lucide-react';
import type { Vehicle } from '../data/types';
import { vehicles } from '../data/vehicles.demo';
import { CarImage } from './CarImage';
import { DemoBadge } from './DemoBadge';
import { WhatsAppIcon } from './Icons';
import { useDialogA11y, useLockBody } from '../hooks/useMisc';
import { formatKm, formatPrice } from '../lib/format';
import { similarVehicles } from '../lib/inventory';
import { contactHref, telHref, vehicleMessages } from '../lib/whatsapp';
import { btn, button, cx } from '../lib/ui';

interface Props {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSelect: (v: Vehicle) => void;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
}

interface Frame {
  label: string;
  zoom: number;
  x: number;
  y: number;
}

const framesFor = (v: Vehicle): Frame[] => [
  { label: 'Vista principal', zoom: 1, x: 50, y: 50 },
  ...(v.details ?? []).map((d) => ({ label: d.label, zoom: 2, x: d.x, y: d.y })),
];

export function VehicleModal({ vehicle, onClose, onSelect, favorite, onToggleFavorite }: Props) {
  const open = vehicle !== null;
  useLockBody(open);
  const dialogRef = useDialogA11y(open, onClose);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const [copied, setCopied] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    setFrame(0);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [vehicle?.id]);

  const frames = vehicle ? framesFor(vehicle) : [];
  const go = (dir: 1 | -1) => setFrame((f) => (f + dir + frames.length) % frames.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, select, textarea')) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, frames.length]);

  if (!vehicle) return null;
  const v = vehicle;
  const similar = similarVehicles(v, vehicles);
  const name = `${v.brand} ${v.model}`;

  const share = async () => {
    const url = `${location.origin}${location.pathname}#veiculo/${v.id}`;
    try {
      if (navigator.share) await navigator.share({ title: `${name} ${v.version} — Princecar`, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      /* compartilhamento cancelado */
    }
  };

  const specs = [
    { icon: CalendarDays, label: 'Ano', value: `${v.yearFab}/${v.yearModel}` },
    { icon: Gauge, label: 'Quilometragem', value: formatKm(v.km) },
    { icon: Cog, label: 'Câmbio', value: v.transmission },
    { icon: Fuel, label: 'Combustível', value: v.fuel },
    { icon: Droplet, label: 'Motor', value: v.engine },
    { icon: Palette, label: 'Cor', value: v.color },
    { icon: DoorOpen, label: 'Portas', value: String(v.doors) },
    { icon: Tag, label: 'Categoria', value: v.category },
  ];

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md animate-fade" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="veiculo-titulo"
        className="absolute inset-0 flex flex-col bg-ink text-paper animate-rise sm:inset-4 sm:overflow-hidden sm:rounded-[1.75rem] sm:border sm:border-white/10 lg:inset-x-8 lg:inset-y-6 xl:left-1/2 xl:w-[min(1320px,calc(100vw-4rem))] xl:-translate-x-1/2"
      >
        {/* Topo */}
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] px-4 sm:px-6">
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center gap-2 rounded-full pl-2 pr-4 text-sm font-medium text-paper/70 transition hover:bg-white/5 hover:text-paper">
            <ArrowLeft className="size-4" /> <span>Voltar ao estoque</span>
          </button>
          <div className="flex items-center gap-1.5">
            <DemoBadge className="max-sm:hidden" />
            <button type="button" onClick={share} className="inline-flex size-10 items-center justify-center rounded-full text-paper/70 transition hover:bg-white/5 hover:text-paper" aria-label="Compartilhar link do veículo">
              {copied ? <Check className="size-[1.1rem] text-[#25d366]" /> : <Link2 className="size-[1.1rem]" />}
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite(v.id)}
              aria-pressed={favorite}
              aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              className={cx('inline-flex size-10 items-center justify-center rounded-full transition', favorite ? 'bg-red text-white' : 'text-paper/70 hover:bg-white/5 hover:text-paper')}
            >
              <Heart className={cx('size-[1.1rem]', favorite && 'fill-current')} />
            </button>
            <button type="button" onClick={onClose} aria-label="Fechar detalhes" className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 transition hover:border-white/50" data-autofocus>
              <X className="size-5" />
            </button>
          </div>
        </div>
        <span className="sr-only" aria-live="polite">{copied ? 'Link copiado' : ''}</span>

        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
          <div className="grid lg:grid-cols-12">
            {/* Galeria */}
            <div className="lg:sticky lg:top-0 lg:col-span-7 lg:h-[calc(100svh-3rem-4rem-2px)] lg:self-start lg:p-6 lg:pr-3">
              <div className="flex h-full flex-col">
                <div
                  className="relative aspect-[4/5] max-h-[64svh] w-full overflow-hidden bg-graphite sm:aspect-[4/3] lg:aspect-auto lg:max-h-none lg:flex-1 lg:rounded-[1.25rem]"
                  onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (touchX.current == null) return;
                    const dx = e.changedTouches[0].clientX - touchX.current;
                    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
                    touchX.current = null;
                  }}
                  aria-roledescription="galeria"
                  aria-label={`Fotos de ${name}`}
                >
                  {/* Fundo desfocado para preencher as laterais */}
                  <img src={`/img/cars/${v.image}-sm.webp`} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
                  {/* Quadro com a mesma proporção da foto (4:5) — os pontos de detalhe ficam exatos */}
                  <div className="relative mx-auto aspect-[4/5] h-full max-w-full overflow-hidden">
                    {frames.map((f, i) => (
                      <div key={f.label} className={cx('absolute inset-0 transition-opacity duration-500', i === frame ? 'opacity-100' : 'pointer-events-none opacity-0')} aria-hidden={i !== frame}>
                        <CarImage
                          image={v.image}
                          alt={`${name} — ${f.label}`}
                          className="absolute inset-0"
                          imgClassName="photo-grade"
                          sizes="(min-width: 1024px) 40vw, 100vw"
                          priority={i === 0}
                          style={{ transform: `scale(${f.zoom})`, transformOrigin: `${f.x}% ${f.y}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-ink/70 to-transparent" />
                  <button type="button" onClick={() => go(-1)} aria-label="Foto anterior" className="absolute left-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/55 text-paper backdrop-blur-md transition hover:bg-ink/80">
                    <ChevronLeft className="size-5" />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Próxima foto" className="absolute right-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/55 text-paper backdrop-blur-md transition hover:bg-ink/80">
                    <ChevronRight className="size-5" />
                  </button>
                  <p className="absolute bottom-4 left-4 text-xs font-medium text-paper/85" aria-live="polite">
                    <span className="font-wide font-bold tabular">{frame + 1}</span>
                    <span className="text-paper/50"> / {frames.length}</span>
                    <span className="ml-3 text-paper/70">{frames[frame]?.label}</span>
                  </p>
                </div>
                <div className="flex gap-2 px-4 pt-3 sm:px-6 lg:px-0" role="group" aria-label="Miniaturas">
                  {frames.map((f, i) => (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => setFrame(i)}
                      aria-label={`Ver ${f.label}`}
                      aria-current={i === frame}
                      className={cx(
                        'relative aspect-[4/3] w-20 overflow-hidden rounded-lg ring-2 transition sm:w-24',
                        i === frame ? 'ring-red' : 'opacity-60 ring-transparent hover:opacity-100',
                      )}
                    >
                      <img
                        src={`/img/cars/${v.image}-sm.webp`}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                        style={{ transform: `scale(${f.zoom})`, transformOrigin: `${f.x}% ${f.y}%` }}
                      />
                    </button>
                  ))}
                </div>
                <p className="px-4 pt-3 text-[0.7rem] leading-relaxed text-paper/40 sm:px-6 lg:px-0">
                  Galeria demonstrativa: os quadros de detalhe são ampliações da foto principal. Na versão final, cada anúncio exibe sua galeria completa.
                </p>
              </div>
            </div>

            {/* Informações */}
            <div className="px-5 pb-32 pt-8 sm:px-8 lg:col-span-5 lg:px-8 lg:pb-12 lg:pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-metal">{v.brand}</p>
              <h2 id="veiculo-titulo" className="mt-2 font-wide text-[clamp(2rem,4vw,3rem)] font-[850] uppercase leading-[0.95] tracking-tight">
                {v.model}
              </h2>
              <p className="mt-2 text-lg text-paper/70">{v.version}</p>

              <div className="mt-7 rounded-2xl border border-white/10 bg-graphite/60 p-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-paper/45">Preço demonstrativo</p>
                <p className="mt-1 font-semiwide text-[2rem] font-bold leading-none tracking-tight tabular">{formatPrice(v.price)}</p>
                <p className="mt-2 text-xs text-paper/45">Valor fictício, usado apenas para ilustrar a experiência. Consulte a equipe para condições reais.</p>
              </div>

              <div className="mt-6 hidden gap-3 sm:grid">
                <a href={contactHref(vehicleMessages.availability(v))} target="_blank" rel="noopener noreferrer" className={button('primary', 'lg')}>
                  <WhatsAppIcon className="size-5" /> Consultar disponibilidade
                </a>
                <div className="grid grid-cols-2 gap-3">
                  <a href={contactHref(vehicleMessages.negotiate(v))} target="_blank" rel="noopener noreferrer" className={btn.ghost}>
                    Negociar pelo WhatsApp
                  </a>
                  <a href={telHref} className={btn.ghost}>
                    <Phone className="size-4" /> Ligar para a loja
                  </a>
                </div>
              </div>

              <h3 className="mt-10 font-semiwide text-sm font-bold uppercase tracking-[0.18em] text-paper/80">Ficha técnica</h3>
              <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-ink p-4">
                    <dt className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-paper/45">
                      <Icon className="size-3.5" aria-hidden="true" /> {label}
                    </dt>
                    <dd className="mt-1.5 font-medium tabular">{value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-10 font-semiwide text-sm font-bold uppercase tracking-[0.18em] text-paper/80">Itens em destaque</h3>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {v.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-paper/75">
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-red/15 text-red"><Check className="size-3" strokeWidth={3} /></span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-12 border-t border-white/10 pt-8">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semiwide text-sm font-bold uppercase tracking-[0.18em] text-paper/80">Você também pode gostar</h3>
                </div>
                <ul className="mt-5 grid gap-3">
                  {similar.map((s) => (
                    <li key={s.id}>
                      <button type="button" onClick={() => onSelect(s)} className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.08] p-2.5 pr-4 text-left transition hover:border-white/25 hover:bg-white/[0.03]">
                        <CarImage image={s.image} alt="" className="size-20 shrink-0 rounded-xl" imgClassName="photo-grade" sizes="80px" style={{ objectPosition: '50% 58%' }} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-metal">{s.brand} · {s.yearModel}</span>
                          <span className="mt-0.5 block truncate font-semiwide font-bold">{s.model} <span className="font-sans text-sm font-normal text-paper/60">{s.version}</span></span>
                          <span className="mt-1 block text-sm text-paper/70 tabular">{formatPrice(s.price)} <span className="text-paper/35">· {formatKm(s.km)}</span></span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-paper/40 transition group-hover:translate-x-0.5 group-hover:text-paper" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Barra fixa no celular */}
        <div className="absolute inset-x-0 bottom-0 flex gap-2 border-t border-white/10 bg-ink/90 px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden">
          <a href={telHref} aria-label="Ligar para a loja" className={button('ghost', 'icon')}>
            <Phone className="size-4" />
          </a>
          <a href={contactHref(vehicleMessages.negotiate(v))} target="_blank" rel="noopener noreferrer" className={cx(button('ghost', 'bar'), 'flex-1')}>
            Negociar
          </a>
          <a href={contactHref(vehicleMessages.availability(v))} target="_blank" rel="noopener noreferrer" className={cx(button('primary', 'bar'), 'flex-[1.6]')}>
            <WhatsAppIcon className="size-4" /> Disponibilidade
          </a>
        </div>
      </div>
    </div>
  );
}
