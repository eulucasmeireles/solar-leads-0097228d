/**
 * Componentes de UI do checkout Solar Leads: WhatsAppIcon, StepBadge e
 * ReviewOverlay. Extraídos do módulo de rota para mantê-lo enxuto.
 */
import { BASE_PRICE, formatBRL, KIT_CONFIG } from "@/lib/checkout-config";

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.13c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24zm4.52-5.46c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}

export function StepBadge({
  number,
  label,
  state,
}: {
  number: number;
  label: string;
  state: "active" | "done" | "pending";
}) {
  const circleClass =
    state === "active"
      ? "bg-solar-primary text-white border-solar-primary"
      : state === "done"
        ? "bg-solar-deep text-white border-solar-deep"
        : "bg-white text-solar-muted border-solar-border";
  const labelClass =
    state === "active" ? "text-solar-deep font-semibold" : "text-solar-muted font-medium";
  return (
    <div className="flex items-center gap-2">
      <span
        className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center font-heading font-bold text-[13px] ${circleClass}`}
      >
        {state === "done" ? (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </span>
      <span className={`font-heading text-[13px] sm:text-[14px] ${labelClass}`}>{label}</span>
    </div>
  );
}

export interface BumpLite {
  key: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface ExtraLite {
  key: string;
  title: string;
  price: number;
}

export function ReviewOverlay({
  onClose,
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
}: {
  onClose: () => void;
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
}) {
  return (
    <div className="fixed inset-0 z-40 bg-solar-bg-alt overflow-y-auto">
      <header className="bg-solar-deep py-3 px-5 shadow-md sticky top-0 z-10">
        <div className="max-w-[640px] mx-auto flex items-center justify-between">
          <span className="text-white/70 text-[12px] sm:text-[13px] font-heading font-medium">
            Revisar pedido
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-white font-heading font-semibold text-[14px] hover:underline"
          >
            Voltar ao pagamento
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </header>

      <main className="px-5 pt-5 pb-32">
        <div className="max-w-[640px] mx-auto">
          <h1 className="font-heading font-bold text-solar-deep text-[22px] sm:text-[26px] leading-[1.2]">
            Quer alterar algo no pedido?
          </h1>
          <p className="mt-2 text-[16px] text-solar-muted leading-[1.55]">
            Seus dados preenchidos continuam salvos. Ajuste os extras e volte para o pagamento.
          </p>

          <div className="mt-5 bg-white rounded-2xl border border-solar-border p-4 shadow-sm flex items-center justify-between gap-3">
            <div>
              <p className="font-heading font-bold text-solar-deep text-[16px] sm:text-[17px]">
                500 contatos enriquecidos
              </p>
              <p className="text-[14px] text-solar-muted">Na cidade que você escolher</p>
            </div>
            <span className="font-heading font-extrabold text-solar-deep text-[20px]">
              {formatBRL(BASE_PRICE)}
            </span>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => toggleBump("ob4")}
              aria-pressed={selectedKit}
              className={`w-full text-left bg-white rounded-2xl border-2 p-4 transition-colors motion-safe:duration-200 ${
                selectedKit
                  ? "border-solar-primary bg-solar-bg-alt"
                  : "border-solar-border hover:border-solar-primary/40"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading font-bold text-solar-deep text-[16px] sm:text-[17px]">
                  Kit Corta Caminho
                </h3>
                <span className="font-heading font-extrabold text-solar-primary text-[18px]">
                  +{formatBRL(KIT_CONFIG.price)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2.5">
                <span
                  className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center ${
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
                <span className="font-heading font-semibold text-solar-deep text-[14px] sm:text-[15px]">
                  {selectedKit ? "Kit adicionado" : "Adicionar kit"}
                </span>
              </div>
            </button>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowIndividuals(!showIndividuals)}
              aria-expanded={showIndividuals}
              className="inline-flex items-center gap-2 text-solar-primary font-heading font-semibold text-[15px] hover:underline"
            >
              {showIndividuals ? "Recolher avulsos" : "Ver avulsos"}
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
              <div className="mt-3 space-y-2.5">
                {selectedKit && (
                  <div className="rounded-xl border border-solar-primary/30 bg-solar-bg-alt p-3">
                    <p className="text-[14px] text-solar-deep font-heading font-semibold">
                      Os três extras já estão no kit.
                    </p>
                    <button
                      type="button"
                      onClick={clearKit}
                      className="mt-1.5 text-solar-primary font-heading font-semibold text-[13px] hover:underline"
                    >
                      Trocar por avulsos
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
                      className={`w-full text-left bg-white rounded-xl border-2 p-3 transition-colors motion-safe:duration-200 flex items-center justify-between gap-3 ${
                        isSelected ? "border-solar-primary bg-solar-bg-alt" : "border-solar-border"
                      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <span className="font-heading font-semibold text-solar-deep text-[15px]">
                        {bump.title}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-heading font-bold text-solar-primary text-[15px]">
                          +{formatBRL(bump.price)}
                        </span>
                        <span
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
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
                      </span>
                    </button>
                  );
                })}
                {allIndividualsSelected && (
                  <div className="rounded-xl border-2 border-solar-yellow bg-solar-yellow/20 p-3">
                    <p className="text-[14px] text-solar-deep font-heading font-semibold">
                      Com o kit você economiza R$34.
                    </p>
                    <button
                      type="button"
                      onClick={swapToKit}
                      className="btn-sales mt-2 inline-flex items-center justify-center rounded-[10px] px-4 py-2 min-h-[44px] font-heading font-bold text-[14px] uppercase tracking-wide text-white"
                    >
                      TROCAR PELO KIT
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 bg-white rounded-2xl border border-solar-border p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[15px] text-solar-text">500 contatos enriquecidos</span>
              <span className="font-heading font-bold text-solar-deep text-[15px]">
                {formatBRL(BASE_PRICE)}
              </span>
            </div>
            {extras.map((extra) => (
              <div key={extra.key} className="mt-2 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[14px] text-solar-text">
                  <span>{extra.title}</span>
                  <button
                    type="button"
                    onClick={() => removeExtra(extra.key)}
                    className="text-solar-muted text-[12px] font-heading font-semibold hover:text-solar-primary hover:underline"
                  >
                    remover
                  </button>
                </span>
                <span className="font-heading font-bold text-solar-deep text-[14px]">
                  +{formatBRL(extra.price)}
                </span>
              </div>
            ))}
            {hasDobro && (
              <p className="mt-2 text-[12px] text-solar-primary font-heading font-semibold">
                Entrega com 1.000 contatos no total.
              </p>
            )}
            <div className="mt-3 pt-2 border-t border-solar-border flex items-center justify-between">
              <span className="font-heading font-bold text-solar-deep text-[16px]">Total</span>
              <span className="font-heading font-extrabold text-solar-deep text-[20px]">
                {formatBRL(total)}
              </span>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-solar-border shadow-[0_-6px_20px_-6px_rgba(7,91,204,0.18)]">
        <div className="max-w-[640px] mx-auto px-5 py-3 flex items-center gap-3">
          <div className="shrink-0 leading-tight">
            <div className="text-[12px] text-solar-muted">Total</div>
            <div className="font-heading font-extrabold text-solar-deep text-[18px]">
              {formatBRL(total)}
            </div>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="btn-sales flex-1 min-w-0 rounded-[10px] flex items-center justify-center px-4 py-3 min-h-[52px] font-heading font-bold text-[15px] uppercase tracking-wide text-white"
          >
            VOLTAR AO PAGAMENTO
          </button>
        </div>
      </div>
    </div>
  );
}