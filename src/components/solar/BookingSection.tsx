import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { SalesButton } from "./SalesButton";

interface BookingSectionProps {
  buyerPhone?: string | null;
}

export function BookingSection({ buyerPhone }: BookingSectionProps) {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("Amanhã");
  const [selectedTime, setSelectedTime] = useState<string>("14:30");

  return (
    <div className="bg-white rounded-2xl border-2 border-[#075BCC] p-6 sm:p-8 shadow-md">
      <div className="text-center">
        <span className="inline-block bg-[#FFE344] text-[#092C5D] font-['Poppins'] font-extrabold text-[12px] uppercase tracking-wider px-3.5 py-1.5 rounded-full">
          Consultoria 100% Gratuita
        </span>
        <h2 className="mt-3 font-['Poppins'] font-bold text-[#092C5D] text-[23px] sm:text-[28px] leading-[1.2]">
          Vamos olhar para as suas próximas 24h?
        </h2>
        <p className="mt-2.5 text-[15px] sm:text-[16px] text-[#17324F] leading-[1.5] max-w-[500px] mx-auto">
          Escolha um horário para conhecer o caso dos R$19.490 e conversar sobre como trabalhar sua
          lista com foco nos primeiros pedidos de orçamento.
        </p>
        <p className="mt-1.5 text-[13px] text-[#53677D] max-w-[480px] mx-auto">
          As próximas 24h são o horizonte do plano que vamos discutir. O avanço depende da
          preparação da sua operação, da execução e das respostas dos contatos.
        </p>
      </div>

      {bookingConfirmed ? (
        <div className="mt-7 rounded-xl bg-[#F2F7FD] border border-[#075BCC] p-5 sm:p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#075BCC] text-white flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <h3 className="mt-3 font-['Poppins'] font-bold text-[#092C5D] text-[19px] sm:text-[21px]">
            Combinado! Sua consultoria está marcada.
          </h3>
          <p className="mt-2 font-['Poppins'] font-semibold text-[#075BCC] text-[16px]">
            {selectedDay} às {selectedTime} (Horário de Brasília)
          </p>
          <p className="mt-3 text-[14px] sm:text-[15px] text-[#17324F] leading-[1.5] max-w-[440px] mx-auto">
            Você recebe a confirmação e os detalhes pelo WhatsApp
            {buyerPhone ? ` no número ${buyerPhone}` : ""}.
          </p>
          <p className="mt-2 text-[13px] text-[#53677D]">
            Sua lista será entregue normalmente, mesmo se você não agendasse.
          </p>
          <button
            type="button"
            onClick={() => setBookingConfirmed(false)}
            className="mt-4 text-[13px] font-['Poppins'] font-semibold text-[#075BCC] underline hover:text-[#092C5D]"
          >
            Escolher outro horário
          </button>
        </div>
      ) : (
        <div className="mt-7 space-y-5">
          <div>
            <label className="block font-['Poppins'] font-semibold text-[#092C5D] text-[14px] mb-2">
              1. Escolha o dia:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Hoje", "Amanhã", "Depois de amanhã"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  className={`py-2.5 px-2 rounded-lg text-[14px] font-['Poppins'] font-semibold border transition-all ${
                    selectedDay === d
                      ? "bg-[#092C5D] text-white border-[#092C5D] shadow-xs"
                      : "bg-[#F2F7FD] text-[#092C5D] border-[#D7E1EE] hover:border-[#075BCC]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-['Poppins'] font-semibold text-[#092C5D] text-[14px] mb-2">
              2. Escolha o horário disponível:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {["09:30", "11:00", "14:30", "16:00", "17:30", "19:00"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  className={`py-2 px-2 rounded-lg text-[14px] font-['Poppins'] font-medium border transition-all ${
                    selectedTime === t
                      ? "bg-[#075BCC] text-white border-[#075BCC] font-bold shadow-xs"
                      : "bg-white text-[#17324F] border-[#D7E1EE] hover:border-[#075BCC]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <SalesButton
              text="CONFIRMAR MINHA CONSULTORIA"
              onClick={() => setBookingConfirmed(true)}
              size="large"
            />
            <p className="mt-3 text-center text-[13px] text-[#53677D]">
              Você recebe a confirmação e os detalhes pelo WhatsApp.
            </p>
            <p className="mt-1 text-center text-[12px] text-[#53677D]">
              Sua lista será entregue normalmente, mesmo se você não agendar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
