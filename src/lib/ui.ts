/** Classes reutilizáveis de botões e chips. */
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full font-semibold tracking-[-0.005em] transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-out-expo active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40';

const variants = {
  primary: 'bg-red text-white hover:bg-red-deep shadow-[0_10px_30px_-12px_rgb(227_41_50/0.7)]',
  light: 'bg-paper text-ink hover:bg-white',
  dark: 'bg-ink text-paper hover:bg-graphite',
  ghost: 'border border-white/20 text-paper hover:border-white/60 hover:bg-white/5',
  ghostDark: 'border border-ink/15 text-ink hover:border-ink/50 hover:bg-ink/[0.03]',
  subtle: 'text-paper/60 hover:bg-white/5 hover:text-paper',
};

/** Tamanhos separados das variantes para evitar conflitos de utilitários. */
const sizes = {
  sm: 'h-10 px-4 text-[0.82rem]',
  md: 'h-12 px-6 text-[0.9rem]',
  lg: 'h-14 px-7 text-[0.9rem]',
  bar: 'h-12 px-3 text-[0.82rem]',
  icon: 'size-12 shrink-0',
};

export const button = (variant: keyof typeof variants, size: keyof typeof sizes = 'md') => cx(base, variants[variant], sizes[size]);

export const btn = {
  primary: button('primary'),
  light: button('light'),
  dark: button('dark'),
  ghost: button('ghost'),
  ghostDark: button('ghostDark'),
};

export const eyebrow = 'font-semiwide text-[0.7rem] font-semibold uppercase tracking-[0.28em]';
