import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useHydrated } from "@tanstack/react-router";
import {
  PaymentCheckoutBlock,
  isCheckoutReturn,
  listCatalogProducts,
  type CatalogProduct,
} from "@/integrations/payments";

const SELECTION_KEY = "vibe.checkout.selection.v1";

interface OrderBumpConfig {
  key: string;
  title: string;
  description: string;
  price: number;
  badge: string;
  searchName: string;
  image: string;
}

const MAIN_PRODUCT_CONFIG = {
  title: "500 Contatos Enriquecidos da Sua Cidade",
  description:
    "PDF com 500 contatos enriquecidos: nome, WhatsApp verificado e cidade da cidade que você escolher.",
  price: 97,
  searchName: "500 contatos",
  image:
    "https://vibe.filesafe.space/1794701011824623469/attachments/ac79ec52-0a70-4243-8757-7e9a05803e52.png",
};

const ORDER_BUMPS: OrderBumpConfig[] = [
  {
    key: "ob1",
    title: "7 Mensagens Impossíveis de Ignorar",
    description: "Modelo de mensagem para enviar no WhatsApp para público frio. Copie e cole.",
    price: 27,
    badge: "Mais vendido",
    searchName: "7 mensagens",
    image:
      "https://vibe.filesafe.space/1794701011824623469/attachments/6f366f69-10e4-41f8-8970-6f22a97306ed.png",
  },
  {
    key: "ob2",
    title: "Identifique o Lead Pronto para Fechar",
    description:
      "Filtro de qualificação com 5 perguntas para separar quem está pronto para comprar.",
    price: 27,
    badge: "Qualificação",
    searchName: "identifique",
    image:
      "https://vibe.filesafe.space/1794701011824623469/attachments/43cee2f8-289c-4313-a108-61e8e001f78f.png",
  },
  {
    key: "ob3",
    title: "Dobre Sua Oportunidade de Contatos",
    description: "Receba 1.000 leads ao invés de 500. O dobro de contatos para prospecção.",
    price: 27,
    badge: "Dobro de leads",
    searchName: "dobre",
    image:
      "https://vibe.filesafe.space/1794701011824623469/attachments/683e1d9b-89a5-43e2-a88e-eb0c4bbb0e84.png",
  },
  {
    key: "ob4",
    title: "Kit Corta Caminho",
    description: "7 Mensagens + 5 Perguntas + Dobro de Leads. Tudo junto com economia.",
    price: 47,
    badge: "Combo · Economize R$34",
    searchName: "kit corta",
    image:
      "https://vibe.filesafe.space/1794701011824623469/attachments/3a34e949-a913-45c8-a57c-86f8b6d250ef.png",
  },
];

const KIT_KEY = "ob4";
const INDIVIDUAL_KEYS = ["ob1", "ob2", "ob3"];

function findProduct(products: CatalogProduct[], keyword: string): CatalogProduct | undefined {
  const lower = keyword.toLowerCase();
  return products.find((p) => p.name.toLowerCase().includes(lower));
}

function getPriceId(product: CatalogProduct): string | undefined {
  const inStock = product.prices.find((p) => !p.sold_out);
  return inStock?.id ?? product.prices[0]?.id;
}

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Solar Leads" },
      {
        name: "description",
        content: "Finalize sua compra da lista de 500 contatos enriquecidos por R$97.",
      },
    ],
  }),
  loader: async () => {
    try {
      const page = await listCatalogProducts({ limit: 24 });
      return { products: page.products };
    } catch {
      return { products: [] as CatalogProduct[] };
    }
  },
  component: CheckoutPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-solar-bg-alt p-5">
      <div className="text-center max-w-md bg-white rounded-2xl border border-solar-border p-8 shadow-lg">
        <h1 className="font-heading font-bold text-solar-deep text-2xl mb-3">
          Não foi possível carregar o checkout
        </h1>
        <p className="text-solar-muted text-[15px]">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-solar-bg-alt p-5">
      <div className="text-center max-w-md bg-white rounded-2xl border border-solar-border p-8 shadow-lg">
        <h1 className="font-heading font-bold text-solar-deep text-2xl">
          Nenhum produto encontrado
        </h1>
      </div>
    </div>
  ),
});

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function CheckoutPage() {
  const { products } = Route.useLoaderData();
  const hydrated = useHydrated();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedBumps, setSelectedBumps] = useState<Set<string>>(new Set());

  const mainProduct = findProduct(products, MAIN_PRODUCT_CONFIG.searchName);
  const bumpProducts = ORDER_BUMPS.map((bump) => ({
    ...bump,
    product: findProduct(products, bump.searchName),
  }));

  const hasProducts = !!mainProduct;

  // Detectar retorno de pagamento redirect (ex.: Pix)
  useEffect(() => {
    if (hydrated && isCheckoutReturn()) {
      setShowCheckout(true);
    }
  }, [hydrated]);

  const toggleBump = (key: string) => {
    setSelectedBumps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        if (key === KIT_KEY) {
          INDIVIDUAL_KEYS.forEach((k) => next.delete(k));
        } else {
          next.delete(KIT_KEY);
        }
      }
      return next;
    });
  };

  const handleContinue = () => {
    if (!hydrated || !mainProduct) return;
    const mainPriceId = getPriceId(mainProduct);
    if (!mainPriceId) return;

    const items: { priceId: string; quantity: number }[] = [{ priceId: mainPriceId, quantity: 1 }];
    for (const bump of bumpProducts) {
      if (selectedBumps.has(bump.key) && bump.product) {
        const priceId = getPriceId(bump.product);
        if (priceId) items.push({ priceId, quantity: 1 });
      }
    }

    localStorage.setItem(SELECTION_KEY, JSON.stringify({ items }));
    setShowCheckout(true);
  };

  const total = useMemo(() => {
    let sum = MAIN_PRODUCT_CONFIG.price;
    for (const bump of ORDER_BUMPS) {
      if (selectedBumps.has(bump.key)) sum += bump.price;
    }
    return sum;
  }, [selectedBumps]);

  // ---- Tela de checkout (PaymentCheckoutBlock) ----
  if (showCheckout && hydrated) {
    return (
      <div className="min-h-screen bg-solar-bg-alt">
        {/* Cabeçalho em português sobre o formulário selado */}
        <header className="bg-solar-deep py-4 px-5 shadow-md">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowCheckout(false)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-heading font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <span className="font-heading font-bold text-white text-[17px] sm:text-[19px]">
              Solar Leads
            </span>
            <span className="flex items-center gap-1.5 text-white/70 text-[12px] sm:text-[13px] font-heading font-medium">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Pagamento seguro
            </span>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="bg-white rounded-2xl border border-solar-border shadow-xl overflow-hidden">
            <div className="bg-solar-bg-alt px-5 sm:px-8 py-4 border-b border-solar-border">
              <h1 className="font-heading font-bold text-solar-deep text-[20px] sm:text-[24px] text-center">
                Finalize seu pagamento
              </h1>
              <p className="text-center text-solar-muted text-[14px] sm:text-[15px] mt-1">
                Preencha seus dados para concluir a compra
              </p>
            </div>
            <div className="p-5 sm:p-8">
              <PaymentCheckoutBlock fields={{ address: "hidden" }} />
            </div>
          </div>
          <p className="mt-5 text-center text-solar-muted text-[13px] leading-relaxed max-w-md mx-auto">
            Após o pagamento, a gente te chama no WhatsApp para confirmar a cidade e enviar o PDF na
            mesma conversa.
          </p>
        </div>
      </div>
    );
  }

  // ---- Sem produtos cadastrados ----
  if (hydrated && !hasProducts) {
    return (
      <div className="min-h-screen bg-solar-bg-alt flex items-center justify-center p-5">
        <div className="max-w-md text-center bg-white rounded-2xl border border-solar-border p-8 shadow-lg">
          <h1 className="font-heading font-bold text-solar-deep text-xl mb-3">
            Produtos em configuração
          </h1>
          <p className="text-solar-muted text-[15px] leading-relaxed">
            Os produtos ainda não foram cadastrados no catálogo de pagamentos. Acesse{" "}
            <strong className="text-solar-deep">Mais → Pagamentos</strong> e cadastre:
          </p>
          <ul className="mt-4 text-left text-[14px] text-solar-text space-y-1.5">
            <li>• Lista de 500 contatos enriquecidos — R$97</li>
            <li>• 7 Mensagens Impossíveis de Ignorar — R$27</li>
            <li>• Identifique o Lead Pronto para Fechar — R$27</li>
            <li>• Dobre Sua Oportunidade de Contatos — R$27</li>
            <li>• Kit Corta Caminho — R$47</li>
          </ul>
          <p className="mt-4 text-solar-muted text-[14px] leading-relaxed">
            Depois de cadastrar, esta página vai exibi-los automaticamente.
          </p>
        </div>
      </div>
    );
  }

  // ---- Seleção de order bumps ----
  return (
    <div className="min-h-screen bg-solar-bg-alt text-solar-text font-body">
      {/* Cabeçalho */}
      <header className="bg-solar-deep py-4 px-5 shadow-md sticky top-0 z-10">
        <div className="max-w-[640px] mx-auto flex items-center justify-between">
          <a href="/" className="font-heading font-bold text-white text-[18px] sm:text-[20px]">
            Solar Leads
          </a>
          <span className="flex items-center gap-1.5 text-white/70 text-[12px] sm:text-[13px] font-heading font-medium">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Checkout seguro
          </span>
        </div>
      </header>

      <main className="px-5 py-8 sm:py-12">
        <div className="max-w-[640px] mx-auto">
          {/* Indicador de passo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-solar-primary flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-heading font-semibold text-solar-deep text-[14px]">Pedido</span>
            </div>
            <div className="w-8 h-[2px] bg-solar-border" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-solar-border flex items-center justify-center">
                <span className="font-heading font-bold text-solar-muted text-[13px]">2</span>
              </div>
              <span className="font-heading font-semibold text-solar-muted text-[14px]">
                Pagamento
              </span>
            </div>
          </div>

          <h1 className="font-heading font-bold text-solar-deep text-[26px] sm:text-[32px] leading-[1.2] text-center">
            Revise seu pedido
          </h1>
          <p className="mt-2 text-[16px] sm:text-[17px] text-solar-muted text-center leading-[1.55]">
            Confira se quer adicionar algum item abaixo antes de finalizar.
          </p>

          {/* Produto principal */}
          <div className="mt-7 bg-white rounded-2xl border-2 border-solar-primary p-5 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] rounded-xl overflow-hidden bg-solar-bg-alt border border-solar-border flex items-center justify-center p-1.5">
                <img
                  src={MAIN_PRODUCT_CONFIG.image}
                  alt={MAIN_PRODUCT_CONFIG.title}
                  className="w-full h-full object-contain"
                  loading="eager"
                  width="80"
                  height="80"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-block bg-solar-primary/10 text-solar-primary font-heading font-semibold text-[11px] uppercase tracking-wide px-2 py-0.5 rounded mb-1.5">
                      Produto principal
                    </span>
                    <h2 className="font-heading font-bold text-solar-deep text-[16px] sm:text-[19px] leading-tight">
                      {MAIN_PRODUCT_CONFIG.title}
                    </h2>
                  </div>
                  <span className="font-heading font-extrabold text-solar-deep text-[22px] sm:text-[28px] shrink-0 leading-none">
                    {formatBRL(MAIN_PRODUCT_CONFIG.price)}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] sm:text-[14px] text-solar-muted leading-[1.5]">
                  {MAIN_PRODUCT_CONFIG.description}
                </p>
              </div>
            </div>
          </div>

          {/* Order bumps */}
          {bumpProducts.length > 0 && (
            <div className="mt-7">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-heading font-bold text-solar-deep text-[17px] sm:text-[19px]">
                  Melhore seus resultados
                </span>
                <span className="flex-1 h-[1px] bg-solar-border" />
              </div>
              <div className="space-y-3">
                {bumpProducts.map((bump) => {
                  const isSelected = selectedBumps.has(bump.key);
                  const available = !!bump.product;
                  const kitSelected = selectedBumps.has(KIT_KEY);
                  const isIncludedInKit = kitSelected && INDIVIDUAL_KEYS.includes(bump.key);
                  const disabled = !available || isIncludedInKit;
                  return (
                    <button
                      key={bump.key}
                      type="button"
                      onClick={() => !disabled && toggleBump(bump.key)}
                      disabled={disabled}
                      aria-pressed={isSelected}
                      className={`w-full text-left bg-white rounded-2xl border-2 p-4 transition-all duration-150 ${
                        isSelected
                          ? "border-solar-primary shadow-md ring-1 ring-solar-primary/20"
                          : isIncludedInKit
                            ? "border-solar-primary/25 bg-solar-bg-alt"
                            : "border-solar-border hover:border-solar-primary/40 hover:shadow-sm"
                      } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex gap-3.5">
                        {/* Imagem */}
                        <div className="shrink-0 w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden bg-solar-bg-alt border border-solar-border flex items-center justify-center p-1.5">
                          <img
                            src={bump.image}
                            alt={bump.title}
                            className={`w-full h-full object-contain transition-opacity ${
                              isIncludedInKit ? "opacity-40" : ""
                            }`}
                            loading="lazy"
                            width="72"
                            height="72"
                          />
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              {!isIncludedInKit && (
                                <span className="inline-block bg-solar-yellow/30 text-solar-deep font-heading font-semibold text-[10px] sm:text-[11px] uppercase tracking-wide px-1.5 py-0.5 rounded mb-1">
                                  {bump.badge}
                                </span>
                              )}
                              <h3 className="font-heading font-bold text-solar-deep text-[14px] sm:text-[16px] leading-tight">
                                {bump.title}
                              </h3>
                            </div>
                            <span className="font-heading font-extrabold text-solar-primary text-[17px] sm:text-[20px] whitespace-nowrap shrink-0">
                              +{formatBRL(bump.price)}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] sm:text-[13px] text-solar-muted leading-[1.45]">
                            {bump.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            {isIncludedInKit ? (
                              <>
                                <div className="shrink-0 w-5 h-5 rounded bg-solar-primary border-2 border-solar-primary flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <span className="text-[12px] sm:text-[13px] font-heading font-semibold text-solar-primary">
                                  Incluso no Kit Corta Caminho
                                </span>
                              </>
                            ) : (
                              <>
                                <div
                                  className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? "bg-solar-yellow border-solar-yellow"
                                      : "border-solar-border bg-white"
                                  }`}
                                >
                                  {isSelected && (
                                    <svg
                                      className="w-3 h-3 text-solar-deep"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-[12px] sm:text-[13px] font-heading font-semibold text-solar-deep">
                                  {isSelected ? "Adicionado ao pedido" : "Adicionar ao pedido"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resumo + CTA */}
          <div className="mt-7 bg-white rounded-2xl border border-solar-border p-5 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-solar-border">
              <span className="font-heading font-bold text-solar-deep text-[18px] sm:text-[20px]">
                Total
              </span>
              <span className="font-heading font-extrabold text-solar-deep text-[28px] sm:text-[36px] leading-none">
                {formatBRL(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="btn-sales rounded-[10px] w-full flex items-center justify-center font-heading font-bold cursor-pointer select-none px-4 py-4 text-center leading-tight transition-all duration-150 text-[18px] sm:text-[20px] min-h-[56px] mt-5 uppercase tracking-wide text-white"
            >
              Ir para o pagamento
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 flex-wrap text-[12px] text-solar-muted">
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-solar-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                30 dias de garantia
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-solar-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Pagamento seguro
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-solar-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Cartão ou Pix
              </span>
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] text-solar-muted leading-[1.55] max-w-md mx-auto">
            Após o pagamento, a gente te chama no WhatsApp para confirmar a cidade e enviar o PDF na
            mesma conversa — em até 2h.
          </p>
        </div>
      </main>
    </div>
  );
}
