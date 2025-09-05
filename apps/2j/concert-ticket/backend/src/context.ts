export interface AuthUser {
  id: string;
  role: 'USER' | 'ADMIN';
  email?: string;
}

export interface Context {
  user?: AuthUser | null;
  // db, services, loaders зэргийг энд холбоно
}

export function createContext(): Context {
  return {
    user: null,
  };
}
