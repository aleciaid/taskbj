import { useState, useMemo } from 'react';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';
import { TaskChart } from './TaskChart';
import { Search, SlidersHorizontal, Inbox, CheckCircle2, Clock3, ListTodo } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onUpdate: (updated: Task) => void;
}

export function TaskList({ tasks, onDelete, onToggleStatus, onUpdate }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending'); // default hide completed

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
      filtered = filtered.filter(task => task.jenis_task === filterJenis);
    }

    if (filterStatus) {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    return filtered.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [tasks, searchQuery, filterJenis, filterStatus]);

  const jenisTaskOptions = useMemo(() => {
    const unique = new Set(tasks.map(t => t.jenis_task));
    return Array.from(unique);
  }, [tasks]);

  const stats = [
    {
      label: 'Total Task',
      value: tasks.length,
      icon: ListTodo,
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      text: 'text-blue-700 dark:text-blue-300',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    },
    {
      label: 'Selesai',
      value: completedTasks,
      icon: CheckCircle2,
      gradient: 'from-emerald-400 to-green-600',
      bg: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    },
    {
      label: 'Pending',
      value: pendingTasks,
      icon: Clock3,
      gradient: 'from-amber-400 to-orange-500',
      bg: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      text: 'text-amber-700 dark:text-amber-300',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Chart */}
      <TaskChart tasks={tasks} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, gradient, bg, text, iconBg }) => (
          <div key={label} className={`bg-gradient-to-br ${bg} border border-white/60 dark:border-gray-700/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm`}>
            <div className={`${iconBg} p-3 rounded-xl`}>
              <Icon size={22} className={text} />
            </div>
            <div>
              <p className={`text-sm font-medium ${text} opacity-80`}>{label}</p>
              <p className={`text-3xl font-bold ${text}`}>{value}</p>
            </div>
            <div className={`ml-auto w-1 h-12 rounded-full bg-gradient-to-b ${gradient} opacity-60`} />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:text-white placeholder-gray-400 outline-none transition"
            />
          </div>

          <div className="relative sm:w-44">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white appearance-none outline-none transition"
            >
              <option value="">Semua Jenis</option>
              {jenisTaskOptions.map(jenis => (
                <option key={jenis} value={jenis}>{jenis}</option>
              ))}
            </select>
          </div>

          <div className="relative sm:w-44">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white appearance-none outline-none transition"
            >
              <option value="">Semua Status</option>
              <option value="completed">Selesai</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-700 mb-5">
            <Inbox className="text-gray-400 dark:text-gray-500" size={40} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {tasks.length === 0 ? 'Belum ada task' : 'Tidak ada hasil'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {tasks.length === 0
              ? 'Mulai dengan menambahkan task baru'
              : 'Coba ubah filter atau pencarian Anda'}
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
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}

      {filteredTasks.length > 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
          Menampilkan <span className="font-semibold text-gray-600 dark:text-gray-300">{filteredTasks.length}</span> dari <span className="font-semibold text-gray-600 dark:text-gray-300">{tasks.length}</span> task
        </p>
      )}
    </div>
  );
}
