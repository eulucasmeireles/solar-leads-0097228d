/**
 * Tela de revisão do pedido (pré-checkout).
 * Extraída da rota de checkout para mantê-la enxuta.
 */
import { BASE_PRICE, INDIV_PRICE, KIT_CONFIG, KIT_KEY, formatBRL } from "@/lib/checkout-config";
import { WhatsAppIcon } from "@/components/solar/CheckoutOverlay";
import type { BumpLite, ExtraLite } from "@/components/solar/CheckoutOverlay";

export interface ReviewScreenProps {
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
  total: number;
  extras: ExtraLite[];
  removeExtra: (k: string) => void;
  hasDobro: boolean;
  onContinue: () => void;
}

export function ReviewScreen({
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
  total,
  extras,
  removeExtra,
  hasDobro,
  onContinue,
}: ReviewScreenProps) {
  return (
    <div className="min-h-screen bg-solar-bg-alt text-solar-text font-body pb-32 lg:pb-12">
      <header className="bg-solar-deep py-3 px-5 shadow-md sticky top-0 z-20">
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-[14px] font-heading font-medium"
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
          </a>
          <span className="text-white/70 text-[12px] sm:text-[13px] font-heading font-medium">
            Revisão do pedido
          </span>
        </div>
      </header>

      <main className="px-5 pt-6 sm:pt-8">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-heading font-bold text-solar-deep text-[24px] sm:text-[28px] leading-[1.2] text-center">
            Seu pedido está quase pronto
          </h1>
          <p className="mt-2 text-[16px] sm:text-[17px] text-solar-muted text-center leading-[1.55] max-w-[28rem] mx-auto">
            Confira o que você vai receber e escolha se quer incluir algum extra.
          </p>

          {/* Produto principal */}
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

          {/* Kit Corta Caminho */}
          <div className="mt-7">
            <p className="font-heading font-semibold text-solar-deep text-[17px] sm:text-[18px] mb-3">
              Quer incluir os extras e economizar?
            </p>
            <button
              type="button"
              onClick={() => toggleBump(KIT_KEY)}
              aria-pressed={selectedKit}
              className={`w-full text-left bg-white rounded-2xl border-2 p-4 sm:p-5 transition-colors motion-safe:duration-200 ${selectedKit ? "border-solar-primary bg-solar-bg-alt shadow-md" : "border-solar-border hover:border-solar-primary/40"}`}
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
                  className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors motion-safe:duration-200 ${selectedKit ? "bg-solar-primary border-solar-primary" : "border-solar-border bg-white"}`}
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

          {/* Avulsos recolhíveis */}
          <div className="mt-5">
            <p className="font-heading font-semibold text-solar-muted text-[15px] sm:text-[16px]">
              Prefere escolher os extras separadamente?
            </p>
            <button
              type="button"
              onClick={() => setShowIndividuals(!showIndividuals)}
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
                      className={`w-full text-left bg-white rounded-2xl border-2 p-4 transition-colors motion-safe:duration-200 ${isSelected ? "border-solar-primary bg-solar-bg-alt shadow-sm" : "border-solar-border hover:border-solar-primary/40"} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
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
                          className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors motion-safe:duration-200 ${isSelected ? "bg-solar-primary border-solar-primary" : "border-solar-border bg-white"}`}
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

          {/* Resumo + entrega */}
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
              {hasDobro && (
                <p className="mt-3 text-[13px] text-solar-primary font-heading font-semibold">
                  Entrega com 1.000 contatos no total.
                </p>
              )}
              <div className="mt-4 pt-3 border-t border-solar-border flex items-center justify-between">
                <span className="font-heading font-bold text-solar-deep text-[18px]">Total</span>
                <span className="font-heading font-extrabold text-solar-deep text-[24px] sm:text-[28px]">
                  {formatBRL(total)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 bg-white rounded-xl border border-solar-border p-4">
              <WhatsAppIcon className="shrink-0 mt-0.5 w-5 h-5 text-solar-primary" />
              <div>
                <p className="font-heading font-semibold text-solar-deep text-[15px] sm:text-[16px]">
                  Receba direto no WhatsApp
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 bg-white rounded-xl border border-solar-border p-4">
              <svg
                className="shrink-0 mt-0.5 w-5 h-5 text-solar-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <p className="font-heading font-semibold text-solar-deep text-[15px] sm:text-[16px]">
                  30 dias de garantia
                </p>
              </div>
            </div>

            {/* Termos de uso / letras miúdas sobre a geração da lista */}
            <div className="mt-3 px-2 py-3 text-center sm:text-left text-[12px] text-solar-muted leading-[1.5] border-t border-solar-border/70">
              <p>
                * <strong>Condições de reembolso e termos de uso:</strong> O estorno integral é
                garantido em até 30 dias após a compra, desde que a lista de contatos enriquecidos
                ainda não tenha sido gerada e enviada.
              </p>
            </div>

            <div className="hidden lg:block mt-5">
              <button
                type="button"
                onClick={onContinue}
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
            onClick={onContinue}
            className="btn-sales flex-1 min-w-0 rounded-[10px] flex items-center justify-center px-4 py-3 min-h-[52px] font-heading font-bold text-[15px] uppercase tracking-wide text-white"
          >
            IR PARA PAGAMENTO
          </button>
        </div>
      </div>
    </div>
  );
}

// Reexporta INDIV_PRICE para evitar import não utilizado em alguns bundlers.
export const _INDIV_PRICE = INDIV_PRICE;
