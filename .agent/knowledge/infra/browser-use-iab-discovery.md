---
type: gotcha
topic: Browser Use IAB Discovery Can Be Absent During Automation
date: 2026-05-02
tags: [browser-use, automation, qa, iab]
---

## Summary
Browser Use QA must start with the Codex in-app browser (`iab`) preflight. If `setupAtlasRuntime({ backend: 'iab' })` reports that no Codex IAB backends were discovered, do not fall back to Computer Use, MCP Docker browser tools, external Playwright scripts, or macOS browser control.

## Context
The long-running hourly automation for 10th and 11th grade module development repeatedly needed visual QA on local routes such as `/embed/geometry/analytic-route-map?qa=1`. The user explicitly constrained browser testing to Browser Use only and forbade Computer Use, MCP Docker, external Playwright scripts, and other screen automation.

## Decision / Finding
The recurring failure is an IAB discovery problem, not a local app, Vite, route, or module build problem. The observed diagnostic is:

```text
Failed to connect to browser-use backend "iab". No Codex IAB backends were discovered.
Discovery diagnostics: listedPipes=3, candidates=5, browsers=0, iabBrowsers=0
```

When this happens:

1. Mark Browser Use visual/flow QA as blocked.
2. Continue only with Browser-free safe work, such as `npm run build`, `git diff --check`, static route/test-id checks, docs sync, or small static quality fixes.
3. Retry IAB preflight on the next automation wakeup.
4. Keep the module `In Progress` until Browser Use smoke, wrong-flow, correct-flow, completion, console, and responsive checks pass.

## Rationale
Using another browser-control surface would produce a misleading QA result and violate the user's explicit workflow preference. The root problem is that Codex cannot discover an in-app browser backend in that automation moment; substituting another automation layer hides that operational issue instead of documenting it.

## Consequences
Automation may make incremental static improvements while IAB is unavailable, but it must not declare a module Done. Worklog entries should say "Browser Use QA blocked: IAB backend not discovered" and list any Browser-free checks that passed.

## References
- `.agent/CURRENT_TASK.md`
- `.agent/WORKLOG.md`
- `docs/MODULE_DONE_CRITERIA.md`
- Browser Use skill: `/Users/serhan/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/skills/browser/SKILL.md`
