import { useEffect, useMemo, useState } from "react";
import type { CountryCode } from "libphonenumber-js";
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString } from "libphonenumber-js";
import type { ChatState, ContactField } from "@/lib/chat-types";

const localeRegion: CountryCode | null =
  typeof navigator !== "undefined" && navigator.language
    ? ((navigator.language.split("-")[1]?.toUpperCase() as CountryCode) ?? null)
    : null;

export function PhoneInput({
  field,
  onChange,
  state,
}: {
  field: ContactField;
  onChange: (key: string, val: string) => void;
  state: ChatState;
}) {
  const [raw, setRaw] = useState("");
  const [country, setCountry] = useState<CountryCode>(
    (state.detectedCountry as CountryCode) ?? localeRegion ?? "BR",
  );
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!raw && state.detectedCountry) setCountry(state.detectedCountry as CountryCode);
  }, [state.detectedCountry, raw]);

  const countries = useMemo(
    () =>
      getCountries()
        .map((c) => ({
          c,
          name: new Intl.DisplayNames(["pt"], { type: "region" }).of(c) ?? c,
          dial: `+${getCountryCallingCode(c)}`,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const update = (text: string, c: CountryCode = country) => {
    setRaw(text);
    const p = parsePhoneNumberFromString(text, c);
    onChange(field.value, p?.isValid() ? p.number : "");
  };

  return (
    <div className="relative flex gap-2">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="chat-phone-dial"
        onClick={() => setOpen((o) => !o)}
      >
        {country} +{getCountryCallingCode(country)}
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute z-10 mt-10 w-64 max-h-56 overflow-y-auto rounded-md border bg-white"
        >
          <input
            autoFocus
            placeholder="Buscar"
            className="w-full border-b p-2 text-sm outline-none"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {countries
            .filter((x) => x.name.toLowerCase().includes(q.toLowerCase()))
            .map((x) => (
              <div
                key={x.c}
                role="option"
                aria-selected={x.c === country}
                className="cursor-pointer p-2 text-sm hover:bg-solar-bg-alt"
                onClick={() => {
                  setCountry(x.c);
                  setOpen(false);
                  update(raw, x.c);
                }}
              >
                {x.name} {x.dial}
              </div>
            ))}
        </div>
      )}
      <input
        type="tel"
        name={field.value}
        required={field.required}
        placeholder={field.placeholder}
        className="chat-form-input flex-1"
        value={raw}
        onChange={(e) => update(e.target.value)}
      />
    </div>
  );
}
