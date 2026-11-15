import { createFileRoute } from "@tanstack/react-router";
import { CHECKOUT_URL, IMAGES } from "@/lib/solar-leads-data";
import { SalesButton } from "@/components/solar/SalesButton";
import { FaqAccordion } from "@/components/solar/FaqAccordion";
import { CheckCircle2, ShieldCheck, Clock, FileText } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solar Leads — 500 Contatos Enriquecidos por R$97" },
      {
        name: "description",
        content:
          "500 contatos enriquecidos da sua cidade para quem vende energia solar. Nome, WhatsApp verificado e cidade direto no seu WhatsApp em PDF por R$97.",
      },
      {
        property: "og:title",
        content: "Solar Leads — 500 Contatos Enriquecidos por R$97",
      },
      {
        property: "og:description",
        content:
          "Receba 500 contatos enriquecidos da sua cidade com nome e WhatsApp verificado em PDF por R$97.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: IMAGES.produtoOferta },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMAGES.produtoOferta },
    ],
  }),
  component: Index,
});

function Index() {
  const scrollToOffer = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById("oferta-principal");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#17324F] font-['Open_Sans'] selection:bg-[#FFE344] selection:text-[#092C5D]">
      {/* ============================================================ */}
      {/* A. FAIXA SUPERIOR                                            */}
      {/* ============================================================ */}
      <aside
        aria-label="Informações do produto"
        className="w-full bg-[#092C5D] text-white py-2.5 px-4 text-center border-b border-[#043B81]"
      >
        <div className="max-w-[960px] mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-['Poppins'] font-semibold tracking-wider uppercase">
          <span>500 CONTATOS ENRIQUECIDOS</span>
          <span className="text-[#FFE344]">•</span>
          <span>NA CIDADE QUE VOCÊ ESCOLHER</span>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* B. CABEÇALHO CENTRALIZADO                                    */}
      {/* ============================================================ */}
      <header className="pt-6 pb-5 sm:pt-12 sm:pb-8 md:pt-14 px-5">
        <div className="max-w-[860px] mx-auto text-center">
          <h1 className="font-['Poppins'] font-bold text-[#092C5D] text-[33px] sm:text-[42px] md:text-[52px] leading-[1.14] sm:leading-[1.12] tracking-tight">
            <span className="text-[#075BCC]">R$84 mil</span> nos meus primeiros 27 dias vendendo
            energia solar.
          </h1>

          <div className="mt-2.5 sm:mt-4">
            <span className="font-['Caveat'] text-[30px] sm:text-[38px] md:text-[44px] text-[#092C5D] font-bold marker-highlight leading-none">
              Sem gastar com anúncio.
            </span>
          </div>

          <p className="mt-4 sm:mt-5 text-[17px] sm:text-[20px] md:text-[21px] text-[#17324F] max-w-[680px] mx-auto leading-[1.5] sm:leading-[1.45] font-normal">
            Todos esses clientes vieram de uma lista de contatos enriquecidos.
          </p>

          <p className="mt-2.5 sm:mt-3.5 text-[16px] sm:text-[18px] md:text-[19px] text-[#53677D] max-w-[620px] mx-auto leading-[1.5]">
            Agora você pode receber 500 contatos da cidade onde vende, com nome e WhatsApp
            verificado, por R$97.
          </p>
        </div>
      </header>

      {/* ============================================================ */}
      {/* C. PRIMEIRA SEÇÃO EM DUAS COLUNAS                            */}
      {/* No mobile: Oferta primeiro (para ter CTA cedo), depois dinossauro */}
      {/* No desktop: Coluna esquerda (dinossauro + conversa), Coluna direita (oferta) */}
      {/* ============================================================ */}
      <section className="px-5 pb-10 pt-1 sm:pb-16 sm:pt-2">
        <div className="max-w-[960px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-11 items-start">
            {/* COLUNA ESQUERDA (no desktop) / SEGUNDA no mobile: Dinossauro e conversa */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col items-center lg:items-start text-left">
              {/* Ilustração adaptada obrigatória */}
              <div className="w-full max-w-[260px] sm:max-w-[330px] lg:max-w-[370px] mx-auto lg:mx-0">
                <img
                  src={IMAGES.dinossauroTrafegoPago}
                  alt="Dinossauro identificado como Tráfego Pago sob um meteoro com a frase Extinção iminente."
                  className="w-full h-auto object-contain select-none drop-shadow-sm"
                  loading="eager"
                  width="370"
                  height="240"
                />
              </div>

              {/* Texto de conversa sob o dinossauro */}
              <div className="mt-6 sm:mt-7 space-y-3.5 text-[17px] sm:text-[18px] leading-[1.6] text-[#17324F]">
                <p className="font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[19px]">
                  Me fala: com quem seu comercial vai conversar amanhã?
                </p>
                <p>
                  Se a resposta depende de aparecer uma indicação ou de alguém chamar pelo anúncio,
                  você conhece essa espera.
                </p>
                <p>
                  Outdoor, rádio, Instagram, Google… você divulga e espera o pedido de orçamento
                  chegar.
                </p>
                <p className="font-semibold text-[#092C5D]">
                  Com uma lista, você já tem nomes e números pra trabalhar. Pode abrir novas
                  conversas junto com os canais que usa hoje.
                </p>
              </div>
            </div>

            {/* COLUNA DIREITA (no desktop) / PRIMEIRA no mobile: Apresentação da oferta */}
            <div
              id="oferta-principal"
              className="lg:col-span-7 order-1 lg:order-2 bg-white rounded-xl border border-[#D7E1EE] p-4 sm:p-7 shadow-[0_10px_30px_-10px_rgba(9,44,93,0.12)] scroll-mt-6"
            >
              {/* Título e campos em HTML */}
              <div className="border-b border-[#D7E1EE] pb-4 mb-5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#FFE344] text-[#092C5D] font-['Poppins'] font-bold text-xs uppercase tracking-wider mb-2">
                  Entrega direta no WhatsApp
                </div>
                <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[28px] md:text-[30px] leading-[1.2]">
                  500 contatos enriquecidos da sua cidade
                </h2>
                <p className="mt-1 text-[15px] sm:text-[16px] font-['Poppins'] font-semibold text-[#075BCC]">
                  Nome · WhatsApp verificado · Cidade
                </p>
              </div>

              {/* Imagem 1: Composição para a oferta (Tela de preparação + PDF) */}
              <div className="w-full rounded-lg overflow-hidden border border-[#D7E1EE]/70 bg-[#F2F7FD]/40 mb-5">
                <img
                  src={IMAGES.produtoOferta}
                  alt="Montagem ilustrativa da preparação dos contatos no Solar Leads e do PDF com 500 contatos enriquecidos."
                  className="w-full h-auto object-cover"
                  loading="eager"
                  width="640"
                  height="426"
                />
              </div>

              <div className="space-y-2 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55] mb-5">
                <p className="font-['Poppins'] font-semibold text-[#092C5D]">
                  A gente prepara os contatos. Você recebe a lista pronta.
                </p>
                <p>
                  Um PDF com 500 contatos da cidade que você escolher. Você informa a cidade e
                  recebe a lista direto no WhatsApp.
                </p>
              </div>

              {/* Bloco de Preço */}
              <div className="bg-[#F2F7FD] rounded-lg p-4 sm:p-5 border border-[#D7E1EE] mb-5 text-center">
                <div className="text-[13px] sm:text-[15px] font-['Poppins'] font-semibold uppercase text-[#53677D] tracking-wide">
                  Valor único
                </div>
                <div className="flex items-baseline justify-center gap-1.5 my-1">
                  <span className="font-['Poppins'] font-extrabold text-[#092C5D] text-[54px] sm:text-[58px] md:text-[64px] leading-none">
                    R$97
                  </span>
                  <span className="font-['Poppins'] text-[15px] sm:text-[18px] text-[#53677D] font-medium">
                    pela lista completa
                  </span>
                </div>
                <div className="text-[14px] sm:text-[15px] text-[#075BCC] font-['Poppins'] font-bold">
                  Menos de R$0,20 por contato.
                </div>
              </div>

              {/* Botão de Compra */}
              <SalesButton
                text="QUERO OS 500 CONTATOS DA MINHA CIDADE"
                href={CHECKOUT_URL}
                size="large"
              />

              {/* Badges de segurança e pós-compra */}
              <div className="mt-4 pt-4 border-t border-[#D7E1EE] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs sm:text-[13px] text-[#53677D]">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <FileText className="w-4 h-4 text-[#075BCC]" />
                  PDF direto no WhatsApp
                </span>
                <span className="hidden sm:inline text-[#D7E1EE]">•</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#075BCC]" />
                  30 dias de garantia
                </span>
              </div>

              {/* Prazo */}
              <p className="mt-3 text-center text-[12px] sm:text-[13px] text-[#53677D] leading-snug bg-[#F2F7FD]/60 p-2.5 rounded border border-[#D7E1EE]/50">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-[#075BCC]" />
                Entrega em até 2h após o pagamento confirmado e a cidade informada pelo WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* D. CASO REAL (R$19.800)                                      */}
      {/* ============================================================ */}
      <section className="bg-white border-t border-b border-[#D7E1EE] py-9 sm:py-16 px-5">
        <div className="max-w-[760px] mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <span className="inline-block px-3 py-1 bg-[#F2F7FD] border border-[#D7E1EE] text-[#075BCC] font-['Poppins'] font-bold text-xs uppercase tracking-wider rounded mb-3">
              Caso Real de Prospecção
            </span>
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[27px] sm:text-[34px] md:text-[38px] leading-[1.2]">
              Esse projeto de <span className="text-[#075BCC]">R$19.800</span> começou com um
              contato da lista.
            </h2>
          </div>

          <div className="space-y-4 text-[17px] sm:text-[18px] leading-[1.65] text-[#17324F]">
            <p>Eu peguei o número e mandei a primeira mensagem.</p>
            <p>A conversa andou, fiz o atendimento, apresentei o projeto e negociei até fechar.</p>
            <p>
              Foi assim que usei a lista: pra chegar até pessoas com quem eu ainda não estava
              conversando sobre energia solar.
            </p>
            <p className="font-['Poppins'] font-semibold text-[#092C5D] text-[18px] sm:text-[19px] bg-[#F2F7FD] p-4 rounded-lg border-l-4 border-[#075BCC]">
              A lista colocou o contato na minha mão. Eu fiz o trabalho de venda a partir dali.
            </p>
          </div>

          {/* Área reservada para registros reais */}
          <div className="mt-8 p-5 sm:p-6 border-2 border-dashed border-[#D7E1EE] rounded-xl bg-[#F2F7FD]/40 text-center">
            <div className="max-w-[480px] mx-auto text-[#53677D]">
              <p className="font-['Poppins'] font-semibold text-[#092C5D] text-[15px] mb-1">
                Registros de Atendimento e Proposta
              </p>
              <p className="text-[13px] leading-relaxed">
                Área reservada para os prints da primeira mensagem, do orçamento e do fechamento
                deste projeto.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* E. ENRIQUECIMENTO                                            */}
      {/* Faixa azul muito clara + 3 cartões alinhados                 */}
      {/* ============================================================ */}
      <section className="bg-[#F2F7FD] py-9 sm:py-16 px-5 border-b border-[#D7E1EE]">
        <div className="max-w-[960px] mx-auto">
          <div className="max-w-[720px] mx-auto text-center mb-6 sm:mb-10">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[25px] sm:text-[32px] md:text-[36px] leading-[1.2]">
              Você já se perguntou de onde o call center consegue seu contato?
            </h2>
            <p className="mt-3 text-[17px] sm:text-[18px] text-[#17324F] leading-[1.6]">
              Pensa no trabalho que vem antes da ligação: reunir os dados, selecionar os nomes e
              organizar a base.
            </p>
            <p className="mt-2 text-[17px] sm:text-[18px] text-[#075BCC] font-semibold leading-[1.6]">
              Na sua lista, uma inteligência de enriquecimento faz essa preparação antes de o
              contato chegar até você.
            </p>
          </div>

          {/* 3 Cartões de Enriquecimento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Cartão 01 */}
            <div className="bg-white rounded-xl border border-[#D7E1EE] overflow-hidden shadow-xs flex flex-col">
              <div className="bg-[#092C5D] text-white px-5 py-3.5 flex items-center justify-between">
                <span className="font-['Poppins'] font-bold text-[18px]">Dados cruzados</span>
                <span className="font-['Poppins'] font-extrabold text-[#FFE344] text-[22px]">
                  01
                </span>
              </div>
              <div className="p-5 sm:p-6 flex-1 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.6]">
                <p>
                  As informações são relacionadas pra associar o nome da pessoa ao telefone e
                  selecionar os contatos.
                </p>
              </div>
            </div>

            {/* Cartão 02 */}
            <div className="bg-white rounded-xl border border-[#D7E1EE] overflow-hidden shadow-xs flex flex-col">
              <div className="bg-[#092C5D] text-white px-5 py-3.5 flex items-center justify-between">
                <span className="font-['Poppins'] font-bold text-[18px]">WhatsApp conferido</span>
                <span className="font-['Poppins'] font-extrabold text-[#FFE344] text-[22px]">
                  02
                </span>
              </div>
              <div className="p-5 sm:p-6 flex-1 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.6]">
                <p>Os 500 números passam pela verificação de WhatsApp antes da entrega.</p>
              </div>
            </div>

            {/* Cartão 03 */}
            <div className="bg-white rounded-xl border border-[#D7E1EE] overflow-hidden shadow-xs flex flex-col">
              <div className="bg-[#092C5D] text-white px-5 py-3.5 flex items-center justify-between">
                <span className="font-['Poppins'] font-bold text-[18px]">Sua cidade</span>
                <span className="font-['Poppins'] font-extrabold text-[#FFE344] text-[22px]">
                  03
                </span>
              </div>
              <div className="p-5 sm:p-6 flex-1 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.6]">
                <p>
                  Os contatos são organizados num PDF da cidade que você escolheu, com nome,
                  WhatsApp e cidade.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <span className="font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[20px]">
              Você cuida das conversas. A gente prepara a lista.
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* F. PRODUTO E VALOR                                           */}
      {/* Seção branca com a imagem produto-lista-pdf.png              */}
      {/* ============================================================ */}
      <section className="bg-white py-9 sm:py-16 px-5 border-b border-[#D7E1EE]">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center max-w-[760px] mx-auto mb-6 sm:mb-10">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[27px] sm:text-[34px] md:text-[38px] leading-[1.2]">
              Você escolhe a cidade. A gente entrega os 500 contatos.
            </h2>
            <p className="mt-3 text-[17px] sm:text-[18px] text-[#17324F] leading-[1.6]">
              Pra montar uma lista assim por conta própria, você teria que reunir os dados, cruzar
              as informações, conferir os números e organizar tudo.
            </p>
            <p className="mt-1 text-[17px] sm:text-[18px] font-semibold text-[#075BCC]">
              Aqui, esse trabalho já está incluído.
            </p>
          </div>

          {/* Grid Lado a Lado: Imagem do PDF e Detalhes da Entrega */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center mb-8 sm:mb-10">
            {/* Imagem 2: Detalhe do PDF */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full rounded-xl overflow-hidden border border-[#D7E1EE] shadow-sm bg-[#F2F7FD]/30">
                <img
                  src={IMAGES.produtoListaPdf}
                  alt="Mockup do PDF com 500 contatos enriquecidos, organizado por nome, WhatsApp e cidade, com dados ilustrativos."
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  width="540"
                  height="360"
                />
              </div>
            </div>

            {/* Conteúdo da entrega */}
            <div className="lg:col-span-6 space-y-4">
              <p className="font-['Poppins'] font-bold text-[#092C5D] text-[20px] sm:text-[22px]">
                Você recebe um PDF com:
              </p>

              <ul className="space-y-2.5 text-[17px] sm:text-[18px] text-[#17324F]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5]" />
                  <span>
                    <strong>500 contatos enriquecidos.</strong>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5]" />
                  <span>Nome da pessoa.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5]" />
                  <span>WhatsApp verificado antes da entrega.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5]" />
                  <span>Cidade de cada contato.</span>
                </li>
              </ul>

              <div className="pt-3">
                <p className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[24px]">
                  Tudo isso por R$97.
                </p>
                <p className="text-[17px] sm:text-[18px] text-[#075BCC] font-['Poppins'] font-semibold mt-1">
                  R$97 ÷ 500 = R$0,194 por contato.
                </p>
                <div className="mt-2">
                  <span className="font-['Caveat'] text-[24px] sm:text-[28px] text-[#092C5D] font-bold marker-highlight">
                    menos de vinte centavos
                  </span>
                  <span className="text-[16px] sm:text-[17px] text-[#53677D] ml-2">
                    com o enriquecimento feito e a lista organizada.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Moldura tracejada azul de 2px com Botão Grande */}
          <div className="max-w-[760px] mx-auto dashed-offer-frame rounded-2xl p-5 sm:p-8 text-center my-7 sm:my-8 shadow-sm">
            <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[26px] mb-2">
              Garanta sua lista completa de 500 contatos
            </h3>
            <p className="text-[15px] sm:text-[16px] text-[#53677D] mb-5">
              Escolha a cidade logo após a compra diretamente no WhatsApp.
            </p>
            <SalesButton text="QUERO MINHA LISTA POR R$97" href={CHECKOUT_URL} size="large" />
          </div>

          {/* Contexto comercial e uso */}
          <div className="max-w-[760px] mx-auto mt-10 space-y-4 text-[17px] sm:text-[18px] leading-[1.65] text-[#17324F]">
            <p className="font-['Poppins'] font-bold text-[#092C5D] text-[20px] sm:text-[22px]">
              A conta de luz chega todo mês. Você tem uma solução pra apresentar.
            </p>
            <p>
              Energia solar já faz parte do presente. Você consegue começar a conversa por uma
              despesa que a pessoa conhece: quanto paga de energia hoje.
            </p>
            <p>
              Se vende sozinho, separa os contatos que vai trabalhar no dia. Se tem equipe,
              distribui entre os vendedores e acompanha os atendimentos.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* G. RECEBIMENTO EM TRÊS PASSOS                                */}
      {/* Fundo azul muito claro, 3 linhas brancas empilhadas          */}
      {/* ============================================================ */}
      <section className="bg-[#F2F7FD] py-9 sm:py-16 px-5 border-b border-[#D7E1EE]">
        <div className="max-w-[820px] mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[27px] sm:text-[34px] md:text-[38px] leading-[1.2]">
              É só seguir 3 passos.
            </h2>
            <p className="mt-2 text-[16px] sm:text-[18px] text-[#53677D]">
              Sem formulários complicados nem cadastros demorados.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* PASSO 1 */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#D7E1EE] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <span className="shrink-0 bg-[#FFE344] text-[#092C5D] font-['Poppins'] font-extrabold text-sm sm:text-base px-3.5 py-1.5 rounded-md uppercase tracking-wider">
                PASSO 1
              </span>
              <div className="space-y-1">
                <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[20px]">
                  Faça o pedido
                </h3>
                <p className="text-[16px] sm:text-[17px] text-[#17324F] leading-[1.5]">
                  Clique no botão e conclua a compra da lista por R$97.
                </p>
              </div>
            </div>

            {/* PASSO 2 */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#D7E1EE] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <span className="shrink-0 bg-[#FFE344] text-[#092C5D] font-['Poppins'] font-extrabold text-sm sm:text-base px-3.5 py-1.5 rounded-md uppercase tracking-wider">
                PASSO 2
              </span>
              <div className="space-y-1">
                <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[20px]">
                  Diga a cidade pelo WhatsApp
                </h3>
                <p className="text-[16px] sm:text-[17px] text-[#17324F] leading-[1.5]">
                  Depois da confirmação da compra, a gente te manda uma mensagem no WhatsApp
                  agradecendo o pedido e perguntando de qual cidade você quer os contatos. É só
                  responder por lá.
                </p>
              </div>
            </div>

            {/* PASSO 3 */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#D7E1EE] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <span className="shrink-0 bg-[#FFE344] text-[#092C5D] font-['Poppins'] font-extrabold text-sm sm:text-base px-3.5 py-1.5 rounded-md uppercase tracking-wider">
                PASSO 3
              </span>
              <div className="space-y-1">
                <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[20px]">
                  Receba a lista na mesma conversa
                </h3>
                <p className="text-[16px] sm:text-[17px] text-[#17324F] leading-[1.5]">
                  Com o pagamento confirmado e a cidade informada, a gente prepara seus 500 contatos
                  enriquecidos e envia o PDF no WhatsApp em até 2h.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* H. GARANTIA E FECHAMENTO                                     */}
      {/* Selo tipográfico 30 dias simples                             */}
      {/* ============================================================ */}
      <section className="bg-white py-9 sm:py-16 px-5 border-b border-[#D7E1EE]">
        <div className="max-w-[760px] mx-auto text-center">
          {/* Selo tipográfico 30 dias */}
          <div className="inline-flex flex-col items-center justify-center border-2 border-[#075BCC] bg-[#F2F7FD] rounded-full w-28 h-28 sm:w-32 sm:h-32 mb-6 p-2 shadow-xs">
            <span className="font-['Poppins'] font-extrabold text-[#092C5D] text-[28px] sm:text-[32px] leading-none">
              30
            </span>
            <span className="font-['Poppins'] font-bold text-[#075BCC] text-[12px] sm:text-[14px] uppercase tracking-wider">
              DIAS
            </span>
            <span className="text-[10px] font-['Poppins'] font-semibold text-[#53677D] uppercase tracking-tight">
              GARANTIA
            </span>
          </div>

          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[27px] sm:text-[34px] leading-[1.2]">
            Sua compra tem 30 dias de garantia.
          </h2>

          <p className="mt-3 text-[17px] sm:text-[19px] text-[#17324F] leading-[1.6]">
            Dentro desse prazo, você pode solicitar a devolução dos R$97.
          </p>

          <div className="my-6 p-5 bg-[#F2F7FD] rounded-xl border border-[#D7E1EE]">
            <p className="font-['Poppins'] font-bold text-[#092C5D] text-[19px] sm:text-[22px]">
              500 contatos enriquecidos. A cidade que você escolher. R$97.
            </p>
            <p className="mt-1 text-[16px] sm:text-[17px] text-[#53677D]">
              Pra colocar novas conversas na rotina do seu comercial.
            </p>
          </div>

          <SalesButton text="QUERO RECEBER MEUS 500 CONTATOS" href={CHECKOUT_URL} size="large" />
        </div>
      </section>

      {/* ============================================================ */}
      {/* I. PERGUNTAS FREQUENTES                                      */}
      {/* Acordeão em fundo branco + CTA final                         */}
      {/* ============================================================ */}
      <section className="bg-white py-9 sm:py-16 px-5 border-b border-[#D7E1EE]">
        <div className="max-w-[760px] mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[27px] sm:text-[34px] leading-[1.2]">
              Perguntas frequentes
            </h2>
            <p className="mt-2 text-[15px] sm:text-[16px] text-[#53677D]">
              Tire suas dúvidas sobre a lista de contatos enriquecidos.
            </p>
          </div>

          <FaqAccordion />

          <div className="mt-8 sm:mt-10 pt-4 text-center">
            <SalesButton text="QUERO MINHA LISTA POR R$97" href={CHECKOUT_URL} />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* J. ÚLTIMA CHAMADA                                            */}
      {/* ============================================================ */}
      <section className="bg-[#092C5D] text-white py-9 sm:py-16 px-5">
        <div className="max-w-[760px] mx-auto text-center">
          <h2 className="font-['Poppins'] font-bold text-white text-[27px] sm:text-[36px] md:text-[40px] leading-[1.15]">
            Com quem seu comercial vai conversar amanhã?
          </h2>

          <p className="mt-3 sm:mt-4 text-[17px] sm:text-[20px] text-white/90 max-w-[620px] mx-auto leading-[1.5]">
            Peça seus 500 contatos enriquecidos por R$97 e escolha a cidade onde quer vender.
          </p>

          <div className="mt-7 sm:mt-8 max-w-[620px] mx-auto">
            <SalesButton
              text="QUERO OS CONTATOS DA MINHA CIDADE"
              href={CHECKOUT_URL}
              size="large"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-white/70">
            <span>PDF direto no WhatsApp</span>
            <span>•</span>
            <span>Até 2h após pagamento confirmado e cidade informada pelo WhatsApp</span>
            <span>•</span>
            <span>30 dias de garantia</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* RODAPÉ DISCRETO                                              */}
      {/* ============================================================ */}
      <footer className="bg-[#043B81] text-white/80 py-5 sm:py-6 px-5 text-center text-xs">
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
