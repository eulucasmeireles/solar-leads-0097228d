import { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { trackLeadCapture } from "@/lib/lead-tracking";

interface LeadCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Status = "idle" | "submitting" | "done";

/** Normaliza para (XX) XXXXX-XXXX ou (XX) XXXX-XXXX */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(raw: string): boolean {
  const d = raw.replace(/\D/g, "");
  return d.length === 10 || d.length === 11;
}

export function LeadCaptureModal({ open, onClose, onSuccess }: LeadCaptureModalProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState(false);
  const [consent, setConsent] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Trava o scroll do body quando aberto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => firstInputRef.current?.focus(), 80);
      return () => {
        document.body.style.overflow = "";
        clearTimeout(t);
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [open]);

  // Fecha com ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "submitting") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, status, onClose]);

  if (!open) return null;

  const emailValid = isValidEmail(email);
  const phoneValid = isValidPhone(phone);
  const nameValid = firstName.trim().length >= 2;
  const formValid = nameValid && emailValid && phoneValid && consent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!formValid || status === "submitting") return;

    setStatus("submitting");
    // Fire-and-forget: envia ao CRM e segue para o checkout.
    try {
      trackLeadCapture({
        firstName: firstName.trim(),
        lastName: firstName.trim(),
        email: email.trim(),
        phone: phone,
      });
    } catch {
      /* não bloqueia a navegação */
    }

    // Pequeno delay para feedback visual do envio
    setTimeout(() => {
      setStatus("done");
      onSuccess();
    }, 650);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#092C5D]/55 backdrop-blur-[2px] animate-in fade-in duration-150"
        onClick={() => status !== "submitting" && onClose()}
      />

      {/* Card */}
      <div className="relative w-full sm:max-w-[440px] bg-white rounded-t-2xl sm:rounded-2xl shadow-[0_-8px_40px_-8px_rgba(9,44,93,0.35)] sm:shadow-[0_20px_60px_-12px_rgba(9,44,93,0.4)] border border-[#D7E1EE] mx-0 sm:mx-4 max-h-[92dvh] overflow-y-auto animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-1">
          <div>
            <span className="inline-block bg-[#FFE344] text-[#092C5D] font-['Poppins'] font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md">
              Quase lá
            </span>
            <h2
              id="lead-modal-title"
              className="mt-3 font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[24px] leading-[1.2]"
            >
              Onde a gente te encontra?
            </h2>
            <p className="mt-1.5 text-[15px] text-[#53677D] leading-[1.5]">
              Deixa seus contatos pra gente te chamar no WhatsApp e confirmar sua cidade.
            </p>
          </div>
          <button
            type="button"
            onClick={() => status !== "submitting" && onClose()}
            aria-label="Fechar"
            className="shrink-0 -mt-1 -mr-1 p-1.5 rounded-lg text-[#53677D] hover:bg-[#F2F7FD] hover:text-[#092C5D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 space-y-3.5"
          noValidate
        >
          {/* Nome */}
          <div>
            <label
              htmlFor="lead-firstname"
              className="block text-[14px] font-['Open_Sans'] font-semibold text-[#092C5D] mb-1.5"
            >
              Nome
            </label>
            <input
              ref={firstInputRef}
              id="lead-firstname"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Como você se chama?"
              className="w-full min-h-[48px] rounded-[10px] border bg-white px-3.5 text-[16px] text-[#17324F] font-['Open_Sans'] placeholder:text-[#9AAABD] outline-none transition-colors focus:border-[#075BCC] focus:ring-2 focus:ring-[#075BCC]/20"
              style={{
                borderColor: touched && !nameValid ? "#ef4444" : "#D7E1EE",
              }}
            />
          </div>

          {/* E-mail */}
          <div>
            <label
              htmlFor="lead-email"
              className="block text-[14px] font-['Open_Sans'] font-semibold text-[#092C5D] mb-1.5"
            >
              E-mail
            </label>
            <input
              id="lead-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="seu@email.com"
              className="w-full min-h-[48px] rounded-[10px] border bg-white px-3.5 text-[16px] text-[#17324F] font-['Open_Sans'] placeholder:text-[#9AAABD] outline-none transition-colors focus:border-[#075BCC] focus:ring-2 focus:ring-[#075BCC]/20"
              style={{
                borderColor: touched && !emailValid && email.length > 0 ? "#ef4444" : "#D7E1EE",
              }}
            />
            {touched && !emailValid && email.length > 0 && (
              <p className="mt-1 text-[13px] text-red-500 font-['Open_Sans']">
                Digite um e-mail válido.
              </p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label
              htmlFor="lead-phone"
              className="block text-[14px] font-['Open_Sans'] font-semibold text-[#092C5D] mb-1.5"
            >
              WhatsApp
            </label>
            <input
              id="lead-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              onBlur={() => setTouched(true)}
              placeholder="(11) 90000-0000"
              className="w-full min-h-[48px] rounded-[10px] border bg-white px-3.5 text-[16px] text-[#17324F] font-['Open_Sans'] placeholder:text-[#9AAABD] outline-none transition-colors focus:border-[#075BCC] focus:ring-2 focus:ring-[#075BCC]/20"
              style={{
                borderColor: touched && !phoneValid && phone.length > 0 ? "#ef4444" : "#D7E1EE",
              }}
            />
            {touched && !phoneValid && phone.length > 0 && (
              <p className="mt-1 text-[13px] text-red-500 font-['Open_Sans']">
                Informe um WhatsApp com DDD.
              </p>
            )}
            <p className="mt-1.5 text-[13px] text-[#53677D] font-['Open_Sans'] leading-[1.45]">
              Vamos confirmar sua cidade e enviar a lista por aqui.
            </p>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-sales w-full min-h-[56px] rounded-[10px] font-['Poppins'] font-bold text-[17px] sm:text-[18px] text-white flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed mt-1"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              "IR PARA O PAGAMENTO"
            )}
          </button>

          {/* Consentimento de contato pelo WhatsApp */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[5px] border-2 border-[#D7E1EE] accent-[#075BCC] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#075BCC]/30"
              />
              <span className="text-[13px] sm:text-[14px] text-[#53677D] font-['Open_Sans'] leading-[1.5]">
                Concordo em receber minha lista e o atendimento pelo WhatsApp no número informado.
              </span>
            </label>
            {touched && !consent && (
              <p className="mt-1 ml-[26px] text-[12px] text-red-500 font-['Open_Sans']">
                Marque para continuar.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
