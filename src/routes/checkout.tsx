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
  title: "500 Contatos Enriquecidos da Sua Cidade",
  description:
    "PDF com 500 contatos enriquecidos: nome, WhatsApp verificado e cidade da cidade que você escolher.",
  price: 97,
  searchName: "500 contatos",
};

const ORDER_BUMPS: OrderBumpConfig[] = [
  {
    key: "ob1",
    title: "7 Mensagens Impossíveis de Ignorar",
    description: "Modelo de mensagem para enviar no WhatsApp para público frio. Copie e cole.",
    price: 27,
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
    searchName: "5 perguntas",
    image:
      "https://vibe.filesafe.space/1794701011824623469/attachments/43cee2f8-289c-4313-a108-61e8e001f78f.png",
  },
  {
    key: "ob3",
    title: "Dobre Sua Oportunidade de Contatos",
    description: "Receba 1.000 leads ao invés de 500. O dobro de contatos para prospecção.",
    price: 27,
    searchName: "dobre",
    image:
      "https://vibe.filesafe.space/1794701011824623469/attachments/683e1d9b-89a5-43e2-a88e-eb0c4bbb0e84.png",
  },
  {
    key: "ob4",
    title: "Kit Corta Caminho",
    description: "7 Mensagens + 5 Perguntas + Dobro de Leads. Tudo junto com economia.",
    price: 47,
    searchName: "kit corta",
    image:
      "https://vibe.filesafe.space/1794701011824623469/attachments/3a34e949-a913-45c8-a57c-86f8b6d250ef.png",
  },
];

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
    <div className="min-h-screen flex items-center justify-center bg-[#F2F7FD] p-5">
      <div className="text-center max-w-md bg-white rounded-xl border border-[#D7E1EE] p-6 shadow-sm">
        <h1 className="font-['Poppins'] font-bold text-[#092C5D] text-2xl mb-3">
          Não foi possível carregar o checkout
        </h1>
        <p className="text-[#53677D] text-[15px]">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F7FD] p-5">
      <div className="text-center max-w-md bg-white rounded-xl border border-[#D7E1EE] p-6 shadow-sm">
        <h1 className="font-['Poppins'] font-bold text-[#092C5D] text-2xl">
          Nenhum produto encontrado
        </h1>
      </div>
    </div>
  ),
});

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
      if (next.has(key)) next.delete(key);
      else next.add(key);
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
      <div className="min-h-screen bg-[#F2F7FD] py-6 sm:py-10 px-5">
        <div className="max-w-3xl mx-auto">
          <PaymentCheckoutBlock fields={{ address: "hidden" }} />
        </div>
      </div>
    );
  }

  // ---- Sem produtos cadastrados ----
  if (hydrated && !hasProducts) {
    return (
      <div className="min-h-screen bg-[#F2F7FD] flex items-center justify-center p-5">
        <div className="max-w-md text-center bg-white rounded-xl border border-[#D7E1EE] p-6 shadow-sm">
          <h1 className="font-['Poppins'] font-bold text-[#092C5D] text-xl mb-3">
            Produtos em configuração
          </h1>
          <p className="text-[#53677D] text-[15px] leading-relaxed">
            Os produtos ainda não foram cadastrados no catálogo de pagamentos. Acesse{" "}
            <strong className="text-[#092C5D]">Mais → Pagamentos</strong> e cadastre:
          </p>
          <ul className="mt-4 text-left text-[14px] text-[#17324F] space-y-1.5">
            <li>• Lista de 500 contatos enriquecidos — R$97</li>
            <li>• 7 Mensagens Impossíveis de Ignorar — R$27</li>
            <li>• Filtro de Qualificação (5 Perguntas) — R$27</li>
            <li>• Dobre Seus Contatos (1.000 leads) — R$27</li>
            <li>• Kit Corta Caminho — R$47</li>
          </ul>
          <p className="mt-4 text-[#53677D] text-[14px] leading-relaxed">
            Depois de cadastrar, esta página vai exibi-los automaticamente.
          </p>
        </div>
      </div>
    );
  }

  // ---- Seleção de order bumps ----
  return (
    <div className="min-h-screen bg-[#F2F7FD] text-[#17324F] font-['Open_Sans']">
      {/* Cabeçalho */}
      <header className="bg-[#092C5D] py-4 px-5">
        <div className="max-w-[640px] mx-auto flex items-center justify-between">
          <a href="/" className="font-['Poppins'] font-bold text-white text-[18px] sm:text-[20px]">
            Solar Leads
          </a>
          <span className="text-white/70 text-[13px] font-['Poppins'] font-medium">
            Checkout seguro
          </span>
        </div>
      </header>

      <main className="px-5 py-8 sm:py-12">
        <div className="max-w-[640px] mx-auto">
          <h1 className="font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[32px] leading-[1.2] text-center">
            Quase lá! Revise seu pedido
          </h1>
          <p className="mt-3 text-[16px] sm:text-[17px] text-[#53677D] text-center leading-[1.55]">
            Antes de finalizar, confira se quer adicionar algum item abaixo.
          </p>

          {/* Produto principal */}
          <div className="mt-8 bg-white rounded-xl border-2 border-[#075BCC] p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-[#075BCC] flex items-center justify-center mt-0.5">
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
              <div className="flex-1">
                <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[20px] leading-tight">
                  {MAIN_PRODUCT_CONFIG.title}
                </h2>
                <p className="mt-1 text-[15px] text-[#53677D] leading-[1.5]">
                  {MAIN_PRODUCT_CONFIG.description}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="font-['Poppins'] font-extrabold text-[#092C5D] text-[24px] sm:text-[28px]">
                  R$97
                </span>
              </div>
            </div>
          </div>

          {/* Order bumps */}
          {bumpProducts.length > 0 && (
            <div className="mt-6">
              <p className="font-['Poppins'] font-bold text-[#092C5D] text-[17px] sm:text-[18px] mb-4">
                Adicione ao seu pedido:
              </p>
              <div className="space-y-3">
                {bumpProducts.map((bump) => {
                  const isSelected = selectedBumps.has(bump.key);
                  const available = !!bump.product;
                  return (
                    <button
                      key={bump.key}
                      type="button"
                      onClick={() => available && toggleBump(bump.key)}
                      disabled={!available}
                      aria-pressed={isSelected}
                      className={`w-full text-left bg-white rounded-xl border-2 p-4 transition-all duration-150 ${
                        isSelected
                          ? "border-[#075BCC] shadow-md"
                          : "border-[#D7E1EE] hover:border-[#075BCC]/50"
                      } ${!available ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center mt-1 transition-colors ${
                            isSelected
                              ? "bg-[#FFE344] border-[#FFE344]"
                              : "border-[#D7E1EE] bg-white"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-[#092C5D]"
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
                        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#F2F7FD] border border-[#D7E1EE] flex items-center justify-center p-1">
                          <img
                            src={bump.image}
                            alt={bump.title}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            width="80"
                            height="80"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[15px] sm:text-[17px] leading-tight">
                            {bump.title}
                          </h3>
                          <p className="mt-1 text-[13px] sm:text-[14px] text-[#53677D] leading-[1.45]">
                            {bump.description}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="font-['Poppins'] font-extrabold text-[#075BCC] text-[18px] sm:text-[22px] whitespace-nowrap">
                            +R${bump.price}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resumo + CTA */}
          <div className="mt-8 bg-white rounded-xl border border-[#D7E1EE] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[20px]">
                Total
              </span>
              <span className="font-['Poppins'] font-extrabold text-[#092C5D] text-[28px] sm:text-[34px] leading-none">
                R${total}
              </span>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="btn-sales rounded-[10px] w-full flex items-center justify-center font-['Poppins'] font-bold cursor-pointer select-none px-4 py-4 text-center leading-tight transition-all duration-150 text-[18px] sm:text-[20px] min-h-[56px] mt-5 uppercase tracking-wide text-white"
            >
              Finalizar pagamento
            </button>

            <p className="mt-3 text-center text-[13px] text-[#53677D] leading-[1.5]">
              Pagamento seguro · Cartão ou Pix · 30 dias de garantia
            </p>
          </div>

          <p className="mt-6 text-center text-[13px] text-[#53677D] leading-[1.5]">
            Após o pagamento, a gente te chama no WhatsApp para confirmar a cidade e enviar o PDF na
            mesma conversa.
          </p>
        </div>
      </main>
    </div>
  );
}
