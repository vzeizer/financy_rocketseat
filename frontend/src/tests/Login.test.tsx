import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Login } from '../pages/auth/Login';

// Mock do IconMapper
vi.mock('../lib/icon-mapper', () => ({
  IconMapper: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

// Mock do Apollo Client
vi.mock('@apollo/client', () => ({
  useMutation: () => [vi.fn(), { loading: false, error: null }],
  gql: (strings: TemplateStringsArray) => strings.join(''),
}));

// Mock do useAuth
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
  AuthContext: {
    Provider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

describe('Login', () => {
  it('deve renderizar o formulário de login', () => {
    render(<Login />);

    expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByText(/Senha de Acesso/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar no Painel/i })).toBeInTheDocument();
  });

  it('deve renderizar o botão de criar conta quando onSwitchToRegister é fornecido', () => {
    render(<Login onSwitchToRegister={() => {}} />);

    expect(screen.getByRole('button', { name: /Criar conta/i })).toBeInTheDocument();
  });

  it('deve chamar onSwitchToRegister ao clicar no botão', () => {
    const mockSwitch = vi.fn();
    render(<Login onSwitchToRegister={mockSwitch} />);

    fireEvent.click(screen.getByRole('button', { name: /Criar conta/i }));
    expect(mockSwitch).toHaveBeenCalled();
  });
});