import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Vehicle } from '../data/types';
import { featuredVehicles } from '../data/vehicles.demo';
import { CarImage } from '../components/CarImage';
import { DemoBadge } from '../components/DemoBadge';
import { Reveal } from '../components/Reveal';
import { formatKm, formatPrice } from '../lib/format';
import { cx, eyebrow } from '../lib/ui';

export function Featured({ onOpen }: { onOpen: (v: Vehicle) => void }) {
  const track = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
    setProgress(max > 0 ? el.scrollLeft / max : 1);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section id="destaques" aria-labelledby="destaques-titulo" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-3xl">
            <p className={cx(eyebrow, 'flex items-center gap-3 text-red')}>
              <span className="tabular text-paper/40">01</span> Seleção em destaque
            </p>
            <h2 id="destaques-titulo" className="mt-5 font-wide text-[clamp(2rem,5vw,3.75rem)] font-[820] uppercase leading-[0.95] tracking-[-0.02em]">
              Para quem sabe o que procura.
            </h2>
            <p className="mt-5 max-w-lg text-paper/60">
              Uma vitrine editorial para os veículos que merecem atenção especial — com fotografia em evidência e as informações que importam.
            </p>
          </Reveal>
          <div className="flex items-center gap-4">
            <DemoBadge />
            <div className="flex gap-2">
              <button type="button" onClick={() => scroll(-1)} disabled={!canPrev} aria-label="Destaque anterior" className="inline-flex size-12 items-center justify-center rounded-full border border-white/15 transition hover:border-white/50 hover:bg-white/5 disabled:opacity-30">
                <ArrowLeft className="size-5" />
              </button>
              <button type="button" onClick={() => scroll(1)} disabled={!canNext} aria-label="Próximo destaque" className="inline-flex size-12 items-center justify-center rounded-full border border-white/15 transition hover:border-white/50 hover:bg-white/5 disabled:opacity-30">
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ul
        ref={track}
        onScroll={update}
        className="no-scrollbar mt-14 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto scroll-smooth px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(3rem,calc((100vw-1440px)/2+3rem))] lg:px-[max(3rem,calc((100vw-1440px)/2+3rem))]"
        aria-label="Veículos em destaque"
      >
        {featuredVehicles.map((v, i) => (
          <li key={v.id} className="w-[82vw] shrink-0 snap-start sm:w-[56vw] md:w-[44vw] lg:w-[32vw] xl:w-[27rem]">
            <button
              type="button"
              onClick={() => onOpen(v)}
              className="group block w-full text-left"
              aria-label={`Ver detalhes: ${v.brand} ${v.model} ${v.version}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-graphite">
                <CarImage
                  image={v.image}
                  alt={`${v.brand} ${v.model}`}
                  className="absolute inset-0"
                  imgClassName="photo-grade transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.045]"
                  sizes="(min-width: 1280px) 27rem, (min-width: 1024px) 32vw, 82vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute left-5 top-5 flex items-center gap-2">
                  <span className="rounded-full bg-ink/60 px-3 py-1 font-semiwide text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-paper backdrop-blur-md">{v.category}</span>
                </div>
                <span className="absolute right-5 top-4 font-wide text-5xl font-[850] text-paper/20 tabular">{String(i + 1).padStart(2, '0')}</span>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-paper/60">{v.brand}</p>
                  <p className="mt-1 font-wide text-[1.75rem] font-[820] uppercase leading-none tracking-tight">{v.model}</p>
                  <p className="mt-1.5 text-sm text-paper/70">{v.version}</p>
                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/15 pt-4">
                    <dl className="flex gap-4 text-xs text-paper/70">
                      <div><dt className="sr-only">Ano</dt><dd className="tabular">{v.yearFab}/{v.yearModel}</dd></div>
                      <div><dt className="sr-only">Quilometragem</dt><dd className="tabular">{formatKm(v.km)}</dd></div>
                      <div className="hidden sm:block"><dt className="sr-only">Câmbio</dt><dd>{v.transmission}</dd></div>
                    </dl>
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-red group-hover:text-white">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                  <p className="mt-3 font-semiwide text-lg font-bold tabular">
                    {formatPrice(v.price)}
                    <span className="ml-2 align-middle text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-paper/45">valor demonstrativo</span>
                  </p>
                </div>
              </div>
            </button>
          </li>
        ))}
        <li aria-hidden="true" className="w-1 shrink-0" />
      </ul>

      <div className="mx-auto mt-8 max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="h-px w-full overflow-hidden bg-white/10">
          <div className="h-full origin-left bg-red transition-transform duration-300" style={{ transform: `scaleX(${Math.max(0.12, progress)})` }} />
        </div>
      </div>
    </section>
  );
}
