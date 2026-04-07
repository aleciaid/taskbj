import { useState, useMemo } from 'react';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';
import { Search, Filter, Inbox } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function TaskList({ tasks, onDelete, onToggleStatus }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.nama.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterJenis) {
      filtered = filtered.filter(task =>
        task.jenis_task === filterJenis
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(task =>
        task.status === filterStatus
      );
    }

    return filtered.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [tasks, searchQuery, filterJenis]);

  const jenisTaskOptions = useMemo(() => {
    const unique = new Set(tasks.map(t => t.jenis_task));
    return Array.from(unique);
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* Recap Status Task */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Task</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{tasks.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Selesai</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{completedTasks}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{pendingTasks}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
          >
            <option value="">Semua Jenis Task</option>
            {jenisTaskOptions.map(jenis => (
              <option key={jenis} value={jenis}>{jenis}</option>
            ))}
          </select>
        </div>

        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
          >
            <option value="">Semua Status</option>
            <option value="completed">Selesai</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <Inbox className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={64} />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {tasks.length === 0 ? 'Belum ada task' : 'Tidak ada hasil'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {tasks.length === 0
              ? 'Mulai dengan menambahkan task baru'
              : 'Coba ubah filter atau pencarian Anda'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}

      {filteredTasks.length > 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Menampilkan {filteredTasks.length} dari {tasks.length} task
        </p>
      )}
    </div>
  );
}
