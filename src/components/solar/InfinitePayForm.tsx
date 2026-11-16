/**
 * Formulário de reserva do checkout (nome, WhatsApp, e-mail). Só aparece quando
 * o cliente chega ao /checkout sem os dados do modal da primeira página, ou com
 * dados inválidos. No fluxo normal o botão da revisão do pedido paga direto.
 */
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { normalizePhone } from "@/lib/phone";
import { formatBRLcents } from "@/lib/checkout-config";
import { getLeadData, trackLeadCapture, type LeadCaptureData } from "@/lib/lead-tracking";
import { fullName, useInfinitePayCheckout } from "@/lib/use-infinitepay-checkout";
import { PaymentWaiting } from "@/components/solar/PaymentWaiting";

const inputClass =
  "w-full min-h-[48px] rounded-[10px] border border-[#D7E1EE] bg-white px-3.5 text-[16px] text-[#17324F] font-['Open_Sans'] placeholder:text-[#9AAABD] outline-none transition-colors focus:border-[#075BCC] focus:ring-2 focus:ring-[#075BCC]/20";
const labelClass = "block text-[14px] font-['Open_Sans'] font-semibold text-[#092C5D] mb-1.5";

export function InfinitePayForm({ total, extraKeys }: { total: number; extraKeys: string[] }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Lead capturado na primeira página; lido após a hidratação para não divergir do servidor.
  const [prefilled, setPrefilled] = useState<LeadCaptureData | null>(null);
  const checkout = useInfinitePayCheckout(extraKeys);

  useEffect(() => {
    const lead = getLeadData();
    if (!lead) return;
    setPrefilled(lead);
    setName(fullName(lead));
    setPhone(lead.phone);
    setEmail(lead.email);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (checkout.loading) return;
    setError(null);

    const cleanName = name.trim().replace(/\s+/g, " ");
    const cleanEmail = email.trim().toLowerCase();
    const e164 = normalizePhone(phone);

    if (cleanName.length < 2) return setError("Informe seu nome.");
    if (!e164) return setError("Informe um WhatsApp válido, com DDD.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      return setError("Informe um e-mail válido.");

    // Só reenvia ao CRM se o cliente mudou algo; senão o lead da primeira página já foi enviado.
    const changed =
      !prefilled ||
      prefilled.email.trim().toLowerCase() !== cleanEmail ||
      normalizePhone(prefilled.phone) !== e164 ||
      fullName(prefilled) !== cleanName;
    if (changed) {
      const parts = cleanName.split(" ");
      const firstName = parts[0] ?? cleanName;
      const lastName = parts.slice(1).join(" ");
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

    // Chamado direto do envio do formulário: o popup precisa abrir dentro do clique.
    void checkout.start({ name: cleanName, email: cleanEmail, phone });
  };

  if (checkout.paying) {
    return (
      <PaymentWaiting
        onReopen={checkout.reopen}
        onCancel={checkout.cancel}
        cancelLabel="Voltar e corrigir meus dados"
      />
    );
  }

  const shownError = error ?? checkout.error;

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

      {shownError && (
        <p role="alert" className="text-[14px] text-red-600 font-['Open_Sans']">
          {shownError}
        </p>
      )}

      <button
        type="submit"
        disabled={checkout.loading}
        className="btn-sales w-full rounded-[10px] flex items-center justify-center px-4 py-3 min-h-[52px] font-heading font-bold text-[15px] uppercase tracking-wide text-white disabled:opacity-60"
      >
        {checkout.loading
          ? "Abrindo pagamento..."
          : `Ir para o pagamento · ${formatBRLcents(total)}`}
      </button>
      <p className="text-[12px] text-solar-muted leading-[1.5] text-center">
        O pagamento abre numa janela segura da InfinitePay (Pix ou cartão). Esta tela continua
        sozinha quando for aprovado.
      </p>
    </form>
  );
}
