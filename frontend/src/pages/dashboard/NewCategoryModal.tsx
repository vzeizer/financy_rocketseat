import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation, gql } from '@apollo/client';

const categorySchema = zod.object({
  name: zod.string().min(1, 'O título da categoria é obrigatório.'),
});

const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) { id }
  }
`;

export function NewCategoryModal({ onClose, onRefresh }: any) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema)
  });

  const [createCategory] = useMutation(CREATE_CATEGORY);

  const onSubmit = async (data: any) => {
    await createCategory({ variables: { name: data.name } });
    onRefresh();
    onClose();
  };

  // Amostra de ícones extraída diretamente do seu arquivo icones.txt
  const iconOptions = ['utensils.svg', 'car-front.svg', 'shopping-cart.svg', 'heart-pulse.svg', 'briefcase-business.svg', 'dumbbell.svg'];
  const colorOptions = ['#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#CA8A04', '#168054'];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-xl space-y-6 relative border border-neutral-light">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-medium hover:text-neutral-dark">✕</button>
        
        <div>
          <h2 className="text-xl font-bold text-neutral-darkest">Nova categoria</h2>
          <p className="text-sm text-neutral-medium">Organize suas transações com categorias</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Título</label>
            <input 
              {...register('name')} 
              type="text" 
              placeholder="Ex: Alimentação" 
              className="w-full p-3 border border-neutral-light rounded-xl text-sm placeholder:text-neutral-medium focus:border-brand-primary"
            />
            {errors.name && <span className="text-xs text-feedback-error">{errors.name.message as string}</span>}
          </div>

          {/* Grid Seletor de Ícones do arquivo txt */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Ícone representativo</label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((icon) => (
                <button 
                  key={icon} 
                  type="button" 
                  className="p-2.5 border border-neutral-light hover:border-brand-primary rounded-xl flex items-center justify-center text-neutral-dark transition-all bg-white"
                >
                  <img src={`/icons/${icon}`} alt="" className="w-5 h-5 opacity-70" onError={(e)=>{e.currentTarget.style.display='none'}} />
                  <span className="text-[10px] truncate max-w-full">{icon.replace('.svg','')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seletor de Cores do Style Guide */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Cor de Destaque</label>
            <div className="flex gap-3">
              {colorOptions.map((color) => (
                <button 
                  key={color} 
                  type="button" 
                  style={{ backgroundColor: color }}
                  className="w-7 h-7 rounded-full border border-black/10 hover:scale-110 transition-transform cursor-pointer"
                />
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-colors shadow-sm mt-2">
            Salvar Categoria
          </button>
        </form>
      </div>
    </div>
  );
}