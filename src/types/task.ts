export interface TaskNote {
  id: string;
  text: string;
  created_at: string;
}

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
  completed_at?: string;
  notes?: TaskNote[];
}

export type JenisTask = 'Maintenance' | 'Pembelian' | 'Lainnya';
