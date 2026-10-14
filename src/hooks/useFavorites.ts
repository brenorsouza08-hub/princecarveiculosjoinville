import { useCallback, useEffect, useState } from 'react';

const KEY = 'princecar:favoritos';

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** Favoritos salvos apenas no navegador do visitante (localStorage). */
export function useFavorites() {
  const [ids, setIds] = useState<Set<string>>(() => new Set(read()));

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify([...ids]));
    } catch {
      /* armazenamento indisponível (modo privado etc.) — segue só em memória */
    }
  }, [ids]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setIds(new Set()), []);

  return { favorites: ids, toggle, clear };
}
