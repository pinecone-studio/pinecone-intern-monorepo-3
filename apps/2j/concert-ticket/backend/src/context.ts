import { AuthController } from './controllers/auth.controller';
import { ClerkAuthService } from './services/clerk-auth.service';

export interface AuthUser {
  id: string;
  role: 'USER' | 'ADMIN';
  email?: string;
  firstName?: string;
  lastName?: string;
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

      // First try Clerk authentication
      try {
        const clerkUser = await ClerkAuthService.getUserFromToken(token);
        context.user = {
          id: clerkUser.userId,
          role: clerkUser.role as 'USER' | 'ADMIN',
          email: clerkUser.email,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
        };
        return context;
      } catch (clerkError) {
        // If Clerk verification fails, try legacy JWT authentication
        console.log('Clerk verification failed, trying legacy auth:', clerkError);
      }

      // Fallback to legacy JWT token verification
      const user = await AuthController.getUserFromToken(token);
      context.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
      };
    }
  } catch (error) {
    // Token буруу эсвэл хугацаа дууссан тохиолдолд user-г null болгох
    console.log('Authentication failed:', error);
    context.user = null;
  }

  return context;
}
