import { createUser, findUserByEmail, findUserById } from '../../user';
import { UserRole, Language } from '../../../types';
import { setupTestDB, teardownTestDB, clearTestDB } from '../setup';
import { createUserData, createUserWithAddress } from '../factories';

describe('User Creation', () => {
  beforeAll(setupTestDB);
  afterAll(teardownTestDB);
  afterEach(clearTestDB);

  it('should create a new user with valid data', async () => {
    const userData = createUserData();
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
    const userData = createUserWithAddress();
    const user = await createUser(userData);
    
    expect(user.address).toBeDefined();
    expect(user.address?.city).toBe('Ulaanbaatar');
    expect(user.address?.district).toBe('Sukhbaatar');
    expect(user.address?.coordinates?.latitude).toBe(47.9077);
  });

  it('should not create user with invalid email', async () => {
    const userData = createUserData({ email: 'invalid-email' });
    
    await expect(createUser(userData)).rejects.toThrow();
  });

  it('should not create user with weak password', async () => {
    const userData = createUserData({ password: '123' });
    
    await expect(createUser(userData)).rejects.toThrow();
  });

  it('should not create duplicate users', async () => {
    const userData = createUserData();
    await createUser(userData);
    
    await expect(createUser(userData)).rejects.toThrow();
  });

  it('should find user by email', async () => {
    const userData = createUserData();
    await createUser(userData);
    
    const foundUser = await findUserByEmail(userData.email);
    expect(foundUser).toBeTruthy();
    expect(foundUser?.email).toBe(userData.email);
  });

  it('should find user by ID', async () => {
    const userData = createUserData();
    const createdUser = await createUser(userData);
    
    const foundUser = await findUserById(createdUser._id.toString());
    expect(foundUser).toBeTruthy();
    expect(foundUser?.email).toBe(userData.email);
  });
});
