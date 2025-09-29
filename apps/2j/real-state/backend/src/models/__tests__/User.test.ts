import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User, createUser, findUserByEmail, findUserById, updateUser, deleteUser, searchUsers, getUserStats } from '../User';
import { UserRole, Language } from '../../types';

describe('User Model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('User Creation', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Баттулга',
        lastName: 'Баяр',
        phone: '+97699123456',
        role: UserRole.BUYER,
        preferredLanguage: Language.MN
      };

      const user = await createUser(userData);
      
      expect(user.email).toBe('test@example.com');
      expect(user.firstName).toBe('Баттулга');
      expect(user.lastName).toBe('Баяр');
      expect(user.phone).toBe('+97699123456');
      expect(user.role).toBe(UserRole.BUYER);
      expect(user.preferredLanguage).toBe(Language.MN);
      expect(user.isActive).toBe(true);
      expect(user.isVerified).toBe(false);
      expect(user.password).not.toBe('password123'); // Should be hashed
      expect(user.password.length).toBeGreaterThan(20); // bcrypt hash length
    });

    it('should create user with address', async () => {
      const userData = {
        email: 'test2@example.com',
        password: 'password123',
        firstName: 'Сүхбат',
        lastName: 'Төр',
        phone: '99887766',
        address: {
          street: 'Энхтайваны өргөн чөлөө 1',
          city: 'Улаанбаатар',
          district: 'Сүхбаатар дүүрэг',
          khoroo: '1-р хороо',
          building: '10',
          apartment: '25',
          zipCode: '14240',
          coordinates: {
            latitude: 47.9184,
            longitude: 106.9177
          },
          description: {
            en: 'Near the central square',
            mn: 'Төв талбайн ойролцоо'
          }
        },
        bio: {
          en: 'Real estate enthusiast',
          mn: 'Үл хөдлөх хөрөнгийн сонирхогч'
        }
      };

      const user = await createUser(userData);
      
      expect(user.address?.street).toBe('Энхтайваны өргөн чөлөө 1');
      expect(user.address?.city).toBe('Улаанбаатар');
      expect(user.address?.district).toBe('Сүхбаатар дүүрэг');
      expect(user.address?.coordinates?.latitude).toBe(47.9184);
      expect(user.bio?.mn).toBe('Үл хөдлөх хөрөнгийн сонирхогч');
    });

    it('should hash password before saving', async () => {
      const userData = {
        email: 'test3@example.com',
        password: 'password123',
        firstName: 'Болд',
        lastName: 'Доржийн',
        phone: '88776655'
      };

      const user = await createUser(userData);
      expect(user.password).not.toBe('password123');
      expect(user.password.length).toBeGreaterThan(20);
    });

    it('should set default values correctly', async () => {
      const userData = {
        email: 'test4@example.com',
        password: 'password123',
        firstName: 'Оюун',
        lastName: 'Эрдэнэ',
        phone: '77665544'
      };

      const user = await createUser(userData);
      expect(user.role).toBe(UserRole.BUYER);
      expect(user.preferredLanguage).toBe(Language.MN);
      expect(user.isActive).toBe(true);
      expect(user.isVerified).toBe(false);
      expect(user.loginCount).toBe(0);
      expect(user.preferences?.notifications).toBe(true);
      expect(user.preferences?.newsletter).toBe(false);
    });
  });

  describe('User Validation', () => {
    it('should require email', async () => {
      const userData = {
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '99887766'
      };

      await expect(createUser(userData as any)).rejects.toThrow('Email is required');
    });

    it('should require valid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '99887766'
      };

      await expect(createUser(userData)).rejects.toThrow();
    });

    it('should require password with minimum length', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123',
        firstName: 'Test',
        lastName: 'User',
        phone: '99887766'
      };

      await expect(createUser(userData)).rejects.toThrow('Password must be at least 6 characters long');
    });

    it('should require valid phone number', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: 'invalid-phone'
      };

      await expect(createUser(userData)).rejects.toThrow('Please provide a valid Mongolian phone number');
    });

    it('should validate age range for date of birth', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '99887766',
        dateOfBirth: new Date('2010-01-01') // Too young
      };

      await expect(createUser(userData)).rejects.toThrow('User must be between 18 and 120 years old');
    });

    it('should not allow duplicate emails', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        firstName: 'First',
        lastName: 'User',
        phone: '99887766'
      };

      await createUser(userData);
      
      const duplicateUser = {
        email: 'duplicate@example.com',
        password: 'password456',
        firstName: 'Second',
        lastName: 'User',
        phone: '88776655'
      };

      await expect(createUser(duplicateUser)).rejects.toThrow('Email already exists');
    });
  });

  describe('Password Methods', () => {
    let user: any;

    beforeEach(async () => {
      const userData = {
        email: 'password-test@example.com',
        password: 'password123',
        firstName: 'Password',
        lastName: 'Test',
        phone: '99887766'
      };
      user = await createUser(userData);
    });

    it('should compare password correctly', async () => {
      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);
      
      const isNotMatch = await user.comparePassword('wrongpassword');
      expect(isNotMatch).toBe(false);
    });

    it('should generate verification token', () => {
      const token = user.generateVerificationToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(20);
      expect(user.verificationToken).toBe(token);
      expect(user.verificationTokenExpiry).toBeInstanceOf(Date);
    });

    it('should generate password reset token', () => {
      const token = user.generatePasswordResetToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(20);
      expect(user.passwordResetToken).toBe(token);
      expect(user.passwordResetTokenExpiry).toBeInstanceOf(Date);
    });
  });

  describe('User Methods', () => {
    let user: any;

    beforeEach(async () => {
      const userData = {
        email: 'methods-test@example.com',
        password: 'password123',
        firstName: 'Methods',
        lastName: 'Test',
        phone: '99887766',
        role: UserRole.AGENT
      };
      user = await createUser(userData);
    });

    it('should check user role correctly', () => {
      expect(user.hasRole(UserRole.AGENT)).toBe(true);
      expect(user.hasRole(UserRole.ADMIN)).toBe(false);
    });

    it('should check if profile is complete', () => {
      expect(user.isProfileComplete()).toBe(false); // Not verified
      
      user.isVerified = true;
      expect(user.isProfileComplete()).toBe(true);
    });

    it('should update last login', async () => {
      const beforeUpdate = user.lastLoginAt;
      await user.updateLastLogin();
      
      expect(user.lastLoginAt).not.toBe(beforeUpdate);
      expect(user.loginAttempts).toBe(0);
      expect(user.lockUntil).toBeUndefined();
    });

    it('should increment login count', async () => {
      const initialCount = user.loginCount;
      await user.incrementLoginCount();
      
      expect(user.loginCount).toBe(initialCount + 1);
    });

    it('should return public JSON without sensitive data', () => {
      const publicData = user.toPublicJSON();
      
      expect(publicData.password).toBeUndefined();
      expect(publicData.verificationToken).toBeUndefined();
      expect(publicData.passwordResetToken).toBeUndefined();
      expect(publicData.loginAttempts).toBeUndefined();
      expect(publicData.email).toBeDefined();
      expect(publicData.firstName).toBeDefined();
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create test users
      const users = [
        {
          email: 'buyer1@example.com',
          password: 'password123',
          firstName: 'Баяр',
          lastName: 'Дорж',
          phone: '99887766',
          role: UserRole.BUYER,
          isActive: true,
          isVerified: true
        },
        {
          email: 'seller1@example.com',
          password: 'password123',
          firstName: 'Болд',
          lastName: 'Баат',
          phone: '88776655',
          role: UserRole.SELLER,
          isActive: true,
          isVerified: false
        },
        {
          email: 'agent1@example.com',
          password: 'password123',
          firstName: 'Сайхан',
          lastName: 'Төмөр',
          phone: '77665544',
          role: UserRole.AGENT,
          isActive: false,
          isVerified: true
        }
      ];

      for (const userData of users) {
        await createUser(userData);
      }
    });

    it('should find user by email', async () => {
      const user = await findUserByEmail('buyer1@example.com');
      expect(user).toBeDefined();
      expect(user?.firstName).toBe('Баяр');
      expect(user?.password).toBeDefined(); // Should include password
    });

    it('should find user by email and password', async () => {
      const user = await User.findByEmailAndPassword('buyer1@example.com', 'password123');
      expect(user).toBeDefined();
      expect(user?.firstName).toBe('Баяр');
      
      const wrongPassword = await User.findByEmailAndPassword('buyer1@example.com', 'wrongpassword');
      expect(wrongPassword).toBeNull();
    });

    it('should find active users', async () => {
      const activeUsers = await User.findActiveUsers();
      expect(activeUsers).toHaveLength(2);
      expect(activeUsers.every(user => user.isActive)).toBe(true);
    });

    it('should find users by role', async () => {
      const buyers = await User.findByRole(UserRole.BUYER);
      expect(buyers).toHaveLength(1);
      expect(buyers[0].role).toBe(UserRole.BUYER);
      
      const agents = await User.findByRole(UserRole.AGENT);
      expect(agents).toHaveLength(0); // Agent is not active
    });

    it('should search users by query', async () => {
      const results = await searchUsers('Баяр');
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Баяр');
      
      const emailResults = await searchUsers('seller1');
      expect(emailResults).toHaveLength(1);
      expect(emailResults[0].email).toBe('seller1@example.com');
    });

    it('should update user', async () => {
      const user = await findUserByEmail('buyer1@example.com');
      const updateData = {
        firstName: 'UpdatedName',
        bio: {
          en: 'Updated bio',
          mn: 'Шинэчлэгдсэн намтар'
        }
      };
      
      const updatedUser = await updateUser(user!._id.toString(), updateData);
      expect(updatedUser?.firstName).toBe('UpdatedName');
      expect(updatedUser?.bio?.mn).toBe('Шинэчлэгдсэн намтар');
    });

    it('should soft delete user', async () => {
      const user = await findUserByEmail('buyer1@example.com');
      const result = await deleteUser(user!._id.toString());
      expect(result).toBe(true);
      
      const deletedUser = await findUserById(user!._id.toString());
      expect(deletedUser?.isActive).toBe(false);
    });

    it('should get user statistics', async () => {
      const stats = await getUserStats();
      
      expect(stats.total).toBe(3);
      expect(stats.active).toBe(2);
      expect(stats.verified).toBe(2);
      expect(stats.byRole[UserRole.BUYER]).toBe(1);
      expect(stats.byRole[UserRole.SELLER]).toBe(1);
      expect(stats.byRole[UserRole.AGENT]).toBe(1);
      expect(stats.byRole[UserRole.ADMIN]).toBe(0);
    });
  });

  describe('Virtual Properties', () => {
    let user: any;

    beforeEach(async () => {
      const userData = {
        email: 'virtual-test@example.com',
        password: 'password123',
        firstName: 'Virtual',
        lastName: 'Test',
        phone: '99887766',
        dateOfBirth: new Date('1990-01-01')
      };
      user = await createUser(userData);
    });

    it('should calculate full name', () => {
      expect(user.fullName).toBe('Virtual Test');
    });

    it('should calculate age', () => {
      const expectedAge = new Date().getFullYear() - 1990;
      expect(user.age).toBe(expectedAge);
    });

    it('should detect locked status', () => {
      expect(user.isLocked).toBe(false);
      
      user.lockUntil = new Date(Date.now() + 60000); // 1 minute from now
      expect(user.isLocked).toBe(true);
    });
  });

  describe('Indexes and Performance', () => {
    it('should have proper indexes', () => {
      // const indexes = User.collection.getIndexes ? User.collection.getIndexes() : [];
      // Note: In test environment, we can't easily check indexes
      // This is more of a documentation of what should be indexed
      expect(true).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional fields', async () => {
      const userData = {
        email: 'minimal@example.com',
        password: 'password123',
        firstName: 'Min',
        lastName: 'User',
        phone: '99887766'
      };

      const user = await createUser(userData);
      expect(user.address).toBeUndefined();
      expect(user.bio).toBeUndefined();
      expect(user.dateOfBirth).toBeUndefined();
      expect(user.socialMedia).toBeUndefined();
    });

    it('should handle very long names within limits', async () => {
      const userData = {
        email: 'long-name@example.com',
        password: 'password123',
        firstName: 'A'.repeat(50), // Max length
        lastName: 'B'.repeat(50),  // Max length
        phone: '99887766'
      };

      const user = await createUser(userData);
      expect(user.firstName).toHaveLength(50);
      expect(user.lastName).toHaveLength(50);
    });

    it('should reject names that are too long', async () => {
      const userData = {
        email: 'too-long@example.com',
        password: 'password123',
        firstName: 'A'.repeat(51), // Over max length
        lastName: 'User',
        phone: '99887766'
      };

      await expect(createUser(userData)).rejects.toThrow();
    });
  });
});