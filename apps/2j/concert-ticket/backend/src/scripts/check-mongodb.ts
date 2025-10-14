import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env файл унших
dotenv.config({ path: path.join(__dirname, '../../.env') });

// MongoDB холбоос шалгах script
async function checkMongoDB() {
  try {
    console.log('🔍 MongoDB холбоос шалгаж байна...');
    
    // Environment variables тохируулах
    if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
      process.env.MONGO_URI = 'mongodb://localhost:27017/concert-ticket';
      console.log('⚠️  MONGODB_URI тохируулагдаагүй, default утга ашиглаж байна');
    }
    
    // MONGODB_URI-г MONGO_URI болгон хувиргах
    if (process.env.MONGODB_URI && !process.env.MONGO_URI) {
      process.env.MONGO_URI = process.env.MONGODB_URI;
    }
    
    console.log(`📡 MongoDB URI: ${process.env.MONGO_URI}`);
    
    // MongoDB холбоос үүсгэх
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB холбогдлоо!');
    
    // Database мэдээлэл харах
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log(`📊 Collections: ${collections.length}`);
      
      if (collections.length > 0) {
        console.log('📋 Collection-ууд:');
        collections.forEach(col => {
          console.log(`  - ${col.name}`);
        });
      }
    }
    
    // Холбоос хаах
    await mongoose.disconnect();
    console.log('🔌 MongoDB холбоос хаагдлаа');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB холбоосоор алдаа гарлаа:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.log('\n💡 Шийдэл:');
        console.log('1. MongoDB сервер эхлүүлэх: brew services start mongodb-community');
        console.log('2. Эсвэл MongoDB Atlas ашиглах');
        console.log('3. Эсвэл Docker ашиглах: docker run -d -p 27017:27017 mongo');
      }
    }
    
    process.exit(1);
  }
}

// Script ажиллуулах
if (require.main === module) {
  checkMongoDB();
}

export { checkMongoDB };
