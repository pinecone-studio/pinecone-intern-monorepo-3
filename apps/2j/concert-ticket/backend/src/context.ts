import { getUserFromToken } from './services/auth.service';

export interface AuthUser {
  id: string;
  role: 'USER' | 'ADMIN';
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface Context {
  user?: AuthUser | null;
}

export function createContext(): Context {
  return {
    user: null,
  };
}

export async function createContextWithAuth(req: { headers: { authorization?: string } }): Promise<Context> {
  const context: Context = {
    user: null,
  };
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await getUserFromToken(token);
      context.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
      };
    }
  } catch (error) {
    console.log('Authentication failed:', error);
    context.user = null;
  }
  return context;
}
