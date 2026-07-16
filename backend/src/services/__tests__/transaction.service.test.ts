import { TransactionService } from '../transaction.service';
import { prisma } from '../../lib/prisma';

// Mock do prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    transaction: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findFirst: jest.fn(),
    },
  },
}));

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listAll', () => {
    it('deve listar todas as transações do usuário', async () => {
      const mockTransactions = [
        {
          id: '1',
          title: 'Salário',
          amount: 5000,
          type: 'INCOME',
          userId: 'user1',
          category: { id: '1', name: 'Trabalho' },
        },
        {
          id: '2',
          title: 'Aluguel',
          amount: 1500,
          type: 'EXPENSE',
          userId: 'user1',
          category: { id: '2', name: 'Moradia' },
        },
      ];

      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await TransactionService.listAll('user1');

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        include: { category: true },
      });
      expect(result).toEqual(mockTransactions);
    });

    it('deve retornar lista vazia se usuário não tiver transações', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);

      const result = await TransactionService.listAll('user1');

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        include: { category: true },
      });
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('deve criar uma nova transação com sucesso', async () => {
      const mockCategory = { id: '1', name: 'Trabalho', userId: 'user1' };
      const mockTransaction = {
        id: '1',
        title: 'Salário',
        amount: 5000,
        type: 'INCOME',
        categoryId: '1',
        userId: 'user1',
        category: mockCategory,
      };

      (prisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);
      (prisma.transaction.create as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await TransactionService.create(
        {
          title: 'Salário',
          amount: 5000,
          type: 'INCOME',
          categoryId: '1',
          date: '2026-07-16',
        },
        'user1'
      );

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user1' },
      });
      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: {
          title: 'Salário',
          amount: 5000,
          type: 'INCOME',
          categoryId: '1',
          date: expect.any(Date),
          userId: 'user1',
        },
        include: { category: true },
      });
      expect(result).toEqual(mockTransaction);
    });

    it('deve lançar erro se categoria não for encontrada', async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        TransactionService.create(
          {
            title: 'Salário',
            amount: 5000,
            type: 'INCOME',
            categoryId: '1',
            date: '2026-07-16',
          },
          'user1'
        )
      ).rejects.toThrow('Categoria inválida.');
    });

    it('deve lançar erro se categoria pertencer a outro usuário', async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        TransactionService.create(
          {
            title: 'Salário',
            amount: 5000,
            type: 'INCOME',
            categoryId: '1',
            date: '2026-07-16',
          },
          'user2'
        )
      ).rejects.toThrow('Categoria inválida.');
    });
  });

  describe('update', () => {
    it('deve atualizar uma transação com sucesso', async () => {
      const mockTransaction = {
        id: '1',
        title: 'Salário',
        amount: 5000,
        type: 'INCOME',
        userId: 'user1',
      };
      const updatedTransaction = {
        id: '1',
        title: 'Salário Atualizado',
        amount: 6000,
        type: 'INCOME',
        userId: 'user1',
        category: { id: '1', name: 'Trabalho' },
      };

      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(mockTransaction);
      (prisma.transaction.update as jest.Mock).mockResolvedValue(updatedTransaction);

      const result = await TransactionService.update(
        '1',
        { title: 'Salário Atualizado', amount: 6000 },
        'user1'
      );

      expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user1' },
      });
      expect(prisma.transaction.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: 'Salário Atualizado', amount: 6000 },
        include: { category: true },
      });
      expect(result).toEqual(updatedTransaction);
    });

    it('deve lançar erro se transação não for encontrada', async () => {
      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        TransactionService.update('1', { title: 'Novo Título' }, 'user1')
      ).rejects.toThrow('Registro não encontrado ou não autorizado.');
    });

    it('deve lançar erro se transação pertencer a outro usuário', async () => {
      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        TransactionService.update('1', { title: 'Novo Título' }, 'user2')
      ).rejects.toThrow('Registro não encontrado ou não autorizado.');
    });
  });

  describe('delete', () => {
    it('deve deletar uma transação com sucesso', async () => {
      const mockTransaction = {
        id: '1',
        title: 'Salário',
        amount: 5000,
        type: 'INCOME',
        userId: 'user1',
      };

      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(mockTransaction);
      (prisma.transaction.delete as jest.Mock).mockResolvedValue({});

      const result = await TransactionService.delete('1', 'user1');

      expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user1' },
      });
      expect(prisma.transaction.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toBe(true);
    });

    it('deve lançar erro se transação não for encontrada', async () => {
      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(TransactionService.delete('1', 'user1')).rejects.toThrow(
        'Registro não encontrado ou não autorizado.'
      );
    });

    it('deve lançar erro se transação pertencer a outro usuário', async () => {
      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(TransactionService.delete('1', 'user2')).rejects.toThrow(
        'Registro não encontrado ou não autorizado.'
      );
    });
  });
});