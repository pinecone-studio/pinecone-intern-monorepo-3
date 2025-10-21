import { verifyToken } from '@clerk/backend';
import { config } from '../config/env';

export class ClerkAuthService {
  /**
   * Verify Clerk JWT token and extract user information
   */
  static async verifyClerkToken(token: string) {
    try {
      if (!config.clerk.secretKey) {
        throw new Error('Clerk secret key not configured');
      }

      const payload = await verifyToken(token, {
        secretKey: config.clerk.secretKey,
      });

      return {
        userId: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        role: payload.metadata?.role || 'USER',
      };
    } catch (error) {
      console.error('Clerk token verification failed:', error);
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Get user info from Clerk token
   */
  static async getUserFromToken(token: string) {
    try {
      const userInfo = await this.verifyClerkToken(token);
      return userInfo;
    } catch (error) {
      throw new Error('Failed to get user from token');
    }
  }
}
