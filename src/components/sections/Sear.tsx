"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const STAGES = [
  {
    title: "THE BEEF\nWAITS",
    body: "Fresh-ground, hand-balled, ice-cold. No pressing, no shaping until it hits the steel. The ball waits.",
    tempLabel: "HELD COLD",
  },
  {
    title: "MAILLARD\nBEGINS",
    body: "First contact with bare flat-top steel. The surface reaches 150°C. Browning starts. Crust begins to form. Aroma rises.",
    tempLabel: "BROWNING REACTION",
  },
  {
    title: "PEAK\nSMASH",
    body: "230°C. Maximum heat meeting maximum surface area. Full-force press, crust to the edges, no pink center. That's the whole point.",
    tempLabel: "MAILLARD COMPLETE",
  },
];

/*
 * Pinned for 280% of the viewport: one scrubbed timeline raises the
 * thermometer 0 to 230, shifts its colour gold to red, crossfades the grill
 * photo into open flame, and swaps three stage captions.
 */
export function Sear() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const tempRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const grillRef = useRef<HTMLImageElement>(null);
  const flameRef = useRef<HTMLImageElement>(null);
  const stages = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const state = { temp: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=280%",
          scrub: 1.2,
          pin: pinRef.current,
          anticipatePin: 1,
        },
        defaults: { ease: "none" },
      });
      tl.to(
        state,
        {
          temp: 230,
          duration: 1,
          onUpdate: () => {
            if (tempRef.current) tempRef.current.textContent = Math.round(state.temp).toString();
            const t = state.temp / 230;
            if (fillRef.current) {
              fillRef.current.style.height = `${t * 100}%`;
              const r = Math.round(194 + 61 * t);
              const g = Math.round(161 - 93 * t);
              const b = Math.round(90 - 90 * t);
              fillRef.current.style.backgroundColor = `rgb(${r},${g},${b})`;
              fillRef.current.style.boxShadow = `0 0 ${20 + t * 60}px rgba(${r},${g},${b}, ${0.3 + t * 0.5})`;
            }
            if (glowRef.current) glowRef.current.style.opacity = String(t * 0.8);
            if (grillRef.current) grillRef.current.style.opacity = String(Math.max(0, 0.6 * (1 - t * 1.6)));
            if (flameRef.current)
              flameRef.current.style.opacity = String(Math.min(0.75, Math.max(0, ((t - 0.25) / 0.75) * 0.75)));
          },
        },
        0,
      );
      tl.from(stages.current[0], { opacity: 0, y: 30, duration: 0.15, ease: "power2.out" }, 0);
      tl.to(stages.current[0], { opacity: 0, y: -30, duration: 0.12, ease: "power2.in" }, 0.3);
      tl.from(stages.current[1], { opacity: 0, y: 30, duration: 0.15, ease: "power2.out" }, 0.35);
      tl.to(stages.current[1], { opacity: 0, y: -30, duration: 0.12, ease: "power2.in" }, 0.62);
      tl.from(stages.current[2], { opacity: 0, y: 30, duration: 0.15, ease: "power2.out" }, 0.68);
    }, triggerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef}>
      <div ref={pinRef} className="relative flex h-screen w-full items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={grillRef}
          src="/grill/grill-line.webp"
          alt=""
          aria-hidden
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={flameRef}
          src="/grill/open-flame.webp"
          alt=""
          aria-hidden
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-bg/70" />
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-100 bg-[radial-gradient(ellipse_70%_60%_at_70%_80%,rgba(255,80,10,0.35)_0%,transparent_70%)]"
        />
        <div className="absolute left-6 top-20 md:left-12 md:top-24">
          <p className="font-display text-[11px] tracking-[0.35em] text-muted">PROCESS // FLAT-TOP STEEL SEAR</p>
          <h2 className="mt-1 font-display text-3xl tracking-tight text-text md:text-5xl">
            <span className="text-accent">{"// 04."}</span> THE SEAR
          </h2>
        </div>
        <div className="relative ml-6 max-w-lg md:ml-12 md:max-w-xl">
          {STAGES.map((s, i) => (
            <div
              key={i}
              ref={(el) => {
                stages.current[i] = el;
              }}
              className={`absolute left-0 top-1/2 -translate-y-1/2 ${i === 0 ? "opacity-100" : "opacity-0"}`}
            >
              <p className="font-display text-[10px] tracking-[0.4em] text-accent">{s.tempLabel}</p>
              <h3 className="mt-3 font-display leading-none tracking-tight text-text whitespace-pre-line text-[clamp(2.8rem,5.5vw,6.5rem)]">
                {s.title}
              </h3>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
          <div className="h-[clamp(220px,35vw,420px)]" />
        </div>
        <div className="absolute right-6 flex h-[70vh] flex-col items-center gap-6 md:right-16">
          <div className="text-center">
            <span
              ref={tempRef}
              className="text-glow-accent font-display leading-none tracking-tighter text-accent text-[clamp(4rem,9vw,10rem)]"
            >
              0
            </span>
            <p className="font-display text-xs tracking-[0.3em] text-muted">°C</p>
          </div>
          <div className="relative flex h-[45vh] w-5 flex-col justify-end overflow-hidden rounded-full border border-stroke bg-surface">
            <div
              ref={fillRef}
              className="w-full rounded-full transition-none h-0 bg-accent shadow-[0_0_20px_rgba(194,161,90,0.4)]"
            />
          </div>
          <div className="absolute right-8 flex h-[45vh] flex-col justify-between">
            {[230, 175, 120, 60, 0].map((v) => (
              <span key={v} className="font-display text-[9px] tracking-widest text-muted/50">
                {v}°
              </span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-[10px] tracking-[0.3em] text-muted">
          SCROLL TO RAISE HEAT
        </div>
      </div>
    </div>
  );
}
