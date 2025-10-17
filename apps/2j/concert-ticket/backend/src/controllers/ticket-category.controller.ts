import { Types } from 'mongoose';
import { TicketCategory } from '../models/model.ticket-category';

export class TicketCategoryController {
  // Тасалбарын ангилалыг ID-аар олох
  static async getTicketCategoryById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Буруу тасалбарын ангиллын ID');
      }

      const ticketCategory = await TicketCategory.findById(id)
        .populate('concert');

      if (!ticketCategory) {
        throw new Error('Тасалбарын ангилал олдсонгүй');
      }

      return ticketCategory;
    } catch (error) {
      throw new Error(`Тасалбарын ангилал олоход алдаа гарлаа: ${error}`);
    }
  }

  // Концертын тасалбарын ангиллуудыг авах
  static async getConcertTicketCategories(concertId: string) {
    try {
      if (!Types.ObjectId.isValid(concertId)) {
        throw new Error('Буруу концертын ID');
      }

      const ticketCategories = await TicketCategory.find({ concert: concertId })
        .sort({ unitPrice: 1 });

      return ticketCategories;
    } catch (error) {
      throw new Error(`Концертын тасалбарын ангиллуудыг олоход алдаа гарлаа: ${error}`);
    }
  }

  // Тасалбарын боломжийг шалгах
  static async checkTicketAvailability(concertId: string, ticketCategoryId: string) {
    try {
      if (!Types.ObjectId.isValid(concertId) || !Types.ObjectId.isValid(ticketCategoryId)) {
        throw new Error('Буруу ID');
      }

      const ticketCategory = await TicketCategory.findOne({
        _id: ticketCategoryId,
        concert: concertId
      });

      if (!ticketCategory) {
        throw new Error('Тасалбарын ангилал олдсонгүй');
      }

      return ticketCategory;
    } catch (error) {
      throw new Error(`Тасалбарын боломж шалгахад алдаа гарлаа: ${error}`);
    }
  }

  // Тасалбарын тоог өөрчлөх (админ хэрэглэгчдэд зориулсан)
  static async updateTicketQuantity(ticketCategoryId: string, newQuantity: number) {
    try {
      if (!Types.ObjectId.isValid(ticketCategoryId)) {
        throw new Error('Буруу тасалбарын ангиллын ID');
      }

      if (newQuantity < 0) {
        throw new Error('Тасалбарын тоо сөрөг байж болохгүй');
      }

      const ticketCategory = await TicketCategory.findById(ticketCategoryId);
      if (!ticketCategory) {
        throw new Error('Тасалбарын ангилал олдсонгүй');
      }

      // Шинэ тоо нь одоогийн available quantity-ээс бага байвал алдаа
      if (newQuantity < ticketCategory.totalQuantity - ticketCategory.availableQuantity) {
        throw new Error('Шинэ тоо захиалсан тасалбарын тооноос бага байж болохгүй');
      }

      // Available quantity-г тооцоолох
      const soldQuantity = ticketCategory.totalQuantity - ticketCategory.availableQuantity;
      const newAvailableQuantity = newQuantity - soldQuantity;

      const updatedTicketCategory = await TicketCategory.findByIdAndUpdate(
        ticketCategoryId,
        {
          totalQuantity: newQuantity,
          availableQuantity: newAvailableQuantity
        },
        { new: true }
      ).populate('concert');

      return updatedTicketCategory;
    } catch (error) {
      throw new Error(`Тасалбарын тоо өөрчлөхөд алдаа гарлаа: ${error}`);
    }
  }

  // Тасалбарын үнийг өөрчлөх (админ хэрэглэгчдэд зориулсан)
  static async updateTicketPrice(ticketCategoryId: string, newPrice: number) {
    try {
      if (!Types.ObjectId.isValid(ticketCategoryId)) {
        throw new Error('Буруу тасалбарын ангиллын ID');
      }

      if (newPrice < 0) {
        throw new Error('Тасалбарын үнэ сөрөг байж болохгүй');
      }

      const ticketCategory = await TicketCategory.findById(ticketCategoryId);
      if (!ticketCategory) {
        throw new Error('Тасалбарын ангилал олдсонгүй');
      }

      const updatedTicketCategory = await TicketCategory.findByIdAndUpdate(
        ticketCategoryId,
        { unitPrice: newPrice },
        { new: true }
      ).populate('concert');

      return updatedTicketCategory;
    } catch (error) {
      throw new Error(`Тасалбарын үнэ өөрчлөхөд алдаа гарлаа: ${error}`);
    }
  }

  // Тасалбарын ангиллын мэдээллийг засах
  static async updateTicketCategory(ticketCategoryId: string, updateData: Partial<ITicketCategory>) {
    try {
      if (!Types.ObjectId.isValid(ticketCategoryId)) {
        throw new Error('Буруу тасалбарын ангиллын ID');
      }

      const ticketCategory = await TicketCategory.findById(ticketCategoryId);
      if (!ticketCategory) {
        throw new Error('Тасалбарын ангилал олдсонгүй');
      }

      // Зөвхөн өөрчлөгдсөн талбаруудыг шинэчлэх
      const allowedUpdates = ['description', 'features'];
      const updates: any = {};

      allowedUpdates.forEach(field => {
        if (updateData[field as keyof ITicketCategory] !== undefined) {
          updates[field] = updateData[field as keyof ITicketCategory];
        }
      });

      const updatedTicketCategory = await TicketCategory.findByIdAndUpdate(
        ticketCategoryId,
        updates,
        { new: true }
      ).populate('concert');

      return updatedTicketCategory;
    } catch (error) {
      throw new Error(`Тасалбарын ангиллын мэдээлэл засахдаа алдаа гарлаа: ${error}`);
    }
  }

  // Тасалбарын ангиллыг устгах
  static async deleteTicketCategory(ticketCategoryId: string) {
    try {
      if (!Types.ObjectId.isValid(ticketCategoryId)) {
        throw new Error('Буруу тасалбарын ангиллын ID');
      }

      const ticketCategory = await TicketCategory.findById(ticketCategoryId);
      if (!ticketCategory) {
        throw new Error('Тасалбарын ангилал олдсонгүй');
      }

      // Захиалгатай тасалбарын ангиллыг устгах боломжгүй
      const soldQuantity = ticketCategory.totalQuantity - ticketCategory.availableQuantity;
      if (soldQuantity > 0) {
        throw new Error('Захиалгатай тасалбарын ангиллыг устгах боломжгүй');
      }

      await TicketCategory.findByIdAndDelete(ticketCategoryId);
      return true;
    } catch (error) {
      throw new Error(`Тасалбарын ангилал устгахад алдаа гарлаа: ${error}`);
    }
  }

  // Бүх тасалбарын ангиллуудыг авах (админ хэрэглэгчдэд зориулсан)
  static async getAllTicketCategories() {
    try {
      const ticketCategories = await TicketCategory.find({})
        .populate('concert')
        .sort({ createdAt: -1 });

      return ticketCategories;
    } catch (error) {
      throw new Error(`Бүх тасалбарын ангиллуудыг олоход алдаа гарлаа: ${error}`);
    }
  }
}
