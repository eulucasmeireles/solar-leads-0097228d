/**
 * Guarda no navegador os dados capturados na primeira página (modal de lead)
 * para pré-preencher o checkout. Fica só em localStorage, nunca vai para o código.
 */
const KEY = "solar.lead.v1";

export interface StoredLead {
  firstName: string;
  /** Sobrenome como digitado; pode ser vazio. */
  lastName: string;
  email: string;
  /** Telefone como digitado, ex.: (11) 99999-9999 */
  phone: string;
}

export function saveLead(lead: StoredLead): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(lead));
  } catch {
    /* modo privado ou armazenamento bloqueado: segue sem pré-preencher */
  }
}

export function loadLead(): StoredLead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== "object") return null;
    const r = v as Record<string, unknown>;
    if (
      typeof r["firstName"] !== "string" ||
      typeof r["email"] !== "string" ||
      typeof r["phone"] !== "string"
    ) {
      return null;
    }
    return {
      firstName: r["firstName"],
      lastName: typeof r["lastName"] === "string" ? r["lastName"] : "",
      email: r["email"],
      phone: r["phone"],
    };
  } catch {
    return null;
  }
}

export function clearLead(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignora */
  }
}
