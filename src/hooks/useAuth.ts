import { create } from 'zustand';
import { mockUsers } from '../utils/mockData';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// For demo purposes, using a simple store with mock data
export const useAuth = create<AuthState>((set) => ({
  // Default to first user as logged in for demo
  user: mockUsers[0],
  isAuthenticated: true,
  
  login: async (email: string, password: string) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.email === email);
        
        if (user) {
          set({ user, isAuthenticated: true });
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