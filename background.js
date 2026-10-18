importScripts("exchangeCache.js");

const CACHE_EXPIRATION_HOURS = DEFAULT_CACHE_EXPIRATION_HOURS;
const inflightFetches = new Map();

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

function readRatesCache() {
  return new Promise((resolve) => {
    chrome.storage.local.get("exchangeRatesCache", (result) => {
      resolve(result.exchangeRatesCache || null);
    });
  });
}

function writeRatesCache(cache) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ exchangeRatesCache: cache }, resolve);
  });
}

async function fetchExchangeRates(baseCurrency) {
  if (inflightFetches.has(baseCurrency)) {
    return inflightFetches.get(baseCurrency);
  }

  const request = (async () => {
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

      if (!response.ok) {
        console.error("Error fetching exchange rates:", exchangeData);
        return null;
      }

      const existing = await readRatesCache();
      const updated = mergeRatesCache(
        existing,
        baseCurrency,
        exchangeData.conversion_rates
      );
      await writeRatesCache(updated);
      return updated.rates[baseCurrency];
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      return null;
    } finally {
      inflightFetches.delete(baseCurrency);
    }
  })();

  inflightFetches.set(baseCurrency, request);
  return request;
}

async function getExchangeRates(baseCurrency) {
  const cache = await readRatesCache();
  const cached = getCachedRatesForBase(
    cache,
    baseCurrency,
    CACHE_EXPIRATION_HOURS
  );
  if (cached) {
    return cached;
  }
  return fetchExchangeRates(baseCurrency);
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

    getExchangeRates(detectedCurrency).then((rates) => {
      const exchangeRate = rates ? rates[userCurrency] : null;
      sendResponse({ exchangeRate });
    });
    return true;
  }

  if (message.action === "getExchangeRatesForBases") {
    const { userCurrency, baseCurrencies } = message;
    if (!userCurrency || !Array.isArray(baseCurrencies)) {
      sendResponse({ rates: {} });
      return false;
    }

    const uniqueBases = [...new Set(baseCurrencies.filter(Boolean))];
    Promise.all(
      uniqueBases.map(async (base) => {
        if (base === userCurrency) {
          return [base, 1];
        }
        const rates = await getExchangeRates(base);
        return [base, rates ? rates[userCurrency] : null];
      })
    ).then((entries) => {
      const rates = {};
      entries.forEach(([base, rate]) => {
        rates[base] = rate;
      });
      sendResponse({ rates });
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
