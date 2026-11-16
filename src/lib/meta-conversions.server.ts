/**
 * Meta Conversions API — envio de eventos do servidor para o Meta.
 * O token de acesso (META_CONVERSIONS_TOKEN) é lido dentro do handler e
 * nunca vai para o navegador.
 *
 * Importe este módulo apenas de dentro de handlers (import dinâmico) ou de
 * outros arquivos .server.ts.
 */
import { createHmac } from "node:crypto";

const META_GRAPH_API = "https://graph.facebook.com";
const META_API_VERSION = "v21.0";
export const META_PIXEL_ID = "977645752087588";

export interface MetaUserData {
  email?: string | undefined;
  phone?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  country?: string | undefined;
  zip?: string | undefined;
  clientIpAddress?: string | undefined;
  clientUserAgent?: string | undefined;
  fbp?: string | undefined;
  fbc?: string | undefined;
}

export interface MetaEventPayload {
  eventName: string;
  eventId?: string;
  eventTime?: number;
  userData: MetaUserData;
  value?: number;
  currency?: string;
  sourceUrl?: string;
}

/** Normaliza e aplica SHA-256 aos campos PII antes do envio (exigência do Meta). */
async function hashPii(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeHash(value?: string): Promise<string | undefined> {
  return value ? hashPii(value) : Promise.resolve(undefined);
}

/** Envia um evento para a Conversions API do Meta. */
export async function sendMetaConversion(
  payload: MetaEventPayload,
): Promise<{ ok: boolean; status: number }> {
  const token = process.env["META_CONVERSIONS_TOKEN"];
  if (!token) {
    console.warn("[Meta CAPI] META_CONVERSIONS_TOKEN não configurado — evento não enviado.");
    return { ok: false, status: 0 };
  }

  const [em, ph, fn, ln, ct, st, country, zp] = await Promise.all([
    safeHash(payload.userData.email),
    safeHash(payload.userData.phone),
    safeHash(payload.userData.firstName),
    safeHash(payload.userData.lastName),
    safeHash(payload.userData.city),
    safeHash(payload.userData.state),
    safeHash(payload.userData.country),
    safeHash(payload.userData.zip),
  ]);

  const userData: Record<string, unknown> = {
    em: em ? [em] : undefined,
    ph: ph ? [ph] : undefined,
    fn: fn ? [fn] : undefined,
    ln: ln ? [ln] : undefined,
    ct: ct ? [ct] : undefined,
    st: st ? [st] : undefined,
    country: country ? [country] : undefined,
    zp: zp ? [zp] : undefined,
    client_ip_address: payload.userData.clientIpAddress,
    client_user_agent: payload.userData.clientUserAgent,
    fbp: payload.userData.fbp,
    fbc: payload.userData.fbc,
  };
  // remove undefined
  for (const k of Object.keys(userData)) {
    if (userData[k] === undefined) delete userData[k];
  }

  const body = {
    data: [
      {
        event_name: payload.eventName,
        event_id: payload.eventId,
        event_time: payload.eventTime ?? Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: payload.sourceUrl,
        user_data: userData,
        custom_data:
          payload.value !== undefined
            ? {
                value: payload.value,
                currency: payload.currency ?? "BRL",
              }
            : undefined,
      },
    ],
    // O Meta exige test_event_code em ambiente de teste (sandbox). Em produção fica vazio.
    test_event_code: process.env["META_TEST_EVENT_CODE"] || undefined,
  };

  const url = `${META_GRAPH_API}/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[Meta CAPI] ${res.status}:`, text.slice(0, 500));
  }
  return { ok: res.ok, status: res.status };
}

/** Lê o cookie _fbp do navegador a partir do header Cookie da requisição. */
export function readFbp(cookieHeader?: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(/(?:^|;\s*)_fbp=([^;]+)/);
  return match?.[1];
}

/** Constrói o _fbc a partir do fbp + tempo, ou lê do cookie se já existir. */
export function readOrBuildFbc(cookieHeader?: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const existing = cookieHeader.match(/(?:^|;\s*)_fbc=([^;]+)/);
  if (existing?.[1]) return existing[1];
  const fbp = readFbp(cookieHeader);
  if (!fbp) return undefined;
  return `fb.1.${Date.now()}.${fbp.split(".").slice(-1)[0]}`;
}

/** HMAC do webhook do Meta (caso precise validar callbacks futuros). */
export function verifyMetaSignature(
  payload: string,
  signature: string,
  appSecret: string,
): boolean {
  const expected = "sha1=" + createHmac("sha1", appSecret).update(payload).digest("hex");
  return expected === signature;
}
