import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { IconMapper } from '../../lib/icon-mapper';

const categorySchema = zod.object({
  name: zod.string().min(1, 'O título da categoria é obrigatório.'),
});

const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) { id }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $name: String!) {
    updateCategory(id: $id, name: $name) { id }
  }
`;

interface NewCategoryModalProps {
  onClose: () => void;
  onRefresh: () => void;
  initialData?: { id: string; name: string } | null;
}

export function NewCategoryModal({ onClose, onRefresh, initialData = null }: NewCategoryModalProps) {
  const isEditMode = Boolean(initialData);
  const iconOptions = ['utensils', 'car-front', 'shopping-cart', 'heart-pulse', 'briefcase-business', 'dumbbell'];
  const colorOptions = ['#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#CA8A04', '#168054'];
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name ?? '',
    },
  });

  const [createCategory] = useMutation(CREATE_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);

  const onSubmit = async (data: any) => {
    if (isEditMode && initialData) {
      await updateCategory({ variables: { id: initialData.id, name: data.name } });
    } else {
      await createCategory({ variables: { name: data.name } });
    }
    onRefresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-xl space-y-6 relative border border-neutral-light">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-medium hover:text-neutral-dark">✕</button>
        
        <div>
          <h2 className="text-xl font-bold text-neutral-darkest">{isEditMode ? 'Editar categoria' : 'Nova categoria'}</h2>
          <p className="text-sm text-neutral-medium">{isEditMode ? 'Atualize os dados da categoria' : 'Organize suas transações com categorias'}</p>
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

          {/* Grid Seletor de Ícones usando IconMapper */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Ícone representativo</label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((icon) => (
                <button 
                  key={icon} 
                  type="button" 
                  onClick={() => setSelectedIcon(icon)}
                  aria-label={`Selecionar ícone ${icon}`}
                  className={`p-2.5 border rounded-xl flex items-center justify-center transition-all bg-white ${
                    selectedIcon === icon
                      ? 'border-brand-primary ring-2 ring-brand-primary/25 text-brand-primary'
                      : 'border-neutral-light hover:border-brand-primary text-neutral-dark'
                  }`}
                >
                  <IconMapper name={`${icon}.svg`} size={20} />
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
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  aria-label={`Selecionar cor ${color}`}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer hover:scale-110 ${
                    selectedColor === color
                      ? 'ring-2 ring-offset-2 ring-brand-primary border border-white'
                      : 'border border-black/10'
                  }`}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-colors shadow-sm mt-2">
            {isEditMode ? 'Salvar alterações' : 'Salvar categoria'}
          </button>
        </form>
      </div>
    </div>
  );
}