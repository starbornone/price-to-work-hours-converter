# Price to Work Hours Converter

**Version**: 0.1  
**Description**: This Chrome extension converts prices on e-commerce websites into hours of work, helping users understand the time-cost of products based on their hourly wage.

**Note**: This extension is a **work in progress**. While the core functionality is implemented, additional features and improvements are planned for future versions. Your feedback and suggestions are welcome!

## Features

- Automatically detects prices on e-commerce websites and converts them into hours or days of work.
- Allows users to input their hourly wage, daily working hours, and preferred currency.
- Manual price input for on-the-fly conversions.
- Supports a wide range of global currencies, dynamically converting prices.
- Easy-to-use floating interface with a "Check Prices" button and input fields for manual conversion.
- Saves user preferences (hourly wage and preferred currency) globally, and can remember the selected currency for specific websites.

## Installation

1. **Download the extension files** from this repository to your local machine.
2. **Open Google Chrome** and navigate to the `chrome://extensions/` page.
3. Enable **Developer Mode** by toggling the switch in the top right.
4. Click on the **Load unpacked** button and select the folder containing the downloaded extension files.
5. The extension will now appear in your list of Chrome extensions and is ready to use.

## Usage

1. **Set Your Hourly Wage**:
   - Click on the extension icon in the Chrome toolbar to open the settings.
   - Enter your hourly wage and select your global preferred currency from the dropdown. This will be used for all calculations unless a specific website currency is detected or chosen.

2. **Check Prices**:
   - The extension automatically detects prices on e-commerce websites and converts them into hours of work.
   - You can also use the floating window to manually recheck the prices by clicking the "Check Prices" button.

3. **Manual Price Conversion**:
   - Enter a price in the provided input field in the floating window to calculate how many hours or days of work it represents.

4. **Floating Window**:
   - The floating window appears at the top-right of the page, showing prices in terms of hours or days of work. You can close or reopen this window at any time.

5. **Currency Selection**:
   - By default, the extension will use your globally set currency (e.g., AUD, USD, EUR).
   - If the website's currency differs, the extension attempts to detect the currency used on the site. You can also manually change the currency for that specific website.

## Supported Currencies

The extension supports a wide range of currencies, including:

- AED (UAE Dirham)
- ARS (Argentine Peso)
- AUD (Australian Dollar) *(default)*
- BRL (Brazilian Real)
- CAD (Canadian Dollar)
- CHF (Swiss Franc)
- CZK (Czech Koruna)
- DKK (Danish Krone)
- EUR (Euro)
- GBP (British Pound)
- PHP (Philippine Peso)
- HKD (Hong Kong Dollar)
- HUF (Hungarian Forint)
- INR (Indian Rupee)
- ILS (Israeli Shekel)
- ISK (Icelandic Króna)
- JPY (Japanese Yen)
- KRW (South Korean Won)
- MXN (Mexican Peso)
- NOK (Norwegian Krone)
- NGN (Nigerian Naira)
- NZD (New Zealand Dollar)
- PLN (Polish Zloty)
- RUB (Russian Ruble)
- ZAR (South African Rand)
- SAR (Saudi Riyal)
- SEK (Swedish Krona)
- SGD (Singapore Dollar)
- THB (Thai Baht)
- TRY (Turkish Lira)
- USD (US Dollar)
- VND (Vietnamese Dong)

## Customization

The following settings can be configured:

- **Hourly Wage**: Set your wage, which is used for all work-hour calculations.
- **Work Hours per Day**: Define how many hours you typically work in a day to display results in both hours and days if applicable.
- **Global Currency**: Choose a default currency for conversion, with options to change it per website.

## Development

To modify the project, follow these steps:

1. Clone or download the project files.
2. Make changes to the HTML, CSS, and JavaScript files.
3. Reload the extension in Chrome by navigating to `chrome://extensions/`, selecting your extension, and clicking the **Reload** button.

### Key Files

- **manifest.json**: Defines the Chrome extension's configuration, permissions, and content scripts.
- **contentScript.js**: Handles detecting prices on web pages and converting them into hours of work.
- **ui.js**: Manages the floating UI elements that display the converted prices and manual conversion inputs.
- **popup.html / popup.js**: The popup window interface where users can set their wage and preferred currency.
- **currency.js**: Contains logic for detecting currencies and performing conversions.
- **storage.js**: Handles storing user preferences like hourly wage and preferred currency.
  
## Permissions

This extension requires the following permissions:

- **storage**: To save user preferences (hourly wage, selected currency).
- **activeTab**: To access and manipulate the content of the current tab, such as detecting prices on e-commerce websites.

## Roadmap

Planned features for future versions include:

- **Multi-language support**.
- **Improved currency detection** for international websites.
- **Automatic exchange rate updates** for more accurate conversions.

## Contributing

If you would like to contribute to this project, feel free to submit a pull request or open an issue on GitHub with suggestions or bug reports.

## License

This project is licensed under the MIT License.
