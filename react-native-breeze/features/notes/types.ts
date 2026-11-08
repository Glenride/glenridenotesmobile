export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  user_id: number;
  category_id: number | null;
  title: string;
  content: string;
  note_date: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  category_id?: number | null;
  note_date?: string;
  is_favorite?: boolean;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  category_id?: number | null;
  note_date?: string;
  is_favorite?: boolean;
}

export interface NotesQueryParams {
  date?: string;
  start_date?: string;
  end_date?: string;
  category_id?: number;
  is_favorite?: boolean;
  search?: string;
}
