import { Task } from '../types/task';
import { formatDate } from '../utils/helpers';
import { Trash2, CheckCircle, Circle, Phone, Briefcase, Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function TaskCard({ task, onDelete, onToggleStatus }: TaskCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {task.nama}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              task.status === 'completed'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {task.status === 'completed' ? 'Selesai' : 'Pending'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Briefcase size={14} />
            <span>{task.jabatan}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Phone size={14} />
          <span>{task.no_telp}</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
            {task.jenis_task_custom || task.jenis_task}
          </span>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          {task.informasi}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-3">
          <Calendar size={12} />
          <span>{formatDate(task.created_at)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onToggleStatus(task.id)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {task.status === 'completed' ? (
            <>
              <CheckCircle size={16} className="text-green-600" />
              <span>Tandai Pending</span>
            </>
          ) : (
            <>
              <Circle size={16} />
              <span>Tandai Selesai</span>
            </>
          )}
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="ml-auto flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          <span>Hapus</span>
        </button>
      </div>
    </div>
  );
}
