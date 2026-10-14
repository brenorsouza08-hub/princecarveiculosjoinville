import { useState } from 'react';
import { Clock, ExternalLink, Instagram, MapPin, Navigation, Phone } from 'lucide-react';
import { business, fullAddress, mapsLinks } from '../config/business';
import { Reveal } from '../components/Reveal';
import { WhatsAppIcon } from '../components/Icons';
import { contactHref, messages, telHref, whatsappAvailable } from '../lib/whatsapp';
import { btn, button, cx, eyebrow } from '../lib/ui';

export function Contact() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const rows = [
    { icon: MapPin, label: 'Endereço', value: `${business.address.street}`, sub: `${business.address.district}, ${business.address.city} — ${business.address.state}`, href: mapsLinks.search, external: true },
    { icon: Phone, label: 'Telefone', value: business.phoneDisplay, href: telHref },
    ...(whatsappAvailable ? [{ icon: WhatsAppIcon, label: 'WhatsApp', value: 'Iniciar conversa', sub: 'Mensagem pronta para enviar', href: contactHref(messages.general), external: true }] : []),
    { icon: Instagram, label: 'Instagram', value: business.instagram.handle, href: business.instagram.url, external: true },
  ];

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className={cx(eyebrow, 'flex items-center gap-3 text-red')}>
                <span className="tabular text-paper/40">06</span> Visite a loja
              </p>
              <h2 id="contato-titulo" className="mt-5 font-wide text-[clamp(2.2rem,5vw,4rem)] font-[850] uppercase leading-[0.92] tracking-[-0.02em]">
                Seu próximo carro está a uma visita<span className="text-red">.</span>
              </h2>
            </Reveal>

            <ul className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {rows.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-center gap-5 py-5 transition-colors"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/12 text-paper/80 transition group-hover:border-red group-hover:bg-red group-hover:text-white">
                      <r.icon className="size-[1.1rem]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-paper/45">{r.label}</span>
                      <span className="mt-0.5 block truncate font-semibold text-paper">{r.value}</span>
                      {r.sub && <span className="block text-sm text-paper/55">{r.sub}</span>}
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-paper/30 transition group-hover:text-paper" aria-hidden="true" />
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-5 py-5">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-dashed border-white/20 text-paper/50">
                  <Clock className="size-[1.1rem]" />
                </span>
                <span>
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-paper/45">Horário de funcionamento</span>
                  {business.openingHours ? (
                    business.openingHours.map((h) => (
                      <span key={h.days} className="block text-paper">{h.days}: {h.hours}</span>
                    ))
                  ) : (
                    <span className="mt-0.5 inline-flex items-center gap-2 font-medium text-paper/60">
                      A confirmar com a loja
                      <span className="rounded-full border border-white/15 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-paper/50">pendente</span>
                    </span>
                  )}
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={mapsLinks.directions} target="_blank" rel="noopener noreferrer" className={btn.light}>
                <Navigation className="size-4" /> Traçar rota
              </a>
              <a href={contactHref(messages.visit)} target="_blank" rel="noopener noreferrer" className={btn.ghost}>
                <WhatsAppIcon className="size-4" /> Combinar visita
              </a>
            </div>
          </div>

          {/* Mapa */}
          <Reveal delay={120} className="lg:col-span-7">
            <div className="relative h-[26rem] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-graphite sm:h-[32rem] lg:h-full lg:min-h-[36rem]">
              {mapLoaded && !mapError ? (
                <iframe
                  title={`Mapa: ${fullAddress}`}
                  src={mapsLinks.embed}
                  className="absolute inset-0 h-full w-full grayscale-[0.85] invert-[0.92] hue-rotate-180 contrast-[0.9]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onError={() => setMapError(true)}
                />
              ) : (
                <>
                  {/* Mapa estilizado (placeholder) */}
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
                  <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-white/10" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M-5 62 C 20 58, 35 70, 55 52 S 85 38, 105 44" stroke="currentColor" strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke" />
                    <path d="M30 -5 C 34 25, 44 40, 48 55 S 52 85, 60 105" stroke="currentColor" strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" />
                    <path d="M-5 25 L 105 32" stroke="currentColor" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
                    <path d="M70 -5 L 82 105" stroke="currentColor" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-full sm:top-[42%]">
                    <span className="absolute left-1/2 top-full size-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-red/20 [animation-duration:2.4s]" aria-hidden="true" />
                    <span className="relative flex flex-col items-center">
                      <span className="inline-flex size-14 items-center justify-center rounded-full bg-red text-white shadow-[0_20px_40px_-10px_rgb(227_41_50/0.7)]">
                        <MapPin className="size-6" />
                      </span>
                      <span className="h-5 w-px bg-red" />
                    </span>
                  </div>
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-ink/85 p-5 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6">
                    <p className="font-semiwide font-bold">Princecar Veículos</p>
                    <p className="mt-1 text-sm text-paper/60">{fullAddress}</p>
                    {mapError && <p className="mt-2 text-sm text-red">Não foi possível carregar o mapa. Use o link do Google Maps.</p>}
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button type="button" onClick={() => setMapLoaded(true)} className={button('light', 'sm')}>
                        Carregar mapa interativo
                      </button>
                      <a href={mapsLinks.search} target="_blank" rel="noopener noreferrer" className={button('ghost', 'sm')}>
                        Abrir no Google Maps <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                    <p className="mt-3 text-[0.7rem] text-paper/35">O mapa do Google é carregado apenas quando solicitado.</p>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
