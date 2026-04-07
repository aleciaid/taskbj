import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg shadow-lg border
        ${toast.type === 'success'
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }
        animate-in slide-in-from-right-full
      `}
    >
      {toast.type === 'success' ? (
        <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
      ) : (
        <XCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
      )}
      <p className={`flex-1 text-sm font-medium ${
        toast.type === 'success'
          ? 'text-green-800 dark:text-green-200'
          : 'text-red-800 dark:text-red-200'
      }`}>
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
          toast.type === 'success'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`}
      >
        <X size={16} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full px-4">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
