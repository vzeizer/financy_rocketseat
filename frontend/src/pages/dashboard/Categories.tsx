import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { IconMapper } from '../../lib/icon-mapper';
import { NewCategoryModal } from './NewCategoryModal';

const GET_CATEGORIES_PAGE = gql`
  query GetCategoriesPage {
    categories {
      id
      name
    }
    transactions {
      id
      type
      category {
        id
      }
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export function Categories() {
  const { data, loading, refetch } = useQuery(GET_CATEGORIES_PAGE);
  const [deleteCategoryMutation] = useMutation(DELETE_CATEGORY);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <div className="text-center py-12 text-neutral-dark">Carregando categorias...</div>;

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      await deleteCategoryMutation({ variables: { id } });
      refetch();
    }
  };

  const categories = data?.categories || [];
  const transactions = data?.transactions || [];

  // Lógica para calcular a volumetria de cada categoria para os KPIs
  const getCategoryStats = (catId: string) => {
    const catTransactions = transactions.filter((t: any) => t.category?.id === catId);
    return {
      count: catTransactions.length,
      // Aqui poderíamos somar o valor se o Figma exigisse o subtotal no card
    };
  };

  return (
    <div className="space-y-6">
      {/* Header da Seção */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-darkest">Categorias</h1>
          <p className="text-sm text-neutral-medium">Organize suas transações por categorias</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-primary hover:bg-brand-dark text-white font-semibold px-5 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
        >
          <IconMapper name="plus.svg" size={18} />
          <span>Nova categoria</span>
        </button>
      </div>

      {/* Indicadores Superiores (KPIs da Página de Categorias) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-light shadow-sm flex items-center gap-4">
          <div className="p-3 bg-neutral-bg rounded-xl text-neutral-dark">
            <IconMapper name="tag.svg" />
          </div>
          <div>
            <span className="text-2xl font-bold text-neutral-darkest">{categories.length}</span>
            <p className="text-xs font-bold text-neutral-medium uppercase tracking-wider">Total de Categorias</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-light shadow-sm flex items-center gap-4">
          <div className="p-3 bg-neutral-bg rounded-xl text-neutral-dark">
            <IconMapper name="arrow-up-down.svg" />
          </div>
          <div>
            <span className="text-2xl font-bold text-neutral-darkest">{transactions.length}</span>
            <p className="text-xs font-bold text-neutral-medium uppercase tracking-wider">Total de Transações</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-light shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand-light rounded-xl text-brand-primary">
            <IconMapper name="utensils.svg" />
          </div>
          <div>
            <span className="text-2xl font-bold text-neutral-darkest">Alimentação</span>
            <p className="text-xs font-bold text-neutral-medium uppercase tracking-wider">Categoria Mais Utilizada</p>
          </div>
        </div>
      </div>

      {/* Grid de Cards de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((c: any) => {
          const stats = getCategoryStats(c.id);
          return (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-neutral-light shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow relative group">
              {/* Botões de Ação Flutuantes */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 text-neutral-medium hover:text-brand-primary rounded-md">
                  <IconMapper name="square-pen.svg" size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(c.id)}
                  className="p-1 text-neutral-medium hover:text-feedback-error rounded-md"
                >
                  <IconMapper name="trash.svg" size={14} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <IconMapper name="tag.svg" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-darkest text-base">{c.name}</h3>
                  <p className="text-xs text-neutral-medium line-clamp-2 mt-0.5">Definição personalizada para controle de gastos.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-bg flex justify-between items-center text-xs font-semibold">
                <span className="text-neutral-dark">{stats.count} itens vinculados</span>
                <span className="px-2.5 py-0.5 bg-neutral-bg text-neutral-dark rounded-full">Ativo</span>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <NewCategoryModal 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={() => refetch()} 
        />
      )}
    </div>
  );
}