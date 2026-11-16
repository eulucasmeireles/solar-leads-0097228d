/**
 * Funções de servidor chamadas pela página. A lógica (e os segredos) ficam em
 * orders.server.ts, carregado só dentro dos handlers, para não ir ao navegador.
 */
import { createServerFn } from "@tanstack/react-start";

export const createOrder = createServerFn({ method: "POST" })
  .validator((data: { name: string; email: string; phone: string; extraKeys: string[] }) => data)
  .handler(async ({ data }) => {
    const { createOrderOnServer } = await import("./orders.server");
    return createOrderOnServer(data);
  });

export const getOrderStatus = createServerFn({ method: "GET" })
  .validator((data: { orderNsu: string }) => data)
  .handler(async ({ data }) => {
    const { getStatusOnServer } = await import("./orders.server");
    return { status: await getStatusOnServer(data.orderNsu) };
  });

/** Usada pela página /pago quando o cliente volta do checkout (plano B do webhook). */
export const confirmOrder = createServerFn({ method: "POST" })
  .validator((data: { orderNsu: string; transactionNsu: string; slug: string }) => data)
  .handler(async ({ data }) => {
    const { confirmPayment } = await import("./orders.server");
    return confirmPayment(data);
  });
