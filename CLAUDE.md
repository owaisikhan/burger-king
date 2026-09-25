@AGENTS.md

# Project: SMASH clone (burger-king)

Built with the kodexa-builder skill (v1.3.0). Load it for any new feature or
design work, and log preferences, corrections and reversals to
`.claude/kodexa-learnings.md` as they happen.

- 1:1 clone of https://smash-burger-hq.vercel.app/ (research in `docs/research/smash/NOTES.md`).
- Push finished work to `main` (the owner's standing rule).
- Clone fidelity beats house style: the em dashes and the original's heading weights (400, because its `font-600`/`font-700` were dead classes) are kept on purpose. Remove them only when the site is rebranded.
- Palette exceptions: none.
- The owner confirmed (2026-09-25) that Kodexa made smash-burger-hq, so its copy, photos, video and frames are Kodexa's own and can be used in Kodexa marketing.
- The hero scrolls freely and continuously (scrub 0.8), then settles on a steady video frame when it comes to rest (`createSettle` in `src/lib/gsap.ts`): past a small nudge it carries on to the next stop in the direction of travel. Phones blend between their 100 frames with two stacked canvases (CSS opacity on the upper one); desktops play all 200 frames on one canvas. The owner rejected the swipe takeover as not smooth on the real site.
