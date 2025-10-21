import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config?: EmailConfig) {
    // For development, use a simple SMTP configuration
    // In production, you would use a service like SendGrid, AWS SES, etc.
    const emailConfig = {
      host: config?.host || process.env.SMTP_HOST || 'smtp.gmail.com',
      port: config?.port || parseInt(process.env.SMTP_PORT || '587'),
      secure: config?.secure || false,
      auth: {
        user: config?.auth?.user || process.env.SMTP_USER || 'your-email@gmail.com',
        pass: config?.auth?.pass || process.env.SMTP_PASS || 'your-app-password',
      },
    };

    console.log('Email service configuration:', {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      user: emailConfig.auth.user,
      hasPassword: !!emailConfig.auth.pass,
    });

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendPasswordResetCode(email: string, code: string): Promise<boolean> {
    try {
      console.log(`\n=== PASSWORD RESET CODE ===`);
      console.log(`Email: ${email}`);
      console.log(`Code: ${code}`);
      console.log(`========================\n`);

      // For development, we'll just log the code instead of sending actual emails
      // This ensures the flow works without requiring SMTP configuration
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 DEVELOPMENT MODE: Password reset code logged above');
        console.log('📧 In production, this would be sent to:', email);
        return true;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@concert-ticket.com',
        to: email,
        subject: 'Нууц үг сэргээх код - Concert Ticket',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Нууц үг сэргээх код</h2>
            <p>Та нууц үгээ сэргээх хүсэлт илгээсэн байна.</p>
            <p>Дараах 4 оронтой кодыг ашиглан нууц үгээ сэргээнэ үү:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${code}
            </div>
            <p style="color: #666; font-size: 14px;">
              Энэ код 10 минутын дараа хүчинтэй болохгүй болно.
            </p>
            <p style="color: #666; font-size: 14px;">
              Хэрэв та энэ хүсэлт илгээгээгүй бол энэ имэйлийг үл тоомсорлож болно.
            </p>
          </div>
        `,
      };

      console.log('Mail options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
      });

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', result.messageId);
      console.log('Email response:', result);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response,
      });
      return false;
    }
  }

  async sendWelcomeEmail(email: string, username?: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@concert-ticket.com',
        to: email,
        subject: 'Тавтай морил - Concert Ticket',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Тавтай морил!</h2>
            <p>${username ? `Сайн байна уу ${username},` : 'Сайн байна уу,'}</p>
            <p>Concert Ticket системд амжилттай бүртгэгдлээ.</p>
            <p>Одоо та концертын тасалбар захиалах боломжтой боллоо.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
               style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
              Системд нэвтрэх
            </a>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }
}

// Singleton instance
export const emailService = new EmailService();
