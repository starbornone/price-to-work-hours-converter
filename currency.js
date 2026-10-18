function extractPrice(text) {
  const priceRegexes = [
    { regex: /د\.إ\d+(\.\d{2})?/, currency: "AED" },
    { regex: /ARS\s?\d+(\.\d{2})?/, currency: "ARS" },
    { regex: /\d{1,3}(,\d{3})*(\.\d{2})?\s?AUD/, currency: "AUD" },
    { regex: /R\$\d+(\.\d{2})?/, currency: "BRL" },
    { regex: /NZ\$\d+(\.\d{2})?/, currency: "NZD" },
    { regex: /HK\$\d+(\.\d{2})?/, currency: "HKD" },
    { regex: /S\$\d+(\.\d{2})?/, currency: "SGD" },
    { regex: /A\$\d+(\.\d{2})?/, currency: "AUD" },
    { regex: /US\$\d+(\.\d{2})?/, currency: "USD" },
    { regex: /CA\$\d+(\.\d{2})?/, currency: "CAD" },
    // Bare $ is ambiguous (USD/CAD/AUD/...); caller should use domain currency
    { regex: /\$\d+(\.\d{2})?/, currency: null },
    { regex: /CHF\s?\d+(\.\d{2})?/, currency: "CHF" },
    { regex: /CZK\s?\d+(\.\d{2})?/, currency: "CZK" },
    { regex: /DKK\s?\d+(\.\d{2})?/, currency: "DKK" },
    { regex: /€\d+(\.\d{2})?/, currency: "EUR" },
    { regex: /£\d+(\.\d{2})?/, currency: "GBP" },
    { regex: /\₱\d+(\.\d{2})?/, currency: "PHP" },
    { regex: /HUF\s?\d+(\.\d{2})?/, currency: "HUF" },
    { regex: /₹\d+(\.\d{2})?/, currency: "INR" },
    { regex: /ILS\s?\d+(\.\d{2})?/, currency: "ILS" },
    { regex: /ISK\s?\d+(\.\d{2})?/, currency: "ISK" },
    { regex: /\d{1,3}(,\d{3})*(\.\d{2})?\s?JPY/, currency: "JPY" },
    { regex: /₩\d+(\.\d{2})?/, currency: "KRW" },
    { regex: /\d+(\.\d{2})?\s?MXN/, currency: "MXN" },
    { regex: /NOK\s?\d+(\.\d{2})?/, currency: "NOK" },
    { regex: /₦\d+(\.\d{2})?/, currency: "NGN" },
    { regex: /PLN\s?\d+(\.\d{2})?/, currency: "PLN" },
    { regex: /₽\d+(\.\d{2})?/, currency: "RUB" },
    { regex: /R\d+(\.\d{2})?/, currency: "ZAR" },
    { regex: /SAR\s?\d+(\.\d{2})?/, currency: "SAR" },
    { regex: /\d+(\.\d{2})?\s?SEK/, currency: "SEK" },
    { regex: /\d+(\.\d{2})?\s?THB/, currency: "THB" },
    { regex: /TL\s?\d+(\.\d{2})?/, currency: "TRY" },
    { regex: /\d{1,3}(,\d{3})*(\.\d{2})?\s?USD/, currency: "USD" },
    { regex: /₫\d+(\.\d{2})?/, currency: "VND" },
  ];

  for (const { regex, currency } of priceRegexes) {
    const match = text.match(regex);
    if (match) {
      const price = parseFloat(match[0].replace(/[^\d.]/g, ""));
      if (isNaN(price)) {
        continue;
      }
      return { price, currency };
    }
  }

  return null;
}

function convertPriceToHours(price, wage, workHoursPerDay) {
  const hours = price / wage;
  const hoursDisplay = hours.toFixed(2);
  let displayText = `${hoursDisplay} hours of work`;

  if (hours > 8) {
    const days = (hours / workHoursPerDay).toFixed(2);
    displayText += ` (~${days} days of work)`;
  }

  return displayText;
}
