import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useHydrated } from "@tanstack/react-router";
import {
  BASE_PRICE,
  INDIVIDUAL_CONFIGS,
  INDIVIDUAL_KEYS,
  INDIV_PRICE,
  KIT_CONFIG,
  KIT_KEY,
  formatBRL,
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
  const hydrated = useHydrated();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showIndividuals, setShowIndividuals] = useState(false);
  const [selectedBumps, setSelectedBumps] = useState<Set<string>>(new Set());

  const individualConfigs = INDIVIDUAL_CONFIGS;

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
    if (!hydrated) return;
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
