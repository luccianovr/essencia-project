export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
export type Category = "hombre" | "mujer" | "unisex";
export type BadgeVariant = "new" | "low" | "out";
export type FilterOption = "all" | Category | "disponible";

export interface Product {
  id: string;
  brand: string;
  name: string;
  description: string;
  price: string;
  volume: string;
  concentration: string;
  image?: string;
  emoji?: string;
  categories: Category[];
  stockStatus: StockStatus;
  stockCount: number;
  badge?: BadgeVariant;
}

export interface Stat {
  value: string;
  label: string;
}

export interface NavItem {
  label: string;
  href: string;
}
