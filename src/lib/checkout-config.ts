/**
 * Configuração do checkout Solar Leads — produtos, adicionais e helpers.
 * Mantido fora do arquivo de rota para manter o módulo de rota enxuto.
 */
import type { CatalogProduct } from "@/integrations/payments";

export const SELECTION_KEY = "vibe.checkout.selection.v1";

export interface OrderBumpConfig {
  key: string;
  title: string;
  description: string;
  price: number;
  searchName: string;
  image: string;
}

export const MAIN_PRODUCT_CONFIG = {
  title: "500 contatos enriquecidos",
  searchName: "500 contatos",
  image:
    "https://vibe.filesafe.space/1794701011824623469/attachments/ac79ec52-0a70-4243-8757-7e9a05803e52.png",
};

export const ORDER_BUMPS: OrderBumpConfig[] = [
  {
    key: "ob1",
    title: "7 mensagens prontas",
    description: "Modelos para iniciar conversas no WhatsApp. Copie, adapte e envie.",
    price: 27,
    searchName: "7 mensagens",
    image:
      "https://vibe.filesafe.space/1794701011824623469/attachments/6f366f69-10e4-41f8-8970-6f22a97306ed.png",
  },
  {
    key: "ob2",
    title: "5 perguntas de qualificação",
    description: "Um filtro para entender o momento de compra de cada contato.",
    price: 27,
    searchName: "identifique",
    image:
      "https://vibe.filesafe.space/1794701011824623469/attachments/43cee2f8-289c-4313-a108-61e8e001f78f.png",
  },
  {
    key: "ob3",
    title: "Dobro de contatos",
    description: "Receba 1.000 contatos enriquecidos no lugar de 500.",
    price: 27,
    searchName: "dobre",
    image:
      "https://vibe.filesafe.space/1794701011824623469/attachments/683e1d9b-89a5-43e2-a88e-eb0c4bbb0e84.png",
  },
  {
    key: "ob4",
    title: "Kit Corta Caminho",
    description: "7 mensagens + 5 perguntas + dobro de contatos. Tudo junto com economia.",
    price: 47,
    searchName: "kit corta",
    image:
      "https://vibe.filesafe.space/1794701011824623469/attachments/3a34e949-a913-45c8-a57c-86f8b6d250ef.png",
  },
];

export const KIT_KEY = "ob4";
export const INDIVIDUAL_KEYS = ["ob1", "ob2", "ob3"];
export const BASE_PRICE = 97;
export const INDIV_PRICE = 27;

export const KIT_CONFIG = ORDER_BUMPS.find((b) => b.key === KIT_KEY)!;
export const INDIVIDUAL_CONFIGS = INDIVIDUAL_KEYS.map(
  (k) => ORDER_BUMPS.find((b) => b.key === k)!,
);

export function findProduct(
  products: CatalogProduct[],
  keyword: string,
): CatalogProduct | undefined {
  const lower = keyword.toLowerCase();
  return products.find((p) => p.name.toLowerCase().includes(lower));
}

export function getPriceId(product: CatalogProduct): string | undefined {
  const inStock = product.prices.find((p) => !p.sold_out);
  return inStock?.id ?? product.prices[0]?.id;
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatBRLcents(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}