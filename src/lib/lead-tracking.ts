/**
 * Helper de tracking de leads para o CRM.
 * Envia os dados de captura (nome, e-mail, WhatsApp) como evento de formulário
 * externo, fire-and-forget, sem bloquear a navegação para o checkout.
 */

type StandardTrackingFieldKey = string;
type RegisteredCustomFieldId = string;
type TrackingCustomField = { value?: unknown; label: string };
type TrackingFileField = { file?: File; label: string };
type TrackingImageDataField = { dataUrl?: string; label: string };

const TRACKING_ID = "tk_28c1b7661c8b4193981040c1b0ffc4fc";
const LOCATION_ID = "C7YSmRs3JGd0QinrSfZH";
const PROJECT_ID = "1794701011824623469";
const ENDPOINT = "https://backend.leadconnectorhq.com/external-tracking/events";

const postTrackingEvent = (
  trackingPayload: Record<string, unknown> & {
    formData: Record<StandardTrackingFieldKey, unknown>;
    formLabels: Record<StandardTrackingFieldKey, string>;
  },
  options: {
    customFields?: Record<RegisteredCustomFieldId, TrackingCustomField>;
    fileFields?: Record<RegisteredCustomFieldId, TrackingFileField>;
    imageDataFields?: Record<RegisteredCustomFieldId, TrackingImageDataField>;
  } = {},
) => {
  const { customFields = {}, fileFields = {}, imageDataFields = {} } = options;
  const eventPayload = {
    ...trackingPayload,
    formData: { ...trackingPayload.formData },
    formLabels: { ...trackingPayload.formLabels },
  };
  const body = new FormData();

  for (const [key, field] of Object.entries(customFields)) {
    if (field.value === undefined) continue;
    eventPayload.formData[key] = field.value;
    eventPayload.formLabels[key] = field.label;
  }

  for (const [key, field] of Object.entries(imageDataFields)) {
    const dataUrl = field.dataUrl;
    if (!dataUrl) continue;
    if (!dataUrl.startsWith("data:image/")) {
      throw new Error("Image data field must be a data:image/* base64 string");
    }
    eventPayload.formData[key] = dataUrl;
    eventPayload.formLabels[key] = field.label;
  }

  for (const [key, field] of Object.entries(fileFields)) {
    const file = field.file;
    if (!file) continue;
    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File must be 50 MB or smaller");
    }
    eventPayload.formData[key] = {
      filename: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    };
    eventPayload.formLabels[key] = field.label;
    body.append(key, file, file.name);
  }

  for (const key of Object.keys(eventPayload.formData)) {
    eventPayload.formLabels[key] ||= key;
  }

  body.append("event", JSON.stringify(eventPayload));

  fetch(ENDPOINT, {
    method: "POST",
    headers: { version: "2021-07-28" },
    body,
  }).catch(() => {});
};

const getTrackingSessionId = () => {
  try {
    const sid = document.cookie.match(/(?:^|;\s*)__vibe_sid=([0-9a-f-]{36})(?:;|$)/)?.[1];
    if (sid) return sid;
  } catch {
    /* sandboxed iframe — fall back */
  }
  return crypto.randomUUID();
};

export interface LeadCaptureData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Envia os dados do lead para o CRM. Fire-and-forget.
 */
export function trackLeadCapture(data: LeadCaptureData) {
  const trackingPayload = {
    type: "external_form_submission",
    timestamp: Date.now(),
    formId: "lead-capture-checkout",
    formData: {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
    },
    formLabels: {
      first_name: "Nome",
      last_name: "Sobrenome",
      email: "E-mail",
      phone: "WhatsApp",
    },
    url: typeof window !== "undefined" ? window.location.href : "",
    title: typeof document !== "undefined" ? document.title : "",
    path: typeof window !== "undefined" ? window.location.pathname : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    trackingId: TRACKING_ID,
    locationId: LOCATION_ID,
    projectId: PROJECT_ID,
    sessionId: getTrackingSessionId(),
    properties: {
      deviceType:
        typeof navigator !== "undefined" && /Mobile|Android|iPhone/i.test(navigator.userAgent)
          ? "mobile"
          : "desktop",
      source: "ai_studio",
      projectId: PROJECT_ID,
      formName: "Captura de Lead — Pré-Checkout",
    },
  };

  postTrackingEvent(trackingPayload);
}
