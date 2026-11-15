import { createFileRoute } from "@tanstack/react-router";
import { CHECKOUT_URL, IMAGES } from "@/lib/solar-leads-data";
import { SalesButton } from "@/components/solar/SalesButton";
import { FaqAccordion } from "@/components/solar/FaqAccordion";
import { TopBarCarousel } from "@/components/solar/TopBarCarousel";
import { CheckCircle2, Clock } from "lucide-react";

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
      { property: "og:image", content: IMAGES.produtoListaPdf },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMAGES.produtoListaPdf },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-white text-[#17324F] font-['Open_Sans'] selection:bg-[#FFE344] selection:text-[#092C5D]">
      {/* ============================================================ */}
      {/* A. FAIXA SUPERIOR — carrossel automático                      */}
      {/* ============================================================ */}
      <TopBarCarousel />

      {/* ============================================================ */}
      {/* B. CABEÇALHO                                                 */}
      {/* ============================================================ */}
      <header className="px-5 pt-9 pb-2 sm:pt-14 sm:pb-4">
        <div className="max-w-[860px] mx-auto text-center">
          <h1 className="font-['Poppins'] font-bold text-[#092C5D] text-[30px] sm:text-[44px] md:text-[54px] leading-[1.12] sm:leading-[1.1] tracking-tight">
            <span className="text-[#075BCC]">R$84 mil</span> nos meus primeiros 27 dias vendendo
            energia solar.
          </h1>

          <div className="mt-4 sm:mt-5">
            <span className="font-['Caveat'] text-[30px] sm:text-[40px] md:text-[46px] text-[#092C5D] font-bold marker-highlight leading-none">
              Sem gastar com anúncio.
            </span>
          </div>

          <p className="mt-5 sm:mt-6 text-[17px] sm:text-[20px] md:text-[21px] text-[#17324F] max-w-[600px] mx-auto leading-[1.55]">
            Todos esses clientes vieram de uma lista de contatos enriquecidos.
          </p>
        </div>
      </header>

      {/* ============================================================ */}
      {/* C. APRESENTAÇÃO INICIAL DA OFERTA (card único)               */}
      {/* ============================================================ */}
      <section className="px-5 pt-8 pb-12 sm:pt-10 sm:pb-16">
        <div
          id="oferta-principal"
          className="max-w-[640px] mx-auto bg-white rounded-xl border border-[#D7E1EE] p-5 sm:p-7 shadow-[0_10px_30px_-12px_rgba(9,44,93,0.14)] scroll-mt-6"
        >
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[28px] leading-[1.2] text-center">
            500 contatos enriquecidos da sua cidade
          </h2>
          <p className="mt-2 text-[16px] sm:text-[17px] font-['Poppins'] font-semibold text-[#075BCC] text-center">
            Nome, WhatsApp verificado e cidade.
          </p>

          {/* Imagem do produto — só PDF no mobile, composição no desktop */}
          <div className="mt-5 w-full rounded-lg overflow-hidden border border-[#D7E1EE] bg-[#F2F7FD]/40">
            <img
              src={IMAGES.produtoListaPdf}
              alt="Mockup do PDF com 500 contatos enriquecidos, organizado por nome, WhatsApp e cidade, com dados ilustrativos."
              className="w-full h-auto block sm:hidden"
              loading="eager"
              width="540"
              height="360"
            />
            <img
              src={IMAGES.produtoOferta}
              alt="Montagem ilustrativa da preparação dos contatos no Solar Leads e do PDF com 500 contatos enriquecidos."
              className="hidden w-full h-auto block sm:block"
              loading="eager"
              width="640"
              height="426"
            />
          </div>

          {/* Preço */}
          <div className="mt-6 text-center">
            <div className="font-['Poppins'] font-extrabold text-[#092C5D] text-[52px] sm:text-[64px] leading-none">
              R$97
            </div>
            <div className="mt-1 text-[16px] sm:text-[17px] text-[#53677D] font-['Poppins'] font-medium">
              pela lista completa
            </div>
            <div className="mt-2 text-[15px] sm:text-[16px] text-[#075BCC] font-['Poppins'] font-bold">
              Menos de R$0,20 por contato.
            </div>
          </div>

          {/* Botão */}
          <div className="mt-6">
            <SalesButton text="QUERO MINHA LISTA POR R$97" href={CHECKOUT_URL} size="large" />
          </div>

          {/* Garantia curta */}
          <p className="mt-4 text-center text-[14px] sm:text-[15px] text-[#53677D] font-medium">
            Lista no WhatsApp · 30 dias de garantia
          </p>

          {/* Condição de entrega */}
          <p className="mt-3 text-center text-[13px] sm:text-[14px] text-[#53677D] leading-[1.5]">
            Entrega em até 2h após o pagamento confirmado e a cidade informada pelo WhatsApp.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* D. DINOSSAURO + PROBLEMA                                     */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16 bg-[#F2F7FD] border-y border-[#D7E1EE]">
        <div className="max-w-[640px] mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-full max-w-[260px] sm:max-w-[330px]">
              <img
                src={IMAGES.dinossauroTrafegoPago}
                alt="Dinossauro identificado como Tráfego Pago sob um meteoro com a frase Extinção iminente."
                className="w-full h-auto object-contain select-none"
                loading="lazy"
                width="330"
                height="240"
              />
            </div>
          </div>

          <div className="mt-7 space-y-4 text-[17px] leading-[1.55] text-[#17324F]">
            <p className="font-['Poppins'] font-bold text-[#092C5D] text-[20px] sm:text-[22px]">
              Me fala: com quem seu comercial vai conversar amanhã?
            </p>
            <p>
              Se a resposta depende de aparecer uma indicação ou de alguém chamar pelo anúncio, você
              conhece essa espera.
            </p>
            <p>
              Outdoor, rádio, Instagram, Google… você divulga e espera o pedido de orçamento chegar.
            </p>
            <p className="font-semibold text-[#092C5D]">
              Com uma lista, você já tem nomes e números pra trabalhar. Pode abrir novas conversas
              junto com os canais que usa hoje.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* E. CASO REAL (R$19.800)                                      */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16">
        <div className="max-w-[640px] mx-auto">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[34px] leading-[1.2] text-center">
            Esse projeto de <span className="text-[#075BCC]">R$19.800</span> começou com um contato
            da lista.
          </h2>

          <div className="mt-7 space-y-4 text-[17px] leading-[1.6] text-[#17324F]">
            <p>Eu peguei o número e mandei a primeira mensagem.</p>
            <p>A conversa andou, fiz o atendimento, apresentei o projeto e negociei até fechar.</p>
            <p>
              Foi assim que usei a lista: pra chegar até pessoas com quem eu ainda não estava
              conversando sobre energia solar.
            </p>
            <p className="font-['Poppins'] font-semibold text-[#092C5D] text-[18px] sm:text-[19px] bg-white p-4 rounded-lg border-l-4 border-[#075BCC]">
              A lista colocou o contato na minha mão. Eu fiz o trabalho de venda a partir dali.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* F. ENRIQUECIMENTO — linhas simples                            */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16 bg-[#F2F7FD] border-y border-[#D7E1EE]">
        <div className="max-w-[640px] mx-auto">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[25px] sm:text-[32px] leading-[1.2] text-center">
            De onde o call center consegue seu contato?
          </h2>
          <p className="mt-4 text-[17px] text-[#17324F] leading-[1.55]">
            Pensa no trabalho que vem antes da ligação: reunir os dados, selecionar os nomes e
            organizar a base. Na sua lista, uma inteligência de enriquecimento faz essa preparação
            antes de o contato chegar até você.
          </p>

          <div className="mt-8 space-y-5">
            {[
              {
                num: "01",
                title: "Dados cruzados",
                text: "As informações são relacionadas pra associar o nome da pessoa ao telefone e selecionar os contatos.",
              },
              {
                num: "02",
                title: "WhatsApp conferido",
                text: "Os 500 números passam pela verificação de WhatsApp antes da entrega.",
              },
              {
                num: "03",
                title: "Sua cidade",
                text: "Os contatos são organizados num PDF da cidade que você escolheu, com nome, WhatsApp e cidade.",
              },
            ].map((item) => (
              <div key={item.num} className="flex gap-4">
                <span className="font-['Poppins'] font-extrabold text-[#FFE344] text-[26px] leading-none shrink-0 [text-shadow:-0.5px_0_#092C5D,0.5px_0_#092C5D,0_-0.5px_#092C5D,0_0.5px_#092C5D]">
                  {item.num}
                </span>
                <div>
                  <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[20px]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55]">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[20px] text-center">
            Você cuida das conversas. A gente prepara a lista.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* G. PRODUTO E VALOR — detalhe do PDF + compra                 */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16">
        <div className="max-w-[640px] mx-auto">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[34px] leading-[1.2] text-center">
            Você escolhe a cidade. A gente entrega os 500 contatos.
          </h2>
          <p className="mt-4 text-[17px] text-[#17324F] leading-[1.55]">
            Pra montar uma lista assim por conta própria, você teria que reunir os dados, cruzar as
            informações, conferir os números e organizar tudo. Aqui, esse trabalho já está incluído.
          </p>

          {/* Detalhe do PDF */}
          <div className="mt-7 w-full rounded-xl overflow-hidden border border-[#D7E1EE] bg-[#F2F7FD]/30">
            <img
              src={IMAGES.produtoListaPdf}
              alt="Mockup do PDF com 500 contatos enriquecidos, organizado por nome, WhatsApp e cidade, com dados ilustrativos."
              className="w-full h-auto block"
              loading="lazy"
              width="540"
              height="360"
            />
          </div>

          {/* Conteúdo da entrega */}
          <div className="mt-7">
            <p className="font-['Poppins'] font-bold text-[#092C5D] text-[20px] sm:text-[22px]">
              Você recebe um PDF com:
            </p>
            <ul className="mt-4 space-y-3 text-[17px] text-[#17324F]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5] mt-0.5" />
                <span>
                  <strong>500 contatos enriquecidos.</strong>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5] mt-0.5" />
                <span>Nome da pessoa.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5] mt-0.5" />
                <span>WhatsApp verificado antes da entrega.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5] mt-0.5" />
                <span>Cidade de cada contato.</span>
              </li>
            </ul>
          </div>

          {/* Cálculo por contato */}
          <div className="mt-7">
            <p className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[24px]">
              Tudo isso por R$97.
            </p>
            <p className="mt-1 text-[17px] text-[#075BCC] font-['Poppins'] font-semibold">
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

          {/* Botão dentro de moldura tracejada */}
          <div className="mt-8 dashed-offer-frame rounded-2xl p-6 sm:p-7 text-center">
            <SalesButton text="QUERO MINHA LISTA POR R$97" href={CHECKOUT_URL} size="large" />
          </div>

          {/* Uso comercial */}
          <div className="mt-8 space-y-4 text-[17px] leading-[1.6] text-[#17324F]">
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
      {/* H. COMO RECEBER — 3 passos                                  */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16 bg-[#F2F7FD] border-y border-[#D7E1EE]">
        <div className="max-w-[640px] mx-auto">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[34px] leading-[1.2] text-center">
            É só seguir 3 passos.
          </h2>

          <div className="mt-8 space-y-6">
            {[
              {
                step: "PASSO 1",
                title: "Faça o pedido",
                text: "Clique no botão e conclua a compra da lista por R$97.",
              },
              {
                step: "PASSO 2",
                title: "Diga a cidade pelo WhatsApp",
                text: "Depois da confirmação da compra, a gente te manda uma mensagem no WhatsApp agradecendo o pedido e perguntando de qual cidade você quer os contatos. É só responder por lá.",
              },
              {
                step: "PASSO 3",
                title: "Receba a lista na mesma conversa",
                text: "Com o pagamento confirmado e a cidade informada, a gente prepara seus 500 contatos enriquecidos e envia o PDF no WhatsApp em até 2h.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="shrink-0 bg-[#FFE344] text-[#092C5D] font-['Poppins'] font-extrabold text-[12px] px-3 py-1.5 rounded-md uppercase tracking-wider h-fit">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[18px] sm:text-[20px]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[16px] sm:text-[17px] text-[#17324F] leading-[1.55]">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* I. GARANTIA E FECHAMENTO                                     */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16">
        <div className="max-w-[640px] mx-auto text-center">
          {/* Selo 30 dias */}
          <div className="inline-flex flex-col items-center justify-center border-2 border-[#075BCC] bg-[#F2F7FD] rounded-full w-28 h-28 mb-6 p-2">
            <span className="font-['Poppins'] font-extrabold text-[#092C5D] text-[30px] leading-none">
              30
            </span>
            <span className="font-['Poppins'] font-bold text-[#075BCC] text-[13px] uppercase tracking-wider mt-0.5">
              dias
            </span>
            <span className="text-[10px] font-['Poppins'] font-semibold text-[#53677D] uppercase tracking-tight mt-0.5">
              garantia
            </span>
          </div>

          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[34px] leading-[1.2]">
            Sua compra tem 30 dias de garantia.
          </h2>
          <p className="mt-4 text-[17px] sm:text-[19px] text-[#17324F] leading-[1.55]">
            Dentro desse prazo, você pode solicitar a devolução dos R$97.
          </p>

          <div className="mt-7 p-5 bg-[#F2F7FD] rounded-xl border border-[#D7E1EE]">
            <p className="font-['Poppins'] font-bold text-[#092C5D] text-[19px] sm:text-[22px]">
              500 contatos enriquecidos. A cidade que você escolher. R$97.
            </p>
            <p className="mt-1 text-[16px] sm:text-[17px] text-[#53677D]">
              Pra colocar novas conversas na rotina do seu comercial.
            </p>
          </div>

          <div className="mt-8">
            <SalesButton text="QUERO RECEBER MEUS 500 CONTATOS" href={CHECKOUT_URL} size="large" />
          </div>

          <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-[13px] sm:text-[14px] text-[#53677D]">
            <Clock className="w-3.5 h-3.5 text-[#075BCC]" />
            Até 2h após pagamento confirmado e cidade informada pelo WhatsApp
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* J. PERGUNTAS FREQUENTES                                      */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16 bg-[#F2F7FD] border-y border-[#D7E1EE]">
        <div className="max-w-[640px] mx-auto">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[34px] leading-[1.2] text-center">
            Perguntas frequentes
          </h2>

          <div className="mt-8 bg-white rounded-xl border border-[#D7E1EE] px-5">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* RODAPÉ                                                       */}
      {/* ============================================================ */}
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
