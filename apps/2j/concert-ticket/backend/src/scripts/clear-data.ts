import { connectToDb } from '../utils/connect-to-db';
import { DataSeedingService } from '../services/data-seeding.service';

// MongoDB-с бүх өгөгдлийг цэвэрлэх script
async function clearAllData() {
  try {
    console.log('🧹 Өгөгдлийг цэвэрлэж эхлэж байна...');
    
    // Environment variables тохируулах
    if (!process.env.MONGO_URI) {
      process.env.MONGO_URI = 'mongodb://localhost:27017/concert-ticket';
      console.log('⚠️  MONGO_URI тохируулагдаагүй, default утга ашиглаж байна');
    }
    
    // Database холбоос үүсгэх
    await connectToDb();
    console.log('✅ Database холбогдлоо');

    // Бүх өгөгдлийг цэвэрлэх
    await DataSeedingService.clearAllData();
    
    console.log('🎉 Бүх өгөгдөл амжилттай цэвэрлэгдлээ!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Өгөгдөл цэвэрлэхэд алдаа гарлаа:', error);
    process.exit(1);
  }
}

// Script ажиллуулах
if (require.main === module) {
  clearAllData();
}

export { clearAllData };
