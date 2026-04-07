import { useState, FormEvent, useEffect } from 'react';
import { Task, JenisTask } from '../types/task';
import { validatePhoneNumber } from '../utils/helpers';
import { AlertCircle, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface EditTaskModalProps {
  task: Task;
  onSave: (updated: Task) => void;
  onClose: () => void;
}

interface FormErrors {
  nama?: string;
  jabatan?: string;
  no_telp?: string;
  informasi?: string;
  jenis_task?: string;
  jenis_task_custom?: string;
}

export function EditTaskModal({ task, onSave, onClose }: EditTaskModalProps) {
  const [formData, setFormData] = useState({
    nama: task.nama,
    jabatan: task.jabatan,
    no_telp: task.no_telp,
    informasi: task.informasi,
    jenis_task: task.jenis_task,
    jenis_task_custom: task.jenis_task_custom || ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama harus diisi';
    if (!formData.jabatan.trim()) newErrors.jabatan = 'Jabatan harus diisi';
    if (!formData.no_telp.trim()) newErrors.no_telp = 'No Telp harus diisi';
    else if (!validatePhoneNumber(formData.no_telp)) newErrors.no_telp = 'No Telp harus berupa angka';
    if (!formData.informasi.replace(/<[^>]*>/g, '').trim()) newErrors.informasi = 'Informasi harus diisi';
    if (!formData.jenis_task) newErrors.jenis_task = 'Jenis Task harus dipilih';
    if (formData.jenis_task === 'Lainnya' && !formData.jenis_task_custom.trim()) newErrors.jenis_task_custom = 'Wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    if (!validate()) return;
    onSave({
      ...task,
      nama: formData.nama.trim(),
      jabatan: formData.jabatan.trim(),
      no_telp: formData.no_telp.trim(),
      informasi: formData.informasi,
      jenis_task: formData.jenis_task as JenisTask,
      jenis_task_custom: formData.jenis_task === 'Lainnya' ? formData.jenis_task_custom.trim() : null,
    });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) setTimeout(validate, 0);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate();
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Task</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{task.nama}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama</label>
            <input
              type="text"
              value={formData.nama}
              onChange={e => handleChange('nama', e.target.value)}
              onBlur={() => handleBlur('nama')}
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white outline-none transition"
            />
            {touched.nama && errors.nama && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/>{errors.nama}</p>}
          </div>

          {/* Jabatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Jabatan</label>
            <input
              type="text"
              value={formData.jabatan}
              onChange={e => handleChange('jabatan', e.target.value)}
              onBlur={() => handleBlur('jabatan')}
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white outline-none transition"
            />
            {touched.jabatan && errors.jabatan && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/>{errors.jabatan}</p>}
          </div>

          {/* No Telp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">No Telp</label>
            <input
              type="tel"
              value={formData.no_telp}
              onChange={e => handleChange('no_telp', e.target.value)}
              onBlur={() => handleBlur('no_telp')}
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white outline-none transition"
            />
            {touched.no_telp && errors.no_telp && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/>{errors.no_telp}</p>}
          </div>

          {/* Jenis Task */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Jenis Task</label>
            <select
              value={formData.jenis_task}
              onChange={e => handleChange('jenis_task', e.target.value)}
              onBlur={() => handleBlur('jenis_task')}
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white outline-none transition"
            >
              <option value="">Pilih Jenis Task</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Pembelian">Pembelian</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {touched.jenis_task && errors.jenis_task && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/>{errors.jenis_task}</p>}
          </div>

          {formData.jenis_task === 'Lainnya' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Jenis Task Lainnya</label>
              <input
                type="text"
                value={formData.jenis_task_custom}
                onChange={e => handleChange('jenis_task_custom', e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white outline-none transition"
                placeholder="Masukkan jenis task"
              />
              {touched.jenis_task_custom && errors.jenis_task_custom && <p className="mt-1 text-xs text-red-500">{errors.jenis_task_custom}</p>}
            </div>
          )}

          {/* Informasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Informasi</label>
            <div className="quill-wrapper rounded-xl border border-gray-300 dark:border-gray-600 overflow-hidden">
              <ReactQuill
                theme="snow"
                value={formData.informasi}
                onChange={v => handleChange('informasi', v)}
                modules={quillModules}
                placeholder="Tulis informasi detail..."
              />
            </div>
            {touched.informasi && errors.informasi && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/>{errors.informasi}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
