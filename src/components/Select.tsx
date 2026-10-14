import { ChevronDown } from 'lucide-react';
import { useId } from 'react';
import { cx } from '../lib/ui';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  hideLabel?: boolean;
}

/** Select nativo estilizado — melhor acessibilidade e usabilidade no celular. */
export function Select({ label, value, onChange, options, placeholder, className, hideLabel }: Props) {
  const id = useId();
  const active = value !== '';
  return (
    <div className={cx('relative', className)}>
      <label htmlFor={id} className={cx(hideLabel ? 'sr-only' : 'mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink/50')}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cx(
            'h-12 w-full appearance-none rounded-xl border bg-white pl-4 pr-10 text-[0.9rem] font-medium text-ink outline-none transition focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/40',
            active ? 'border-ink/60' : 'border-ink/10 hover:border-ink/30',
          )}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/50" aria-hidden="true" />
      </div>
    </div>
  );
}
