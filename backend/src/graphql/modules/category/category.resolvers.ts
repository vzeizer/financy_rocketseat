import { CategoryService } from '../../../services/category.service';
import { requireAuth } from '../context';
export const categoryResolvers = {
  Query: {
    categories: (_: any, __: any, ctx: any) => {
      requireAuth(ctx.userId);
      return CategoryService.listAll(ctx.userId);
    },
  },
  Mutation: {
    createCategory: (_: any, { name, icon, color }: any, ctx: any) => {
      requireAuth(ctx.userId);
      return CategoryService.create({ name, icon, color }, ctx.userId);
    },
    updateCategory: (_: any, { id, name, icon, color }: any, ctx: any) => {
      requireAuth(ctx.userId);
      return CategoryService.update(id, { name, icon, color }, ctx.userId);
    },
    deleteCategory: (_: any, { id }: any, ctx: any) => {
      requireAuth(ctx.userId);
      return CategoryService.delete(id, ctx.userId);
    },
  },
};