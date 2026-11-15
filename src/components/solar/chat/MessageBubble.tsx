import type { ChatMessage } from "@/lib/chat-types";
import { mediaKind } from "@/lib/chat-types";
import { ChatIcon } from "./Icons";

export function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isSystem = msg.direction === "system";
  const isOutbound = msg.direction === "outbound";
  const isPending = msg.status === "pending";
  const isFailed = msg.status === "failed";

  if (isSystem) {
    return <div className="chat-msg-system">{msg.body}</div>;
  }

  return (
    <div className={`chat-msg ${isOutbound ? "chat-msg-out" : "chat-msg-in"}`}>
      {!isOutbound && (
        <div className="chat-msg-avatar">
          <ChatIcon />
        </div>
      )}
      <div className="chat-msg-content">
        {msg.body && <p className="chat-msg-body">{msg.body}</p>}
        {(msg.attachments ?? []).map((url, i) => {
          const k = mediaKind(url);
          if (k === "image")
            return (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                <img src={url} alt="Anexo" className="chat-msg-img" />
              </a>
            );
          if (k === "video") return <video key={i} src={url} controls className="chat-msg-media" />;
          if (k === "audio") return <audio key={i} src={url} controls className="chat-msg-media" />;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="chat-msg-file"
            >
              {url.split("/").pop() ?? "Arquivo"}
            </a>
          );
        })}
        {isPending && <span className="chat-msg-pending">Enviando…</span>}
        {isFailed && <span className="chat-msg-failed">Falhou ao enviar</span>}
      </div>
    </div>
  );
}
