import { AuthService } from '../auth.service';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock do prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock do bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const mockUser = {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'hashedPassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      const result = await AuthService.register({
        name: 'João Silva',
        email: 'joao@email.com',
        password: '123456',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'joao@email.com' },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'João Silva',
          email: 'joao@email.com',
          password: 'hashedPassword',
        },
      });
      expect(result).toEqual({
        token: 'mock-token',
        user: mockUser,
      });
    });

    it('deve lançar erro se e-mail já estiver cadastrado', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'joao@email.com',
      });

      await expect(
        AuthService.register({
          name: 'João Silva',
          email: 'joao@email.com',
          password: '123456',
        })
      ).rejects.toThrow('E-mail já cadastrado.');
    });
  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const mockUser = {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'hashedPassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      const result = await AuthService.login({
        email: 'joao@email.com',
        password: '123456',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'joao@email.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashedPassword');
      expect(result).toEqual({
        token: 'mock-token',
        user: mockUser,
      });
    });

    it('deve lançar erro se usuário não existir', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login({
          email: 'inexistente@email.com',
          password: '123456',
        })
      ).rejects.toThrow('Credenciais inválidas.');
    });

    it('deve lançar erro se senha estiver incorreta', async () => {
      const mockUser = {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'hashedPassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        AuthService.login({
          email: 'joao@email.com',
          password: 'senhaErrada',
        })
      ).rejects.toThrow('Credenciais inválidas.');
    });
  });
});