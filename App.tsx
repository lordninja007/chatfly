
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FinanceModule from './components/FinanceModule';
import GoalsModule from './components/GoalsModule';
import BooksModule from './components/BooksModule';
import StudyModule from './components/StudyModule';
import SettingsModule from './components/SettingsModule';
import AIControls from './components/AIControls';
import { useAppState } from './store';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {
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
  } = useAppState();

  const handleAIConfirm = (type: string, data: any) => {
    // Agora o sistema de IA foca 100% em transações conforme solicitado
    if (type === 'transaction' || data.amount !== undefined) {
      addTransaction({
        type: data.type || 'Despesa',
        description: data.description || 'Lançamento IA',
        amount: data.amount || 0,
        category: data.category || 'Outros',
        date: data.date || new Date().toISOString().split('T')[0],
        dueDate: data.dueDate || '',
        isPaid: data.isPaid ?? true
      });
      setActiveTab('finance');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            balance={balance}
            totals={totals}
            goals={state.goals}
            books={state.books}
            studies={state.studies}
            transactions={state.transactions}
            primaryColor={state.settings.primaryColor}
            darkMode={state.settings.darkMode}
            onNavigate={setActiveTab}
          />
        );
      case 'finance':
        return (
          <FinanceModule
            transactions={state.transactions}
            onAdd={addTransaction}
            onUpdate={updateTransaction}
            onDelete={deleteTransaction}
            onTogglePaid={toggleTransactionPaid}
            primaryColor={state.settings.primaryColor}
            darkMode={state.settings.darkMode}
          />
        );
      case 'goals':
        return (
          <GoalsModule
            goals={state.goals}
            onAdd={addGoal}
            onUpdate={updateGoal}
            onDelete={deleteGoal}
            onUpdateProgress={updateGoalProgress}
            primaryColor={state.settings.primaryColor}
            darkMode={state.settings.darkMode}
          />
        );
      case 'books':
        return (
          <BooksModule
            books={state.books}
            onAdd={addBook}
            onUpdate={updateBook}
            onDelete={deleteBook}
            onUpdateProgress={updateBookProgress}
            primaryColor={state.settings.primaryColor}
            darkMode={state.settings.darkMode}
          />
        );
      case 'study':
        return (
          <StudyModule
            studies={state.studies}
            onAdd={addStudy}
            onUpdate={updateStudy}
            onDelete={deleteStudy}
            primaryColor={state.settings.primaryColor}
            darkMode={state.settings.darkMode}
          />
        );
      case 'settings':
        return (
          <SettingsModule
            profile={state.profile}
            settings={state.settings}
            onUpdateProfile={updateProfile}
            onUpdateSettings={updateSettings}
            primaryColor={state.settings.primaryColor}
            darkMode={state.settings.darkMode}
          />
        );
      default:
        return <Dashboard {...state} balance={balance} totals={totals} primaryColor={state.settings.primaryColor} darkMode={state.settings.darkMode} onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      primaryColor={state.settings.primaryColor}
      darkMode={state.settings.darkMode}
      profile={state.profile}
    >
      {renderContent()}
      <AIControls
        onConfirm={handleAIConfirm}
        primaryColor={state.settings.primaryColor}
        darkMode={state.settings.darkMode}
        geminiModel={state.settings.geminiModel}
      />
    </Layout>
  );
};

export default App;
