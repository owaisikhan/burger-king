"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import { SELECT_BUILD_EVENT, type MenuItem } from "@/lib/content";

const BASE_PRICE = 12;

const SIZES = [
  { id: "s", label: "S", name: "SINGLE SMASH", desc: "120g · 1 patty", pattyExtra: 0, img: "/menu/overhead.webp" },
  { id: "m", label: "M", name: "DOUBLE SMASH", desc: "240g · 2 patties", pattyExtra: 5, img: "/menu/classic.webp" },
  { id: "l", label: "L", name: "TRIPLE SMASH", desc: "360g · 3 patties", pattyExtra: 10, img: "/menu/prime-stack.webp" },
];

const TOPPINGS = [
  { id: "sauce", label: "SMASH SAUCE", price: 1, img: "/ingredients/truffle-mayo.webp" },
  { id: "bacon", label: "SMOKED BACON", price: 3, img: "/ingredients/bacon.webp" },
  { id: "onion", label: "SMASHED ONION", price: 2, img: "/ingredients/onions.webp" },
  { id: "cheddar", label: "EXTRA AMERICAN", price: 2, img: "/ingredients/cheddar.webp" },
  { id: "pickles", label: "HOUSE PICKLES", price: 0, img: "/ingredients/pickle.webp" },
  { id: "egg", label: "FRIED EGG", price: 3, img: "/ingredients/egg.webp" },
];

type Topping = (typeof TOPPINGS)[number];
type Rect = { left: number; top: number; width: number; height: number };

const priceLabel = (p: number) => (p === 0 ? "FREE" : `+$${p}`);

export function Configurator() {
  const [size, setSize] = useState("s");
  const [toppings, setToppings] = useState<Set<string>>(new Set());
  const [build, setBuild] = useState<MenuItem | null>(null);
  const totalRef = useRef<HTMLParagraphElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  // A build handed over from the menu section.
  useEffect(() => {
    const onSelect = (e: Event) => {
      setBuild((e as CustomEvent<MenuItem>).detail);
      if (previewImgRef.current)
        gsap.fromTo(
          previewImgRef.current,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
        );
      if (captionRef.current)
        gsap.fromTo(
          captionRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.15 },
        );
      if (totalRef.current)
        gsap.fromTo(
          totalRef.current,
          { scale: 1.4, color: "#ffe590", textShadow: "0 0 50px rgba(255,220,80,1)" },
          { scale: 1, color: "#c2a15a", textShadow: "none", duration: 0.6, ease: "power2.out", delay: 0.2 },
        );
    };
    window.addEventListener(SELECT_BUILD_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_BUILD_EVENT, onSelect);
  }, []);

  const current = SIZES.find((s) => s.id === size)!;
  const toppingsTotal = [...toppings].reduce((sum, id) => sum + (TOPPINGS.find((t) => t.id === id)?.price ?? 0), 0);
  const base = build ? build.price : BASE_PRICE;
  const total = base + current.pattyExtra + toppingsTotal;

  // Fly a topping thumbnail into the total, then flash the total.
  const flyToTotal = (button: HTMLElement, topping: Topping, target?: Rect) => {
    const img = button.querySelector("img");
    const totalEl = totalRef.current;
    if (!img || !totalEl) return;
    const a = img.getBoundingClientRect();
    const b = target ?? totalEl.getBoundingClientRect();
    const S = 88;
    const left = a.left + a.width / 2 - S / 2;
    const top = a.top + a.height / 2 - S / 2;
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    const chip = document.createElement("div");
    chip.style.cssText = `
      position:fixed; pointer-events:none; z-index:9999;
      left:${left}px; top:${top}px;
      width:${S}px; height:${S}px;
      border-radius:16px; overflow:hidden;
      border: 2px solid #c2a15a;
      box-shadow: 0 0 24px rgba(194,161,90,0.95), 0 0 56px rgba(194,161,90,0.5);
    `;
    chip.innerHTML = `<img src="${topping.img}" style="width:100%;height:100%;object-fit:cover;" />`;
    document.body.appendChild(chip);
    gsap
      .timeline()
      .to(chip, { x: cx - left - S / 2, y: cy - top - S / 2, ease: "power2.inOut", duration: 0.65 })
      .to(chip, {
        scale: 0,
        opacity: 0,
        duration: 0.18,
        ease: "power3.in",
        onComplete: () => {
          chip.remove();
          gsap.fromTo(
            totalEl,
            { scale: 1, color: "#c2a15a", textShadow: "none" },
            {
              scale: 1.45,
              color: "#ffe590",
              textShadow:
                "0 0 50px rgba(255,220,80,1), 0 0 100px rgba(194,161,90,0.9), 0 0 160px rgba(194,161,90,0.5)",
              duration: 0.18,
              ease: "power2.out",
              yoyo: true,
              repeat: 1,
              onComplete: () => {
                gsap.set(totalEl, { clearProps: "all" });
              },
            },
          );
        },
      });
  };

  // Giant glowing size letter bursting out of the preview.
  const burstLetter = (id: string) => {
    const box = previewRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const letter = SIZES.find((s) => s.id === id)!.label;
    const fontSize = Math.min(r.width, r.height) * 0.75;
    const el = document.createElement("div");
    el.style.cssText = `
      position:fixed; pointer-events:none; z-index:9999;
      left:${r.left + r.width / 2}px;
      top:${r.top + r.height / 2}px;
      transform: translate(-50%,-50%);
      font-family:var(--font-display);
      font-size:${fontSize}px; font-weight:700; line-height:1;
      color:#ffe590;
      text-shadow: 0 0 60px rgba(255,220,80,1), 0 0 120px rgba(194,161,90,0.9), 0 0 220px rgba(194,161,90,0.6), 0 0 400px rgba(194,161,90,0.3);
    `;
    el.textContent = letter;
    document.body.appendChild(el);
    gsap.fromTo(
      el,
      { scale: 0.1, opacity: 0 },
      {
        scale: 1.05,
        opacity: 1,
        duration: 0.2,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(el, { scale: 2.5, opacity: 0, duration: 0.45, ease: "power2.in", onComplete: () => el.remove() });
        },
      },
    );
  };

  const chooseSize = (id: string) => {
    setSize(id);
    if (window.innerWidth < 768 && previewRef.current) {
      const header = document.querySelector("header")?.offsetHeight ?? 60;
      const top = previewRef.current.getBoundingClientRect().top + window.scrollY - header;
      window.scrollTo({ top, behavior: "smooth" });
      setTimeout(() => burstLetter(id), 680);
    } else burstLetter(id);
  };

  const toggleTopping = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const topping = TOPPINGS.find((t) => t.id === id)!;
    const mobile = window.innerWidth < 768;
    if (!toppings.has(id)) {
      if (mobile && totalRef.current) {
        const r = totalRef.current.getBoundingClientRect();
        const offset = r.top - window.innerHeight * 0.5;
        const y = window.scrollY + offset;
        gsap.to(window, { duration: 0.65, ease: "power2.inOut", scrollTo: { y, autoKill: false } });
        flyToTotal(button, topping, { left: r.left, top: r.top - offset, width: r.width, height: r.height });
      } else flyToTotal(button, topping);
    }
    setToppings((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="configurator" className="bg-surface px-6 py-12 md:py-28 md:px-12">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-8 border-b border-stroke pb-6 md:mb-16 md:pb-8">
          <p className="font-display text-[11px] tracking-[0.35em] text-muted">INTERACTIVE // CUSTOM BUILD</p>
          <h2 className="mt-2 font-display text-4xl tracking-tight text-text md:text-6xl">
            <span className="text-accent">{"// 02."}</span> BUILD YOUR SMASH
          </h2>
        </div>

        <div className="grid gap-8 md:gap-12 md:grid-cols-[45%_55%]">
          <div className="order-2 flex flex-col gap-8 md:order-1 md:gap-10">
            <div>
              <div className="mb-4 flex items-center justify-between md:mb-5">
                <p className="font-display text-[11px] tracking-[0.35em] text-muted">
                  {build ? "STEP 1 · BUILD SELECTED ↓" : "STEP 1 · CHOOSE SIZE"}
                </p>
                {build && (
                  <button
                    onClick={() => setBuild(null)}
                    className="font-display text-[9px] tracking-[0.2em] text-accent/60 hover:text-accent transition-colors"
                  >
                    × CLEAR BUILD
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => chooseSize(s.id)}
                    className={`flex flex-col overflow-hidden rounded-xl border transition-all duration-200 md:rounded-2xl ${
                      size === s.id ? "border-accent bg-accent/10" : "border-stroke bg-bg hover:border-muted"
                    }`}
                  >
                    <div className="relative h-24 w-full overflow-hidden bg-[#0a0a0a] md:h-48">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.img}
                        alt={s.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
                      <span
                        className={`absolute left-2 top-2 font-display text-lg leading-none md:left-3 md:top-3 md:text-2xl ${
                          size === s.id ? "text-accent" : "text-text"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    <div className="p-2 text-left md:p-3">
                      <p className="font-display text-[8px] tracking-[0.2em] text-muted md:text-[9px] md:tracking-[0.25em]">
                        {s.name}
                      </p>
                      <p className="mt-0.5 hidden font-display text-[8px] tracking-wider text-muted/60 md:block">
                        {s.desc}
                      </p>
                      {build && (
                        <p
                          className={`mt-1 font-display text-xs md:mt-2 md:text-base ${
                            size === s.id ? "text-accent" : "text-text"
                          }`}
                        >
                          {s.pattyExtra === 0 ? "INCLUDED" : `+$${s.pattyExtra}`}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 font-display text-[11px] tracking-[0.35em] text-muted md:mb-5">STEP 2 · ADD TOPPINGS</p>
              <div className="grid grid-cols-2 gap-2 md:hidden">
                {TOPPINGS.map((t) => {
                  const on = toppings.has(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={(e) => toggleTopping(t.id, e)}
                      className={`group flex items-center gap-2.5 rounded-xl border px-3 py-3 transition-all duration-200 ${
                        on ? "border-accent/60 bg-accent/10 shadow-[0_0_12px_rgba(194,161,90,0.2)]" : "border-stroke bg-bg"
                      }`}
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.img} alt={t.label} loading="lazy" className="h-full w-full object-cover" />
                        {on && (
                          <div className="absolute inset-0 flex items-center justify-center bg-accent/50">
                            <span className="font-display text-[10px] text-bg">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span
                          className={`truncate font-display text-[8px] tracking-[0.1em] leading-tight ${
                            on ? "text-text" : "text-muted"
                          }`}
                        >
                          {t.label}
                        </span>
                        <span className={`font-display text-[9px] ${on ? "text-accent" : "text-muted/50"}`}>
                          {priceLabel(t.price)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="hidden md:grid md:grid-cols-2 md:gap-3">
                {TOPPINGS.map((t) => {
                  const on = toppings.has(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={(e) => toggleTopping(t.id, e)}
                      className={`group flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all duration-200 ${
                        on
                          ? "border-accent/60 bg-accent/10 shadow-[0_0_20px_rgba(194,161,90,0.15)]"
                          : "border-stroke bg-bg hover:border-accent/30"
                      }`}
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={t.img}
                          alt={t.label}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {on && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-accent/40 backdrop-blur-[2px]">
                            <span className="font-display text-xl text-bg">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 items-center justify-between">
                        <span className={`font-display text-[11px] tracking-[0.2em] ${on ? "text-text" : "text-muted"}`}>
                          {t.label}
                        </span>
                        <span className={`ml-2 flex-shrink-0 font-display text-sm ${on ? "text-accent" : "text-muted/50"}`}>
                          {priceLabel(t.price)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="order-1 flex flex-col overflow-hidden rounded-2xl border border-stroke bg-bg md:order-2">
            <div
              id="configurator-preview"
              ref={previewRef}
              className="relative min-h-[260px] flex-1 overflow-hidden md:min-h-[420px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={previewImgRef}
                src={build ? build.img : "/menu/gold-pedestal.webp"}
                alt={build ? build.name : "Your Smash"}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
              {build ? (
                <div ref={captionRef} className="absolute bottom-4 left-5 right-5 md:bottom-5 md:left-6 md:right-6">
                  <p className="font-display text-[10px] tracking-[0.35em] text-accent mb-1">SELECTED BUILD</p>
                  <p className="font-display text-xl tracking-tight text-text md:text-2xl">{build.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 md:mt-2 md:gap-2">
                    {build.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded border border-accent/30 bg-accent/10 px-2 py-0.5 font-display text-[9px] tracking-[0.2em] text-accent"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-display text-[10px] tracking-[0.3em] text-muted/40">SELECT A BUILD ABOVE</p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2 border-t border-stroke px-5 pt-4 md:mt-6 md:px-8 md:pt-6">
              <div className="flex justify-between font-display text-[10px] tracking-[0.3em] text-text">
                <span>{build ? build.name : current.name}</span>
                <span>${base}</span>
              </div>
              {current.pattyExtra > 0 && (
                <div className="flex justify-between font-display text-[10px] tracking-[0.3em] text-muted">
                  <span>{current.name} · PATTY UPGRADE</span>
                  <span>+${current.pattyExtra}</span>
                </div>
              )}
              {[...toppings].map((id) => {
                const t = TOPPINGS.find((x) => x.id === id)!;
                return (
                  <div key={id} className="flex justify-between font-display text-[10px] tracking-[0.3em] text-muted">
                    <span>{t.label}</span>
                    <span>{priceLabel(t.price)}</span>
                  </div>
                );
              })}
              <div className="h-px bg-stroke mt-1" />
            </div>

            <div className="mt-4 px-5 pb-5 md:mt-6 md:px-8 md:pb-8">
              <div className="flex items-end justify-between">
                <p className="font-display text-[11px] tracking-[0.3em] text-muted">TOTAL BUILD</p>
                <p ref={totalRef} className="font-display text-4xl text-accent md:text-5xl">
                  ${total}
                </p>
              </div>
              <button className="mt-4 w-full rounded-xl bg-accent py-4 font-display text-sm tracking-[0.3em] text-bg transition-all duration-300 hover:brightness-110 active:scale-[0.98] md:mt-5 md:py-5">
                ORDER YOUR SMASH
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
