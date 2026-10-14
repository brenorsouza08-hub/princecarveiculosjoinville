import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../hooks/useMisc';
import { cx } from '../lib/ui';

interface Props {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
}

/** Animação de entrada discreta ao rolar (desligada com "reduzir movimento"). */
export function Reveal({ as: Tag = 'div', delay = 0, className, children }: Props) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  return (
    <Tag
      ref={ref}
      data-shown={inView}
      className={cx('reveal', className)}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
