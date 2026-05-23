import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../config/api";
import type { Product } from "../types";
import { useUIStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";

type WishlistItem = {
  id: string;
  productId: string;
  product: Product;
};

export const useWishlistQuery = () => {
  const { status, hydrated, user } = useAuthStore();
  return useQuery({
    queryKey: ["wishlist", user?.id ?? "guest"],
    queryFn: async () => {
      const res = await apiClient.getWishlist();
      return res.data.data as WishlistItem[];
    },
    staleTime: 30_000,
    enabled: hydrated && status === "authenticated",
  });
};

export const useWishlistProductIds = () => {
  const { status, hydrated } = useAuthStore();
  const { data = [] } = useWishlistQuery();
  if (!hydrated || status !== "authenticated") return new Set();
  return new Set(data.map((item) => item.productId));
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async ({
      productId,
      isInWishlist,
    }: {
      productId: string;
      isInWishlist: boolean;
    }) => {
      if (isInWishlist) {
        await apiClient.removeFromWishlist(productId);
        return { added: false };
      }
      await apiClient.addToWishlist(productId);
      return { added: true };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      addToast({
        type: "success",
        message: result.added ? "Added to wishlist" : "Removed from wishlist",
      });
    },
    onError: () => {
      addToast({ type: "error", message: "Could not update wishlist." });
    },
  });
};
