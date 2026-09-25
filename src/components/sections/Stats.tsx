"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const STATS = [
  {
    end: 120,
    suffix: "G",
    label: "FRESH-GROUND\nPATTY WEIGHT",
    sub: "Hand-balled daily from an 80/20 chuck blend. Never frozen, never pressed twice.",
  },
  {
    end: 8,
    suffix: "S",
    label: "SECONDS\nSMASH CONTACT",
    sub: "Full-force smash the instant it hits the flat-top, so the crust locks in before the juice escapes.",
  },
  {
    end: 230,
    suffix: "°",
    label: "CELSIUS\nSEAR TEMPERATURE",
    sub: "Bare steel flat-top. First contact triggers the Maillard reaction within seconds.",
  },
  {
    end: 1,
    suffix: "",
    label: "PATTY\nZERO COMPROMISE",
    sub: "No stack, no filler: every ingredient earns its place on a single perfect patty.",
  },
];

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const numbers = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      STATS.forEach((s, i) => {
        const el = numbers.current[i];
        if (!el) return;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: s.end,
          duration: 2.2,
          ease: "power4.out",
          onUpdate: () => {
            el.textContent = Math.round(counter.val).toString() + s.suffix;
          },
          scrollTrigger: { trigger: ref.current, start: "top 65%", once: true },
        });
      });
      gsap.from(".stat-card", {
        opacity: 0,
        y: 60,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-bg">
      <div className="h-px w-full bg-stroke" />
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 gap-3 p-3 md:gap-0 md:p-0 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={i}
              className={`stat-card relative flex flex-col justify-between px-5 py-8 md:px-12 md:py-20 rounded-2xl border border-stroke md:rounded-none md:border-0 ${
                i % 2 === 0 ? "md:border-r md:border-stroke" : ""
              } ${i < 2 ? "md:border-b-0" : ""} ${i < 3 ? "md:border-r md:border-stroke" : "md:border-r-0"}`}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 hover:opacity-100">
                <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[80px]" />
              </div>
              <p className="font-display text-[10px] tracking-[0.35em] text-muted">0{i + 1}</p>
              <div className="my-6">
                <span
                  ref={(el) => {
                    numbers.current[i] = el;
                  }}
                  className="text-glow-accent font-display leading-none tracking-tighter text-accent text-[clamp(3.5rem,7vw,8rem)]"
                >
                  0
                </span>
              </div>
              <div>
                <p className="font-display text-sm tracking-[0.15em] text-text whitespace-pre-line">{s.label}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-px w-full bg-stroke" />
    </section>
  );
}
