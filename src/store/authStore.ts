import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  roleId: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
  isBootstrapped: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  hasPermission: (permission: string) => boolean;
  checkAuth: () => Promise<void>;
  getBootstrapStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      access_token: null,
      isAuthenticated: false,
      isBootstrapped: true, // Default to true to avoid UI flickering

      login: async (email: string, password: string) => {
        try {
          const { data } = await api.post('/auth/login', { email, password });
          
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user_id', data.user.id);
          setCookie('access_token', data.access_token);
          
          set({
            user: data.user,
            access_token: data.access_token,
            isAuthenticated: true,
          });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Login failed');
        }
      },

      register: async (userData: any) => {
        try {
          const { data } = await api.post('/auth/register', userData);
          
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_id', data.user.id);
            setCookie('access_token', data.access_token);
            
            set({
              user: data.user,
              access_token: data.access_token,
              isAuthenticated: true,
            });
          }
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Registration failed');
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.clear();
          deleteCookie('access_token');
          set({
            user: null,
            access_token: null,
            isAuthenticated: false,
          });
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        return user?.permissions?.includes(permission) || false;
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem('access_token');
          if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
          }

          const { data } = await api.post('/auth/me');
          set({
            user: data,
            isAuthenticated: true,
            access_token: token,
          });
        } catch (error) {
          localStorage.clear();
          deleteCookie('access_token');
          set({
            user: null,
            access_token: null,
            isAuthenticated: false,
          });
        }
      },

      getBootstrapStatus: async () => {
        try {
          const { data } = await api.get('/auth/status');
          set({ isBootstrapped: data.isBootstrapped });
        } catch (error) {
          console.error('Failed to fetch bootstrap status:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        access_token: state.access_token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
