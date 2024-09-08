const CACHE_EXPIRATION_HOURS = 24;

async function fetchExchangeRates(baseCurrency) {
  try {
    const data = await new Promise((resolve) => {
      chrome.storage.sync.get("apiKey", resolve);
    });

    const apiKey = data.apiKey;
    if (!apiKey) {
      console.error("API key is not set.");
      return null;
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`
    );
    const exchangeData = await response.json();

    if (response.ok) {
      const newRates = {
        timestamp: Date.now(),
        rates: { [baseCurrency]: exchangeData.conversion_rates },
      };
      chrome.storage.local.set({ exchangeRatesCache: newRates }, () => {
        console.log("Exchange rates cached in background");
      });
      return newRates.rates;
    } else {
      console.error("Error fetching exchange rates:", exchangeData);
      return null;
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return null;
  }
}

function isCacheExpired(cacheTimestamp) {
  const now = Date.now();
  const hoursSinceLastFetch = (now - cacheTimestamp) / (1000 * 60 * 60);
  return hoursSinceLastFetch > CACHE_EXPIRATION_HOURS;
}

function getExchangeRates(baseCurrency, callback) {
  chrome.storage.local.get("exchangeRatesCache", async (result) => {
    const cachedRates = result.exchangeRatesCache;
    if (cachedRates && !isCacheExpired(cachedRates.timestamp)) {
      console.log("Using cached exchange rates");
      callback(cachedRates.rates[baseCurrency]);
    } else {
      console.log("Fetching new exchange rates from API");
      const rates = await fetchExchangeRates(baseCurrency);
      callback(rates ? rates[baseCurrency] : null);
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getExchangeRate") {
    const { userCurrency, detectedCurrency } = message;
    getExchangeRates(detectedCurrency, (rates) => {
      const exchangeRate = rates ? rates[userCurrency] : null;
      sendResponse({ exchangeRate });
    });
    return true;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getDomainCurrency") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;

      chrome.storage.sync.get(domain, function (data) {
        sendResponse({ currency: data[domain] || "AUD" });
      });
    });
    return true;
  }

  if (message.action === "saveDomainCurrency") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;

      chrome.storage.sync.set({ [domain]: message.currency }, function () {
        sendResponse({ status: "Domain currency saved for domain" });
      });
    });
    return true;
  }
});
