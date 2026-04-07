import { useState, useCallback } from 'react';
import { Task } from './types/task';
import { Customer } from './types/customer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';
import { sendToWebhook } from './utils/webhook';
import { generateId } from './utils/helpers';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Settings } from './components/Settings';
import { CustomerManager } from './components/CustomerManager';
import { ToastContainer, ToastData } from './components/Toast';

type View = 'dashboard' | 'add-task' | 'settings' | 'customers';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('crm_tasks', []);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('crm_customers', []);
  const [webhookUrl, setWebhookUrl] = useLocalStorage<string>('webhook_url', '');
  const [darkMode, setDarkMode] = useDarkMode();

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = generateId();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleTaskSubmit = useCallback(async (task: Task) => {
    setIsSubmitting(true);

    setTasks(prev => [task, ...prev]);

    if (webhookUrl) {
      const result = await sendToWebhook(webhookUrl, task);

      if (result.success) {
        addToast('success', 'Task berhasil disimpan dan dikirim ke webhook!');
      } else {
        addToast('error', `Task tersimpan, tapi gagal kirim ke webhook: ${result.error}`);
      }
    } else {
      addToast('success', 'Task berhasil disimpan!');
    }

    setIsSubmitting(false);
    setCurrentView('dashboard');
  }, [webhookUrl, setTasks, addToast]);

  const handleDeleteTask = useCallback((id: string) => {
    if (window.confirm('Yakin ingin menghapus task ini?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
      addToast('success', 'Task berhasil dihapus');
    }
  }, [setTasks, addToast]);

  const handleToggleStatus = useCallback((id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
        : task
    ));
    addToast('success', 'Status task berhasil diubah');
  }, [setTasks, addToast]);

  const handleSaveWebhook = useCallback((url: string) => {
    setWebhookUrl(url);
    addToast('success', 'Webhook URL berhasil disimpan');
  }, [setWebhookUrl, addToast]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div className="flex">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          taskCount={tasks.length}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Dashboard
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Kelola semua task Anda di satu tempat
                  </p>
                </div>
                <TaskList
                  tasks={tasks}
                  onDelete={handleDeleteTask}
                  onToggleStatus={handleToggleStatus}
                />
              </div>
            )}

            {currentView === 'add-task' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Tambah Task Baru
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Isi form di bawah untuk menambahkan task baru
                  </p>
                </div>
                <div className="max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <TaskForm onSubmit={handleTaskSubmit} isLoading={isSubmitting} customers={customers} />
                </div>
              </div>
            )}

            {currentView === 'customers' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Data Customer
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Kelola data customer, input manual atau import bulk dari Excel
                  </p>
                </div>
                <CustomerManager 
                  customers={customers} 
                  setCustomers={setCustomers} 
                  addToast={addToast} 
                />
              </div>
            )}

            {currentView === 'settings' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Settings
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Konfigurasi aplikasi Anda
                  </p>
                </div>
                <Settings webhookUrl={webhookUrl} onSave={handleSaveWebhook} />
              </div>
            )}
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default App;
