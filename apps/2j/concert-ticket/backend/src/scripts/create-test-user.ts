import { connectDatabase } from '../database/connection';
import { User } from '../models/model.user';

async function createTestUser() {
  try {
    await connectDatabase();
    
    // Test user үүсгэх
    const testUser = new User({
      email: 'test@example.com',
      name: 'Test User',
      phone: '99999999',
      password: 'password123',
      role: 'USER'
    });

    await testUser.save();
    console.log('Test user created successfully:', testUser.email);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
