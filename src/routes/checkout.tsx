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
  searchName: string;
  image: string;
}

const MAIN_PRODUCT_CONFIG = {
  title: "500 contatos enriquecidos",
  searchName: "500 contatos",
  image:
    "https://vibe.filesafe.space/1794701011824623469/attachments/ac79ec52-0a70-4243-8757-7e9a05803e52.png",
};

const ORDER_BUMPS: OrderBumpConfig[] = [
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

const KIT_KEY = "ob4";
const INDIVIDUAL_KEYS = ["ob1", "ob2", "ob3"];
const BASE_PRICE = 97;

const KIT_CONFIG = ORDER_BUMPS.find((b) => b.key === KIT_KEY)!;
const INDIVIDUAL_CONFIGS = INDIVIDUAL_KEYS.map((k) => ORDER_BUMPS.find((b) => b.key === k)!);

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
      { title: "Revisão do pedido — Solar Leads" },
      {
        name: "description",
        content: "Confira sua lista de 500 contatos enriquecidos por R$97 e siga para o pagamento.",
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

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.13c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24zm4.52-5.46c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}

function CheckoutPage() {
  const { products } = Route.useLoaderData();
  const hydrated = useHydrated();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showIndividuals, setShowIndividuals] = useState(false);
  const [selectedBumps, setSelectedBumps] = useState<Set<string>>(new Set());

  const mainProduct = findProduct(products, MAIN_PRODUCT_CONFIG.searchName);
  const kitProduct = findProduct(products, KIT_CONFIG.searchName);
  const individualConfigs = INDIVIDUAL_CONFIGS.map((c) => ({
    ...c,
    product: findProduct(products, c.searchName),
  }));

  const hasProducts = !!mainProduct;

  useEffect(() => {
    if (hydrated && isCheckoutReturn()) {
      setShowCheckout(true);
    }
  }, [hydrated]);

  const selectedKit = selectedBumps.has(KIT_KEY);
  const selectedIndividualKeys = INDIVIDUAL_KEYS.filter((k) => selectedBumps.has(k));
  const allIndividualsSelected =
    !selectedKit && selectedIndividualKeys.length === INDIVIDUAL_KEYS.length;

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

  const clearKit = () =>
    setSelectedBumps((prev) => {
      const next = new Set(prev);
      next.delete(KIT_KEY);
      return next;
    });

  const swapToKit = () =>
    setSelectedBumps((prev) => {
      const next = new Set(prev);
      INDIVIDUAL_KEYS.forEach((k) => next.delete(k));
      next.add(KIT_KEY);
      return next;
    });

  const handleContinue = () => {
    if (!hydrated || !mainProduct) return;
    const mainPriceId = getPriceId(mainProduct);
    if (!mainPriceId) return;

    const items: { priceId: string; quantity: number }[] = [{ priceId: mainPriceId, quantity: 1 }];

    if (selectedKit && kitProduct) {
      const priceId = getPriceId(kitProduct);
      if (priceId) items.push({ priceId, quantity: 1 });
    } else {
      for (const k of selectedIndividualKeys) {
        const cfg = individualConfigs.find((c) => c.key === k);
        if (cfg?.product) {
          const priceId = getPriceId(cfg.product);
          if (priceId) items.push({ priceId, quantity: 1 });
        }
      }
    }

    localStorage.setItem(SELECTION_KEY, JSON.stringify({ items }));
    setShowCheckout(true);
  };

  const total = useMemo(() => {
    let sum = BASE_PRICE;
    if (selectedKit) sum += KIT_CONFIG.price;
    else sum += selectedIndividualKeys.length * 27;
    return sum;
  }, [selectedKit, selectedIndividualKeys.length]);

  const extras = selectedKit
    ? [{ key: KIT_KEY, title: KIT_CONFIG.title, price: KIT_CONFIG.price }]
    : selectedIndividualKeys.map((k) => {
        const c = INDIVIDUAL_CONFIGS.find((ic) => ic.key === k)!;
        return { key: k, title: c.title, price: c.price };
      });

  const removeExtra = (key: string) => {
    if (key === KIT_KEY) clearKit();
    else toggleBump(key);
  };

  // ---- Tela de checkout (PaymentCheckoutBlock) ----
  if (showCheckout && hydrated) {
    return (
      <div className="min-h-screen bg-solar-bg-alt">
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
            <li>• 7 mensagens prontas — R$27</li>
            <li>• 5 perguntas de qualificação — R$27</li>
            <li>• Dobro de contatos (1.000 leads) — R$27</li>
            <li>• Kit Corta Caminho — R$47</li>
          </ul>
          <p className="mt-4 text-solar-muted text-[14px] leading-relaxed">
            Depois de cadastrar, esta página vai exibi-los automaticamente.
          </p>
        </div>
      </div>
    );
  }

  // ---- Revisão do pedido ----
  return (
    <div className="min-h-screen bg-solar-bg-alt text-solar-text font-body pb-32 lg:pb-12">
      {/* Cabeçalho */}
      <header className="bg-solar-deep py-3 px-5 shadow-md sticky top-0 z-20">
        <div className="max-w-[640px] mx-auto flex items-center justify-between">
          <a
            href="/"
            className="font-heading font-bold text-white text-[16px] sm:text-[18px] tracking-tight"
          >
            Solar Leads
          </a>
          <span className="text-white/70 text-[12px] sm:text-[13px] font-heading font-medium">
            Revisão do pedido
          </span>
        </div>
      </header>

      <main className="px-5 pt-5 sm:pt-7">
        <div className="max-w-[640px] mx-auto">
          {/* Abertura curta */}
          <h1 className="font-heading font-bold text-solar-deep text-[24px] sm:text-[28px] leading-[1.2] text-center">
            Seu pedido está quase pronto
          </h1>
          <p className="mt-2 text-[16px] sm:text-[17px] text-solar-muted text-center leading-[1.55] max-w-[28rem] mx-auto">
            Confira o que você vai receber e escolha se quer incluir algum extra.
          </p>

          {/* Produto principal compacto */}
          <div className="mt-6 bg-white rounded-2xl border border-solar-border p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-solar-primary flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-solar-deep text-[18px] sm:text-[19px] leading-tight">
                  500 contatos enriquecidos
                </p>
                <p className="mt-1 text-[16px] text-solar-muted leading-[1.5]">
                  Nome, WhatsApp verificado e cidade, em PDF.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-solar-border flex items-center justify-between">
              <span className="text-solar-muted text-[15px]">Na cidade que você escolher</span>
              <span className="font-heading font-extrabold text-solar-deep text-[22px] sm:text-[24px]">
                {formatBRL(BASE_PRICE)}
              </span>
            </div>
          </div>

          {/* Kit Corta Caminho em destaque */}
          <div className="mt-7">
            <p className="font-heading font-semibold text-solar-deep text-[17px] sm:text-[18px] mb-3">
              Quer incluir os extras e economizar?
            </p>
            <button
              type="button"
              onClick={() => toggleBump(KIT_KEY)}
              aria-pressed={selectedKit}
              className={`w-full text-left bg-white rounded-2xl border-2 p-4 sm:p-5 transition-colors motion-safe:duration-200 ${
                selectedKit
                  ? "border-solar-primary bg-solar-bg-alt shadow-md"
                  : "border-solar-border hover:border-solar-primary/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden bg-solar-bg-alt border border-solar-border flex items-center justify-center p-1.5">
                  <img
                    src={KIT_CONFIG.image}
                    alt="Kit Corta Caminho"
                    className="w-full h-full object-contain"
                    loading="lazy"
                    width="72"
                    height="72"
                  />
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <h3 className="font-heading font-bold text-solar-deep text-[17px] sm:text-[19px] leading-tight">
                    Kit Corta Caminho
                  </h3>
                  <span className="font-heading font-extrabold text-solar-primary text-[20px] sm:text-[22px] whitespace-nowrap shrink-0">
                    +{formatBRL(KIT_CONFIG.price)}
                  </span>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5 text-[15px] sm:text-[16px] text-solar-text leading-[1.5]">
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-solar-primary" />7
                  mensagens para copiar e colar.
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-solar-primary" />5
                  perguntas para qualificar seus contatos.
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-solar-primary" />
                  Dobro de contatos: 1.000 no total.
                </li>
              </ul>

              <div className="mt-3 inline-flex flex-wrap items-baseline gap-x-2 bg-solar-yellow/40 rounded-lg px-3 py-1.5">
                <span className="font-heading font-bold text-solar-deep text-[14px]">
                  Separados: R$81 · No kit: R$47
                </span>
                <span className="font-heading font-bold text-solar-deep text-[14px]">
                  Você economiza R$34
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2.5">
                <span
                  className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors motion-safe:duration-200 ${
                    selectedKit
                      ? "bg-solar-primary border-solar-primary"
                      : "border-solar-border bg-white"
                  }`}
                >
                  {selectedKit && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="font-heading font-semibold text-solar-deep text-[15px] sm:text-[16px]">
                  {selectedKit ? "Kit adicionado ao pedido" : "Adicionar kit ao pedido"}
                </span>
              </div>
            </button>
          </div>

          {/* Opções avulsas recolhíveis */}
          <div className="mt-5">
            <p className="font-heading font-semibold text-solar-muted text-[15px] sm:text-[16px]">
              Prefere escolher os extras separadamente?
            </p>
            <button
              type="button"
              onClick={() => setShowIndividuals((v) => !v)}
              aria-expanded={showIndividuals}
              className="mt-1 inline-flex items-center gap-2 text-solar-primary font-heading font-semibold text-[15px] sm:text-[16px] hover:underline"
            >
              {showIndividuals ? "Recolher opções avulsas" : "Ver opções avulsas"}
              <svg
                className={`w-4 h-4 transition-transform motion-safe:duration-200 ${showIndividuals ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showIndividuals && (
              <div className="mt-4 space-y-3">
                {selectedKit && (
                  <div className="rounded-xl border border-solar-primary/30 bg-solar-bg-alt p-3.5">
                    <p className="text-[14px] sm:text-[15px] text-solar-deep font-heading font-semibold">
                      Os três extras já estão incluídos no kit.
                    </p>
                    <button
                      type="button"
                      onClick={clearKit}
                      className="mt-2 inline-flex items-center gap-1.5 text-solar-primary font-heading font-semibold text-[14px] hover:underline"
                    >
                      Trocar por itens avulsos
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {individualConfigs.map((bump) => {
                  const isSelected = selectedBumps.has(bump.key);
                  const disabled = selectedKit;
                  return (
                    <button
                      key={bump.key}
                      type="button"
                      onClick={() => !disabled && toggleBump(bump.key)}
                      disabled={disabled}
                      aria-pressed={isSelected}
                      className={`w-full text-left bg-white rounded-2xl border-2 p-4 transition-colors motion-safe:duration-200 ${
                        isSelected
                          ? "border-solar-primary bg-solar-bg-alt shadow-sm"
                          : "border-solar-border hover:border-solar-primary/40"
                      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-[60px] h-[60px] sm:w-[64px] sm:h-[64px] rounded-xl overflow-hidden bg-solar-bg-alt border border-solar-border flex items-center justify-center p-1.5">
                          <img
                            src={bump.image}
                            alt={bump.title}
                            className={`w-full h-full object-contain ${disabled ? "opacity-40" : ""}`}
                            loading="lazy"
                            width="64"
                            height="64"
                          />
                        </div>
                        <h3 className="flex-1 min-w-0 font-heading font-bold text-solar-deep text-[16px] sm:text-[17px] leading-tight">
                          {bump.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-[15px] sm:text-[16px] text-solar-muted leading-[1.5]">
                        {bump.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-heading font-extrabold text-solar-primary text-[18px] sm:text-[20px]">
                          +{formatBRL(bump.price)}
                        </span>
                        <span
                          className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors motion-safe:duration-200 ${
                            isSelected
                              ? "bg-solar-primary border-solar-primary"
                              : "border-solar-border bg-white"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {allIndividualsSelected && (
                  <div className="rounded-xl border-2 border-solar-yellow bg-solar-yellow/20 p-4">
                    <p className="text-[15px] sm:text-[16px] text-solar-deep font-heading font-semibold leading-[1.5]">
                      Com o kit, você leva os mesmos extras e economiza R$34.
                    </p>
                    <button
                      type="button"
                      onClick={swapToKit}
                      className="btn-sales mt-3 inline-flex items-center justify-center rounded-[10px] px-5 py-3 min-h-[48px] font-heading font-bold text-[15px] uppercase tracking-wide text-white"
                    >
                      TROCAR PELO KIT
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Resumo do pedido */}
          <div className="mt-8">
            <h2 className="font-heading font-bold text-solar-deep text-[18px] sm:text-[19px] mb-3">
              Resumo do pedido
            </h2>
            <div className="bg-white rounded-2xl border border-solar-border p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[16px] text-solar-text">500 contatos enriquecidos</span>
                <span className="font-heading font-bold text-solar-deep text-[17px]">
                  {formatBRL(BASE_PRICE)}
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                {extras.length === 0 ? (
                  <p className="text-[15px] text-solar-muted leading-[1.5]">
                    Tudo certo. Você pode seguir só com os 500 contatos.
                  </p>
                ) : (
                  extras.map((extra) => (
                    <div key={extra.key} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-[15px] text-solar-text min-w-0">
                        <span className="truncate">{extra.title}</span>
                        <button
                          type="button"
                          onClick={() => removeExtra(extra.key)}
                          className="shrink-0 text-solar-muted text-[13px] font-heading font-semibold hover:text-solar-primary hover:underline"
                        >
                          remover
                        </button>
                      </span>
                      <span className="font-heading font-bold text-solar-deep text-[16px] shrink-0">
                        +{formatBRL(extra.price)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-solar-border flex items-center justify-between">
                <span className="font-heading font-bold text-solar-deep text-[18px]">Total</span>
                <span className="font-heading font-extrabold text-solar-deep text-[24px] sm:text-[28px]">
                  {formatBRL(total)}
                </span>
              </div>
            </div>

            {/* Entrega pelo WhatsApp */}
            <div className="mt-4 flex items-start gap-3 bg-white rounded-xl border border-solar-border p-4">
              <WhatsAppIcon className="shrink-0 mt-0.5 w-5 h-5 text-solar-primary" />
              <div>
                <p className="font-heading font-semibold text-solar-deep text-[15px] sm:text-[16px]">
                  Sua entrega acontece pelo WhatsApp
                </p>
                <p className="mt-1 text-[14px] sm:text-[15px] text-solar-muted leading-[1.5]">
                  Após a confirmação do pagamento, a gente confirma sua cidade pelo WhatsApp. Você
                  recebe o PDF na mesma conversa em até 2h após essa confirmação.
                </p>
              </div>
            </div>

            <p className="mt-3 flex items-center gap-2 text-[13px] sm:text-[14px] text-solar-muted">
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
              30 dias de garantia para solicitar a devolução dos R$97.
            </p>

            {/* CTA — desktop inline */}
            <div className="hidden lg:block mt-5">
              <button
                type="button"
                onClick={handleContinue}
                className="btn-sales w-full rounded-[10px] flex items-center justify-center px-6 py-4 min-h-[56px] font-heading font-bold text-[20px] uppercase tracking-wide text-white"
              >
                IR PARA PAGAMENTO
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Barra fixa inferior — mobile */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white border-t border-solar-border shadow-[0_-6px_20px_-6px_rgba(7,91,204,0.18)]">
        <div className="max-w-[640px] mx-auto px-5 py-3 flex items-center gap-3">
          <div className="shrink-0 leading-tight">
            <div className="text-[12px] text-solar-muted">Total do pedido</div>
            <div className="font-heading font-extrabold text-solar-deep text-[19px]">
              {formatBRL(total)}
            </div>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="btn-sales flex-1 min-w-0 rounded-[10px] flex items-center justify-center px-4 py-3 min-h-[52px] font-heading font-bold text-[15px] uppercase tracking-wide text-white"
          >
            IR PARA PAGAMENTO
          </button>
        </div>
      </div>
    </div>
  );
}
