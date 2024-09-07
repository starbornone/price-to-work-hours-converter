function loadSettings(callback) {
  chrome.storage.sync.get(
    ["hourlyWage", "userCurrency", "workHoursPerDay"],
    callback
  );
}

function loadCurrencyForDomain(callback) {
  chrome.runtime.sendMessage({ action: "getDomainCurrency" }, (response) => {
    callback(response.currency);
  });
}

function saveCurrencyForDomain(currency) {
  chrome.runtime.sendMessage({ action: "saveDomainCurrency", currency });
}
