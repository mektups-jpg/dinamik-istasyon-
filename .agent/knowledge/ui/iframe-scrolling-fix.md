---
type: gotcha
topic: Iframe Scrolling Constraints
date: 2026-04-28
tags: [ui, css, tailwind, iframe, layout]
---

## Summary
Never use `min-h-screen` as the root container class for module applications. Always use `h-full w-full overflow-y-auto` instead to ensure native vertical scrolling works correctly within the platform's iframe environment.

## Context
A persistent bug was reported where internal module applications (like `AreaPiLab` and `PolygonCollisionTest`) would extend beyond the visible screen height, but the user was unable to scroll down to see the overflowing content. 

## Decision / Finding
The AI Studio / Preview ecosystem renders applications within an iframe (`EmbedLayout`). The root layout container enforces `overflow-hidden` at a higher architectural level restricting the `window` or `<body>` from generating a native scrollbar.

Using `min-h-screen` forces the div to take at least 100vh, but when content overflows, the hidden parent bounds truncate the view.

By changing the root container of the specific application strictly to `h-full w-full overflow-y-auto`, the container binds exactly to the iframe's boundaries and explicitly manages its own internal Y-axis scrollbar.

## Rationale
This prevents the inner application from pushing past the hidden parent bounds. Instead of relying on the browser's generic `body` scrollbar, the React component explicitly takes responsibility for vertical scrolling via CSS `overflow-y-auto`, guaranteeing access to elements regardless of screen size. 

## Consequences
All new React module layouts MUST use `<div className="h-full w-full overflow-x-hidden overflow-y-auto...">` at the highest component level. Using `min-h-screen` or `h-screen` on the root node is considered an anti-pattern.

## References
- `AreaPiApp.tsx` and `PolygonCollisionApp.tsx` refactor
