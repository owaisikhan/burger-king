"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const CHAPTERS = [
  {
    img: "/story/story-hamburg.jpg",
    era: "1880s · HAMBURG, GERMANY",
    title: "Where it began",
    desc: "In a modest Hamburg kitchen, cooks seasoned and hand-shaped minced beef into a thick patty, seared hard over an open flame. Simple, honest, built to feed a day’s work.",
  },
  {
    img: "/story/story-ellisisland.jpg",
    era: "THE CROSSING · ELLIS ISLAND",
    title: "Across the Atlantic",
    desc: "German immigrants carried the recipe across the ocean. On the docks of New York, the Hamburg steak met an American bun for the very first time.",
  },
  {
    img: "/story/story-wichita.jpg",
    era: "1921 · WICHITA, KANSAS",
    title: "Born as an icon",
    desc: "Lunch counters across the Midwest made it fast, cheap and everywhere. A nickel a patty — the hamburger became a true American icon.",
  },
  {
    img: "/story/story-today.jpg",
    era: "TODAY · EST. 2026",
    title: "Still built by hand",
    desc: "A century on, nothing's been rushed away. Fresh-ground beef, bare steel, smashed thin by hand — SMASH carries the same patty back to its roots.",
  },
];

export function Story() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".st-head", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top bottom", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={ref} className="relative overflow-hidden bg-bg px-6 py-28 md:px-12">
      <div className="pointer-events-none absolute left-0 top-1/4 h-[600px] w-[600px] -translate-x-1/3 rounded-full bg-accent/6 blur-[150px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-accent/4 blur-[120px]" />
      <div className="mx-auto max-w-[1300px]">
        <div className="st-head mb-14 border-b border-stroke pb-12 text-center">
          <p className="font-display text-[11px] tracking-[0.45em] text-muted">ORIGIN // EST. 1880</p>
          <h2 className="mt-4 font-display text-5xl leading-none tracking-tight text-text md:text-8xl">
            <span className="text-accent">{"// 07."}</span> THE STORY
          </h2>
          <p className="mt-3 font-display tracking-[0.25em] text-muted/55 uppercase text-[clamp(1.1rem,2.5vw,2rem)]">
            FROM HAMBURG TO THE GRIDDLE
          </p>
          <div className="mt-8 flex flex-col items-center gap-5">
            <div className="flex items-center gap-6 md:gap-10">
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl md:text-7xl" role="img" aria-label="Germany">
                  🇩🇪
                </span>
                <p className="font-display text-[9px] tracking-[0.25em] text-muted/50 md:text-xs">1880 · GERMANY</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-display text-4xl text-accent/70 md:text-6xl">→</span>
                <span className="font-display text-[9px] tracking-[0.3em] text-muted/50 md:text-[11px]">146 YEARS</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl md:text-7xl" role="img" aria-label="United States">
                  🇺🇸
                </span>
                <p className="font-display text-[9px] tracking-[0.25em] text-muted/50 md:text-xs">TODAY · EST. 2026</p>
              </div>
            </div>
            <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-muted">
              Born in Hamburg, 1880. A German steak becomes an American icon, then a modern craft — one patty, perfected
              across two centuries.
            </p>
          </div>
        </div>
        <div className="st-grid grid gap-5 md:grid-cols-2">
          {CHAPTERS.map((c) => (
            <article
              key={c.era}
              className="st-card group relative flex flex-col overflow-hidden rounded-2xl border border-stroke bg-surface transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_40px_rgba(194,161,90,0.14)] hover:-translate-y-1"
            >
              <div className="relative h-60 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--color-surface)_1%,rgba(19,17,16,0.15)_50%,transparent_100%)]" />
                <span className="absolute left-4 top-4 rounded-full border border-accent/30 bg-bg/60 px-3 py-1 font-display text-[9px] tracking-[0.3em] text-accent backdrop-blur-sm">
                  {c.era}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-display text-xl leading-tight tracking-tight text-text md:text-2xl">{c.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted/70">{c.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
