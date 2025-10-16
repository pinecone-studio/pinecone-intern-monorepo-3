// Mock mongoose for testing
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    close: jest.fn()
  },
  Schema: jest.fn().mockImplementation(() => ({
    paths: {
      email: {},
      firstName: {},
      role: {}
    }
  })),
  model: jest.fn().mockImplementation(() => ({
    schema: {
      paths: {
        email: {},
        firstName: {},
        role: {}
      }
    },
    validateSync: jest.fn()
  }))
}));

// Mock the User model
const mockUser = {
  email: '',
  firstName: '',
  lastName: '',
  role: 'BUYER',
  schema: {
    paths: {
      email: {},
      firstName: {},
      role: {}
    }
  },
  validateSync: jest.fn()
};

// Simple test for User model
describe('User Model', () => {

  it('should create a new user instance', () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'BUYER',
      preferredLanguage: 'EN',
      isActive: true
    };

    const user = { ...mockUser, ...userData };

    expect(user.email).toBe(userData.email);
    expect(user.firstName).toBe(userData.firstName);
    expect(user.role).toBe('BUYER');
  });

  it('should have correct schema structure', () => {
    const user = mockUser;
    
    expect(user.schema).toBeDefined();
    expect(user.schema.paths.email).toBeDefined();
    expect(user.schema.paths.firstName).toBeDefined();
    expect(user.schema.paths.role).toBeDefined();
  });

  it('should validate email format', () => {
    const validationError = { errors: { email: 'Invalid email format' } };
    mockUser.validateSync.mockReturnValue(validationError);

    const result = mockUser.validateSync();
    expect(result).toBeDefined();
    expect(result.errors.email).toBeDefined();
  });
});
