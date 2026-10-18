const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  parseAmountString,
  extractPrice,
  convertPriceToHours,
} = require("../currency.js");

describe("parseAmountString", () => {
  it("parses plain integers and US decimals", () => {
    assert.equal(parseAmountString("19"), 19);
    assert.equal(parseAmountString("19.99"), 19.99);
    assert.equal(parseAmountString("1,234.56"), 1234.56);
  });

  it("parses EU decimals and thousands", () => {
    assert.equal(parseAmountString("19,99"), 19.99);
    assert.equal(parseAmountString("1.234,56"), 1234.56);
  });

  it("parses thin-space / space thousands after stripping", () => {
    assert.equal(parseAmountString("1 234,56".replace(/\s/g, "")), 1234.56);
  });

  it("returns NaN for empty input", () => {
    assert.ok(Number.isNaN(parseAmountString("")));
    assert.ok(Number.isNaN(parseAmountString(null)));
  });
});

describe("extractPrice", () => {
  it("detects euro amounts before and after the symbol", () => {
    assert.deepEqual(extractPrice("Total €19.99"), {
      price: 19.99,
      currency: "EUR",
    });
    assert.deepEqual(extractPrice("19,99 €"), {
      price: 19.99,
      currency: "EUR",
    });
  });

  it("detects GBP and prefixed dollar currencies", () => {
    assert.deepEqual(extractPrice("£12.50"), {
      price: 12.5,
      currency: "GBP",
    });
    assert.deepEqual(extractPrice("US$40"), {
      price: 40,
      currency: "USD",
    });
    assert.deepEqual(extractPrice("A$25.00"), {
      price: 25,
      currency: "AUD",
    });
  });

  it("treats bare $ as ambiguous (null currency)", () => {
    assert.deepEqual(extractPrice("Only $9.99 today"), {
      price: 9.99,
      currency: null,
    });
  });

  it("prefers R$ (BRL) over bare R (ZAR)", () => {
    assert.deepEqual(extractPrice("R$150,00"), {
      price: 150,
      currency: "BRL",
    });
  });

  it("returns null when no price is present", () => {
    assert.equal(extractPrice("no money here"), null);
    assert.equal(extractPrice(""), null);
  });
});

describe("convertPriceToHours", () => {
  it("formats hours under a work day", () => {
    assert.equal(
      convertPriceToHours(40, 20, 8),
      "2.00 hours of work"
    );
  });

  it("appends days when over 8 hours", () => {
    assert.equal(
      convertPriceToHours(200, 20, 8),
      "10.00 hours of work (~1.25 days of work)"
    );
  });

  it("guards invalid wage", () => {
    assert.equal(
      convertPriceToHours(10, 0, 8),
      "Unable to calculate work time"
    );
  });
});
