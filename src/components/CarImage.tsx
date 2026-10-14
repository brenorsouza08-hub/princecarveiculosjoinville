import { useCallback, useState, type CSSProperties } from 'react';
import { ImageOff } from 'lucide-react';
import { cx } from '../lib/ui';

interface Props {
  image: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  tone?: 'dark' | 'light';
  style?: CSSProperties;
}

export const carSrc = (image: string, size: 'sm' | 'lg' = 'lg') => `/img/cars/${image}-${size}.webp`;

/** Imagem de veículo com skeleton de carregamento e estado de erro. */
export function CarImage({ image, alt, className, imgClassName, sizes = '(min-width: 1024px) 33vw, 100vw', priority, tone = 'dark', style }: Props) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  // Imagens vindas do cache podem terminar de carregar antes de o React registrar o onLoad.
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete) setStatus(img.naturalWidth > 0 ? 'loaded' : 'error');
  }, []);

  return (
    <div className={cx('relative overflow-hidden', className)}>
      {status === 'loading' && (
        <div aria-hidden="true" className={cx('absolute inset-0', tone === 'dark' ? 'skeleton bg-graphite' : 'skeleton-light')} />
      )}
      {status === 'error' ? (
        <div
          role="img"
          aria-label={`${alt} — imagem indisponível`}
          className={cx(
            'absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs',
            tone === 'dark' ? 'bg-graphite text-metal' : 'bg-paper-2 text-ink/50',
          )}
        >
          <ImageOff className="size-6" strokeWidth={1.5} />
          Imagem indisponível
        </div>
      ) : (
        <img
          ref={imgRef}
          src={carSrc(image, 'lg')}
          srcSet={`${carSrc(image, 'sm')} 560w, ${carSrc(image, 'lg')} 1120w`}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          style={style}
          className={cx(
            'h-full w-full object-cover transition-opacity duration-700',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
