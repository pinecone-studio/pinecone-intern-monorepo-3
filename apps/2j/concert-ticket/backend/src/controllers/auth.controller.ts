import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/model.user';
import { RegisterInput, LoginInput } from '../generated/types';

export class AuthController {
  // JWT token үүсгэх
  private static generateToken(user: IUser): string {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d',
    });
  }

  // Хэрэглэгч бүртгэх
  static async register(input: RegisterInput) {
    try {
      // Email давхардах эсэхийг шалгах
      const existingUser = await User.findOne({ email: input.email.toLowerCase() });
      if (existingUser) {
        throw new Error('Энэ email-ээр аль хэдийн бүртгэлтэй байна');
      }

      // Шинэ хэрэглэгч үүсгэх
      const user = new User({
        email: input.email.toLowerCase(),
        username: input.username,
        phoneNumber: input.phoneNumber,
        role: 'USER',
      });

      // Password-г тохируулах (model-д hash хийгдэнэ)
      user.password = input.password;

      const savedUser = await user.save();
      const token = this.generateToken(savedUser);

      return {
        token,
        user: savedUser,
      };
    } catch (error) {
      throw new Error(`Бүртгэл үүсгэхэд алдаа гарлаа: ${error}`);
    }
  }

  // Хэрэглэгч нэвтрэх
  static async login(input: LoginInput) {
    try {
      // Хэрэглэгчийг олох
      const user = await User.findOne({ email: input.email.toLowerCase() });
      if (!user) {
        throw new Error('Буруу email эсвэл нууц үг');
      }

      // Password шалгах
      const isPasswordValid = await user.comparePassword(input.password);
      if (!isPasswordValid) {
        throw new Error('Буруу email эсвэл нууц үг');
      }

      const token = this.generateToken(user);

      return {
        token,
        user,
      };
    } catch (error) {
      throw new Error(`Нэвтрэхэд алдаа гарлаа: ${error}`);
    }
  }

  // Token-г шалгах
  static async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as Record<string, unknown>;

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        throw new Error('Хэрэглэгч олдсонгүй');
      }

      return user;
    } catch (error) {
      throw new Error('Буруу эсвэл хугацаа дууссан token');
    }
  }

  // Хэрэглэгчийн ролийг шалгах
  static async checkUserRole(userId: string, requiredRole: 'USER' | 'ADMIN') {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Хэрэглэгч олдсонгүй');
      }

      if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
        throw new Error('Админ эрх шаардлагатай');
      }

      return true;
    } catch (error) {
      throw new Error(`Эрх шалгахад алдаа гарлаа: ${error}`);
    }
  }

  // Хэрэглэгчийн мэдээллийг token-оос авах
  static async getUserFromToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as Record<string, unknown>;

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        throw new Error('Хэрэглэгч олдсонгүй');
      }

      return user;
    } catch (error) {
      throw new Error('Буруу эсвэл хугацаа дууссан token');
    }
  }
}
