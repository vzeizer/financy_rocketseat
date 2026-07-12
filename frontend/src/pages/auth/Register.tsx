import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';
import { IconMapper } from '../../lib/icon-mapper';

const registerSchema = zod.object({
  name: zod.string().min(2, 'O nome deve conter ao menos 2 caracteres.'),
  email: zod.string().email('Insira um e-mail válido.'),
  password: zod.string().min(6, 'A senha deve conter ao menos 6 caracteres.'),
});

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user { id name email }
    }
  }
`;

export function Register({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { login: saveAuthContext } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [registerUser, { loading, error }] = useMutation(REGISTER_MUTATION);

  const onSubmit = async (data: any) => {
    try {
      const response = await registerUser({ variables: data });
      if (response.data?.register) {
        const { token, user } = response.data.register;
        saveAuthContext(token, user);
      }
    } catch (err) {
      // Tratado pelo objeto error do Apollo Client
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl border border-neutral-light shadow-md max-w-md w-full space-y-6">
        
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-2xl tracking-tight">
            <IconMapper name="wallet.svg" size={28} />
            <span>FINANCY</span>
          </div>
          <p className="text-sm text-neutral-medium text-center">Crie sua conta para começar a organizar suas finanças</p>
        </div>

        {error && (
          <div className="p-3 bg-feedback-errorLight text-feedback-error text-xs font-semibold rounded-xl border border-feedback-error/20">
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Nome Completo</label>
            <input 
              {...register('name')}
              type="text" 
              placeholder="Seu nome"
              className={`w-full p-3 border rounded-xl text-sm placeholder:text-neutral-medium focus:outline-none ${errors.name ? 'border-feedback-error bg-red-50/30' : 'border-neutral-light focus:border-brand-primary'}`}
            />
            {errors.name && <span className="text-xs text-feedback-error">{errors.name.message as string}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">E-mail</label>
            <input 
              {...register('email')}
              type="email" 
              placeholder="seu-email@exemplo.com"
              className={`w-full p-3 border rounded-xl text-sm placeholder:text-neutral-medium focus:outline-none ${errors.email ? 'border-feedback-error bg-red-50/30' : 'border-neutral-light focus:border-brand-primary'}`}
            />
            {errors.email && <span className="text-xs text-feedback-error">{errors.email.message as string}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Senha</label>
            <input 
              {...register('password')}
              type="password" 
              placeholder="••••••••"
              className={`w-full p-3 border rounded-xl text-sm placeholder:text-neutral-medium focus:outline-none ${errors.password ? 'border-feedback-error bg-red-50/30' : 'border-neutral-light focus:border-brand-primary'}`}
            />
            {errors.password && <span className="text-xs text-feedback-error">{errors.password.message as string}</span>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={onSwitchToLogin}
            className="text-xs text-brand-primary hover:underline font-semibold"
          >
            Já possui uma conta? Faça login
          </button>
        </div>
      </div>
    </div>
  );
}