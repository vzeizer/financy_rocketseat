import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboards';
import { Transactions } from './pages/dashboard/Transactions';
import { Categories } from './pages/dashboard/Categories';
import { IconMapper } from './lib/icon-mapper';

export default function App() {
  const { signed, user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'transactions' | 'categories'>('dashboard');
  const [showRegister, setShowRegister] = useState(false);
  const [hideSensitiveData, setHideSensitiveData] = useState(false);

  if (!signed) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Global extraído do Figma */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl tracking-tight justify-center lg:justify-start">
            <IconMapper name="wallet.svg" className="text-emerald-500" />
            <span>FINANCY</span>
          </div>
          <nav className="flex-1 flex justify-start lg:justify-center gap-2 sm:gap-4 lg:gap-6 font-medium text-gray-500 overflow-x-auto pb-1 lg:pb-0">
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className={`hover:text-emerald-600 transition-colors inline-flex items-center justify-center gap-1.5 min-w-[112px] sm:min-w-[128px] px-2 py-1 whitespace-nowrap ${currentTab === 'dashboard' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''}`}
            >
              <IconMapper name="house.svg" size={15} />
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentTab('transactions')}
              className={`hover:text-emerald-600 transition-colors inline-flex items-center justify-center gap-1.5 min-w-[112px] sm:min-w-[128px] px-2 py-1 whitespace-nowrap ${currentTab === 'transactions' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''}`}
            >
              <IconMapper name="receipt-text.svg" size={15} />
              Transações
            </button>
            <button 
              onClick={() => setCurrentTab('categories')}
              className={`hover:text-emerald-600 transition-colors inline-flex items-center justify-center gap-1.5 min-w-[112px] sm:min-w-[128px] px-2 py-1 whitespace-nowrap ${currentTab === 'categories' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''}`}
            >
              <IconMapper name="tag.svg" size={15} />
              Categorias
            </button>
          </nav>
        </div>
        
        {/* Avatar do Usuário */}
        <div className="flex items-center justify-end gap-3 w-full lg:w-auto">
          <button
            onClick={() => setHideSensitiveData((prev) => !prev)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title={hideSensitiveData ? 'Mostrar dados' : 'Ocultar dados'}
          >
            <IconMapper name={hideSensitiveData ? 'eye.svg' : 'eye-closed.svg'} size={18} />
          </button>
          <div className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center border border-gray-300 cursor-pointer" title={user?.email}>
            <IconMapper name="user-round.svg" size={18} className={hideSensitiveData ? 'opacity-60' : ''} />
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
            <IconMapper name="log-out.svg" size={18} />
          </button>
        </div>
      </header>

      {/* Conteúdo Dinâmico Baseado nas Abas */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {currentTab === 'dashboard' && <Dashboard hideSensitiveData={hideSensitiveData} />}
        {currentTab === 'transactions' && <Transactions hideSensitiveData={hideSensitiveData} />}
        {currentTab === 'categories' && <Categories />}
      </main>
    </div>
  );
}