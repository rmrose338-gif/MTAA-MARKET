import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "../services/api.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [cartError, setCartError] = useState("");

  const refresh = useCallback(async () => {
    if (!user || user.role !== "buyer") {
      setItems([]);
      localStorage.removeItem("mtaa_guest_cart");
      return;
    }
    setItems(await getCart());
  }, [user]);

  useEffect(() => {
    setCartError("");
    refresh().catch((error) => {
      console.error("Could not load cart:", error);
      setCartError(error.message);
    });
  }, [refresh]);

  useEffect(() => {
    if (!user || user.role !== "buyer") localStorage.removeItem("mtaa_guest_cart");
  }, [user]);

  async function addItem(product, options = {}) {
    if (!user || user.role !== "buyer") return "Sign in with a buyer account to add products to your cart.";
    try {
      await addCartItem(product.id, 1, options);
      await refresh();
      setCartError("");
      return true;
    } catch (error) {
      setCartError(error.message);
      return error.message;
    }
  }

  async function updateQuantity(item, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    if (!user || user.role !== "buyer") return;
    try {
      await updateCartItem(item.product_id, quantity, item.options);
      await refresh();
      setCartError("");
    } catch (error) {
      setCartError(error.message);
    }
  }

  async function removeItem(item) {
    if (!user || user.role !== "buyer") return;
    try {
      await removeCartItem(item.product_id, item.options);
      await refresh();
      setCartError("");
    } catch (error) {
      setCartError(error.message);
    }
  }

  async function clearCart() {
    setItems([]);
    setCartError("");
    localStorage.removeItem(STORAGE_KEY);
  }

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const value = useMemo(() => ({
    items, total, itemCount, cartError, clearCartError: () => setCartError(""),
    addItem, updateQuantity, removeItem, clearCart,
  }), [items, total, itemCount, cartError, user]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
