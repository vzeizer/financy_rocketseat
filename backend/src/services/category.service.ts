import { prisma } from '../lib/prisma';

export class CategoryService {
  static async listAll(userId: string) {
    return prisma.category.findMany({ where: { userId } });
  }

  static async create(name: string, userId: string) {
    return prisma.category.create({ data: { name, userId } });
  }

  static async update(id: string, name: string, userId: string) {
    const category = await prisma.category.findFirst({ where: { id, userId } });
    if (!category) throw new Error('Registro não encontrado ou não autorizado.');

    return prisma.category.update({ where: { id }, data: { name } });
  }

  static async delete(id: string, userId: string) {
    const category = await prisma.category.findFirst({ where: { id, userId } });
    if (!category) throw new Error('Registro não encontrado ou não autorizado.');

    await prisma.category.delete({ where: { id } });
    return true;
  }
}