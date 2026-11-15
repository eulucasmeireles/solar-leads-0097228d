import { useEffect, useRef, useState } from "react";
import { CHAT_WIDGET_CONFIG } from "@/lib/chat-widget-config";
import { loadChatCore } from "@/lib/chat-core-loader";
import type { ChatState } from "@/lib/chat-types";
import {
  CHAT_AGENT_TYPING,
  CHAT_ATTACH,
  CHAT_FEEDBACK_NEGATIVE,
  CHAT_FEEDBACK_POSITIVE,
  CHAT_HEADING,
  CHAT_LAUNCHER_LABEL,
  CHAT_LOAD_OLDER,
  CHAT_LOADING,
  CHAT_OFFLINE,
  CHAT_PLACEHOLDER,
  CHAT_QUICK_REPLIES,
  CHAT_RECONNECTING,
  CHAT_RESTART,
  CHAT_RETRY,
  CHAT_SEND,
  CHAT_TEASER,
} from "@/lib/chat-widget-copy";
import { ChatIcon, CloseIcon, MailIcon, PaperclipIcon, SendIcon } from "./chat/Icons";
import { MessageBubble } from "./chat/MessageBubble";
import { ContactFormCard } from "./chat/ContactFormCard";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function ChatWidget() {
  const [chat, setChat] = useState<any>(null);
  const [state, setState] = useState<ChatState>({});
  const [text, setText] = useState("");
  const [openIntent, setOpenIntent] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mountedRef = useRef(true);

  // Create client once
  useEffect(() => {
    mountedRef.current = true;
    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const core = await loadChatCore(CHAT_WIDGET_CONFIG.coreUrl);
        const client = core.createChatClient({
          locationId: CHAT_WIDGET_CONFIG.locationId,
          widgetId: CHAT_WIDGET_CONFIG.chatWidgetId,
          marketplaceUrl: CHAT_WIDGET_CONFIG.marketplaceUrl,
          source: CHAT_WIDGET_CONFIG.source,
        });
        if (!mountedRef.current) {
          client.close?.();
          return;
        }
        setChat(client);
        unsub = client.subscribe((s: ChatState) => {
          if (mountedRef.current) setState(s);
        });
        if (openIntent) {
          client.setPanelOpen(true);
          await client.open();
        }
      } catch {
        // erro tratado via state.error
      }
    })();
    return () => {
      mountedRef.current = false;
      unsub?.();
      chat?.close?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set captcha anchor when panel mounts
  useEffect(() => {
    if (chat && panelRef.current) {
      chat.setCaptchaAnchor?.(panelRef.current);
    }
  }, [chat, state.isOpen]);

  // Open intent -> run open() once client ready
  useEffect(() => {
    if (openIntent && chat && state.isOpen === false) {
      chat.setPanelOpen(true);
      chat.open();
    }
  }, [openIntent, chat, state.isOpen]);

  // Auto-scroll thread on new messages
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.messages, state.agentTyping]);

  // Prefetch on idle
  useEffect(() => {
    const onIdle = () => loadChatCore(CHAT_WIDGET_CONFIG.coreUrl);
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(onIdle, { timeout: 3000 });
    }
  }, []);

  const open = () => {
    if (chat) {
      chat.setPanelOpen(true);
      chat.open();
    } else {
      setOpenIntent(true);
    }
  };
  const close = () => chat?.setPanelOpen(false);

  const send = async () => {
    if (!chat) return;
    const uploading = state.attachments?.some((a) => a.status === "uploading");
    const ready = (state.attachments ?? [])
      .filter((a) => a.status === "uploaded")
      .map((a) => a.url) as string[];
    if (state.canSend && !uploading && (text.trim() || ready.length)) {
      const t = text;
      setText("");
      await chat.sendMessage({ text: t, attachments: ready });
    }
  };

  const sendQuickReply = async (reply: string) => {
    if (chat && state.canSend) await chat.sendMessage({ text: reply, attachments: [] });
  };

  const uploadFile = (file: File) => {
    chat?.uploadAttachment?.(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removeAttachment = (id: string) => chat?.removeAttachment?.(id);
  const restart = () => chat?.restartConversation?.();
  const retry = () => {
    chat?.setPanelOpen(true);
    chat?.open();
  };
  const setActiveType = (type: "liveChat" | "emailChat") => chat?.setActiveChatType?.(type);
  const backToTypeSelect = () => chat?.setActiveChatType?.(null);
  const loadOlder = () => chat?.loadOlderMessages?.();
  const sendFeedback = (v: "positive" | "negative") => chat?.sendFeedback?.(v);

  // Derived
  const hasConfig = !!state.config;
  const showLoading = !hasConfig && !state.error;
  const liveChat = state.activeChatType === "liveChat";
  const emailChat = state.activeChatType === "emailChat";
  const uploading = state.attachments?.some((a) => a.status === "uploading");
  const showQuickReplies =
    liveChat &&
    !state.showContactForm &&
    !state.feedbackRequested &&
    !state.feedbackSubmitted &&
    !state.ended &&
    (state.messages?.length ?? 0) === 0;

  const connectionLine =
    state.connection === "reconnecting"
      ? CHAT_RECONNECTING
      : state.connection === "offline"
        ? CHAT_OFFLINE
        : null;

  const cardPending =
    state.showContactForm || state.feedbackRequested || state.feedbackSubmitted || state.ended;

  return (
    <>
      <button
        type="button"
        aria-label={CHAT_LAUNCHER_LABEL}
        onClick={() => (state.isOpen ? close() : open())}
        className="chat-launcher"
        data-open={state.isOpen ? "true" : "false"}
      >
        {!!state.unreadCount && state.unreadCount > 0 && (
          <span className="chat-launcher-badge">{state.unreadCount}</span>
        )}
      </button>

      {!state.isOpen && (
        <div className="chat-teaser" role="status">
          <span>{CHAT_TEASER}</span>
        </div>
      )}

      {state.isOpen && (
        <div className="chat-panel" ref={panelRef}>
          <header className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar" />
              <div>
                <div className="chat-header-title">{CHAT_HEADING}</div>
                <div className="chat-header-status">
                  {state.agentTyping ? CHAT_AGENT_TYPING : liveChat ? "Online" : "Fale conosco"}
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Fechar chat"
              className="chat-close-btn"
              onClick={close}
            >
              <CloseIcon />
            </button>
          </header>

          <div className="chat-body">
            {showLoading && (
              <div className="chat-state">
                <div className="chat-spinner" />
                <p>{CHAT_LOADING}</p>
              </div>
            )}

            {state.error && !hasConfig && (
              <div className="chat-state">
                <p className="chat-error-text">{state.error.message}</p>
                <button type="button" className="chat-retry-btn" onClick={retry}>
                  {CHAT_RETRY}
                </button>
              </div>
            )}

            {hasConfig && state.awaitingChatTypeSelection && (
              <div className="chat-type-select">
                <p className="chat-type-title">Como prefere falar com a gente?</p>
                <button
                  type="button"
                  className="chat-type-btn"
                  onClick={() => setActiveType("liveChat")}
                >
                  <ChatIcon /> Chat ao vivo
                </button>
                <button
                  type="button"
                  className="chat-type-btn"
                  onClick={() => setActiveType("emailChat")}
                >
                  <MailIcon /> E-mail / SMS
                </button>
              </div>
            )}

            {hasConfig &&
              emailChat &&
              (state.contactFormSubmitted ? (
                <div className="chat-state">
                  <p className="chat-thanks">Obrigado! Vamos responder em breve.</p>
                </div>
              ) : state.showContactForm || state.config?.contactForm?.enabled ? (
                <ContactFormCard state={state} chat={chat} />
              ) : (
                <div className="chat-state">
                  <button type="button" className="chat-back-btn" onClick={backToTypeSelect}>
                    ← Voltar
                  </button>
                  <p>Carregando formulário…</p>
                </div>
              ))}

            {hasConfig && liveChat && (
              <>
                <div className="chat-thread" ref={threadRef}>
                  {state.hasMoreHistory && (
                    <button
                      type="button"
                      className="chat-load-older"
                      onClick={loadOlder}
                      disabled={state.historyLoading}
                    >
                      {state.historyLoading ? (
                        <div className="chat-spinner chat-spinner-sm" />
                      ) : (
                        CHAT_LOAD_OLDER
                      )}
                    </button>
                  )}
                  {(state.messages ?? []).map((m, i) => (
                    <MessageBubble key={m.id ?? i} msg={m} />
                  ))}
                  {state.agentTyping && (
                    <div className="chat-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                </div>

                {showQuickReplies && (
                  <div className="chat-quick-replies">
                    {CHAT_QUICK_REPLIES.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className="chat-quick-reply"
                        onClick={() => sendQuickReply(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {state.showContactForm && <ContactFormCard state={state} chat={chat} />}

                {state.feedbackRequested && !state.feedbackSubmitted && (
                  <div className="chat-card">
                    <p className="chat-card-text">
                      {state.config?.liveChat?.feedbackMessage ?? "Como foi o atendimento?"}
                    </p>
                    <div className="chat-feedback-row">
                      <button
                        type="button"
                        aria-label={CHAT_FEEDBACK_POSITIVE}
                        className="chat-feedback-btn"
                        onClick={() => sendFeedback("positive")}
                      >
                        👍
                      </button>
                      <button
                        type="button"
                        aria-label={CHAT_FEEDBACK_NEGATIVE}
                        className="chat-feedback-btn"
                        onClick={() => sendFeedback("negative")}
                      >
                        👎
                      </button>
                    </div>
                  </div>
                )}

                {state.feedbackSubmitted && !state.feedbackRequested && (
                  <div className="chat-card">
                    <p className="chat-card-text">
                      {state.config?.liveChat?.feedbackNote ?? "Obrigado pelo feedback!"}
                    </p>
                    <button type="button" className="chat-restart-btn" onClick={restart}>
                      {CHAT_RESTART}
                    </button>
                  </div>
                )}

                {state.ended && (
                  <div className="chat-card">
                    <button type="button" className="chat-restart-btn" onClick={restart}>
                      {CHAT_RESTART}
                    </button>
                  </div>
                )}

                {(state.attachments ?? []).length > 0 && (
                  <div className="chat-attach-chips">
                    {state.attachments!.map((a) => (
                      <div key={a.id} className="chat-attach-chip">
                        <span className="chat-attach-name">{a.name}</span>
                        {a.status === "uploading" && (
                          <div className="chat-attach-progress">
                            <div
                              className="chat-attach-bar"
                              style={{ width: `${(a.progress ?? 0) * 100}%` }}
                            />
                          </div>
                        )}
                        {a.status === "failed" && (
                          <span className="chat-attach-fail">{a.error ?? "Falhou"}</span>
                        )}
                        <button
                          type="button"
                          aria-label="Remover anexo"
                          className="chat-attach-remove"
                          onClick={() => removeAttachment(a.id)}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {(connectionLine || (state.error && !state.captchaRequired)) && (
                  <div className="chat-status-line">
                    {state.error && !state.captchaRequired ? state.error.message : connectionLine}
                  </div>
                )}

                {!cardPending && (
                  <div className="chat-composer">
                    {state.config?.liveChat?.attachments?.enabled && (
                      <>
                        <button
                          type="button"
                          aria-label={CHAT_ATTACH}
                          className="chat-attach-btn"
                          disabled={
                            (state.attachments?.length ?? 0) >=
                            (state.config?.liveChat?.attachments?.maxFiles ?? 1)
                          }
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <PaperclipIcon />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="chat-file-input"
                          accept={state.config?.liveChat?.attachments?.acceptedTypes}
                          multiple={(state.config?.liveChat?.attachments?.maxFiles ?? 1) > 1}
                          onChange={(e) => Array.from(e.target.files ?? []).forEach(uploadFile)}
                        />
                      </>
                    )}
                    <input
                      type="text"
                      className="chat-input"
                      placeholder={CHAT_PLACEHOLDER}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          send();
                        }
                      }}
                      disabled={!state.canSend || state.captchaRequired}
                    />
                    <button
                      type="button"
                      aria-label={CHAT_SEND}
                      className="chat-send-btn"
                      onClick={send}
                      disabled={
                        !state.canSend ||
                        state.captchaRequired ||
                        uploading ||
                        (!text.trim() &&
                          !(state.attachments ?? []).some((a) => a.status === "uploaded"))
                      }
                    >
                      <SendIcon />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
