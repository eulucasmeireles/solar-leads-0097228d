/**
 * Configuração do widget de chat — Solar Leads.
 * Valores fornecidos pela integração conectada (chat_widget).
 * Não derivar hosts nem substituir o loader do core.
 */
export const CHAT_WIDGET_CONFIG = {
  chatWidgetId: "6af9346c8a274b7ef6c45142",
  locationId: "C7YSmRs3JGd0QinrSfZH",
  coreUrl: "https://widgets.leadconnectorhq.com/chat-widget-core/core.esm.js",
  marketplaceUrl: "https://services.leadconnectorhq.com",
  source: "ai-studio-native",
  chatType: "liveChat" as const,
};
