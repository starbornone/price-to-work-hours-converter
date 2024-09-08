function calculateHourlyWageFromYearly(yearlyWage, hoursPerDay) {
  const workDaysPerYear = 260;
  const totalHoursPerYear = hoursPerDay * workDaysPerYear;
  return yearlyWage / totalHoursPerYear;
}

function calculateManualPriceToHours() {
  chrome.storage.sync.get(["hourlyWage", "workHoursPerDay"], function (data) {
    const hourlyWage = parseFloat(data.hourlyWage);
    const workHoursPerDay = data.workHoursPerDay || 7.6;
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

    const hoursRequired = (manualPrice / hourlyWage).toFixed(2);
    let displayText = `${hoursRequired} hours of work`;

    if (hoursRequired > 8) {
      const daysRequired = (hoursRequired / workHoursPerDay).toFixed(2);
      displayText += ` (~${daysRequired} days of work)`;
    }

    const manualPriceResult = document.getElementById("manualPriceResult");
    if (manualPriceResult) {
      manualPriceResult.textContent = displayText;
    } else {
      console.error("manualPriceResult element not found.");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(
    ["hourlyWage", "userCurrency", "apiKey"],
    function (data) {
      if (data.hourlyWage) {
        document.getElementById("wageInput").value = data.hourlyWage;
      }
      if (data.userCurrency) {
        document.getElementById("userCurrencySelect").value = data.userCurrency;
      }
      if (data.apiKey) {
        document.getElementById("apiKeyInput").value = data.apiKey;
      }

      chrome.runtime.sendMessage(
        { action: "getDomainCurrency" },
        function (response) {
          const detectedCurrency = response.currency || "AUD";
          const domainCurrencySelect = document.getElementById(
            "domainCurrencySelect"
          );
          domainCurrencySelect.value = detectedCurrency;
        }
      );
    }
  );
});

document.addEventListener("DOMContentLoaded", function () {
  const checkPricesBtn = document.getElementById("checkPricesBtn");

  if (checkPricesBtn) {
    checkPricesBtn.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: loadWageAndProcessPage,
        });
      });
    });
  } else {
    console.error("checkPricesBtn not found in the DOM");
  }
});

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
  const domainCurrency = document.getElementById("domainCurrencySelect").value;
  const apiKey = document.getElementById("apiKeyInput").value;

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

  if (hourlyWage > 0 && apiKey) {
    chrome.storage.sync.set(
      {
        hourlyWage: hourlyWage,
        userCurrency: userCurrency,
        apiKey: apiKey,
      },
      function () {
        chrome.runtime.sendMessage(
          { action: "saveDomainCurrency", currency: domainCurrency },
          function () {
            alert("Settings and currency saved successfully!");
          }
        );
      }
    );
  } else {
    alert("Please enter valid wage values and a valid API key.");
  }
});
