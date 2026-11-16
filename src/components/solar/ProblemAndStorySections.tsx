import { IMAGES } from "@/lib/solar-leads-data";
import { Network, PhoneCall, FileSpreadsheet } from "lucide-react";

export function ProblemAndStorySections() {
  return (
    <>
      {/* ============================================================ */}
      {/* 2. PROBLEMA — TIRINHA DO DINOSSAURO                          */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16 bg-[#F2F7FD] border-y border-[#D7E1EE]">
        <div className="max-w-[680px] mx-auto text-left">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[32px] leading-[1.2] text-center">
            Seu comercial precisa esperar o próximo lead cair?
          </h2>

          <div className="mt-7 flex flex-col items-center">
            <div className="w-full max-w-[340px] sm:max-w-[420px]">
              <img
                src={IMAGES.dinossauroTrafegoPago}
                alt="Dinossauro identificado como Tráfego Pago sob um meteoro com a frase Extinção iminente."
                className="w-full h-auto object-contain block mx-auto select-none"
                loading="lazy"
                width="420"
                height="315"
              />
            </div>
          </div>

          <div className="mt-8 space-y-4 text-[17px] leading-[1.6] text-[#17324F]">
            <p>
              Uma indicação. Alguém que viu sua placa. Uma pessoa que ouviu o anúncio no rádio. Um
              formulário que chegou da campanha.
            </p>
            <p>
              Enquanto isso, tem orçamento para fazer, equipe para manter e projeto para fechar.
            </p>
            <p>Investir mais em divulgação é um caminho.</p>
            <p className="font-semibold text-[#092C5D]">
              Mas existe outra possibilidade: ter uma lista organizada para o seu comercial começar
              novas conversas.
            </p>
            <p className="font-['Poppins'] font-bold text-[#075BCC] text-[18px]">
              Foi esse caminho que eu usei.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. HISTÓRIA — QUEM É O LUCAS                                 */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16">
        <div className="max-w-[960px] mx-auto">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[32px] leading-[1.2]">
            Antes de vender essa lista, eu passei anos trabalhando com marketing e investindo em
            tráfego.
          </h2>

          {/* Foto Real do Lucas logo abaixo da headline */}
          <div className="mt-6 flex flex-col items-center sm:items-start">
            <div className="w-full max-w-[400px] rounded-2xl overflow-hidden border border-[#D7E1EE] shadow-[0_10px_25px_-10px_rgba(9,44,93,0.15)] bg-[#F2F7FD]">
              <img
                src={IMAGES.fotoLucas}
                alt="Lucas Meireles — marketing e operação comercial na Energiza"
                className="w-full h-auto object-cover block"
                loading="lazy"
                width="400"
                height="450"
              />
            </div>
            <span className="mt-3 font-['Poppins'] font-semibold text-[#092C5D] text-[15px]">
              Lucas Meireles
            </span>
          </div>

          {/* Texto de história */}
          <div className="mt-8 max-w-[680px] text-left">
            <div className="space-y-4 text-[17px] leading-[1.6] text-[#17324F]">
              <p>Eu sou o Lucas Meireles.</p>
              <p>
                Meu trabalho passa por campanhas, anúncios, páginas de vendas, funis e automações.
                E, na Energiza, também participo da operação comercial: ofertas, orçamentos e
                propostas de energia solar.
              </p>
              <p>Então eu acompanho os dois lados.</p>
              <p>
                O esforço para fazer um contato chegar. E o trabalho para transformar aquela
                conversa em um projeto.
              </p>
              <p>
                Depois de anos investindo em tráfego, uma coisa ficou clara pra mim: o custo não
                termina quando o lead chega.
              </p>
              <p>
                Você ainda precisa atender, entender o cenário, montar a proposta e acompanhar a
                negociação.
              </p>
              <p>
                E, quando o contato fica mais caro, essa conta aperta antes mesmo de a venda
                acontecer.
              </p>
              <p>
                Eu queria ter outra forma de começar conversas. Uma que não exigisse colocar mais
                dinheiro em anúncios a cada nova tentativa de encontrar clientes.
              </p>
              <p className="font-['Poppins'] font-semibold text-[#092C5D] text-[18px] bg-[#F2F7FD] p-4 rounded-lg border-l-4 border-[#075BCC]">
                Foi aí que a lista entrou na minha operação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PROVA — O PROJETO DE R$19.490                            */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16 bg-[#F2F7FD] border-y border-[#D7E1EE]">
        <div className="max-w-[720px] mx-auto text-left">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[32px] leading-[1.2] text-center">
            Uma primeira mensagem abriu uma conversa que virou um projeto de{" "}
            <span className="text-[#075BCC]">R$19.490</span>.
          </h2>

          <div className="mt-5 space-y-3 text-[17px] leading-[1.6] text-[#17324F] text-center max-w-[560px] mx-auto">
            <p>Eu entrei em contato com uma pessoa da lista.</p>
            <p className="font-semibold text-[#092C5D]">A conversa avançou e virou esse projeto.</p>
          </div>

          <div className="mt-7 rounded-2xl border border-[#D7E1EE] bg-white p-3 sm:p-5 shadow-sm">
            <div className="w-full rounded-xl overflow-hidden bg-white">
              <img
                src={IMAGES.provaOrcamentoWhatsapp}
                alt="Orçamento aprovado de R$ 19.490 e trechos reais da negociação no WhatsApp com dados sensíveis ocultos"
                className="w-full h-auto block mx-auto"
                loading="lazy"
                width="720"
                height="480"
              />
            </div>
            <p className="mt-2 text-center text-[12px] text-[#53677D]">
              Orçamento de energia solar aprovado com conversa de negociação.
            </p>
          </div>

          <div className="mt-7 space-y-4 text-[17px] leading-[1.6] text-[#17324F]">
            <p>
              Nos meus primeiros 27 dias vendendo energia solar, foram R$84 mil de faturamento,
              todos vindos dos contatos da lista, sem investimento em anúncios.
            </p>
            <p className="font-semibold text-[#092C5D]">Esse foi o meu resultado.</p>
            <p>
              A lista abriu o caminho. O atendimento, a negociação e o fechamento continuaram
              fazendo parte do trabalho.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. MECANISMO — O TRABALHO ANTES DA MENSAGEM                  */}
      {/* ============================================================ */}
      <section className="px-5 py-12 sm:py-16">
        <div className="max-w-[680px] mx-auto text-left">
          <h2 className="font-['Poppins'] font-bold text-[#092C5D] text-[24px] sm:text-[32px] leading-[1.2] text-center">
            Você já se perguntou de onde vem o número que um call center usa para te ligar?
          </h2>

          <div className="mt-6 space-y-4 text-[17px] leading-[1.6] text-[#17324F]">
            <p>Essa pergunta ajuda a entender o que acontece antes do primeiro contato.</p>
            <p>
              Existe uma etapa que você não vê: encontrar números, cruzar informações, conferir a
              quem eles estão ligados e organizar a base.
            </p>
            <p>É nessa parte que entra a nossa inteligência de enriquecimento de dados.</p>
            <p>Ela cruza cadastros e informações para avaliar os contatos.</p>
            <p>
              Um número que aparece associado à mesma pessoa em diferentes registros traz um sinal.
              Um telefone que aparece ligado a várias pessoas diferentes exige outro cuidado.
            </p>
            <p>Essas informações ajudam a conferir e classificar os contatos.</p>
            <p className="font-semibold text-[#092C5D]">
              No fim, esse trabalho chega para você em um formato simples: uma lista organizada em
              PDF.
            </p>
          </div>

          {/* Elemento visual 05 — Três ícones sequenciais */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D7E1EE]">
            <div className="bg-[#F2F7FD] p-5 rounded-xl border border-[#D7E1EE] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white border border-[#D7E1EE] flex items-center justify-center text-[#075BCC] mb-3">
                <Network className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[16px]">
                Cruzar informações
              </h3>
              <p className="mt-1 text-[13px] text-[#53677D] leading-[1.4]">
                Registros conectados para identificar a pessoa.
              </p>
            </div>

            <div className="bg-[#F2F7FD] p-5 rounded-xl border border-[#D7E1EE] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white border border-[#D7E1EE] flex items-center justify-center text-[#075BCC] mb-3">
                <PhoneCall className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[16px]">
                Conferir contatos
              </h3>
              <p className="mt-1 text-[13px] text-[#53677D] leading-[1.4]">
                Telefone com WhatsApp verificado antes do envio.
              </p>
            </div>

            <div className="bg-[#F2F7FD] p-5 rounded-xl border border-[#D7E1EE] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white border border-[#D7E1EE] flex items-center justify-center text-[#075BCC] mb-3">
                <FileSpreadsheet className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[16px]">
                Organizar a lista
              </h3>
              <p className="mt-1 text-[13px] text-[#53677D] leading-[1.4]">
                Documento estruturado por cidade e contexto.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
