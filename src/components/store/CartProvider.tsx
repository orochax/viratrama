"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { operationMidnightProduct } from "@/content/store/catalog";

export type CartItem = {
  lineId: string;
  slug: string;
  title: string;
  formatId: "physical" | "digital";
  formatLabel: string;
  unitPriceInCents: number;
  quantity: number;
};

type CartItemInput = Omit<CartItem, "lineId" | "quantity">;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  isHydrated: boolean;
  addItem: (item: CartItemInput) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "viratrama-cart";
const CartContext = createContext<CartContextValue | null>(null);
const physicalFormat = operationMidnightProduct.formatOptions[0];

function parseSavedItems(value: string): CartItem[] {
  const saved: unknown = JSON.parse(value);
  if (!Array.isArray(saved)) return [];

  return saved.flatMap((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      !("slug" in entry) ||
      !("title" in entry) ||
      !("quantity" in entry) ||
      typeof entry.slug !== "string" ||
      typeof entry.title !== "string" ||
      typeof entry.quantity !== "number"
    ) {
      return [];
    }

    const formatId =
      "formatId" in entry && entry.formatId === "digital"
        ? "digital"
        : "physical";
    const format =
      operationMidnightProduct.formatOptions.find(
        (option) => option.id === formatId,
      ) ?? physicalFormat;

    return [
      {
        lineId: `${entry.slug}:${format.id}`,
        slug: entry.slug,
        title: entry.title,
        formatId: format.id,
        formatLabel: format.label,
        unitPriceInCents: format.priceInCents,
        quantity: entry.quantity,
      },
    ];
  });
}

export function CartProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) setItems(parseSavedItems(saved));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (isHydrated)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      isHydrated,
      addItem: (item) =>
        setItems((current) => {
          const lineId = `${item.slug}:${item.formatId}`;
          const existing = current.find((entry) => entry.lineId === lineId);
          if (existing) {
            return current.map((entry) =>
              entry.lineId === lineId
                ? { ...entry, quantity: entry.quantity + 1 }
                : entry,
            );
          }
          return [...current, { ...item, lineId, quantity: 1 }];
        }),
      removeItem: (lineId) =>
        setItems((current) => current.filter((item) => item.lineId !== lineId)),
      clearCart: () => setItems([]),
    }),
    [items, isHydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
