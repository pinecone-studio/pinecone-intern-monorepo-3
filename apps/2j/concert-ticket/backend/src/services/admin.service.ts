import { User } from '../models/model.user';
import { Artist } from '../models/model.artist';
import { Concert } from '../models/model.concert';
import { TicketCategory } from '../models/model.ticket-category';
import { Booking } from '../models/model.booking';

export class AdminService {
  // Админ статистик мэдээлэл
  static async getAdminStats() {
    try {
      const [
        totalUsers,
        totalArtists,
        totalConcerts,
        totalTicketCategories,
        totalBookings,
        recentBookings,
        revenueStats
      ] = await Promise.all([
        User.countDocuments(),
        Artist.countDocuments(),
        Concert.countDocuments(),
        TicketCategory.countDocuments(),
        Booking.countDocuments(),
        Booking.find({}).sort({ bookingDate: -1 }).limit(10).populate('user', '-password').populate('concert').populate('ticketCategory'),
        Booking.aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totalPrice' },
              averageOrderValue: { $avg: '$totalPrice' },
              pendingRevenue: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'PENDING'] }, '$totalPrice', 0]
                }
              },
              confirmedRevenue: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'CONFIRMED'] }, '$totalPrice', 0]
                }
              }
            }
          }
        ])
      ]);

      const revenue = revenueStats[0] || {
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingRevenue: 0,
        confirmedRevenue: 0
      };

      return {
        overview: {
          totalUsers,
          totalArtists,
          totalConcerts,
          totalTicketCategories,
          totalBookings
        },
        revenue,
        recentBookings
      };
    } catch (error) {
      throw new Error(`Админ статистик авахад алдаа гарлаа: ${error}`);
    }
  }

  // Концертуудын статистик
  static async getConcertStats() {
    try {
      const concertStats = await Concert.aggregate([
        {
          $lookup: {
            from: 'ticketcategories',
            localField: '_id',
            foreignField: 'concert',
            as: 'ticketCategories'
          }
        },
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'concert',
            as: 'bookings'
          }
        },
        {
          $project: {
            name: 1,
            venue: 1,
            date: 1,
            isActive: 1,
            totalTickets: {
              $sum: '$ticketCategories.totalQuantity'
            },
            soldTickets: {
              $sum: '$bookings.quantity'
            },
            totalRevenue: {
              $sum: '$bookings.totalPrice'
            },
            bookingCount: { $size: '$bookings' }
          }
        },
        {
          $sort: { date: 1 }
        }
      ]);

      return concertStats;
    } catch (error) {
      throw new Error(`Концертуудын статистик авахад алдаа гарлаа: ${error}`);
    }
  }

  // Хэрэглэгчдийн статистик
  static async getUserStats() {
    try {
      const userStats = await User.aggregate([
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'user',
            as: 'bookings'
          }
        },
        {
          $project: {
            email: 1,
            username: 1,
            role: 1,
            createdAt: 1,
            totalBookings: { $size: '$bookings' },
            totalSpent: { $sum: '$bookings.totalPrice' },
            lastBookingDate: { $max: '$bookings.bookingDate' }
          }
        },
        {
          $sort: { totalSpent: -1 }
        }
      ]);

      return userStats;
    } catch (error) {
      throw new Error(`Хэрэглэгчдийн статистик авахад алдаа гарлаа: ${error}`);
    }
  }

  // Тасалбарын ангиллуудын статистик
  static async getTicketCategoryStats() {
    try {
      const ticketStats = await TicketCategory.aggregate([
        {
          $lookup: {
            from: 'concerts',
            localField: 'concert',
            foreignField: '_id',
            as: 'concert'
          }
        },
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'ticketCategory',
            as: 'bookings'
          }
        },
        {
          $project: {
            type: 1,
            totalQuantity: 1,
            availableQuantity: 1,
            unitPrice: 1,
            concertName: { $arrayElemAt: ['$concert.name', 0] },
            soldQuantity: { $sum: '$bookings.quantity' },
            revenue: { $sum: '$bookings.totalPrice' },
            occupancyRate: {
              $multiply: [
                {
                  $divide: [
                    { $sum: '$bookings.quantity' },
                    '$totalQuantity'
                  ]
                },
                100
              ]
            }
          }
        },
        {
          $sort: { revenue: -1 }
        }
      ]);

      return ticketStats;
    } catch (error) {
      throw new Error(`Тасалбарын ангиллуудын статистик авахад алдаа гарлаа: ${error}`);
    }
  }

  // Захиалгуудын статистик
  static async getBookingStats() {
    try {
      const bookingStats = await Booking.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $lookup: {
            from: 'concerts',
            localField: 'concert',
            foreignField: '_id',
            as: 'concert'
          }
        },
        {
          $lookup: {
            from: 'ticketcategories',
            localField: 'ticketCategory',
            foreignField: '_id',
            as: 'ticketCategory'
          }
        },
        {
          $project: {
            userEmail: { $arrayElemAt: ['$user.email', 0] },
            concertName: { $arrayElemAt: ['$concert.name', 0] },
            ticketType: { $arrayElemAt: ['$ticketCategory.type', 0] },
            quantity: 1,
            totalPrice: 1,
            status: 1,
            paymentStatus: 1,
            bookingDate: 1
          }
        },
        {
          $sort: { bookingDate: -1 }
        }
      ]);

      return bookingStats;
    } catch (error) {
      throw new Error(`Захиалгуудын статистик авахад алдаа гарлаа: ${error}`);
    }
  }

  // Системийн алдааны мэдээлэл
  static async getSystemHealth() {
    try {
      const dbStats = await Promise.all([
        User.countDocuments(),
        Artist.countDocuments(),
        Concert.countDocuments(),
        TicketCategory.countDocuments(),
        Booking.countDocuments()
      ]);

      const [users, artists, concerts, ticketCategories, bookings] = dbStats;

      // Системийн эрүүл мэндийг шалгах
      const healthChecks = {
        database: {
          status: 'healthy',
          collections: {
            users,
            artists,
            concerts,
            ticketCategories,
            bookings
          }
        },
        memory: {
          status: 'healthy',
          usage: process.memoryUsage()
        },
        uptime: {
          status: 'healthy',
          seconds: process.uptime()
        }
      };

      return healthChecks;
    } catch (error) {
      throw new Error(`Системийн эрүүл мэндийг шалгахад алдаа гарлаа: ${error}`);
    }
  }
}
