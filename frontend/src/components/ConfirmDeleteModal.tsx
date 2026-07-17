interface ConfirmDeleteModalProps {
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDeleteModal({
  title,
  description,
  confirmLabel = 'Excluir',
  isLoading = false,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl space-y-5 border border-neutral-light">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-neutral-darkest">{title}</h2>
          <p className="text-sm text-neutral-medium">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-neutral-light text-neutral-dark font-semibold hover:bg-neutral-bg transition-colors disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-feedback-error text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isLoading ? 'Excluindo...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
