/**
 * Pagamento da InfinitePay num popup. Cria o pedido no servidor, abre o popup,
 * consulta o status e, quando pago, fecha o popup e leva o cliente para /obrigado.
 * Usado pelo botão da revisão do pedido (direto) e pelo formulário (reserva).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { createOrder, getOrderStatus } from "@/lib/orders.functions";
import { normalizePhone } from "@/lib/phone";
import type { LeadCaptureData } from "@/lib/lead-tracking";

const POLL_MS = 2500;
const POLL_MAX_MS = 20 * 60 * 1000;
const POPUP_FEATURES = "popup=yes,width=480,height=760,left=120,top=60";

export interface Buyer {
  name: string;
  email: string;
  phone: string;
}

/** Nome completo a partir do lead guardado (o modal repete o nome quando não há sobrenome). */
export function fullName(lead: LeadCaptureData): string {
  const first = lead.firstName.trim();
  const last = lead.lastName.trim();
  return last && last !== first ? `${first} ${last}` : first;
}

/** Converte o lead do modal em comprador, ou devolve null se faltar/estiver inválido algum dado. */
export function leadToBuyer(lead: LeadCaptureData | null): Buyer | null {
  if (!lead) return null;
  const name = fullName(lead).replace(/\s+/g, " ");
  const email = lead.email.trim().toLowerCase();
  if (name.length < 2) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (!normalizePhone(lead.phone)) return null;
  return { name, email, phone: lead.phone };
}

export function useInfinitePayCheckout(extraKeys: string[]) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState<{ orderNsu: string; url: string } | null>(null);

  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const busyRef = useRef(false);
  const extraKeysRef = useRef(extraKeys);
  extraKeysRef.current = extraKeys;

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // Para a consulta se o componente sair da tela.
  useEffect(() => stopPolling, [stopPolling]);

  const goToThankYou = useCallback(() => {
    stopPolling();
    try {
      popupRef.current?.close();
    } catch {
      /* popup já fechado */
    }
    window.location.assign("/obrigado");
  }, [stopPolling]);

  const checkStatus = useCallback(
    async (orderNsu: string) => {
      try {
        const { status } = await getOrderStatus({ data: { orderNsu } });
        if (status === "paid") goToThankYou();
      } catch {
        /* falha de rede: tenta de novo no próximo ciclo */
      }
    },
    [goToThankYou],
  );

  const startPolling = useCallback(
    (orderNsu: string) => {
      stopPolling();
      startedAtRef.current = Date.now();
      pollRef.current = window.setInterval(() => {
        if (Date.now() - startedAtRef.current > POLL_MAX_MS) {
          stopPolling();
          return;
        }
        void checkStatus(orderNsu);
      }, POLL_MS);
    },
    [checkStatus, stopPolling],
  );

  // O popup (/pago) avisa que voltou do pagamento: confere na hora.
  useEffect(() => {
    if (!paying) return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string } | null;
      if (data?.type === "infinitepay-paid") void checkStatus(paying.orderNsu);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [paying, checkStatus]);

  /**
   * Chame direto do clique (sem await antes): o popup precisa abrir dentro do
   * gesto do usuário, senão o navegador o bloqueia. Devolve false se falhar.
   */
  const start = useCallback(
    async (buyer: Buyer): Promise<boolean> => {
      if (busyRef.current) return false;
      busyRef.current = true;
      setError(null);
      const popup = window.open("about:blank", "infinitepay-checkout", POPUP_FEATURES);
      popupRef.current = popup;
      setLoading(true);
      try {
        const { orderNsu, url } = await createOrder({
          data: { ...buyer, extraKeys: extraKeysRef.current },
        });
        if (popup && !popup.closed) {
          popup.location.href = url;
          setPaying({ orderNsu, url });
          startPolling(orderNsu);
        } else {
          // Popup bloqueado: abre o pagamento nesta mesma aba.
          window.location.assign(url);
        }
        return true;
      } catch (err) {
        console.error(err);
        try {
          popup?.close();
        } catch {
          /* ignora */
        }
        setError("Não foi possível abrir o pagamento. Confira seus dados e tente de novo.");
        return false;
      } finally {
        busyRef.current = false;
        setLoading(false);
      }
    },
    [startPolling],
  );

  const reopen = useCallback(() => {
    if (!paying) return;
    popupRef.current = window.open(paying.url, "infinitepay-checkout", POPUP_FEATURES);
  }, [paying]);

  const cancel = useCallback(() => {
    stopPolling();
    setPaying(null);
  }, [stopPolling]);

  return { start, loading, error, setError, paying, reopen, cancel };
}
