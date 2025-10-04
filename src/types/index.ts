
export interface KnowledgeEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'certified' | 'training';
  createdAt: string;
  techName: string;
  prodTime: string;
  views: number;
  image?: string;
}

export interface KnowledgeEntryFormData {
  title: string;
  description: string;
  category: string;
  status: 'certified' | 'training';
  techName: string;
  prodTime: string;
  image?: File | null;
}

export interface KnowledgeState {
  entries: KnowledgeEntry[];
  selectedEntry: KnowledgeEntry | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}