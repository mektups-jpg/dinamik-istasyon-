# Project Knowledge Base

| Date | Type | Topic | Summary |
|------|------|-------|---------|
| 2026-05-02 | convention | [Autonomous Module Pipeline](../../docs/AUTONOMOUS_MODULE_PIPELINE.md) | Module factory workflow: SSOT spec, implementation, Browser Use QA, Gemini critique, docs sync, then next module |
| 2026-05-02 | convention | [Module Quality Scorecard](../../docs/MODULE_QUALITY_SCORECARD.md) | Done requires internal score >=90, Gemini score >=85, no must-fix, and recorded evidence |
| 2026-05-02 | gotcha | [Browser Use IAB Discovery Can Be Absent During Automation](./infra/browser-use-iab-discovery.md) | If IAB discovery fails, run the internal recovery ladder first; if still blocked, keep the module In Progress and do not fall back to Computer Use, MCP Docker, or external Playwright |
| 2026-05-01 | convention | [User Design Preferences for Math Modules](./product/user-design-preferences.md) | Prefer focused, tactile, visually meaningful module experiences inspired by 3D geometry and simple early-grade modules |
| 2026-04-27 | bug | [Pointer Events on Absolute Overlays](./ui/pointer-events-overlay.md) | Prevent UI blocking by adding pointer-events-none to decorative overlays |
| 2026-04-28 | gotcha | [Iframe Scrolling Constraints](./ui/iframe-scrolling-fix.md) | Use h-full w-full overflow-y-auto instead of min-h-screen for root layouts due to iframe layout bounds |
