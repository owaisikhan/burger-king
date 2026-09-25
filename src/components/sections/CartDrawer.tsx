"use client";

import { useEffect, useRef } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { cart, useCart } from "@/lib/cart";
import { money, site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function CartButton() {
  const { count } = useCart();
  return (
    <button
      id="cart-button"
      onClick={() => cart.open()}
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-stroke text-text transition-colors hover:border-accent hover:text-accent"
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-display text-[10px] text-bg">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartDrawer() {
  const { items, count, subtotal, isOpen } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes; focus moves into the drawer when it opens.
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Wheel and touch over the dimmed page must not scroll the page behind the drawer.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const stop = (e: Event) => e.preventDefault();
    el.addEventListener("wheel", stop, { passive: false });
    el.addEventListener("touchmove", stop, { passive: false });
    return () => {
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchmove", stop);
    };
  }, []);

  const message = [
    `Hi ${site.name}, I'd like to order:`,
    ...items.map((i) => `${i.qty} x ${i.name} (${i.detail}): ${money(i.price * i.qty)}`),
    `Total: ${money(subtotal)}`,
  ].join("\n");

  return (
    <div aria-hidden={!isOpen} className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}>
      <div
        ref={overlayRef}
        onClick={() => cart.close()}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col border-l border-stroke bg-bg transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-stroke px-6 py-5">
          <div>
            <p className="font-display text-[10px] tracking-[0.35em] text-muted">YOUR ORDER</p>
            <p className="mt-1 font-display text-2xl tracking-tight text-text">
              CART <span className="text-accent">({count})</span>
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={() => cart.close()}
            aria-label="Close cart"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-stroke text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag className="h-10 w-10 text-muted" strokeWidth={1.2} />
            <p className="font-display text-lg tracking-tight text-text">Your cart is empty</p>
            <p className="text-sm text-muted">Pick a burger from the menu or build your own.</p>
            <a
              href="#menu"
              onClick={() => cart.close()}
              className="mt-2 rounded-xl border border-accent/40 px-6 py-3 font-display text-xs tracking-[0.3em] text-accent transition-colors hover:bg-accent hover:text-bg"
            >
              BROWSE THE MENU
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-6 py-5">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4 rounded-2xl border border-stroke bg-surface p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.img} alt="" className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-sm tracking-tight text-text">{i.name}</p>
                      <p className="font-display text-sm text-accent">{money(i.price * i.qty)}</p>
                    </div>
                    <p className="mt-0.5 text-xs leading-snug text-muted">{i.detail}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-stroke">
                        <button
                          onClick={() => cart.setQty(i.key, i.qty - 1)}
                          aria-label={`One less ${i.name}`}
                          className="flex h-9 w-9 items-center justify-center text-muted hover:text-accent"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center font-display text-sm text-text" aria-live="polite">
                          {i.qty}
                        </span>
                        <button
                          onClick={() => cart.setQty(i.key, i.qty + 1)}
                          aria-label={`One more ${i.name}`}
                          className="flex h-9 w-9 items-center justify-center text-muted hover:text-accent"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => cart.remove(i.key)}
                        aria-label={`Remove ${i.name}`}
                        className="flex h-9 w-9 items-center justify-center text-muted hover:text-accent"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-stroke px-6 pb-6 pt-5">
              <div className="flex items-end justify-between">
                <p className="font-display text-[11px] tracking-[0.3em] text-muted">SUBTOTAL</p>
                <p className="font-display text-3xl text-accent">{money(subtotal)}</p>
              </div>
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-accent py-4 font-display text-sm tracking-[0.25em] text-bg transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                CHECKOUT ON WHATSAPP
              </a>
              <p className="mt-3 text-center font-display text-[10px] tracking-[0.2em] text-muted">
                Your order opens in WhatsApp, ready to send
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
