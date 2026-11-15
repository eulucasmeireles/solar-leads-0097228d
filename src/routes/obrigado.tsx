import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@tanstack/react-router";
import { readCheckoutOrder, type CheckoutOrder } from "@/integrations/payments";
import { IMAGES } from "@/lib/solar-leads-data";
import { SalesButton } from "@/components/solar/SalesButton";
import { BookingSection } from "@/components/solar/BookingSection";
import { ObrigadoFaq } from "@/components/solar/ObrigadoFaq";
import { Clock, MessageSquare, Filter, FileText, CheckCircle2, Maximize2, X } from "lucide-react";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Sua compra liberou um convite especial — Solar Leads" },
      {
        name: "description",
        content:
          "Você comprou uma lista de contatos. Conheça o caminho para acelerar a prospecção e buscar seus primeiros pedidos de orçamento nas próximas 24h. Consultoria 100% gratuita.",
      },
      {
        property: "og:title",
        content: "Sua compra liberou um convite especial — Solar Leads",
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

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

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

  const total = order?.totals?.totalDueToday ?? order?.amount ?? null;
  const hasDobro = order?.lines?.some(
    (l) => l.name.toLowerCase().includes("dobro") || l.name.toLowerCase().includes("1.000"),
  );
  const buyerPhone = order?.buyer?.phone ?? null;

  const showFixedCta = pastHeroCta && !calendarVisible;

  return (
    <div className="min-h-screen bg-[#F2F7FD] text-[#17324F] font-['Open_Sans'] selection:bg-[#FFE344] selection:text-[#092C5D]">
      {/* Header slim */}
      <header className="bg-[#092C5D] py-3 px-5 shadow-md sticky top-0 z-30">
        <div className="max-w-[680px] mx-auto flex items-center justify-between">
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

      <main className="px-5 pt-6 pb-28 sm:pb-32">
        <div className="max-w-[680px] mx-auto">
          {/* 1. Confirmação compacta da compra */}
          <section className="bg-white rounded-2xl border border-[#D7E1EE] p-4 sm:p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#075BCC] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h1 className="font-['Poppins'] font-bold text-[#092C5D] text-[17px] sm:text-[19px] leading-tight">
                    Pagamento confirmado! Sua lista está a caminho.
                  </h1>
                  {order && (
                    <span className="text-[12px] text-[#53677D] font-mono">
                      #{order.orderId.slice(-6)}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[14px] sm:text-[15px] text-[#17324F] leading-[1.45]">
                  Vamos confirmar sua cidade pelo WhatsApp e enviar o PDF na mesma conversa em até
                  2h após a confirmação.
                </p>
                {hasDobro && (
                  <p className="mt-1.5 text-[13px] text-[#075BCC] font-['Poppins'] font-semibold">
                    ✓ Sua entrega contém 1.000 contatos no total.
                  </p>
                )}
                {total != null && (
                  <p className="mt-1 text-[13px] text-[#53677D]">
                    Total do pedido: <strong className="text-[#092C5D]">{formatBRL(total)}</strong>
                  </p>
                )}
                <div className="mt-2.5 pt-2.5 border-t border-[#D7E1EE]/70 flex flex-wrap items-center justify-between gap-2 text-[13px]">
                  <span className="text-[#53677D]">
                    {buyerPhone ? `Contato cadastrado: ${buyerPhone}` : "Fique atento ao WhatsApp"}
                  </span>
                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Poppins'] font-semibold text-[#075BCC] hover:underline inline-flex items-center gap-1"
                  >
                    Abrir WhatsApp →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Convite Principal */}
          <section className="mt-8 sm:mt-10 text-center">
            <span className="inline-block bg-[#FFE344] text-[#092C5D] font-['Poppins'] font-extrabold text-[11px] sm:text-[12px] uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs">
              Sua compra liberou um convite especial
            </span>

            <h2 className="mt-4 font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[32px] leading-[1.18]">
              Você comprou uma lista de contatos. Não precisa envelhecer trabalhando nela.
            </h2>

            <p className="mt-4 font-['Poppins'] font-semibold text-[#075BCC] text-[17px] sm:text-[19px] leading-[1.4] max-w-[580px] mx-auto">
              Conheça o caminho para acelerar a prospecção e buscar seus primeiros pedidos de
              orçamento nas próximas 24h.
            </p>

            <div className="mt-4 space-y-2.5 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55] max-w-[540px] mx-auto text-left sm:text-center">
              <p>
                Na consultoria, vou abrir o caso da minha venda de{" "}
                <span className="font-['Poppins'] font-bold text-[#092C5D] bg-[#FFE344]/50 px-1 rounded">
                  R$19.490
                </span>
                , que começou com uma primeira mensagem e foi fechada em menos de um dia.
              </p>
              <p>
                E mostrar como você pode organizar o trabalho com a sua lista para avançar com mais
                agilidade.
              </p>
            </div>

            <div ref={heroCtaRef} className="mt-6 flex flex-col items-center">
              <div className="inline-block mb-2 font-['Poppins'] font-extrabold text-[12px] sm:text-[13px] text-[#092C5D] bg-[#FFE344] px-3 py-1 rounded-full uppercase tracking-wider">
                100% Gratuita
              </div>
              <SalesButton text="QUERO AGENDAR MINHA CONSULTORIA" href="#agendar" size="large" />
            </div>
          </section>

          {/* 3. Charge do arqueólogo e do vendedor fossilizado */}
          <section className="mt-10 sm:mt-12">
            <div className="relative rounded-2xl overflow-hidden border border-[#D7E1EE] bg-white shadow-md">
              <img
                src={IMAGES.chargeFossil}
                alt="Charge de humor: arqueólogo encontra um vendedor fossilizado na mesa com a lista telefônica e pergunta: 'Você ainda tá nessa lista?'. O esqueleto responde pelo celular: 'Calma. Só faltam 499.'"
                className="w-full h-auto block cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                loading="eager"
                onClick={() => setChargeModalOpen(true)}
              />
              <button
                type="button"
                onClick={() => setChargeModalOpen(true)}
                className="absolute bottom-3 right-3 bg-[#092C5D]/85 hover:bg-[#092C5D] text-white text-[12px] font-['Poppins'] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-xs transition-colors"
                aria-label="Ampliar charge"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Toque para ampliar
              </button>
            </div>
          </section>

          {/* 4. A gente exagerou no tempo. No trabalho, nem tanto. */}
          <section className="mt-10 sm:mt-14 bg-white rounded-2xl border border-[#D7E1EE] p-5 sm:p-7 shadow-sm">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[26px] leading-[1.2]">
              A gente exagerou no tempo. No trabalho, nem tanto.
            </h2>

            <div className="mt-5 space-y-2 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.6]">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#075BCC] shrink-0" />
                Você abre um contato.
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#075BCC] shrink-0" />
                Inicia a conversa.
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#075BCC] shrink-0" />
                Vai para o próximo.
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFE344] border border-[#092C5D]/30 shrink-0" />
                Alguém responde. Você para para atender.
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFE344] border border-[#092C5D]/30 shrink-0" />
                Outro pede mais informações. Você precisa entender o que ele procura.
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFE344] border border-[#092C5D]/30 shrink-0" />
                Um terceiro manda a conta de luz.
              </p>
              <p className="flex items-center gap-2 font-['Poppins'] font-semibold text-[#092C5D]">
                <span className="w-2 h-2 rounded-full bg-[#092C5D] shrink-0" />E aquele que pediu
                para chamar depois… ficou onde mesmo?
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#D7E1EE] space-y-3 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55]">
              <p>Agora coloca isso no meio das visitas, propostas e clientes que você já atende.</p>
              <p className="font-['Poppins'] font-semibold text-[#092C5D]">
                O desafio passa a ser dar andamento às conversas sem transformar seu dia em uma
                maratona de tarefas repetidas.
              </p>
            </div>
          </section>

          {/* 5. Se você fizer tudo um por um */}
          <section className="mt-8 sm:mt-10 bg-white rounded-2xl border border-[#D7E1EE] p-5 sm:p-7 shadow-sm">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[21px] sm:text-[25px] leading-[1.2]">
              Se você fizer tudo um por um, sua agenda vai sentir.
            </h2>

            <div className="mt-4 space-y-3.5 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55]">
              <p>
                Além de iniciar os contatos, você precisa acompanhar quem respondeu, entender quem
                tem interesse e reunir as informações necessárias para avançar.
              </p>
              <p className="italic text-[#53677D]">Tudo isso faz parte da venda.</p>
              <p className="font-['Poppins'] font-semibold text-[#092C5D]">
                Mas quanto tempo do seu dia vai para conversar com o cliente — e quanto vai para
                procurar anotações, conferir mensagens e lembrar quem ficou esperando?
              </p>
              <p className="text-[#075BCC] font-['Poppins'] font-bold text-[17px]">
                É nesse ponto que eu quero te ajudar a enxergar um caminho mais ágil.
              </p>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-[#F2F7FD] border border-[#D7E1EE] text-center">
              <p className="font-['Poppins'] font-bold text-[#092C5D] text-[16px] sm:text-[17px]">
                Você já garantiu os contatos. Vamos olhar para como trabalhar essa lista.
              </p>
            </div>
          </section>

          {/* 6. Caso dos R$19.490 com orçamento e conversa reais */}
          <section className="mt-10 sm:mt-14">
            <div className="text-center">
              <span className="inline-block bg-[#092C5D] text-[#FFE344] font-['Poppins'] font-bold text-[11px] sm:text-[12px] uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                Caso real dos bastidores
              </span>
              <h2 className="mt-4 font-['Poppins'] font-bold text-[#092C5D] text-[23px] sm:text-[28px] leading-[1.2]">
                Uma primeira mensagem. Uma conversa. <br className="hidden sm:block" />
                Um projeto de <span className="marker-highlight text-[#092C5D]">R$19.490</span>.
              </h2>
            </div>

            <div className="mt-5 space-y-3 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55] max-w-[560px] mx-auto">
              <p>Esse cliente veio da lista.</p>
              <p>
                Eu iniciei o contato, qualifiquei o atendimento e conduzi a conversa até a venda.
              </p>
              <p className="font-['Poppins'] font-semibold text-[#092C5D]">
                Entre a primeira mensagem e o fechamento, passaram menos de 24h.
              </p>
              <p>Na consultoria, vou abrir esse caso para você entender como a conversa avançou:</p>
              <ul className="space-y-1.5 pl-4 border-l-2 border-[#075BCC]">
                <li>• O que aconteceu depois da primeira resposta.</li>
                <li>• Como o atendimento evoluiu.</li>
                <li>• E o caminho até a proposta.</li>
              </ul>
              <p className="font-['Poppins'] font-bold text-[#075BCC] pt-1">
                O valor chama atenção. Mas é o processo que a gente vai olhar junto.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[#D7E1EE] bg-white p-3 sm:p-4 shadow-sm">
              <img
                src={IMAGES.provaOrcamentoWhatsapp}
                alt="Orçamento de energia solar de R$ 19.490 e mensagens de negociação pelo WhatsApp com dados sensíveis ocultos."
                className="w-full h-auto block rounded-lg"
                loading="lazy"
              />
              <p className="mt-2 text-center text-[12px] text-[#53677D]">
                Orçamento e conversa reais do caso. Dados sensíveis ocultos.
              </p>
            </div>
          </section>

          {/* 7. O que você vai descobrir nessa conversa */}
          <section className="mt-12 sm:mt-16">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[23px] sm:text-[28px] leading-[1.2] text-center">
              O que você vai descobrir nessa conversa
            </h2>

            <div className="mt-7 space-y-4">
              {[
                {
                  icon: Clock,
                  title: "Como começar sem passar o dia no primeiro punhado de contatos",
                  desc: "Vamos olhar para o trabalho necessário para colocar sua lista em movimento e como ganhar agilidade nessa execução.",
                },
                {
                  icon: Filter,
                  title: "Como identificar quem pode avançar para um orçamento",
                  desc: "Você vai entender como conduzir a qualificação e separar as conversas que precisam de mais informações daquelas que já podem seguir para uma proposta.",
                },
                {
                  icon: MessageSquare,
                  title: "Como acompanhar os retornos sem depender da memória",
                  desc: "Porque “depois eu lembro de chamar” costuma disputar espaço com visita, instalação, orçamento e mais umas vinte coisas. Vamos conversar sobre como dar continuidade ao atendimento.",
                },
                {
                  icon: FileText,
                  title: "Como organizar suas primeiras 24h de prospecção",
                  desc: "Vamos considerar sua estrutura, quem vai atender e o que precisa estar preparado para começar a buscar os primeiros pedidos de orçamento.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl border border-[#D7E1EE] p-4 sm:p-5 flex gap-4 shadow-xs"
                  >
                    <span className="w-10 h-10 rounded-lg bg-[#F2F7FD] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-[#075BCC]" strokeWidth={2.3} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[16px] sm:text-[18px] leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] sm:text-[15px] text-[#17324F] leading-[1.5]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <div className="inline-block mb-2 font-['Poppins'] font-extrabold text-[12px] sm:text-[13px] text-[#092C5D] bg-[#FFE344] px-3 py-1 rounded-full uppercase tracking-wider">
                100% Gratuita
              </div>
              <div>
                <SalesButton text="QUERO MINHA CONSULTORIA GRATUITA" href="#agendar" size="large" />
              </div>
            </div>
          </section>

          {/* 8. A ideia é você terminar o dia sabendo o que avançou */}
          <section className="mt-12 sm:mt-16 bg-white rounded-2xl border border-[#D7E1EE] p-5 sm:p-7 shadow-sm">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[26px] leading-[1.2]">
              A ideia é você terminar o dia sabendo o que avançou.
            </h2>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                "Quem respondeu.",
                "Quem demonstrou interesse.",
                "Quem precisa enviar mais informações.",
                "Quem já pode receber uma proposta.",
                "E quem precisa de um novo contato.",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-[#F2F7FD] border border-[#D7E1EE]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#075BCC] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    ✓
                  </span>
                  <span className="font-['Poppins'] font-semibold text-[#092C5D] text-[14px] sm:text-[15px]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-[#D7E1EE] space-y-3 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55]">
              <p>
                Imagine abrir seu atendimento e saber onde colocar sua atenção, sem precisar reler
                todas as conversas desde o começo.
              </p>
              <p className="font-['Poppins'] font-bold text-[#075BCC]">
                É essa clareza, junto com a agilidade na execução, que vamos buscar para a sua
                operação.
              </p>
            </div>
          </section>

          {/* 9. “Mas hoje sou eu que faço tudo.” */}
          <section className="mt-8 sm:mt-10 bg-white rounded-2xl border border-[#D7E1EE] p-5 sm:p-7 shadow-sm">
            <span className="text-[#075BCC] font-['Poppins'] font-bold text-[13px] uppercase tracking-wider">
              Para quem vende sozinho ou com equipe
            </span>
            <h2 className="mt-1 font-['Poppins'] font-bold text-[#092C5D] text-[21px] sm:text-[25px] leading-[1.2]">
              “Mas hoje sou eu que faço tudo.”
            </h2>

            <div className="mt-4 space-y-3.5 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55]">
              <p>Então precisamos considerar isso desde o começo.</p>
              <p>
                Sua rotina precisa caber entre os atendimentos, as visitas e as propostas que você
                já tem para fazer.
              </p>
              <p>
                Se você trabalha sozinho, vamos olhar para como começar dentro dessa realidade. Se
                tem vendedores, vamos entender como o trabalho é dividido e onde as conversas acabam
                parando.
              </p>
              <p className="font-['Poppins'] font-semibold text-[#092C5D]">
                O objetivo é encontrar um próximo passo que faça sentido para o seu comercial.
              </p>
              <div className="p-3.5 rounded-xl bg-[#FFE344]/25 border border-[#FFE344] text-[#092C5D] font-['Poppins'] font-medium text-[15px]">
                Não precisa chegar à reunião com tudo organizado. Pode trazer justamente o que está
                dando trabalho hoje.
              </div>
            </div>
          </section>

          {/* 10. Por que esse convite aparece agora? */}
          <section className="mt-8 sm:mt-10 bg-white rounded-2xl border border-[#D7E1EE] p-5 sm:p-7 shadow-sm text-left">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[21px] sm:text-[25px] leading-[1.2]">
              Por que esse convite aparece agora?
            </h2>

            <div className="mt-4 space-y-3.5 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55]">
              <p>Porque você acabou de garantir sua lista.</p>
              <p>
                Esse é um bom momento para decidir como vai trabalhar os contatos, acompanhar as
                respostas e conduzir as oportunidades.
              </p>
              <p>
                Antes de mergulhar na execução, você pode conhecer meu caso, esclarecer suas dúvidas
                e enxergar como acelerar esse caminho.
              </p>
              <p className="font-['Poppins'] font-bold text-[#075BCC]">
                A lista já está encaminhada. A consultoria é o convite para pensar no que vem
                depois.
              </p>
            </div>
          </section>

          {/* 11. Calendário e Agendamento */}
          <section ref={calendarRef} id="agendar" className="mt-12 sm:mt-16 scroll-mt-20">
            <BookingSection buyerPhone={buyerPhone} />
          </section>

          {/* 12. FAQ */}
          <ObrigadoFaq />

          {/* 13. Fechamento e CTA final */}
          <section className="mt-12 sm:mt-16 bg-white rounded-2xl border border-[#D7E1EE] p-6 sm:p-8 text-center shadow-sm">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[26px] leading-[1.2]">
              Seu próximo passo pode ser escolher um horário.
            </h2>

            <div className="mt-4 space-y-1.5 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.5] max-w-[460px] mx-auto">
              <p>Você traz suas dúvidas.</p>
              <p>
                Eu abro o caso da venda e mostro o caminho para acelerar o trabalho com a lista.
              </p>
              <p className="font-['Poppins'] font-bold text-[#092C5D] pt-1">
                A parte de virar fóssil pode ficar só na tirinha.
              </p>
            </div>

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

      {/* CTA fixo (mobile) — “AGENDAR CONSULTORIA”, oculto quando o calendário estiver visível */}
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

      {/* Modal para ampliar a charge no celular */}
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
