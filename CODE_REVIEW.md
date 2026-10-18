# Code Review — Price to Work Hours Converter

**Date:** 2026-10-18  
**Scope:** Chrome MV3 extension v0.1 (WIP)  
**Context:** Prototype — prioritise correctness and opt-in behaviour over production hardening.

## System overview

Chrome extension that shows e-commerce prices as hours/days of work from the user’s wage. Entry points: `popup.html` / `popup.js` (settings + manual calc), `contentScript.js` (page scan), `background.js` (exchange rates + domain currency), shared `currency.js`, `storage.js`, `ui.js`. Storage via `chrome.storage`; FX via ExchangeRate-API. No build step, tests, or CI.

## Assessment

| Area | Rating | Reason |
|------|--------|--------|
| Architecture | Adequate | Clear modules; FX path was unfinished |
| Correctness | Needs work | FX unused; `$`→CAD; settings gaps; Check Prices broken |
| Performance | Critical | Full-DOM scan + overlay on every page |
| Security | Needs work | Broad injection; API key in sync/URL; `innerHTML` |
| Testing | Critical | None |
| Docs / DX | Adequate | README useful; some drift |
| Dependencies | Strong | Zero npm deps |

## Findings and status

### Critical

| ID | Finding | Status |
|----|---------|--------|
| C1 | FX fetched in background but never applied to prices | **Done** — wired in content script + manual calc |
| C2 | Full-DOM scan + floating UI on every page (`<all_urls>`) | **Done** — no persistent content_scripts; inject on Check Prices only |

### High

| ID | Finding | Status |
|----|---------|--------|
| H1 | Popup “Check Prices” calls undefined `loadWageAndProcessPage` | **Done** — `tabs.sendMessage` + content listener |
| H2 | Bare `$` mapped to CAD | **Done** — `$` → null currency → domain setting; prefixed `$` forms added |
| H3 | `workHoursPerDay` never persisted | **Done** — saved + restored in popup |
| H4 | Auto-run + dead `#checkPricesBtn` listener in content script | **Done** |

### Medium

| ID | Finding | Status |
|----|---------|--------|
| M1 | API key in `chrome.storage.sync` and request URL | **Partial** — moved to `local` (+ sync migrate); still in URL path (API constraint) |
| M2 | `innerHTML` with storage-derived strings on host pages | **Done** — `textContent` / DOM APIs |
| M3 | Missing tab / `lastError` guards on messaging | **Done** |
| M4 | Weak price parsing (EU formats, duplicates, ignored match currency) | **Partial** — EU/US amounts + unit tests; site selectors still open |
| M5 | Duplicated convert logic in popup vs `currency.js` | **Done** — popup loads `currency.js` |

### Low

| ID | Finding | Status |
|----|---------|--------|
| L1 | Overlay a11y (close label, keyboard) | **Partial** — `aria-label` / `role="dialog"`; keyboard drag still open |
| L2 | README permission / feature drift | **Done** |
| L3 | Exchange cache keeps only one base currency | Open |

## Recommended plan

1. ~~Quick wins~~ (messaging, persist hours/day, opt-in UI, safe DOM, README, API key → local)
2. ~~Wire FX~~ into page + manual calc; harden background tab guards
3. **Next:** smarter price detection + unit tests; dedupe currency lists; lint/CI; keyboard a11y; multi-base FX cache

## Open questions

- Keep user-supplied ExchangeRate-API keys, or proxy later?
- Primary target sites (affects selectors vs regex)?
- In-page price annotations vs floating list only?
- Chrome Web Store publish timeline (privacy policy / permission review)?

## How to verify this batch

1. Reload the unpacked extension.
2. Save wage, hours/day, currencies, and API key.
3. Open a shop page → confirm **no** floating panel until you click **Check Prices**.
4. Click **Check Prices** → panel lists prices with hours in your currency.
5. Manual calc with domain currency ≠ your currency → uses FX.
6. Re-open popup → hours/day and API key still present.
