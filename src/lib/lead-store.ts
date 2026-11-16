/**
 * Limpa o lead guardado pelo modal da primeira página (chave do lead-tracking),
 * para não pré-preencher o checkout de outra pessoa no mesmo aparelho.
 */
const KEY = "vibe.lead-capture.v1";

export function clearLead(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* armazenamento bloqueado: nada a limpar */
  }
}
