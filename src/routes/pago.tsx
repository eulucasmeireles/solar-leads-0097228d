/**
 * Página para onde a InfinitePay devolve o cliente depois de pagar. Roda dentro
 * do popup: confirma o pedido (plano B do webhook), avisa a janela principal e
 * se fecha. Se não for um popup, segue para a página de obrigado.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { confirmOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/pago")({
  head: () => ({ meta: [{ title: "Pagamento — Solar Leads" }] }),
  component: PagoPage,
});

function PagoPage() {
  const [message, setMessage] = useState("Confirmando o seu pagamento...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNsu = params.get("order_nsu") ?? params.get("order") ?? "";
    const transactionNsu = params.get("transaction_nsu") ?? "";
    const slug = params.get("slug") ?? "";

    const finish = () => {
      try {
        window.opener?.postMessage({ type: "infinitepay-paid", orderNsu }, window.location.origin);
      } catch {
        /* a janela principal pode já ter navegado */
      }
      if (window.opener) {
        setMessage("Pagamento confirmado! Você já pode fechar esta janela.");
        window.close();
      } else {
        window.location.replace("/obrigado");
      }
    };

    if (!orderNsu || !transactionNsu || !slug) {
      setMessage("Pagamento em análise. Você já pode fechar esta janela.");
      return;
    }
    confirmOrder({ data: { orderNsu, transactionNsu, slug } })
      .then((result) => {
        if (result.ok) finish();
        else setMessage("Pagamento em análise. Você já pode fechar esta janela.");
      })
      .catch(() => setMessage("Pagamento em análise. Você já pode fechar esta janela."));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-solar-bg-alt p-5">
      <div className="max-w-sm text-center bg-white rounded-2xl border border-solar-border p-8 shadow-lg">
        <p className="font-heading font-bold text-solar-deep text-[18px]">{message}</p>
      </div>
    </div>
  );
}
