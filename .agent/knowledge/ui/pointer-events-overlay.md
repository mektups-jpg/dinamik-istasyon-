---
type: bug
topic: Pointer Events on Absolute Overlays
date: 2026-04-27
tags: [ui, css, bug-fix, z-index]
---

## Summary
When using absolute positioned full-screen overlays (like gradient backgrounds, grids, or glassmorphism effects), ALWAYS add `pointer-events-none` (`pointer-events: none`) to prevent them from catching click/drag events and blocking interaction with underlying UI elements like inputs, sliders, and buttons.

## Context
In the PolygonCollisionApp module, users could not interact with the `<input type="range">` sliders or any buttons. The UI looked correct visually, but the inputs were unclickable.

## Decision / Finding
The root cause was two-fold:
1. The global background grid had `absolute inset-0 z-0` but was placed *after* or *over* some elements conceptually without pointer events disabled.
2. Inside the control panel cards, there was a decorative gradient: `<div className="absolute inset-0 bg-gradient-to-br from-[#FF3366]/5 to-transparent"></div>`. This absolute div sat on top of the range input, swallowing all mouse events.

The fix was adding `pointer-events-none` to any `absolute inset-0` layered decorative element. Additionally, we explicitly forced interactive elements to be above with `relative z-10`.

## Rationale
Decorative elements should never interfere with DOM event bubbling. CSS `pointer-events: none` is the standard and most performant way to make overlays "click-through".

## Consequences
Going forward in Vibe Coder Kit projects (which heavily use glassmorphism, glowing borders, and neon background layers), developers and agents must automatically append `pointer-events-none` to any `absolute` decorative layer.

## References
- PolygonCollisionApp.tsx bug fix on 2026-04-27.
