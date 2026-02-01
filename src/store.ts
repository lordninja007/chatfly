
import { useState, useEffect } from 'react';
import { AppState, Transaction, Goal, Book, Study, UserProfile, AppSettings } from './types';

const INITIAL_STATE: AppState = {
  transactions: [],
  goals: [],
  books: [],
  studies: [],
  profile: {
    name: 'Usuário',
    bio: 'Minha jornada pessoal e financeira.',
    avatar: null,
  },
  settings: {
    primaryColor: '#3b82f6',
    darkMode: false,
    geminiModel: 'gemini-3-flash-preview',
  }
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('minha_vida_app_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('minha_vida_app_state', JSON.stringify(state));
  }, [state]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT = { ...t, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, transactions: [newT, ...prev.transactions] }));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTransaction = (id: string) => {
    setState(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
  };

  const toggleTransactionPaid = (id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => {
        if (t.id === id) {
          const nowPaid = !t.isPaid;
          return { 
            ...t, 
            isPaid: nowPaid,
            date: nowPaid ? new Date().toISOString().split('T')[0] : t.date
          };
        }
        return t;
      })
    }));
  };

  const addGoal = (g: Omit<Goal, 'id'>) => {
    const newG = { ...g, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, goals: [...prev.goals, newG] }));
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g)
    }));
  };

  const deleteGoal = (id: string) => {
    setState(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id === id) {
          const newCurrent = amount;
          const isCompleted = g.targetAmount ? newCurrent >= g.targetAmount : g.isCompleted;
          return { ...g, currentAmount: newCurrent, isCompleted };
        }
        return g;
      })
    }));
  };

  const addBook = (b: Omit<Book, 'id'>) => {
    const newB = { ...b, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, books: [...prev.books, newB] }));
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setState(prev => ({
      ...prev,
      books: prev.books.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const deleteBook = (id: string) => {
    setState(prev => ({ ...prev, books: prev.books.filter(b => b.id !== id) }));
  };

  const updateBookProgress = (id: string, pages: number) => {
    setState(prev => ({
      ...prev,
      books: prev.books.map(b => {
        if (b.id === id) {
          const status = pages >= b.totalPages ? 'Lido' : pages > 0 ? 'Lendo' : 'Quero ler';
          return { ...b, readPages: pages, status };
        }
        return b;
      })
    }));
  };

  const addStudy = (s: Omit<Study, 'id'>) => {
    const newS = { ...s, id: crypto.randomUUID(), lastStudyDate: new Date().toISOString() };
    setState(prev => ({ ...prev, studies: [newS, ...(prev.studies || [])] }));
  };

  const updateStudy = (id: string, updates: Partial<Study>) => {
    setState(prev => ({
      ...prev,
      studies: (prev.studies || []).map(s => s.id === id ? { ...s, ...updates, lastStudyDate: new Date().toISOString() } : s)
    }));
  };

  const deleteStudy = (id: string) => {
    setState(prev => ({ ...prev, studies: (prev.studies || []).filter(s => s.id !== id) }));
  };

  const updateProfile = (p: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, ...p } }));
  };

  const updateSettings = (s: Partial<AppSettings>) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...s } }));
  };

  const totals = {
    income: state.transactions.filter(t => t.type === 'Receita').reduce((acc, t) => acc + t.amount, 0),
    expenses: state.transactions.filter(t => t.type === 'Despesa').reduce((acc, t) => acc + t.amount, 0),
    received: state.transactions.filter(t => t.type === 'Receita' && t.isPaid).reduce((acc, t) => acc + t.amount, 0),
    paid: state.transactions.filter(t => t.type === 'Despesa' && t.isPaid).reduce((acc, t) => acc + t.amount, 0),
  };

  const balance = totals.received - totals.paid;

  return {
    state,
    balance,
    totals,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    toggleTransactionPaid,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    addBook,
    updateBook,
    deleteBook,
    updateBookProgress,
    addStudy,
    updateStudy,
    deleteStudy,
    updateProfile,
    updateSettings,
  };
};
