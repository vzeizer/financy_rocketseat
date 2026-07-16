import { prisma } from '../lib/prisma';

const parseDateOrThrow = (value: string) => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('Data da transação inválida.');
  }
  return parsedDate;
};

export class TransactionService {
  static async listAll(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
    });
  }

  static async create(data: { title: string; amount: number; type: string; categoryId: string; date: string }, userId: string) {
    const category = await prisma.category.findFirst({ where: { id: data.categoryId, userId } });
    if (!category) throw new Error('Categoria inválida.');

    const date = parseDateOrThrow(data.date);

    return prisma.transaction.create({
      data: { ...data, date, userId },
      include: { category: true },
    });
  }

  static async update(id: string, data: any, userId: string) {
    const transaction = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!transaction) throw new Error('Registro não encontrado ou não autorizado.');

    if (data.categoryId) {
      const category = await prisma.category.findFirst({ where: { id: data.categoryId, userId } });
      if (!category) throw new Error('Categoria inválida.');
    }

    if (data.date) {
      data.date = parseDateOrThrow(data.date);
    }

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