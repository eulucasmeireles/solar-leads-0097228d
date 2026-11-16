import { IMAGES, CHECKOUT_URL } from "@/lib/solar-leads-data";
import { SalesButton } from "@/components/solar/SalesButton";
import { CheckCircle2, Check, MapPin, FileCheck, Maximize2 } from "lucide-react";

export function DeliverableAndOfferSections({
  onZoom,
}: {
  onZoom: (data: { src: string; alt: string }) => void;
}) {
  return (
    <>
      {/* ============================================================ */}
      {/* 6. ENTREGÁVEL — MOSTRAR O QUE CHEGA                          */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16 bg-[#F2F7FD] border-y border-[#D7E1EE]">
        <div className="max-w-[820px] mx-auto text-left">
          <div className="text-center">
            <span className="font-['Poppins'] font-bold text-[12px] sm:text-[13px] tracking-wider uppercase text-[#075BCC] bg-white border border-[#D7E1EE] px-3 py-1 rounded-full">
              VEJA COMO A LISTA CHEGA
            </span>
            <h2 className="mt-4 font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[36px] leading-[1.2]">
              O telefone é só o começo. Olha o que vem junto.
            </h2>
            <p className="mt-3 text-[17px] sm:text-[18px] text-[#17324F] max-w-[620px] mx-auto leading-[1.55]">
              Você recebe 500 contatos enriquecidos da cidade que escolher. E consegue olhar cada
              contato com mais contexto antes de começar a conversa.
            </p>
          </div>

          <div className="mt-8 relative group rounded-2xl border border-[#D7E1EE] bg-white p-3 sm:p-5 shadow-sm">
            <div className="w-full rounded-xl overflow-hidden bg-white">
              <img
                src={IMAGES.produtoPdfCorrigido}
                alt="Mockup frontal completo do PDF com 500 contatos enriquecidos, ficha ampliada com indicadores de contato, casa e empresa, e exemplo fictício"
                className="w-full h-auto object-contain block mx-auto"
                loading="lazy"
                width="820"
                height="820"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                onZoom({
                  src: IMAGES.produtoPdfCorrigido,
                  alt: "Mockup principal do PDF com 500 contatos enriquecidos",
                })
              }
              aria-label="Ampliar mockup do PDF"
              className="absolute top-5 right-5 bg-[#092C5D]/90 hover:bg-[#075BCC] text-white p-2 rounded-lg shadow-md transition-colors flex items-center gap-1.5 text-xs font-['Poppins'] font-semibold"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Ampliar</span>
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-[#D7E1EE]">
              <h3 className="font-['Poppins'] font-bold text-[#075BCC] text-[16px] sm:text-[17px] uppercase tracking-wide">
                COM QUEM VOCÊ VAI FALAR
              </h3>
              <p className="mt-2 text-[15px] sm:text-[16px] text-[#17324F] leading-[1.55]">
                Nome, localização e informações de contexto sobre a pessoa. Quando disponíveis, a
                lista também apresenta atividade profissional, vínculo com empresa, e-mail e outros
                telefones.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#D7E1EE]">
              <h3 className="font-['Poppins'] font-bold text-[#075BCC] text-[16px] sm:text-[17px] uppercase tracking-wide">
                QUAL NÚMERO USAR
              </h3>
              <p className="mt-2 text-[15px] sm:text-[16px] text-[#17324F] leading-[1.55]">
                O WhatsApp aparece com o status de verificação. Indicadores ajudam a avaliar a
                ligação daquele telefone com a pessoa identificada.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#D7E1EE]">
              <h3 className="font-['Poppins'] font-bold text-[#075BCC] text-[16px] sm:text-[17px] uppercase tracking-wide">
                POR ONDE COMEÇAR
              </h3>
              <p className="mt-2 text-[15px] sm:text-[16px] text-[#17324F] leading-[1.55]">
                Classificações e indicadores de potencial ajudam a organizar a prioridade dos
                contatos.
              </p>
            </div>
          </div>

          <p className="mt-7 font-['Poppins'] font-semibold text-[#092C5D] text-[17px] text-center">
            Você abre o PDF e encontra essas informações reunidas, sem precisar montar tudo do zero.
          </p>

          <p className="mt-3 text-center text-[13px] text-[#53677D] leading-[1.5] max-w-[620px] mx-auto">
            * Os campos adicionais variam conforme os dados disponíveis. Os indicadores ajudam na
            priorização e não representam intenção de compra confirmada.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. OBJEÇÃO — POR QUE VENDER A LISTA?                         */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16 bg-[#F2F7FD]">
        <div className="max-w-[640px] mx-auto text-left">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[30px] leading-[1.2]">
            “Mas, Lucas, se você usa isso para vender, por que está vendendo a lista?”
          </h2>

          <div className="mt-6 space-y-4 text-[17px] leading-[1.6] text-[#17324F]">
            <p>Porque existe um trabalho para essa lista chegar pronta.</p>
            <p>
              Encontrar os contatos. Cruzar os dados. Conferir os números. Organizar as informações.
            </p>
            <div className="p-4 bg-white rounded-xl border border-[#D7E1EE]">
              <span className="font-['Poppins'] font-bold text-[#075BCC] text-[18px]">
                É esse trabalho que você está comprando.
              </span>
            </div>
            <p>Você escolhe a cidade e recebe o resultado dessa preparação.</p>
            <p>
              Eu vendo a lista enriquecida. Você usa as informações para prospectar e conduzir suas
              próprias conversas.
            </p>
            <p>
              É uma forma de levar para o seu comercial o tipo de recurso que eu usei na minha
              operação.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. OFERTA — 500 CONTATOS POR R$97                           */}
      {/* ============================================================ */}
      <section id="oferta" className="px-5 py-12 sm:py-16 scroll-mt-6">
        <div className="max-w-[640px] mx-auto text-left">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[34px] leading-[1.2] text-center">
            Seu próximo cliente pode estar nesta lista telefônica.
          </h2>

          <div className="mt-5 space-y-3 text-[17px] leading-[1.6] text-[#17324F]">
            <p>
              Pode ser alguém pensando em reduzir a conta de casa. Alguém avaliando uma instalação
              na empresa. Uma pessoa que ainda nem conversou com quem vende energia solar.
            </p>
            <p>
              Você já conhece o assunto. Sabe explicar o projeto, fazer o orçamento e conduzir a
              venda.
            </p>
            <p className="font-semibold text-[#092C5D]">
              A lista te dá uma nova frente para começar esse trabalho.
            </p>
          </div>

          <div className="mt-8 bg-white rounded-2xl border-2 border-[#075BCC]/30 p-5 sm:p-7 shadow-[0_10px_30px_-12px_rgba(9,44,93,0.14)]">
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-[#D7E1EE]">
              <div className="w-28 sm:w-32 shrink-0 rounded-lg overflow-hidden border border-[#D7E1EE] bg-[#F2F7FD]">
                <img
                  src={IMAGES.produtoPdfCorrigido}
                  alt="Mockup compacto da entrega da lista"
                  className="w-full h-auto block"
                  loading="lazy"
                  width="128"
                  height="128"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[22px] sm:text-[24px]">
                  500 contatos enriquecidos.
                </h3>
                <p className="mt-1 text-[14px] text-[#53677D]">
                  Lista completa da cidade escolhida entregue em PDF.
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3 text-[16px] text-[#17324F]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5] mt-0.5" />
                <span>Contatos da cidade que escolher.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5] mt-0.5" />
                <span>Nome e WhatsApp verificado.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5] mt-0.5" />
                <span>Informações adicionais de contexto, quando disponíveis.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5] mt-0.5" />
                <span>Classificações e indicadores para orientar a prospecção.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#075BCC] shrink-0 stroke-[2.5] mt-0.5" />
                <span>PDF entregue pelo WhatsApp.</span>
              </li>
            </ul>

            <div className="mt-7 text-center pt-5 border-t border-[#D7E1EE]">
              <div className="font-['Poppins'] font-extrabold text-[#092C5D] text-[56px] sm:text-[64px] leading-none">
                R$97
              </div>
              <p className="mt-2 text-[15px] sm:text-[16px] text-[#53677D] font-['Poppins'] font-medium">
                Pagamento único. Menos de R$0,20 por contato enriquecido.
              </p>
            </div>

            <div className="mt-6">
              <SalesButton
                text="QUERO RECEBER MEUS 500 CONTATOS"
                href={CHECKOUT_URL}
                size="large"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. ENTREGA — TUDO PELO WHATSAPP                              */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16 bg-[#F2F7FD] border-y border-[#D7E1EE]">
        <div className="max-w-[640px] mx-auto text-left">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[26px] sm:text-[34px] leading-[1.2] text-center">
            Da compra à entrega, tudo pelo WhatsApp.
          </h2>

          <div className="mt-8 space-y-5">
            <div className="bg-white p-5 rounded-xl border border-[#D7E1EE] flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#075BCC] text-white flex items-center justify-center shrink-0 font-['Poppins'] font-bold text-[14px]">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-['Poppins'] font-bold text-[11px] uppercase tracking-wider text-[#075BCC]">
                  PASSO 1
                </span>
                <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[18px]">
                  COMPRA CONFIRMADA
                </h3>
                <p className="mt-1 text-[16px] text-[#17324F]">
                  A gente entra em contato pelo WhatsApp.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#D7E1EE] flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#075BCC] text-white flex items-center justify-center shrink-0 font-['Poppins'] font-bold text-[14px]">
                <MapPin className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-['Poppins'] font-bold text-[11px] uppercase tracking-wider text-[#075BCC]">
                  PASSO 2
                </span>
                <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[18px]">
                  VOCÊ INFORMA A CIDADE
                </h3>
                <p className="mt-1 text-[16px] text-[#17324F]">
                  Pegamos as informações na própria conversa.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#D7E1EE] flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#075BCC] text-white flex items-center justify-center shrink-0 font-['Poppins'] font-bold text-[14px]">
                <FileCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-['Poppins'] font-bold text-[11px] uppercase tracking-wider text-[#075BCC]">
                  PASSO 3
                </span>
                <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[18px]">
                  SUA LISTA CHEGA
                </h3>
                <p className="mt-1 text-[16px] text-[#17324F]">
                  Em até 2 horas após a confirmação da compra e da cidade, você recebe o PDF no
                  WhatsApp.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-7 font-['Poppins'] font-semibold text-[#092C5D] text-[17px] text-center">
            Você não precisa aprender a usar um sistema para acessar o que comprou.
          </p>

          <div className="mt-6 text-center">
            <SalesButton text="QUERO ESCOLHER MINHA CIDADE" href={CHECKOUT_URL} size="large" />
          </div>
        </div>
      </section>
    </>
  );
}
