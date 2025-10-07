import mongoose from 'mongoose';
import { config } from '../config/env';

export async function connectDatabase() {
  try {
    // MongoDB connection options
    const options = {
      maxPoolSize: 10, // Connection pool size
      serverSelectionTimeoutMS: 5000, // Server selection timeout
      socketTimeoutMS: 45000, // Socket timeout
      // bufferMaxEntries нь шинэ MongoDB version-д дэмжигдэхгүй
    };

    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri, options);

    console.log('✅ MongoDB холбогдлоо:', config.mongodb.uri);

    // Connection event handlers
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB холболтын алдаа:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB холболт тасарлаа');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB холболт дахин холбогдлоо');
    });
  } catch (error) {
    console.error('❌ Database холбогдох боломжгүй байна:', error);
    console.log('⚠️  Warning: Continuing without database connection for development...');
    // Don't exit, continue without DB for development
    // process.exit(1);
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB холболт тасарлаа');
  } catch (error) {
    console.error('❌ Database холболт тасрахад алдаа:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Server зогсож байна...');
  await disconnectDatabase();
  process.exit(0);
});
