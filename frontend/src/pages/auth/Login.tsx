import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';
import { IconMapper } from '../../lib/icon-mapper';

const loginSchema = zod.object({
  email: zod.string().email('Insira um e-mail válido.'),
  password: zod.string().min(6, 'A senha deve conter ao menos 6 caracteres.'),
});

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id name email }
    }
  }
`;

export function Login({ onSwitchToRegister }: { onSwitchToRegister?: () => void }) {
  const { login: saveAuthContext } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const [loginUser, { loading, error }] = useMutation(LOGIN_MUTATION);

  const onSubmit = async (data: any) => {
    try {
      const response = await loginUser({ variables: data });
      if (response.data?.login) {
        const { token, user } = response.data.login;
        saveAuthContext(token, user);
      }
    } catch (err) {
      // Tratado pelo objeto error do apollo
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl border border-neutral-light shadow-md max-w-md w-full space-y-6">
        
        {/* Logo Corporativa */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-2xl tracking-tight">
            <IconMapper name="wallet.svg" size={28} />
            <span>FINANCY</span>
          </div>
          <p className="text-sm text-neutral-medium text-center">Gestão inteligente e simplificada das suas finanças</p>
        </div>

        {error && (
          <div className="p-3 bg-feedback-errorLight text-feedback-error text-xs font-semibold rounded-xl border border-feedback-error/20">
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Senha de Acesso</label>
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
            className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 mt-2 inline-flex items-center justify-center gap-2"
          >
            <IconMapper name="log-in.svg" size={16} />
            {loading ? 'Acessando conta...' : 'Entrar no Painel'}
          </button>

          {onSwitchToRegister && (
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="w-full text-brand-primary font-semibold py-2 rounded-xl hover:bg-brand-primary/5 transition-colors"
            >
              Criar conta
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
