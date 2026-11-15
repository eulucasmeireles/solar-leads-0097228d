import { useState, useEffect, useMemo, useCallback } from "react";
import { CheckCircle2, Loader2, User, Phone, Mail, Clock, CalendarDays } from "lucide-react";
import {
  CALENDAR_ID,
  LOCATION_ID,
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

function maskPhone(phone: string): string {
  if (!phone) return "";
  // Remove tudo que não é dígito
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 11) {
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}${digits.length > 6 ? "-" + digits.slice(6) : ""}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function BookingSection({ buyerPhone, buyerName, buyerEmail }: BookingSectionProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [freeSlots, setFreeSlots] = useState<FreeSlotsResponse>({});
  const [calendarDays, setCalendarDays] = useState<DaySlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<DaySlot | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

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

  // Buyer data already collected at checkout — use directly
  const name = buyerName ?? "";
  const email = buyerEmail ?? "";
  const phone = buyerPhone ?? "";

  const canSubmit = !!(name.trim() && email.trim() && phone.trim() && selectedSlot && !submitting);

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
        customFields: [],
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
        <p className="mt-3 text-[16px] sm:text-[17px] text-[#53677D] leading-[1.55] max-w-[520px] mx-auto">
          Escolha um horário para conhecer o caso dos R$19.490 e conversar sobre como acelerar o
          trabalho com sua lista.
        </p>
      </div>

      {/* Mostra os dados que já temos do comprador */}
      {(name || phone || email) && (
        <div className="mt-6 rounded-xl bg-[#F2F7FD] border border-[#D7E1EE] p-4 space-y-2">
          <p className="text-[13px] font-['Poppins'] font-semibold text-[#092C5D] uppercase tracking-wider">
            Seus dados
          </p>
          {name && (
            <div className="flex items-center gap-2.5 text-[15px] text-[#17324F]">
              <User className="w-4 h-4 text-[#075BCC] shrink-0" strokeWidth={2.2} />
              <span className="font-medium">{name}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2.5 text-[15px] text-[#17324F]">
              <Phone className="w-4 h-4 text-[#075BCC] shrink-0" strokeWidth={2.2} />
              <span className="font-medium">{maskPhone(phone)}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2.5 text-[15px] text-[#17324F]">
              <Mail className="w-4 h-4 text-[#075BCC] shrink-0" strokeWidth={2.2} />
              <span className="font-medium break-all">{email}</span>
            </div>
          )}
        </div>
      )}

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
            {phone ? ` no número ${maskPhone(phone)}` : ""}.
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
        <div className="mt-6 space-y-5">
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
              {/* Passo 1 — Escolha o dia */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-[#092C5D] text-white text-[12px] font-['Poppins'] font-bold flex items-center justify-center">
                    1
                  </span>
                  <label className="font-['Poppins'] font-semibold text-[#092C5D] text-[15px]">
                    Escolha o dia
                  </label>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x scroll-smooth">
                  {calendarDays.map((day) => {
                    const dateObj = new Date(day.dateISO + "T00:00:00");
                    const monthShort = (MONTHS_PT[dateObj.getMonth()] ?? "").slice(0, 3);
                    const isSelected = selectedDay?.dateISO === day.dateISO;
                    return (
                      <button
                        key={day.dateISO}
                        type="button"
                        onClick={() => handleSelectDay(day)}
                        className={`shrink-0 snap-start w-[68px] rounded-xl border-2 transition-all duration-150 overflow-hidden ${
                          isSelected
                            ? "bg-[#092C5D] text-white border-[#092C5D] shadow-md scale-[1.04]"
                            : "bg-white text-[#092C5D] border-[#D7E1EE] hover:border-[#075BCC] hover:-translate-y-0.5"
                        }`}
                      >
                        {isSelected && <div className="h-1 bg-[#FFE344]" />}
                        <div className="flex flex-col items-center justify-center py-2.5">
                          <span
                            className={`text-[11px] font-medium uppercase tracking-wide ${
                              isSelected ? "text-white/70" : "text-[#53677D]"
                            }`}
                          >
                            {day.label}
                          </span>
                          <span className="text-[22px] font-['Poppins'] font-bold leading-tight mt-0.5">
                            {day.dayNum}
                          </span>
                          <span
                            className={`text-[10px] font-medium ${
                              isSelected ? "text-white/60" : "text-[#53677D]"
                            }`}
                          >
                            {monthShort}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passo 2 — Escolha o horário */}
              {selectedDay && (
                <div className="transition-all duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`w-6 h-6 rounded-full text-[12px] font-['Poppins'] font-bold flex items-center justify-center transition-colors ${
                        selectedSlot ? "bg-[#075BCC] text-white" : "bg-[#092C5D] text-white"
                      }`}
                    >
                      2
                    </span>
                    <label className="font-['Poppins'] font-semibold text-[#092C5D] text-[15px]">
                      Escolha o horário
                    </label>
                  </div>

                  {/* Resumo do dia selecionado */}
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F2F7FD] border border-[#D7E1EE] px-3.5 py-1.5">
                    <CalendarDays className="w-4 h-4 text-[#075BCC]" strokeWidth={2.2} />
                    <span className="text-[13px] font-['Poppins'] font-semibold text-[#092C5D]">
                      {(() => {
                        const { weekday, date } = formatFullDate(selectedDay.slots[0] ?? "");
                        return `${weekday}, ${date}`;
                      })()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedDay.slots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSelectSlot(slot)}
                          className={`inline-flex items-center gap-1.5 py-2.5 px-4 rounded-full text-[15px] font-['Poppins'] font-semibold border-2 transition-all duration-150 ${
                            isSelected
                              ? "bg-[#075BCC] text-white border-[#075BCC] shadow-md scale-[1.04]"
                              : "bg-white text-[#17324F] border-[#D7E1EE] hover:border-[#075BCC] hover:-translate-y-0.5"
                          }`}
                        >
                          <Clock
                            className={`w-4 h-4 ${isSelected ? "text-[#FFE344]" : "text-[#075BCC]"}`}
                            strokeWidth={2.2}
                          />
                          {formatSlotTime(slot)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  <p className="mt-2.5 text-center text-[14px] text-[#53677D]">
                    Escolha um dia e horário acima para continuar.
                  </p>
                )}
                {error && <p className="mt-2.5 text-center text-[14px] text-[#b91c1c]">{error}</p>}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
