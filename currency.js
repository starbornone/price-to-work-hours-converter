function extractPrice(text) {
  const priceRegexes = [
    { regex: /د\.إ\d+(\.\d{2})?/, currency: "AED" }, // AED (UAE Dirham) - symbol: د.إ
    { regex: /ARS\s?\d+(\.\d{2})?/, currency: "ARS" }, // ARS (Argentine Peso) - abbreviation: ARS
    { regex: /\d{1,3}(,\d{3})*(\.\d{2})?\s?AUD/, currency: "AUD" }, // AUD (Australian Dollar) - abbreviation: AUD
    { regex: /R\$\d+(\.\d{2})?/, currency: "BRL" }, // BRL (Brazilian Real) - symbol: R$
    { regex: /\$\d+(\.\d{2})?/, currency: "CAD" }, // CAD (Canadian Dollar) - symbol: $
    { regex: /CHF\s?\d+(\.\d{2})?/, currency: "CHF" }, // CHF (Swiss Franc) - abbreviation: CHF
    { regex: /CZK\s?\d+(\.\d{2})?/, currency: "CZK" }, // CZK (Czech Koruna) - abbreviation: CZK
    { regex: /DKK\s?\d+(\.\d{2})?/, currency: "DKK" }, // DKK (Danish Krone) - abbreviation: DKK
    { regex: /€\d+(\.\d{2})?/, currency: "EUR" }, // EUR (Euro) - symbol: €
    { regex: /£\d+(\.\d{2})?/, currency: "GBP" }, // GBP (British Pound) - symbol: £
    { regex: /\₱\d+(\.\d{2})?/, currency: "PHP" }, // PHP (Philippine Peso) - symbol: ₱
    { regex: /HK\$\d+(\.\d{2})?/, currency: "HKD" }, // HKD (Hong Kong Dollar) - symbol: HK$
    { regex: /HUF\s?\d+(\.\d{2})?/, currency: "HUF" }, // HUF (Hungarian Forint) - abbreviation: HUF
    { regex: /₹\d+(\.\d{2})?/, currency: "INR" }, // INR (Indian Rupee) - symbol: ₹
    { regex: /ILS\s?\d+(\.\d{2})?/, currency: "ILS" }, // ILS (Israeli Shekel) - abbreviation: ILS
    { regex: /ISK\s?\d+(\.\d{2})?/, currency: "ISK" }, // ISK (Icelandic Króna) - abbreviation: ISK
    { regex: /\d{1,3}(,\d{3})*(\.\d{2})?\s?JPY/, currency: "JPY" }, // JPY (Japanese Yen) - abbreviation: JPY
    { regex: /₩\d+(\.\d{2})?/, currency: "KRW" }, // KRW (South Korean Won) - symbol: ₩
    { regex: /\d+(\.\d{2})?\s?MXN/, currency: "MXN" }, // MXN (Mexican Peso) - abbreviation: MXN
    { regex: /NOK\s?\d+(\.\d{2})?/, currency: "NOK" }, // NOK (Norwegian Krone) - abbreviation: NOK
    { regex: /₦\d+(\.\d{2})?/, currency: "NGN" }, // NGN (Nigerian Naira) - symbol: ₦
    { regex: /NZ\$\d+(\.\d{2})?/, currency: "NZD" }, // NZD (New Zealand Dollar) - symbol: NZ$
    { regex: /PLN\s?\d+(\.\d{2})?/, currency: "PLN" }, // PLN (Polish Zloty) - abbreviation: PLN
    { regex: /₽\d+(\.\d{2})?/, currency: "RUB" }, // RUB (Russian Ruble) - symbol: ₽
    { regex: /R\d+(\.\d{2})?/, currency: "ZAR" }, // ZAR (South African Rand) - symbol: R
    { regex: /SAR\s?\d+(\.\d{2})?/, currency: "SAR" }, // SAR (Saudi Riyal) - abbreviation: SAR
    { regex: /\d+(\.\d{2})?\s?SEK/, currency: "SEK" }, // SEK (Swedish Krona) - abbreviation: SEK
    { regex: /S\$\d+(\.\d{2})?/, currency: "SGD" }, // SGD (Singapore Dollar) - symbol: S$
    { regex: /\d+(\.\d{2})?\s?THB/, currency: "THB" }, // THB (Thai Baht) - symbol: ฿
    { regex: /TL\s?\d+(\.\d{2})?/, currency: "TRY" }, // TRY (Turkish Lira) - abbreviation: TL
    { regex: /\d{1,3}(,\d{3})*(\.\d{2})?\s?USD/, currency: "USD" }, // USD (US Dollar) - abbreviation: USD
    { regex: /₫\d+(\.\d{2})?/, currency: "VND" }, // VND (Vietnamese Dong) - symbol: ₫
    { regex: /R\d+(\.\d{2})?/, currency: "ZAR" }, // ZAR (South African Rand) - symbol: R
  ];

  for (const { regex, currency } of priceRegexes) {
    const match = text.match(regex);
    if (match) {
      const price = parseFloat(match[0].replace(/[^\d.]/g, ""));
      return { price, currency };
    }
  }

  return null;
}

function convertPriceToHours(price, wage, workHoursPerDay) {
  const hours = (price / wage).toFixed(2);
  let displayText = `${hours} hours of work`;

  if (hours > 8) {
    const days = (hours / workHoursPerDay).toFixed(2);
    displayText += ` (~${days} days of work)`;
  }

  return displayText;
}
