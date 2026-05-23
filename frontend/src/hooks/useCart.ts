import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../config/api';
import type { Cart, CartSummary } from '../types';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

export const useCartQuery = () => {
  const setCart = useCartStore((s) => s.setCart);
  const { status, user, hydrated } = useAuthStore();
  const query = useQuery<Cart>({
    queryKey: ['cart', user?.id ?? 'guest'],
    queryFn: async () => {
      const res = await apiClient.getCart();
      return res.data.data;
    },
    staleTime: 10_000,
    retry: 1,
    enabled: hydrated && status === 'authenticated',
  });

  useEffect(() => {
    if (query.data) {
      setCart(query.data.items, query.data.subtotal);
    }
  }, [query.data, setCart]);

  return query;
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { incrementCount, decrementCount } = useCartStore();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async (payload: { productId: string; quantity: number; productName?: string }) => {
      const res = await apiClient.addToCart(payload.productId, payload.quantity);
      return res.data.data;
    },
    onMutate: ({ quantity }) => {
      incrementCount(quantity);
    },
    onError: (_err, { quantity }) => {
      decrementCount(quantity);
      addToast({ type: 'error', message: 'Failed to add item to cart. Please try again.' });
    },
    onSuccess: (_data, { productName, quantity }) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast({
        type: 'success',
        message: `${productName || 'Item'} (${quantity}) added to cart!`,
      });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async (payload: { cartItemId: string; quantity: number }) => {
      const res = await apiClient.updateCartItem(payload.cartItemId, payload.quantity);
      return res.data.data;
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to update quantity. Please try again.' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const { decrementCount, incrementCount } = useCartStore();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async (payload: { cartItemId: string; quantity: number }) => {
      const res = await apiClient.removeCartItem(payload.cartItemId);
      return { data: res.data.data, quantity: payload.quantity };
    },
    onMutate: ({ quantity }) => {
      decrementCount(quantity);
    },
    onError: (_err, { quantity }) => {
      incrementCount(quantity);
      addToast({ type: 'error', message: 'Failed to remove item. Please try again.' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast({ type: 'success', message: 'Item removed from cart.' });
    },
  });
};

export const useCartSummary = (): CartSummary | null => {
  const { data } = useCartQuery();
  if (!data) return null;
  const estimatedTax = parseFloat((data.subtotal * 0.18).toFixed(2));
  const shipping = data.subtotal > 499 ? 0 : 49;
  const total = parseFloat((data.subtotal + estimatedTax + shipping).toFixed(2));
  return { items: data.items, subtotal: data.subtotal, estimatedTax, shipping, total };
};
