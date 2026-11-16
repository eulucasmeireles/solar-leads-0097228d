import { createFileRoute } from "@tanstack/react-router";
import { CHECKOUT_URL, IMAGES } from "@/lib/solar-leads-data";
import { SalesButton } from "@/components/solar/SalesButton";
import { FaqAccordion } from "@/components/solar/FaqAccordion";
import { TopBarCarousel } from "@/components/solar/TopBarCarousel";
import { HeroSection } from "@/components/solar/HeroSection";
import { ProblemAndStorySections } from "@/components/solar/ProblemAndStorySections";
import { DeliverableAndOfferSections } from "@/components/solar/DeliverableAndOfferSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solar Leads — 500 Contatos Enriquecidos por R$97" },
      {
        name: "description",
        content:
          "500 contatos enriquecidos da sua cidade para quem vende energia solar. Nome, WhatsApp verificado e informações de contexto em PDF por R$97.",
      },
      {
        property: "og:title",
        content: "Solar Leads — 500 Contatos Enriquecidos por R$97",
      },
      {
        property: "og:description",
        content:
          "500 contatos enriquecidos da sua cidade para quem vende energia solar. Nome, WhatsApp verificado e informações de contexto em PDF por R$97.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: IMAGES.produtoPdfCorrigido },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMAGES.produtoPdfCorrigido },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-white text-[#17324F] font-['Open_Sans'] selection:bg-[#FFE344] selection:text-[#092C5D]">
      {/* Faixa superior com carrossel suave */}
      <TopBarCarousel />

      {/* 1. Hero — Promessa e Produto (Ilustração da lista logo abaixo de 'Sem gastar com anúncios') */}
      <HeroSection />

      {/* 2. Problema (Dinossauro), 3. História (Lucas com sua foto real), 4. Prova (R$19.490) e 5. Mecanismo */}
      <ProblemAndStorySections />

      {/* 6. Entregável (PDF grande frontal), 7. Objeção, 8. Oferta e 9. Entrega */}
      <DeliverableAndOfferSections />

      {/* ============================================================ */}
      {/* 10. GARANTIA                                                 */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16">
        <div className="max-w-[640px] mx-auto text-center">
          <div className="inline-flex flex-col items-center justify-center border-2 border-[#075BCC] bg-[#F2F7FD] rounded-full w-24 h-24 mb-6 p-2">
            <span className="font-['Poppins'] font-extrabold text-[#092C5D] text-[26px] leading-none">
              30
            </span>
            <span className="font-['Poppins'] font-bold text-[#075BCC] text-[11px] uppercase tracking-wider mt-0.5">
              dias
            </span>
            <span className="text-[9px] font-['Poppins'] font-semibold text-[#53677D] uppercase tracking-tight">
              garantia
            </span>
          </div>

          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[34px] leading-[1.2]">
            Você tem 30 dias de garantia.
          </h2>

          <div className="mt-4 space-y-2 text-[17px] text-[#17324F] leading-[1.6]">
            <p>Receba a lista e confira o material.</p>
            <p>Se não fizer sentido para você, solicite o reembolso dentro do prazo de 30 dias.</p>
          </div>

          <div className="mt-8">
            <SalesButton text="QUERO MINHA LISTA POR R$97" href={CHECKOUT_URL} size="large" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. PERGUNTAS FREQUENTES                                     */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16 bg-[#F2F7FD] border-y border-[#D7E1EE]">
        <div className="max-w-[680px] mx-auto text-left">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[34px] leading-[1.2] text-center">
            Antes de comprar, veja estas respostas.
          </h2>

          <div className="mt-8 bg-white rounded-xl border border-[#D7E1EE] px-5">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. FECHAMENTO                                               */}
      {/* ============================================================ */}
      <section className="px-5 py-14 sm:py-18">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[34px] leading-[1.2]">
            Seu comercial pode começar a próxima conversa com mais informação.
          </h2>

          <p className="mt-4 text-[17px] sm:text-[18px] text-[#17324F] leading-[1.6]">
            Escolha a cidade. Receba a lista. Use os contatos para abrir uma nova frente de
            prospecção.
          </p>

          <div className="mt-6 p-4 bg-[#F2F7FD] rounded-xl border border-[#D7E1EE] inline-block">
            <span className="font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[20px]">
              500 contatos enriquecidos por R$97.
            </span>
          </div>

          <div className="mt-7">
            <SalesButton text="QUERO RECEBER MINHA LISTA" href={CHECKOUT_URL} size="large" />
          </div>

          <p className="mt-4 text-[14px] sm:text-[15px] text-[#53677D] font-medium">
            Entrega pelo WhatsApp · Pagamento único · 30 dias de garantia
          </p>
        </div>
      </section>

      {/* Rodapé institucional */}
      <footer className="bg-[#043B81] text-white/80 py-6 px-5 text-center text-xs">
        <div className="max-w-[960px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Solar Leads. Todos os direitos reservados.</p>
          <p className="text-white/60">
            Entrega digital de contatos públicos organizados e enriquecidos para prospecção
            comercial.
          </p>
        </div>
      </footer>
    </div>
  );
}
