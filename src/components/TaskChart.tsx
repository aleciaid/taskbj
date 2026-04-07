import { useMemo } from 'react';
import { Task } from '../types/task';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TaskChartProps {
  tasks: Task[];
}

function getLast7Days() {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function formatDayLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

export function TaskChart({ tasks }: TaskChartProps) {
  const days = getLast7Days();

  const timelineData = useMemo(() => {
    return days.map(day => {
      const dayTasks = tasks.filter(t => t.created_at.startsWith(day));
      const completedOnDay = tasks.filter(t => t.completed_at?.startsWith(day));
      return {
        label: formatDayLabel(day),
        'Task Dibuat': dayTasks.length,
        'Selesai': completedOnDay.length,
        'Pending': dayTasks.filter(t => t.status === 'pending').length,
      };
    });
  }, [tasks, days]);

  const pieData = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    return [
      { name: 'Selesai', value: completed, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
    ].filter(d => d.value > 0);
  }, [tasks]);

  if (tasks.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Timeline Area Chart */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Aktivitas Task (7 Hari Terakhir)</h3>
            <p className="text-xs text-gray-400">Task dibuat & diselesaikan per hari</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={timelineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 12 }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="Task Dibuat" stroke="#3b82f6" strokeWidth={2} fill="url(#gradBlue)" dot={{ r: 3, fill: '#3b82f6' }} />
            <Area type="monotone" dataKey="Selesai" stroke="#10b981" strokeWidth={2} fill="url(#gradGreen)" dot={{ r: 3, fill: '#10b981' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm flex flex-col">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Status Saat Ini</h3>
          <p className="text-xs text-gray-400">Distribusi task keseluruhan</p>
        </div>
        {pieData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '10px', fontSize: 12, border: '1px solid #e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-auto space-y-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-600 dark:text-gray-400">{d.name}</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">{d.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                <span className="text-gray-500 dark:text-gray-400">Total</span>
                <span className="font-bold text-gray-900 dark:text-white">{tasks.length}</span>
              </div>
              {tasks.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Belum ada data</div>
        )}
      </div>
    </div>
  );
}
