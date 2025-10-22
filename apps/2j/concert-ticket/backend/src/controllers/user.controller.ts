import { Types } from 'mongoose';
import { User } from '../models/model.user';

export interface UpdateUserProfileInput {
  email?: string;
  username?: string;
  phoneNumber?: string;
  address?: string;
}

export class UserController {
  // Хэрэглэгчийн профайл авах
  static async getUserProfile(userId: string) {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Буруу хэрэглэгчийн ID');
      }

      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new Error('Хэрэглэгч олдсонгүй');
      }


      return user;
    } catch (error) {
      throw new Error(`Хэрэглэгчийн профайл авахад алдаа гарлаа: ${error}`);
    }
  }

  // Хэрэглэгчийн профайл шинэчлэх
  static async updateUserProfile(userId: string, updateData: UpdateUserProfileInput) {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Буруу хэрэглэгчийн ID');
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new Error('Хэрэглэгч олдсонгүй');
      }

      return user;
    } catch (error) {
      throw new Error(`Хэрэглэгчийн профайл шинэчлэхэд алдаа гарлаа: ${error}`);
    }
  }

  // Имэйлээр хэрэглэгч хайх
  static async getUserByEmail(email: string) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select('-password');
      return user;
    } catch (error) {
      throw new Error(`Хэрэглэгч хайхад алдаа гарлаа: ${error}`);
    }
  }
}