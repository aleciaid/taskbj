import { useState, FormEvent } from 'react';
import { Task, JenisTask } from '../types/task';
import { generateId, validatePhoneNumber } from '../utils/helpers';
import { AlertCircle, Users } from 'lucide-react';
import { Customer } from '../types/customer';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  isLoading?: boolean;
  customers?: Customer[];
}

interface FormErrors {
  nama?: string;
  jabatan?: string;
  no_telp?: string;
  informasi?: string;
  jenis_task?: string;
  jenis_task_custom?: string;
}

export function TaskForm({ onSubmit, isLoading = false, customers = [] }: TaskFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [isManualInput, setIsManualInput] = useState(true);

  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    no_telp: '',
    informasi: '',
    jenis_task: '',
    jenis_task_custom: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama harus diisi';
    }

    if (!formData.jabatan.trim()) {
      newErrors.jabatan = 'Jabatan harus diisi';
    }

    if (!formData.no_telp.trim()) {
      newErrors.no_telp = 'No Telp harus diisi';
    } else if (!validatePhoneNumber(formData.no_telp)) {
      newErrors.no_telp = 'No Telp harus berupa angka';
    }

    if (!formData.informasi.trim()) {
      newErrors.informasi = 'Informasi harus diisi';
    }

    if (!formData.jenis_task) {
      newErrors.jenis_task = 'Jenis Task harus dipilih';
    }

    if (formData.jenis_task === 'Lainnya' && !formData.jenis_task_custom.trim()) {
      newErrors.jenis_task_custom = 'Jenis Task Lainnya harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);

    if (!customerId || customerId === '__manual__') {
      setIsManualInput(true);
      setFormData(prev => ({ ...prev, nama: '', jabatan: '', no_telp: '' }));
      return;
    }

    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setIsManualInput(false);
      setFormData(prev => ({
        ...prev,
        nama: customer.nama,
        jabatan: customer.jabatan,
        no_telp: customer.no_telp
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);

    if (!validate()) {
      return;
    }

    const task: Task = {
      id: generateId(),
      nama: formData.nama.trim(),
      jabatan: formData.jabatan.trim(),
      no_telp: formData.no_telp.trim(),
      informasi: formData.informasi.trim(),
      jenis_task: formData.jenis_task as JenisTask,
      jenis_task_custom: formData.jenis_task === 'Lainnya' ? formData.jenis_task_custom.trim() : null,
      created_at: new Date().toISOString(),
      status: 'pending'
    };

    onSubmit(task);

    setFormData({
      nama: '',
      jabatan: '',
      no_telp: '',
      informasi: '',
      jenis_task: '',
      jenis_task_custom: ''
    });
    setSelectedCustomerId('');
    setIsManualInput(customers.length === 0);
    setTouched({});
    setErrors({});
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setTimeout(validate, 0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Selector */}
      <div>
        <label htmlFor="customer_select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <span className="flex items-center gap-1.5"><Users size={14} /> Pilih Customer</span>
        </label>
        <select
          id="customer_select"
          value={selectedCustomerId}
          onChange={(e) => handleCustomerSelect(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          disabled={isLoading}
        >
          <option value="">-- Pilih Customer --</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.nama} — {c.jabatan || '-'} — {c.no_telp}</option>
          ))}
          <option value="__manual__">✏️ Input Manual</option>
        </select>
        {selectedCustomerId && !isManualInput && (
          <p className="mt-1.5 text-xs text-green-600 dark:text-green-400">
            ✅ Data customer otomatis terisi di bawah
          </p>
        )}
        {customers.length === 0 && (
          <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
            ⚠️ Belum ada data customer. Silakan tambahkan di menu "Data Customer" atau pilih "Input Manual".
          </p>
        )}
      </div>

      <div>
        <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nama
        </label>
        <input
          type="text"
          id="nama"
          value={formData.nama}
          onChange={(e) => handleChange('nama', e.target.value)}
          onBlur={() => handleBlur('nama')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          disabled={isLoading || (!isManualInput && !!selectedCustomerId)}
          readOnly={!isManualInput && !!selectedCustomerId}
        />
        {touched.nama && errors.nama && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.nama}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Jabatan
        </label>
        <input
          type="text"
          id="jabatan"
          value={formData.jabatan}
          onChange={(e) => handleChange('jabatan', e.target.value)}
          onBlur={() => handleBlur('jabatan')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          disabled={isLoading || (!isManualInput && !!selectedCustomerId)}
          readOnly={!isManualInput && !!selectedCustomerId}
        />
        {touched.jabatan && errors.jabatan && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.jabatan}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="no_telp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          No Telp
        </label>
        <input
          type="tel"
          id="no_telp"
          value={formData.no_telp}
          onChange={(e) => handleChange('no_telp', e.target.value)}
          onBlur={() => handleBlur('no_telp')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          disabled={isLoading || (!isManualInput && !!selectedCustomerId)}
          readOnly={!isManualInput && !!selectedCustomerId}
        />
        {touched.no_telp && errors.no_telp && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.no_telp}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="jenis_task" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Jenis Task
        </label>
        <select
          id="jenis_task"
          value={formData.jenis_task}
          onChange={(e) => handleChange('jenis_task', e.target.value)}
          onBlur={() => handleBlur('jenis_task')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          disabled={isLoading}
        >
          <option value="">Pilih Jenis Task</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Pembelian">Pembelian</option>
          <option value="Lainnya">Lainnya</option>
        </select>
        {touched.jenis_task && errors.jenis_task && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.jenis_task}
          </p>
        )}
      </div>

      {formData.jenis_task === 'Lainnya' && (
        <div className="animate-in slide-in-from-top-2">
          <label htmlFor="jenis_task_custom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Jenis Task Lainnya
          </label>
          <input
            type="text"
            id="jenis_task_custom"
            value={formData.jenis_task_custom}
            onChange={(e) => handleChange('jenis_task_custom', e.target.value)}
            onBlur={() => handleBlur('jenis_task_custom')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="Masukkan jenis task"
            disabled={isLoading}
          />
          {touched.jenis_task_custom && errors.jenis_task_custom && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.jenis_task_custom}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Informasi
        </label>
        <div className="quill-wrapper rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <ReactQuill
            theme="snow"
            value={formData.informasi}
            onChange={(value) => handleChange('informasi', value)}
            onBlur={() => handleBlur('informasi')}
            readOnly={isLoading}
            modules={{
              toolbar: [
                [{ 'undo': '' }, { 'redo': '' }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'font': [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean']
              ]
            }}
            formats={[
              'header', 'font',
              'bold', 'italic', 'underline', 'strike',
              'color', 'background',
              'align',
              'list', 'indent',
              'blockquote', 'code-block',
              'link', 'image'
            ]}
            placeholder="Tulis informasi detail di sini..."
          />
        </div>
        {touched.informasi && errors.informasi && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.informasi}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Menyimpan...' : 'Simpan Task'}
      </button>
    </form>
  );
}
