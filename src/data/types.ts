export type Category = 'Hatch' | 'Sedan' | 'SUV' | 'Picape' | 'Utilitário';
export type Transmission = 'Automático' | 'Manual';
export type Fuel = 'Flex' | 'Gasolina' | 'Diesel';
export type Usage = 'cidade' | 'familia' | 'trabalho' | 'estrada';

/** Ponto de foco (em %) usado para gerar os quadros de detalhe da galeria. */
export interface FocusPoint {
  x: number;
  y: number;
  label: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  yearFab: number;
  yearModel: number;
  km: number;
  transmission: Transmission;
  fuel: Fuel;
  category: Category;
  /** Preço DEMONSTRATIVO em reais. `null` = "sob consulta". */
  price: number | null;
  color: string;
  engine: string;
  doors: number;
  /** Nome do arquivo em /public/img/cars (sem extensão). */
  image: string;
  details?: FocusPoint[];
  usage: Usage[];
  features: string[];
  featured?: boolean;
}
