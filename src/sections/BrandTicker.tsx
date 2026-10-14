import { brands } from '../data/vehicles.demo';

/** Faixa tipográfica com as marcas presentes no estoque demonstrativo. */
export function BrandTicker() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.07] bg-ink py-5" aria-label="Marcas presentes no estoque demonstrativo">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-ink to-transparent" />
      <ul className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
        {[0, 1].map((dup) =>
          // Duas cópias da lista para o loop contínuo; a segunda é oculta de leitores de tela.
          [...brands, ...brands].map((b, i) => (
            <li
              key={`${dup}-${b}-${i}`}
              aria-hidden={dup === 1 || i >= brands.length ? true : undefined}
              className="flex items-center gap-10 pr-10 font-wide text-sm font-bold uppercase tracking-[0.18em] text-paper/35"
            >
              {b}
              <span className="size-1 rotate-45 bg-red/80" />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
