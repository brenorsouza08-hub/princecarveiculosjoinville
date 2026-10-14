import type { CSSProperties, ReactNode } from 'react';
import { ExternalLink, Quote, Star } from 'lucide-react';
import { business, mapsLinks } from '../config/business';
import { Reveal } from '../components/Reveal';
import { useCountUp, useInView } from '../hooks/useMisc';
import { formatInt } from '../lib/format';
import { cx, eyebrow } from '../lib/ui';

function Stat({ value, decimals = 0, prefix = '', suffix, label, detail, start, delay }: {
  value: number; decimals?: number; prefix?: string; suffix?: ReactNode; label: string; detail?: string; start: boolean; delay: number;
}) {
  const n = useCountUp(value, start, 1800, decimals);
  const display = decimals ? n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : formatInt(n);
  return (
    <div className="reveal border-t border-white/15 pt-6" data-shown={start} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      <p className="flex items-baseline font-wide text-[clamp(3.2rem,7vw,5.6rem)] font-[850] leading-none tracking-[-0.04em] tabular">
        {prefix && <span className="mr-1 text-red">{prefix}</span>}
        {display}
        {suffix}
      </p>
      <p className="mt-4 font-semiwide text-sm font-bold uppercase tracking-[0.16em]">{label}</p>
      {detail && <p className="mt-1 text-sm text-paper/50">{detail}</p>}
    </div>
  );
}

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cx('relative inline-flex', className)} role="img" aria-label={`Nota ${rating.toLocaleString('pt-BR')} de 5`}>
      <span className="flex gap-0.5 text-white/15">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-4 fill-current" />)}</span>
      <span className="absolute inset-0 flex gap-0.5 overflow-hidden text-[#f5b700]" style={{ width: `${(rating / 5) * 100}%` }}>
        {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-4 shrink-0 fill-current" />)}
      </span>
    </span>
  );
}

export function Story() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { stats } = business;

  return (
    <section id="princecar" aria-labelledby="princecar-titulo" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className={cx(eyebrow, 'flex items-center gap-3 text-red')}>
              <span className="tabular text-paper/40">04</span> A Princecar
            </p>
            <h2 id="princecar-titulo" className="mt-5 font-wide text-[clamp(2rem,4.8vw,3.75rem)] font-[820] uppercase leading-[0.95] tracking-[-0.02em]">
              Confiança não se anuncia. <span className="text-paper/40">Se constrói.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="flex flex-col justify-end gap-6 lg:col-span-5">
            <p className="text-lg leading-relaxed text-paper/65">
              São {stats.years} anos fazendo parte da história de quem compra carro em Joinville. Uma revenda multimarcas com
              atendimento próximo, estoque variado e conversa direta com a equipe.
            </p>
            <div className="flex items-center gap-4">
              <img src="/img/princecar-selo-atual.png" alt="Selo atual da Princecar Veículos — Desde 2000" width={64} height={64} className="size-16 rounded-full" loading="lazy" />
              <p className="text-xs leading-relaxed text-paper/45">
                Selo atual da marca.<br />A assinatura “PRINCECAR.” deste site é uma proposta tipográfica provisória.
              </p>
            </div>
          </Reveal>
        </div>

        <div ref={ref} className="mt-20 grid gap-10 sm:grid-cols-3 sm:gap-8">
          <Stat value={stats.years} label="Anos de confiança" detail="Atendendo Joinville e região" start={inView} delay={0} />
          <Stat value={stats.carsSold} prefix="+" label="Carros vendidos" detail="Histórico informado pela loja" start={inView} delay={120} />
          <Stat
            value={stats.googleRating}
            decimals={1}
            suffix={<Star className="ml-3 size-[0.42em] self-center fill-[#f5b700] text-[#f5b700]" aria-hidden="true" />}
            label="Nota no Google"
            detail={`Cerca de ${stats.googleReviews} avaliações`}
            start={inView}
            delay={240}
          />
        </div>
        <p className="mt-6 text-xs text-paper/35">Indicadores informados pela empresa para este projeto — validar antes da publicação.</p>

        {/* Avaliações — layout preparado */}
        <div className="mt-24 rounded-[1.75rem] border border-white/[0.08] bg-graphite/50 p-6 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">Avaliações no Google</p>
              <div className="mt-3 flex items-center gap-4">
                <span className="font-wide text-4xl font-[850] tabular">{stats.googleRating.toLocaleString('pt-BR')}</span>
                <div>
                  <Stars rating={stats.googleRating} />
                  <p className="mt-1 text-sm text-paper/55">Aprox. {stats.googleReviews} avaliações</p>
                </div>
              </div>
            </div>
            <a href={mapsLinks.reviews} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 self-start rounded-full border border-white/15 px-5 text-sm font-semibold transition hover:border-white/50 md:self-auto">
              Ver avaliações no Google <ExternalLink className="size-4" />
            </a>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Espaços reservados para avaliações reais">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex flex-col rounded-2xl border border-dashed border-white/12 p-6">
                <div className="flex items-center justify-between">
                  <Quote className="size-6 text-red/70" aria-hidden="true" />
                  <Stars rating={5} className="opacity-30" />
                </div>
                <div className="mt-6 space-y-2.5" aria-hidden="true">
                  <div className="h-2.5 w-full rounded-full bg-white/[0.07]" />
                  <div className="h-2.5 w-[92%] rounded-full bg-white/[0.07]" />
                  <div className="h-2.5 w-[70%] rounded-full bg-white/[0.07]" />
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <span className="size-9 rounded-full bg-white/[0.07]" aria-hidden="true" />
                  <span className="text-xs text-paper/45">Espaço para avaliação real do Google</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-paper/40">
            Layout demonstrativo: nenhuma frase foi atribuída a clientes. As avaliações reais podem ser exibidas aqui após validação
            (por exemplo, via Perfil da Empresa no Google).
          </p>
        </div>
      </div>
    </section>
  );
}
