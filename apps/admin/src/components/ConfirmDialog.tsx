interface ConfirmDialogProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({ message, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-[#1e1928] border border-[#2e2840] rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="text-4xl text-center mb-4">⚠️</div>
        <p className="text-[#f0e8d8] text-center mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button id="confirm-cancel-btn" onClick={onCancel} className="flex-1 btn-ghost">
            إلغاء
          </button>
          <button
            id="confirm-ok-btn"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-xl py-2 transition-all"
          >
            {loading ? '...' : 'تأكيد الحذف'}
          </button>
        </div>
      </div>
    </div>
  )
}
