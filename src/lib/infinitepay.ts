/**
 * Checkout da InfinitePay (Checkout Integrado).
 *
 * Cria o link de pagamento direto do navegador, usando só o `handle` (a
 * InfiniteTag da conta). A API aceita chamadas de qualquer origem sem chave.
 * NUNCA coloque a chave `inchk_...` neste arquivo: o código da página é público.
 * Quem libera o produto é o workflow do GHL, que confirma o pagamento em
 * `payment_check`; o redirecionamento de volta não prova que o cliente pagou.
 */
import { parsePhoneNumberFromString } from "libphonenumber-js";

/** InfiniteTag da conta InfinitePay, sem o "$". TROQUE antes de publicar. */
export const INFINITEPAY_HANDLE = "meirxles";

/** URL do Inbound Webhook do workflow do GHL que confirma o pagamento. Vazio = sem webhook. */
export const INFINITEPAY_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/C7YSmRs3JGd0QinrSfZH/webhook-trigger/7b964c67-2c9a-438c-a12c-fd541c1c20bb";

const API = "https://api.checkout.infinitepay.io";
const PLACEHOLDER_HANDLE = "SEU_HANDLE_AQUI";

export interface CheckoutBuyer {
  name: string;
  email: string;
  /** Telefone em formato internacional, ex.: +5511999887766 */
  phone: string;
}

export interface CheckoutLine {
  description: string;
  /** Valor em reais (97 = R$ 97,00). Convertido para centavos ao criar o link. */
  price: number;
  quantity?: number;
}

export function isInfinitePayConfigured(): boolean {
  const handle = INFINITEPAY_HANDLE.trim();
  return handle !== "" && handle !== PLACEHOLDER_HANDLE;
}

/** Devolve o telefone em formato internacional (+55...) ou null se for inválido. */
export function normalizePhone(text: string): string | null {
  const parsed = parsePhoneNumberFromString(text, "BR");
  return parsed?.isValid() ? parsed.number : null;
}

/** A resposta de /links não é documentada: procura a URL de pagamento nos campos comuns. */
function pickCheckoutUrl(data: unknown): string | null {
  const isHttps = (v: unknown): v is string => typeof v === "string" && v.startsWith("https://");
  const scan = (obj: unknown): string | null => {
    if (!obj || typeof obj !== "object") return null;
    const rec = obj as Record<string, unknown>;
    for (const key of ["url", "checkout_url", "payment_url", "link", "link_url"]) {
      if (isHttps(rec[key])) return rec[key];
    }
    for (const [key, value] of Object.entries(rec)) {
      if (/url|link/i.test(key) && isHttps(value)) return value;
    }
    return null;
  };
  const top = scan(data);
  if (top) return top;
  if (data && typeof data === "object") {
    for (const value of Object.values(data as Record<string, unknown>)) {
      const nested = scan(value);
      if (nested) return nested;
    }
  }
  return null;
}

/**
 * Cria o link na InfinitePay e devolve a URL do checkout hospedado.
 * O `order_nsu` leva o telefone do comprador e as chaves dos extras escolhidos
 * (formato `5511999999999-1731000000000-ob1ob3`, ou `...-base` sem extras),
 * porque o webhook não traz e-mail nem telefone, só `order_nsu`,
 * `transaction_nsu` e `invoice_slug`. O workflow do GHL confere o valor pago
 * contra esses extras, então adulterar a chave não libera nada sem pagar.
 */
export async function createInfinitePayLink(
  buyer: CheckoutBuyer,
  lines: CheckoutLine[],
  extraKeys: string[] = [],
): Promise<string> {
  if (!isInfinitePayConfigured()) {
    throw new Error("Checkout ainda não configurado: informe o handle da InfinitePay.");
  }
  if (lines.length === 0) throw new Error("Pedido vazio.");

  const digits = buyer.phone.replace(/\D/g, "");
  const body: Record<string, unknown> = {
    handle: INFINITEPAY_HANDLE.trim(),
    order_nsu: `${digits}-${Date.now()}-${extraKeys.join("") || "base"}`,
    redirect_url: `${window.location.origin}/obrigado`,
    items: lines.map((l) => ({
      description: l.description,
      quantity: l.quantity ?? 1,
      price: Math.round(l.price * 100),
    })),
    customer: { name: buyer.name, email: buyer.email, phone_number: buyer.phone },
  };
  if (INFINITEPAY_WEBHOOK_URL) body["webhook_url"] = INFINITEPAY_WEBHOOK_URL;

  const res = await fetch(`${API}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`InfinitePay recusou o pedido (${res.status}).`);
  console.info("InfinitePay /links:", data);

  const url = pickCheckoutUrl(data);
  if (!url) throw new Error("A InfinitePay não devolveu o link de pagamento.");
  return url;
}
