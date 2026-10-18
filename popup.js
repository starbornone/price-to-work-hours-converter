function calculateHourlyWageFromYearly(yearlyWage, hoursPerDay) {
  const workDaysPerYear = 260;
  const totalHoursPerYear = hoursPerDay * workDaysPerYear;
  return yearlyWage / totalHoursPerYear;
}

function calculateManualPriceToHours() {
  chrome.storage.sync.get(
    ["hourlyWage", "workHoursPerDay", "userCurrency"],
    function (data) {
      const hourlyWage = parseFloat(data.hourlyWage);
      const workHoursPerDay = parseFloat(data.workHoursPerDay) || 7.6;
      const userCurrency = data.userCurrency || "AUD";
      const domainCurrency =
        document.getElementById("domainCurrencySelect").value || "AUD";
      const manualPrice = parseFloat(
        document.getElementById("manualPriceInput").value
      );

      if (!hourlyWage || isNaN(hourlyWage)) {
        alert("Please set your hourly wage first.");
        return;
      }

      if (!manualPrice || isNaN(manualPrice)) {
        alert("Please enter a valid price.");
        return;
      }

      getExchangeRate(userCurrency, domainCurrency, (exchangeRate) => {
        if (exchangeRate == null) {
          alert(
            "Could not load exchange rates. Check your API key and try again."
          );
          return;
        }

        const priceInUserCurrency = manualPrice * exchangeRate;
        const displayText = convertPriceToHours(
          priceInUserCurrency,
          hourlyWage,
          workHoursPerDay
        );

        const manualPriceResult = document.getElementById("manualPriceResult");
        if (manualPriceResult) {
          manualPriceResult.textContent = `${displayText} (${domainCurrency} → ${userCurrency})`;
        }
      });
    }
  );
}

function isRestrictedUrl(url) {
  if (!url) {
    return true;
  }
  return /^(chrome|chrome-extension|edge|about|devtools|view-source):/i.test(
    url
  ) || /chrome\.google\.com\/webstore/i.test(url);
}

function requestCheckPrices() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || tab.id == null) {
      alert("No active tab to check.");
      return;
    }

    if (isRestrictedUrl(tab.url)) {
      alert("Can't check prices on this page. Open a regular website tab.");
      return;
    }

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["currency.js", "storage.js", "ui.js", "contentScript.js"],
      });
    } catch (error) {
      alert(
        "Could not access this page. " +
          (error && error.message ? error.message : "Try another site.")
      );
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: "checkPrices" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        alert(
          "Could not scan this page. " +
            (chrome.runtime.lastError
              ? chrome.runtime.lastError.message
              : "Try refreshing and click Check Prices again.")
        );
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(
    ["hourlyWage", "userCurrency", "workHoursPerDay"],
    function (data) {
      if (data.hourlyWage) {
        document.getElementById("wageInput").value = data.hourlyWage;
      }
      if (data.userCurrency) {
        document.getElementById("userCurrencySelect").value = data.userCurrency;
      }
      if (data.workHoursPerDay) {
        document.getElementById("hoursPerDayInput").value =
          data.workHoursPerDay;
      }

      loadApiKey((apiKey) => {
        if (apiKey) {
          document.getElementById("apiKeyInput").value = apiKey;
        }
      });

      chrome.runtime.sendMessage(
        { action: "getDomainCurrency" },
        function (response) {
          if (chrome.runtime.lastError || !response) {
            return;
          }
          const domainCurrencySelect = document.getElementById(
            "domainCurrencySelect"
          );
          domainCurrencySelect.value = response.currency || "AUD";
        }
      );
    }
  );

  document
    .getElementById("checkPricesBtn")
    .addEventListener("click", requestCheckPrices);

  document
    .getElementById("calculateHoursBtn")
    .addEventListener("click", function () {
      const manualPrice = document.getElementById("manualPriceInput").value;
      if (manualPrice) {
        calculateManualPriceToHours();
      } else {
        alert("Please enter a valid price.");
      }
    });

  document.getElementById("saveBtn").addEventListener("click", function () {
    const wageInput = document.getElementById("wageInput").value;
    const yearlyWageInput = document.getElementById("yearlyWageInput").value;
    const hoursPerDayInput = document.getElementById("hoursPerDayInput").value;
    const userCurrency = document.getElementById("userCurrencySelect").value;
    const domainCurrency =
      document.getElementById("domainCurrencySelect").value;
    const apiKey = document.getElementById("apiKeyInput").value.trim();

    const workHoursPerDay = parseFloat(hoursPerDayInput) || 7.6;

    let hourlyWage;
    if (yearlyWageInput && hoursPerDayInput) {
      hourlyWage = calculateHourlyWageFromYearly(
        parseFloat(yearlyWageInput),
        parseFloat(hoursPerDayInput)
      );
    } else if (wageInput) {
      hourlyWage = parseFloat(wageInput);
    } else {
      alert(
        "Please enter either your hourly wage or your yearly wage and hours per day."
      );
      return;
    }

    if (!(hourlyWage > 0) || !apiKey) {
      alert("Please enter valid wage values and a valid API key.");
      return;
    }

    chrome.storage.sync.set(
      {
        hourlyWage: hourlyWage,
        userCurrency: userCurrency,
        workHoursPerDay: workHoursPerDay,
      },
      function () {
        saveApiKey(apiKey, function () {
          chrome.runtime.sendMessage(
            { action: "saveDomainCurrency", currency: domainCurrency },
            function () {
              alert("Settings and currency saved successfully!");
            }
          );
        });
      }
    );
  });
});
