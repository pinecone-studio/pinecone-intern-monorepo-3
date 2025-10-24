import { Types } from 'mongoose';
import { Booking, IBooking } from '../models/model.booking';
import { Concert, IConcert } from '../models/model.concert';
import { TicketCategory, ITicketCategory } from '../models/model.ticket-category';
import { User } from '../models/model.user';
import { CreateBookingInput } from '../generated/types';

export class BookingController {
  // Шинэ захиалга үүсгэх
  static async createBooking(userId: string, input: CreateBookingInput) {
    try {
      // Хэрэглэгчийг шалгах
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Хэрэглэгч олдсонгүй');
      }

      // Концертыг шалгах
      const concert = await Concert.findById(input.concertId);
      if (!concert || !concert.isActive) {
        throw new Error('Концерт олдсонгүй эсвэл идэвхгүй байна');
      }

      // Концертын өдөр өнгөрсөн эсэхийг шалгах
      if (concert.date < new Date()) {
        throw new Error('Концертын өдөр өнгөрсөн байна');
      }

      // Ticket category-г шалгах
      const ticketCategory = await TicketCategory.findOne({
        _id: input.ticketCategoryId,
        concert: input.concertId,
      });

      if (!ticketCategory) {
        throw new Error('Тасалбарын ангилал олдсонгүй');
      }

      // Тасалбарын тоо хүрэлцэх эсэхийг шалгах
      if (ticketCategory.availableQuantity < input.quantity) {
        throw new Error('Тасалбарын тоо хүрэлцэхгүй байна');
      }

      // Захиалга үүсгэх
      const booking = new Booking({
        user: userId,
        concert: input.concertId,
        ticketCategory: input.ticketCategoryId,
        quantity: input.quantity,
        unitPrice: ticketCategory.unitPrice,
        totalPrice: ticketCategory.unitPrice * input.quantity,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        canCancel: true,
        cancellationDeadline: new Date(concert.date.getTime() - 24 * 60 * 60 * 1000), // Концертын огнооноос 24 цагийн өмнө
      });

      const savedBooking = await booking.save();

      // Available quantity-г бууруулах
      await TicketCategory.findByIdAndUpdate(input.ticketCategoryId, { $inc: { availableQuantity: -input.quantity } });

      // Populate-тайгаар буцаах
      return await Booking.findById(savedBooking._id)
        .populate('user', '-password')
        .populate({
          path: 'concert',
          populate: {
            path: 'mainArtist',
            model: 'Artist',
          },
        })
        .populate('ticketCategory');
    } catch (error) {
      throw new Error(`Захиалга үүсгэхэд алдаа гарлаа: ${error}`);
    }
  }

  // Хэрэглэгчийн захиалгуудыг авах
  static async getUserBookings(userId: string) {
    try {
      const bookings = await Booking.find({ user: userId })
        .populate({
          path: 'concert',
          populate: {
            path: 'mainArtist',
            model: 'Artist',
          },
        })
        .populate('ticketCategory')
        .sort({ bookingDate: -1 });

      // Нэг захиалгаар олон төрлийн билет захиалсан тохиолдолд нэгтгэх
      interface GroupedBooking {
        id: string;
        orderNumber: string;
        date: string;
        concert: IConcert;
        tickets: Array<{
          id: string;
          type: string;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
        }>;
        totalAmount: number;
        status: string;
        paymentStatus: string;
        canCancel: boolean;
        cancellationDeadline: Date;
      }

      const groupedBookings = bookings.reduce((acc: Record<string, GroupedBooking>, booking: IBooking) => {
        // bookingDate null check
        const bookingDate = booking.bookingDate || new Date();
        const key = `${booking.concert._id}_${bookingDate.toISOString().split('T')[0]}`;

        if (!acc[key]) {
          const concert = booking.concert as unknown as IConcert;
          acc[key] = {
            id: booking._id.toString(),
            orderNumber: `#${booking._id.toString().slice(-4).toUpperCase()}`,
            date: bookingDate.toISOString(),
            concert: concert,
            tickets: [],
            totalAmount: 0,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            canCancel: booking.canCancel,
            cancellationDeadline: booking.cancellationDeadline,
          };
        }

        // Ижил төрлийн билет байвал тоог нэмэх, үгүй бол шинэ нэмэх
        const ticketCategory = booking.ticketCategory as unknown as ITicketCategory;
        const existingTicketIndex = acc[key].tickets.findIndex(
          (ticket: { type: string; unitPrice: number }) => ticket.type === (ticketCategory?.type || 'UNKNOWN') && ticket.unitPrice === (booking.unitPrice || 0)
        );

        if (existingTicketIndex >= 0) {
          // Ижил төрлийн билет байвал тоог нэмэх
          acc[key].tickets[existingTicketIndex].quantity += booking.quantity || 0;
          acc[key].tickets[existingTicketIndex].totalPrice += booking.totalPrice || 0;
        } else {
          // Шинэ төрлийн билет нэмэх
          acc[key].tickets.push({
            id: booking._id.toString(),
            type: ticketCategory?.type || 'UNKNOWN',
            quantity: booking.quantity || 0,
            unitPrice: booking.unitPrice || 0,
            totalPrice: booking.totalPrice || 0,
          });
        }

        acc[key].totalAmount += booking.totalPrice || 0;

        return acc;
      }, {});

      // Object-г array болгох
      return Object.values(groupedBookings);
    } catch (error) {
      throw new Error(`Хэрэглэгчийн захиалгуудыг олоход алдаа гарлаа: ${error}`);
    }
  }

  // Захиалга цуцлах (24 цагийн дотор)
  static async cancelBooking(bookingId: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(bookingId)) {
        throw new Error('Буруу захиалгын ID');
      }

      const booking = await Booking.findOne({
        _id: bookingId,
        user: userId,
      }).populate('ticketCategory');

      if (!booking) {
        throw new Error('Захиалга олдсонгүй');
      }

      // Захиалга цуцлах боломжтой эсэхийг шалгах
      if (!booking.canCancel || booking.status === 'CANCELLED') {
        throw new Error('Энэ захиалгыг цуцлах боломжгүй');
      }

      // Цуцлах хугацаа өнгөрсөн эсэхийг шалгах (24 цагийн дотор)
      if (new Date() > booking.cancellationDeadline) {
        throw new Error('Цуцлах хугацаа өнгөрсөн байна (24 цагийн дотор цуцлах боломжтой)');
      }

      // Захиалгын статусыг өөрчлөх
      booking.status = 'CANCELLED';
      booking.canCancel = false;
      await booking.save();

      // Available quantity-г нэмэгдүүлэх
      await TicketCategory.findByIdAndUpdate(booking.ticketCategory._id, { $inc: { availableQuantity: booking.quantity } });

      return await Booking.findById(bookingId)
        .populate('user', '-password')
        .populate({
          path: 'concert',
          populate: {
            path: 'mainArtist',
            model: 'Artist',
          },
        })
        .populate('ticketCategory');
    } catch (error) {
      throw new Error(`Захиалга цуцлахад алдаа гарлаа: ${error}`);
    }
  }

  // Цуцлах хүсэлт илгээх
  static async requestCancellation(bookingId: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(bookingId)) {
        throw new Error('Буруу захиалгын ID');
      }

      const booking = await Booking.findOne({
        _id: bookingId,
        user: userId,
      });

      if (!booking) {
        throw new Error('Захиалга олдсонгүй');
      }

      // Захиалга цуцлах боломжтой эсэхийг шалгах
      if (!booking.canCancel || booking.status === 'CANCELLED') {
        throw new Error('Энэ захиалгыг цуцлах боломжгүй');
      }

      // Цуцлах хугацаа өнгөрсөн эсэхийг шалгах
      if (new Date() > booking.cancellationDeadline) {
        throw new Error('Цуцлах хугацаа өнгөрсөн байна');
      }

      // Захиалгын статусыг өөрчлөх
      booking.status = 'CANCELLATION_REQUESTED';
      await booking.save();

      return await Booking.findById(bookingId)
        .populate('user', '-password')
        .populate({
          path: 'concert',
          populate: {
            path: 'mainArtist',
            model: 'Artist',
          },
        })
        .populate('ticketCategory');
    } catch (error) {
      throw new Error(`Цуцлах хүсэлт илгээхэд алдаа гарлаа: ${error}`);
    }
  }

  // Бүх захиалгуудыг авах (админ хэрэглэгчдэд зориулсан)
  static async getAllBookings() {
    try {
      const bookings = await Booking.find({})
        .populate('user', '-password')
        .populate({
          path: 'concert',
          populate: {
            path: 'mainArtist',
            model: 'Artist',
          },
        })
        .populate('ticketCategory')
        .sort({ bookingDate: -1 });

      return bookings;
    } catch (error) {
      throw new Error(`Бүх захиалгуудыг олоход алдаа гарлаа: ${error}`);
    }
  }

  // Захиалгын статусыг өөрчлөх (админ хэрэглэгчдэд зориулсан)
  static async updateBookingStatus(bookingId: string, status: string) {
    try {
      if (!Types.ObjectId.isValid(bookingId)) {
        throw new Error('Буруу захиалгын ID');
      }

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error('Захиалга олдсонгүй');
      }

      // Статусыг өөрчлөх
      booking.status = status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'CANCELLATION_REQUESTED';
      if (status === 'CANCELLED') {
        booking.canCancel = false;
      }
      await booking.save();

      return await Booking.findById(bookingId)
        .populate('user', '-password')
        .populate({
          path: 'concert',
          populate: {
            path: 'mainArtist',
            model: 'Artist',
          },
        })
        .populate('ticketCategory');
    } catch (error) {
      throw new Error(`Захиалгын статус өөрчлөхөд алдаа гарлаа: ${error}`);
    }
  }

  // Захиалгын төлбөрийн статус өөрчлөх
  static async updateBookingPaymentStatus(bookingId: string, paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED') {
    try {
      console.log('🔵 updateBookingPaymentStatus called:', { bookingId, paymentStatus });
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error('Захиалга олдсонгүй');
      }

      console.log('🔵 Current booking status:', { status: booking.status, paymentStatus: booking.paymentStatus });

      // Төлбөрийн статусыг өөрчлөх
      booking.paymentStatus = paymentStatus;

      // Төлбөр амжилттай болсны дараа захиалгын статусыг CONFIRMED болгох
      if (paymentStatus === 'COMPLETED') {
        booking.status = 'CONFIRMED';
        console.log('🔵 Updated booking status to CONFIRMED');

        // Билетний боломжит тоо хасах
        const ticketCategory = await TicketCategory.findById(booking.ticketCategory);
        if (ticketCategory) {
          ticketCategory.availableQuantity -= booking.quantity;
          if (ticketCategory.availableQuantity < 0) {
            ticketCategory.availableQuantity = 0;
          }
          await ticketCategory.save();
        }
      }

      await booking.save();
      console.log('🔵 Booking saved successfully');

      const updatedBooking = await Booking.findById(bookingId)
        .populate('user', '-password')
        .populate({
          path: 'concert',
          populate: {
            path: 'mainArtist',
            model: 'Artist',
          },
        })
        .populate('ticketCategory');
      
      console.log('🔵 Returning updated booking:', { 
        id: updatedBooking?.id, 
        status: updatedBooking?.status, 
        paymentStatus: updatedBooking?.paymentStatus 
      });
      
      return updatedBooking;
    } catch (error) {
      console.error('🔴 Error in updateBookingPaymentStatus:', error);
      throw new Error(`Захиалгын төлбөрийн статус өөрчлөхөд алдаа гарлаа: ${error}`);
    }
  }

  // Захиалгын статистик мэдээлэл
  static async getBookingStats() {
    try {
      const stats = await Booking.aggregate([
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' },
            pendingBookings: {
              $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] },
            },
            confirmedBookings: {
              $sum: { $cond: [{ $eq: ['$status', 'CONFIRMED'] }, 1, 0] },
            },
            cancelledBookings: {
              $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] },
            },
          },
        },
      ]);

      return (
        stats[0] || {
          totalBookings: 0,
          totalRevenue: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          cancelledBookings: 0,
        }
      );
    } catch (error) {
      throw new Error(`Захиалгын статистик олоход алдаа гарлаа: ${error}`);
    }
  }
}
