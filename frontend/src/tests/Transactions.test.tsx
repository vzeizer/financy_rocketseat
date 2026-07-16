import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Transactions } from '../pages/dashboard/Transactions';

// Mock do IconMapper
vi.mock('../../lib/icon-mapper', () => ({
  IconMapper: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

// Mock do Apollo Client
vi.mock('@apollo/client', () => ({
  useQuery: () => ({
    data: {
      transactions: [
        { id: '1', title: 'Salário', amount: 5000, type: 'INCOME', date: '2024-01-15', category: { id: '1', name: 'Trabalho' } },
        { id: '2', title: 'Aluguel', amount: 1500, type: 'EXPENSE', date: '2024-01-10', category: { id: '2', name: 'Moradia' } },
      ],
      categories: [
        { id: '1', name: 'Trabalho' },
        { id: '2', name: 'Moradia' },
      ],
    },
    loading: false,
    refetch: vi.fn(),
  }),
  useMutation: () => [vi.fn()],
  gql: (strings: TemplateStringsArray) => strings.join(''),
}));

describe('Transactions', () => {
  it('deve renderizar o cabeçalho da página', () => {
    render(<Transactions />);

    expect(screen.getByText('Transações')).toBeInTheDocument();
    expect(screen.getByText(/Gerencie todas as suas transações financeiras/i)).toBeInTheDocument();
  });

  it('deve renderizar o botão de nova transação', () => {
    render(<Transactions />);

    expect(screen.getByRole('button', { name: /Nova transação/i })).toBeInTheDocument();
  });

  it('deve renderizar as transações', () => {
    render(<Transactions />);

    expect(screen.getByText('Salário')).toBeInTheDocument();
    expect(screen.getByText('Aluguel')).toBeInTheDocument();
  });

  it('deve renderizar os filtros', () => {
    render(<Transactions />);

    expect(screen.getByText(/Buscar/i)).toBeInTheDocument();
    const tipoElements = screen.getAllByText(/Tipo/i);
    expect(tipoElements.length).toBeGreaterThan(0);
    const categoriaElements = screen.getAllByText(/Categoria/i);
    expect(categoriaElements.length).toBeGreaterThan(0);
  });
});