import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@tanstack/react-router";
import { readCheckoutOrder, type CheckoutOrder } from "@/integrations/payments";
import { IMAGES } from "@/lib/solar-leads-data";
import { ORDER_BUMPS } from "@/lib/checkout-config";
import { SalesButton } from "@/components/solar/SalesButton";
import { ComicStrip } from "@/components/solar/ComicStrip";
import {
  MessageSquare,
  Filter,
  ClipboardList,
  List,
  MessageCircle,
  LayoutGrid,
  Monitor,
  Calendar as CalendarIcon,
} from "lucide-react";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Tudo certo! — Solar Leads" },
      {
        name: "description",
        content:
          "Pagamento confirmado. Vamos confirmar sua cidade pelo WhatsApp e enviar a lista em PDF. Agende sua consultoria gratuita.",
      },
      { property: "og:title", content: "Tudo certo! — Solar Leads" },
      {
        property: "og:description",
        content:
          "Sua lista está chegando pelo WhatsApp. Agende uma consultoria gratuita para trabalhar seus contatos.",
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

const WHO_SELLS_OPTIONS = [
  "Eu mesmo",
  "Eu e mais uma pessoa",
  "Tenho uma equipe",
  "Ainda estou organizando",
];

const WHAT_RESOLVE_OPTIONS = [
  "Saber como começar o contato",
  "Qualificar melhor",
  "Acompanhar os retornos",
  "Organizar o processo inteiro",
];

function ThankYouPage() {
  const hydrated = useHydrated();
  const [order, setOrder] = useState<CheckoutOrder | null>(null);

  const firstInviteRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [pastFirstInvite, setPastFirstInvite] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [whoSells, setWhoSells] = useState("");
  const [whatResolve, setWhatResolve] = useState("");
  const [confirmState, setConfirmState] = useState<"idle" | "pending">("idle");

  useEffect(() => {
    if (hydrated) {
      setOrder(readCheckoutOrder());
    }
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const firstEl = firstInviteRef.current;
    const calEl = calendarRef.current;
    if (!firstEl || !calEl) return;

    const firstObs = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setPastFirstInvite(entry.boundingClientRect.bottom < 0);
      },
      { threshold: 0 },
    );
    firstObs.observe(firstEl);

    const calObs = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setCalendarVisible(entry.isIntersecting);
      },
      { rootMargin: "-15% 0px -15% 0px", threshold: 0 },
    );
    calObs.observe(calEl);

    return () => {
      firstObs.disconnect();
      calObs.disconnect();
    };
  }, [hydrated]);

  const total = order?.totals?.totalDueToday ?? order?.amount ?? null;
  const hasDobro = order?.lines?.some(
    (l) => l.name.toLowerCase().includes("dobro") || l.name.toLowerCase().includes("1.000"),
  );
  const buyerPhone = order?.buyer?.phone ?? null;

  const showFixedCta = pastFirstInvite && !calendarVisible && confirmState !== "pending";

  const bumpImages = ORDER_BUMPS.filter((b) => ["ob1", "ob2", "ob3"].includes(b.key));

  return (
    <div className="min-h-screen bg-[#F2F7FD] text-[#17324F] font-['Open_Sans'] selection:bg-[#FFE344] selection:text-[#092C5D]">
      {/* Header slim */}
      <header className="bg-[#092C5D] py-3 px-5 shadow-md sticky top-0 z-30">
        <div className="max-w-[640px] mx-auto flex items-center justify-between">
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

      <main className="px-5 pt-8 pb-24 sm:pb-28">
        <div className="max-w-[640px] mx-auto">
          {/* ============================================================ */}
          {/* 1. COMPRA CONFIRMADA — entrega pelo WhatsApp (compacto)      */}
          {/* ============================================================ */}
          <section className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#075BCC] flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-4 font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[28px] leading-[1.15]">
              Tudo certo! Sua lista está chegando pelo WhatsApp.
            </h1>
            <p className="mt-3 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55] max-w-[480px] mx-auto">
              Vamos confirmar a cidade da sua lista e enviar o PDF na mesma conversa. A entrega
              acontece em até 2h após a confirmação do pagamento e da cidade.
            </p>

            {order && (
              <div className="mt-5 bg-white rounded-xl border border-[#D7E1EE] p-4 text-left shadow-sm">
                <p className="font-['Poppins'] font-semibold text-[#092C5D] text-[14px]">
                  Pedido {order.orderId}
                </p>
                <div className="mt-2.5 space-y-1.5">
                  {order.lines.map((line) => (
                    <div key={line.priceId} className="flex items-center justify-between gap-3">
                      <span className="text-[14px] text-[#17324F]">{line.name}</span>
                      <span className="font-['Poppins'] font-bold text-[#092C5D] text-[14px]">
                        {formatBRL(line.unitAmount)}
                      </span>
                    </div>
                  ))}
                </div>
                {hasDobro && (
                  <p className="mt-2.5 text-[13px] text-[#075BCC] font-['Poppins'] font-semibold">
                    Sua entrega contém 1.000 contatos no total.
                  </p>
                )}
                {total != null && (
                  <div className="mt-3 pt-2.5 border-t border-[#D7E1EE] flex items-center justify-between">
                    <span className="font-['Poppins'] font-bold text-[#092C5D] text-[15px]">
                      Total pago
                    </span>
                    <span className="font-['Poppins'] font-extrabold text-[#092C5D] text-[18px]">
                      {formatBRL(total)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 inline-flex items-start gap-2.5 bg-white rounded-xl border border-[#D7E1EE] p-3.5 text-left">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0 mt-0.5 w-5 h-5 text-[#075BCC]"
                aria-hidden="true"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.13c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24zm4.52-5.46c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
              </svg>
              <div>
                <p className="font-['Poppins'] font-semibold text-[#092C5D] text-[14px]">
                  Fique de olho no seu WhatsApp
                </p>
                <p className="mt-0.5 text-[13px] text-[#53677D] leading-[1.5]">
                  {buyerPhone
                    ? `A gente entra em contato no ${buyerPhone} para confirmar a cidade e enviar sua lista.`
                    : "A gente entra em contato pelo número informado na compra para confirmar a cidade e enviar sua lista."}
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 2. CONVITE PRINCIPAL — consultoria gratuita                   */}
          {/* ============================================================ */}
          <section ref={firstInviteRef} className="mt-12 sm:mt-16 scroll-mt-20">
            <div className="text-center">
              <span className="inline-block bg-[#FFE344] text-[#092C5D] font-['Poppins'] font-bold text-[11px] sm:text-[12px] uppercase tracking-wider px-3 py-1.5 rounded-full">
                Consultoria gratuita para quem comprou a lista
              </span>

              <h2 className="mt-5 font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[30px] leading-[1.18]">
                A primeira mensagem virou uma venda de{" "}
                <span className="marker-highlight text-[#092C5D]">R$19.490</span>.
                <br className="hidden sm:block" /> Vou te mostrar o que aconteceu entre uma coisa e
                outra.
              </h2>

              <div className="mt-5 space-y-3 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55] text-left max-w-[520px] mx-auto">
                <p>
                  Foi um contato da lista. Eu comecei a conversa, qualifiquei o cliente e fechei o
                  projeto em menos de 24h.
                </p>
                <p>
                  Na consultoria, vou abrir esse caso com você: como entrei em contato, o que
                  perguntei e como conduzi a conversa até a venda.
                </p>
                <p>
                  Depois, vamos olhar para o seu comercial e entender como você pode começar a
                  trabalhar os seus contatos.
                </p>
              </div>
            </div>

            {/* Orçamento + conversa (documentos originais, sem a notificação de Pix como prova) */}
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

            <div className="mt-6 text-center">
              <SalesButton text="QUERO AGENDAR MINHA CONSULTORIA" href="#agendar" size="large" />
              <p className="mt-3 text-[13px] text-[#53677D]">
                Gratuita e sem obrigação de contratar outro serviço.
              </p>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. TIRINHA — do contato à proposta                            */}
          {/* ============================================================ */}
          <section className="mt-12 sm:mt-16">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[26px] leading-[1.2] text-center">
              O contato é o começo da conversa.
            </h2>
            <div className="mt-6">
              <ComicStrip />
            </div>
            <p className="mt-5 text-center text-[15px] sm:text-[16px] text-[#17324F] leading-[1.5] max-w-[440px] mx-auto">
              Na consultoria, eu vou te mostrar essas etapas no caso dos{" "}
              <span className="font-['Poppins'] font-bold text-[#092C5D]">R$19.490</span>.
            </p>
          </section>

          {/* ============================================================ */}
          {/* 4. O QUE A PESSOA LEVA — aplicação no seu comercial           */}
          {/* ============================================================ */}
          <section className="mt-12 sm:mt-16">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[26px] leading-[1.2] text-center">
              Vamos olhar para a sua operação também.
            </h2>
            <p className="mt-3 text-[16px] text-[#17324F] leading-[1.55] text-center max-w-[480px] mx-auto">
              A ideia é você sair da conversa entendendo por onde começar e o que precisa organizar
              para trabalhar sua lista.
            </p>

            <div className="mt-7 space-y-4">
              {[
                {
                  icon: MessageSquare,
                  title: "Sua primeira abordagem",
                  text: "Vamos conversar sobre como apresentar sua oferta e começar o contato com quem ainda não conhece sua empresa.",
                  img: bumpImages[0]?.image,
                },
                {
                  icon: Filter,
                  title: "Seu filtro de qualificação",
                  text: "O que perguntar para entender o cenário do cliente e decidir qual deve ser o próximo passo.",
                  img: bumpImages[1]?.image,
                },
                {
                  icon: ClipboardList,
                  title: "Sua rotina de atendimento",
                  text: "Quem chama, quem acompanha os retornos e como organizar as oportunidades para as conversas não ficarem esquecidas.",
                  img: bumpImages[2]?.image,
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="bg-white rounded-xl border border-[#D7E1EE] p-4 sm:p-5 flex gap-4"
                  >
                    {card.img && (
                      <img
                        src={card.img}
                        alt=""
                        aria-hidden="true"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-[#D7E1EE] shrink-0"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-md bg-[#F2F7FD] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-[#075BCC]" strokeWidth={2.5} />
                        </span>
                        <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[16px] sm:text-[17px] leading-tight">
                          {card.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-[14px] sm:text-[15px] text-[#17324F] leading-[1.5]">
                        {card.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-center text-[12px] text-[#53677D]">
              As imagens ilustram os temas da consultoria.
            </p>
          </section>

          {/* ============================================================ */}
          {/* 5. PONTE PARA O SISTEMA COMERCIAL                             */}
          {/* ============================================================ */}
          <section className="mt-12 sm:mt-16">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[26px] leading-[1.2] text-center">
              E quando começar a chegar resposta?
            </h2>
            <div className="mt-4 space-y-3 text-[16px] text-[#17324F] leading-[1.55] text-left max-w-[520px] mx-auto">
              <p>
                Você vai precisar acompanhar quem respondeu, quem pediu orçamento e quem ficou de
                retornar.
              </p>
              <p>
                Também vou te mostrar como a gente organiza essa operação: contatos novos,
                mensagens, acompanhamento e oportunidades no mesmo lugar.
              </p>
              <p className="font-['Poppins'] font-semibold text-[#092C5D]">
                Se fizer sentido para sua empresa, no final podemos conversar sobre a implantação
                desse processo com você.
              </p>
            </div>

            {/* Composição da operação conectada — 4 painéis ilustrativos */}
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                { icon: List, label: "Lista de contatos" },
                { icon: MessageCircle, label: "Conversa no WhatsApp" },
                { icon: LayoutGrid, label: "Quadro de oportunidades" },
                { icon: Monitor, label: "Página de captação" },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.label}
                    className="bg-white rounded-xl border border-[#D7E1EE] p-4 flex flex-col items-center text-center gap-2"
                  >
                    <span className="w-9 h-9 rounded-lg bg-[#F2F7FD] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#075BCC]" strokeWidth={2.2} />
                    </span>
                    <span className="font-['Poppins'] font-semibold text-[#092C5D] text-[13px] sm:text-[14px] leading-tight">
                      {p.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-center text-[12px] text-[#53677D]">
              Uma visão de como organizar o caminho do contato até a proposta. Conteúdo ilustrativo.
            </p>
          </section>

          {/* ============================================================ */}
          {/* 6. AGENDAMENTO — conversão principal                          */}
          {/* ============================================================ */}
          <section ref={calendarRef} id="agendar" className="mt-12 sm:mt-16 scroll-mt-20">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[28px] leading-[1.2] text-center">
              Vamos olhar para o seu comercial?
            </h2>
            <p className="mt-3 text-[16px] text-[#17324F] leading-[1.55] text-center max-w-[480px] mx-auto">
              Escolha um horário para conhecer o caso dos R$19.490 e conversar sobre como trabalhar
              sua lista.
            </p>

            {/* Área do calendário — placeholder marcado para conectar a integração */}
            <div className="mt-6 rounded-2xl border-2 border-dashed border-[#D7E1EE] bg-white p-6 sm:p-8 text-center">
              <span className="w-12 h-12 rounded-full bg-[#F2F7FD] flex items-center justify-center mx-auto">
                <CalendarIcon className="w-6 h-6 text-[#075BCC]" strokeWidth={2} />
              </span>
              <p className="mt-3 font-['Poppins'] font-semibold text-[#092C5D] text-[16px]">
                Calendário de agendamento
              </p>
              <p className="mt-1.5 text-[14px] text-[#53677D] leading-[1.5] max-w-[360px] mx-auto">
                O seletor de horários aparece aqui para você escolher um dia e uma hora para a
                consultoria.
              </p>
            </div>

            {/* Perguntas curtas de preparação — opcionais */}
            <div className="mt-6 space-y-5">
              <div>
                <p className="font-['Poppins'] font-semibold text-[#092C5D] text-[16px]">
                  Hoje, quem cuida das vendas?
                </p>
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {WHO_SELLS_OPTIONS.map((opt) => {
                    const checked = whoSells === opt;
                    return (
                      <label
                        key={opt}
                        className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 min-h-[52px] cursor-pointer transition-colors ${
                          checked
                            ? "border-[#075BCC] bg-[#F2F7FD]"
                            : "border-[#D7E1EE] bg-white hover:border-[#075BCC]/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="whoSells"
                          value={opt}
                          checked={checked}
                          onChange={() => setWhoSells(opt)}
                          className="accent-[#075BCC] w-4 h-4 shrink-0"
                        />
                        <span className="text-[15px] text-[#17324F]">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="font-['Poppins'] font-semibold text-[#092C5D] text-[16px]">
                  O que você mais quer resolver nessa conversa?
                </p>
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {WHAT_RESOLVE_OPTIONS.map((opt) => {
                    const checked = whatResolve === opt;
                    return (
                      <label
                        key={opt}
                        className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 min-h-[52px] cursor-pointer transition-colors ${
                          checked
                            ? "border-[#075BCC] bg-[#F2F7FD]"
                            : "border-[#D7E1EE] bg-white hover:border-[#075BCC]/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="whatResolve"
                          value={opt}
                          checked={checked}
                          onChange={() => setWhatResolve(opt)}
                          className="accent-[#075BCC] w-4 h-4 shrink-0"
                        />
                        <span className="text-[15px] text-[#17324F]">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {confirmState === "pending" ? (
              <div className="mt-6 rounded-xl border border-[#D7E1EE] bg-white p-5 text-center">
                <p className="font-['Poppins'] font-semibold text-[#092C5D] text-[16px]">
                  O calendário está sendo configurado
                </p>
                <p className="mt-2 text-[14px] text-[#53677D] leading-[1.5]">
                  Assim que o seletor de horários estiver disponível, você escolhe o melhor dia e
                  hora por aqui. Sua lista será entregue normalmente pelo WhatsApp, mesmo sem o
                  agendamento.
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmState("idle")}
                  className="mt-4 text-[14px] font-['Poppins'] font-semibold text-[#075BCC] underline"
                >
                  Voltar
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <SalesButton
                  text="CONFIRMAR MINHA CONSULTORIA GRATUITA"
                  onClick={() => setConfirmState("pending")}
                  size="large"
                />
                <p className="mt-3 text-center text-[13px] text-[#53677D]">
                  Sua lista será entregue normalmente pelo WhatsApp, mesmo se você não agendar.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-[#092C5D] text-white/70 py-5 px-5 text-center text-[12px]">
        © {new Date().getFullYear()} Solar Leads. Entrega digital de contatos públicos organizados e
        enriquecidos para prospecção comercial.
      </footer>

      {/* CTA fixo (mobile) — aparece após o primeiro convite, some com calendário visível */}
      {showFixedCta && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#D7E1EE] px-5 py-3 shadow-[0_-6px_20px_-8px_rgba(9,44,93,0.2)]">
          <a
            href="#agendar"
            className="btn-sales rounded-[10px] w-full flex items-center justify-center font-['Poppins'] font-bold text-[16px] sm:text-[18px] min-h-[56px] px-4 py-3.5 text-center leading-tight"
          >
            AGENDAR CONSULTORIA GRATUITA
          </a>
        </div>
      )}
    </div>
  );
}
