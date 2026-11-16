/**
 * Formulário do checkout (nome, WhatsApp, e-mail). Cria o pedido no servidor,
 * abre o pagamento da InfinitePay num popup e, quando o servidor confirma o
 * pagamento, fecha o popup e leva o cliente sozinho para /obrigado.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { normalizePhone } from "@/lib/phone";
import { createOrder, getOrderStatus } from "@/lib/orders.functions";
import { formatBRLcents } from "@/lib/checkout-config";
import { getLeadData, trackLeadCapture, type LeadCaptureData } from "@/lib/lead-tracking";

/** Nome completo a partir do lead guardado (o modal repete o nome quando não há sobrenome). */
function fullName(lead: LeadCaptureData): string {
  const first = lead.firstName.trim();
  const last = lead.lastName.trim();
  return last && last !== first ? `${first} ${last}` : first;
}

const POLL_MS = 2500;
const POLL_MAX_MS = 20 * 60 * 1000;
const POPUP_FEATURES = "popup=yes,width=480,height=760,left=120,top=60";

const inputClass =
  "w-full min-h-[48px] rounded-[10px] border border-[#D7E1EE] bg-white px-3.5 text-[16px] text-[#17324F] font-['Open_Sans'] placeholder:text-[#9AAABD] outline-none transition-colors focus:border-[#075BCC] focus:ring-2 focus:ring-[#075BCC]/20";
const labelClass = "block text-[14px] font-['Open_Sans'] font-semibold text-[#092C5D] mb-1.5";

export function InfinitePayForm({ total, extraKeys }: { total: number; extraKeys: string[] }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState<{ orderNsu: string; url: string } | null>(null);
  // Lead capturado na primeira página; lido após a hidratação para não divergir do servidor.
  const [prefilled, setPrefilled] = useState<LeadCaptureData | null>(null);

  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    const lead = getLeadData();
    if (!lead) return;
    setPrefilled(lead);
    setName(fullName(lead));
    setPhone(lead.phone);
    setEmail(lead.email);
  }, []);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    const cleanName = name.trim().replace(/\s+/g, " ");
    const cleanEmail = email.trim().toLowerCase();
    const e164 = normalizePhone(phone);

    if (cleanName.length < 2) return setError("Informe seu nome.");
    if (!e164) return setError("Informe um WhatsApp válido, com DDD.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      return setError("Informe um e-mail válido.");

    // O popup precisa abrir dentro do clique, senão o navegador o bloqueia.
    const popup = window.open("about:blank", "infinitepay-checkout", POPUP_FEATURES);
    popupRef.current = popup;
    setLoading(true);
    try {
      const parts = cleanName.split(" ");
      const firstName = parts[0] ?? cleanName;
      const lastName = parts.slice(1).join(" ");
      // Só reenvia ao CRM se o cliente mudou algo; senão o lead da primeira página já foi enviado.
      const changed =
        !prefilled ||
        prefilled.email.trim().toLowerCase() !== cleanEmail ||
        normalizePhone(prefilled.phone) !== e164 ||
        fullName(prefilled) !== cleanName;
      if (changed) {
        try {
          trackLeadCapture({
            firstName,
            lastName: lastName || firstName,
            email: cleanEmail,
            phone: e164,
          });
        } catch {
          /* não bloqueia o pagamento */
        }
      }

      const { orderNsu, url } = await createOrder({
        data: { name: cleanName, email: cleanEmail, phone: phone, extraKeys },
      });

      if (popup && !popup.closed) {
        popup.location.href = url;
        setPaying({ orderNsu, url });
        startPolling(orderNsu);
      } else {
        // Popup bloqueado: abre o pagamento nesta mesma aba.
        window.location.assign(url);
      }
    } catch (err) {
      console.error(err);
      try {
        popup?.close();
      } catch {
        /* ignora */
      }
      setError("Não foi possível abrir o pagamento. Confira seus dados e tente de novo.");
    } finally {
      setLoading(false);
    }
  };

  if (paying) {
    return (
      <div className="text-center space-y-3.5" role="status" aria-live="polite">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#D7E1EE] border-t-[#075BCC]" />
        <p className="font-heading font-bold text-solar-deep text-[17px]">
          Finalize o pagamento na janela que abriu
        </p>
        <p className="text-[14px] text-solar-muted leading-[1.5]">
          Pague por Pix ou cartão. Esta tela segue sozinha assim que o pagamento for aprovado.
        </p>
        <button
          type="button"
          onClick={() => {
            const win = window.open(paying.url, "infinitepay-checkout", POPUP_FEATURES);
            popupRef.current = win;
          }}
          className="text-solar-primary font-heading font-semibold text-[14px] hover:underline"
        >
          Abrir a janela de pagamento de novo
        </button>
        <div>
          <button
            type="button"
            onClick={() => {
              stopPolling();
              setPaying(null);
            }}
            className="text-solar-muted text-[13px] hover:underline"
          >
            Voltar e corrigir meus dados
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      {prefilled && (
        <p className="text-[13px] text-solar-muted leading-[1.5]">
          Preenchemos com os dados que você informou. Confira e siga para o pagamento.
        </p>
      )}
      <div>
        <label htmlFor="ip-name" className={labelClass}>
          Nome
        </label>
        <input
          id="ip-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Seu nome"
        />
      </div>
      <div>
        <label htmlFor="ip-phone" className={labelClass}>
          WhatsApp
        </label>
        <input
          id="ip-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          placeholder="(11) 99999-9999"
        />
      </div>
      <div>
        <label htmlFor="ip-email" className={labelClass}>
          E-mail
        </label>
        <input
          id="ip-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="voce@email.com"
        />
      </div>

      {error && (
        <p role="alert" className="text-[14px] text-red-600 font-['Open_Sans']">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-sales w-full rounded-[10px] flex items-center justify-center px-4 py-3 min-h-[52px] font-heading font-bold text-[15px] uppercase tracking-wide text-white disabled:opacity-60"
      >
        {loading ? "Abrindo pagamento..." : `Ir para o pagamento · ${formatBRLcents(total)}`}
      </button>
      <p className="text-[12px] text-solar-muted leading-[1.5] text-center">
        O pagamento abre numa janela segura da InfinitePay (Pix ou cartão). Esta tela continua
        sozinha quando for aprovado.
      </p>
    </form>
  );
}
