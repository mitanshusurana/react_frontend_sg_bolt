import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (
          email === 'mitanshusurana@gmail.com' &&
          password === 'test01'
        ) {
          set({
            user: {
              email,
              name: 'Mitanshu Surana',
              role: 'admin', // or whatever roles you use
            } as User,
            isAuthenticated: true,
          });
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuth;