"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "@/lib/gsap";

const TIMES = ["12:00", "12:30", "13:00", "13:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Chevron = ({ d }: { d: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

function Calendar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const first = new Date(view.year, view.month, 1);
  const days = new Date(view.year, view.month + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Monday-first grid
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const selected = value ? new Date(value + "T00:00:00") : null;
  const isPast = (d: number) =>
    new Date(view.year, view.month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isToday = (d: number) =>
    view.year === today.getFullYear() && view.month === today.getMonth() && d === today.getDate();
  const isSelected = (d: number) =>
    !!selected &&
    selected.getFullYear() === view.year &&
    selected.getMonth() === view.month &&
    selected.getDate() === d;
  const pick = (d: number) => {
    if (isPast(d)) return;
    onChange(`${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  };

  const navBtn =
    "flex h-7 w-7 items-center justify-center rounded-lg border border-stroke text-muted transition-colors hover:border-accent hover:text-accent md:h-9 md:w-9 md:rounded-xl";

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between md:mb-4">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }))}
          className={navBtn}
        >
          <Chevron d="M9 2L4 7l5 5" />
        </button>
        <span className="font-display text-sm tracking-[0.2em] text-text">
          {MONTHS[view.month].toUpperCase()} {view.year}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }))}
          className={navBtn}
        >
          <Chevron d="M5 2l5 5-5 5" />
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-0.5 md:mb-2 md:gap-1">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center font-display text-[9px] tracking-[0.1em] text-muted/50 md:text-[10px] md:tracking-[0.2em]">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 md:gap-1">
        {cells.map((d, i) => (
          <button
            key={i}
            type="button"
            disabled={!d || isPast(d)}
            onClick={() => d && pick(d)}
            className={`aspect-square rounded-lg font-display text-xs transition-all duration-150 md:rounded-xl md:text-sm ${
              d
                ? isSelected(d)
                  ? "bg-accent text-bg shadow-[0_0_16px_rgba(194,161,90,0.6)]"
                  : isToday(d)
                    ? "border border-accent text-accent hover:bg-accent/20"
                    : isPast(d)
                      ? "text-muted/20 cursor-not-allowed"
                      : "text-muted hover:bg-surface hover:text-text"
                : ""
            }`}
          >
            {d || ""}
          </button>
        ))}
      </div>
    </div>
  );
}

const slotClass = (active: boolean) =>
  `rounded-xl border py-3.5 font-display text-xs tracking-wider transition-all duration-200 ${
    active
      ? "border-accent bg-accent text-bg shadow-[0_0_20px_rgba(194,161,90,0.5)]"
      : "border-stroke bg-surface text-muted hover:border-accent/50 hover:text-text"
  }`;

const inputClass =
  "w-full rounded-2xl border border-stroke bg-surface px-5 py-4 font-display text-base md:text-sm text-text placeholder:text-muted/30 transition-all focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(194,161,90,0.15)]";

export function Reserve() {
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current!.children, {
        opacity: 0,
        y: 50,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top bottom", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const ready = Boolean(date && time && name && contact);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (ready) setConfirmed(true);
  };
  const formatDate = (v: string) => {
    if (!v) return "";
    const [y, m, d] = v.split("-");
    return `${d} ${MONTHS[parseInt(m) - 1]} ${y}`;
  };

  return (
    <section ref={ref} className="relative overflow-hidden bg-surface px-6 py-28 md:px-12 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-[180px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-accent/5 blur-[120px]" />
      <span className="pointer-events-none absolute left-6 top-6 h-14 w-14 border-l border-t border-accent/30 md:left-14 md:top-14" />
      <span className="pointer-events-none absolute right-6 bottom-6 h-14 w-14 border-r border-b border-accent/30 md:right-14 md:bottom-14" />
      <div className="mx-auto max-w-[1100px]">
        <div ref={headRef} className="mb-16 text-center">
          <p className="font-display text-[11px] tracking-[0.45em] text-accent">BOOK YOUR TABLE · SEARLINE</p>
          <h2 className="mt-5 font-display leading-none tracking-tight text-text uppercase text-[clamp(3rem,9vw,8rem)]">
            RESERVE
            <br />
            <span className="text-accent">YOUR SMASH</span>
          </h2>
          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-muted">
            Open daily 12:00 to 22:00 · Walk-ins welcome, reservation preferred.
          </p>
          <div className="mx-auto mt-8 h-px w-20 bg-accent/40" />
        </div>

        {confirmed ? (
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-accent/30 bg-bg/60 py-20 text-center backdrop-blur-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-accent bg-accent/10 shadow-[0_0_40px_rgba(194,161,90,0.3)]">
              <span className="font-display text-3xl text-accent">✓</span>
            </div>
            <h3 className="font-display text-2xl tracking-tight text-text md:text-4xl">RESERVATION CONFIRMED</h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              We look forward to seeing you, <span className="text-text">{name}</span>.
              <br />
              <span className="text-accent">
                {formatDate(date)} · {time} · {guests} {guests === 1 ? "guest" : "guests"}
              </span>
            </p>
            <p className="font-display text-[11px] tracking-[0.3em] text-muted/60">Confirmation will be sent to: {contact}</p>
            <button
              onClick={() => {
                setConfirmed(false);
                setDate("");
                setTime("");
                setName("");
                setContact("");
                setGuests(2);
              }}
              className="mt-4 rounded-full border border-stroke px-6 py-2.5 font-display text-[11px] tracking-[0.25em] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              NEW RESERVATION
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="rounded-3xl border border-stroke/60 bg-bg/70 p-8 backdrop-blur-sm md:p-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
                <div className="flex flex-col gap-8">
                  <div>
                    <p className="mb-4 font-display text-[10px] tracking-[0.4em] text-accent">01 · SELECT DATE</p>
                    <div className="rounded-2xl border border-stroke bg-surface p-5">
                      <Calendar value={date} onChange={setDate} />
                    </div>
                  </div>
                  <div>
                    <p className="mb-4 font-display text-[10px] tracking-[0.4em] text-accent">02 · PARTY SIZE</p>
                    <div className="flex h-[60px] items-center justify-between rounded-2xl border border-stroke bg-surface px-6">
                      <button
                        type="button"
                        aria-label="Fewer guests"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="font-display text-2xl text-muted transition-colors hover:text-accent active:scale-90"
                      >
                        −
                      </button>
                      <div className="text-center">
                        <span className="font-display text-3xl text-text">{guests}</span>
                        <span className="ml-2 font-display text-xs tracking-widest text-muted">
                          {guests === 1 ? "GUEST" : "GUESTS"}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="More guests"
                        onClick={() => setGuests((g) => Math.min(12, g + 1))}
                        className="font-display text-2xl text-muted transition-colors hover:text-accent active:scale-90"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div>
                    <p className="mb-4 font-display text-[10px] tracking-[0.4em] text-accent">03 · SELECT TIME</p>
                    <div className="flex flex-col gap-3">
                      <p className="font-display text-[9px] tracking-[0.3em] text-muted/50">LUNCH SERVICE</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {TIMES.slice(0, 4).map((t) => (
                          <button key={t} type="button" onClick={() => setTime(t)} className={slotClass(time === t)}>
                            {t}
                          </button>
                        ))}
                      </div>
                      <p className="mt-1 font-display text-[9px] tracking-[0.3em] text-muted/50">DINNER SERVICE</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {TIMES.slice(4).map((t) => (
                          <button key={t} type="button" onClick={() => setTime(t)} className={slotClass(time === t)}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="font-display text-[10px] tracking-[0.4em] text-accent">04 · YOUR DETAILS</p>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Email or phone"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {(date || time || guests !== 2) && (
              <div className="flex items-center gap-4 rounded-2xl border border-accent/20 bg-accent/5 px-6 py-4">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgba(194,161,90,0.8)]" />
                <p className="font-display text-[11px] tracking-[0.3em] text-muted">
                  {date && <span className="text-text">{formatDate(date)}</span>}
                  {date && time && <span className="mx-3 text-accent/60">·</span>}
                  {time && <span className="text-text">{time}</span>}
                  {(date || time) && <span className="mx-3 text-accent/60">·</span>}
                  <span className="text-text">
                    {guests} {guests === 1 ? "GUEST" : "GUESTS"}
                  </span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!ready}
              className={`w-full rounded-2xl py-6 font-display text-base tracking-[0.4em] transition-all duration-300 ${
                ready
                  ? "border border-accent bg-accent text-bg hover:shadow-[0_0_60px_rgba(194,161,90,0.6)] active:scale-[0.99]"
                  : "border border-stroke/40 bg-surface/40 text-muted/30 cursor-not-allowed"
              }`}
            >
              RESERVE YOUR TABLE
            </button>
            <p className="text-center font-display text-[10px] tracking-[0.25em] text-muted/40">
              No account required · Free to book · Cancel anytime
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
