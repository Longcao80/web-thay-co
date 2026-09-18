import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'warning' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-800 text-white border-emerald-700 shadow-emerald-900/20',
    warning: 'bg-amber-800 text-white border-amber-700 shadow-amber-900/20',
    info: 'bg-sky-800 text-white border-sky-700 shadow-sky-900/20'
  };

  const Icon = type === 'success' ? CheckCircle2 : type === 'warning' ? AlertCircle : Info;

  return (
    <div
      id="app-toast"
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-xl transition-all animate-bounce-short ${bgStyles[type]}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0 text-amber-200" />
      <span className="text-sm font-medium tracking-wide">{message}</span>
      <button
        onClick={onClose}
        className="ml-3 p-1 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Đóng"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
