import React, { useState } from 'react';
import { Customer } from '../types/customer';
import { generateId } from '../utils/helpers';
import * as XLSX from 'xlsx';
import { Download, Upload, Plus, Trash2, Users } from 'lucide-react';

interface CustomerManagerProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  addToast: (type: 'success' | 'error', message: string) => void;
}

export function CustomerManager({ customers, setCustomers, addToast }: CustomerManagerProps) {
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [noTelp, setNoTelp] = useState('');

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !noTelp) {
      addToast('error', 'Nama dan No Telepon wajib diisi!');
      return;
    }
    const newCustomer: Customer = {
      id: generateId(),
      nama,
      jabatan,
      no_telp: noTelp,
      created_at: new Date().toISOString()
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setNama('');
    setJabatan('');
    setNoTelp('');
    addToast('success', 'Customer berhasil ditambahkan!');
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { nama: 'Budi Santoso', jabatan: 'Manager', no_telp: '081234567890' },
      { nama: 'Andi Setiawan', jabatan: 'Staff', no_telp: '081987654321' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_Customer");
    XLSX.writeFile(wb, "Template_Bulk_Customer.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const newCustomers: Customer[] = data
          .filter(row => row.nama && row.no_telp)
          .map(row => ({
            id: generateId(),
            nama: String(row.nama),
            jabatan: row.jabatan ? String(row.jabatan) : '',
            no_telp: String(row.no_telp),
            created_at: new Date().toISOString()
          }));

        if (newCustomers.length > 0) {
          setCustomers(prev => [...newCustomers, ...prev]);
          addToast('success', `${newCustomers.length} Customer berhasil diimport!`);
        } else {
          addToast('error', 'Tidak ada data valid yang ditemukan dalam file.');
        }
      } catch (err) {
        addToast('error', 'Gagal memproses file Excel.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // Reset input
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus customer ini?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      addToast('success', 'Customer dihapus.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Form and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users size={20} /> Tambah Customer
          </h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors flex-1 md:flex-none text-sm font-medium"
            >
              <Download size={16} /> Template
            </button>
            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-lg transition-colors cursor-pointer flex-1 md:flex-none text-sm font-medium border border-green-200 dark:border-green-800">
              <Upload size={16} /> Bulk Import
              <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        <form onSubmit={handleAddSingle} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={e => setNama(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Contoh: Budi"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jabatan</label>
            <input
              type="text"
              value={jabatan}
              onChange={e => setJabatan(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Contoh: Manager"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Telp</label>
            <input
              type="text"
              value={noTelp}
              onChange={e => setNoTelp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Contoh: 0812..."
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium h-[42px]"
          >
            <Plus size={16} /> Tambah
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 font-medium">Nama</th>
                <th className="px-6 py-3 font-medium">Jabatan</th>
                <th className="px-6 py-3 font-medium">No. Telp</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data customer
                  </td>
                </tr>
              ) : (
                customers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{customer.nama}</td>
                    <td className="px-6 py-3">{customer.jabatan || '-'}</td>
                    <td className="px-6 py-3">{customer.no_telp}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
