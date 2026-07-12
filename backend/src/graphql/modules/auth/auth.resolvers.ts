import { AuthService } from '../../../services/auth.service';
export const authResolvers = {
  Mutation: {
    register: (_: any, args: any) => AuthService.register(args),
    login: (_: any, args: any) => AuthService.login(args),
  },
};