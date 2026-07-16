import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import { AuthContext } from '../contexts/AuthContext';

// Mock do Apollo Client
vi.mock('@apollo/client', () => ({
  ApolloProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  gql: (strings: TemplateStringsArray) => strings.join(''),
}));

// Mock do IconMapper
vi.mock('../lib/icon-mapper', () => ({
  IconMapper: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

// Mock do Login
vi.mock('../pages/auth/Login', () => ({
  Login: () => <div data-testid="login-page">Login Page</div>,
}));

describe('App', () => {
  const mockAuthContext = {
    signed: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  };

  it('deve renderizar a tela de login quando não autenticado', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <App />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
