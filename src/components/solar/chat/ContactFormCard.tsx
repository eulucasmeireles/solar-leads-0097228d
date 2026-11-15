import { useState } from "react";
import type { ChatState, ContactField } from "@/lib/chat-types";
import { PhoneInput } from "./PhoneInput";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function ContactFormCard({ state, chat }: { state: ChatState; chat: any }) {
  const fields: ContactField[] = state.config?.contactForm?.fields ?? [];
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(state.config?.compliance?.defaultConsentCheck ?? false);
  const [missing, setMissing] = useState<string[]>([]);

  const compliance = state.config?.compliance;
  const consentRequired = compliance?.consentRequired;
  const showConsent = compliance?.showConsentCheckbox;

  const onChange = (key: string, val: string) => setValues((p) => ({ ...p, [key]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req = fields.filter((f) => f.required).map((f) => f.value);
    const miss = req.filter((k) => !values[k]?.trim());
    if (miss.length > 0) {
      setMissing(miss);
      return;
    }
    if (consentRequired && !consent) return;
    const payload = Object.fromEntries(fields.map((f) => [f.value, values[f.value] ?? ""]));
    await chat.submitContactForm({ ...payload, consentGiven: consent });
  };

  return (
    <div className="chat-card chat-form-card">
      <form onSubmit={submit}>
        {fields.map((f) => (
          <div key={f.value} className="chat-form-field">
            <label className="chat-form-label">
              {f.label}
              {f.required && <span className="chat-form-req">*</span>}
            </label>
            {f.dataType === "PHONE" ? (
              <PhoneInput field={f} onChange={onChange} state={state} />
            ) : f.dataType === "TEXTAREA" ? (
              <textarea
                className="chat-form-input"
                placeholder={f.placeholder}
                required={f.required}
                value={values[f.value] ?? ""}
                onChange={(e) => onChange(f.value, e.target.value)}
              />
            ) : (
              <input
                type={f.dataType === "EMAIL" ? "email" : "text"}
                className="chat-form-input"
                placeholder={f.placeholder}
                required={f.required}
                value={values[f.value] ?? ""}
                onChange={(e) => onChange(f.value, e.target.value)}
              />
            )}
            {missing.includes(f.value) && (
              <span className="chat-form-error">Campo obrigatório</span>
            )}
            {state.error?.field === f.value && (
              <span className="chat-form-error">{state.error.message}</span>
            )}
          </div>
        ))}

        {showConsent && (
          <label className="chat-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>{compliance?.consentText}</span>
          </label>
        )}

        <button
          type="submit"
          className="chat-form-submit"
          disabled={state.requestState === "in_progress" || (consentRequired && !consent)}
        >
          {state.requestState === "in_progress" ? "Enviando…" : "Enviar"}
        </button>
        {state.error && !state.error.field && (
          <p className="chat-form-error">{state.error.message}</p>
        )}
      </form>
    </div>
  );
}
