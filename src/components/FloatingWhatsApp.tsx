import { useEffect, useState } from 'react';
import { WhatsAppIcon } from './Icons';
import { contactHref, messages, whatsappAvailable } from '../lib/whatsapp';
import { cx } from '../lib/ui';

/** Botão flutuante de WhatsApp — aparece após a primeira dobra. */
export function FloatingWhatsApp({ hidden }: { hidden?: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  if (!whatsappAvailable) return null;
  const visible = show && !hidden;
  return (
    <a
      href={contactHref(messages.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a Princecar pelo WhatsApp"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cx(
        'group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 inline-flex h-14 items-center gap-0 overflow-hidden rounded-full bg-[#1f9d55] pl-4 pr-4 text-white shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)] transition-all duration-500 ease-out-expo hover:gap-2.5 hover:bg-[#178246] hover:pr-5 focus-visible:gap-2.5 focus-visible:pr-5 sm:right-8',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
      )}
    >
      <WhatsAppIcon className="size-6 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width] duration-500 ease-out-expo group-hover:max-w-40 group-focus-visible:max-w-40">
        Fale com a gente
      </span>
    </a>
  );
}
