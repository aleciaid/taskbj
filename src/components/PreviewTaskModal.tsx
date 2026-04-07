import { Task } from '../types/task';
import { formatDate } from '../utils/helpers';
import { X, Briefcase, Phone, Tag, Calendar, CheckCircle, Circle, Clock } from 'lucide-react';
import { useEffect } from 'react';

interface PreviewTaskModalProps {
  task: Task;
  onClose: () => void;
}

export function PreviewTaskModal({ task, onClose }: PreviewTaskModalProps) {
  const isCompleted = task.status === 'completed';

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className={`h-1.5 w-full shrink-0 ${isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} />

        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
          <div className="pr-4">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {task.nama}
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full shrink-0
                ${isCompleted
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                }`}>
                {isCompleted ? <><CheckCircle size={12} /> Selesai</> : <><Circle size={12} /> Pending</>}
              </span>
            </div>
            {task.completed_at && (
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 font-medium mb-2">
                <Clock size={12} /> Diselesaikan pada {formatDate(task.completed_at)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl transition-colors shrink-0"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                <Briefcase size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Jabatan</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{task.jabatan}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                <Phone size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">No. Telp</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{task.no_telp}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                <Tag size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Jenis Task</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{task.jenis_task_custom || task.jenis_task}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                <Calendar size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Tanggal Dibuat</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatDate(task.created_at)}</p>
            </div>
          </div>

          {/* Informasi Detail */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Informasi Detail
            </h3>
            <div
              className="task-body text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm w-full overflow-x-auto break-words"
              dangerouslySetInnerHTML={{ __html: task.informasi }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-50/50 dark:bg-gray-800/20">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Tutup Preview
          </button>
        </div>
      </div>
    </div>
  );
}
