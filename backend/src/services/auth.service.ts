import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export class AuthService {
  static async register({ name, email, password }: any) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('E-mail já cadastrado.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
  }

  static async login({ email, password }: any) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Credenciais inválidas.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Credenciais inválidas.');

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
  }
}