/* eslint-disable @typescript-eslint/no-explicit-any */
export type Direction = "inbound" | "outbound" | "system";
export type MsgStatus = "pending" | "sent" | "failed";

export interface ChatMessage {
  id?: string;
  body?: string;
  direction?: Direction;
  status?: MsgStatus;
  dateAdded?: string;
  attachments?: string[];
}

export interface ChatAttachment {
  id: string;
  name?: string;
  url?: string;
  status: "uploading" | "uploaded" | "failed";
  progress?: number;
  error?: string;
}

export interface ContactField {
  value: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  dataType?: "TEXT" | "TEXTAREA" | "PHONE" | "EMAIL";
}

export interface ChatState {
  config?: any;
  messages?: ChatMessage[];
  isOpen?: boolean;
  awaitingChatTypeSelection?: boolean;
  activeChatType?: "liveChat" | "emailChat" | null;
  showContactForm?: boolean;
  contactFormSubmitted?: boolean;
  feedbackRequested?: boolean;
  feedbackSubmitted?: boolean;
  ended?: boolean;
  endedReason?: string;
  canSend?: boolean;
  sendBlockedUntil?: number;
  captchaRequired?: boolean;
  captchaStatusMessage?: string;
  rateLimited?: boolean;
  connection?: "idle" | "connecting" | "connected" | "reconnecting" | "offline";
  requestState?: "idle" | "in_progress" | "completed" | "error";
  error?: { message?: string; field?: string; code?: string } | null;
  agentTyping?: boolean;
  unreadCount?: number;
  hasMoreHistory?: boolean;
  historyLoading?: boolean;
  attachments?: ChatAttachment[];
  detectedCountry?: string;
  detectedCountryResolved?: boolean;
}

export const mediaKind = (u: string) =>
  /\.(mp4|mov|webm)(\?|$)/i.test(u)
    ? "video"
    : /\.(mp3|m4a|wav|ogg)(\?|$)/i.test(u)
      ? "audio"
      : /\.(png|jpe?g|gif|webp|heic)(\?|$)/i.test(u)
        ? "image"
        : "file";
