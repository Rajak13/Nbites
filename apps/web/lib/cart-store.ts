'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItemModifier {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique item instance id (menuItemId + selected modifier hashes)
  menuItemId: string;
  name: string;
  basePrice: number;
  price: number; // base + sum of modifier prices
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  selectedModifiers: CartItemModifier[];
  specialInstructions?: string;
  image?: string;
}

export interface CartConflict {
  existingRestaurant: { id: string; name: string };
  pendingItem: CartItem;
}

interface CartStoreState {
  items: CartItem[];
  isOpen: boolean;
  conflict: CartConflict | null;
  cutleryRequested: boolean;
  
  // Actions
  setIsOpen: (isOpen: boolean) => void;
  setCutleryRequested: (requested: boolean) => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  confirmConflictReplace: () => void;
  cancelConflict: () => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  
  // Computed helpers
  getItemCount: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getActiveRestaurant: () => { id: string; name: string } | null;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      conflict: null,
      cutleryRequested: false,

      setIsOpen: (isOpen) => set({ isOpen }),
      setCutleryRequested: (cutleryRequested) => set({ cutleryRequested }),

      addItem: (itemData) => {
        const { items } = get();
        
        // Check single-restaurant constraint (PRD rule)
        if (items.length > 0 && items[0].restaurantId !== itemData.restaurantId) {
          const conflictItem: CartItem = {
            ...itemData,
            id: `${itemData.menuItemId}-${Date.now()}`,
          };
          set({
            conflict: {
              existingRestaurant: {
                id: items[0].restaurantId,
                name: items[0].restaurantName,
              },
              pendingItem: conflictItem,
            },
          });
          return;
        }

        // Generate deterministic ID based on menuItemId + sorted modifiers
        const modKey = (itemData.selectedModifiers || [])
          .map((m) => m.id)
          .sort()
          .join('-');
        const instanceId = `${itemData.menuItemId}:${modKey}`;

        const existingIdx = items.findIndex((i) => i.id === instanceId);

        if (existingIdx > -1) {
          const updated = [...items];
          updated[existingIdx].quantity += itemData.quantity;
          set({ items: updated, isOpen: true });
        } else {
          const newItem: CartItem = {
            ...itemData,
            id: instanceId,
          };
          set({ items: [...items, newItem], isOpen: true });
        }
      },

      confirmConflictReplace: () => {
        const { conflict } = get();
        if (conflict) {
          set({
            items: [conflict.pendingItem],
            conflict: null,
            isOpen: true,
          });
        }
      },

      cancelConflict: () => {
        set({ conflict: null });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, delta) => {
        const { items } = get();
        const updated = items
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[];

        set({ items: updated });
      },

      clearCart: () => {
        set({ items: [], conflict: null });
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return 50; // Standard Flat Kathmandu Valley radial fee
      },

      getTotal: () => {
        const sub = get().getSubtotal();
        if (sub === 0) return 0;
        return sub + get().getDeliveryFee();
      },

      getActiveRestaurant: () => {
        const { items } = get();
        if (items.length === 0) return null;
        return {
          id: items[0].restaurantId,
          name: items[0].restaurantName,
        };
      },
    }),
    {
      name: 'nbites_customer_cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cutleryRequested: state.cutleryRequested,
      }),
    }
  )
);
