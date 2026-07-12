import { useQuery, gql } from '@apollo/client';
import { IconMapper } from '../../lib/icon-mapper';

const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    transactions { id title amount type date category { name } }
    categories { id name }
  }
`;

export function Dashboard() {
  const { data, loading } = useQuery(GET_DASHBOARD_DATA);

  if (loading) return <div className="text-center py-12">Carregando dados financeiros...</div>;

  const transactions = data?.transactions || [];
  
  // Agregações financeiras em tempo real
  const income = transactions.filter((t: any) => t.type === 'INCOME').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const expense = transactions.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const totalBalance = income - expense;

  return (
    <div className="space-y-8">
      {/* Grid de Cards Superiores (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-center text-gray-400 font-semibold text-xs tracking-wider uppercase">
            <span>Saldo Total</span>
            <IconMapper name="wallet.svg" className="text-purple-500" />
          </div>
          <span className="text-3xl font-bold text-gray-800">
            R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-center text-gray-400 font-semibold text-xs tracking-wider uppercase">
            <span>Receitas do Mês</span>
            <IconMapper name="circle-arrow-up.svg" className="text-emerald-500" />
          </div>
          <span className="text-3xl font-bold text-gray-800">
            R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-center text-gray-400 font-semibold text-xs tracking-wider uppercase">
            <span>Despesas do Mês</span>
            <IconMapper name="circle-arrow-down.svg" className="text-red-500" />
          </div>
          <span className="text-3xl font-bold text-gray-800">
            R$ {expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Grid Inferior de Resumos do Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seção de Transações Recentes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-400 font-bold text-xs tracking-wider uppercase mb-4">Transações Recentes</h3>
          <div className="divide-y divide-gray-50">
            {transactions.slice(0, 5).map((t: any) => (
              <div key={t.id} className="py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    <IconMapper name={t.type === 'INCOME' ? 'circle-arrow-up.svg' : 'circle-arrow-down.svg'} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t.title}</h4>
                    <span className="text-xs text-gray-400">{new Date(Number(t.date) || Date.now()).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    {t.category?.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção Lateral de Categorias Comuns */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-400 font-bold text-xs tracking-wider uppercase mb-4">Categorias</h3>
          <div className="space-y-4">
            {data?.categories.slice(0, 5).map((c: any) => (
              <div key={c.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <IconMapper name="tag.svg" size={16} />
                  </div>
                  <span className="font-medium text-gray-700">{c.name}</span>
                </div>
                <span className="text-xs text-gray-400 font-semibold">Ativa</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}