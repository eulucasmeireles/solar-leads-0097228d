import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
import { PaymentWaiting } from "@/components/solar/PaymentWaiting";
import { getLeadData, trackInitiateCheckout } from "@/lib/lead-tracking";
import { leadToBuyer, useInfinitePayCheckout } from "@/lib/use-infinitepay-checkout";

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

  // InitiateCheckout no Meta Pixel ao chegar no checkout.
  useEffect(() => {
    trackInitiateCheckout();
  }, []);

  const individualConfigs = INDIVIDUAL_CONFIGS;

  const selectedKit = selectedBumps.has(KIT_KEY);
  const selectedIndividualKeys = INDIVIDUAL_KEYS.filter((k) => selectedBumps.has(k));
  const allIndividualsSelected =
    !selectedKit && selectedIndividualKeys.length === INDIVIDUAL_KEYS.length;

  // Pagamento direto: usa os dados do modal da primeira página, sem pedir tudo de novo.
  const extraKeys = selectedKit ? [KIT_KEY] : selectedIndividualKeys;
  const checkout = useInfinitePayCheckout(extraKeys);

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

  // Chamado direto do clique em "IR PARA PAGAMENTO" (o popup precisa abrir dentro do clique).
  const handleContinue = () => {
    if (!hydrated || checkout.loading) return;
    const buyer = leadToBuyer(getLeadData());
    if (!buyer) {
      // Sem os dados do modal (ou inválidos): pede os dados na tela de reserva.
      setShowCheckout(true);
      return;
    }
    void checkout.start(buyer).then((ok) => {
      if (!ok) setShowCheckout(true);
    });
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

  // ---- Aguardando o pagamento no popup ----
  if (checkout.paying) {
    return (
      <div className="min-h-screen bg-solar-bg-alt text-solar-text font-body">
        <header className="bg-solar-deep py-3 px-4 sm:px-6 shadow-md">
          <div className="max-w-[720px] mx-auto text-white/70 text-[13px] font-heading font-medium">
            Pagamento seguro
          </div>
        </header>
        <main className="px-4 sm:px-5 pt-10">
          <div className="max-w-[520px] mx-auto bg-white rounded-2xl border border-solar-border shadow-sm p-6 sm:p-8">
            <PaymentWaiting
              onReopen={checkout.reopen}
              onCancel={checkout.cancel}
              cancelLabel="Voltar ao pedido"
            />
          </div>
        </main>
      </div>
    );
  }

  // ---- Tela de reserva: só se faltarem os dados do modal ----
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
        onContinue={() => setShowCheckout(true)}
      />
    );
  }

  // ---- Revisão do pedido: o botão já leva ao pagamento ----
  return (
    <>
      {checkout.loading && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-[2px]"
          role="status"
          aria-live="polite"
        >
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#D7E1EE] border-t-[#075BCC]" />
          <p className="font-heading font-bold text-solar-deep text-[16px]">
            Abrindo o pagamento...
          </p>
        </div>
      )}
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
    </>
  );
}

// Evita import não utilizado em alguns bundlers.
export const _formatBRL = formatBRL;
