import { Types } from 'mongoose';
import { User, IUser } from '../models/model.user';
import { Booking } from '../models/model.booking';
import { UpdateUserInput, PaginationInput } from '../generated/types';

export class UserController {
  // Бүх хэрэглэгчдийг авах (админ хэрэглэгчдэд зориулсан)
  static async getUsers(pagination?: PaginationInput) {
    try {
      const limit = pagination?.limit || 10;
      const offset = pagination?.offset || 0;

      const users = await User.find({})
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

      return users;
    } catch (error) {
      throw new Error(`Хэрэглэгчдийг олоход алдаа гарлаа: ${error}`);
    }
  }

  // Нэг хэрэглэгчийг ID-аар олох
  static async getUserById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Буруу хэрэглэгчийн ID');
      }

      const user = await User.findById(id).select('-password');
      if (!user) {
        throw new Error('Хэрэглэгч олдсонгүй');
      }

      return user;
    } catch (error) {
      throw new Error(`Хэрэглэгч олоход алдаа гарлаа: ${error}`);
    }
  }

  // Хэрэглэгчийн мэдээллийг засах
  static async updateUserProfile(userId: string, input: UpdateUserInput) {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Буруу хэрэглэгчийн ID');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Хэрэглэгч олдсонгүй');
      }

      // Зөвхөн өөрчлөгдсөн талбаруудыг шинэчлэх
      const updateData: any = {};
      if (input.username !== undefined) updateData.username = input.username;
      if (input.phoneNumber !== undefined) updateData.phoneNumber = input.phoneNumber;
      if (input.address !== undefined) updateData.address = input.address;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      ).select('-password');

      return updatedUser;
    } catch (error) {
      throw new Error(`Хэрэглэгчийн мэдээлэл засахдаа алдаа гарлаа: ${error}`);
    }
  }

  // Хэрэглэгчийн захиалгуудыг авах
  static async getUserBookings(userId: string) {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Буруу хэрэглэгчийн ID');
      }

      const bookings = await Booking.find({ user: userId })
        .populate('concert')
        .populate('ticketCategory')
        .sort({ bookingDate: -1 });

      return bookings;
    } catch (error) {
      throw new Error(`Хэрэглэгчийн захиалгуудыг олоход алдаа гарлаа: ${error}`);
    }
  }

  // Хэрэглэгчийн статистик мэдээлэл
  static async getUserStats(userId: string) {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Буруу хэрэглэгчийн ID');
      }

      const stats = await Booking.aggregate([
        { $match: { user: new Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalSpent: { $sum: '$totalPrice' },
            confirmedBookings: {
              $sum: { $cond: [{ $eq: ['$status', 'CONFIRMED'] }, 1, 0] }
            },
            cancelledBookings: {
              $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        totalBookings: 0,
        totalSpent: 0,
        confirmedBookings: 0,
        cancelledBookings: 0
      };
    } catch (error) {
      throw new Error(`Хэрэглэгчийн статистик олоход алдаа гарлаа: ${error}`);
    }
  }

  // Хэрэглэгчийн ролийг өөрчлөх (админ хэрэглэгчдэд зориулсан)
  static async updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Буруу хэрэглэгчийн ID');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Хэрэглэгч олдсонгүй');
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      ).select('-password');

      return updatedUser;
    } catch (error) {
      throw new Error(`Хэрэглэгчийн ролийг өөрчлөхөд алдаа гарлаа: ${error}`);
    }
  }

  // Хэрэглэгчийг устгах (админ хэрэглэгчдэд зориулсан)
  static async deleteUser(userId: string) {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Буруу хэрэглэгчийн ID');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Хэрэглэгч олдсонгүй');
      }

      // Хэрэглэгчийн захиалгуудыг шалгах
      const activeBookings = await Booking.find({
        user: userId,
        status: { $in: ['PENDING', 'CONFIRMED'] }
      });

      if (activeBookings.length > 0) {
        throw new Error('Идэвхтэй захиалгатай хэрэглэгчийг устгах боломжгүй');
      }

      // Хэрэглэгчийн захиалгуудыг устгах
      await Booking.deleteMany({ user: userId });

      // Хэрэглэгчийг устгах
      await User.findByIdAndDelete(userId);

      return true;
    } catch (error) {
      throw new Error(`Хэрэглэгч устгахад алдаа гарлаа: ${error}`);
    }
  }
}
