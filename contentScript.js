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
      processPagePrices(
        hourlyWage,
        userCurrency,
        domainCurrency || "AUD",
        workHoursPerDay
      );
    });
  });
}

function collectPagePrices(domainCurrency) {
  if (!document.body) {
    return null;
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
  const found = [];

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
    found.push({ price: priceInfo.price, currency });
  }

  return found;
}

function processPagePrices(
  hourlyWage,
  userCurrency,
  domainCurrency,
  workHoursPerDay
) {
  const found = collectPagePrices(domainCurrency);
  if (found == null) {
    updateFloatingDiv("Page not ready. Try again in a moment.");
    return;
  }

  const bases = [...new Set(found.map((item) => item.currency))];

  getExchangeRatesForBases(userCurrency, bases, (ratesByBase) => {
    if (!ratesByBase) {
      updateFloatingDiv(
        "Could not load exchange rates. Check your API key and try again."
      );
      return;
    }

    const missing = bases.filter(
      (base) => base !== userCurrency && ratesByBase[base] == null
    );
    if (missing.length > 0) {
      updateFloatingDiv(
        `Could not load exchange rates for: ${missing.join(", ")}. Check your API key and try again.`
      );
      return;
    }

    const prices = found.map(({ price, currency }) => {
      const rate = currency === userCurrency ? 1 : ratesByBase[currency];
      const priceInUserCurrency = price * rate;
      const resultText = convertPriceToHours(
        priceInUserCurrency,
        hourlyWage,
        workHoursPerDay
      );
      return ` - ${price} ${currency} (~${resultText} in ${userCurrency})`;
    });

    updateFloatingDiv({
      hourlyWage: `${hourlyWage} ${userCurrency}`,
      domainCurrency,
      prices,
    });
  });
}
