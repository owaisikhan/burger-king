"use client";

import { useEffect, useRef, useState } from "react";
import { createSettle, gsap, ScrollTrigger } from "@/lib/gsap";

/*
 * Pinned hero: a 600%-tall scroll scrubs a WebP frame sequence drawn to a
 * canvas (200 frames desktop, 100 on phones), with a camera HUD whose
 * readouts, progress bar and three copy blocks all follow the same progress.
 */

const SPECS: [string, string][] = [
  ["GRILL TEMP", "230 °C"],
  ["SMASH TIME", "8 SEC"],
  ["BEEF", "FRESH-GROUND 80/20"],
  ["CHEESE", "MELTED AMERICAN"],
  ["BUN", "TOASTED BRIOCHE"],
  ["PATTY WEIGHT", "120 G"],
  ["SEAR", "MAILLARD +"],
];

/** 1 inside |p - center| <= half, fading linearly to 0 over `fade`. */
const band = (p: number, center: number, half: number, fade = 0.05) => {
  const d = Math.abs(p - center);
  return d <= half ? 1 : d >= half + fade ? 0 : 1 - (d - half) / fade;
};

export function Hero() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const smashRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const railDotRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const tempRef = useRef<HTMLParagraphElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const [gate, setGate] = useState<"scroll" | "gone">("scroll");
  const [gateVisible, setGateVisible] = useState(false);
  const [frameCount, setFrameCount] = useState(200);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const total = isMobile ? 100 : 200;
    setFrameCount(total);
    const dir = isMobile ? "smash-mobile" : "smash";
    // Each stop rests on a steady shot: the hand with the beef ball, the seared
    // patty, the cheese melting, the floating ingredients, the finished burger.
    // When scrolling stops inside the hero, it settles on the nearest one.
    const STOPS = [0, 33 / 99, 51 / 99, 74 / 99, 1];
    const stopFrames = STOPS.map((p) => Math.round(p * (total - 1)));
    const src = (i: number) => `/frames/${dir}/f_${String(i + 1).padStart(3, "0")}.webp`;
    const sectionOf = (i: number) => {
      const t = i / (total - 1);
      return t < 0.14 ? "01" : t < 0.55 ? "02" : "03";
    };
    const phaseOf = (i: number) => {
      const t = i / (total - 1);
      if (t < 0.14) return "01 · OVERVIEW";
      if (t < 0.42) return "// PUSH-IN";
      if (t < 0.62) return "02 · THE CUT";
      if (t < 0.86) return "// UNSMASH";
      return "03 · THE SMASH";
    };

    // Two stacked canvases: the lower one holds the current frame, the upper one
    // the next frame, faded in with CSS opacity by how far between them the
    // scroll is. When the video moves on a frame the canvases swap roles, so
    // only one image is redrawn per frame change and the blend itself is a
    // cheap compositor opacity change.
    const layers = [canvasRef.current!, canvasBRef.current!].map((c) => ({ c, ctx: c.getContext("2d")!, frame: -1 }));
    let lowerIdx = 0;

    const frames: (ImageBitmap | null)[] = Array(total).fill(null);
    const loading = new Set<number>();
    // Fractional frame position from the scroll, e.g. 33.4 = frame 33 with 40% of 34.
    let pos = 0;
    let raf = 0;
    let cssW = 0;
    let cssH = 0;

    const paint = (layer: (typeof layers)[number], img: CanvasImageSource & { width: number; height: number }) => {
      const s = Math.max(cssW / img.width, cssH / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      layer.ctx.drawImage(img, (cssW - dw) / 2, (cssH - dh) / 2, dw, dh);
    };
    const put = (layer: (typeof layers)[number], i: number) => {
      if (layer.frame === i || !frames[i]) return;
      paint(layer, frames[i]!);
      layer.frame = i;
    };

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < total; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };

    // At most one update per screen refresh.
    const render = () => {
      raf = 0;
      const i0 = Math.floor(pos);
      const i1 = Math.min(total - 1, i0 + 1);
      let frac = pos - i0;
      let base = i0;
      if (!frames[i0]) {
        // Not arrived yet: show the closest frame that has, without a blend.
        base = nearestLoaded(Math.round(pos));
        if (base < 0) return;
        frac = 0;
      }
      // Reuse whichever canvas already holds the frame we need underneath.
      const lowerNow = layers[lowerIdx];
      const upperNow = layers[1 - lowerIdx];
      if (lowerNow.frame !== base && (upperNow.frame === base || lowerNow.frame === i1)) lowerIdx = 1 - lowerIdx;
      const lower = layers[lowerIdx];
      const upper = layers[1 - lowerIdx];
      put(lower, base);
      // Phones have 100 frames, so they blend between them; desktops play all
      // 200 and skip the second layer, which keeps large-screen compositing cheap.
      const blend = isMobile && base === i0 && i1 !== i0 && frames[i1] && frac > 0.02 ? frac : 0;
      if (blend) put(upper, i1);
      lower.c.style.zIndex = "0";
      upper.c.style.zIndex = "1";
      lower.c.style.opacity = "1";
      upper.c.style.opacity = blend ? blend.toFixed(3) : "0";
      const shown = String(blend > 0.5 ? i1 : base);
      layers.forEach((l) => (l.c.dataset.frame = shown));
    };
    const requestRender = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const load = (i: number) =>
      fetch(src(i))
        .then((r) => r.blob())
        .then((b) => createImageBitmap(b))
        .then((bmp) => {
          frames[i] = bmp;
          requestRender();
        })
        .catch(() => {})
        .finally(() => loading.delete(i));

    // Stop frames load first so every snap lands on its exact frame, then the
    // rest in order, with a fixed number of parallel workers.
    const order = [...stopFrames, ...Array.from({ length: total }, (_, k) => k).filter((k) => !stopFrames.includes(k))];
    const workers = isMobile ? 8 : 24;
    let next = 0;
    const pump = () => {
      if (next >= order.length) return;
      const i = order[next++];
      if (frames[i] || loading.has(i)) {
        pump();
        return;
      }
      loading.add(i);
      load(i).finally(pump);
    };
    for (let k = 0; k < Math.min(workers, total); k++) pump();

    // A plain <img> of frame 0 paints before the bitmap pipeline is ready.
    const poster = new Image();
    poster.onload = () => {
      if (layers[0].frame < 0) paint(layers[0], poster);
    };
    poster.src = src(0);

    // Size the canvas to the screen. Phones fire resize whenever the address
    // bar slides; reallocating the canvas then is costly and pointless, so only
    // a width change or a large height change resizes it.
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === cssW && Math.abs(h - cssH) < 160) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cssW = w;
      cssH = isMobile ? Math.max(h, window.screen.height) : h;
      for (const l of layers) {
        l.c.width = Math.round(cssW * dpr);
        l.c.height = Math.round(cssH * dpr);
        l.c.style.width = `${cssW}px`;
        l.c.style.height = `${cssH}px`;
        l.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        l.ctx.imageSmoothingQuality = "medium";
        l.frame = -1;
      }
      if (frames.some(Boolean)) requestRender();
      else if (poster.complete && poster.naturalWidth) paint(layers[0], poster);
    };
    resize();
    window.addEventListener("resize", resize);

    // Markers move with transforms, never left/top, so scrubbing causes no layout.
    let barW = 0;
    let railH = 0;
    const measure = () => {
      barW = barRef.current?.offsetWidth ?? 0;
      railH = railDotRef.current?.parentElement?.offsetHeight ?? 0;
    };
    measure();
    window.addEventListener("resize", measure);

    const setOpacity = (el: HTMLElement | null, v: number) => {
      if (el) el.style.opacity = String(v);
    };

    const settle = createSettle(STOPS);
    const ctxGsap = gsap.context(() => {
      gsap.from(".hc-stagger", {
        opacity: 0,
        y: 34,
        duration: 1,
        stagger: 0.12,
        delay: 0.2,
        ease: "power3.out",
      });
      const heroTrigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: "+=600%",
        // A softer scrub: the video eases after the finger instead of jumping.
        scrub: 0.8,
        pin: pinRef.current,
        anticipatePin: 1,
        onUpdate: (self) => {
          const t = self.progress;
          pos = t * (total - 1);
          requestRender();
          const i = Math.round(pos);
          if (frameRef.current) frameRef.current.textContent = String(i).padStart(3, "0");
          if (phaseRef.current) phaseRef.current.textContent = phaseOf(i);
          if (sectionRef.current) sectionRef.current.textContent = sectionOf(i);
          if (barRef.current) barRef.current.style.transform = `scaleX(${t})`;
          if (markerRef.current) markerRef.current.style.transform = `translateX(${t * barW}px)`;
          if (railDotRef.current) railDotRef.current.style.transform = `translateY(${t * railH}px)`;
          if (flashRef.current) flashRef.current.style.opacity = String(band(t, 0.87, 0.006, 0.06) * 0.8);
          if (tempRef.current) tempRef.current.textContent = `${Math.round(Math.min(1, t / 0.38) * 230)}°C`;
          // Copy blocks are centred on the stops they rest at.
          setOpacity(introRef.current, band(t, STOPS[0], 0.05, 0.05));
          setOpacity(specsRef.current, Math.max(band(t, STOPS[1], 0.05, 0.06), band(t, STOPS[3], 0.05, 0.06)));
          setOpacity(smashRef.current, band(t, STOPS[2], 0.05, 0.06));
        },
      });
      // Free, continuous scrolling; when it comes to rest, settle on the nearest stop.
      settle.attach(heroTrigger);
    }, triggerRef);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
      settle.kill();
      ctxGsap.revert();
      frames.forEach((f) => f?.close());
    };
  }, []);

  // "SCROLL NOW" gate fades in, then leaves on the first real scroll.
  useEffect(() => {
    if (gate !== "scroll") return;
    const raf = requestAnimationFrame(() => setGateVisible(true));
    let done = false;
    const onScroll = () => {
      if (done || window.scrollY <= 24) return;
      done = true;
      setGateVisible(false);
      window.setTimeout(() => setGate("gone"), 750);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [gate]);

  // 24fps SMPTE-style timecode.
  useEffect(() => {
    let f = 0;
    const id = window.setInterval(() => {
      f = (f + 1) % (1440 * 60 * 24);
      const ff = f % 24;
      const ss = Math.floor(f / 24) % 60;
      const mm = Math.floor(f / 1440) % 60;
      const hh = Math.floor(f / (1440 * 60)) % 24;
      const p = (n: number) => String(n).padStart(2, "0");
      if (timecodeRef.current) timecodeRef.current.textContent = `${p(hh)}:${p(mm)}:${p(ss)}:${p(ff)}`;
    }, 1000 / 24);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div ref={triggerRef}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-black">
        <div className="hero-drift absolute inset-0" aria-hidden="true">
          <canvas ref={canvasRef} className="absolute left-0 top-0 will-change-[opacity]" />
          <canvas ref={canvasBRef} className="absolute left-0 top-0 opacity-0 will-change-[opacity]" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black from-0% via-black/35 via-26% to-transparent to-54%" />
        <div className="pointer-events-none absolute inset-0 bg-black/20 md:hidden" />
        <div className="cam-vignette pointer-events-none absolute inset-0 z-[5]" />
        <div className="cam-scanlines pointer-events-none absolute inset-0 z-[5] opacity-60" />
        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 z-[6] opacity-0 bg-[radial-gradient(circle_at_66%_50%,rgba(235,200,140,0.55),rgba(194,161,90,0.2)_30%,transparent_60%)]"
        />

        <div className="pointer-events-none absolute inset-0 z-10 font-display text-muted">
          <div className="hud-grid absolute inset-0 opacity-70" />
          <div className="hud-scan absolute inset-x-0 top-0 h-px bg-accent/15" />

          <div className="absolute inset-x-5 top-[68px] flex items-center justify-between border-t border-white/10 pt-2 text-[9px] tracking-[0.3em] text-muted/70 md:inset-x-8">
            <span className="flex items-center gap-2">
              <span className="rec-blink inline-block h-2.5 w-2.5 rounded-full bg-[#ff2d2d] shadow-[0_0_10px_#ff2d2d]" />
              <span className="text-[#ff5a5a]">REC</span>
              <span ref={timecodeRef} className="tabular ml-1 text-text">
                00:00:00:00
              </span>
            </span>
            <span className="hidden md:inline">SEARLINE // SINGLE PATTY SEAR</span>
            <span className="tabular text-muted/80">4K · 24FPS · F2.8 · 1/50</span>
          </div>

          <span className="absolute left-5 top-24 h-9 w-9 border-l-2 border-t-2 border-white/65 md:left-8" />
          <span className="absolute right-5 top-24 h-9 w-9 border-r-2 border-t-2 border-white/65 md:right-8" />
          <span className="absolute bottom-20 left-5 h-9 w-9 border-b-2 border-l-2 border-white/65 md:left-8" />
          <span className="absolute bottom-20 right-5 h-9 w-9 border-b-2 border-r-2 border-white/65 md:right-8" />

          <div className="absolute left-8 top-[28%] hidden h-[44%] w-px bg-white/12 md:block">
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <span
                key={p}
                className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-white/30 bg-bg"
                style={{ top: `${p * 100}%` }}
              />
            ))}
            <div
              ref={railDotRef}
              className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
              style={{ top: "0%" }}
            />
          </div>

          <div className="hud-ticks absolute right-5 top-1/2 hidden h-56 w-3 -translate-y-1/2 opacity-80 md:block" />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-[66%]">
            <div className="relative h-44 w-44 md:h-64 md:w-64">
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/12" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/12" />
              <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/70" />
              <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-accent/50" />
              <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-accent/50" />
              <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-accent/50" />
              <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-accent/50" />
            </div>
          </div>

          <div className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] text-[9px] tracking-[0.45em] text-muted/60 md:block">
            SEARLINE CUT No.01 · FRESH-GROUND SEAR
          </div>
          <div className="absolute left-2.5 top-1/2 hidden -translate-y-1/2 rotate-180 [writing-mode:vertical-rl] text-[9px] tracking-[0.45em] text-muted/50 md:block">
            SCROLL TO EXPLORE
          </div>

          <div className="absolute inset-x-5 bottom-6 md:inset-x-8">
            <div className="mb-2.5 flex items-end justify-between text-[9px] tracking-[0.3em] text-muted/80">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-2 border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur-sm">
                  <span className="hud-blink inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  <span ref={phaseRef} className="text-text">
                    01 · OVERVIEW
                  </span>
                </span>
              </span>
              <span className="hidden items-center gap-5 md:flex">
                <span>
                  ISO <span className="tabular text-text">800</span>
                </span>
                <span>
                  WB <span className="tabular text-text">5600K</span>
                </span>
                <span>
                  SECTION{" "}
                  <span ref={sectionRef} className="tabular text-accent">
                    01
                  </span>
                  <span className="text-muted/50"> / 05</span>
                </span>
                <span>
                  FRAME{" "}
                  <span ref={frameRef} className="tabular text-accent">
                    000
                  </span>
                  <span className="text-muted/50"> / {frameCount}</span>
                </span>
                <span className="border border-white/15 bg-black/40 px-2.5 py-1 text-accent">◢ SCRUB ACTIVE</span>
              </span>
            </div>
            <div className="relative h-8">
              <div className="absolute -top-3 left-0 right-0 flex justify-between text-[8px] tracking-[0.2em] text-muted/55">
                <span>01</span>
                <span>02</span>
                <span>03</span>
                <span>02</span>
                <span>01</span>
              </div>
              <div className="hud-hticks-fine absolute bottom-[18px] h-1.5 w-full opacity-50" />
              <div className="hud-hticks-major absolute bottom-1.5 h-5 w-full opacity-90" />
              <div className="hud-hticks absolute bottom-1.5 h-3 w-full opacity-80" />
              <div className="absolute bottom-1.5 h-px w-full bg-white/35" />
              <div
                ref={barRef}
                className="absolute bottom-[5px] h-[3px] w-full origin-left rounded-full bg-accent shadow-[0_0_16px_3px_var(--color-accent)]"
                style={{ transform: "scaleX(0)" }}
              />
              <div
                ref={markerRef}
                className="absolute bottom-[1px] h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 bg-accent shadow-[0_0_18px_5px_var(--color-accent)]"
                style={{ left: "0%" }}
              />
            </div>
          </div>
        </div>

        <div className="absolute left-6 top-1/2 z-20 max-w-[calc(100%-48px)] -translate-y-1/2 md:left-14 md:max-w-xl">
          <div ref={introRef}>
            <p className="hc-stagger mb-4 text-[10px] tracking-[0.4em] text-muted md:mb-6 md:text-[11px] md:tracking-[0.45em]">
              GRIDDLE-FORGED // CUT No.01
            </p>
            <h1 className="hc-stagger font-display text-5xl leading-[0.95] tracking-tight text-text md:text-8xl">
              SEARLINE
              <br />
              <span className="text-accent">{"// "}</span>THE SEAR
            </h1>
            <p className="hc-stagger mt-6 text-sm tracking-[0.3em] text-muted">FRESH-GROUND · SMASHED · SEARED</p>
          </div>
        </div>

        <div
          ref={specsRef}
          className="absolute left-6 top-1/2 z-20 max-w-[calc(100%-48px)] -translate-y-1/2 opacity-0 md:left-14 md:max-w-md"
        >
          <p className="font-display text-[10px] tracking-[0.3em] text-muted md:text-[11px] md:tracking-[0.35em]">
            THE CUT // SMASH No.01
          </p>
          <h2 className="mt-2 font-display text-3xl leading-none tracking-tight text-text md:mt-3 md:text-6xl">
            SPECIFICATIONS
            <br />
            <span className="text-accent">{"// 02."}</span> THE CUT
          </h2>
          <p className="mt-4 font-display text-[10px] tracking-[0.3em] text-muted md:mt-5 md:text-[11px]">GRILL TEMP:</p>
          <p ref={tempRef} className="tabular font-display text-5xl text-accent md:text-7xl">
            230°C
          </p>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted">
            One fresh-ground patty hits a 230°C flat-top, smashed thin to lock in a deep Maillard crust while staying
            juicy at the core.
          </p>
          <div className="mt-5 space-y-1.5">
            {SPECS.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-stroke/60 pb-1 text-[10px] tracking-wider">
                <span className="text-muted">{k}</span>
                <span className="tabular text-text">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={smashRef}
          className="absolute left-6 top-1/2 z-20 max-w-[calc(100%-48px)] -translate-y-1/2 opacity-0 md:left-14 md:max-w-md"
        >
          <p className="font-display text-[10px] tracking-[0.3em] text-muted md:text-[11px] md:tracking-[0.35em]">
            THE SMASH //
          </p>
          <h2 className="mt-2 font-display text-3xl leading-none tracking-tight text-text md:mt-3 md:text-6xl">
            <span className="text-accent">03.</span> THE
            <br />
            SMASH
          </h2>
          <p className="mt-6 max-w-xs text-xs leading-relaxed text-muted">
            One patty, built to perfection. Brioche, shredded lettuce, dill pickles, melted American, single smash and
            the house sauce, smashed together.
          </p>
          <p className="mt-6 font-display text-[11px] tracking-[0.3em] text-muted">SEAR PROFILE:</p>
          <p className="font-display text-2xl tracking-[0.2em] text-accent">MAILLARD</p>
        </div>

        {gate !== "gone" && (
          <div className="pointer-events-none absolute inset-0 z-40">
            <div
              className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-out ${
                gateVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/55 bg-black/70 px-5 py-5 shadow-[0_0_70px_rgba(194,161,90,0.4),inset_0_0_30px_rgba(0,0,0,0.6)] md:px-12 md:py-8">
                <p className="font-display text-2xl tracking-[0.2em] text-accent [text-shadow:0_0_28px_rgba(194,161,90,0.95),0_3px_12px_rgba(0,0,0,0.95)] md:text-4xl md:tracking-[0.4em]">
                  SCROLL NOW
                </p>
                <p className="font-display text-xs tracking-[0.45em] text-text [text-shadow:0_2px_10px_rgba(0,0,0,0.95)]">
                  SCROLL DOWN TO BEGIN
                </p>
                <span className="gate-bounce text-4xl text-accent drop-shadow-[0_0_20px_rgba(194,161,90,0.95)]">↓</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
