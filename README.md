# Price to Work Hours Converter

**Version**: 0.2  
**Description**: Chrome extension that converts prices on e-commerce websites into hours of work, based on your hourly wage and currency.

**Note**: This extension is a **work in progress**. See [CODE_REVIEW.md](CODE_REVIEW.md) for the current assessment and remediation plan.

## Features

- **Check Prices** (opt-in): injects into the active tab only when you click, then shows hours/days of work
- Wage setup: hourly or yearly wage, hours per day, and your currency
- Domain currency: remember the currency used on a given website
- Exchange rates via [ExchangeRate-API](https://www.exchangerate-api.com/) (user-supplied API key)
- Manual price conversion in the popup
- US and EU-style number formats (`1,234.56` / `1.234,56`)

## Installation

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select this project folder.
5. Open the extension popup, enter your wage, currency, and ExchangeRate-API key, then click **Save**.

## Usage

1. **Set wage and API key** in the popup (hourly wage, or yearly wage + hours per day).
2. **Set domain currency** for the site you are viewing.
3. Click **Check Prices** on a product page — a floating panel appears with conversions.
4. Optionally use **Calculate Hours** for a single manual price (uses domain currency → your currency).

## Supported Currencies

AED, ARS, AUD (default), BRL, CAD, CHF, CZK, DKK, EUR, GBP, PHP, HKD, HUF, INR, ILS, ISK, JPY, KRW, MXN, NOK, NGN, NZD, PLN, RUB, ZAR, SAR, SEK, SGD, THB, TRY, USD, VND.

Bare `$` amounts are treated as the **domain currency** you configured (not assumed to be CAD/USD).

## Development

1. Edit the HTML/JS files.
2. Reload the extension on `chrome://extensions/`.

### Key files

| File | Role |
|------|------|
| `manifest.json` | MV3 config, permissions, content scripts |
| `background.js` | Exchange-rate fetch/cache, domain-currency messages |
| `contentScript.js` | On-demand page scan when popup sends `checkPrices` |
| `ui.js` | Floating results panel (created only when needed) |
| `currency.js` | Price extraction and hours formatting |
| `currencies.js` | Shared currency list for popup selects |
| `exchangeCache.js` | Multi-base FX cache merge/lookup helpers |
| `storage.js` | Settings, domain currency, API key, exchange-rate helpers |
| `popup.html` / `popup.js` | Settings UI, manual calc, Check Prices |

### Permissions

- **storage** — wage, currencies, cached rates; API key in `chrome.storage.local`
- **activeTab** — temporary access to the current tab when you use the popup
- **scripting** — inject scanners into the active tab on **Check Prices**
- **host_permissions** — `https://v6.exchangerate-api.com/*` for FX

Scripts are **not** injected on every page. They load only when you click **Check Prices** (via `activeTab` + `scripting`).

### Tests and lint

```bash
npm ci
npm test
npm run lint
```

CI runs the same checks on pushes and pull requests to `main`.

## Roadmap

- Broader site-specific price selectors
- Multi-language support
- Keyboard accessibility for the floating panel

## Contributing

Pull requests and issues are welcome on this repository.

## License

CC BY-NC-SA 4.0 — see [LICENSE](LICENSE).
