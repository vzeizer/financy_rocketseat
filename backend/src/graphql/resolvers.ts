import { ExpressContext } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

export interface GraphQLContext {
  userId?: string;
}

export const createContext = ({ req }: ExpressContext): GraphQLContext => {
  const authHeader = req.headers.authorization || '';
  
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      // JWT_SECRET definido via variável de ambiente [cite: 49]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
      return { userId: decoded.userId };
    } catch (error) {
      // Ignora erro para permitir mutations públicas (login/register)
    }
  }

  return {};
};

// Helper simples para blindar rotas protegidas
export const requireAuth = (userId?: string) => {
  if (!userId) {
    throw new Error('Não autorizado. Faça login para continuar.');
  }
};