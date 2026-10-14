import { useCallback, useEffect, useState } from 'react';
import type { Vehicle } from './data/types';
import { vehicles } from './data/vehicles.demo';
import { EMPTY_FILTERS, type Filters, type SortKey } from './lib/inventory';
import { useFavorites } from './hooks/useFavorites';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { BrandTicker } from './sections/BrandTicker';
import { Featured } from './sections/Featured';
import { Inventory } from './sections/Inventory';
import { Finder } from './sections/Finder';
import { Story } from './sections/Story';
import { Journey } from './sections/Journey';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { VehicleModal } from './components/VehicleModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { DemoNotice } from './components/DemoNotice';

const HASH_PREFIX = '#veiculo/';
const vehicleFromHash = () => {
  const { hash } = window.location;
  if (!hash.startsWith(HASH_PREFIX)) return null;
  const id = decodeURIComponent(hash.slice(HASH_PREFIX.length));
  return vehicles.find((v) => v.id === id) ?? null;
};

export default function App() {
  const { favorites, toggle } = useFavorites();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>('relevance');
  const [selected, setSelected] = useState<Vehicle | null>(() => vehicleFromHash());

  // Mantém o modal sincronizado com o histórico (botão "voltar" fecha o detalhe).
  useEffect(() => {
    const onPop = () => setSelected(vehicleFromHash());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const open = useCallback((v: Vehicle) => {
    const url = `${HASH_PREFIX}${v.id}`;
    if (window.location.hash.startsWith(HASH_PREFIX)) history.replaceState({ vehicle: v.id }, '', url);
    else history.pushState({ vehicle: v.id }, '', url);
    setSelected(v);
  }, []);

  const close = useCallback(() => {
    if (history.state?.vehicle) history.back();
    else {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      setSelected(null);
    }
  }, []);

  const applyToInventory = useCallback((f: Filters) => {
    setFilters(f);
    setSort('relevance');
    requestAnimationFrame(() => document.getElementById('estoque')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, []);

  return (
    <>
      <a href="#estoque" className="sr-only z-[100] rounded-full bg-paper px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Pular para o estoque
      </a>
      <Header favoritesCount={favorites.size} />
      <main>
        <Hero />
        <BrandTicker />
        <Featured onOpen={open} />
        <Inventory
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
          favorites={favorites}
          onToggleFavorite={toggle}
          onOpen={open}
        />
        <Finder onOpen={open} favorites={favorites} onToggleFavorite={toggle} onApplyToInventory={applyToInventory} />
        <Story />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <VehicleModal
        vehicle={selected}
        onClose={close}
        onSelect={open}
        favorite={selected ? favorites.has(selected.id) : false}
        onToggleFavorite={toggle}
      />
      <FloatingWhatsApp hidden={selected !== null} />
      <DemoNotice />
    </>
  );
}
