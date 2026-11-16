/**
 * Webhook da InfinitePay (POST /api/infinitepay-webhook).
 * O aviso não tem assinatura: nada aqui é confiado. A confirmação é feita em
 * `payment_check` e o valor é comparado com o do pedido salvo no banco.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/infinitepay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return new Response("bad request", { status: 400 });
        }
        const orderNsu = typeof body["order_nsu"] === "string" ? body["order_nsu"] : "";
        const transactionNsu =
          typeof body["transaction_nsu"] === "string" ? body["transaction_nsu"] : "";
        const slug = typeof body["invoice_slug"] === "string" ? body["invoice_slug"] : "";
        if (!orderNsu || !transactionNsu || !slug) {
          return new Response("missing fields", { status: 400 });
        }

        try {
          const { confirmPayment } = await import("@/lib/orders.server");
          const result = await confirmPayment({ orderNsu, transactionNsu, slug });
          // Pedido que não existe ou valor que não bate: 200 para não reenviar para sempre.
          if (!result.ok) console.warn("Webhook InfinitePay ignorado:", result.reason, orderNsu);
          return new Response("ok", { status: 200 });
        } catch (error) {
          console.error("Webhook InfinitePay falhou:", error);
          // 400 faz a InfinitePay tentar de novo.
          return new Response("error", { status: 400 });
        }
      },
    },
  },
});
