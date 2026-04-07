import { LayoutDashboard, Plus, Settings as SettingsIcon, X, Users } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'add-task' | 'settings' | 'customers';
  onNavigate: (view: 'dashboard' | 'add-task' | 'settings' | 'customers') => void;
  isOpen: boolean;
  onClose: () => void;
  taskCount: number;
}

export function Sidebar({ currentView, onNavigate, isOpen, onClose, taskCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, badge: taskCount },
    { id: 'customers' as const, label: 'Data Customer', icon: Users },
    { id: 'add-task' as const, label: 'Tambah Task', icon: Plus },
    { id: 'settings' as const, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 lg:hidden">
            <h2 className="font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 pt-4">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium'
                    }
                  `}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <Icon size={16} />
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-400 dark:text-gray-500 space-y-0.5">
              <p className="font-medium">v1.0.0</p>
              <p>Data tersimpan di browser</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
