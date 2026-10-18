const DEFAULT_CACHE_EXPIRATION_HOURS = 24;

function mergeRatesCache(existing, baseCurrency, conversionRates, now = Date.now()) {
  const prev = existing || {};
  return {
    rates: {
      ...(prev.rates || {}),
      [baseCurrency]: conversionRates,
    },
    timestamps: {
      ...(prev.timestamps || {}),
      [baseCurrency]: now,
    },
  };
}

function getCachedRatesForBase(
  cache,
  baseCurrency,
  maxAgeHours = DEFAULT_CACHE_EXPIRATION_HOURS,
  now = Date.now()
) {
  if (!cache || !baseCurrency) {
    return null;
  }

  const rates = cache.rates && cache.rates[baseCurrency];
  if (!rates) {
    return null;
  }

  const timestamp =
    (cache.timestamps && cache.timestamps[baseCurrency]) || cache.timestamp;
  if (!timestamp) {
    return null;
  }

  const hoursSince = (now - timestamp) / (1000 * 60 * 60);
  if (hoursSince > maxAgeHours) {
    return null;
  }

  return rates;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    DEFAULT_CACHE_EXPIRATION_HOURS,
    mergeRatesCache,
    getCachedRatesForBase,
  };
}
