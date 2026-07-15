import { CategoryService } from '../category.service';
import { prisma } from '../../lib/prisma';

// Mock do prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listAll', () => {
    it('deve listar todas as categorias do usuário', async () => {
      const mockCategories = [
        { id: '1', name: 'Alimentação', userId: 'user1' },
        { id: '2', name: 'Transporte', userId: 'user1' },
      ];

      (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

      const result = await CategoryService.listAll('user1');

      expect(prisma.category.findMany).toHaveBeenCalledWith({ where: { userId: 'user1' } });
      expect(result).toEqual(mockCategories);
    });

    it('deve retornar lista vazia se usuário não tiver categorias', async () => {
      (prisma.category.findMany as jest.Mock).mockResolvedValue([]);

      const result = await CategoryService.listAll('user1');

      expect(prisma.category.findMany).toHaveBeenCalledWith({ where: { userId: 'user1' } });
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('deve criar uma nova categoria com sucesso', async () => {
      const mockCategory = { id: '1', name: 'Alimentação', userId: 'user1' };

      (prisma.category.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await CategoryService.create('Alimentação', 'user1');

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: { name: 'Alimentação', userId: 'user1' },
      });
      expect(result).toEqual(mockCategory);
    });
  });

  describe('update', () => {
    it('deve atualizar uma categoria com sucesso', async () => {
      const mockCategory = { id: '1', name: 'Alimentação', userId: 'user1' };
      const updatedCategory = { id: '1', name: 'Alimentação Atualizada', userId: 'user1' };

      (prisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);
      (prisma.category.update as jest.Mock).mockResolvedValue(updatedCategory);

      const result = await CategoryService.update('1', 'Alimentação Atualizada', 'user1');

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user1' },
      });
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Alimentação Atualizada' },
      });
      expect(result).toEqual(updatedCategory);
    });

    it('deve lançar erro se categoria não for encontrada', async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(CategoryService.update('1', 'Novo Nome', 'user1')).rejects.toThrow(
        'Registro não encontrado ou não autorizado.'
      );
    });

    it('deve lançar erro se categoria pertencer a outro usuário', async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(CategoryService.update('1', 'Novo Nome', 'user2')).rejects.toThrow(
        'Registro não encontrado ou não autorizado.'
      );
    });
  });

  describe('delete', () => {
    it('deve deletar uma categoria com sucesso', async () => {
      const mockCategory = { id: '1', name: 'Alimentação', userId: 'user1' };

      (prisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);
      (prisma.category.delete as jest.Mock).mockResolvedValue({});

      const result = await CategoryService.delete('1', 'user1');

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user1' },
      });
      expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toBe(true);
    });

    it('deve lançar erro se categoria não for encontrada', async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(CategoryService.delete('1', 'user1')).rejects.toThrow(
        'Registro não encontrado ou não autorizado.'
      );
    });

    it('deve lançar erro se categoria pertencer a outro usuário', async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(CategoryService.delete('1', 'user2')).rejects.toThrow(
        'Registro não encontrado ou não autorizado.'
      );
    });
  });
});