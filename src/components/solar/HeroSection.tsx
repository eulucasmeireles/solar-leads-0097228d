import { useState } from "react";
import { CHECKOUT_URL, IMAGES } from "@/lib/solar-leads-data";
import { SalesButton } from "@/components/solar/SalesButton";
import { Maximize2, X } from "lucide-react";

export function HeroSection({ onZoom }: { onZoom: (data: { src: string; alt: string }) => void }) {
  return (
    <section className="px-5 pt-8 pb-12 sm:pt-14 sm:pb-16">
      <div className="max-w-[1020px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Coluna Texto */}
          <div className="lg:col-span-7 text-left">
            <span className="inline-block font-['Poppins'] font-bold text-[12px] sm:text-[13px] tracking-wider uppercase text-[#075BCC] bg-[#F2F7FD] border border-[#D7E1EE] px-3 py-1 rounded-full">
              PARA QUEM VENDE ENERGIA SOLAR
            </span>

            <h1 className="mt-4 font-['Poppins'] font-bold text-[#092C5D] text-[28px] sm:text-[38px] md:text-[46px] leading-[1.14] tracking-tight">
              <span className="text-[#075BCC]">R$84 mil</span> nos meus primeiros 27 dias vendendo
              energia solar.{" "}
              <span className="font-['Caveat'] text-[32px] sm:text-[42px] text-[#092C5D] font-bold marker-highlight whitespace-normal inline">
                Sem gastar com anúncios.
              </span>
            </h1>

            <p className="mt-5 text-[17px] sm:text-[19px] text-[#17324F] leading-[1.6]">
              Todos esses projetos vieram de uma lista de contatos. Agora você pode receber 500
              contatos enriquecidos da cidade que escolher para começar sua própria prospecção.
            </p>

            <div className="mt-6 pt-2">
              <SalesButton
                text="QUERO RECEBER MEUS 500 CONTATOS"
                href={CHECKOUT_URL}
                size="large"
              />
            </div>

            <p className="mt-3 text-[14px] sm:text-[15px] text-[#53677D]">
              Nome, WhatsApp verificado e informações para orientar sua abordagem.
            </p>
          </div>

          {/* Coluna Imagem 01 — Mockup compacto do PDF */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-2xl border border-[#D7E1EE] bg-[#F2F7FD]/40 p-2 sm:p-3 shadow-[0_10px_30px_-12px_rgba(9,44,93,0.12)]">
              <div className="w-full rounded-xl overflow-hidden bg-white">
                <img
                  src={IMAGES.produtoPdfCorrigido}
                  alt="Mockup do PDF com 500 contatos enriquecidos com exemplo de ficha ampliada e indicadores de contato"
                  className="w-full h-auto object-contain block"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="640"
                  height="640"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  onZoom({
                    src: IMAGES.produtoPdfCorrigido,
                    alt: "Mockup do PDF com 500 contatos enriquecidos",
                  })
                }
                aria-label="Ampliar mockup do PDF"
                className="absolute bottom-4 right-4 bg-[#092C5D]/90 hover:bg-[#075BCC] text-white p-2 rounded-lg shadow-md transition-colors flex items-center gap-1.5 text-xs font-['Poppins'] font-semibold"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Ampliar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ImageZoomModal({
  image,
  onClose,
}: {
  image: { src: string; alt: string } | null;
  onClose: () => void;
}) {
  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-50 bg-[#092C5D]/80 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-[92vw] max-h-[92vh] bg-white rounded-2xl p-2 sm:p-4 shadow-2xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar ampliação"
          className="absolute -top-3 -right-3 bg-[#092C5D] text-white hover:bg-[#075BCC] rounded-full p-2 shadow-lg transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={image.src}
          alt={image.alt}
          className="max-h-[82vh] w-auto max-w-full object-contain rounded-lg"
        />
        <p className="mt-2 text-xs text-[#53677D] text-center font-['Open_Sans']">{image.alt}</p>
      </div>
    </div>
  );
}
