import { User } from '../models/model.user';

export interface ResetCodeData {
  email: string;
  code: string;
  expiresAt: Date;
  attempts: number;
}

const resetCodes = new Map<string, ResetCodeData>();

export class PasswordResetService {
  private static generateCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  static async requestPasswordReset(email: string): Promise<boolean> {
    try {
      console.log(`\n=== PASSWORD RESET REQUEST ===`);
      console.log(`Email: ${email}`);

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        console.log('User not found:', email);
        return false;
      }

      console.log('🔐 DEVELOPMENT MODE: User found, accepting any code');
      console.log('📧 Email:', email);
      console.log('========================\n');

      return true;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      console.error('Error stack:', error.stack);
      return false;
    }
  }

  static async verifyResetCode(email: string, code: string): Promise<boolean> {
    try {
      console.log('Code verification for:', email, 'Code:', code);
      console.log('🔐 DEVELOPMENT MODE: Accepting any code');
      return true;
    } catch (error) {
      console.error('Error verifying reset code:', error);
      return false;
    }
  }

  static async setNewPassword(email: string, code: string, newPassword: string): Promise<boolean> {
    try {
      const isValid = await this.verifyResetCode(email, code);

      if (!isValid) {
        console.log('Code verification failed for:', email);
        return false;
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        console.log('User not found for password update:', email);
        return false;
      }

      user.password = newPassword;
      await user.save();

      console.log(`Password updated successfully for ${email}`);

      resetCodes.delete(email.toLowerCase());

      return true;
    } catch (error) {
      console.error('Error setting new password:', error);
      console.error('Error details:', error.message);
      return false;
    }
  }

  static cleanupExpiredCodes(): void {
    const now = new Date();
    for (const [email, data] of resetCodes.entries()) {
      if (now > data.expiresAt) {
        resetCodes.delete(email);
        console.log('Cleaned up expired reset code for:', email);
      }
    }
  }

  static getResetCodeData(email: string): ResetCodeData | undefined {
    return resetCodes.get(email.toLowerCase());
  }
}
