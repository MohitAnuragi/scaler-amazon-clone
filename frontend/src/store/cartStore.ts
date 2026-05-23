import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

type CartState = {
  itemCount: number;
  items: CartItem[];
  subtotal: number;
  setCart: (items: CartItem[], subtotal: number) => void;
  setItemCount: (count: number) => void;
  incrementCount: (amount?: number) => void;
  decrementCount: (amount?: number) => void;
  resetCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      itemCount: 0,
      items: [],
      subtotal: 0,
      setCart: (items, subtotal) =>
        set({ items, subtotal, itemCount: items.reduce((s, i) => s + i.quantity, 0) }),
      setItemCount: (count) => set({ itemCount: count }),
      incrementCount: (amount = 1) =>
        set((state) => ({ itemCount: state.itemCount + amount })),
      decrementCount: (amount = 1) =>
        set((state) => ({ itemCount: Math.max(0, state.itemCount - amount) })),
      resetCart: () => set({ itemCount: 0, items: [], subtotal: 0 }),
    }),
    { name: 'amazon-cart' }
  )
);
