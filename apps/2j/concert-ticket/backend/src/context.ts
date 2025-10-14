import { AuthController } from './controllers/auth.controller';

export interface AuthUser {
  id: string;
  role: 'USER' | 'ADMIN';
  email?: string;
}

export interface Context {
  user?: AuthUser | null;
  // db, services, loaders зэргийг энд холбоно
}

export function createContext(): Context {
  return {
    user: null,
  };
}

// Authentication middleware
export async function createContextWithAuth(req: { headers: { authorization?: string } }): Promise<Context> {
  const context: Context = {
    user: null,
  };

  try {
    // Authorization header-ээс token авах
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // "Bearer " гэсэн 7 тэмдэгтийг хасах
      
      // Token-г шалгах
      const user = await AuthController.getUserFromToken(token);
      context.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email
      };
    }
  } catch (error) {
    // Token буруу эсвэл хугацаа дууссан тохиолдолд user-г null болгох
    context.user = null;
  }

  return context;
}
