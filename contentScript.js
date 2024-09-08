// Initialize floating div when the DOM content is fully loaded
window.addEventListener("load", () => {
  setTimeout(() => {
    loadWageAndProcessPage();
  }, 500);
});

// Initialize floating div when the DOM content is fully loaded
window.addEventListener("load", () => {
  setTimeout(() => {
    loadWageAndProcessPage();
  }, 500);
});

function loadWageAndProcessPage() {
  loadSettings((data) => {
    const hourlyWage = parseFloat(data.hourlyWage);
    const userCurrency = data.userCurrency || "AUD";
    const workHoursPerDay = data.workHoursPerDay || 7.6;

    if (!hourlyWage || isNaN(hourlyWage)) {
      updateFloatingDiv(["Please set your hourly wage."]);
      return;
    }

    loadCurrencyForDomain((domainCurrency) => {
      processPagePrices(
        hourlyWage,
        userCurrency,
        domainCurrency || "AUD",
        workHoursPerDay
      );
    });
  });
}

function processPagePrices(
  hourlyWage,
  userCurrency,
  domainCurrency,
  workHoursPerDay
) {
  const elements = document.querySelectorAll("*:not(script):not(style)");
  const uniquePrices = new Set();
  const results = [];

  results.push(hourlyWage);
  results.push(userCurrency);
  results.push(domainCurrency);

  elements.forEach((el) => {
    const textContent = el.textContent;
    const priceInfo = extractPrice(textContent); // Extract price in domain currency

    if (priceInfo && !uniquePrices.has(priceInfo.price)) {
      uniquePrices.add(priceInfo.price);
      const { price } = priceInfo;
      const resultText = convertPriceToHours(
        price,
        hourlyWage,
        workHoursPerDay
      );
      results.push(
        ` - ${price} ${domainCurrency} (~${resultText} in ${userCurrency})`
      );
    }
  });

  // Use updateFloatingDiv from ui.js
  if (results.length > 0) {
    updateFloatingDiv(results);
  } else {
    updateFloatingDiv(["No prices found on this page."]);
  }
}

// Ensure the DOM is fully loaded before trying to access elements
document.addEventListener("DOMContentLoaded", function () {
  const checkPricesBtn = document.getElementById("checkPricesBtn");

  if (checkPricesBtn) {
    checkPricesBtn.addEventListener("click", function () {
      // Create or show the floating div
      const floatingDiv = createFloatingDiv();
      floatingDiv.style.display = "block"; // Ensure the div is visible

      // Trigger the processing of prices when the button is clicked
      loadWageAndProcessPage();
    });
  } else {
    console.error("checkPricesBtn not found in the DOM.");
  }
});
