import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getWishlist, removeWishlistItem, saveWishlistItem } from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      setError("");
      return [];
    }
    const savedItems = await getWishlist();
    setItems(savedItems);
    setError("");
    return savedItems;
  }, [user]);

  useEffect(() => {
    refresh().catch((requestError) => {
      console.error("Could not load wishlist:", requestError);
      setError(requestError.message);
    });
  }, [refresh]);

  const toggleItem = useCallback(async (product) => {
    if (!user) return "Sign in to save products to your wishlist.";
    const isSaved = items.some((item) => String(item.id) === String(product.id));
    try {
      if (isSaved) await removeWishlistItem(product.id);
      else await saveWishlistItem(product.id);
      await refresh();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return requestError.message;
    }
  }, [items, refresh, user]);

  const value = useMemo(() => ({
    items,
    count: items.length,
    error,
    isSaved: (productId) => items.some((item) => String(item.id) === String(productId)),
    toggleItem,
    refresh,
  }), [error, items, refresh, toggleItem]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
