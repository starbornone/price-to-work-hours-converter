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

  results.push(hourlyWage + " " + userCurrency);
  results.push(domainCurrency);

  elements.forEach((el) => {
    const textContent = el.textContent;
    const priceInfo = extractPrice(textContent);

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

document.addEventListener("DOMContentLoaded", function () {
  const checkPricesBtn = document.getElementById("checkPricesBtn");

  if (checkPricesBtn) {
    checkPricesBtn.addEventListener("click", function () {
      const floatingDiv = createFloatingDiv();
      floatingDiv.style.display = "block";
      loadWageAndProcessPage();
    });
  } else {
    console.error("checkPricesBtn not found in the DOM.");
  }
});
