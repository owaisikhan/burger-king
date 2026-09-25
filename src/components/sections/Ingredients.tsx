"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const CARDS = [
  {
    n: "01",
    name: "FRESH-GROUND BEEF",
    spec: "80/20 chuck blend, coarse-ground same-day. Hand-balled to 120g, never frozen, never pressed until it hits the steel.",
    tag: "THE CUT",
    img: "/ingredients/wagyu.webp",
    imgFallback: "/menu/overhead.webp",
  },
  {
    n: "02",
    name: "BRIOCHE BUN",
    spec: "Baked in-house daily. Enriched dough: 18% butter, six eggs per batch. Toasted 90 seconds directly on the flat-top. Never chilled.",
    tag: "THE BREAD",
    img: "/ingredients/brioche.webp",
    imgFallback: "/menu/smoke.webp",
  },
  {
    n: "03",
    name: "MELTED AMERICAN",
    spec: "Two slices, laid on the patty while it still sizzles on the griddle. Melts into the crust before the flip.",
    tag: "THE MELT",
    img: "/ingredients/cheddar.webp",
    imgFallback: "/menu/cheese-pull.webp",
  },
  {
    n: "04",
    name: "SMASH SAUCE",
    spec: "House-made, tangy-sweet, built on the bottom bun. Reacts with the heat of the patty the moment it lands.",
    tag: "THE SAUCE",
    img: "/ingredients/truffle-mayo.webp",
    imgFallback: "/menu/truffle.webp",
  },
  {
    n: "05",
    name: "HOUSE PICKLES",
    spec: "Fermented 48 hours in dill brine. Cut thick. Provides the acid balance that cuts the richness of the beef.",
    tag: "THE ACID",
    img: "/ingredients/pickle.webp",
    imgFallback: "/menu/overhead.webp",
  },
  {
    n: "06",
    name: "SMOKED BACON",
    spec: "Applewood cold-smoked for 6 hours. Thick-cut 8mm, finished on the griddle for char. Optional, for those who want more.",
    tag: "THE SMOKE",
    img: "/ingredients/bacon.webp",
    imgFallback: "/menu/smoke.webp",
  },
];

/* Pinned horizontal scroll: vertical scroll distance equals the track's overflow width. */
export function Ingredients() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const ctx = gsap.context(() => {
      const distance = () => -(trackRef.current!.scrollWidth - window.innerWidth);
      gsap.to(trackRef.current, {
        x: distance,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: () => "+=" + Math.abs(distance()),
          scrub: 0.6,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, triggerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef}>
      <div ref={pinRef} className="relative h-screen overflow-hidden">
        <div className="absolute left-6 top-20 z-10 md:left-12">
          <p className="font-display text-[11px] tracking-[0.35em] text-muted">SOURCING // THE SMASH INGREDIENTS</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-text md:text-5xl">
            <span className="text-accent">{"// 06."}</span> THE CUT
          </h2>
        </div>
        <div ref={trackRef} className="flex h-full items-center gap-6 pl-6 pr-[40vw] md:gap-10 md:pl-12">
          {CARDS.map((c) => {
            const useFallback = failed.has(c.n);
            return (
              <article
                key={c.n}
                className="relative flex h-[58vh] w-[80vw] shrink-0 flex-col justify-end overflow-hidden rounded-3xl border border-stroke md:w-[38vw]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={useFallback ? c.imgFallback : c.img}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  onError={() => {
                    if (!useFallback) setFailed((prev) => new Set([...prev, c.n]));
                  }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_25%,rgba(8,6,4,0.92)_75%)]" />
                <div className="relative z-10 p-8">
                  <span className="absolute right-6 top-6 font-display text-6xl text-white/10">{c.n}</span>
                  <span className="absolute right-6 top-16 font-display text-[9px] tracking-[0.3em] text-accent">
                    {c.tag}
                  </span>
                  <h3 className="font-display text-2xl tracking-wide text-text md:text-3xl">{c.name}</h3>
                  <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted">{c.spec}</p>
                  <div className="mt-5 h-px w-full bg-stroke/50" />
                </div>
              </article>
            );
          })}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-[10px] tracking-[0.3em] text-muted">
          SCROLL TO BROWSE →
        </div>
      </div>
    </div>
  );
}
