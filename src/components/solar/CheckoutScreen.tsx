/**
 * Tela de pagamento (PaymentCheckoutBlock selado, layout two-step).
 * Extraída da rota de checkout para mantê-la enxuta.
 */
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PaymentCheckoutBlock } from "@/integrations/payments";
import { BASE_PRICE, formatBRL, formatBRLcents } from "@/lib/checkout-config";
import { ReviewOverlay, StepBadge, WhatsAppIcon } from "@/components/solar/CheckoutOverlay";
import type { BumpLite, ExtraLite } from "@/components/solar/CheckoutOverlay";

export interface CheckoutScreenProps {
  selectionKey: string;
  total: number;
  extras: ExtraLite[];
  hasDobro: boolean;
  selectedBumps: Set<string>;
  toggleBump: (k: string) => void;
  clearKit: () => void;
  swapToKit: () => void;
  showIndividuals: boolean;
  setShowIndividuals: (v: boolean) => void;
  selectedKit: boolean;
  selectedIndividualKeys: string[];
  allIndividualsSelected: boolean;
  individualConfigs: BumpLite[];
  removeExtra: (k: string) => void;
  onContinue: () => void;
}

export function CheckoutScreen({
  selectionKey,
  total,
  extras,
  hasDobro,
  selectedBumps,
  toggleBump,
  clearKit,
  swapToKit,
  showIndividuals,
  setShowIndividuals,
  selectedKit,
  selectedIndividualKeys,
  allIndividualsSelected,
  individualConfigs,
  removeExtra,
  onContinue,
}: CheckoutScreenProps) {
  const navigate = useNavigate();
  const [showReviewOverlay, setShowReviewOverlay] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  return (
    <div className="min-h-screen bg-solar-bg-alt text-solar-text font-body">
      <header className="bg-solar-deep py-3 px-4 sm:px-6 shadow-md sticky top-0 z-30">
        <div className="max-w-[720px] mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowReviewOverlay(true)}
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-[14px] font-heading font-medium shrink-0"
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
          <span className="flex items-center gap-1.5 text-white/70 text-[12px] sm:text-[13px] font-heading font-medium shrink-0">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Pagamento seguro</span>
          </span>
        </div>
      </header>

      <main className="px-4 sm:px-5 pt-6 pb-12">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-heading font-bold text-solar-deep text-[22px] sm:text-[26px] leading-[1.2] text-center">
            Falta pouco para receber seus contatos
          </h1>

          <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3">
            <StepBadge number={1} label="Seus dados" state="active" />
            <div className="h-px w-6 sm:w-10 bg-solar-border" />
            <StepBadge number={2} label="Pagamento" state="pending" />
          </div>

          {/* Resumo expansível */}
          <div className="mt-5 bg-white rounded-2xl border border-solar-border shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowOrderDetails((v) => !v)}
              aria-expanded={showOrderDetails}
              className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 text-left"
            >
              <span className="font-heading font-semibold text-solar-deep text-[15px] sm:text-[16px]">
                Seu pedido · {formatBRLcents(total)}
              </span>
              <span className="flex items-center gap-1 text-solar-primary font-heading font-semibold text-[13px] sm:text-[14px]">
                {showOrderDetails ? "Ocultar" : "Ver detalhes"}
                <svg
                  className={`w-4 h-4 transition-transform motion-safe:duration-200 ${showOrderDetails ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            {showOrderDetails && (
              <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-solar-border">
                <div className="flex items-center justify-between gap-3 py-2">
                  <span className="text-[15px] text-solar-text">500 contatos enriquecidos</span>
                  <span className="font-heading font-bold text-solar-deep text-[15px]">
                    {formatBRL(BASE_PRICE)}
                  </span>
                </div>
                {extras.map((extra) => (
                  <div key={extra.key} className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[14px] text-solar-text">{extra.title}</span>
                    <span className="font-heading font-bold text-solar-deep text-[14px]">
                      +{formatBRL(extra.price)}
                    </span>
                  </div>
                ))}
                {hasDobro && (
                  <p className="mt-2 text-[13px] text-solar-primary font-heading font-semibold">
                    Entrega com 1.000 contatos no total.
                  </p>
                )}
                <div className="mt-2 pt-2 border-t border-solar-border flex items-center justify-between">
                  <span className="font-heading font-bold text-solar-deep text-[16px]">Total</span>
                  <span className="font-heading font-extrabold text-solar-deep text-[20px]">
                    {formatBRLcents(total)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bloco selado: coleta nome/WhatsApp/e-mail (passo 1) e pagamento (passo 2) */}
          <div className="mt-4 bg-white rounded-2xl border border-solar-border shadow-sm p-4 sm:p-6 checkout-host-clean">
            <h2 className="font-heading font-bold text-solar-deep text-[18px] sm:text-[20px] mb-1">
              Onde vamos falar com você?
            </h2>
            <p className="text-[14px] sm:text-[15px] text-solar-muted leading-[1.5] mb-4">
              Nome, WhatsApp e e-mail. A gente confirma sua cidade e envia a lista pelo WhatsApp.
            </p>
            <PaymentCheckoutBlock
              key={selectionKey}
              layout="two-step"
              fields={{ phone: "required", address: "hidden" }}
              onSuccess={() => navigate({ to: "/obrigado" })}
            />
          </div>

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
        </div>
      </main>

      {showReviewOverlay && (
        <ReviewOverlay
          onClose={() => setShowReviewOverlay(false)}
          selectedBumps={selectedBumps}
          toggleBump={toggleBump}
          clearKit={clearKit}
          swapToKit={swapToKit}
          showIndividuals={showIndividuals}
          setShowIndividuals={setShowIndividuals}
          selectedKit={selectedKit}
          selectedIndividualKeys={selectedIndividualKeys}
          allIndividualsSelected={allIndividualsSelected}
          individualConfigs={individualConfigs}
          total={total}
          extras={extras}
          removeExtra={removeExtra}
          hasDobro={hasDobro}
          onContinue={onContinue}
        />
      )}
    </div>
  );
}
