(() => {
  if (globalThis.__priceToWorkHoursInitialized) {
    return;
  }
  globalThis.__priceToWorkHoursInitialized = true;

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === "checkPrices") {
      loadWageAndProcessPage();
      sendResponse({ ok: true });
      return false;
    }
  });
})();

function loadWageAndProcessPage() {
  loadSettings((data) => {
    const hourlyWage = parseFloat(data.hourlyWage);
    const userCurrency = data.userCurrency || "AUD";
    const workHoursPerDay = parseFloat(data.workHoursPerDay) || 7.6;

    if (!hourlyWage || isNaN(hourlyWage)) {
      updateFloatingDiv("Please set your hourly wage in the extension popup.");
      return;
    }

    loadCurrencyForDomain((domainCurrency) => {
      const siteCurrency = domainCurrency || "AUD";

      getExchangeRate(userCurrency, siteCurrency, (exchangeRate) => {
        if (exchangeRate == null) {
          updateFloatingDiv(
            "Could not load exchange rates. Check your API key and try again."
          );
          return;
        }

        processPagePrices(
          hourlyWage,
          userCurrency,
          siteCurrency,
          workHoursPerDay,
          exchangeRate
        );
      });
    });
  });
}

function processPagePrices(
  hourlyWage,
  userCurrency,
  domainCurrency,
  workHoursPerDay,
  exchangeRate
) {
  if (!document.body) {
    updateFloatingDiv("Page not ready. Try again in a moment.");
    return;
  }

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        const parent = node.parentElement;
        if (!parent) {
          return NodeFilter.FILTER_REJECT;
        }
        const tag = parent.tagName;
        if (
          tag === "SCRIPT" ||
          tag === "STYLE" ||
          tag === "NOSCRIPT" ||
          tag === "TEXTAREA" ||
          parent.closest("#priceFloatingDiv")
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const uniquePrices = new Set();
  const prices = [];

  let node;
  while ((node = walker.nextNode())) {
    const priceInfo = extractPrice(node.nodeValue);
    if (!priceInfo) {
      continue;
    }

    const currency = priceInfo.currency || domainCurrency;
    const key = `${priceInfo.price}|${currency}`;
    if (uniquePrices.has(key)) {
      continue;
    }
    uniquePrices.add(key);

    // Rate is domainCurrency → userCurrency. Ambiguous/$ amounts use domain currency.
    // Explicit currencies that differ from the domain still use this rate (limitation).
    const priceInUserCurrency =
      currency === userCurrency
        ? priceInfo.price
        : priceInfo.price * exchangeRate;

    const resultText = convertPriceToHours(
      priceInUserCurrency,
      hourlyWage,
      workHoursPerDay
    );
    prices.push(
      ` - ${priceInfo.price} ${currency} (~${resultText} in ${userCurrency})`
    );
  }

  updateFloatingDiv({
    hourlyWage: `${hourlyWage} ${userCurrency}`,
    domainCurrency,
    prices,
  });
}
