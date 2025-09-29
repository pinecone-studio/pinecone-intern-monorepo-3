import { createUser, findUsersByRole, searchUsers, getUserStats } from '../../user';
import { UserRole } from '../../../types';
import { setupTestDB, teardownTestDB, clearTestDB } from '../setup';
import { createUserData, createAdminUser, createSellerUser, createAgentUser } from '../factories';

describe('User Roles and Permissions', () => {
  beforeAll(setupTestDB);
  afterAll(teardownTestDB);
  afterEach(clearTestDB);

  it('should check user role correctly', async () => {
    const buyerData = createUserData({ role: UserRole.BUYER });
    const buyer = await createUser(buyerData);
    
    expect(buyer.hasRole(UserRole.BUYER)).toBe(true);
    expect(buyer.hasRole(UserRole.SELLER)).toBe(false);
    expect(buyer.hasRole(UserRole.ADMIN)).toBe(false);
  });

  it('should find users by role', async () => {
    await createUser(createUserData({ email: 'buyer1@test.com', role: UserRole.BUYER }));
    await createUser(createUserData({ email: 'buyer2@test.com', role: UserRole.BUYER }));
    await createUser(createSellerUser());
    await createUser(createAgentUser());
    await createUser(createAdminUser());

    const buyers = await findUsersByRole(UserRole.BUYER);
    const sellers = await findUsersByRole(UserRole.SELLER);
    const agents = await findUsersByRole(UserRole.AGENT);
    const admins = await findUsersByRole(UserRole.ADMIN);

    expect(buyers).toHaveLength(2);
    expect(sellers).toHaveLength(1);
    expect(agents).toHaveLength(1);
    expect(admins).toHaveLength(1);
  });

  it('should search users by name', async () => {
    await createUser(createUserData({ 
      email: 'john@test.com', 
      firstName: 'John', 
      lastName: 'Doe' 
    }));
    await createUser(createUserData({ 
      email: 'jane@test.com', 
      firstName: 'Jane', 
      lastName: 'Smith' 
    }));
    await createUser(createUserData({ 
      email: 'bob@test.com', 
      firstName: 'Bob', 
      lastName: 'Johnson' 
    }));

    const johnResults = await searchUsers('John', 10);
    const janeResults = await searchUsers('Jane', 10);
    const allResults = await searchUsers('', 10);

    expect(johnResults).toHaveLength(1);
    expect(johnResults[0].firstName).toBe('John');
    
    expect(janeResults).toHaveLength(1);
    expect(janeResults[0].firstName).toBe('Jane');
    
    expect(allResults).toHaveLength(3);
  });

  it('should get user statistics', async () => {
    await createUser(createUserData({ email: 'buyer1@test.com', role: UserRole.BUYER }));
    await createUser(createUserData({ email: 'buyer2@test.com', role: UserRole.BUYER }));
    await createUser(createSellerUser());
    await createUser(createAgentUser());
    await createUser(createAdminUser());

    const stats = await getUserStats();

    expect(stats.total).toBe(5);
    expect(stats.byRole[UserRole.BUYER]).toBe(2);
    expect(stats.byRole[UserRole.SELLER]).toBe(1);
    expect(stats.byRole[UserRole.AGENT]).toBe(1);
    expect(stats.byRole[UserRole.ADMIN]).toBe(1);
    expect(stats.active).toBe(5);
    expect(stats.verified).toBe(0);
  });

  it('should check profile completion', async () => {
    const incompleteUser = await createUser(createUserData({
      firstName: '',
      lastName: '',
      phone: ''
    }));

    const completeUser = await createUser(createUserData({
      firstName: 'John',
      lastName: 'Doe',
      phone: '+97699123456'
    }));

    expect(incompleteUser.isProfileComplete()).toBe(false);
    expect(completeUser.isProfileComplete()).toBe(true);
  });
});
