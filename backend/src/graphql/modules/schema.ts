import { TransactionService } from '../../../services/transaction.service';
import { requireAuth } from '../../context';
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
};