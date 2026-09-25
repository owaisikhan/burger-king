"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
 * Continuous scrolling that settles. The reader scrolls freely (momentum
 * included); once the page comes to rest inside the section with no finger on
 * the screen, it glides to the nearest stop. Stops sit on whole video frames,
 * so the hero never rests between two shots. Touching the screen cancels a
 * glide. Off under reduced motion.
 */
export function createSettle(stops: number[]) {
  let st: ScrollTrigger | null = null;
  let fingerDown = false;
  let lastScroll = 0;
  let tween: gsap.core.Tween | null = null;
  let timer = 0;
  // The stop the reader last rested on; settling continues away from it.
  let lastStop: number | null = null;
  const NUDGE = 0.03; // under about 150px of a stop, a nudge returns to it

  const settle = () => {
    if (!st || fingerDown || tween) return;
    const y = window.scrollY;
    if (y < st.start || y > st.end) return;
    const p = st.progress;
    const nearest = stops.reduce((best, s) => (Math.abs(s - p) < Math.abs(best - p) ? s : best), stops[0]);
    const from = lastStop ?? nearest;
    let target = nearest;
    if (Math.abs(p - from) >= NUDGE) {
      // Moved on from a stop: carry on to the next shot in that direction.
      target = p > from ? (stops.find((s) => s >= p) ?? 1) : ([...stops].reverse().find((s) => s <= p) ?? 0);
    } else {
      target = from;
    }
    if (Math.abs(target - p) < 0.0005) {
      lastStop = target;
      return;
    }
    tween = gsap.to(window, {
      scrollTo: { y: st.start + target * (st.end - st.start), autoKill: true },
      duration: gsap.utils.clamp(0.5, 1.4, Math.abs(target - p) * 6),
      ease: "sine.inOut",
      onComplete: () => {
        tween = null;
        lastStop = target;
      },
      onInterrupt: () => {
        tween = null;
      },
    });
  };

  // Settle a moment after the last scroll event, never while a finger is down.
  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (performance.now() - lastScroll >= 140) settle();
    }, 160);
  };
  const onScroll = () => {
    lastScroll = performance.now();
    if (!tween) schedule();
  };
  const onUp = () => {
    fingerDown = false;
    schedule();
  };
  const onDown = (e: TouchEvent) => {
    fingerDown = true;
    tween?.kill();
    tween = null;
    window.clearTimeout(timer);
    // If the touched element leaves the page mid-swipe, touchend never reaches
    // window; the element itself still receives it.
    e.target?.addEventListener("touchend", onUp, { once: true, passive: true });
    e.target?.addEventListener("touchcancel", onUp, { once: true, passive: true });
  };

  const reduced = prefersReducedMotion();
  if (!reduced) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchend", onUp, { passive: true });
    window.addEventListener("touchcancel", onUp, { passive: true });
  }

  return {
    attach: (trigger: ScrollTrigger) => {
      st = trigger;
      lastStop = stops.reduce((best, s) => (Math.abs(s - trigger.progress) < Math.abs(best - trigger.progress) ? s : best), stops[0]);
    },
    kill: () => {
      window.clearTimeout(timer);
      tween?.kill();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("touchcancel", onUp);
    },
  };
}
