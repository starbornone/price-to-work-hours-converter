const SUPPORTED_CURRENCIES = [
  { code: "AED", label: "AED - UAE Dirham" },
  { code: "ARS", label: "ARS - Argentine Peso" },
  { code: "AUD", label: "AUD - Australian Dollar" },
  { code: "BRL", label: "BRL - Brazilian Real" },
  { code: "CAD", label: "CAD - Canadian Dollar" },
  { code: "CHF", label: "CHF - Swiss Franc" },
  { code: "CZK", label: "CZK - Czech Koruna" },
  { code: "DKK", label: "DKK - Danish Krone" },
  { code: "EUR", label: "EUR - Euro" },
  { code: "GBP", label: "GBP - British Pound" },
  { code: "PHP", label: "PHP - Philippine Peso" },
  { code: "HKD", label: "HKD - Hong Kong Dollar" },
  { code: "HUF", label: "HUF - Hungarian Forint" },
  { code: "INR", label: "INR - Indian Rupee" },
  { code: "ILS", label: "ILS - Israeli Shekel" },
  { code: "ISK", label: "ISK - Icelandic Króna" },
  { code: "JPY", label: "JPY - Japanese Yen" },
  { code: "KRW", label: "KRW - South Korean Won" },
  { code: "MXN", label: "MXN - Mexican Peso" },
  { code: "NOK", label: "NOK - Norwegian Krone" },
  { code: "NGN", label: "NGN - Nigerian Naira" },
  { code: "NZD", label: "NZD - New Zealand Dollar" },
  { code: "PLN", label: "PLN - Polish Zloty" },
  { code: "RUB", label: "RUB - Russian Ruble" },
  { code: "ZAR", label: "ZAR - South African Rand" },
  { code: "SAR", label: "SAR - Saudi Riyal" },
  { code: "SEK", label: "SEK - Swedish Krona" },
  { code: "SGD", label: "SGD - Singapore Dollar" },
  { code: "THB", label: "THB - Thai Baht" },
  { code: "TRY", label: "TRY - Turkish Lira" },
  { code: "USD", label: "USD - US Dollar" },
  { code: "VND", label: "VND - Vietnamese Dong" },
];

function populateCurrencySelect(selectEl, selectedCode) {
  if (!selectEl) {
    return;
  }

  const current = selectedCode || selectEl.value || "AUD";
  while (selectEl.firstChild) {
    selectEl.removeChild(selectEl.firstChild);
  }

  SUPPORTED_CURRENCIES.forEach(({ code, label }) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = label;
    if (code === current) {
      option.selected = true;
    }
    selectEl.appendChild(option);
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SUPPORTED_CURRENCIES,
    populateCurrencySelect,
  };
}
