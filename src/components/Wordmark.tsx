import { cx } from '../lib/ui';

/**
 * Assinatura tipográfica PROVISÓRIA "PRINCECAR" criada para esta proposta.
 * Não é o logotipo oficial da empresa.
 */
export function Wordmark({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  return (
    <span className={cx('inline-flex items-baseline gap-2 leading-none', className)} aria-label="Princecar Veículos">
      <span
        aria-hidden="true"
        className={cx('font-wide text-[1.15rem] font-[850] tracking-[0.06em]', tone === 'light' ? 'text-paper' : 'text-ink')}
      >
        PRINCECAR
        <span className="text-red">.</span>
      </span>
      <span
        aria-hidden="true"
        className={cx(
          'hidden font-semiwide text-[0.58rem] font-semibold uppercase tracking-[0.32em] sm:inline',
          tone === 'light' ? 'text-metal' : 'text-ink/50',
        )}
      >
        Veículos
      </span>
    </span>
  );
}
