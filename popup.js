function calculateHourlyWageFromYearly(yearlyWage, hoursPerDay) {
  const workDaysPerYear = 260; // Assume 5 days a week, 52 weeks a year
  const totalHoursPerYear = hoursPerDay * workDaysPerYear;
  return yearlyWage / totalHoursPerYear;
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

      // Load the detected domain currency for the current website
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

// Save the global settings including domain-specific currency and user currency
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
        // Save the selected domain currency for the current domain
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
