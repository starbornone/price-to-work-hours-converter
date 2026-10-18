function loadSettings(callback) {
  chrome.storage.sync.get(
    ["hourlyWage", "userCurrency", "workHoursPerDay"],
    callback
  );
}

function loadCurrencyForDomain(callback) {
  chrome.runtime.sendMessage({ action: "getDomainCurrency" }, (response) => {
    if (chrome.runtime.lastError || !response) {
      callback("AUD");
      return;
    }
    callback(response.currency || "AUD");
  });
}

function saveCurrencyForDomain(currency, callback) {
  chrome.runtime.sendMessage(
    { action: "saveDomainCurrency", currency },
    (response) => {
      if (typeof callback === "function") {
        callback(response);
      }
    }
  );
}

function getExchangeRate(userCurrency, detectedCurrency, callback) {
  if (userCurrency === detectedCurrency) {
    callback(1);
    return;
  }

  chrome.runtime.sendMessage(
    { action: "getExchangeRate", userCurrency, detectedCurrency },
    (response) => {
      if (chrome.runtime.lastError || !response) {
        callback(null);
        return;
      }
      callback(response.exchangeRate ?? null);
    }
  );
}

function getExchangeRatesForBases(userCurrency, baseCurrencies, callback) {
  chrome.runtime.sendMessage(
    { action: "getExchangeRatesForBases", userCurrency, baseCurrencies },
    (response) => {
      if (chrome.runtime.lastError || !response) {
        callback(null);
        return;
      }
      callback(response.rates || {});
    }
  );
}

function loadApiKey(callback) {
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

function saveApiKey(apiKey, callback) {
  chrome.storage.local.set({ apiKey }, () => {
    chrome.storage.sync.remove("apiKey", callback);
  });
}
