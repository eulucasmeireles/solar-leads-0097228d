import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useHydrated } from "@tanstack/react-router";
import { readCheckoutOrder, type CheckoutOrder } from "@/integrations/payments";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Tudo certo! — Solar Leads" },
      {
        name: "description",
        content:
          "Pagamento confirmado. Vamos confirmar sua cidade pelo WhatsApp e enviar a lista em PDF.",
      },
    ],
  }),
  component: ThankYouPage,
});

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function ThankYouPage() {
  const hydrated = useHydrated();
  const [order, setOrder] = useState<CheckoutOrder | null>(null);

  useEffect(() => {
    if (hydrated) {
      setOrder(readCheckoutOrder());
    }
  }, [hydrated]);

  const total = order?.totals?.totalDueToday ?? order?.amount ?? null;
  const hasDobro = order?.lines?.some(
    (l) => l.name.toLowerCase().includes("dobro") || l.name.toLowerCase().includes("1.000"),
  );

  return (
    <div className="min-h-screen bg-solar-bg-alt text-solar-text font-body">
      <header className="bg-solar-deep py-3 px-4 sm:px-5 shadow-md">
        <div className="max-w-[640px] mx-auto flex items-center justify-between">
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
            Pedido confirmado
          </span>
        </div>
      </header>

      <main className="px-5 pt-10 pb-16">
        <div className="max-w-[520px] mx-auto text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-solar-primary flex items-center justify-center shadow-lg">
            <svg
              className="w-9 h-9 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="mt-5 font-heading font-bold text-solar-deep text-[26px] sm:text-[32px] leading-[1.15]">
            Tudo certo! Agora é pelo WhatsApp.
          </h1>

          <p className="mt-3 text-[16px] sm:text-[17px] text-solar-text leading-[1.6]">
            Vamos confirmar a cidade da sua lista e enviar o PDF na mesma conversa. A entrega
            acontece em até 2h após a confirmação do pagamento e da cidade.
          </p>

          {order && (
            <div className="mt-6 bg-white rounded-2xl border border-solar-border p-5 shadow-sm text-left">
              <p className="font-heading font-semibold text-solar-deep text-[15px]">
                Pedido {order.orderId}
              </p>
              <div className="mt-3 space-y-2">
                {order.lines.map((line) => (
                  <div key={line.priceId} className="flex items-center justify-between gap-3">
                    <span className="text-[15px] text-solar-text">{line.name}</span>
                    <span className="font-heading font-bold text-solar-deep text-[15px]">
                      {formatBRL(line.unitAmount)}
                    </span>
                  </div>
                ))}
              </div>
              {hasDobro && (
                <p className="mt-3 text-[13px] text-solar-primary font-heading font-semibold">
                  Sua entrega contém 1.000 contatos no total.
                </p>
              )}
              {total != null && (
                <div className="mt-3 pt-3 border-t border-solar-border flex items-center justify-between">
                  <span className="font-heading font-bold text-solar-deep text-[16px]">
                    Total pago
                  </span>
                  <span className="font-heading font-extrabold text-solar-deep text-[20px]">
                    {formatBRL(total)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex items-start gap-3 bg-white rounded-xl border border-solar-border p-4 text-left">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="shrink-0 mt-0.5 w-5 h-5 text-solar-primary"
              aria-hidden="true"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.13c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24zm4.52-5.46c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
            </svg>
            <div>
              <p className="font-heading font-semibold text-solar-deep text-[15px]">
                Fique de olho no seu WhatsApp
              </p>
              <p className="mt-1 text-[14px] text-solar-muted leading-[1.5]">
                A gente entra em contato pelo número informado na compra para confirmar a cidade e
                enviar sua lista.
              </p>
            </div>
          </div>

          <a
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-[10px] px-6 py-3 min-h-[52px] font-heading font-semibold text-[15px] text-solar-primary border-2 border-solar-primary/30 hover:bg-solar-primary hover:text-white transition-colors motion-safe:duration-200"
          >
            Voltar ao início
          </a>
        </div>
      </main>
    </div>
  );
}
