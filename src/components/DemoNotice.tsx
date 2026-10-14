import { useEffect, useState } from 'react';
import { FlaskConical, X } from 'lucide-react';
import { DEMO_DATA_NOTICE } from '../data/vehicles.demo';

const KEY = 'princecar:aviso-demo-fechado';

/** Aviso persistente (e dispensável) de que o site é uma demonstração. */
export function DemoNotice() {
  const [closed, setClosed] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) === '1';
    } catch {
      return false;
    }
  });
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => window.scrollY > window.innerHeight * 0.6 && setShow(true);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  if (closed || !show) return null;
  const close = () => {
    setClosed(true);
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
  };
  return (
    <div role="note" className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-5 z-40 flex max-w-[calc(100vw-7.5rem)] items-center gap-3 rounded-full border border-white/10 bg-ink/85 py-2 pl-3 pr-2 text-paper shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl animate-rise sm:left-8 sm:max-w-md">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-red/15 text-red">
        <FlaskConical className="size-4" />
      </span>
      <p className="min-w-0 text-[0.72rem] leading-snug text-paper/75">
        <strong className="font-semibold text-paper">Proposta conceitual.</strong> <span className="hidden sm:inline">{DEMO_DATA_NOTICE}</span>
        <span className="sm:hidden">Estoque e preços demonstrativos.</span>
      </p>
      <button type="button" onClick={close} aria-label="Fechar aviso" className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-paper/60 transition hover:bg-white/10 hover:text-paper">
        <X className="size-4" />
      </button>
    </div>
  );
}
