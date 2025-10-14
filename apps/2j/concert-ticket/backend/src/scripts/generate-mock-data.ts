import { connectToDb } from '../utils/connect-to-db';
import { User } from '../models/model.user';
import { Artist } from '../models/model.artist';
import { Concert } from '../models/model.concert';
import { TicketCategory } from '../models/model.ticket-category';
import { Booking } from '../models/model.booking';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env файл унших
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Илүү дэлгэрэнгүй mock data үүсгэх
async function generateMockData() {
  try {
    console.log('🎭 Дэлгэрэнгүй mock data үүсгэж эхлэж байна...');
    
    // Environment variables тохируулах
    if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
      process.env.MONGO_URI = 'mongodb://localhost:27017/concert-ticket';
      console.log('⚠️  MONGODB_URI тохируулагдаагүй, default утга ашиглаж байна');
    }
    
    // MONGODB_URI-г MONGO_URI болгон хувиргах
    if (process.env.MONGODB_URI && !process.env.MONGO_URI) {
      process.env.MONGO_URI = process.env.MONGODB_URI;
    }
    
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'fallback-secret-key-for-development';
      console.log('⚠️  JWT_SECRET тохируулагдаагүй, default утга ашиглаж байна');
    }
    
    // Database холбоос үүсгэх
    await connectToDb();
    console.log('✅ Database холбогдлоо');

    // Өмнөх өгөгдлийг цэвэрлэх
    await clearExistingData();
    console.log('🧹 Өмнөх өгөгдөл цэвэрлэгдлээ');

    // Хэрэглэгчдийг үүсгэх
    const users = await createMockUsers();
    console.log(`👥 ${users.length} хэрэглэгч үүсгэгдлээ`);

    // Дуучнуудыг үүсгэх
    const artists = await createMockArtists();
    console.log(`🎤 ${artists.length} дуучин үүсгэгдлээ`);

    // Концертуудыг үүсгэх
    const concerts = await createMockConcerts(artists);
    console.log(`🎵 ${concerts.length} концерт үүсгэгдлээ`);

    // Тасалбарын ангиллуудыг үүсгэх
    const ticketCategories = await createMockTicketCategories(concerts);
    console.log(`🎫 ${ticketCategories.length} тасалбарын ангилал үүсгэгдлээ`);

    // Захиалгуудыг үүсгэх
    const bookings = await createMockBookings(users, ticketCategories);
    console.log(`📋 ${bookings.length} захиалга үүсгэгдлээ`);

    // Статистик харах
    await showStats();

    console.log('\n🎉 Дэлгэрэнгүй mock data амжилттай үүсгэгдлээ!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Mock data үүсгэхэд алдаа гарлаа:', error);
    process.exit(1);
  }
}

// Өмнөх өгөгдлийг цэвэрлэх
async function clearExistingData() {
  await Booking.deleteMany({});
  await TicketCategory.deleteMany({});
  await Concert.deleteMany({});
  await Artist.deleteMany({});
  await User.deleteMany({});
}

// Mock хэрэглэгчдийг үүсгэх
async function createMockUsers() {
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
    },
    {
      email: 'user4@concert.com',
      username: 'Оюунчимэг',
      phoneNumber: '99119915',
      address: 'Улаанбаатар хот, Чингэлтэй дүүрэг',
      role: 'USER',
      password: 'user123'
    },
    {
      email: 'user5@concert.com',
      username: 'Баттулга',
      phoneNumber: '99119916',
      address: 'Улаанбаатар хот, Сонгинохайрхан дүүрэг',
      role: 'USER',
      password: 'user123'
    }
  ];

  return await User.insertMany(users);
}

// Mock дуучнуудыг үүсгэх
async function createMockArtists() {
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
    },
    {
      name: 'Оюунчимэг',
      bio: 'Монголын алдартай эмэгтэй дуучин. Уламжлалт хөгжмийн хэв маягтай.',
      image: 'https://example.com/oyunchimeg.jpg'
    },
    {
      name: 'Баттулга',
      bio: 'Монголын алдартай дуучин. Поп болон рок хөгжмийн хэв маягтай.',
      image: 'https://example.com/battulga.jpg'
    },
    {
      name: 'Мөнхбаяр',
      bio: 'Монголын алдартай дуучин. Уламжлалт болон орчин үеийн хөгжмийг хослуулсан.',
      image: 'https://example.com/munkhbayar.jpg'
    }
  ];

  return await Artist.insertMany(artists);
}

// Mock концертуудыг үүсгэх
async function createMockConcerts(artists: any[]) {
  const venues = [
    'Улаанбаатар хотын төв талбай',
    'Улаанбаатар хотын спорт ордон',
    'Улаанбаатар хотын театр',
    'Улаанбаатар хотын клуб',
    'Улаанбаатар хотын концертын танхим',
    'Улаанбаатар хотын их сургуулийн танхим'
  ];

  const concerts = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 12; i++) {
    const mainArtist = artists[Math.floor(Math.random() * artists.length)];
    const otherArtists = artists
      .filter(a => a._id.toString() !== mainArtist._id.toString())
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    const concertDate = new Date(currentDate);
    concertDate.setDate(concertDate.getDate() + (i * 15) + Math.floor(Math.random() * 30));

    concerts.push({
      name: `${mainArtist.name} - ${getConcertTitle()}`,
      description: `${mainArtist.name}-гийн томоохон концерт. ${mainArtist.bio}`,
      venue: venues[Math.floor(Math.random() * venues.length)],
      date: concertDate,
      time: getRandomTime(),
      mainArtist: mainArtist._id,
      otherArtists: otherArtists.map(a => a._id),
      image: `https://example.com/concert-${i + 1}.jpg`,
      isActive: true
    });
  }

  return await Concert.insertMany(concerts);
}

// Mock тасалбарын ангиллуудыг үүсгэх
async function createMockTicketCategories(concerts: any[]) {
  const ticketCategories = [];

  for (const concert of concerts) {
    // VIP тасалбар
    ticketCategories.push({
      type: 'VIP',
      totalQuantity: Math.floor(Math.random() * 50) + 30,
      availableQuantity: 0, // Дараа тооцоолно
      unitPrice: Math.floor(Math.random() * 100000) + 100000,
      description: 'VIP тасалбар - хамгийн сайн байрлал, тусгай үйлчилгээ',
      features: ['Хамгийн сайн байрлал', 'Тусгай үйлчилгээ', 'Арын талбай', 'Тусгай орц'],
      concert: concert._id
    });

    // Regular тасалбар
    ticketCategories.push({
      type: 'REGULAR',
      totalQuantity: Math.floor(Math.random() * 200) + 100,
      availableQuantity: 0, // Дараа тооцоолно
      unitPrice: Math.floor(Math.random() * 50000) + 50000,
      description: 'Энгийн тасалбар - сайн байрлал, хямд үнэ',
      features: ['Сайн байрлал', 'Хямд үнэ', 'Арын талбай'],
      concert: concert._id
    });

    // General Admission тасалбар
    ticketCategories.push({
      type: 'GENERAL_ADMISSION',
      totalQuantity: Math.floor(Math.random() * 300) + 200,
      availableQuantity: 0, // Дараа тооцоолно
      unitPrice: Math.floor(Math.random() * 30000) + 20000,
      description: 'Ерөнхий тасалбар - хамгийн хямд үнэ',
      features: ['Хамгийн хямд үнэ', 'Ерөнхий байрлал'],
      concert: concert._id
    });
  }

  const createdCategories = await TicketCategory.insertMany(ticketCategories);
  
  // Available quantity-г тохируулах
  for (const category of createdCategories) {
    category.availableQuantity = category.totalQuantity;
    await category.save();
  }

  return createdCategories;
}

// Mock захиалгуудыг үүсгэх
async function createMockBookings(users: any[], ticketCategories: any[]) {
  const bookings = [];
  const userUsers = users.filter(u => u.role === 'USER');

  for (let i = 0; i < 50; i++) {
    const user = userUsers[Math.floor(Math.random() * userUsers.length)];
    const ticketCategory = ticketCategories[Math.floor(Math.random() * ticketCategories.length)];
    const quantity = Math.floor(Math.random() * 4) + 1;

    // Тасалбарын тоо хүрэлцэх эсэхийг шалгах
    if (ticketCategory.availableQuantity >= quantity) {
      const booking = {
        user: user._id,
        concert: ticketCategory.concert,
        ticketCategory: ticketCategory._id,
        quantity,
        unitPrice: ticketCategory.unitPrice,
        totalPrice: ticketCategory.unitPrice * quantity,
        status: getRandomStatus(),
        paymentStatus: getRandomPaymentStatus(),
        canCancel: Math.random() > 0.3,
        cancellationDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        bookingDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      };

      bookings.push(booking);

      // Available quantity-г бууруулах
      ticketCategory.availableQuantity -= quantity;
      await ticketCategory.save();
    }
  }

  return await Booking.insertMany(bookings);
}

// Туслах функцууд
function getConcertTitle() {
  const titles = [
    'Монголын эрхэмдээ',
    'Залуучуудын дуу',
    'Уламжлалт хөгжим',
    'Эмэгтэйчүүдийн дуу',
    'Рок хөгжмийн орой',
    'Поп хөгжмийн тоглолт',
    'Уламжлалт болон орчин үеийн хөгжим',
    'Хөгжмийн наадам'
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomTime() {
  const times = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
  return times[Math.floor(Math.random() * times.length)];
}

function getRandomStatus() {
  const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
  const weights = [0.2, 0.7, 0.1]; // 20% pending, 70% confirmed, 10% cancelled
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return statuses[i];
    }
  }
  return 'CONFIRMED';
}

function getRandomPaymentStatus() {
  const statuses = ['PENDING', 'COMPLETED', 'FAILED'];
  const weights = [0.1, 0.85, 0.05]; // 10% pending, 85% completed, 5% failed
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return statuses[i];
    }
  }
  return 'COMPLETED';
}

// Статистик харуулах
async function showStats() {
  const stats = {
    users: await User.countDocuments(),
    artists: await Artist.countDocuments(),
    concerts: await Concert.countDocuments(),
    ticketCategories: await TicketCategory.countDocuments(),
    bookings: await Booking.countDocuments()
  };

  console.log('\n📊 Өгөгдлийн статистик:');
  console.log(`👥 Хэрэглэгчид: ${stats.users}`);
  console.log(`🎤 Дуучнууд: ${stats.artists}`);
  console.log(`🎵 Концертууд: ${stats.concerts}`);
  console.log(`🎫 Тасалбарын ангиллууд: ${stats.ticketCategories}`);
  console.log(`📋 Захиалгууд: ${stats.bookings}`);

  console.log('\n📝 Тест хийхэд зориулсан хэрэглэгчдийн мэдээлэл:');
  console.log('👤 Админ: admin@concert.com / admin123');
  console.log('👤 Хэрэглэгч 1: user1@concert.com / user123');
  console.log('👤 Хэрэглэгч 2: user2@concert.com / user123');
  console.log('👤 Хэрэглэгч 3: user3@concert.com / user123');
  console.log('👤 Хэрэглэгч 4: user4@concert.com / user123');
  console.log('👤 Хэрэглэгч 5: user5@concert.com / user123');
}

// Script ажиллуулах
if (require.main === module) {
  generateMockData();
}

export { generateMockData };
