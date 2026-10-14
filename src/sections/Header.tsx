import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { WhatsAppIcon } from '../components/Icons';
import { useDialogA11y, useLockBody, useScrolled } from '../hooks/useMisc';
import { business } from '../config/business';
import { contactHref, messages, telHref } from '../lib/whatsapp';
import { btn, button, cx } from '../lib/ui';

export const NAV = [
  { href: '#estoque', label: 'Estoque' },
  { href: '#encontre', label: 'Encontre seu carro' },
  { href: '#destaques', label: 'Destaques' },
  { href: '#princecar', label: 'A Princecar' },
  { href: '#contato', label: 'Contato' },
];

export function Header({ favoritesCount }: { favoritesCount: number }) {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  useLockBody(open);
  const menuRef = useDialogA11y(open, () => setOpen(false));

  useEffect(() => {
    const close = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled || open
            ? 'border-b border-white/[0.07] bg-ink/80 backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className={cx('mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-[height] duration-500 sm:px-8 lg:px-12', scrolled ? 'h-16' : 'h-20')}>
          <a href="#inicio" className="relative z-10 -m-2 rounded p-2" aria-label="Princecar Veículos — início">
            <Wordmark />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group relative rounded-full px-4 py-2 text-[0.84rem] font-medium text-paper/70 transition-colors hover:text-paper"
                  >
                    {item.label}
                    {item.href === '#estoque' && favoritesCount > 0 && (
                      <span className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-red text-[0.65rem] font-bold text-white tabular">
                        {favoritesCount}
                        <span className="sr-only"> favoritos</span>
                      </span>
                    )}
                    <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-red transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={contactHref(messages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(button('primary', 'sm'), 'max-sm:hidden')}
            >
              <WhatsAppIcon className="size-4" />
              Falar no WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              className="relative z-10 inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-paper transition hover:border-white/40 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-ink lg:hidden"
      >
        <div className="flex h-full flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28">
          <nav aria-label="Menu mobile">
            <ul className="space-y-1">
              {NAV.map((item, i) => (
                <li key={item.href} className="animate-rise" style={{ animationDelay: `${60 + i * 50}ms` }}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-white/[0.08] py-4 font-wide text-[1.35rem] font-bold uppercase tracking-tight text-paper"
                  >
                    {item.label}
                    <ArrowUpRight className="size-5 text-metal" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto space-y-3">
            <a href={contactHref(messages.general)} target="_blank" rel="noopener noreferrer" className={cx(btn.primary, 'w-full')}>
              <WhatsAppIcon className="size-5" /> Falar no WhatsApp
            </a>
            <a href={telHref} className={cx(btn.ghost, 'w-full')}>
              Ligar {business.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
