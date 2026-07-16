import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from '../pages/dashboard/Dashboards';

// Mock do IconMapper
vi.mock('../../lib/icon-mapper', () => ({
  IconMapper: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

// Mock do Apollo Client
vi.mock('@apollo/client', () => ({
  useQuery: () => ({
    data: {
      transactions: [
        { id: '1', title: 'Salário', amount: 5000, type: 'INCOME', date: '2024-01-15', category: { name: 'Trabalho' } },
        { id: '2', title: 'Aluguel', amount: 1500, type: 'EXPENSE', date: '2024-01-10', category: { name: 'Moradia' } },
      ],
      categories: [
        { id: '1', name: 'Trabalho' },
        { id: '2', name: 'Moradia' },
      ],
    },
    loading: false,
    error: null,
  }),
  gql: (strings: TemplateStringsArray) => strings.join(''),
}));

describe('Dashboard', () => {
  it('deve renderizar os KPIs do dashboard', () => {
    render(<Dashboard />);

    expect(screen.getByText('Saldo Total')).toBeInTheDocument();
    expect(screen.getByText('Receitas do Mês')).toBeInTheDocument();
    expect(screen.getByText('Despesas do Mês')).toBeInTheDocument();
  });

  it('deve renderizar as transações recentes', () => {
    render(<Dashboard />);

    expect(screen.getByText('Transações Recentes')).toBeInTheDocument();
    expect(screen.getByText('Salário')).toBeInTheDocument();
    expect(screen.getByText('Aluguel')).toBeInTheDocument();
  });

  it('deve renderizar a seção de categorias', () => {
    render(<Dashboard />);

    expect(screen.getByText('Categorias')).toBeInTheDocument();
    const trabalhoElements = screen.getAllByText('Trabalho');
    expect(trabalhoElements.length).toBeGreaterThan(0);
    const moradiaElements = screen.getAllByText('Moradia');
    expect(moradiaElements.length).toBeGreaterThan(0);
  });

  it('deve calcular o saldo corretamente', () => {
    render(<Dashboard />);

    // Saldo = 5000 (receita) - 1500 (despesa) = 3500
    expect(screen.getByText('R$ 3.500,00')).toBeInTheDocument();
  });
});