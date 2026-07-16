import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Categories } from '../pages/dashboard/Categories';

// Mock do IconMapper
vi.mock('../../lib/icon-mapper', () => ({
  IconMapper: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

// Mock do Apollo Client
vi.mock('@apollo/client', () => ({
  useQuery: () => ({
    data: {
      categories: [
        { id: '1', name: 'Alimentação' },
        { id: '2', name: 'Transporte' },
      ],
      transactions: [],
    },
    loading: false,
    refetch: vi.fn(),
  }),
  useMutation: () => [vi.fn()],
  gql: (strings: TemplateStringsArray) => strings.join(''),
}));

describe('Categories', () => {
  it('deve renderizar o cabeçalho da página', () => {
    render(<Categories />);

    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText(/Organize suas transações por categorias/i)).toBeInTheDocument();
  });

  it('deve renderizar o botão de nova categoria', () => {
    render(<Categories />);

    expect(screen.getByRole('button', { name: /Nova categoria/i })).toBeInTheDocument();
  });

  it('deve renderizar as categorias', () => {
    render(<Categories />);

    const alimentacaoElements = screen.getAllByText('Alimentação');
    expect(alimentacaoElements.length).toBeGreaterThan(0);
    const transporteElements = screen.getAllByText('Transporte');
    expect(transporteElements.length).toBeGreaterThan(0);
  });

  it('deve renderizar os KPIs', () => {
    render(<Categories />);

    expect(screen.getByText('Total de Categorias')).toBeInTheDocument();
    expect(screen.getByText('Total de Transações')).toBeInTheDocument();
  });
});