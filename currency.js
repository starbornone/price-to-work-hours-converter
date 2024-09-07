function extractPrice(text) {
  const priceRegexes = [
    { regex: /د\.إ\d+(\.\d{2})?/, currency: "AED" }, // د.إ - UAE Dirham
    { regex: /ARS\s?\d+(\.\d{2})?/, currency: "ARS" }, // ARS - Argentine Peso
    { regex: /\d{1,3}(,\d{3})*(\.\d{2})?\s?AUD/, currency: "AUD" },
    { regex: /R\$\d+(\.\d{2})?/, currency: "BRL" }, // R$ - Brazilian Real
    { regex: /\$\d+(\.\d{2})?/, currency: "CAD" }, // CAD - Canadian Dollar
    { regex: /CHF\s?\d+(\.\d{2})?/, currency: "CHF" }, // CHF - Swiss Franc
    { regex: /CZK\s?\d+(\.\d{2})?/, currency: "CZK" }, // CZK - Czech Koruna
    { regex: /DKK\s?\d+(\.\d{2})?/, currency: "DKK" }, // DKK - Danish Krone
    { regex: /€\d+(\.\d{2})?/, currency: "EUR" }, // € - Euro
    { regex: /£\d+(\.\d{2})?/, currency: "GBP" }, // £ - British Pound
    { regex: /\₱\d+(\.\d{2})?/, currency: "PHP" }, // ₱ - Philippine Peso
    { regex: /HK\$\d+(\.\d{2})?/, currency: "HKD" }, // HK$ - Hong Kong Dollar
    { regex: /HUF\s?\d+(\.\d{2})?/, currency: "HUF" }, // HUF - Hungarian Forint
    { regex: /₹\d+(\.\d{2})?/, currency: "INR" }, // ₹ - Indian Rupee
    { regex: /ILS\s?\d+(\.\d{2})?/, currency: "ILS" }, // ₪ - Israeli Shekel
    { regex: /ISK\s?\d+(\.\d{2})?/, currency: "ISK" }, // ISK - Icelandic Króna
    { regex: /\d{1,3}(,\d{3})*(\.\d{2})?\s?JPY/, currency: "JPY" },
    { regex: /₩\d+(\.\d{2})?/, currency: "KRW" }, // ₩ - South Korean Won
    { regex: /\d+(\.\d{2})?\s?MXN/, currency: "MXN" }, // MXN - Mexican Peso
    { regex: /NOK\s?\d+(\.\d{2})?/, currency: "NOK" }, // NOK - Norwegian Krone
    { regex: /₦\d+(\.\d{2})?/, currency: "NGN" }, // ₦ - Nigerian Naira
    { regex: /NZ\$\d+(\.\d{2})?/, currency: "NZD" }, // NZ$ - New Zealand Dollar
    { regex: /PLN\s?\d+(\.\d{2})?/, currency: "PLN" }, // PLN - Polish Zloty
    { regex: /₽\d+(\.\d{2})?/, currency: "RUB" }, // ₽ - Russian Ruble
    { regex: /R\d+(\.\d{2})?/, currency: "ZAR" }, // R - South African Rand
    { regex: /SAR\s?\d+(\.\d{2})?/, currency: "SAR" }, // SAR - Saudi Riyal
    { regex: /\d+(\.\d{2})?\s?SEK/, currency: "SEK" }, // SEK - Swedish Krona
    { regex: /S\$\d+(\.\d{2})?/, currency: "SGD" }, // S$ - Singapore Dollar
    { regex: /\d+(\.\d{2})?\s?THB/, currency: "THB" }, // ฿ - Thai Baht
    { regex: /TL\s?\d+(\.\d{2})?/, currency: "TRY" }, // TL - Turkish Lira
    { regex: /\d{1,3}(,\d{3})*(\.\d{2})?\s?USD/, currency: "USD" },
    { regex: /₫\d+(\.\d{2})?/, currency: "VND" }, // ₫ - Vietnamese Dong
    { regex: /R\d+(\.\d{2})?/, currency: "ZAR" }, // R - South African Rand
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
