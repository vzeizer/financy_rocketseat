import { CategoryService } from '../../../services/category.service';
import { requireAuth } from '../../context';
export const categoryResolvers = {
  Query: {
    categories: (_: any, __: any, ctx: any) => {
      requireAuth(ctx.userId);
      return CategoryService.listAll(ctx.userId);
    },
  },
  Mutation: {
    createCategory: (_: any, { name }: any, ctx: any) => {
      requireAuth(ctx.userId);
      return CategoryService.create(name, ctx.userId);
    },
    updateCategory: (_: any, { id, name }: any, ctx: any) => {
      requireAuth(ctx.userId);
      return CategoryService.update(id, name, ctx.userId);
    },
    deleteCategory: (_: any, { id }: any, ctx: any) => {
      requireAuth(ctx.userId);
      return CategoryService.delete(id, ctx.userId);
    },
  },
};