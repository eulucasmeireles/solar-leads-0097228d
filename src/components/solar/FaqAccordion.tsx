import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Essa lista serve para quem vende energia solar?",
    answer:
      "Sim. A oferta foi pensada para quem quer abrir uma nova frente de prospecção de projetos solares, com contatos e informações organizados para o comercial.",
  },
  {
    question: "São pessoas que já pediram orçamento?",
    answer:
      "São contatos enriquecidos para prospecção. A lista não representa pedidos de orçamento nem compradores confirmados.",
  },
  {
    question: "Posso escolher a cidade?",
    answer: "Sim. Depois da compra, você informa pelo WhatsApp a cidade onde deseja gerar a lista.",
  },
  {
    question: "Vou receber acesso a um aplicativo?",
    answer:
      "Você recebe um PDF com os contatos. Não precisa de acesso a aplicativo para consultar a lista.",
  },
  {
    question: "Todos os contatos têm todas as informações?",
    answer:
      "Nome e WhatsApp verificado fazem parte da entrega. Informações adicionais, como e-mail, outros telefones e dados de contexto, aparecem conforme a disponibilidade.",
  },
  {
    question: "Os disparos estão incluídos?",
    answer:
      "Não. Essa compra inclui a lista enriquecida em PDF. A abordagem e o acompanhamento dos contatos ficam com o seu comercial.",
  },
  {
    question: "Preciso investir em anúncios para usar a lista?",
    answer:
      "Não. Você pode trabalhar os contatos por prospecção, sem criar uma campanha de tráfego pago.",
  },
  {
    question: "Quanto custa?",
    answer: "R$97, em pagamento único, por 500 contatos enriquecidos.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border-b border-[#D7E1EE] first:border-t">
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full py-4 text-left flex items-center justify-between gap-3 font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#092C5D] hover:text-[#075BCC] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#075BCC] rounded"
              aria-expanded={isOpen}
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#075BCC] shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="pb-4 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55]">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
