import { TransactionService } from '../../../services/transaction.service';
import { requireAuth } from '../context';
import { prisma } from '../../../lib/prisma';

export const transactionResolvers = {
  Query: {
    transactions: (_: any, __: any, ctx: any) => {
      requireAuth(ctx.userId);
      return TransactionService.listAll(ctx.userId);
    },
  },
  Mutation: {
    createTransaction: (_: any, args: any, ctx: any) => {
      requireAuth(ctx.userId);
      return TransactionService.create(args, ctx.userId);
    },
    updateTransaction: (_: any, { id, ...data }: any, ctx: any) => {
      requireAuth(ctx.userId);
      return TransactionService.update(id, data, ctx.userId);
    },
    deleteTransaction: (_: any, { id }: any, ctx: any) => {
      requireAuth(ctx.userId);
      return TransactionService.delete(id, ctx.userId);
    },
  },
  Transaction: {
    category: (parent: any) => {
      if (parent.category) return parent.category;
      return prisma.category.findUnique({ where: { id: parent.categoryId } });
    },
    date: (parent: any) => {
      if (parent.date instanceof Date) return parent.date.toISOString();
      if (typeof parent.date === 'string') {
        const parsed = new Date(parent.date);
        if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
      }
      return new Date(0).toISOString();
    },
  },
};
