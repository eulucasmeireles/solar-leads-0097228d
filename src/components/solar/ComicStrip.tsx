/**
 * Tirinha — história visual em 3 quadros sobre trabalhar a lista.
 * Traço editorial: contorno azul-marinho (#092C5D), branco predominante,
 * amarelo (#FFE344) pontual. Personagem simples e consistente nos 3 quadros.
 * Sem carrossel automático — a pessoa acompanha no próprio ritmo.
 */

const FRAMES = [
  {
    num: "1",
    title: "A primeira mensagem",
    text: "Como começar sem cair no “oi, tudo bem?” de sempre.",
    Art: FrameArt1,
  },
  {
    num: "2",
    title: "A qualificação",
    text: "O que entender antes de sair montando orçamento.",
    Art: FrameArt2,
  },
  {
    num: "3",
    title: "A proposta",
    text: "Como conduzir o atendimento para a decisão.",
    Art: FrameArt3,
  },
];

export function ComicStrip() {
  return (
    <div className="space-y-4">
      {FRAMES.map((f) => {
        const Art = f.Art;
        return (
          <div
            key={f.num}
            className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl border border-[#D7E1EE] p-4 sm:p-5"
          >
            <div className="w-full sm:w-[260px] shrink-0 rounded-lg bg-[#F2F7FD] border border-[#D7E1EE] flex items-center justify-center px-3 py-2">
              <Art />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2.5">
                <span className="font-['Poppins'] font-extrabold text-[#FFE344] text-[20px] leading-none [text-shadow:-0.5px_0_#092C5D,0.5px_0_#092C5D,0_-0.5px_#092C5D,0_0.5px_#092C5D]">
                  {f.num}
                </span>
                <h3 className="font-['Poppins'] font-bold text-[#092C5D] text-[17px] sm:text-[19px] leading-tight">
                  {f.title}
                </h3>
              </div>
              <p className="mt-2 text-[15px] sm:text-[16px] text-[#17324F] leading-[1.5]">
                {f.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FrameArt1() {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="img"
      aria-label="Quadro 1: o vendedor escolhe um contato na lista e começa uma mensagem"
    >
      <line
        x1="24"
        y1="150"
        x2="256"
        y2="150"
        stroke="#092C5D"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="150"
        y="92"
        width="96"
        height="56"
        rx="4"
        fill="#FFFFFF"
        stroke="#092C5D"
        strokeWidth="2.5"
      />
      <line x1="160" y1="104" x2="234" y2="104" stroke="#092C5D" strokeWidth="1.8" />
      <line x1="160" y1="114" x2="234" y2="114" stroke="#092C5D" strokeWidth="1.8" />
      <line x1="160" y1="124" x2="218" y2="124" stroke="#092C5D" strokeWidth="1.8" />
      <line x1="160" y1="134" x2="234" y2="134" stroke="#092C5D" strokeWidth="1.8" />
      <rect x="157" y="109" width="58" height="8" fill="#FFE344" opacity="0.7" rx="1.5" />
      <circle cx="76" cy="66" r="16" fill="#FFFFFF" stroke="#092C5D" strokeWidth="3" />
      <path
        d="M76 82 L76 116 M60 100 L92 100 M76 116 L64 146 M76 116 L88 146"
        stroke="#092C5D"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M56 24 C50 24 46 28 46 34 L46 40 C46 44 50 48 56 48 L70 48 L76 54 L75 48 L94 48 C100 48 104 44 104 40 L104 34 C104 28 100 24 94 24 Z"
        fill="#FFFFFF"
        stroke="#092C5D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="64" cy="36" r="2.4" fill="#092C5D" />
      <circle cx="74" cy="36" r="2.4" fill="#092C5D" />
      <circle cx="84" cy="36" r="2.4" fill="#092C5D" />
      <circle cx="102" cy="26" r="3.5" fill="#FFE344" />
    </svg>
  );
}

function FrameArt2() {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="img"
      aria-label="Quadro 2: o vendedor qualifica o contato com perguntas e fala sobre a conta de energia"
    >
      <line
        x1="24"
        y1="160"
        x2="256"
        y2="160"
        stroke="#092C5D"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="26"
        y="26"
        width="66"
        height="34"
        rx="10"
        fill="#FFFFFF"
        stroke="#092C5D"
        strokeWidth="2.5"
      />
      <path
        d="M48 60 L44 68 L56 62 Z"
        fill="#FFFFFF"
        stroke="#092C5D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text
        x="59"
        y="50"
        fontFamily="'Open Sans', sans-serif"
        fontSize="16"
        fontWeight="700"
        fill="#092C5D"
        textAnchor="middle"
      >
        ?
      </text>
      <rect
        x="188"
        y="26"
        width="66"
        height="34"
        rx="10"
        fill="#092C5D"
        stroke="#092C5D"
        strokeWidth="2.5"
      />
      <path d="M236 60 L240 68 L228 62 Z" fill="#092C5D" />
      <text
        x="221"
        y="50"
        fontFamily="'Open Sans', sans-serif"
        fontSize="16"
        fontWeight="700"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        ?
      </text>
      <circle cx="140" cy="92" r="18" fill="#FFFFFF" stroke="#092C5D" strokeWidth="3" />
      <path
        d="M140 110 L140 142 M122 125 L158 125 M140 142 L126 158 M140 142 L154 158"
        stroke="#092C5D"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M198 112 L188 128 L198 128 L193 142 L212 124 L203 124 L209 112 Z"
        fill="#FFE344"
        stroke="#092C5D"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FrameArt3() {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="img"
      aria-label="Quadro 3: o vendedor ao lado da proposta com o próximo passo destacado"
    >
      <line
        x1="24"
        y1="152"
        x2="256"
        y2="152"
        stroke="#092C5D"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="70" cy="74" r="16" fill="#FFFFFF" stroke="#092C5D" strokeWidth="3" />
      <path
        d="M70 90 L70 124 M54 107 L86 107 M70 124 L58 150 M70 124 L82 150"
        stroke="#092C5D"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <rect
        x="138"
        y="56"
        width="104"
        height="84"
        rx="4"
        fill="#FFFFFF"
        stroke="#092C5D"
        strokeWidth="2.5"
      />
      <line x1="148" y1="68" x2="232" y2="68" stroke="#092C5D" strokeWidth="2" />
      <line x1="148" y1="78" x2="232" y2="78" stroke="#092C5D" strokeWidth="2" />
      <line x1="148" y1="88" x2="210" y2="88" stroke="#092C5D" strokeWidth="2" />
      <rect x="148" y="100" width="76" height="24" rx="3" fill="#FFE344" opacity="0.6" />
      <line x1="154" y1="108" x2="172" y2="108" stroke="#092C5D" strokeWidth="2" />
      <line x1="154" y1="116" x2="166" y2="116" stroke="#092C5D" strokeWidth="2" />
      <circle cx="232" cy="46" r="13" fill="#FFE344" stroke="#092C5D" strokeWidth="2.5" />
      <path
        d="M226 46 L231 51 L239 41"
        stroke="#092C5D"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
