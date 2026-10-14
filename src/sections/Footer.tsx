import { ArrowUp, Instagram } from 'lucide-react';
import { business, fullAddress } from '../config/business';
import { Wordmark } from '../components/Wordmark';
import { telHref } from '../lib/whatsapp';
import { NAV } from './Header';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-ink-2 pt-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/55">
              Revenda de veículos seminovos multimarcas em Joinville/SC. {fullAddress}.
            </p>
            <a href={business.instagram.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-paper/80 transition hover:text-paper">
              <Instagram className="size-4" /> {business.instagram.handle}
            </a>
          </div>
          <nav aria-label="Rodapé" className="md:col-span-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-paper/40">Navegação</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.href}><a href={n.href} className="text-sm text-paper/70 transition hover:text-paper">{n.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-paper/40">Contato</p>
            <a href={telHref} className="mt-4 block font-wide text-2xl font-bold tabular transition hover:text-red">{business.phoneDisplay}</a>
            <a href="#inicio" className="mt-8 inline-flex items-center gap-2 text-sm text-paper/60 transition hover:text-paper">
              <ArrowUp className="size-4" /> Voltar ao topo
            </a>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-white/[0.07] p-5 text-xs leading-relaxed text-paper/45">
          <strong className="font-semibold text-paper/70">Proposta conceitual.</strong> Este site é uma demonstração desenvolvida para
          apresentação à Princecar Veículos. Veículos, preços, quilometragens e especificações são fictícios. As fotos foram recortadas de
          publicações do Instagram da loja e usadas apenas como referência visual. A assinatura “PRINCECAR.” é tipográfica e provisória — não
          substitui o logotipo oficial. Não há integração com sistemas de estoque, financiamento ou agendamento.
        </div>

        <p aria-hidden="true" className="pointer-events-none mt-12 select-none whitespace-nowrap text-center font-wide text-[10.2vw] font-[850] leading-[0.8] tracking-[-0.03em] text-white/[0.04] 2xl:text-[9.4rem]">
          PRINCECAR
        </p>
        <div className="flex flex-col gap-2 border-t border-white/[0.07] py-6 text-xs text-paper/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {business.name} · Joinville/SC</p>
          <p>Demonstração — não indexada por buscadores</p>
        </div>
      </div>
    </footer>
  );
}
