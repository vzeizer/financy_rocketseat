import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Transactions } from './pages/dashboard/Transactions';
import { Categories } from './pages/dashboard/Categories';
import { IconMapper } from './lib/icon-mapper';

export default function App() {
  const { signed, user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'transactions' | 'categories'>('dashboard');

  if (!signed) return <Login />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Global extraído do Figma */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl tracking-tight">
            <IconMapper name="wallet.svg" className="text-emerald-500" />
            <span>FINANCY</span>
          </div>
          <nav className="flex gap-6 font-medium text-gray-500">
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className={`hover:text-emerald-600 transition-colors ${currentTab === 'dashboard' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentTab('transactions')}
              className={`hover:text-emerald-600 transition-colors ${currentTab === 'transactions' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''}`}
            >
              Transações
            </button>
            <button 
              onClick={() => setCurrentTab('categories')}
              className={`hover:text-emerald-600 transition-colors ${currentTab === 'categories' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''}`}
            >
              Categorias
            </button>
          </nav>
        </div>
        
        {/* Avatar do Usuário */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 text-gray-700 font-bold rounded-full flex items-center justify-center border border-gray-300 uppercase cursor-pointer" title={user?.email}>
            {user?.name.substring(0, 2)}
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
            <IconMapper name="log-out.svg" size={18} />
          </button>
        </div>
      </header>

      {/* Conteúdo Dinâmico Baseado nas Abas */}
      <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'transactions' && <Transactions />}
        {currentTab === 'categories' && <Categories />}
      </main>
    </div>
  );
}