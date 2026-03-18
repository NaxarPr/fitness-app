const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = '',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]"
      onClick={() => onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="bg-gray-800 rounded-lg p-6 w-[90%] max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-modal-title" className="text-lg font-medium text-white mb-2">
          {title}
        </h3>
        {message ? (
          <p className="text-gray-400 text-sm mb-6">
            {message}
          </p>
        ) : null}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => onClose?.()}
            className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.()}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors"
            aria-label="Confirm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
