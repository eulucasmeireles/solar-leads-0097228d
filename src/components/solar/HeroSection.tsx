import { CHECKOUT_URL, IMAGES } from "@/lib/solar-leads-data";
import { SalesButton } from "@/components/solar/SalesButton";

export function HeroSection() {
  return (
    <section className="px-5 pt-8 pb-12 sm:pt-14 sm:pb-16">
      <div className="max-w-[760px] mx-auto text-left">
        <h1 className="font-['Poppins'] font-bold text-[#092C5D] text-[28px] sm:text-[38px] md:text-[46px] leading-[1.14] tracking-tight">
          <span className="text-[#075BCC]">R$84 mil</span> nos meus primeiros 27 dias vendendo
          <span className="marker-highlight">energia solar</span>.{" "}
          <span className="font-['Caveat'] text-[32px] sm:text-[42px] text-[#092C5D] font-bold whitespace-normal inline">
            Sem gastar com anúncios.
          </span>
        </h1>

        {/* Ilustração da lista logo abaixo do "Sem gastar com anúncios" */}
        <div className="mt-6 rounded-2xl border border-[#D7E1EE] bg-[#F2F7FD]/40 p-2 sm:p-3 shadow-[0_10px_30px_-12px_rgba(9,44,93,0.12)]">
          <div className="w-full rounded-xl overflow-hidden bg-white">
            <img
              src={IMAGES.produtoPdfCorrigido}
              alt="Mockup do PDF com 500 contatos enriquecidos"
              className="w-full h-auto object-contain block"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="720"
              height="720"
            />
          </div>
        </div>

        <p className="mt-6 text-[17px] sm:text-[19px] text-[#17324F] leading-[1.6]">
          Todos esses projetos vieram de uma lista de contatos. Agora você pode receber 500 contatos
          enriquecidos da cidade que escolher para começar sua própria prospecção.
        </p>

        <p className="mt-3 text-[14px] sm:text-[15px] text-[#53677D]">
          Nome, WhatsApp verificado e informações para orientar sua abordagem.
        </p>

        <div className="mt-6 pt-1">
          <SalesButton text="QUERO RECEBER MEUS 500 CONTATOS" href={CHECKOUT_URL} size="large" />
        </div>
      </div>
    </section>
  );
}
