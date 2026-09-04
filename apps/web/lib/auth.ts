'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getApiBaseUrl } from '@/lib/api-config';

export interface SavedAddress {
  label: string;
  landmark: string;
  address?: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  phone: string;
  name: string;
  role: 'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'ADMIN';
  restaurantId?: string;
  themePreference: 'cream' | 'dark';
  city?: string;
  termsAccepted?: boolean;
  savedAddresses?: SavedAddress[];
  createdAt?: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  selectedCity: string;
  isAuthModalOpen: boolean;
  onAuthSuccessCallback: (() => void) | null;

  // Actions
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  setSelectedCity: (city: string) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  syncProfileFromApi: () => Promise<void>;
  updateThemePreference: (theme: 'cream' | 'dark') => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      selectedCity: 'Dharan',
      isAuthModalOpen: false,
      onAuthSuccessCallback: null,

      login: (token: string, user: UserProfile) => {
        set({
          token,
          user,
          selectedCity: user.city || get().selectedCity || 'Dharan',
          isAuthModalOpen: false,
        });

        // Trigger any pending callback
        const cb = get().onAuthSuccessCallback;
        if (cb) {
          cb();
          set({ onAuthSuccessCallback: null });
        }
      },

      setSelectedCity: (city: string) => {
        const trimmed = city.trim();
        set({ selectedCity: trimmed });

        const { user, token } = get();
        if (user) {
          set({ user: { ...user, city: trimmed } });
        }

        if (token) {
          try {
            const apiUrl = getApiBaseUrl();
            fetch(`${apiUrl}/auth/me`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ city: trimmed }),
            }).catch((err) => console.warn('[Auth] Failed to sync city to backend:', err));
          } catch (err) {
            console.warn('[Auth] Error dispatching city update:', err);
          }
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthModalOpen: false,
          onAuthSuccessCallback: null,
        });
      },

      updateUser: (partial: Partial<UserProfile>) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...partial } });
        }
      },

      openAuthModal: (onSuccess?: () => void) => {
        set({
          isAuthModalOpen: true,
          onAuthSuccessCallback: onSuccess || null,
        });
      },

      closeAuthModal: () => {
        set({
          isAuthModalOpen: false,
          onAuthSuccessCallback: null,
        });
      },

      syncProfileFromApi: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const apiUrl = getApiBaseUrl();
          const res = await fetch(`${apiUrl}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data?.user) {
              set({ user: data.data.user });
            }
          } else if (res.status === 401 || res.status === 403) {
            // Token expired or invalid
            get().logout();
          }
        } catch (err) {
          console.warn('[Auth] Failed to sync user profile:', err);
        }
      },

      updateThemePreference: async (theme: 'cream' | 'dark') => {
        const { user, token } = get();
        if (user) {
          set({ user: { ...user, themePreference: theme } });
        }

        if (token) {
          try {
            const apiUrl = getApiBaseUrl();
            await fetch(`${apiUrl}/auth/me`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ themePreference: theme }),
            });
          } catch (err) {
            console.warn('[Auth] Failed to sync theme to backend:', err);
          }
        }
      },
    }),
    {
      name: 'nbites_auth_session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        selectedCity: state.selectedCity,
      }),
    }
  )
);
