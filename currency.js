/**
 * Parse a numeric amount that may use US (1,234.56) or EU (1.234,56) grouping.
 */
function parseAmountString(raw) {
  if (raw == null) {
    return NaN;
  }

  const cleaned = String(raw).replace(/[^\d.,]/g, "").trim();
  if (!cleaned) {
    return NaN;
  }

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      return parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
    }
    return parseFloat(cleaned.replace(/,/g, ""));
  }

  if (lastComma !== -1) {
    const parts = cleaned.split(",");
    if (parts.length === 2 && parts[1].length > 0 && parts[1].length <= 2) {
      return parseFloat(`${parts[0]}.${parts[1]}`);
    }
    return parseFloat(cleaned.replace(/,/g, ""));
  }

  if (lastDot !== -1) {
    const parts = cleaned.split(".");
    if (parts.length === 2 && parts[1].length > 0 && parts[1].length <= 2) {
      return parseFloat(cleaned);
    }
    if (parts.length > 2) {
      return parseFloat(cleaned.replace(/\./g, ""));
    }
    // Single dot with 3+ fractional digits is unusual; treat as decimal anyway
    return parseFloat(cleaned);
  }

  return parseFloat(cleaned);
}

// Matches common shop amount shapes; interpret with parseAmountString.
const AMOUNT = String.raw`\d{1,3}(?:[.,\u00a0\s]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?`;

function amountFromMatch(match) {
  const raw = match[1] || match[2] || match[0];
  return parseAmountString(raw);
}

function extractPrice(text) {
  if (!text || typeof text !== "string") {
    return null;
  }

  const priceRegexes = [
    {
      regex: new RegExp(String.raw`د\.إ\s*(${AMOUNT})|(${AMOUNT})\s*د\.إ`),
      currency: "AED",
    },
    {
      regex: new RegExp(String.raw`ARS\s*(${AMOUNT})|(${AMOUNT})\s*ARS`, "i"),
      currency: "ARS",
    },
    {
      regex: new RegExp(String.raw`R\$\s*(${AMOUNT})|(${AMOUNT})\s*BRL`, "i"),
      currency: "BRL",
    },
    // Longer $-prefixes before shorter ones (US$ must beat S$)
    {
      regex: new RegExp(String.raw`US\$\s*(${AMOUNT})|(${AMOUNT})\s*USD`, "i"),
      currency: "USD",
    },
    {
      regex: new RegExp(String.raw`CA\$\s*(${AMOUNT})|(${AMOUNT})\s*CAD`, "i"),
      currency: "CAD",
    },
    {
      regex: new RegExp(String.raw`NZ\$\s*(${AMOUNT})|(${AMOUNT})\s*NZD`, "i"),
      currency: "NZD",
    },
    {
      regex: new RegExp(String.raw`HK\$\s*(${AMOUNT})|(${AMOUNT})\s*HKD`, "i"),
      currency: "HKD",
    },
    {
      regex: new RegExp(String.raw`A\$\s*(${AMOUNT})|(${AMOUNT})\s*AUD`, "i"),
      currency: "AUD",
    },
    {
      regex: new RegExp(
        String.raw`(?<![A-Za-z])S\$\s*(${AMOUNT})|(${AMOUNT})\s*SGD`,
        "i"
      ),
      currency: "SGD",
    },
    {
      regex: new RegExp(String.raw`CHF\s*(${AMOUNT})|(${AMOUNT})\s*CHF`, "i"),
      currency: "CHF",
    },
    {
      regex: new RegExp(String.raw`CZK\s*(${AMOUNT})|(${AMOUNT})\s*CZK`, "i"),
      currency: "CZK",
    },
    {
      regex: new RegExp(String.raw`DKK\s*(${AMOUNT})|(${AMOUNT})\s*DKK`, "i"),
      currency: "DKK",
    },
    {
      regex: new RegExp(String.raw`€\s*(${AMOUNT})|(${AMOUNT})\s*€`),
      currency: "EUR",
    },
    {
      regex: new RegExp(String.raw`£\s*(${AMOUNT})|(${AMOUNT})\s*£`),
      currency: "GBP",
    },
    {
      regex: new RegExp(String.raw`₱\s*(${AMOUNT})|(${AMOUNT})\s*PHP`, "i"),
      currency: "PHP",
    },
    {
      regex: new RegExp(String.raw`HUF\s*(${AMOUNT})|(${AMOUNT})\s*HUF`, "i"),
      currency: "HUF",
    },
    {
      regex: new RegExp(String.raw`₹\s*(${AMOUNT})|(${AMOUNT})\s*INR`, "i"),
      currency: "INR",
    },
    {
      regex: new RegExp(String.raw`ILS\s*(${AMOUNT})|(${AMOUNT})\s*ILS`, "i"),
      currency: "ILS",
    },
    {
      regex: new RegExp(String.raw`ISK\s*(${AMOUNT})|(${AMOUNT})\s*ISK`, "i"),
      currency: "ISK",
    },
    {
      regex: new RegExp(String.raw`¥\s*(${AMOUNT})|(${AMOUNT})\s*JPY`, "i"),
      currency: "JPY",
    },
    {
      regex: new RegExp(String.raw`₩\s*(${AMOUNT})|(${AMOUNT})\s*KRW`, "i"),
      currency: "KRW",
    },
    {
      regex: new RegExp(String.raw`MXN\s*(${AMOUNT})|(${AMOUNT})\s*MXN`, "i"),
      currency: "MXN",
    },
    {
      regex: new RegExp(String.raw`NOK\s*(${AMOUNT})|(${AMOUNT})\s*NOK`, "i"),
      currency: "NOK",
    },
    {
      regex: new RegExp(String.raw`₦\s*(${AMOUNT})|(${AMOUNT})\s*NGN`, "i"),
      currency: "NGN",
    },
    {
      regex: new RegExp(String.raw`PLN\s*(${AMOUNT})|(${AMOUNT})\s*PLN`, "i"),
      currency: "PLN",
    },
    {
      regex: new RegExp(String.raw`₽\s*(${AMOUNT})|(${AMOUNT})\s*RUB`, "i"),
      currency: "RUB",
    },
    {
      regex: new RegExp(String.raw`SAR\s*(${AMOUNT})|(${AMOUNT})\s*SAR`, "i"),
      currency: "SAR",
    },
    {
      regex: new RegExp(String.raw`SEK\s*(${AMOUNT})|(${AMOUNT})\s*SEK`, "i"),
      currency: "SEK",
    },
    {
      regex: new RegExp(String.raw`฿\s*(${AMOUNT})|(${AMOUNT})\s*THB`, "i"),
      currency: "THB",
    },
    {
      regex: new RegExp(String.raw`TL\s*(${AMOUNT})|(${AMOUNT})\s*TRY`, "i"),
      currency: "TRY",
    },
    {
      regex: new RegExp(String.raw`₫\s*(${AMOUNT})|(${AMOUNT})\s*VND`, "i"),
      currency: "VND",
    },
    {
      regex: new RegExp(String.raw`R\s*(${AMOUNT})|(${AMOUNT})\s*ZAR`, "i"),
      currency: "ZAR",
    },
    // Bare $ last — ambiguous; caller should apply domain currency
    {
      regex: new RegExp(String.raw`\$\s*(${AMOUNT})`),
      currency: null,
    },
  ];

  for (const { regex, currency } of priceRegexes) {
    const match = text.match(regex);
    if (!match) {
      continue;
    }
    const price = amountFromMatch(match);
    if (isNaN(price)) {
      continue;
    }
    return { price, currency };
  }

  return null;
}

function convertPriceToHours(price, wage, workHoursPerDay) {
  if (!(wage > 0) || !(workHoursPerDay > 0) || !isFinite(price)) {
    return "Unable to calculate work time";
  }

  const hours = price / wage;
  const hoursDisplay = hours.toFixed(2);
  let displayText = `${hoursDisplay} hours of work`;

  if (hours > 8) {
    const days = (hours / workHoursPerDay).toFixed(2);
    displayText += ` (~${days} days of work)`;
  }

  return displayText;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    parseAmountString,
    extractPrice,
    convertPriceToHours,
  };
}
