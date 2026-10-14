import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Compass } from 'lucide-react';
import { carSrc } from '../components/CarImage';
import { CarLine } from '../components/Icons';
import { usePrefersReducedMotion } from '../hooks/useMisc';
import { button, cx, eyebrow } from '../lib/ui';

/** Fotos do pátio da Princecar (recortes do Instagram, usados como referência visual). */
const SLIDES = [
  { image: 'civic', label: 'Sedan', title: 'Honda Civic', position: '30% 55%' },
  { image: 'x1', label: 'SUV', title: 'BMW X1', position: '38% 55%' },
  { image: 'fastback', label: 'SUV coupé', title: 'Fiat Fastback', position: '42% 55%' },
  { image: 'tracker', label: 'SUV', title: 'Chevrolet Tracker', position: '50% 55%' },
];
const INTERVAL = 6500;

const HEADLINE = [
  { text: 'Seu próximo', className: '' },
  { text: 'capítulo', className: 'text-outline' },
  { text: 'começa ao', className: '' },
  { text: 'volante', className: '', dot: true },
];

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, paused, reduced]);

  const current = SLIDES[index];

  return (
    <section id="inicio" aria-label="Apresentação" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      {/* Fotografia */}
      <div className="absolute inset-0 -z-10 overflow-hidden lg:left-[42%]" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div
            key={s.image}
            className={cx('absolute inset-0 transition-opacity duration-[1600ms] ease-cinema', i === index ? 'opacity-100' : 'opacity-0')}
          >
            <img
              src={carSrc(s.image, 'lg')}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              decoding="async"
              className={cx('photo-cinema h-full w-full object-cover', i === index && !reduced && 'animate-kenburns')}
              style={{ objectPosition: s.position }}
            />
          </div>
        ))}
        {/* Iluminação e vinheta */}
        <div className="absolute inset-0 bg-linear-to-t from-ink from-30% via-ink/60 to-ink/15 lg:bg-linear-to-r lg:from-ink lg:from-5% lg:via-ink/45 lg:via-40% lg:to-ink/5" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink via-ink/70 to-transparent lg:h-1/3" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_40%,transparent_40%,rgb(11_11_13/0.75)_100%)]" />
        <div className="grain absolute inset-0" />
      </div>

      {/* Linha vermelha vertical (detalhe editorial) */}
      <div aria-hidden="true" className="absolute left-[42%] top-0 hidden h-full w-px bg-linear-to-b from-transparent via-white/10 to-transparent lg:block" />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-10 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pb-12 lg:pt-40">
        <div className="mt-auto grid gap-10 lg:my-auto lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8 xl:col-span-7">
            <p className={cx(eyebrow, 'flex items-center gap-3 text-paper/70 animate-rise')}>
              <span className="h-px w-10 bg-red" />
              Seminovos multimarcas · Joinville/SC
            </p>

            <h1 className="mt-6 font-wide text-[clamp(2.3rem,9.6vw,3.6rem)] sm:text-[clamp(3.4rem,7.4vw,5.2rem)] lg:text-[clamp(3.6rem,5.4vw,5.4rem)] font-[850] uppercase leading-[0.9] tracking-[-0.025em] text-paper sm:mt-8">
              {HEADLINE.map((line, i) => (
                <span key={line.text} className="block overflow-hidden pb-[0.06em]">
                  <span className={cx('block animate-rise', line.className)} style={{ animationDelay: `${150 + i * 110}ms` }}>
                    {line.text}
                    {line.dot && <span className="text-red">.</span>}
                  </span>
                </span>
              ))}
            </h1>

            <p className="mt-7 max-w-[30rem] text-[1.02rem] leading-relaxed text-paper/70 animate-rise [animation-delay:650ms] sm:text-lg">
              Encontre um carro que combine com sua vida. Explore nosso estoque e descubra seu próximo destino.
            </p>

            <div className="mt-9 flex flex-col gap-3 animate-rise [animation-delay:780ms] sm:flex-row sm:items-center">
              <a href="#estoque" className={button('primary', 'lg')}>
                Explorar veículos
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </a>
              <a href="#encontre" className={cx(button('ghost', 'lg'), 'backdrop-blur-sm')}>
                <Compass className="size-4 transition-transform duration-500 group-hover/btn:rotate-45" />
                Encontrar meu próximo carro
              </a>
            </div>
          </div>

          {/* Indicadores do slideshow */}
          <div
            className="animate-fade rounded-2xl border border-white/10 bg-ink/55 p-5 backdrop-blur-md [animation-delay:1100ms] lg:col-span-4 lg:col-start-9"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="flex items-end justify-between gap-6">
              <div aria-live="polite" className="min-w-0">
                <p className="font-semiwide text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-red">{current.label}</p>
                <p className="mt-1.5 truncate font-semiwide text-lg font-bold text-paper">{current.title}</p>
                <p className="mt-1 text-xs text-paper/55">Fotos do pátio Princecar · ilustrativas</p>
              </div>
              <p className="shrink-0 font-wide text-sm font-bold text-paper/80 tabular">
                {String(index + 1).padStart(2, '0')}
                <span className="text-paper/30"> / {String(SLIDES.length).padStart(2, '0')}</span>
              </p>
            </div>
            <div className="mt-3 flex gap-2" role="group" aria-label="Escolher imagem de destaque">
              {SLIDES.map((s, i) => (
                <button
                  key={s.image}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Mostrar ${s.title}`}
                  aria-current={i === index}
                  className="group relative h-6 flex-1"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/15 transition-colors group-hover:bg-white/30">
                    {i < index && <span className="absolute inset-0 bg-paper/70" />}
                    {i === index && (
                      <span
                        key={`${index}-${paused}-${reduced}`}
                        className={cx('absolute inset-0 origin-left bg-paper', !reduced && !paused && 'animate-progress')}
                        style={{ animationDuration: `${INTERVAL}ms` }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pista de rolagem */}
        <div className="mt-12 hidden items-end justify-between lg:flex">
          <a href="#destaques" className="group flex items-center gap-4 text-xs font-medium uppercase tracking-[0.24em] text-paper/50 transition-colors hover:text-paper">
            <span className="relative block h-12 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-0 bg-red animate-scrollcue" />
            </span>
            Role para explorar
            <ArrowDown className="size-3.5 transition-transform group-hover:translate-y-0.5" />
          </a>
          <CarLine animate className="h-10 w-auto text-paper/25" />
        </div>
      </div>
    </section>
  );
}
