# SMASH (burger-king)

A 1:1 Next.js rebuild of [smash-burger-hq.vercel.app](https://smash-burger-hq.vercel.app/): a scroll-driven smash burger site with a pinned frame-scrub hero, a live build configurator, a pinned sear thermometer and a horizontal ingredient reel.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # lint + typecheck + build
```

## Where things are

- `src/app/page.tsx`: section order
- `src/components/sections/`: one file per section (`Hero.tsx` holds the frame-scrub animation)
- `src/lib/gsap.ts`: GSAP with ScrollTrigger and ScrollToPlugin registered once
- `src/lib/content.ts`: menu data shared by the menu and configurator
- `public/frames/smash` (200 frames, desktop) and `public/frames/smash-mobile` (100 frames, phones)
- `docs/research/smash/NOTES.md`: measured tokens, scroll timings and the QA table

## Content ownership

Copy, photos, video and hero frames come from the original site. Replace them with your own before launching publicly, unless you own that site.
