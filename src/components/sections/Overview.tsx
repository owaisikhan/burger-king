"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const FACTS = [
  { label: "PATTY WEIGHT", value: "120 G" },
  { label: "SMASH TIME", value: "8 SEC" },
  { label: "GRILL TEMP", value: "230 °C" },
  { label: "FAT RATIO", value: "80 / 20" },
  { label: "PATTIES", value: "01" },
  { label: "ORIGIN", value: "FRESH GROUND" },
];

export function Overview() {
  const ref = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            once: true,
            onEnter: () => {
              videoRef.current?.play().catch(() => {});
            },
          },
          defaults: { ease: "power3.out" },
        })
        .from(mediaRef.current, { opacity: 0, x: 60, duration: 1.1 })
        .from(copyRef.current!.children, { opacity: 0, y: 40, stagger: 0.12, duration: 0.85 }, "-=0.7")
        .from(factsRef.current!.children, { opacity: 0, y: 20, stagger: 0.07, duration: 0.6 }, "-=0.5");
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="overview" className="relative overflow-hidden bg-bg px-6 py-24 md:px-12 md:py-32">
      <div className="pointer-events-none absolute right-0 top-0 h-[700px] w-[700px] translate-x-1/3 -translate-y-1/4 rounded-full bg-accent/8 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/3 translate-y-1/4 rounded-full bg-accent/4 blur-[120px]" />
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 md:grid-cols-2">
        <div ref={copyRef} className="order-1 md:order-1">
          <p className="font-display text-[11px] tracking-[0.4em] text-muted">03 // OVERVIEW · THE SMASH SEAR</p>
          <h1 className="mt-4 font-display text-5xl leading-none tracking-tight text-text md:text-7xl lg:text-8xl">
            SMASH
            <br />
            <span className="text-accent">SEAR</span>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            A 120g ball of fresh-ground beef, smashed thin on a 230°C flat-top in eight seconds. One patty. Maximum
            crust. Every gram engineered for one bite.
          </p>
          <div className="mt-10 h-px w-full bg-stroke" />
          <div ref={factsRef} className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.label}>
                <p className="font-display text-[10px] tracking-[0.3em] text-muted">{f.label}</p>
                <p className="mt-1 font-display text-lg tracking-wide text-text">{f.value}</p>
              </div>
            ))}
          </div>
          <a
            href="#"
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-stroke bg-surface px-7 py-3 font-display text-xs tracking-[0.25em] text-text transition-all hover:border-accent hover:text-accent"
          >
            RESERVE A TABLE <span className="text-accent">→</span>
          </a>
        </div>
        <div ref={mediaRef} className="order-2 flex items-center justify-center md:order-2">
          <div className="relative">
            <span className="absolute -left-2 -top-2 z-20 h-9 w-9 border-l-2 border-t-2 border-accent" />
            <span className="absolute -right-2 -top-2 z-20 h-9 w-9 border-r-2 border-t-2 border-accent" />
            <span className="absolute -bottom-2 -left-2 z-20 h-9 w-9 border-b-2 border-l-2 border-accent" />
            <span className="absolute -bottom-2 -right-2 z-20 h-9 w-9 border-b-2 border-r-2 border-accent" />
            <div className="relative h-[56vw] w-full max-w-[560px] overflow-hidden rounded-2xl border border-stroke/40 bg-surface md:h-[560px] md:w-[560px] lg:w-[660px]">
              <video
                ref={videoRef}
                src="/steam-loop.mp4"
                preload="none"
                muted
                loop
                playsInline
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                <p className="font-display text-[10px] tracking-[0.4em] text-accent">SEARING NOW</p>
                <p className="mt-1 font-display text-2xl text-text">230°C</p>
              </div>
            </div>
            <div className="absolute -bottom-5 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-stroke bg-surface/90 px-5 py-2 backdrop-blur-md">
              <span className="font-display text-[10px] tracking-[0.3em] text-accent">GRIDDLE-FORGED · SINCE 2024</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
