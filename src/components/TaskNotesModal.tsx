import { useState } from 'react';
import { Task, TaskNote } from '../types/task';
import { generateId } from '../utils/helpers';
import { MessageSquarePlus, Send, X, MessageCircle, Clock } from 'lucide-react';

interface TaskNotesModalProps {
  task: Task;
  onSave: (updated: Task) => void;
  onClose: () => void;
}

function formatNoteDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export function TaskNotesModal({ task, onSave, onClose }: TaskNotesModalProps) {
  const [notes, setNotes] = useState<TaskNote[]>(task.notes || []);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (!input.trim()) return;
    const newNote: TaskNote = {
      id: generateId(),
      text: input.trim(),
      created_at: new Date().toISOString()
    };
    const updated = [...notes, newNote];
    setNotes(updated);
    onSave({ ...task, notes: updated });
    setInput('');
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    onSave({ ...task, notes: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full sm:max-w-lg flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
              <MessageCircle size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Catatan Task</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{task.nama}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Status badge */}
        <div className="px-5 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
            task.status === 'completed'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
          }`}>
            {task.status === 'completed' ? '✅ Selesai' : '🕐 Pending'}
          </span>
          {task.completed_at && (
            <span className="ml-2 text-xs text-gray-400 flex items-center gap-1 inline-flex">
              <Clock size={11} /> Selesai: {formatNoteDate(task.completed_at)}
            </span>
          )}
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquarePlus size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-400">Belum ada catatan. Tambahkan catatan di bawah.</p>
            </div>
          ) : (
            notes.map(note => (
              <div key={note.id} className="group flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5">
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{note.text}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-400">{formatNoteDate(note.created_at)}</span>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-600 transition-all"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="Tulis catatan..."
              className="flex-1 px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white placeholder-gray-400 transition"
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl transition-all shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
