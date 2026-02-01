
export type TransactionType = 'Receita' | 'Despesa';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  date: string;
  dueDate?: string;
  isPaid: boolean;
}

export type GoalCategory = 'Financeira' | 'Saúde' | 'Carreira' | 'Pessoal';

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetAmount?: number;
  currentAmount: number;
  isCompleted: boolean;
  coverImage?: string | null;
  coverPosition?: number;
}

export type BookStatus = 'Lendo' | 'Lido' | 'Quero ler';

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  readPages: number;
  status: BookStatus;
  coverImage?: string | null;
  coverPosition?: number;
  sourceUrl?: string;
}

export type StudyType = 'Curso' | 'Podcast' | 'Vídeo' | 'Livro Técnico';
export type StudyStatus = 'Quero assistir' | 'Assistindo' | 'Já assisti' | 'Fazendo' | 'Concluído';

export interface Study {
  id: string;
  title: string;
  courseName?: string; // Also used for Podcast Name or Channel
  type: StudyType;
  progressType: 'Páginas' | 'Horas';
  target: number;
  current: number;
  status: StudyStatus;
  coverImage?: string | null;
  lastStudyDate?: string;
  sourceUrl?: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  avatar: string | null;
}

export interface AppSettings {
  primaryColor: string;
  darkMode: boolean;
  geminiModel: string;
}

export interface AppState {
  transactions: Transaction[];
  goals: Goal[];
  books: Book[];
  studies: Study[];
  profile: UserProfile;
  settings: AppSettings;
}
