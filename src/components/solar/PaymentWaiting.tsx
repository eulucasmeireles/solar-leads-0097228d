/**
 * Estado "aguardando o pagamento" enquanto o popup da InfinitePay está aberto.
 * A tela segue sozinha quando o servidor confirmar o pagamento.
 */
export function PaymentWaiting({
  onReopen,
  onCancel,
  cancelLabel,
}: {
  onReopen: () => void;
  onCancel: () => void;
  cancelLabel: string;
}) {
  return (
    <div className="text-center space-y-3.5" role="status" aria-live="polite">
      <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#D7E1EE] border-t-[#075BCC]" />
      <p className="font-heading font-bold text-solar-deep text-[17px]">
        Finalize o pagamento na janela que abriu
      </p>
      <p className="text-[14px] text-solar-muted leading-[1.5]">
        Pague por Pix ou cartão. Esta tela segue sozinha assim que o pagamento for aprovado.
      </p>
      <button
        type="button"
        onClick={onReopen}
        className="text-solar-primary font-heading font-semibold text-[14px] hover:underline"
      >
        Abrir a janela de pagamento de novo
      </button>
      <div>
        <button
          type="button"
          onClick={onCancel}
          className="text-solar-muted text-[13px] hover:underline"
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  );
}
