import mongoose from 'mongoose';
import { User, createUser, findUserByEmail } from '../User';

// Mock mongoose connection for testing
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate-test';
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model', () => {
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      phone: 1234567890,
    };

    const user = await createUser(userData);
    
    expect(user.email).toBe('test@example.com');
    expect(user.phone).toBe(1234567890);
    expect(user.isAdmin).toBe(false);
    expect(user.password).not.toBe('password123'); // Should be hashed
  });

  it('should hash password before saving', async () => {
    const userData = {
      email: 'test2@example.com',
      password: 'password123',
    };

    const user = await createUser(userData);
    expect(user.password).not.toBe('password123');
    expect(user.password.length).toBeGreaterThan(20); // bcrypt hash length
  });

  it('should compare password correctly', async () => {
    const userData = {
      email: 'test3@example.com',
      password: 'password123',
    };

    const user = await createUser(userData);
    
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);
    
    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('should find user by email', async () => {
    const userData = {
      email: 'test4@example.com',
      password: 'password123',
    };

    await createUser(userData);
    const foundUser = await findUserByEmail('test4@example.com');
    
    expect(foundUser).toBeTruthy();
    expect(foundUser?.email).toBe('test4@example.com');
  });
});
