import { useState, useEffect, useMemo, useCallback } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  CALENDAR_ID,
  LOCATION_ID,
  CF_QUEM_CUIDA,
  CF_O_QUE_RESOLVER,
  fetchCalendarFreeSlots,
  submitCalendarBooking,
  splitName,
  type FreeSlotsResponse,
} from "@/lib/booking";

interface BookingSectionProps {
  buyerPhone?: string | null;
  buyerName?: string | null;
  buyerEmail?: string | null;
}

type DaySlot = {
  dateISO: string; // "2026-11-16"
  label: string; // "Dom"
  dayNum: string; // "16"
  slots: string[]; // ISO slot strings
};

const WEEKDAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatSlotTime(isoSlot: string): string {
  try {
    const d = new Date(isoSlot);
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  } catch {
    return isoSlot;
  }
}

function formatFullDate(isoSlot: string): { weekday: string; date: string } {
  try {
    const d = new Date(isoSlot);
    const weekdayFull =
      [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ][d.getDay()] ?? "";
    const date = `${d.getDate().toString().padStart(2, "0")} de ${MONTHS_PT[d.getMonth()] ?? ""} de ${d.getFullYear()}`;
    return { weekday: weekdayFull, date };
  } catch {
    return { weekday: "", date: "" };
  }
}

function buildCalendarDays(freeSlots: FreeSlotsResponse): DaySlot[] {
  const days: DaySlot[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const iso = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
    const entry = freeSlots[iso];
    const slots = entry?.slots ?? [];
    if (slots.length > 0) {
      days.push({
        dateISO: iso,
        label: WEEKDAYS_PT[d.getDay()] ?? "",
        dayNum: d.getDate().toString(),
        slots,
      });
    }
  }
  return days;
}

const QUEM_CUIDA_OPTIONS = [
  "Eu mesmo",
  "Eu e mais uma pessoa",
  "Tenho uma equipe",
  "Ainda estou organizando",
];

const O_QUE_RESOLVER_OPTIONS = [
  "Saber como começar o contato",
  "Qualificar melhor",
  "Acompanhar os retornos",
  "Organizar o processo inteiro",
];

const inputClasses =
  "w-full min-h-[48px] px-3 py-2.5 rounded-lg border border-[#D7E1EE] text-[16px] text-[#17324F] outline-none focus:border-[#075BCC] focus:ring-1 focus:ring-[#075BCC]/30 transition-colors";

export function BookingSection({ buyerPhone, buyerName, buyerEmail }: BookingSectionProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [freeSlots, setFreeSlots] = useState<FreeSlotsResponse>({});
  const [calendarDays, setCalendarDays] = useState<DaySlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<DaySlot | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState(buyerName ?? "");
  const [email, setEmail] = useState(buyerEmail ?? "");
  const [phone, setPhone] = useState(buyerPhone ?? "");
  const [quemCuida, setQuemCuida] = useState<string | null>(null);
  const [oQueResolver, setOQueResolver] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedSlot, setConfirmedSlot] = useState<string>("");

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const now = Date.now();
      const end = now + 14 * 24 * 60 * 60 * 1000;
      const data = await fetchCalendarFreeSlots(CALENDAR_ID, now, end);
      setFreeSlots(data);
    } catch {
      setError("Não foi possível carregar os horários. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  useEffect(() => {
    setCalendarDays(buildCalendarDays(freeSlots));
  }, [freeSlots]);

  // Auto-select first available day when data loads
  useEffect(() => {
    if (calendarDays.length > 0 && !selectedDay) {
      setSelectedDay(calendarDays[0] ?? null);
    }
  }, [calendarDays, selectedDay]);

  const handleSelectDay = (day: DaySlot) => {
    setSelectedDay(day);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
  };

  const canSubmit = !!(
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    selectedSlot &&
    quemCuida &&
    oQueResolver &&
    !submitting
  );

  const handleSubmit = async () => {
    if (!canSubmit || !selectedSlot) return;
    setSubmitting(true);
    setError(null);
    try {
      const { firstName, lastName } = splitName(name);
      await submitCalendarBooking({
        locationId: LOCATION_ID,
        calendarId: CALENDAR_ID,
        firstName: firstName || name,
        lastName,
        email,
        phone,
        selectedSlot,
        customFields: [
          { id: CF_QUEM_CUIDA, field_value: quemCuida ?? "" },
          { id: CF_O_QUE_RESOLVER, field_value: oQueResolver ?? "" },
        ],
      });
      setConfirmedSlot(selectedSlot);
      setBookingConfirmed(true);
    } catch {
      setError("Não foi possível confirmar o agendamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmedDateInfo = useMemo(() => {
    if (!confirmedSlot) return null;
    const { weekday, date } = formatFullDate(confirmedSlot);
    const time = formatSlotTime(confirmedSlot);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return { weekday, date, time, tz };
  }, [confirmedSlot]);

  return (
    <div className="bg-white rounded-2xl border border-[#D7E1EE] p-5 sm:p-8 shadow-sm">
      <div className="text-center">
        <span className="inline-block bg-[#FFE344] text-[#092C5D] font-['Poppins'] font-bold text-[11px] sm:text-[12px] uppercase tracking-wider px-3.5 py-1.5 rounded-full">
          Consultoria 100% Gratuita
        </span>
        <h2 className="mt-3 font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[30px] leading-[1.2] [text-wrap:balance]">
          Vamos olhar para as suas próximas 24h?
        </h2>
        <p className="mt-3 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55] max-w-[520px] mx-auto">
          Escolha um horário para conhecer o caso dos R$19.490 e conversar sobre como acelerar o
          trabalho com sua lista.
        </p>
      </div>

      {bookingConfirmed && confirmedDateInfo ? (
        /* Confirmação */
        <div className="mt-7 rounded-xl bg-[#F2F7FD] border border-[#075BCC] p-5 sm:p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#075BCC] text-white flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <h3 className="mt-3 font-['Poppins'] font-bold text-[#092C5D] text-[19px] sm:text-[21px]">
            Combinado! Sua consultoria está marcada.
          </h3>
          <p className="mt-2 font-['Poppins'] font-semibold text-[#075BCC] text-[16px]">
            {confirmedDateInfo.weekday}, {confirmedDateInfo.date}, às {confirmedDateInfo.time}
          </p>
          <p className="mt-1 text-[13px] text-[#53677D]">Horário de {confirmedDateInfo.tz}</p>
          <p className="mt-3 text-[15px] sm:text-[16px] text-[#17324F] leading-[1.5] max-w-[440px] mx-auto">
            Você recebe a confirmação e os detalhes pelo WhatsApp
            {buyerPhone ? ` no número ${buyerPhone}` : ""}.
          </p>
          <p className="mt-2 text-[13px] text-[#53677D]">
            Sua lista será entregue normalmente, mesmo se você não agendasse.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Consultoria%20Solar%20Leads&dates=${confirmedSlot.replace(/[-:]/g, "").replace(".000", "")}/${confirmedSlot.replace(/[-:]/g, "").replace(".000", "")}&details=Consultoria%20gratuita%20Solar%20Leads`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#075BCC] text-white font-['Poppins'] font-semibold text-[14px] hover:bg-[#0866e2] transition-colors"
            >
              Adicionar ao calendário
            </a>
            <button
              type="button"
              onClick={() => {
                setBookingConfirmed(false);
                setSelectedSlot(null);
              }}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-[10px] border border-[#D7E1EE] text-[#092C5D] font-['Poppins'] font-semibold text-[14px] hover:border-[#075BCC] transition-colors"
            >
              Reagendar
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-7 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-[#53677D] gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#075BCC]" />
              <p className="text-[15px]">Carregando horários disponíveis…</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-[16px] text-[#17324F] mb-4">{error}</p>
              <button
                type="button"
                onClick={loadSlots}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-[10px] bg-[#075BCC] text-white font-['Poppins'] font-semibold text-[14px] hover:bg-[#0866e2] transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : calendarDays.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[16px] text-[#17324F] mb-4">
                Não há horários disponíveis no momento. Tente novamente em alguns instantes.
              </p>
              <button
                type="button"
                onClick={loadSlots}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-[10px] bg-[#075BCC] text-white font-['Poppins'] font-semibold text-[14px] hover:bg-[#0866e2] transition-colors"
              >
                Recarregar horários
              </button>
            </div>
          ) : (
            <>
              {/* === ETAPA ÚNICA: dia + horário + dados === */}
              {/* Seleção de dia */}
              <div>
                <label className="block font-['Poppins'] font-semibold text-[#092C5D] text-[15px] mb-2">
                  Escolha o dia
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                  {calendarDays.map((day) => (
                    <button
                      key={day.dateISO}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`shrink-0 snap-start flex flex-col items-center justify-center w-[60px] py-2.5 rounded-lg border transition-all ${
                        selectedDay?.dateISO === day.dateISO
                          ? "bg-[#092C5D] text-white border-[#092C5D]"
                          : "bg-[#F2F7FD] text-[#092C5D] border-[#D7E1EE] hover:border-[#075BCC]"
                      }`}
                    >
                      <span className="text-[11px] font-medium opacity-80">{day.label}</span>
                      <span className="text-[18px] font-['Poppins'] font-bold leading-tight">
                        {day.dayNum}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seleção de horário */}
              {selectedDay && (
                <div className="transition-all duration-150">
                  <label className="block font-['Poppins'] font-semibold text-[#092C5D] text-[15px] mb-2">
                    Escolha o horário
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedDay.slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSelectSlot(slot)}
                        className={`py-2.5 px-2 rounded-lg text-[15px] font-['Poppins'] font-medium border transition-all ${
                          selectedSlot === slot
                            ? "bg-[#075BCC] text-white border-[#075BCC] font-bold"
                            : "bg-white text-[#17324F] border-[#D7E1EE] hover:border-[#075BCC]"
                        }`}
                      >
                        {formatSlotTime(slot)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulário de dados — sempre visível */}
              <div className="space-y-4 pt-2 border-t border-[#D7E1EE]">
                <label className="block font-['Poppins'] font-semibold text-[#092C5D] text-[15px] pt-4">
                  Seus dados
                </label>

                <div>
                  <label className="block text-[14px] font-['Open_Sans'] font-semibold text-[#17324F] mb-1">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    autoComplete="name"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-['Open_Sans'] font-semibold text-[#17324F] mb-1">
                    WhatsApp com DDD
                    <span className="block text-[13px] font-normal text-[#53677D]">
                      Vamos confirmar sua cidade e enviar sua lista por aqui.
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    autoComplete="tel"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-['Open_Sans'] font-semibold text-[#17324F] mb-1">
                    E-mail
                    <span className="block text-[13px] font-normal text-[#53677D]">
                      Para receber o comprovante da compra.
                    </span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-['Open_Sans'] font-semibold text-[#17324F] mb-1.5">
                    Hoje, quem cuida das vendas?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {QUEM_CUIDA_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setQuemCuida(opt)}
                        className={`min-h-[48px] px-3 py-2 rounded-lg text-[14px] font-['Poppins'] font-semibold border transition-all text-center ${
                          quemCuida === opt
                            ? "bg-[#075BCC]/10 text-[#075BCC] border-[#075BCC]"
                            : "bg-white text-[#17324F] border-[#D7E1EE] hover:border-[#075BCC]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-['Open_Sans'] font-semibold text-[#17324F] mb-1.5">
                    O que você mais quer resolver nessa conversa?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {O_QUE_RESOLVER_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setOQueResolver(opt)}
                        className={`min-h-[48px] px-3 py-2 rounded-lg text-[14px] font-['Poppins'] font-semibold border transition-all text-center ${
                          oQueResolver === opt
                            ? "bg-[#075BCC]/10 text-[#075BCC] border-[#075BCC]"
                            : "bg-white text-[#17324F] border-[#D7E1EE] hover:border-[#075BCC]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botão de confirmação */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`btn-sales rounded-[10px] w-full flex items-center justify-center font-['Poppins'] font-bold text-[17px] sm:text-[19px] min-h-[56px] px-6 py-4 text-center leading-tight transition-all duration-150 ${
                    canSubmit ? "cursor-pointer" : "pointer-events-none opacity-50 grayscale-[0.3]"
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Confirmando…
                    </span>
                  ) : (
                    "CONFIRMAR MINHA CONSULTORIA"
                  )}
                </button>
                {!selectedSlot && (
                  <p className="mt-3 text-center text-[14px] text-[#53677D]">
                    Selecione um dia e um horário acima para continuar.
                  </p>
                )}
                {error && <p className="mt-3 text-center text-[14px] text-[#b91c1c]">{error}</p>}
                <p className="mt-3 text-center text-[13px] text-[#53677D] leading-[1.5]">
                  Você recebe a confirmação e os detalhes pelo WhatsApp.
                </p>
                <p className="mt-1 text-center text-[12px] text-[#53677D]">
                  Sua lista será entregue normalmente, mesmo se você não agendar.
                </p>
                <p className="mt-2 text-center text-[13px] text-[#53677D] leading-[1.5] max-w-[460px] mx-auto">
                  As 24h são o horizonte do plano de execução. Os resultados dependem da preparação,
                  do atendimento e das respostas dos contatos.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
