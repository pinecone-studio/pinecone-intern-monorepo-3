import { createUser } from '../../user';
// UserRole and Language not used in this test file
import { setupTestDB, teardownTestDB, clearTestDB } from '../setup';
import { createUserData } from '../factories';

describe('User Password Management', () => {
  beforeAll(setupTestDB);
  afterAll(teardownTestDB);
  afterEach(clearTestDB);

  it('should hash password on creation', async () => {
    const userData = createUserData();
    const user = await createUser(userData);
    
    expect(user.password).not.toBe(userData.password);
    expect(user.password.length).toBeGreaterThan(20);
  });

  it('should compare password correctly', async () => {
    const userData = createUserData();
    const user = await createUser(userData);
    
    const isMatch = await user.comparePassword(userData.password);
    expect(isMatch).toBe(true);
    
    const isWrongMatch = await user.comparePassword('wrongpassword');
    expect(isWrongMatch).toBe(false);
  });

  it('should generate verification token', async () => {
    const userData = createUserData();
    const user = await createUser(userData);
    
    const token = user.generateVerificationToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);
  });

  it('should generate password reset token', async () => {
    const userData = createUserData();
    const user = await createUser(userData);
    
    const token = user.generatePasswordResetToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);
  });

  it('should update last login', async () => {
    const userData = createUserData();
    const user = await createUser(userData);
    
    const initialLoginCount = user.loginCount;
    const initialLastLogin = user.lastLoginAt;
    
    await user.updateLastLogin();
    
    expect(user.loginCount).toBe(initialLoginCount + 1);
    expect(user.lastLoginAt).toBeDefined();
    expect(user.lastLoginAt).not.toEqual(initialLastLogin);
  });

  it('should increment login count', async () => {
    const userData = createUserData();
    const user = await createUser(userData);
    
    const initialCount = user.loginCount;
    await user.incrementLoginCount();
    
    expect(user.loginCount).toBe(initialCount + 1);
  });
});
