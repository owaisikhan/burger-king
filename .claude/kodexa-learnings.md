# kodexa-builder learnings

This file is how this repo teaches the kodexa-builder skill. Every session
that loads the skill reads it first and appends to it as the user corrects,
reverses or chooses things. Entries promoted into the skill are marked with
the version they landed in. See the skill's `references/self-improvement.md`
for the rules.

- **Project:** burger-king (clone of smash-burger-hq.vercel.app)
- **Type:** site-clone (primary), 3d-website (scroll-driven frame sequence)
- **Who reads it daily:** visitors from a link, mostly on phones; dark, cinematic, motion-heavy
- **Palette exceptions:** none added; the original's gold on near-black is kept 1:1
- **Skill version when started:** 1.3.0

## Summary

| ID | Date | Kind | Lesson (short) | Scope | Status |
|---|---|---|---|---|---|
| L-001 | 2026-09-24 | rule | Always create `main` and push the work there | all | ready |
| L-002 | 2026-09-24 | gotcha | Compiled Tailwind can hide dead classes; match computed styles, not class names | type: site-clone | logged |
| L-004 | 2026-09-25 | rule | Scroll heroes step automatically per swipe, stops on steady frames (see coffee-site-from-video L-009 to L-011) | type: 3d-website | covered |
| L-005 | 2026-09-25 | reversal | Free continuous scrub that settles on a steady frame beats the swipe takeover | type: 3d-website | ready |
| L-003 | 2026-09-24 | gotcha | Headless Chromium here rejects the proxy CA; serve the target's own bundle locally for visual QA | type: site-clone | logged |

## Entries

### L-001 · 2026-09-24 · strong · rule
- **Said / saw:** "always create a main branch and push the code there"
- **Context:** burger-king, first push of the smash-burger-hq clone into an empty repo
- **Lesson:** When a repo has no `main` yet (or the work is a fresh project), create `main` and push the finished work there, not only to a session feature branch. Experiments still go on their own branches; `main` is where the deliverable lands.
- **Scope:** all
- **Target in skill:** SKILL.md section 3, "Working style the user has shown repeatedly"
- **Status:** ready

### L-002 · 2026-09-24 · medium · gotcha
- **Said / saw:** original bundle uses `font-600` / `font-700`, which its Tailwind build compiles to nothing (`grep font-600 index-*.css` is empty)
- **Context:** rebuilding headings from the minified JSX
- **Lesson:** When cloning from a compiled Tailwind bundle, confirm each unusual class exists in the shipped CSS before porting it. Dead classes mean the real render differs from what the source suggests (here every heading is weight 400, not bold). Match the computed style.
- **Scope:** type: site-clone
- **Target in skill:** references/types/site-clone.md, "Gotchas"
- **Status:** logged

### L-003 · 2026-09-24 · medium · gotcha
- **Said / saw:** `page.goto: net::ERR_CERT_AUTHORITY_INVALID` for the live target from Playwright, even with the full Chromium build
- **Context:** side-by-side visual QA in the cloud sandbox
- **Lesson:** Do not disable TLS checks. Download the target's `index.html`, JS/CSS bundles, public assets and Google Fonts, serve them with `python3 -m http.server`, and compare that against `next start` in the same Chromium (no proxy for localhost). Section heights and pixel diffs then compare like for like.
- **Scope:** type: site-clone
- **Target in skill:** references/types/site-clone.md, "The method that worked"
- **Status:** logged

### L-004 · 2026-09-25 · strong · rule
- **Said / saw:** "make the burger king website hero video scroll just like coffee shop one, but make it smoother to stop at every section"
- **Context:** burger-king hero, ported from coffee-site-from-video (createStepper, stepSnap, stop frames first, nearest-loaded draw, slow drift)
- **Lesson:** Same as coffee-site-from-video L-009 to L-011; here the owner asked for a softer stop, so glides run 1.4 to 3s with sine in-out. Stops rest on steady frames (patty, cheese, floating ingredients, finished burger) with copy blocks centred on them.
- **Scope:** type: 3d-website
- **Target in skill:** references/types/3d-website.md, section 4 "Scroll"
- **Status:** superseded by L-005

### L-005 · 2026-09-25 · strong · reversal
- **Said / saw:** "i dont like the scroll on real site, does not look smooth, just make it continuous but smooth and at each section, it should snap at a proper video snapshot, not something in between"
- **Context:** burger-king hero, after the swipe takeover (L-004) was tried on a real phone
- **Lesson:** Do not take over scrolling. Let the reader scroll freely with a soft scrub (0.8), and when the page comes to rest inside the section, with no finger down, glide (0.5 to 1.4s, sine) to a stop on a steady frame: past a nudge of about 150px carry on in the direction of travel, otherwise return. Write the settle yourself (scroll idle timer plus touch tracking); GSAP's built-in snap did not fire reliably here. Listen for touchend on the touch target as well as window, because an element removed mid-swipe (the SCROLL NOW gate) swallows it. On phones, blend between frames with two stacked canvases and CSS opacity (one redraw per frame change); two drawImage calls per update tripled the cost. Measure with a 4x CPU throttle before and after.
- **Scope:** type: 3d-website
- **Target in skill:** references/types/3d-website.md, section 4 "Scroll" (replaces the takeover advice)
- **Status:** ready
