import { useState } from 'react';
import { Task } from '../types/task';
import { formatDate } from '../utils/helpers';
import {
  Trash2, CheckCircle, Circle, Phone, Briefcase,
  Calendar, Tag, Pencil, MessageCircle, Eye
} from 'lucide-react';
import { EditTaskModal } from './EditTaskModal';
import { TaskNotesModal } from './TaskNotesModal';
import { PreviewTaskModal } from './PreviewTaskModal';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onUpdate: (updated: Task) => void;
}

export function TaskCard({ task, onDelete, onToggleStatus, onUpdate }: TaskCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const isCompleted = task.status === 'completed';
  const noteCount = task.notes?.length ?? 0;

  return (
    <>
      <div className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-col overflow-hidden
        ${isCompleted
          ? 'border-green-200 dark:border-green-800/50'
          : 'border-gray-200 dark:border-gray-700'
        }`}
      >
        {/* Top accent bar */}
        <div className={`h-1 w-full ${isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} />

        <div className="p-5 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-base text-gray-900 dark:text-white truncate">
                  {task.nama}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full shrink-0
                  ${isCompleted
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>
                  {isCompleted ? <><CheckCircle size={10} /> Selesai</> : <><Circle size={10} /> Pending</>}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Briefcase size={13} />
                <span className="truncate">{task.jabatan}</span>
              </div>
            </div>
            {/* Edit button - hover reveal */}
            <button
              onClick={() => setShowEdit(true)}
              className="opacity-0 group-hover:opacity-100 p-1.5 ml-2 shrink-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all text-gray-400 hover:text-blue-500"
              title="Edit task"
            >
              <Pencil size={14} />
            </button>
          </div>

          {/* Info rows */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Phone size={13} />
              <span>{task.no_telp}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Tag size={13} className="text-blue-500 dark:text-blue-400 shrink-0" />
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">
                {task.jenis_task_custom || task.jenis_task}
              </span>
            </div>
          </div>

          {/* Informasi - rendered HTML */}
          <div
            className="task-body text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 mb-3 max-h-28 overflow-y-auto overflow-x-auto break-words"
            dangerouslySetInnerHTML={{ __html: task.informasi }}
          />

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-4">
            <Calendar size={11} />
            <span>{formatDate(task.created_at)}</span>
          </div>

          {/* Actions */}
          <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => onToggleStatus(task.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150
                ${isCompleted
                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/40'
                }`}
            >
              {isCompleted ? <><Circle size={13} /> Tandai Pending</> : <><CheckCircle size={13} /> Tandai Selesai</>}
            </button>

            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
              title="Preview Task"
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>

            <button
              onClick={() => setShowNotes(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
              title="Catatan"
            >
              <MessageCircle size={13} />
              {noteCount > 0 && <span>{noteCount}</span>}
            </button>

            <button
              onClick={() => onDelete(task.id)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-150"
            >
              <Trash2 size={13} />
              Hapus
            </button>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditTaskModal
          task={task}
          onSave={onUpdate}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showNotes && (
        <TaskNotesModal
          task={task}
          onSave={onUpdate}
          onClose={() => setShowNotes(false)}
        />
      )}

      {showPreview && (
        <PreviewTaskModal
          task={task}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
