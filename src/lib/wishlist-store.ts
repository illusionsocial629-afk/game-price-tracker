import { useEffect, useState } from "react";
import { getUserSession } from "@/lib/user-auth";

const BASE_KEY = "gpt_wishlist_v1";

export type WishlistItem = {
  id: string;
  title: string;
  image?: string;
  cheapest?: string;
  source?: "api" | "mock";
};

type Listener = () => void;
const listeners = new Set<Listener>();

function getWishlistKey() {
  const user = getUserSession();

  if (user?.id) {
    return `${BASE_KEY}_${user.id}`;
  }

  if (user?.email) {
    return `${BASE_KEY}_${user.email}`;
  }

  return `${BASE_KEY}_guest`;
}

function read(): WishlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = JSON.parse(localStorage.getItem(getWishlistKey()) || "[]");

    if (Array.isArray(raw) && raw.every((item) => typeof item === "string")) {
      return raw.map((id) => ({
        id,
        title: id,
        source: "mock",
      }));
    }

    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function write(items: WishlistItem[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(getWishlistKey(), JSON.stringify(items));
  listeners.forEach((listener) => listener());
}

export function toggleWishlist(id: string, item?: Omit<WishlistItem, "id">) {
  const current = read();

  const exists = current.some((entry) => entry.id === id);

  const next = exists
    ? current.filter((entry) => entry.id !== id)
    : [
        ...current,
        {
          id,
          title: item?.title || id,
          image: item?.image,
          cheapest: item?.cheapest,
          source: item?.source || "mock",
        },
      ];

  write(next);

  return !exists;
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(() => read());

  useEffect(() => {
    const listener = () => setItems(read());

    listeners.add(listener);
    listener();

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return items;
}