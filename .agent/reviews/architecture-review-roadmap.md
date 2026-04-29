# Architecture Review - Roadmap

**Date:** 2026-04-28
**Reviewer:** Codex

## Verdict

Approved with conditions.

## Blockers

None.

## Warnings

### 1. Module Shell Standardization Is a Prerequisite

**Checklist item:** Coupling & Cohesion
**Issue:** Many modules currently own their own root layout, header, completion, and visual shell. Continuing to add modules before extracting a shared module shell will increase maintenance cost and repeat iframe/layout bugs.
**Recommendation:** Complete the Golden Template standardization in Faz 2 before scaling beyond the next one or two modules.

### 2. Deployment Must Be Made Repeatable Before Production Use

**Checklist item:** Operability
**Issue:** AI Studio's publish button was convenient but opaque. The local repo needs a repeatable deploy path with rollback and preview channels.
**Recommendation:** Use Firebase Hosting with GitHub Actions first. Revisit Cloud Run or Firebase App Hosting only if server-side rendering or backend runtime needs appear.

### 3. Main Bundle Size Will Hurt Cold Loads

**Checklist item:** Scalability
**Issue:** Production build still warns about a large main chunk. Three.js, KaTeX, Matter.js, Firebase, and route code should be split more intentionally.
**Recommendation:** Add Rollup manual chunks and keep heavyweight modules lazy-loaded.

### 4. Curriculum Source of Truth Must Stay Strict

**Checklist item:** Data & State
**Issue:** There are two atom sources: the full MEB atom markdown and the smaller `atomStandard.ts` sample. This can drift.
**Recommendation:** Treat `docs/MEB_ATOMLARI.md` as canonical until a generated typed atom registry replaces it.

## Notes

### 1. Middle-School-First Plan Matches Current Momentum

The existing codebase is strongest in 5-8 grade visual math and geometry simulations. Completing 6th grade next is lower risk than jumping directly into high school or early primary rebuilds.

### 2. The Roadmap Should Be Revisited After Every Two Modules

The product has a broad K-12 ambition. Rechecking scope every two completed modules keeps the plan grounded in actual development velocity.

## Summary

The roadmap is feasible if technical hardening and deploy automation are handled before aggressive module production. The next best implementation target is `Kuantum Filtre İstasyonu`, after the remaining type/layout cleanup checkpoint.
