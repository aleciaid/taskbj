import { useState, useEffect } from 'react';
import { Save, Webhook, AlertCircle, CheckCircle, DatabaseBackup, Upload, Download } from 'lucide-react';

interface SettingsProps {
  webhookUrl: string;
  onSave: (url: string) => void;
}

export function Settings({ webhookUrl, onSave }: SettingsProps) {
  const [url, setUrl] = useState(webhookUrl);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setUrl(webhookUrl);
  }, [webhookUrl]);

  const handleSave = () => {
    onSave(url);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExport = () => {
    const data = {
      crm_tasks: JSON.parse(localStorage.getItem('crm_tasks') || '[]'),
      crm_customers: JSON.parse(localStorage.getItem('crm_customers') || '[]'),
      webhook_url: JSON.parse(localStorage.getItem('webhook_url') || '""')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `crm_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const str = evt.target?.result as string;
        const importedData = JSON.parse(str);
        if (importedData.crm_tasks !== undefined) localStorage.setItem('crm_tasks', JSON.stringify(importedData.crm_tasks));
        if (importedData.crm_customers !== undefined) localStorage.setItem('crm_customers', JSON.stringify(importedData.crm_customers));
        if (importedData.webhook_url !== undefined) localStorage.setItem('webhook_url', JSON.stringify(importedData.webhook_url));
        alert('Import data berhasil! Halaman akan dimuat ulang untuk memuat data baru.');
        window.location.reload();
      } catch (err) {
        alert('Gagal mengimport data. File tidak valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Webhook className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Konfigurasi Webhook
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Data akan dikirim ke URL ini setelah task disimpan
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              id="webhook-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/webhook"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Format Payload:</p>
                <pre className="text-xs bg-white dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
{`{
  "id": "string",
  "nama": "string",
  "jabatan": "string",
  "no_telp": "string",
  "informasi": "string",
  "jenis_task": "string",
  "jenis_task_custom": "string | null",
  "created_at": "ISO date string",
  "status": "pending"
}`}
                </pre>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {isSaved ? (
              <>
                <CheckCircle size={20} />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Simpan Konfigurasi</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <DatabaseBackup className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Backup & Restore Data
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export atau import semua data Anda (Task, Customer, Settings) dalam format JSON
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
          >
            <Download size={20} />
            <span>Export Data (JSON)</span>
          </button>

          <label className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 cursor-pointer">
            <Upload size={20} />
            <span>Import Data (JSON)</span>
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </div>
    </div>
  );
}
