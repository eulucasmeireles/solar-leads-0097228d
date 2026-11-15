import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Posso escolher qualquer cidade?",
    answer:
      "Sim. Depois da compra, a gente te chama no WhatsApp e você informa a cidade na própria conversa. Pode ser a sua ou outra onde consiga atender os projetos.",
  },
  {
    question: "O que eu recebo?",
    answer:
      "Um PDF com 500 contatos enriquecidos, contendo nome, WhatsApp e cidade. Você recebe o arquivo na mesma conversa do WhatsApp em que escolheu a cidade, em até 2h após o pagamento confirmado e a cidade informada.",
  },
  {
    question: "Preciso ter uma equipe?",
    answer:
      "Você pode trabalhar os contatos sozinho ou dividir com seus vendedores. A lista serve pra quem já vende e pra quem está começando e já tem como atender os projetos.",
  },
  {
    question: "Tem mensalidade?",
    answer: "R$97 é o valor da lista com 500 contatos. É uma compra única.",
  },
  {
    question: "Preciso investir em anúncios?",
    answer:
      "Você recebe os contatos no PDF e pode trabalhar sua prospecção sem criar uma campanha de anúncios pra obtê-los.",
  },
  {
    question: "Como funciona a garantia?",
    answer: "Você tem 30 dias para solicitar a devolução dos R$97.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2.5 sm:space-y-3 w-full">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-[#D7E1EE] rounded-lg bg-white overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#092C5D] hover:bg-[#F2F7FD]/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#075BCC]"
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
              <div className="px-4 sm:px-5 pb-4 pt-1 text-[15px] sm:text-[17px] text-[#17324F] leading-[1.6] border-t border-[#D7E1EE]/50 bg-white">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
