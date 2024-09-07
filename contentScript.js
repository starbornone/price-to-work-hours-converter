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

  results.push(`Hourly wage: ${hourlyWage}`);
  results.push(`User Currency: ${userCurrency}`);
  results.push(`Domain Currency: ${domainCurrency}`);
  results.push("Prices found on this page:");

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

  if (results.length > 0) {
    updateFloatingDiv(results);
  } else {
    updateFloatingDiv(["No prices found on this page."]);
  }
}

// Manually convert a user-entered price to work hours
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

    document.getElementById("manualPriceResult").textContent = displayText;
  });
}
