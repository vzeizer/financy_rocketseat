import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { IconMapper } from '../../lib/icon-mapper';
import { NewTransactionModal } from './NewTransactionalModal';
import { ConfirmDeleteModal } from '../../components/ConfirmDeleteModal';

const PERIOD_ALL = 'ALL';

const parseValidDate = (value: unknown): Date | null => {
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? null : date;
};

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

const GET_TRANSACTIONS_PAGE = gql`
  query GetTransactionsPage {
    transactions {
      id
      title
      amount
      type
      date
      category {
        id
        name
        icon
        color
      }
    }
    categories {
      id
      name
      icon
      color
    }
  }
`;

export function Transactions() {
  const { data, loading, refetch } = useQuery(GET_TRANSACTIONS_PAGE);
  const [deleteTransactionMutation] = useMutation(DELETE_TRANSACTION);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Estados dos filtros da barra superior
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [periodFilter, setPeriodFilter] = useState(PERIOD_ALL);

  if (loading) return <div className="text-center py-12 text-neutral-dark">Carregando listagem...</div>;

  const handleDelete = async () => {
    if (!deletingTransaction) return;

    setIsDeleting(true);
    try {
      await deleteTransactionMutation({ variables: { id: deletingTransaction.id } });
      setDeletingTransaction(null);
      refetch();
    } finally {
      setIsDeleting(false);
    }
  };

  const transactions: any[] = data?.transactions || [];
  const categories: any[] = data?.categories || [];

  const periodOptions: string[] = Array.from(
    new Set(
      transactions.map((transaction) => {
        const date = parseValidDate(transaction.date);
        if (!date) return null;
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }).filter(Boolean) as string[]
    )
  ).sort((a, b) => b.localeCompare(a));

  const formatPeriodLabel = (period: string) => {
    const [year, month] = period.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  // Lógica de filtragem em memória para DX fluída
  const filteredTransactions = transactions.filter((t: any) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || t.category?.id === categoryFilter;
    const transactionDate = parseValidDate(t.date);
    const transactionPeriod = transactionDate
      ? `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`
      : null;
    const matchesPeriod = periodFilter === PERIOD_ALL || transactionPeriod === periodFilter;
    return matchesSearch && matchesType && matchesCategory && matchesPeriod;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-darkest">Transações</h1>
          <p className="text-sm text-neutral-medium">Gerencie todas as suas transações financeiras</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-brand-primary hover:bg-brand-dark text-white font-semibold px-5 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
        >
          <IconMapper name="plus.svg" size={18} />
          <span>Nova transação</span>
        </button>
      </div>

      {/* Barra de Filtros (Inputs baseados no Style Guide) */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-light shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Buscar</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-neutral-medium">
              <IconMapper name="search.svg" size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar por descrição"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-neutral-light rounded-xl text-sm placeholder:text-neutral-medium"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Tipo</label>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-neutral-light rounded-xl text-sm bg-white text-neutral-darkest"
          >
            <option value="ALL">Todos</option>
            <option value="INCOME">Entrada</option>
            <option value="EXPENSE">Saída</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Categoria</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-neutral-light rounded-xl text-sm bg-white text-neutral-darkest"
          >
            <option value="ALL">Todas</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Período</label>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-neutral-light rounded-xl text-sm bg-white text-neutral-darkest"
          >
            <option value={PERIOD_ALL}>Todos</option>
            {periodOptions.map((period) => (
              <option key={period} value={period}>
                {formatPeriodLabel(period)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white rounded-2xl border border-neutral-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-light bg-neutral-bg/50 text-xs font-bold text-neutral-dark tracking-wider uppercase">
                <th className="py-4 px-6">Descrição</th>
                <th className="py-4 px-6">Data</th>
                <th className="py-4 px-6">Categoria</th>
                <th className="py-4 px-6">Tipo</th>
                <th className="py-4 px-6 text-right">Valor</th>
                <th className="py-4 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light text-sm text-neutral-darkest">
              {filteredTransactions.map((t: any) => (
                <tr key={t.id} className="hover:bg-neutral-bg/30 transition-colors">
                  <td className="py-4 px-6 font-medium">{t.title}</td>
                  <td className="py-4 px-6 text-neutral-dark">
                    {parseValidDate(t.date)?.toLocaleDateString('pt-BR') || '--'}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${t.category?.color || '#CBD5E1'}1A`,
                        color: t.category?.color || '#334155',
                      }}
                    >
                      <IconMapper name={t.category?.icon || 'tag.svg'} size={12} />
                      {t.category?.name || 'Geral'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {t.type === 'INCOME' ? (
                      <span className="flex items-center gap-1.5 text-feedback-success font-semibold">
                        <IconMapper name="circle-arrow-up.svg" size={16} />
                        Entrada
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-feedback-error font-semibold">
                        <IconMapper name="circle-arrow-down.svg" size={16} />
                        Saída
                      </span>
                    )}
                  </td>
                  <td className={`py-4 px-6 text-right font-bold ${t.type === 'INCOME' ? 'text-feedback-success' : 'text-feedback-error'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditingTransaction(t)}
                        className="p-1.5 text-neutral-medium hover:text-brand-primary border border-transparent hover:border-neutral-light rounded-lg transition-all"
                        title="Editar"
                      >
                        <IconMapper name="square-pen.svg" size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingTransaction({ id: t.id, title: t.title })}
                        className="p-1.5 text-neutral-medium hover:text-feedback-error border border-transparent hover:border-neutral-light rounded-lg transition-all" 
                        title="Excluir"
                      >
                        <IconMapper name="trash.svg" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-medium">
                    Nenhuma transação financeira encontrada para os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação do Componentes Guideline */}
        <div className="bg-white px-6 py-4 border-t border-neutral-light flex items-center justify-between text-xs font-semibold text-neutral-dark">
          <span>1 a {filteredTransactions.length} de {filteredTransactions.length} resultados</span>
          <div className="flex items-center gap-1">
            <button className="p-2 border border-neutral-light rounded-lg hover:bg-neutral-bg disabled:opacity-50" disabled>
              <IconMapper name="chevron-left.svg" size={14} />
            </button>
            <button className="px-3 py-2 bg-brand-primary text-white rounded-lg">1</button>
            <button className="p-2 border border-neutral-light rounded-lg hover:bg-neutral-bg disabled:opacity-50" disabled>
              <IconMapper name="chevron-right.svg" size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Controle de Modal */}
      {isCreateModalOpen && (
        <NewTransactionModal 
          categories={categories} 
          onClose={() => setIsCreateModalOpen(false)} 
          onRefresh={() => refetch()} 
        />
      )}

      {editingTransaction && (
        <NewTransactionModal
          initialData={editingTransaction}
          categories={categories}
          onClose={() => setEditingTransaction(null)}
          onRefresh={() => refetch()} 
        />
      )}

      {deletingTransaction && (
        <ConfirmDeleteModal
          title="Excluir transação"
          description={`Tem certeza que deseja excluir a transação \"${deletingTransaction.title}\"?`}
          onCancel={() => setDeletingTransaction(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}