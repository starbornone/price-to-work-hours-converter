const CACHE_EXPIRATION_HOURS = 24;

function getApiKey(callback) {
  chrome.storage.local.get("apiKey", (local) => {
    if (local.apiKey) {
      callback(local.apiKey);
      return;
    }

    chrome.storage.sync.get("apiKey", (sync) => {
      if (sync.apiKey) {
        chrome.storage.local.set({ apiKey: sync.apiKey }, () => {
          chrome.storage.sync.remove("apiKey");
          callback(sync.apiKey);
        });
        return;
      }
      callback(null);
    });
  });
}

async function fetchExchangeRates(baseCurrency) {
  try {
    const apiKey = await new Promise((resolve) => getApiKey(resolve));
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
      chrome.storage.local.set({ exchangeRatesCache: newRates });
      return newRates.rates;
    }

    console.error("Error fetching exchange rates:", exchangeData);
    return null;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return null;
  }
}

function isCacheExpired(cacheTimestamp) {
  const hoursSinceLastFetch =
    (Date.now() - cacheTimestamp) / (1000 * 60 * 60);
  return hoursSinceLastFetch > CACHE_EXPIRATION_HOURS;
}

function getExchangeRates(baseCurrency, callback) {
  chrome.storage.local.get("exchangeRatesCache", async (result) => {
    const cachedRates = result.exchangeRatesCache;
    if (
      cachedRates &&
      !isCacheExpired(cachedRates.timestamp) &&
      cachedRates.rates &&
      cachedRates.rates[baseCurrency]
    ) {
      callback(cachedRates.rates[baseCurrency]);
      return;
    }

    const rates = await fetchExchangeRates(baseCurrency);
    callback(rates ? rates[baseCurrency] : null);
  });
}

function getActiveTabHostname(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || !tab.url) {
      callback(null);
      return;
    }

    try {
      callback(new URL(tab.url).hostname);
    } catch {
      callback(null);
    }
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "getExchangeRate") {
    const { userCurrency, detectedCurrency } = message;
    if (!userCurrency || !detectedCurrency) {
      sendResponse({ exchangeRate: null });
      return false;
    }

    if (userCurrency === detectedCurrency) {
      sendResponse({ exchangeRate: 1 });
      return false;
    }

    getExchangeRates(detectedCurrency, (rates) => {
      const exchangeRate = rates ? rates[userCurrency] : null;
      sendResponse({ exchangeRate });
    });
    return true;
  }

  if (message.action === "getDomainCurrency") {
    getActiveTabHostname((domain) => {
      if (!domain) {
        sendResponse({ currency: "AUD" });
        return;
      }
      chrome.storage.sync.get(domain, (data) => {
        sendResponse({ currency: data[domain] || "AUD" });
      });
    });
    return true;
  }

  if (message.action === "saveDomainCurrency") {
    getActiveTabHostname((domain) => {
      if (!domain) {
        sendResponse({ status: "No active tab" });
        return;
      }
      chrome.storage.sync.set({ [domain]: message.currency }, () => {
        sendResponse({ status: "Domain currency saved for domain" });
      });
    });
    return true;
  }

  return false;
});
