"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  key: string; // same burger + same options = same line
  name: string;
  detail: string;
  img: string;
  price: number;
  qty: number;
};

const STORAGE_KEY = "searline-cart";
const listeners = new Set<() => void>();
let items: CartItem[] = [];
let loaded = false;
let open = false;

// The cart lives in the visitor's browser only, so a refresh keeps it.
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) items = JSON.parse(raw);
  } catch {
    items = [];
  }
}

function save() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Private mode or storage disabled: the cart still works for this visit.
  }
}

function emit() {
  save();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const cart = {
  add(item: Omit<CartItem, "qty">) {
    load();
    const existing = items.find((i) => i.key === item.key);
    items = existing
      ? items.map((i) => (i.key === item.key ? { ...i, qty: i.qty + 1 } : i))
      : [...items, { ...item, qty: 1 }];
    emit();
  },
  setQty(key: string, qty: number) {
    items = qty <= 0 ? items.filter((i) => i.key !== key) : items.map((i) => (i.key === key ? { ...i, qty } : i));
    emit();
  },
  remove(key: string) {
    items = items.filter((i) => i.key !== key);
    emit();
  },
  clear() {
    items = [];
    emit();
  },
  open() {
    open = true;
    listeners.forEach((l) => l());
  },
  close() {
    open = false;
    listeners.forEach((l) => l());
  },
};

const EMPTY: CartItem[] = [];

export function useCart() {
  const list = useSyncExternalStore(
    subscribe,
    () => items,
    () => EMPTY,
  );
  const isOpen = useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  );
  const count = list.reduce((n, i) => n + i.qty, 0);
  const subtotal = list.reduce((n, i) => n + i.qty * i.price, 0);
  return { items: list, count, subtotal, isOpen };
}

/** Fly a copy of an image into the header cart button, then bump its badge. */
export function flyToCart(from: HTMLElement, src: string) {
  const target = document.getElementById("cart-button");
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = Math.min(120, a.width, a.height);
  const ghost = document.createElement("img");
  ghost.src = src;
  ghost.alt = "";
  ghost.style.cssText = `position:fixed;z-index:9999;pointer-events:none;left:${a.left + a.width / 2 - size / 2}px;top:${a.top + a.height / 2 - size / 2}px;width:${size}px;height:${size}px;border-radius:16px;object-fit:cover;border:2px solid #c2a15a;box-shadow:0 0 30px rgba(194,161,90,0.7);transition:transform 0.75s cubic-bezier(0.5,0,0.3,1),opacity 0.75s ease-in;`;
  document.body.appendChild(ghost);
  requestAnimationFrame(() => {
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    ghost.style.transform = `translate(${dx}px, ${dy}px) scale(0.18)`;
    ghost.style.opacity = "0.2";
  });
  window.setTimeout(() => {
    ghost.remove();
    target.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" }],
      { duration: 380, easing: "ease-out" },
    );
  }, 760);
}
