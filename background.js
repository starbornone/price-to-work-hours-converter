const CACHE_EXPIRATION_HOURS = 24; // Cache exchange rates for 24 hours

// Function to fetch exchange rates in the background
async function fetchExchangeRates(baseCurrency) {
  const API_KEY = "00262605769bc0997a9ed877"; // Replace with your API key
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`
    );
    const data = await response.json();
    if (response.ok) {
      // Store the rates and timestamp in local storage
      const newRates = {
        timestamp: Date.now(),
        rates: { [baseCurrency]: data.conversion_rates },
      };
      chrome.storage.local.set({ exchangeRatesCache: newRates }, () => {
        console.log("Exchange rates cached in background");
      });
      return newRates.rates;
    } else {
      console.error("Error fetching exchange rates:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return null;
  }
}

// Function to check if the cache is expired
function isCacheExpired(cacheTimestamp) {
  const now = Date.now();
  const hoursSinceLastFetch = (now - cacheTimestamp) / (1000 * 60 * 60); // Convert milliseconds to hours
  return hoursSinceLastFetch > CACHE_EXPIRATION_HOURS;
}

// Function to get cached exchange rates or fetch new ones if expired
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

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getExchangeRate") {
    const { userCurrency, detectedCurrency } = message;
    getExchangeRates(detectedCurrency, (rates) => {
      const exchangeRate = rates ? rates[userCurrency] : null;
      sendResponse({ exchangeRate });
    });
    return true; // Indicates that we will send a response asynchronously
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getDomainCurrency") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;

      chrome.storage.sync.get(domain, function (data) {
        sendResponse({ currency: data[domain] });
      });
    });
    return true; // Indicates that we will send a response asynchronously
  }

  if (message.action === "saveDomainCurrency") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;

      // Save the selected currency for this domain
      chrome.storage.sync.set({ [domain]: message.currency }, function () {
        sendResponse({ status: "Currency saved for domain" });
      });
    });
    return true; // Indicates that we will send a response asynchronously
  }
});
