import { prisma } from '../lib/prisma';

type CategoryInput = {
  name: string;
  icon?: string | null;
  color?: string | null;
};

const DEFAULT_CATEGORY_ICON = 'tag.svg';
const DEFAULT_CATEGORY_COLOR = '#2563EB';

export class CategoryService {
  static async listAll(userId: string) {
    return prisma.category.findMany({ where: { userId } });
  }

  static async create(data: CategoryInput, userId: string) {
    return prisma.category.create({
      data: {
        name: data.name,
        icon: data.icon || DEFAULT_CATEGORY_ICON,
        color: data.color || DEFAULT_CATEGORY_COLOR,
        userId,
      },
    });
  }

  static async update(id: string, data: CategoryInput, userId: string) {
    const category = await prisma.category.findFirst({ where: { id, userId } });
    if (!category) throw new Error('Registro não encontrado ou não autorizado.');

    return prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        icon: data.icon || DEFAULT_CATEGORY_ICON,
        color: data.color || DEFAULT_CATEGORY_COLOR,
      },
    });
  }

  static async delete(id: string, userId: string) {
    const category = await prisma.category.findFirst({ where: { id, userId } });
    if (!category) throw new Error('Registro não encontrado ou não autorizado.');

    await prisma.category.delete({ where: { id } });
    return true;
  }
}