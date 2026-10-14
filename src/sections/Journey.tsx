import { ArrowUpRight, CalendarCheck, Heart, MessagesSquare, Navigation, Search } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { WhatsAppIcon } from '../components/Icons';
import { mapsLinks } from '../config/business';
import { contactHref, messages } from '../lib/whatsapp';
import { btn, cx, eyebrow } from '../lib/ui';

const STEPS = [
  { icon: Search, title: 'Explore o estoque', text: 'Busque e filtre por marca, preço, ano, categoria, câmbio e combustível.', href: '#estoque', cta: 'Ver estoque' },
  { icon: Heart, title: 'Escolha seus favoritos', text: 'Salve os carros que chamaram sua atenção e envie a lista para a equipe em um toque.', href: '#estoque', cta: 'Começar a salvar' },
  { icon: MessagesSquare, title: 'Converse com um especialista', text: 'Tire dúvidas pelo WhatsApp com a mensagem já preparada com o veículo de interesse.', href: contactHref(messages.general), cta: 'Abrir WhatsApp', external: true },
  { icon: CalendarCheck, title: 'Agende uma visita', text: 'Combine com a equipe o melhor horário para conhecer o carro pessoalmente.', href: contactHref(messages.visit), cta: 'Combinar visita', external: true },
];

export function Journey() {
  return (
    <section id="jornada" aria-labelledby="jornada-titulo" className="bg-paper py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Reveal className="max-w-3xl">
          <p className={cx(eyebrow, 'flex items-center gap-3 text-red')}>
            <span className="tabular text-ink/35">05</span> Como funciona
          </p>
          <h2 id="jornada-titulo" className="mt-5 font-wide text-[clamp(2rem,4.8vw,3.75rem)] font-[820] uppercase leading-[0.95] tracking-[-0.02em]">
            Da primeira busca à escolha do seu próximo carro.
          </h2>
        </Reveal>

        <ol className="relative mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[2.75rem] hidden h-px bg-ink/10 lg:block" />
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 100} className="relative">
              <a
                href={s.href}
                {...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex h-full flex-col rounded-[1.5rem] border border-ink/[0.07] bg-white p-6 transition duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(11_11_13/0.35)] lg:mr-4 lg:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="relative inline-flex size-11 items-center justify-center rounded-full bg-ink text-paper transition-colors duration-500 group-hover:bg-red">
                    <s.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-wide text-4xl font-[850] text-ink/[0.08] tabular">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-8 font-semiwide text-lg font-bold leading-tight">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">{s.text}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                  {s.cta}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[1.5rem] bg-ink p-6 text-paper sm:p-8 md:flex-row md:items-center">
          <div>
            <p className="font-semiwide text-xl font-bold">Prefere conversar antes?</p>
            <p className="mt-1 text-sm text-paper/60">A equipe atende pelo WhatsApp e recebe você na loja, no bairro Glória.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href={contactHref(messages.general)} target="_blank" rel="noopener noreferrer" className={btn.primary}>
              <WhatsAppIcon className="size-4" /> Falar no WhatsApp
            </a>
            <a href={mapsLinks.directions} target="_blank" rel="noopener noreferrer" className={btn.ghost}>
              <Navigation className="size-4" /> Como chegar
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
