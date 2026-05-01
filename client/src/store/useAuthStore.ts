import { create } from 'zustand';
import { api } from '@/lib/axios';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Initially true while we check auth status
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        set({ user: response.data.data, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
        console.error('Error checking auth status:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
