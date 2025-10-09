import { User } from '../models/model.user';
import { Artist } from '../models/model.artist';
import { Concert } from '../models/model.concert';
import { TicketCategory } from '../models/model.ticket-category';
import { Booking } from '../models/model.booking';

export class DataSeedingService {
  // Анхны өгөгдөл үүсгэх
  static async seedInitialData() {
    try {
      console.log('Анхны өгөгдөл үүсгэж эхлэж байна...');

      // Хэрэглэгчдийг үүсгэх
      await this.seedUsers();
      
      // Дуучнуудыг үүсгэх
      await this.seedArtists();
      
      // Концертуудыг үүсгэх
      await this.seedConcerts();
      
      // Тасалбарын ангиллуудыг үүсгэх
      await this.seedTicketCategories();
      
      // Захиалгуудыг үүсгэх
      await this.seedBookings();

      console.log('Анхны өгөгдөл амжилттай үүсгэгдлээ!');
    } catch (error) {
      console.error('Анхны өгөгдөл үүсгэхэд алдаа гарлаа:', error);
      throw error;
    }
  }

  // Хэрэглэгчдийг үүсгэх
  private static async seedUsers() {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Хэрэглэгчид аль хэдийн байна, алгасах...');
      return;
    }

    const users = [
      {
        email: 'admin@concert.com',
        username: 'Админ',
        phoneNumber: '99119911',
        address: 'Улаанбаатар хот',
        role: 'ADMIN',
        password: 'admin123'
      },
      {
        email: 'user1@concert.com',
        username: 'Батбаяр',
        phoneNumber: '99119912',
        address: 'Улаанбаатар хот, Сүхбаатар дүүрэг',
        role: 'USER',
        password: 'user123'
      },
      {
        email: 'user2@concert.com',
        username: 'Сара',
        phoneNumber: '99119913',
        address: 'Улаанбаатар хот, Хан-Уул дүүрэг',
        role: 'USER',
        password: 'user123'
      },
      {
        email: 'user3@concert.com',
        username: 'Төмөр',
        phoneNumber: '99119914',
        address: 'Улаанбаатар хот, Баянгол дүүрэг',
        role: 'USER',
        password: 'user123'
      }
    ];

    await User.insertMany(users);
    console.log(`${users.length} хэрэглэгч үүсгэгдлээ`);
  }

  // Дуучнуудыг үүсгэх
  private static async seedArtists() {
    const existingArtists = await Artist.countDocuments();
    if (existingArtists > 0) {
      console.log('Дуучнууд аль хэдийн байна, алгасах...');
      return;
    }

    const artists = [
      {
        name: 'The Hu',
        bio: 'Монголын алдартай рок хамтлаг. Монголын уламжлалт хөгжим болон рок хөгжмийг хослуулсан тусгай хөгжмийн хэв маягтай.',
        image: 'https://example.com/the-hu.jpg'
      },
      {
        name: 'Алтан Ураг',
        bio: 'Монголын алдартай поп хамтлаг. Залуучуудын дунд маш алдартай.',
        image: 'https://example.com/altan-uraag.jpg'
      },
      {
        name: 'Батбаяр',
        bio: 'Монголын алдартай дуучин. Уламжлалт болон орчин үеийн хөгжмийг хослуулсан.',
        image: 'https://example.com/batbayar.jpg'
      },
      {
        name: 'Сара',
        bio: 'Монголын алдартай эмэгтэй дуучин. Поп болон R&B хөгжмийн хэв маягтай.',
        image: 'https://example.com/sara.jpg'
      },
      {
        name: 'Төмөр',
        bio: 'Монголын алдартай рэп дуучин. Залуучуудын дунд маш алдартай.',
        image: 'https://example.com/tomor.jpg'
      }
    ];

    await Artist.insertMany(artists);
    console.log(`${artists.length} дуучин үүсгэгдлээ`);
  }

  // Концертуудыг үүсгэх
  private static async seedConcerts() {
    const existingConcerts = await Concert.countDocuments();
    if (existingConcerts > 0) {
      console.log('Концертууд аль хэдийн байна, алгасах...');
      return;
    }

    const artists = await Artist.find({});
    if (artists.length === 0) {
      throw new Error('Дуучнууд олдсонгүй');
    }

    const concerts = [
      {
        name: 'The Hu - Монголын эрхэмдээ',
        description: 'Монголын алдартай рок хамтлаг The Hu-гийн томоохон концерт. Монголын уламжлалт хөгжим болон рок хөгжмийг хослуулсан тусгай хөгжмийн хэв маягтай.',
        venue: 'Улаанбаатар хотын төв талбай',
        date: new Date('2024-06-15'),
        time: '19:00',
        mainArtist: artists[0]._id,
        otherArtists: [artists[1]._id],
        image: 'https://example.com/the-hu-concert.jpg',
        isActive: true
      },
      {
        name: 'Алтан Ураг - Залуучуудын дуу',
        description: 'Монголын алдартай поп хамтлаг Алтан Ураг-ийн концерт. Залуучуудын дунд маш алдартай.',
        venue: 'Улаанбаатар хотын спорт ордон',
        date: new Date('2024-07-20'),
        time: '20:00',
        mainArtist: artists[1]._id,
        otherArtists: [artists[2]._id, artists[3]._id],
        image: 'https://example.com/altan-uraag-concert.jpg',
        isActive: true
      },
      {
        name: 'Батбаяр - Уламжлалт хөгжим',
        description: 'Монголын алдартай дуучин Батбаярын концерт. Уламжлалт болон орчин үеийн хөгжмийг хослуулсан.',
        venue: 'Улаанбаатар хотын театр',
        date: new Date('2024-08-10'),
        time: '18:30',
        mainArtist: artists[2]._id,
        otherArtists: [],
        image: 'https://example.com/batbayar-concert.jpg',
        isActive: true
      },
      {
        name: 'Сара - Эмэгтэйчүүдийн дуу',
        description: 'Монголын алдартай эмэгтэй дуучин Сарагийн концерт. Поп болон R&B хөгжмийн хэв маягтай.',
        venue: 'Улаанбаатар хотын клуб',
        date: new Date('2024-09-05'),
        time: '21:00',
        mainArtist: artists[3]._id,
        otherArtists: [artists[4]._id],
        image: 'https://example.com/sara-concert.jpg',
        isActive: true
      }
    ];

    await Concert.insertMany(concerts);
    console.log(`${concerts.length} концерт үүсгэгдлээ`);
  }

  // Тасалбарын ангиллуудыг үүсгэх
  private static async seedTicketCategories() {
    const existingTicketCategories = await TicketCategory.countDocuments();
    if (existingTicketCategories > 0) {
      console.log('Тасалбарын ангиллууд аль хэдийн байна, алгасах...');
      return;
    }

    const concerts = await Concert.find({});
    if (concerts.length === 0) {
      throw new Error('Концертууд олдсонгүй');
    }

    const ticketCategories = [];

    for (const concert of concerts) {
      // VIP тасалбар
      ticketCategories.push({
        type: 'VIP',
        totalQuantity: 50,
        availableQuantity: 50,
        unitPrice: 150000,
        description: 'VIP тасалбар - хамгийн сайн байрлал, тусгай үйлчилгээ',
        features: ['Хамгийн сайн байрлал', 'Тусгай үйлчилгээ', 'Арын талбай', 'Тусгай орц'],
        concert: concert._id
      });

      // Regular тасалбар
      ticketCategories.push({
        type: 'REGULAR',
        totalQuantity: 200,
        availableQuantity: 200,
        unitPrice: 80000,
        description: 'Энгийн тасалбар - сайн байрлал, хямд үнэ',
        features: ['Сайн байрлал', 'Хямд үнэ', 'Арын талбай'],
        concert: concert._id
      });

      // General Admission тасалбар
      ticketCategories.push({
        type: 'GENERAL_ADMISSION',
        totalQuantity: 300,
        availableQuantity: 300,
        unitPrice: 50000,
        description: 'Ерөнхий тасалбар - хамгийн хямд үнэ',
        features: ['Хамгийн хямд үнэ', 'Ерөнхий байрлал'],
        concert: concert._id
      });
    }

    await TicketCategory.insertMany(ticketCategories);
    console.log(`${ticketCategories.length} тасалбарын ангилал үүсгэгдлээ`);
  }

  // Захиалгуудыг үүсгэх
  private static async seedBookings() {
    const existingBookings = await Booking.countDocuments();
    if (existingBookings > 0) {
      console.log('Захиалгууд аль хэдийн байна, алгасах...');
      return;
    }

    const users = await User.find({ role: 'USER' });
    const ticketCategories = await TicketCategory.find({});

    if (users.length === 0 || ticketCategories.length === 0) {
      console.log('Захиалга үүсгэхэд хэрэгтэй өгөгдөл байхгүй байна');
      return;
    }

    const bookings = [];

    // Зарим хэрэглэгчдэд захиалга үүсгэх
    for (let i = 0; i < Math.min(users.length, 3); i++) {
      const user = users[i];
      const ticketCategory = ticketCategories[i * 3]; // VIP тасалбар
      
      bookings.push({
        user: user._id,
        concert: ticketCategory.concert,
        ticketCategory: ticketCategory._id,
        quantity: Math.floor(Math.random() * 3) + 1, // 1-3 тасалбар
        unitPrice: ticketCategory.unitPrice,
        totalPrice: ticketCategory.unitPrice * (Math.floor(Math.random() * 3) + 1),
        status: 'CONFIRMED',
        paymentStatus: 'COMPLETED',
        canCancel: true,
        cancellationDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        bookingDate: new Date()
      });
    }

    if (bookings.length > 0) {
      await Booking.insertMany(bookings);
      
      // Available quantity-г шинэчлэх
      for (const booking of bookings) {
        await TicketCategory.findByIdAndUpdate(
          booking.ticketCategory,
          { $inc: { availableQuantity: -booking.quantity } }
        );
      }
      
      console.log(`${bookings.length} захиалга үүсгэгдлээ`);
    }
  }

  // Бүх өгөгдлийг цэвэрлэх
  static async clearAllData() {
    try {
      console.log('Бүх өгөгдлийг цэвэрлэж байна...');
      
      await Booking.deleteMany({});
      await TicketCategory.deleteMany({});
      await Concert.deleteMany({});
      await Artist.deleteMany({});
      await User.deleteMany({});
      
      console.log('Бүх өгөгдөл амжилттай цэвэрлэгдлээ!');
    } catch (error) {
      console.error('Өгөгдөл цэвэрлэхэд алдаа гарлаа:', error);
      throw error;
    }
  }

  // Өгөгдлийн статистик
  static async getDataStats() {
    try {
      const stats = {
        users: await User.countDocuments(),
        artists: await Artist.countDocuments(),
        concerts: await Concert.countDocuments(),
        ticketCategories: await TicketCategory.countDocuments(),
        bookings: await Booking.countDocuments()
      };

      return stats;
    } catch (error) {
      console.error('Статистик авахад алдаа гарлаа:', error);
      throw error;
    }
  }
}
