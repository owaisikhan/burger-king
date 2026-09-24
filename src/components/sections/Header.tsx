"use client";

import { useEffect, useState } from "react";

const NAV = [
  "01. Line-Up",
  "02. Build",
  "03. Overview",
  "04. Sear",
  "05. Craft",
  "06. The Cut",
  "07. Story",
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The mobile menu closes on the first scroll after opening.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, { once: true, passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-bg/95 backdrop-blur-md border-b border-stroke" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <div className="flex flex-col leading-none">
          <span className="font-display text-base tracking-[0.25em] text-text">SMASH</span>
          <span className="font-display text-[9px] tracking-[0.4em] text-muted">GRIDDLE-FORGED</span>
        </div>
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV.map((label, i) => (
            <li key={label}>
              <a
                href="#"
                className={`font-display text-[11px] tracking-[0.2em] transition-colors hover:text-text ${
                  i === 0 ? "text-text" : "text-muted"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-[5px] p-2 lg:hidden"
          aria-label="Menu"
        >
          <span className={`block h-px w-5 bg-text transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-px w-5 bg-text transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-5 bg-text transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
        <div className="hidden items-center gap-2 font-display text-[11px] tracking-[0.25em] text-muted lg:flex">
          MENU
          <span className="flex flex-col gap-[3px]">
            <span className="h-px w-4 bg-muted" />
            <span className="h-px w-4 bg-muted" />
          </span>
        </div>
      </nav>
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out lg:hidden ${open ? "max-h-96" : "max-h-0"}`}
      >
        <ul className="flex flex-col border-t border-stroke px-6 pb-6 pt-4">
          {NAV.map((label, i) => (
            <li key={label}>
              <a
                href="#"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-4 py-3.5 font-display text-[13px] tracking-[0.2em] transition-colors hover:text-accent ${
                  i === 0 ? "text-text" : "text-muted"
                }`}
              >
                <span className="h-px w-4 bg-accent/40" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
