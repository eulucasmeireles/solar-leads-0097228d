/**
 * Telefone em formato internacional (E.164). Usado no navegador (validação)
 * e no servidor (conferência antes de criar o pedido).
 */
import { parsePhoneNumberFromString } from "libphonenumber-js";

/** Devolve o telefone em formato internacional (+55...) ou null se for inválido. */
export function normalizePhone(text: string): string | null {
  const parsed = parsePhoneNumberFromString(text, "BR");
  return parsed?.isValid() ? parsed.number : null;
}
