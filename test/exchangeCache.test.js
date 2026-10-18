const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  mergeRatesCache,
  getCachedRatesForBase,
} = require("../exchangeCache.js");

describe("mergeRatesCache", () => {
  it("keeps existing bases when adding a new one", () => {
    const existing = {
      rates: { AUD: { USD: 0.65 } },
      timestamps: { AUD: 1000 },
    };

    const merged = mergeRatesCache(existing, "EUR", { USD: 1.1 }, 2000);

    assert.deepEqual(merged.rates.AUD, { USD: 0.65 });
    assert.deepEqual(merged.rates.EUR, { USD: 1.1 });
    assert.equal(merged.timestamps.AUD, 1000);
    assert.equal(merged.timestamps.EUR, 2000);
  });

  it("overwrites one base without dropping others", () => {
    const existing = {
      rates: { AUD: { USD: 0.65 }, EUR: { USD: 1.05 } },
      timestamps: { AUD: 1000, EUR: 1500 },
    };

    const merged = mergeRatesCache(existing, "EUR", { USD: 1.1 }, 3000);

    assert.deepEqual(merged.rates.AUD, { USD: 0.65 });
    assert.deepEqual(merged.rates.EUR, { USD: 1.1 });
    assert.equal(merged.timestamps.EUR, 3000);
  });
});

describe("getCachedRatesForBase", () => {
  it("returns rates within TTL", () => {
    const cache = {
      rates: { AUD: { USD: 0.65 } },
      timestamps: { AUD: 1_000_000 },
    };

    const rates = getCachedRatesForBase(cache, "AUD", 24, 1_000_000 + 3_600_000);
    assert.deepEqual(rates, { USD: 0.65 });
  });

  it("returns null when expired", () => {
    const cache = {
      rates: { AUD: { USD: 0.65 } },
      timestamps: { AUD: 1_000_000 },
    };
    const dayMs = 25 * 60 * 60 * 1000;

    assert.equal(
      getCachedRatesForBase(cache, "AUD", 24, 1_000_000 + dayMs),
      null
    );
  });

  it("supports legacy single timestamp caches", () => {
    const cache = {
      rates: { AUD: { USD: 0.65 } },
      timestamp: 1_000_000,
    };

    assert.deepEqual(
      getCachedRatesForBase(cache, "AUD", 24, 1_000_000),
      { USD: 0.65 }
    );
  });
});
