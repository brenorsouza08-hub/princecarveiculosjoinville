import { FlaskConical } from 'lucide-react';
import { cx } from '../lib/ui';

/** Selo que identifica conteúdo demonstrativo. */
export function DemoBadge({ className, tone = 'dark', label = 'Demonstrativo' }: { className?: string; tone?: 'dark' | 'light' | 'glass'; label?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em]',
        tone === 'dark' && 'border border-white/15 text-paper/70',
        tone === 'light' && 'border border-ink/15 text-ink/60',
        tone === 'glass' && 'bg-ink/55 text-paper/85 backdrop-blur-md',
        className,
      )}
    >
      <FlaskConical className="size-3" strokeWidth={2} aria-hidden="true" />
      {label}
    </span>
  );
}
