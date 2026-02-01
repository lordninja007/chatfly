
export const PRIMARY_COLORS = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Esmeralda', value: '#10b981' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Âmbar', value: '#f59e0b' },
];

export const TRANSACTION_CATEGORIES = [
  'Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Compras', 'Outros'
];

export const INCOME_CATEGORIES = [
  'Salário', 'Freelancer', 'Investimento', 'Venda', 'Presente', 'Outros'
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Alimentação': '#f97316', // Orange
  'Moradia': '#6366f1',    // Indigo
  'Transporte': '#06b6d4', // Cyan
  'Lazer': '#ec4899',      // Pink
  'Saúde': '#ef4444',      // Red
  'Educação': '#8b5cf6',   // Purple
  'Compras': '#f43f5e',    // Rose
  'Salário': '#10b981',    // Emerald
  'Freelancer': '#14b8a6', // Teal
  'Investimento': '#3b82f6',// Blue
  'Venda': '#fbbf24',      // Amber
  'Presente': '#d946ef',   // Fuchsia
  'Outros': '#94a3b8'      // Slate
};

export const GOAL_CATEGORIES = [
  'Financeira', 'Saúde', 'Carreira', 'Pessoal'
];

export const GEMINI_MODELS = [
  { label: 'Gemini 3 Flash (Rápido)', value: 'gemini-3-flash-preview' },
  { label: 'Gemini 3 Pro (Complexo)', value: 'gemini-3-pro-preview' },
];
