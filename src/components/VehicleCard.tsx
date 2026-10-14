import { ArrowRight, CalendarDays, Cog, Fuel, Gauge, Heart } from 'lucide-react';
import type { Vehicle } from '../data/types';
import { CarImage } from './CarImage';
import { WhatsAppIcon } from './Icons';
import { formatKm, formatPrice } from '../lib/format';
import { contactHref, vehicleMessages } from '../lib/whatsapp';
import { cx } from '../lib/ui';

interface Props {
  vehicle: Vehicle;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (v: Vehicle) => void;
  tone?: 'light' | 'dark';
}

export function VehicleCard({ vehicle: v, favorite, onToggleFavorite, onOpen, tone = 'light' }: Props) {
  const dark = tone === 'dark';
  const name = `${v.brand} ${v.model} ${v.version}`;
  return (
    <article
      className={cx(
        '@container group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] transition-[box-shadow,transform,border-color] duration-500 ease-out-expo hover:-translate-y-1',
        dark
          ? 'border border-white/[0.08] bg-graphite hover:border-white/20 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)]'
          : 'border border-ink/[0.07] bg-white hover:shadow-[0_30px_60px_-28px_rgb(11_11_13/0.35)]',
      )}
    >
      <div className="relative">
        <button type="button" onClick={() => onOpen(v)} className="block w-full" tabIndex={-1} aria-hidden="true">
          <CarImage
            image={v.image}
            alt=""
            tone={dark ? 'dark' : 'light'}
            className="aspect-[1/1] w-full"
            imgClassName="photo-grade transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.05]"
            style={{ objectPosition: '50% 58%' }}
            sizes="(min-width: 1536px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
          />
        </button>
        <span className="pointer-events-none absolute left-3.5 top-3.5 rounded-full bg-ink/60 px-2.5 py-1 font-semiwide text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-paper backdrop-blur-md">
          {v.category}
        </span>
        <button
          type="button"
          onClick={() => onToggleFavorite(v.id)}
          aria-pressed={favorite}
          aria-label={favorite ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`}
          className={cx(
            'absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 active:scale-90',
            favorite ? 'bg-red text-white' : 'bg-ink/45 text-paper hover:bg-ink/70',
          )}
        >
          <Heart className={cx('size-[1.1rem] transition-transform', favorite && 'fill-current')} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className={cx('text-[0.7rem] font-semibold uppercase tracking-[0.18em]', dark ? 'text-metal' : 'text-ink/45')}>{v.brand}</p>
        <h3 className="mt-1">
          <button
            type="button"
            onClick={() => onOpen(v)}
            className={cx('text-left font-semiwide text-[1.2rem] font-bold leading-tight tracking-tight after:absolute after:inset-0 after:content-[""] focus-visible:outline-none', dark ? 'text-paper' : 'text-ink')}
          >
            {v.model} <span className={cx('font-sans text-[0.95rem] font-medium', dark ? 'text-paper/60' : 'text-ink/55')}>{v.version}</span>
          </button>
        </h3>

        <dl className={cx('mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 text-[0.82rem]', dark ? 'text-paper/75' : 'text-ink/70')}>
          <Spec icon={CalendarDays} label="Ano" value={`${v.yearFab}/${v.yearModel}`} />
          <Spec icon={Gauge} label="Quilometragem" value={formatKm(v.km)} />
          <Spec icon={Cog} label="Câmbio" value={v.transmission} />
          <Spec icon={Fuel} label="Combustível" value={v.fuel} />
        </dl>

        <div className={cx('mt-5 border-t pt-4', dark ? 'border-white/10' : 'border-ink/[0.07]')}>
          <p className={cx('font-semiwide text-[1.35rem] font-bold tabular tracking-tight', dark ? 'text-paper' : 'text-ink')}>{formatPrice(v.price)}</p>
          <p className={cx('text-[0.62rem] font-semibold uppercase tracking-[0.16em]', dark ? 'text-paper/40' : 'text-ink/40')}>Valor demonstrativo</p>
        </div>

        <div className="relative z-10 mt-5 flex gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => onOpen(v)}
            className={cx(
              'group/btn inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full text-[0.84rem] font-semibold transition active:scale-[0.97]',
              dark ? 'bg-paper text-ink hover:bg-white' : 'bg-ink text-paper hover:bg-graphite',
            )}
          >
            Ver detalhes
            <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
          <a
            href={contactHref(vehicleMessages.availability(v))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar ${name} pelo WhatsApp`}
            title="Consultar pelo WhatsApp"
            className={cx(
              'inline-flex h-11 items-center justify-center gap-2 rounded-full border px-4 text-[0.84rem] font-semibold transition active:scale-[0.97]',
              dark ? 'border-white/15 text-paper hover:border-[#25d366] hover:text-[#25d366]' : 'border-ink/15 text-ink hover:border-[#1f9d55] hover:text-[#1f9d55]',
            )}
          >
            <WhatsAppIcon className="size-[1.1rem]" />
            <span className="hidden @[19rem]:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon className="size-4 shrink-0 opacity-50" strokeWidth={1.75} aria-hidden="true" />
      <dt className="sr-only">{label}</dt>
      <dd className="truncate tabular">{value}</dd>
    </div>
  );
}
