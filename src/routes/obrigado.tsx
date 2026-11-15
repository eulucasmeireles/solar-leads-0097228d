import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@tanstack/react-router";
import { readCheckoutOrder, type CheckoutOrder } from "@/integrations/payments";
import { IMAGES } from "@/lib/solar-leads-data";
import { SalesButton } from "@/components/solar/SalesButton";
import { BookingSection } from "@/components/solar/BookingSection";
import { ObrigadoFaq } from "@/components/solar/ObrigadoFaq";
import { Clock, Filter, MessageSquare, CalendarDays, X } from "lucide-react";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Convite liberado com sua compra — consultoria gratuita" },
      {
        name: "description",
        content:
          "Você comprou uma lista de contatos. Conheça o caminho para acelerar a prospecção e buscar seus primeiros pedidos de orçamento. Consultoria 100% gratuita.",
      },
      {
        property: "og:title",
        content: "Convite liberado com sua compra — consultoria gratuita",
      },
      {
        property: "og:description",
        content:
          "Agende sua consultoria 100% gratuita para acelerar a prospecção com sua lista e buscar seus primeiros orçamentos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const hydrated = useHydrated();
  const [order, setOrder] = useState<CheckoutOrder | null>(null);

  const heroCtaRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [pastHeroCta, setPastHeroCta] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [chargeModalOpen, setChargeModalOpen] = useState(false);

  useEffect(() => {
    if (hydrated) {
      setOrder(readCheckoutOrder());
    }
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const heroEl = heroCtaRef.current;
    const calEl = calendarRef.current;
    if (!heroEl || !calEl) return;

    const heroObs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setPastHeroCta(entry.boundingClientRect.bottom < 0);
      },
      { threshold: 0 },
    );
    heroObs.observe(heroEl);

    const calObs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setCalendarVisible(entry.isIntersecting);
      },
      { rootMargin: "-10% 0px -10% 0px", threshold: 0 },
    );
    calObs.observe(calEl);

    return () => {
      heroObs.disconnect();
      calObs.disconnect();
    };
  }, [hydrated]);

  const buyerPhone = order?.buyer?.phone ?? null;
  const showFixedCta = pastHeroCta && !calendarVisible;

  return (
    <div className="min-h-screen bg-white text-[#17324F] font-['Open_Sans'] selection:bg-[#FFE344] selection:text-[#092C5D]">
      {/* Header slim */}
      <header className="bg-[#092C5D] py-3 px-5 shadow-md sticky top-0 z-30">
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-[14px] font-['Poppins'] font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </a>
          <span className="text-white/70 text-[12px] font-['Poppins'] font-medium">
            Pedido confirmado
          </span>
        </div>
      </header>

      <main className="px-5 pt-5 pb-28 sm:pb-32">
        <div className="max-w-[720px] mx-auto">
          {/* A. Confirmação compacta */}
          <section className="text-center">
            <p className="font-['Poppins'] font-bold text-[#092C5D] text-[17px] sm:text-[18px] leading-snug">
              Compra confirmada. Agora é pelo WhatsApp.
            </p>
            <p className="mt-2 text-[15px] sm:text-[16px] text-[#53677D] leading-[1.5] max-w-[520px] mx-auto">
              Vamos confirmar sua cidade e enviar a lista na mesma conversa. A entrega acontece em
              até 2h após a confirmação do pagamento e da cidade.
            </p>
            <a
              href="#agendar"
              className="inline-block mt-2 text-[14px] font-['Poppins'] font-semibold text-[#075BCC] hover:text-[#092C5D] underline underline-offset-2 transition-colors"
            >
              Acompanhar meu pedido
            </a>
          </section>

          {/* B. Convite + headline + charge */}
          <section className="mt-10 sm:mt-12 text-center">
            <span className="inline-block bg-[#FFE344] text-[#092C5D] font-['Poppins'] font-bold text-[11px] sm:text-[12px] uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              Convite liberado com sua compra
            </span>

            <h1 className="mt-4 font-['Poppins'] font-bold text-[#092C5D] text-[30px] sm:text-[46px] leading-[1.15] sm:leading-[1.14] [text-wrap:balance]">
              Você comprou uma lista de contatos.{" "}
              <span className="block">Não precisa envelhecer trabalhando nela.</span>
            </h1>

            {/* Charge — gancho visual principal, imediatamente após a headline */}
            <div className="mt-5 sm:mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setChargeModalOpen(true)}
                className="block w-full max-w-[700px] cursor-zoom-in rounded-xl overflow-hidden"
                aria-label="Ampliar charge"
              >
                <img
                  src={IMAGES.chargeFossil}
                  alt="Um arqueólogo encontra um vendedor fossilizado trabalhando a lista. Ele responde: Calma. Só faltam 499."
                  className="w-full h-auto block object-contain"
                  loading="eager"
                  width={700}
                  height={500}
                />
              </button>
            </div>

            <p className="mt-5 sm:mt-6 font-['Poppins'] font-bold text-[#092C5D] text-[20px] sm:text-[24px] leading-[1.3]">
              A gente exagerou na idade. No trabalho, nem tanto.
            </p>

            <div className="mt-4 text-[16px] sm:text-[18px] text-[#17324F] leading-[1.6] max-w-[600px] mx-auto text-left sm:text-center">
              <p>
                Na consultoria, vou te mostrar como acelerar o trabalho com sua lista para buscar os
                primeiros pedidos de orçamento nas próximas 24h.
              </p>
              <p className="mt-3">
                Também vou abrir o caso da minha venda de{" "}
                <span className="font-['Poppins'] font-bold text-[#092C5D]">R$19.490</span>, que
                começou com uma primeira mensagem e foi fechada em menos de um dia.
              </p>
            </div>

            <div ref={heroCtaRef} className="mt-6 flex flex-col items-center">
              <div className="inline-block mb-2 font-['Poppins'] font-extrabold text-[12px] sm:text-[13px] text-[#092C5D] bg-[#FFE344] px-3 py-1 rounded-full uppercase tracking-wider">
                100% Gratuita
              </div>
              <SalesButton text="QUERO AGENDAR MINHA CONSULTORIA" href="#agendar" size="large" />
            </div>
          </section>

          {/* C. Trabalho manual */}
          <section className="mt-12 sm:mt-16">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[32px] leading-[1.2] [text-wrap:balance]">
              O contato responde. E o trabalho continua.
            </h2>
            <div className="mt-4 text-[16px] sm:text-[18px] text-[#17324F] leading-[1.6] space-y-3">
              <p>
                Um pede mais informações. Outro manda a conta de luz. Um terceiro quer conversar
                depois.
              </p>
              <p>
                Você precisa entender cada caso, registrar o retorno e acompanhar quem pode avançar
                para um orçamento.
              </p>
              <p>Agora coloca isso no meio das visitas, propostas e clientes que você já atende.</p>
              <p className="font-['Poppins'] font-semibold text-[#092C5D]">
                É esse caminho que vamos olhar juntos: como trabalhar a lista com mais agilidade,
                sem perder o fio das conversas.
              </p>
            </div>
          </section>

          {/* D. Caso pessoal */}
          <section className="mt-12 sm:mt-16">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[32px] leading-[1.2] [text-wrap:balance]">
              Uma conversa que terminou em <span className="text-[#075BCC]">R$19.490</span>.
            </h2>
            <div className="mt-4 text-[16px] sm:text-[18px] text-[#17324F] leading-[1.6] space-y-3">
              <p>
                Esse cliente veio da lista. Eu iniciei o contato, qualifiquei o atendimento e
                conduzi a conversa até a venda.
              </p>
              <p className="font-['Poppins'] font-semibold text-[#092C5D]">
                Entre a primeira mensagem e o fechamento, passaram menos de 24h.
              </p>
              <p>
                Na consultoria, vou abrir essa sequência para você entender o que aconteceu durante
                o atendimento e conversar sobre como aplicar esse aprendizado à sua realidade.
              </p>
              <p className="text-[#53677D]">
                O valor chama atenção. O processo é o que vamos olhar juntos.
              </p>
            </div>

            <div className="mt-6 rounded-xl overflow-hidden border border-[#D7E1EE] bg-[#F2F7FD]">
              <img
                src={IMAGES.provaOrcamentoWhatsapp}
                alt="Orçamento de energia solar de R$ 19.490 e mensagens de negociação pelo WhatsApp com dados sensíveis ocultos."
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-[13px] text-[#53677D] text-center">
              Orçamento e conversa reais do caso. Dados sensíveis ocultos.
            </p>
          </section>

          {/* E. O que será discutido */}
          <section className="mt-12 sm:mt-16">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[32px] leading-[1.2] text-center [text-wrap:balance]">
              O que vamos olhar na sua consultoria
            </h2>

            <div className="mt-6 divide-y divide-[#D7E1EE]">
              {[
                {
                  icon: Clock,
                  title: "Começar com mais agilidade",
                  desc: "Como colocar a lista em movimento e reduzir o trabalho repetitivo da prospecção.",
                },
                {
                  icon: Filter,
                  title: "Identificar quem pode avançar",
                  desc: "Como conduzir a qualificação e entender o que ainda falta para seguir para um orçamento.",
                },
                {
                  icon: MessageSquare,
                  title: "Dar continuidade às conversas",
                  desc: "Como acompanhar os retornos e definir o próximo passo de cada oportunidade.",
                },
                {
                  icon: CalendarDays,
                  title: "Planejar suas primeiras 24h",
                  desc: "O que precisa estar preparado para começar a trabalhar os contatos com foco nos primeiros pedidos de orçamento.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 py-4">
                    <span className="w-11 h-11 rounded-lg bg-[#F2F7FD] flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-[#075BCC]" strokeWidth={2.2} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[20px] leading-[1.3]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[15px] sm:text-[16px] text-[#17324F] leading-[1.5]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <SalesButton text="QUERO MINHA CONSULTORIA GRATUITA" href="#agendar" size="large" />
            </div>
          </section>

          {/* F. Adequação ao comprador */}
          <section className="mt-12 sm:mt-16 bg-[#F2F7FD] rounded-2xl px-5 py-6 sm:px-8 sm:py-8">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[28px] leading-[1.2] [text-wrap:balance]">
              Trabalha sozinho? Tem equipe? Vamos considerar isso.
            </h2>
            <div className="mt-4 text-[16px] sm:text-[18px] text-[#17324F] leading-[1.6] space-y-3">
              <p>
                Se você faz tudo, precisamos olhar para uma rotina que caiba entre atendimento,
                visita e proposta.
              </p>
              <p>
                Se tem vendedores, vamos entender como o trabalho é dividido e onde as conversas
                acabam parando.
              </p>
              <p className="font-['Poppins'] font-semibold text-[#092C5D]">
                Você traz a realidade do seu comercial. A gente olha para o próximo passo.
              </p>
            </div>
          </section>

          {/* G. Agendamento */}
          <section ref={calendarRef} id="agendar" className="mt-12 sm:mt-16 scroll-mt-20">
            <BookingSection buyerPhone={buyerPhone} />
          </section>

          {/* H. FAQ */}
          <ObrigadoFaq />

          {/* I. Fechamento */}
          <section className="mt-12 sm:mt-16 text-center">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[28px] leading-[1.2] [text-wrap:balance]">
              A parte de virar fóssil pode ficar só na tirinha.
            </h2>
            <p className="mt-4 text-[16px] sm:text-[18px] text-[#17324F] leading-[1.6] max-w-[520px] mx-auto">
              Você já garantiu os contatos. Agora vamos conversar sobre como acelerar o próximo
              passo.
            </p>
            <div className="mt-6 flex flex-col items-center">
              <div className="inline-block mb-2 font-['Poppins'] font-extrabold text-[12px] sm:text-[13px] text-[#092C5D] bg-[#FFE344] px-3 py-1 rounded-full uppercase tracking-wider">
                100% Gratuita
              </div>
              <SalesButton text="QUERO AGENDAR MINHA CONSULTORIA" href="#agendar" size="large" />
            </div>
          </section>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-[#092C5D] text-white/70 py-6 px-5 text-center text-[12px]">
        © {new Date().getFullYear()} Solar Leads. Entrega digital de contatos públicos organizados e
        enriquecidos para prospecção comercial.
      </footer>

      {/* CTA fixo (mobile) */}
      {showFixedCta && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#D7E1EE] px-5 py-3 shadow-[0_-6px_20px_-8px_rgba(9,44,93,0.2)]">
          <a
            href="#agendar"
            className="btn-sales rounded-[10px] w-full flex items-center justify-center font-['Poppins'] font-bold text-[16px] sm:text-[18px] min-h-[56px] px-4 py-3.5 text-center leading-tight"
          >
            AGENDAR CONSULTORIA
          </a>
        </div>
      )}

      {/* Modal para ampliar a charge */}
      {chargeModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setChargeModalOpen(false)}
        >
          <div
            className="relative max-w-[900px] w-full bg-white rounded-2xl p-2 sm:p-3 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setChargeModalOpen(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#092C5D] text-white flex items-center justify-center shadow-md hover:bg-[#075BCC] transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={IMAGES.chargeFossil}
              alt="Charge do arqueólogo e do vendedor fossilizado ampliada"
              className="w-full h-auto block rounded-xl max-h-[85vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
