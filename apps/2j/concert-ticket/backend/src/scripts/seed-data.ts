import { connectToDb } from '../utils/connect-to-db';
import { DataSeedingService } from '../services/data-seeding.service';

// MongoDB-д mock data үүсгэх script
async function seedMockData() {
  try {
    console.log('🚀 Mock data үүсгэж эхлэж байна...');
    
    // Environment variables тохируулах
    if (!process.env.MONGO_URI) {
      process.env.MONGO_URI = 'mongodb://localhost:27017/concert-ticket';
      console.log('⚠️  MONGO_URI тохируулагдаагүй, default утга ашиглаж байна');
    }
    
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'fallback-secret-key-for-development';
      console.log('⚠️  JWT_SECRET тохируулагдаагүй, default утга ашиглаж байна');
    }
    
    // Database холбоос үүсгэх
    await connectToDb();
    console.log('✅ Database холбогдлоо');

    // Анхны өгөгдөл үүсгэх
    await DataSeedingService.seedInitialData();
    
    // Өгөгдлийн статистик харах
    const stats = await DataSeedingService.getDataStats();
    console.log('\n📊 Өгөгдлийн статистик:');
    console.log(`👥 Хэрэглэгчид: ${stats.users}`);
    console.log(`🎤 Дуучнууд: ${stats.artists}`);
    console.log(`🎵 Концертууд: ${stats.concerts}`);
    console.log(`🎫 Тасалбарын ангиллууд: ${stats.ticketCategories}`);
    console.log(`📋 Захиалгууд: ${stats.bookings}`);

    console.log('\n🎉 Mock data амжилттай үүсгэгдлээ!');
    console.log('\n📝 Тест хийхэд зориулсан хэрэглэгчдийн мэдээлэл:');
    console.log('👤 Админ: admin@concert.com / admin123');
    console.log('👤 Хэрэглэгч 1: user1@concert.com / user123');
    console.log('👤 Хэрэглэгч 2: user2@concert.com / user123');
    console.log('👤 Хэрэглэгч 3: user3@concert.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Mock data үүсгэхэд алдаа гарлаа:', error);
    process.exit(1);
  }
}

// Script ажиллуулах
if (require.main === module) {
  seedMockData();
}

export { seedMockData };
