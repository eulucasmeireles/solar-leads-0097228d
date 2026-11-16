/**
 * Meta Pixel — carregamento e eventos do lado do cliente (navegador).
 * Pixel ID é publicável; o token de acesso NÃO entra aqui (fica no servidor).
 *
 * Eventos disparados:
 *  - PageView            (automático no init)
 *  - Lead                (ao preencher o formulário de captura pré-checkout)
 *  - InitiateCheckout    (ao abrir o modal / clicar em CTA de compra)
 *  - Purchase            (servidor, via Conversions API — ver meta-conversions.server.ts)
 */

export const META_PIXEL_ID = "977645752087588";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/** Carrega o script base do Pixel e dispara o PageView. Idempotente. */
export function initMetaPixel(): void {
  if (typeof window === "undefined") return;
  if (window.fbq) return;

  if (window.fbq) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.getElementsByTagName("script")[0]?.parentNode?.insertBefore(script, null);

  // Minimal fbq shim until the real script assigns the full implementation.
  const queue: unknown[][] = [];
  const fbq = ((...args: unknown[]) => {
    queue.push(args);
  }) as unknown as ((...args: unknown[]) => void) & {
    callMethod?: unknown;
    queue: unknown[];
    loaded: boolean;
    version: string;
    push: (...args: unknown[]) => void;
  };
  fbq.queue = queue;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = (...args: unknown[]) => {
    queue.push(args);
  };
  window.fbq = fbq as unknown as (...args: unknown[]) => void;
  window._fbq = window.fbq;

  window.fbq?.("init", META_PIXEL_ID);
  window.fbq?.("track", "PageView");
}

/** Dispara um evento padrão do Pixel no navegador. */
export function trackMetaEvent(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, params);
}

/**
 * Gera um event_id estável por evento para ligar o Pixel (cliente) à
 * Conversions API (servidor) e evitar duplicação no Meta.
 */
export function newEventId(): string {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toUpperCase();
}
