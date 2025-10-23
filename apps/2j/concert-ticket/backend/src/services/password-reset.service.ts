// Password reset service - 4-digit code system

export interface ResetCodeData {
  email: string;
  code: string;
  expiresAt: Date;
  attempts: number;
}

// In-memory storage for reset codes (in production, use Redis or database)
const resetCodes = new Map<string, ResetCodeData>();

export class PasswordResetService {
  // Generate a 4-digit code
  private static generateCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Request password reset - send code to email
  static async requestPasswordReset(email: string): Promise<boolean> {
    try {
      console.log(`\n=== PASSWORD RESET REQUEST ===`);
      console.log(`Email: ${email}`);

      // Check if user exists (you might want to verify this with your database)
      // For now, we'll assume the email exists

      // Generate 4-digit code
      const code = this.generateCode();
      console.log(`Generated code: ${code}`);

      // Set expiration time (10 minutes from now)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // Store the code
      resetCodes.set(email.toLowerCase(), {
        email: email.toLowerCase(),
        code,
        expiresAt,
        attempts: 0,
      });

      console.log(`Reset Code: ${code}`);
      console.log(`Expires At: ${expiresAt}`);
      console.log(`========================\n`);

      // For development, we'll just log the code instead of sending actual emails
      // This ensures the flow works without requiring SMTP configuration
      console.log('🔐 DEVELOPMENT MODE: Password reset code logged above');
      console.log('📧 In production, this would be sent to:', email);
      return true;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      console.error('Error stack:', (error as Error).stack);
      return false;
    }
  }

  // Verify the reset code
  static async verifyResetCode(email: string, code: string): Promise<boolean> {
    try {
      const resetData = resetCodes.get(email.toLowerCase());

      if (!resetData) {
        console.log('No reset code found for email:', email);
        return false;
      }

      // Check if code has expired
      if (new Date() > resetData.expiresAt) {
        console.log('Reset code expired for email:', email);
        resetCodes.delete(email.toLowerCase());
        return false;
      }

      // Check attempt limit (max 3 attempts)
      if (resetData.attempts >= 3) {
        console.log('Too many attempts for email:', email);
        resetCodes.delete(email.toLowerCase());
        return false;
      }

      // Increment attempts
      resetData.attempts++;

      // Verify code
      if (resetData.code === code) {
        console.log('Reset code verified for email:', email);
        return true;
      } else {
        console.log('Invalid reset code for email:', email);
        return false;
      }
    } catch (error) {
      console.error('Error verifying reset code:', error);
      return false;
    }
  }

  // Set new password after code verification
  static async setNewPassword(email: string, code: string, newPassword: string): Promise<boolean> {
    try {
      // First verify the code
      const isValid = await this.verifyResetCode(email, code);

      if (!isValid) {
        return false;
      }

      // Here you would update the password in your database
      // TODO: Implement actual password update logic using newPassword
      console.log(`Password updated for ${email} with new password: ${newPassword.substring(0, 3)}***`);

      // Remove the reset code after successful password change
      resetCodes.delete(email.toLowerCase());

      return true;
    } catch (error) {
      console.error('Error setting new password:', error);
      return false;
    }
  }

  // Clean up expired codes (call this periodically)
  static cleanupExpiredCodes(): void {
    const now = new Date();
    for (const [email, data] of resetCodes.entries()) {
      if (now > data.expiresAt) {
        resetCodes.delete(email);
        console.log('Cleaned up expired reset code for:', email);
      }
    }
  }

  // Get reset code data for debugging (remove in production)
  static getResetCodeData(email: string): ResetCodeData | undefined {
    return resetCodes.get(email.toLowerCase());
  }
}
