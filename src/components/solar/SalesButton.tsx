import { ArrowRight } from "lucide-react";

interface SalesButtonProps {
  text: string;
  subtext?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "default" | "large";
}

export function SalesButton({
  text,
  subtext,
  href,
  onClick,
  className = "",
  size = "default",
}: SalesButtonProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center w-full">
      <span className="inline-flex items-center justify-center gap-2.5 font-bold uppercase tracking-wide">
        <span>{text}</span>
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFE344] shrink-0 stroke-[3]" />
      </span>
      {subtext && (
        <span className="text-xs sm:text-sm font-normal text-white/90 mt-1">{subtext}</span>
      )}
    </div>
  );

  const baseClasses = `btn-sales rounded-[10px] w-full flex items-center justify-center font-['Poppins'] font-bold cursor-pointer select-none px-4 sm:px-6 py-4 sm:py-4.5 text-center leading-tight transition-all duration-150 ${
    size === "large"
      ? "text-[18px] sm:text-[22px] md:text-[24px] min-h-[64px]"
      : "text-[16px] sm:text-[19px] md:text-[20px] min-h-[56px]"
  } ${className}`;

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={baseClasses}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
