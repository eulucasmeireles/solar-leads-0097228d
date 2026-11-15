import { useEffect, useState } from "react";

const PHRASES = ["500 CONTATOS ENRIQUECIDOS", "NA CIDADE QUE VOCÊ ESCOLHER"];

/**
 * Faixa superior com carrossel automático: uma frase por vez,
 * alternando a cada 3,5s com transição suave. Respeita prefers-reduced-motion.
 */
export function TopBarCarousel() {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PHRASES.length);
    }, 3500);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <aside
      aria-label="Informações do produto"
      className="w-full bg-[#092C5D] text-white border-b border-[#043B81]"
      style={{ height: 40 }}
    >
      <div className="max-w-[960px] mx-auto h-full px-5 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full" aria-live="polite" aria-atomic="true">
          {PHRASES.map((phrase, i) => {
            const active = i === index;
            return (
              <p
                key={phrase}
                className="absolute inset-0 m-0 flex items-center justify-center font-['Poppins'] font-semibold uppercase tracking-wider text-center"
                style={{
                  fontSize: 12,
                  lineHeight: "40px",
                  whiteSpace: "nowrap",
                  opacity: active ? 1 : 0,
                  transform: reduceMotion ? "none" : active ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
              >
                {phrase}
              </p>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
