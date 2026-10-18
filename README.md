# Price to Work Hours Converter

**Version**: 0.1  
**Description**: Chrome extension that converts prices on e-commerce websites into hours of work, based on your hourly wage and currency.

**Note**: This extension is a **work in progress**. See [CODE_REVIEW.md](CODE_REVIEW.md) for the current assessment and remediation plan.

## Features

- **Check Prices** (opt-in): scans the active tab and shows matched prices as hours/days of work in a floating panel
- Wage setup: hourly or yearly wage, hours per day, and your currency
- Domain currency: remember the currency used on a given website
- Exchange rates via [ExchangeRate-API](https://www.exchangerate-api.com/) (user-supplied API key)
- Manual price conversion in the popup

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
| `storage.js` | Settings, domain currency, API key, exchange-rate helpers |
| `popup.html` / `popup.js` | Settings UI, manual calc, Check Prices |

### Permissions

- **storage** — wage, currencies, cached rates; API key in `chrome.storage.local`
- **activeTab** — act on the current tab when you use the popup
- **scripting** — retained for possible future injection helpers
- **host_permissions** — `https://v6.exchangerate-api.com/*` for FX

Content scripts still match `<all_urls>` so messaging works after load, but scanning and the overlay run only when you click **Check Prices**.

## Roadmap

- Narrower host matches / inject only on demand
- Better currency and number-format detection
- Unit tests for `extractPrice` / conversion helpers
- Multi-language support

## Contributing

Pull requests and issues are welcome on this repository.

## License

CC BY-NC-SA 4.0 — see [LICENSE](LICENSE).
