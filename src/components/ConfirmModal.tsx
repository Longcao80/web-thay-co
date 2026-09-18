import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận xóa',
  cancelText = 'Hủy bỏ',
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div
        id="confirm-modal-dialog"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Xác nhận thao tác quản trị</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {message}
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              id="confirm-cancel-btn"
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              id="confirm-action-btn"
              type="button"
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all shadow-sm cursor-pointer ${
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-700 focus:ring-2 focus:ring-rose-400'
                  : 'bg-slate-800 hover:bg-slate-900 focus:ring-2 focus:ring-slate-400'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
