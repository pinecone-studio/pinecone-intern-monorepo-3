import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/model.user';
import { RegisterInput, LoginInput } from '../generated/types';

const generateToken = (user: IUser): string => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '7d',
  });
};

export const register = async (input: RegisterInput) => {
  try {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new Error('Энэ email-ээр аль хэдийн бүртгэлтэй байна');
    }
    const user = new User({
      email: input.email.toLowerCase(),
      username: input.username,
      phoneNumber: input.phoneNumber,
      role: 'USER',
    });
    user.password = input.password;
    const savedUser = await user.save();
    const token = generateToken(savedUser);
    return {
      token,
      user: savedUser,
    };
  } catch (error) {
    throw new Error(`Бүртгэл үүсгэхэд алдаа гарлаа: ${error}`);
  }
};

export const login = async (input: LoginInput) => {
  try {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new Error('Буруу email эсвэл нууц үг');
    }
    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      throw new Error('Буруу email эсвэл нууц үг');
    }
    const token = generateToken(user);
    return {
      token,
      user,
    };
  } catch (error) {
    throw new Error(`Нэвтрэхэд алдаа гарлаа: ${error}`);
  }
};

export const verifyToken = async (token: string) => {
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
};

export const checkUserRole = async (userId: string, requiredRole: 'USER' | 'ADMIN') => {
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
};

export const getUserFromToken = async (token: string) => {
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
};
