import { create } from "zustand";

const STORAGE_KEY = "mini-shop-cart";

function isValidItem(item) {
  return (
    item !== null &&
    typeof item === "object" &&
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    typeof item.price === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

// localStorage can be empty, disabled or contain something broken
// (edited by hand, old format...). In every bad case start with an empty cart.
function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
  } catch {
    return [];
  }
}

export const useCartStore = create((set) => ({
  items: loadItems(),

  addItem: (product) =>
    set((state) => {
      const exists = state.items.some((item) => item.id === product.id);
      if (exists) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      const newItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
      };
      return { items: [...state.items, newItem] };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

  setQuantity: (id, quantity) =>
    set((state) => {
      if (quantity < 1) {
        return { items: state.items.filter((item) => item.id !== id) };
      }
      return {
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }),

  clear: () => set({ items: [] }),
}));

// Saving happens here, outside React, so no component needs an effect for it.
// Only write when the items array is a new reference.
useCartStore.subscribe((state, prevState) => {
  if (state.items === prevState.items) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch {
    // ignore, the cart still works for this session
  }
});

// Selectors. Count and total are derived from items, never stored.
export const selectItems = (state) => state.items;
export const selectItemCount = (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectTotalPrice = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectAddItem = (state) => state.addItem;
export const selectRemoveItem = (state) => state.removeItem;
export const selectSetQuantity = (state) => state.setQuantity;
export const selectClear = (state) => state.clear;
