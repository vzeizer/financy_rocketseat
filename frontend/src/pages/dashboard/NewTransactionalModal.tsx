import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation, gql } from '@apollo/client';

const transactionSchema = zod.object({
  title: zod.string().min(1, 'A descrição é obrigatória.'),
  amount: zod.number().positive('Insira um valor válido.'),
  type: zod.enum(['INCOME', 'EXPENSE']),
  categoryId: zod.string().min(1, 'Selecione uma categoria.'),
});

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($title: String!, $amount: Float!, $type: String!, $categoryId: String!) {
    createTransaction(title: $title, amount: $amount, type: $type, categoryId: $categoryId) { id }
  }
`;

export function NewTransactionModal({ categories, onClose, onRefresh }: any) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'EXPENSE', title: '', amount: 0, categoryId: '' }
  });

  const selectedType = watch('type');
  const [createTransaction] = useMutation(CREATE_TRANSACTION);

  const onSubmit = async (data: any) => {
    await createTransaction({ variables: data });
    onRefresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-xl space-y-6 relative border border-gray-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
        
        <div>
          <h2 className="text-xl font-bold text-gray-800">Nova transação</h2>
          <p className="text-sm text-gray-400">Registre sua despesa ou receita</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Seletor Tipo de Transação */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue('type', 'EXPENSE')}
              className={`py-3 rounded-xl font-semibold border flex justify-center items-center gap-2 transition-all ${selectedType === 'EXPENSE' ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'INCOME')}
              className={`py-3 rounded-xl font-semibold border flex justify-center items-center gap-2 transition-all ${selectedType === 'INCOME' ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              Receita
            </button>
          </div>

          {/* Input Descrição */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</label>
            <input {...register('title')} type="text" placeholder="Ex: Almoço no restaurante" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500" />
            {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
          </div>

          {/* Input Valor */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</label>
            <input {...register('amount', { valueAsNumber: true })} type="number" step="0.01" placeholder="R$ 0,00" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500" />
            {errors.amount && <span className="text-xs text-red-500">{errors.amount.message}</span>}
          </div>

          {/* Select de Categorias */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</label>
            <select {...register('categoryId')} className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-emerald-500">
              <option value="">Selecione uma categoria</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <span className="text-xs text-red-500">{errors.categoryId.message}</span>}
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-md">
            Salvar Transação
          </button>
        </form>
      </div>
    </div>
  );
}