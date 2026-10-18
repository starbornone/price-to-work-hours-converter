# Code Review — Price to Work Hours Converter

**Date:** 2026-10-18  
**Scope:** Chrome MV3 extension v0.2 (WIP)  
**Context:** Prototype — prioritise correctness and opt-in behaviour over production hardening.

## System overview

Chrome extension that shows e-commerce prices as hours/days of work from the user’s wage. Entry points: `popup.html` / `popup.js` (settings + manual calc), on-demand injected `contentScript.js` (page scan), `background.js` (exchange rates + domain currency), shared helpers. Storage via `chrome.storage`; FX via ExchangeRate-API. Node tests + ESLint + GitHub Actions CI.

## Assessment (updated)

| Area | Rating | Reason |
|------|--------|--------|
| Architecture | Adequate | Clear modules; FX + opt-in inject in place |
| Correctness | Adequate | FX applied per detected currency; parsing improved |
| Performance | Adequate | No always-on content scripts; text-node scan on demand |
| Security | Adequate | Local API key; safer DOM; still URL-path API key |
| Testing | Adequate | Unit tests for currency + FX cache; CI wired |
| Docs / DX | Adequate | README + CODE_REVIEW kept in sync |
| Dependencies | Strong | Dev-only eslint; zero runtime npm deps |

## Findings and status

### Critical

| ID | Finding | Status |
|----|---------|--------|
| C1 | FX fetched but never applied | **Done** |
| C2 | Full-DOM scan + UI on every page | **Done** — inject on Check Prices only |

### High

| ID | Finding | Status |
|----|---------|--------|
| H1 | Check Prices undefined function | **Done** |
| H2 | Bare `$` mapped to CAD | **Done** |
| H3 | `workHoursPerDay` never persisted | **Done** |
| H4 | Auto-run + dead content-script button listener | **Done** |

### Medium

| ID | Finding | Status |
|----|---------|--------|
| M1 | API key in sync + URL | **Partial** — `local` storage; URL is API constraint |
| M2 | `innerHTML` on host pages | **Done** |
| M3 | Missing tab / `lastError` guards | **Done** |
| M4 | Weak price parsing | **Partial** — EU/US + tests; site selectors still open |
| M5 | Duplicated convert / currency lists | **Done** |

### Low

| ID | Finding | Status |
|----|---------|--------|
| L1 | Overlay a11y | **Partial** |
| L2 | README drift | **Done** |
| L3 | Exchange cache one base only | **Done** — multi-base + per-base TTL + inflight coalesce |

## Recommended plan

1. ~~Quick wins / FX / opt-in inject / parsing tests~~
2. ~~Multi-base FX cache, currency list dedupe, lint/CI~~
3. **Next:** site-specific price selectors; keyboard a11y for overlay; multi-language

## Open questions

- Keep user-supplied ExchangeRate-API keys, or proxy later?
- Primary target sites (affects selectors vs regex)?
- In-page price annotations vs floating list only?
- Chrome Web Store publish timeline (privacy policy / permission review)?
