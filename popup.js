// Helper function to calculate hourly wage from yearly wage and hours per day
function calculateHourlyWageFromYearly(yearlyWage, hoursPerDay) {
  const workDaysPerYear = 260; // Assume 5 days a week, 52 weeks a year
  const totalHoursPerYear = hoursPerDay * workDaysPerYear;
  return yearlyWage / totalHoursPerYear;
}

// Load saved wage and user currency when the popup opens
document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(["hourlyWage", "userCurrency"], function (data) {
    if (data.hourlyWage) {
      document.getElementById("wageInput").value = data.hourlyWage;
    }

    if (data.userCurrency) {
      document.getElementById("currencySelect").value = data.userCurrency;
    }
  });
});

// Save the global hourly wage and user currency to chrome.storage.sync
document.getElementById("saveBtn").addEventListener("click", function () {
  const wageInput = document.getElementById("wageInput").value;
  const yearlyWageInput = document.getElementById("yearlyWageInput").value;
  const hoursPerDayInput = document.getElementById("hoursPerDayInput").value;
  const userCurrency = document.getElementById("currencySelect").value;

  let hourlyWage;

  // Check if yearly wage and hours per day are provided and calculate hourly wage
  if (yearlyWageInput && hoursPerDayInput) {
    hourlyWage = calculateHourlyWageFromYearly(
      parseFloat(yearlyWageInput),
      parseFloat(hoursPerDayInput)
    );
  } else if (wageInput) {
    hourlyWage = parseFloat(wageInput); // Use hourly wage directly if provided
  } else {
    alert(
      "Please enter either your hourly wage or your yearly wage and hours per day."
    );
    return;
  }

  if (hourlyWage > 0) {
    chrome.storage.sync.set(
      {
        hourlyWage: hourlyWage, // Save global hourly wage
        userCurrency: userCurrency, // Save global user currency
      },
      function () {
        alert("Hourly wage and currency saved globally!");
      }
    );
  } else {
    alert("Please enter valid wage values.");
  }
});
