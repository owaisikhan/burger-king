"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Observer } from "gsap/Observer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);
}

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Glide timing for every step: long and soft so each stop settles gently. */
const GLIDE = { min: 1.4, max: 3, perProgress: 6, ease: "sine.inOut" };

/*
 * Fallback for keyboard and scrollbar scrolling: after the scroll ends, glide
 * to the next stop in the direction of travel. Stays put when already on one.
 */
export function stepSnap(stops: number[]): ScrollTrigger.Vars["snap"] {
  if (prefersReducedMotion()) return undefined;
  return {
    snapTo: (value: number, self?: ScrollTrigger) => {
      const here = stops.find((p) => Math.abs(p - value) < 0.002);
      if (here !== undefined) return here;
      const dir = self?.direction ?? 1;
      if (dir > 0) return stops.find((p) => p >= value) ?? 1;
      return [...stops].reverse().find((p) => p <= value) ?? 0;
    },
    duration: { min: GLIDE.min, max: GLIDE.max },
    delay: 0.06,
    ease: GLIDE.ease,
    inertia: false,
  };
}

/*
 * Full takeover for a pinned section: while it is on screen, native scrolling
 * is blocked and each swipe (or wheel flick) plays an automatic glide to the
 * next stop, even with the finger still down. Past the last stop the next
 * swipe carries the reader to the following section; before the first, back
 * above it. Spread `callbacks` into the ScrollTrigger config, call `kill()`
 * on cleanup. Off under reduced motion.
 */
export function createStepper(stops: number[]) {
  let st: ScrollTrigger | null = null;
  let animating = false;
  let lastInput = 0;
  let usedThisTouch = false;

  const glide = (y: number, duration: number) => {
    animating = true;
    gsap.to(window, {
      scrollTo: { y, autoKill: false },
      duration,
      ease: GLIDE.ease,
      overwrite: true,
      onComplete: () => {
        animating = false;
      },
    });
  };

  const step = (dir: number) => {
    if (!st) return;
    const p = st.progress;
    const target = dir > 0 ? stops.find((x) => x > p + 0.002) : [...stops].reverse().find((x) => x < p - 0.002);
    if (target === undefined) {
      if (dir < 0 && st.start <= 1) return;
      observer.disable();
      glide(dir > 0 ? st.end + window.innerHeight : Math.max(0, st.start - window.innerHeight), 1.6);
      return;
    }
    const duration = gsap.utils.clamp(GLIDE.min, GLIDE.max, Math.abs(target - p) * GLIDE.perProgress);
    glide(st.start + target * (st.end - st.start), duration);
  };

  const observer = Observer.create({
    target: window,
    type: "wheel,touch",
    tolerance: 6,
    preventDefault: true,
    onPress: () => {
      usedThisTouch = false;
    },
    onChangeY: (self) => {
      const now = performance.now();
      const isWheel = self.event.type === "wheel";
      const gap = now - lastInput;
      lastInput = now;
      if (animating || !st) return;
      // One step per touch gesture; a wheel needs a short pause between flicks
      // so trackpad inertia does not trigger a second step.
      if (isWheel ? gap < 180 : usedThisTouch) return;
      // Wheel: positive delta scrolls down. Touch: a finger moving up scrolls down.
      const dir = isWheel ? Math.sign(self.deltaY) : -Math.sign(self.deltaY);
      if (!dir) return;
      if (!isWheel) usedThisTouch = true;
      step(dir);
    },
  });
  observer.disable();

  const inside = (self: ScrollTrigger) => window.scrollY >= self.start - 2 && window.scrollY <= self.end + 2;

  // ScrollTrigger is not "active" exactly on its start or end pixel.
  const onScroll = () => {
    if (st && !observer.isEnabled && !animating && inside(st)) observer.enable();
  };
  const reduced = prefersReducedMotion();
  if (!reduced) window.addEventListener("scroll", onScroll, { passive: true });

  const callbacks: Partial<ScrollTrigger.Vars> = reduced
    ? {}
    : {
        onRefresh: (self) => {
          st = self;
          if (inside(self)) observer.enable();
        },
        onToggle: (self) => {
          st = self;
          if (self.isActive) observer.enable();
          else if (!inside(self)) observer.disable();
        },
        // Settle on the edge stop after arriving by normal scrolling, checked a
        // frame later so a menu-link jump through the section is not pulled back.
        onEnter: (self) => {
          st = self;
          requestAnimationFrame(() => {
            if (self.isActive && !animating) glide(self.start, 0.9);
          });
        },
        onEnterBack: (self) => {
          st = self;
          requestAnimationFrame(() => {
            if (self.isActive && !animating) glide(self.end, 0.9);
          });
        },
      };

  return {
    callbacks,
    kill: () => {
      window.removeEventListener("scroll", onScroll);
      observer.kill();
    },
  };
}
