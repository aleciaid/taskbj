export interface Task {
  id: string;
  nama: string;
  jabatan: string;
  no_telp: string;
  informasi: string;
  jenis_task: string;
  jenis_task_custom: string | null;
  created_at: string;
  status: 'pending' | 'completed';
}

export type JenisTask = 'Maintenance' | 'Pembelian' | 'Lainnya';
