export type UserRole = 'admin' | 'user';

export interface UserWithRole {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}

// Admin emails - add your email here
export const ADMIN_EMAILS = [
  'munkhjin@gmail.com', // Your admin email
  'munkhjin.oyunaa@gmail.com', // Your Clerk account
  'admin@realestate.mn',
];

export const isAdmin = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const getUserRole = (email: string): UserRole => {
  return isAdmin(email) ? 'admin' : 'user';
};
