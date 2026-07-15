import { prisma } from '../lib/prisma';

export class TransactionService {
  static async listAll(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
    });
  }

  static async create(data: { title: string; amount: number; type: string; categoryId: string }, userId: string) {
    const category = await prisma.category.findFirst({ where: { id: data.categoryId, userId } });
    if (!category) throw new Error('Categoria inválida.');

    return prisma.transaction.create({
      data: { ...data, userId },
      include: { category: true },
    });
  }

  static async update(id: string, data: any, userId: string) {
    const transaction = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!transaction) throw new Error('Registro não encontrado ou não autorizado.');

    return prisma.transaction.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  static async delete(id: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!transaction) throw new Error('Registro não encontrado ou não autorizado.');

    await prisma.transaction.delete({ where: { id } });
    return true;
  }
}