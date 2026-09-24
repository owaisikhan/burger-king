# smash-burger-hq.vercel.app: research notes

Source: the live site's Vite bundle (`/assets/index-Dk1EQW12.js`, `/assets/index-KZs_bosx.css`), read on 2026-09-24.

## Stack
- Vite + React 19 SPA, Tailwind v4, GSAP 3.15 with ScrollTrigger and ScrollToPlugin. No Lenis, no WebGL.
- Fonts: Chakra Petch 400-700 (display), Inter 300-600 (body), Google Fonts. Here: `next/font`.
- Heads-up: `font-600` / `font-700` compile to nothing in the original, so all headings render at weight 400. The clone matches that.

## Tokens
| Token | Value |
|---|---|
| bg | `#0b0a09` |
| surface | `#131110` |
| text | `#f3ede2` |
| muted | `#8a8076` |
| stroke | `#221f1b` |
| accent | `#c2a15a` |

Global film grain: fixed `body::after`, SVG fractal noise, opacity 0.042.

## Sections and scroll behaviour
| # | Component | Behaviour |
|---|---|---|
| 1 | Header | Transparent until `scrollY > 80`, then `bg-bg/95` + blur. Mobile menu closes on first scroll. |
| 2 | Hero | Pinned, `end: +=600%`, `scrub: 0.4`. Canvas scrubs 200 WebP frames (100 below 768px) from `/frames/smash[-mobile]/f_NNN.webp`, cover-fit, DPR capped at 1.5, 24 (8 on phones) parallel preloaders. HUD readouts follow progress: frame counter, phase label, section 01-03, progress bar, rail dot, 0 to 230°C counter. Copy blocks fade by band: intro at p=0, specs at p=0.25 and 0.75, "THE SMASH" at p=0.5; gold flash at p=0.87. "SCROLL NOW" gate leaves after the first scroll past 24px. 24fps REC timecode. |
| 3 | Menu | Header and cards stagger in. "ADD TO ORDER" flies a copy of the photo into the configurator preview while scrolling there (1.3s), then fires `smash:selectBuild`. |
| 4 | Configurator | Size S/M/L (+$0/+5/+10) with a giant glowing letter burst; toppings fly an 88px chip into the total, which flashes. Base $12, or the chosen build's price. |
| 5 | Overview | Timeline reveal at `top 80%`; steam loop video starts on enter. |
| 6 | Stats | Four counters, 0 to N over 2.2s `power4.out`, at `top 65%`. |
| 7 | Sear | Pinned `+=280%`, `scrub: 1.2`. Thermometer 0 to 230, colour gold to red, grill photo fades to flame, three captions. |
| 8 | Craft | Static 10-tile grid, hover zoom. |
| 9 | Ingredients | Pinned horizontal scroll; distance = track overflow width, `scrub: 0.6`. |
| 10 | Story | Header fade; four chapter cards with hover lift. |
| 11 | Reserve | Custom Monday-first calendar, party size 1-12, 12 time slots, client-only confirmation (no backend). |
| 12 | Footer | Links are `#` placeholders, as in the original. |

## Visual QA (2026-09-24)
Original bundle served locally vs `next start`, same Chromium.

| Viewport | Page height (orig / clone) | Section heights | Pixel diff at 13 scroll stops |
|---|---|---|---|
| 1440x900 | 20625 / 20625 | all 12 identical | 0.00-0.22% (timecode, grain); top-of-page frame differs only by load timing |
| 390x844 | 22688 / 22688 | all 12 identical | 0.00-0.06% |

Interaction check, both sites: $12 start, $18 after "THE SMASH", $31 with L + bacon; hero shows frame 100 at the same scroll depth.
