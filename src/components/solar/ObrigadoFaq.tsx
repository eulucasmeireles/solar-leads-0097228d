import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FAQ_ITEMS = [
  {
    q: "A consultoria é gratuita mesmo?",
    a: "Sim. A participação é 100% gratuita. Qualquer contratação adicional será apresentada separadamente, caso haja interesse.",
  },
  {
    q: "Preciso esperar a reunião para receber minha lista?",
    a: "Não. A entrega acontece pelo WhatsApp, independentemente da consultoria.",
  },
  {
    q: "Serve para quem está começando?",
    a: "Sim. Vamos considerar o seu momento e o que você precisa preparar para começar a trabalhar os contatos.",
  },
  {
    q: "E para quem já tem equipe comercial?",
    a: "Também. Podemos olhar para como o atendimento está dividido e o que precisa ganhar agilidade.",
  },
  {
    q: "O que preciso levar para a conversa?",
    a: "Uma ideia de como vocês atendem hoje, quem ficará responsável pelos contatos e qual parte da rotina mais toma tempo.",
  },
  {
    q: "Vou conseguir orçamentos em 24h?",
    a: "Esse é o objetivo do plano de execução, mas o resultado depende do trabalho realizado e do retorno dos contatos. Na reunião, vamos olhar para o que está ao seu alcance preparar e executar.",
  },
];

export function ObrigadoFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="mt-12 sm:mt-16">
      <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[26px] leading-[1.2] text-center">
        Antes de escolher seu horário
      </h2>

      <div className="mt-6 space-y-2.5">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#D7E1EE] overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-['Poppins'] font-bold text-[#092C5D] text-[15px] sm:text-[16px] leading-snug cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#075BCC] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-[15px] text-[#17324F] leading-[1.55] border-t border-[#D7E1EE]/60">
                  <p className="pt-2">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
