/**
 * Helper de agendamento para a consultoria gratuita
 * Conectado ao calendário real da plataforma.
 */

const BOOKING_API_URL = "https://backend.leadconnectorhq.com";
const VIBE_API_URL = "https://backend.leadconnectorhq.com/vibe-ai";

export const CALENDAR_ID = "8RRFS7FbPNpPGfXJTA5a";
export const LOCATION_ID = "C7YSmRs3JGd0QinrSfZH";

// IDs de custom fields registrados
export const CF_QUEM_CUIDA = "hX0Kis3GVswmiaPia5F7";
export const CF_O_QUE_RESOLVER = "PoDXSitp6svpG1TWhNkw";

type CustomFieldValue = { id: string; field_value: string };

export type BookingPayload = {
  locationId: string;
  calendarId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  selectedSlot: string;
  selectedTimezone?: string;
  sessionId?: string;
  customFields?: CustomFieldValue[];
} & Partial<
  Record<
    | "notes"
    | "address1"
    | "city"
    | "state"
    | "postalCode"
    | "country"
    | "companyName"
    | "website"
    | "gender"
    | "dateOfBirth"
    | "timezone",
    string
  >
>;

const getBrowserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const clampAvailabilityRange = (startMs: number, endMs: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = Math.max(startMs, today.getTime());
  const maxEndDate = startDate + 31 * 24 * 60 * 60 * 1000;
  const endDate = Math.min(Math.max(endMs, startDate), maxEndDate);
  return { startDate, endDate };
};

export type FreeSlotsResponse = Record<string, { slots: string[] }>;

export async function fetchCalendarFreeSlots(
  calendarId: string,
  startMs: number,
  endMs: number,
): Promise<FreeSlotsResponse> {
  const { startDate, endDate } = clampAvailabilityRange(startMs, endMs);
  const params = new URLSearchParams({
    startDate: String(startDate),
    endDate: String(endDate),
    timezone: getBrowserTimezone(),
  });

  const response = await fetch(`${BOOKING_API_URL}/calendars/${calendarId}/free-slots?${params}`);
  if (!response.ok) throw new Error("Failed to fetch calendar availability");
  return response.json();
}

export async function submitCalendarBooking(payload: BookingPayload): Promise<unknown> {
  const response = await fetch(`${VIBE_API_URL}/booking/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      selectedTimezone: payload.selectedTimezone ?? getBrowserTimezone(),
      sessionId: payload.sessionId ?? crypto.randomUUID(),
      customFields: payload.customFields ?? [],
    }),
  });
  if (!response.ok) throw new Error("Booking submission failed");
  return response.json();
}

/**
 * Quebra um nome completo em firstName / lastName.
 * "João Silva" -> { firstName: "João", lastName: "Silva" }
 * "João" -> { firstName: "João", lastName: "" }
 */
export function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] ?? "", lastName: "" };
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}
