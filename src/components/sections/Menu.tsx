"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { MENU, SELECT_BUILD_EVENT, type MenuItem } from "@/lib/content";
import { cart, flyToCart } from "@/lib/cart";

export function Menu() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".menu-head", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      gsap.from(".menu-card", {
        opacity: 0,
        y: 60,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".menu-grid", start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  // Clone the card photo, fly it into the configurator preview while the page scrolls there.
  const addToOrder = (item: MenuItem, img: HTMLImageElement) => {
    const from = img.getBoundingClientRect();
    const section = document.getElementById("configurator");
    const preview = document.getElementById("configurator-preview");
    if (!section || !preview) return;
    const sectionTop = section.getBoundingClientRect().top;
    const p = preview.getBoundingClientRect();
    const targetTop = p.top - sectionTop;

    setTimeout(() => window.dispatchEvent(new CustomEvent(SELECT_BUILD_EVENT, { detail: item })), 800);

    const scrollTarget = section.getBoundingClientRect().top + window.scrollY;
    gsap.to(window, { scrollTo: scrollTarget, duration: 1.3, ease: "power2.inOut" });

    const ghost = document.createElement("img");
    ghost.src = item.img;
    ghost.style.cssText = `
      position:fixed; z-index:9999; pointer-events:none;
      left:${from.left}px; top:${from.top}px;
      width:${from.width}px; height:${from.height}px;
      border-radius:14px; object-fit:cover;
      will-change:transform,opacity;
      box-shadow:0 0 40px rgba(194,161,90,0.45);
    `;
    document.body.appendChild(ghost);
    gsap.to(ghost, {
      x: p.left + p.width / 2 - (from.left + from.width / 2),
      y: targetTop + p.height / 2 - (from.top + from.height / 2),
      scale: p.height / from.height,
      borderRadius: "0px",
      opacity: 0,
      duration: 1.3,
      ease: "power2.inOut",
      onComplete: () => ghost.remove(),
    });
  };

  return (
    <section ref={ref} id="menu" className="scroll-mt-16 bg-bg px-6 py-28 md:px-12">
      <div className="mx-auto max-w-[1300px]">
        <div className="menu-head mb-16 flex items-end justify-between border-b border-stroke pb-8">
          <div>
            <p className="font-display text-[11px] tracking-[0.35em] text-muted">THE MENU // SELECT YOUR SMASH</p>
            <h2 className="mt-2 font-display text-4xl tracking-tight text-text md:text-6xl">
              <span className="text-accent">{"// 01."}</span> THE LINE-UP
            </h2>
          </div>
          <p className="hidden font-display text-sm tracking-widest text-muted md:block">3 BUILDS · MADE TO ORDER</p>
        </div>
        <div className="menu-grid grid gap-6 md:grid-cols-3">
          {MENU.map((item) => (
            <div
              key={item.id}
              className="menu-card group relative flex flex-col overflow-hidden rounded-2xl border border-stroke bg-surface"
            >
              <div className="relative h-64 overflow-hidden bg-[#0a0a0a]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-stroke bg-bg/60 px-3 py-1 font-display text-[10px] tracking-[0.3em] text-muted backdrop-blur-sm">
                  {item.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-xl tracking-tight text-text">{item.name}</h3>
                  <span className="font-display text-2xl text-accent">${item.price}</span>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{item.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded border border-stroke px-2 py-1 font-display text-[9px] tracking-[0.25em] text-muted"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={(e) => {
                      const img = e.currentTarget.closest(".menu-card")?.querySelector("img");
                      cart.add({ key: `${item.id}:S:`, name: item.name, detail: "Single smash", img: item.img, price: item.price });
                      if (img) flyToCart(img, item.img);
                    }}
                    className="min-h-11 flex-1 rounded-xl bg-accent py-3 font-display text-xs tracking-[0.25em] text-bg transition-all duration-300 hover:brightness-110 active:scale-95"
                  >
                    + ADD TO CART
                  </button>
                  <button
                    onClick={(e) => {
                      const img = e.currentTarget.closest(".menu-card")?.querySelector("img");
                      if (img) addToOrder(item, img);
                    }}
                    className="min-h-11 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 font-display text-xs tracking-[0.2em] text-accent transition-all duration-300 hover:bg-accent hover:text-bg active:scale-95"
                  >
                    CUSTOMIZE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
