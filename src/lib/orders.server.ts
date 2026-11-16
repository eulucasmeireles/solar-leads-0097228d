/**
 * Lógica de pedidos que só roda no servidor: preço, link da InfinitePay,
 * confirmação do pagamento e entrega ao GHL.
 *
 * Importe este módulo apenas de dentro de handlers (import dinâmico) ou de
 * outros arquivos .server.ts. Nunca de código que vai para o navegador.
 *
 * Segredos (configurar em Cloud > Secrets do AI Studio):
 *  - API_GHL: token de Integração Privada do GHL (permissão contacts.write)
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { getRequestUrl } from "@tanstack/react-start/server";
import {
  BASE_PRICE,
  KIT_CONFIG,
  KIT_KEY,
  MAIN_PRODUCT_CONFIG,
  ORDER_BUMPS,
} from "@/lib/checkout-config";
import { normalizePhone } from "@/lib/phone";

// ── Configuração (nada aqui é segredo) ──────────────────────────────────────
const INFINITEPAY_HANDLE = "meirxles";
const INFINITEPAY_API = "https://api.checkout.infinitepay.io";
const GHL_API = "https://services.leadconnectorhq.com";
const GHL_LOCATION_ID = "C7YSmRs3JGd0QinrSfZH";
const GHL_PAID_TAG = "pagou-lista-500";
const GHL_EXTRAS_FIELD_KEY = "extras_comprados";
// Versões do cabeçalho "Version" da API do GHL, na ordem em que são tentadas.
const GHL_VERSIONS = ["2021-07-28", "v3"];

export interface OrderRow {
  id: string;
  order_nsu: string;
  status: "pending" | "paid";
  name: string;
  email: string;
  phone: string;
  extras: string;
  amount_cents: number;
  ghl_contact_id: string | null;
}

/** O banco ainda não tem tipos gerados para a tabela orders: usa um cliente sem tipos. */
async function db(): Promise<SupabaseClient> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as SupabaseClient;
}

// ── Preço (calculado aqui, nunca vem do navegador) ──────────────────────────
export interface PricedOrder {
  keys: string[];
  amountCents: number;
  items: { description: string; quantity: number; price: number }[];
}

export function priceOrder(extraKeys: string[]): PricedOrder {
  const unique = Array.from(new Set(extraKeys));
  for (const k of unique) {
    if (!ORDER_BUMPS.some((b) => b.key === k)) throw new Error("Extra inválido.");
  }
  const kit = unique.includes(KIT_KEY);
  if (kit && unique.length > 1) throw new Error("O kit já inclui os extras avulsos.");
  const chosen = kit ? [KIT_CONFIG] : ORDER_BUMPS.filter((b) => unique.includes(b.key));
  // TESTE: o secret opcional TEST_BASE_PRICE_CENTS (ex.: 100) troca o preço-base só no servidor.
  // Deixe-o VAZIO ou apagado em produção.
  const override = Number(process.env["TEST_BASE_PRICE_CENTS"]);
  const baseCents =
    Number.isInteger(override) && override >= 100 ? override : Math.round(BASE_PRICE * 100);
  const items = [
    { description: MAIN_PRODUCT_CONFIG.title, quantity: 1, price: baseCents },
    ...chosen.map((b) => ({ description: b.title, quantity: 1, price: Math.round(b.price * 100) })),
  ];
  return {
    keys: chosen.map((b) => b.key),
    amountCents: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    items,
  };
}

/** Texto dos extras para o campo "Extras comprados" do contato. */
export function extrasLabel(keys: string[]): string {
  const kit = keys.includes(KIT_KEY);
  const parts = [
    kit || keys.includes("ob3") ? "dobro de contatos" : "",
    kit || keys.includes("ob1") ? "7 mensagens" : "",
    kit || keys.includes("ob2") ? "5 perguntas" : "",
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "nenhum";
}

// ── InfinitePay ──────────────────────────────────────────────────────────────
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

interface PaymentCheck {
  success?: boolean;
  paid?: boolean;
  amount?: number;
  paid_amount?: number;
  capture_method?: string;
}

async function paymentCheck(input: {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}): Promise<PaymentCheck> {
  const res = await fetch(`${INFINITEPAY_API}/payment_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle: INFINITEPAY_HANDLE,
      order_nsu: input.orderNsu,
      transaction_nsu: input.transactionNsu,
      slug: input.slug,
    }),
  });
  if (!res.ok) throw new Error(`payment_check falhou (${res.status}).`);
  return (await res.json()) as PaymentCheck;
}

// ── Criar pedido ─────────────────────────────────────────────────────────────
export async function createOrderOnServer(input: {
  name: string;
  email: string;
  phone: string;
  extraKeys: string[];
}): Promise<{ orderNsu: string; url: string }> {
  const name = input.name.trim().replace(/\s+/g, " ");
  const email = input.email.trim().toLowerCase();
  const phone = normalizePhone(input.phone);
  if (name.length < 2) throw new Error("Nome inválido.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail inválido.");
  if (!phone) throw new Error("WhatsApp inválido.");

  const priced = priceOrder(input.extraKeys);
  const orderNsu = crypto.randomUUID();
  const origin = getRequestUrl({ xForwardedHost: true, xForwardedProto: true }).origin;

  const client = await db();
  const { error: insertError } = await client.from("orders").insert({
    order_nsu: orderNsu,
    status: "pending",
    name,
    email,
    phone,
    extras: extrasLabel(priced.keys),
    amount_cents: priced.amountCents,
  });
  if (insertError) throw new Error(`Não foi possível registrar o pedido: ${insertError.message}`);

  const res = await fetch(`${INFINITEPAY_API}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle: INFINITEPAY_HANDLE,
      order_nsu: orderNsu,
      redirect_url: `${origin}/pago?order=${orderNsu}`,
      webhook_url: `${origin}/api/infinitepay-webhook`,
      items: priced.items,
      customer: { name, email, phone_number: phone },
    }),
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`A InfinitePay recusou o pedido (${res.status}).`);
  const url = pickCheckoutUrl(data);
  if (!url) {
    console.error("InfinitePay /links sem URL:", JSON.stringify(data));
    throw new Error("A InfinitePay não devolveu o link de pagamento.");
  }
  return { orderNsu, url };
}

// ── Status e confirmação ─────────────────────────────────────────────────────
export async function getStatusOnServer(orderNsu: string): Promise<"pending" | "paid" | "unknown"> {
  const client = await db();
  const { data } = await client
    .from("orders")
    .select("status")
    .eq("order_nsu", orderNsu)
    .maybeSingle();
  if (!data) return "unknown";
  return data.status === "paid" ? "paid" : "pending";
}

export type ConfirmResult =
  | { ok: true; status: "paid" }
  | { ok: false; reason: "order_not_found" | "not_paid" | "amount_mismatch" };

/**
 * Confirma o pagamento na InfinitePay e, se estiver pago e o valor bater com o
 * pedido, marca como pago e entrega ao GHL. Pode ser chamada duas vezes (webhook
 * e retorno do cliente): só a primeira faz a entrega.
 */
export async function confirmPayment(input: {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}): Promise<ConfirmResult> {
  const client = await db();
  const { data: order } = await client
    .from("orders")
    .select("*")
    .eq("order_nsu", input.orderNsu)
    .maybeSingle<OrderRow>();
  if (!order) return { ok: false, reason: "order_not_found" };
  if (order.status === "paid") return { ok: true, status: "paid" };

  const check = await paymentCheck(input);
  if (!(check.success === true && check.paid === true)) return { ok: false, reason: "not_paid" };
  if (Number(check.amount) !== order.amount_cents) return { ok: false, reason: "amount_mismatch" };

  // Só quem trocar pending -> paid faz a entrega (evita entrega dupla).
  const { data: updated } = await client
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      transaction_nsu: input.transactionNsu,
      invoice_slug: input.slug,
      paid_amount_cents: check.paid_amount ?? null,
      capture_method: check.capture_method ?? null,
    })
    .eq("id", order.id)
    .eq("status", "pending")
    .select("*")
    .maybeSingle<OrderRow>();
  if (!updated) return { ok: true, status: "paid" };

  try {
    const contactId = await deliverToGhl(updated);
    await client
      .from("orders")
      .update({ ghl_contact_id: contactId, delivered_at: new Date().toISOString() })
      .eq("id", updated.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Entrega ao GHL falhou:", message);
    await client
      .from("orders")
      .update({ delivery_error: message.slice(0, 500) })
      .eq("id", updated.id);
  }
  return { ok: true, status: "paid" };
}

// ── Entrega ao GHL (API direta) ──────────────────────────────────────────────
async function ghlRequest(
  path: string,
  token: string,
  body: unknown,
): Promise<{ ok: boolean; status: number; json: unknown }> {
  let last: { ok: boolean; status: number; json: unknown } = { ok: false, status: 0, json: null };
  for (const version of GHL_VERSIONS) {
    const res = await fetch(`${GHL_API}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: version,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    const json: unknown = await res.json().catch(() => null);
    last = { ok: res.ok, status: res.status, json };
    if (res.ok) return last;
    // 401/403 = token ou permissão: trocar a versão não adianta.
    if (res.status === 401 || res.status === 403) break;
  }
  return last;
}

/** Cria/atualiza o contato, preenche "Extras comprados" e aplica a tag de pago. */
async function deliverToGhl(order: OrderRow): Promise<string> {
  const token = process.env["API_GHL"];
  if (!token) throw new Error("Secret API_GHL não configurado.");

  const [firstName, ...rest] = order.name.split(" ");
  const upsert = await ghlRequest("/contacts/upsert", token, {
    locationId: GHL_LOCATION_ID,
    firstName,
    ...(rest.length > 0 ? { lastName: rest.join(" ") } : {}),
    email: order.email,
    phone: order.phone,
    source: "Checkout InfinitePay",
    customFields: [{ key: GHL_EXTRAS_FIELD_KEY, fieldValue: order.extras }],
  });
  if (!upsert.ok) {
    throw new Error(`upsert ${upsert.status}: ${JSON.stringify(upsert.json).slice(0, 300)}`);
  }
  const contactId = (upsert.json as { contact?: { id?: string } } | null)?.contact?.id;
  if (!contactId) throw new Error("upsert sem id de contato.");

  const tag = await ghlRequest(`/contacts/${contactId}/tags`, token, { tags: [GHL_PAID_TAG] });
  if (!tag.ok) {
    throw new Error(`tag ${tag.status}: ${JSON.stringify(tag.json).slice(0, 300)}`);
  }
  return contactId;
}
