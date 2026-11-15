import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useHydrated } from "@tanstack/react-router";
import {
  isCheckoutReturn,
  listCatalogProducts,
  type CatalogProduct,
} from "@/integrations/payments";
import {
  BASE_PRICE,
  INDIVIDUAL_CONFIGS,
  INDIVIDUAL_KEYS,
  INDIV_PRICE,
  KIT_CONFIG,
  KIT_KEY,
  MAIN_PRODUCT_CONFIG,
  SELECTION_KEY,
  findProduct,
  formatBRL,
  getPriceId,
} from "@/lib/checkout-config";
import { CheckoutScreen } from "@/components/solar/CheckoutScreen";
import { ReviewScreen } from "@/components/solar/ReviewScreen";

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

  const buildItems = () => {
    if (!mainProduct) return null;
    const mainPriceId = getPriceId(mainProduct);
    if (!mainPriceId) return null;
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
    return items;
  };

  const handleContinue = () => {
    const items = buildItems();
    if (!items || !hydrated) return;
    localStorage.setItem(SELECTION_KEY, JSON.stringify({ items }));
    setShowCheckout(true);
  };

  const total = useMemo(() => {
    let sum = BASE_PRICE;
    if (selectedKit) sum += KIT_CONFIG.price;
    else sum += selectedIndividualKeys.length * INDIV_PRICE;
    return sum;
  }, [selectedKit, selectedIndividualKeys.length]);

  const hasDobro = selectedKit || selectedBumps.has("ob3");

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

  const selectionKey = useMemo(
    () => [...selectedBumps].sort().join(",") || "base",
    [selectedBumps],
  );

  const bumpLiteConfigs = individualConfigs.map((c) => ({
    key: c.key,
    title: c.title,
    description: c.description,
    price: c.price,
    image: c.image,
  }));

  // ---- Tela de checkout (PaymentCheckoutBlock selado, layout two-step) ----
  if (showCheckout && hydrated) {
    return (
      <CheckoutScreen
        selectionKey={selectionKey}
        total={total}
        extras={extras}
        hasDobro={hasDobro}
        selectedBumps={selectedBumps}
        toggleBump={toggleBump}
        clearKit={clearKit}
        swapToKit={swapToKit}
        showIndividuals={showIndividuals}
        setShowIndividuals={setShowIndividuals}
        selectedKit={selectedKit}
        selectedIndividualKeys={selectedIndividualKeys}
        allIndividualsSelected={allIndividualsSelected}
        individualConfigs={bumpLiteConfigs}
        removeExtra={removeExtra}
        onContinue={handleContinue}
      />
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

  // ---- Revisão do pedido (pré-checkout) ----
  return (
    <ReviewScreen
      selectedBumps={selectedBumps}
      toggleBump={toggleBump}
      clearKit={clearKit}
      swapToKit={swapToKit}
      showIndividuals={showIndividuals}
      setShowIndividuals={setShowIndividuals}
      selectedKit={selectedKit}
      selectedIndividualKeys={selectedIndividualKeys}
      allIndividualsSelected={allIndividualsSelected}
      individualConfigs={bumpLiteConfigs}
      total={total}
      extras={extras}
      removeExtra={removeExtra}
      hasDobro={hasDobro}
      onContinue={handleContinue}
    />
  );
}

// Evita import não utilizado em alguns bundlers.
export const _formatBRL = formatBRL;
