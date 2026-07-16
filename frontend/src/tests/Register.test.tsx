import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Register } from '../pages/auth/Register';

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
}));

describe('Register', () => {
  it('deve renderizar o formulário de cadastro', () => {
    render(<Register onSwitchToLogin={() => {}} />);

    expect(screen.getByText(/Nome Completo/i)).toBeInTheDocument();
    expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
  });

  it('deve renderizar o link para login', () => {
    render(<Register onSwitchToLogin={() => {}} />);

    expect(screen.getByRole('button', { name: /Já possui uma conta\? Faça login/i })).toBeInTheDocument();
  });

  it('deve chamar onSwitchToLogin ao clicar no link', () => {
    const mockSwitch = vi.fn();
    render(<Register onSwitchToLogin={mockSwitch} />);

    fireEvent.click(screen.getByRole('button', { name: /Já possui uma conta\? Faça login/i }));
    expect(mockSwitch).toHaveBeenCalled();
  });
});