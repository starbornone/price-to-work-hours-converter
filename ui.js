function createFloatingDiv() {
  let floatingDiv = document.getElementById("priceFloatingDiv");

  if (!floatingDiv) {
    floatingDiv = document.createElement("div");
    floatingDiv.id = "priceFloatingDiv";
    floatingDiv.setAttribute("role", "dialog");
    floatingDiv.setAttribute("aria-label", "Price to work hours");
    floatingDiv.style.position = "fixed";
    floatingDiv.style.top = "0.625rem";
    floatingDiv.style.right = "0.625rem";
    floatingDiv.style.width = "24rem";
    floatingDiv.style.padding = "1.25rem";
    floatingDiv.style.backgroundColor = "#f9f9f9";
    floatingDiv.style.border = "0.0625rem solid #ddd";
    floatingDiv.style.borderRadius = "0.5rem";
    floatingDiv.style.boxShadow = "0 0 0.625rem rgba(0, 0, 0, 0.1)";
    floatingDiv.style.zIndex = "9999";
    floatingDiv.style.fontFamily = "Arial, sans-serif";
    document.body.appendChild(floatingDiv);
    makeDivDraggable(floatingDiv);
  }

  while (floatingDiv.firstChild) {
    floatingDiv.removeChild(floatingDiv.firstChild);
  }

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close");
  closeButton.style.position = "absolute";
  closeButton.style.top = "0.3125rem";
  closeButton.style.right = "0.3125rem";
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.border = "none";
  closeButton.style.cursor = "pointer";

  const closeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  closeSvg.setAttribute("viewBox", "0 0 384 512");
  closeSvg.setAttribute("width", "16");
  closeSvg.setAttribute("height", "16");
  closeSvg.setAttribute("aria-hidden", "true");
  const closePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  closePath.setAttribute(
    "d",
    "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
  );
  closePath.setAttribute("fill", "#333");
  closeSvg.appendChild(closePath);
  closeButton.appendChild(closeSvg);

  closeButton.addEventListener("click", () => {
    floatingDiv.style.display = "none";
  });
  floatingDiv.appendChild(closeButton);

  const infoSection = document.createElement("div");
  infoSection.classList.add("section");
  infoSection.style.marginBottom = "1.25rem";
  infoSection.style.padding = "0.625rem";
  infoSection.style.border = "0.0625rem solid #ddd";
  infoSection.style.backgroundColor = "#fff";
  infoSection.style.borderRadius = "0.5rem";
  floatingDiv.appendChild(infoSection);

  const resultsSection = document.createElement("div");
  resultsSection.classList.add("results");
  resultsSection.style.padding = "0.625rem";
  resultsSection.style.border = "0.0625rem solid #ddd";
  resultsSection.style.backgroundColor = "#fff";
  resultsSection.style.borderRadius = "0.5rem";
  floatingDiv.appendChild(resultsSection);

  return floatingDiv;
}

function makeDivDraggable(div) {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let pos4 = 0;
  div.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    if (e.target.closest("button")) {
      return;
    }
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    div.style.top = div.offsetTop - pos2 + "px";
    div.style.left = div.offsetLeft - pos1 + "px";
    div.style.right = "auto";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function ensureFloatingDiv() {
  const floatingDiv = createFloatingDiv();
  floatingDiv.style.display = "block";
  return floatingDiv;
}

/**
 * @param {string | { hourlyWage: string, domainCurrency: string, prices: string[] }} payload
 */
function updateFloatingDiv(payload) {
  const floatingDiv = ensureFloatingDiv();
  const messageContainer = floatingDiv.querySelector(".results");
  const infoSection = floatingDiv.querySelector(".section");

  while (messageContainer.firstChild) {
    messageContainer.removeChild(messageContainer.firstChild);
  }
  while (infoSection.firstChild) {
    infoSection.removeChild(infoSection.firstChild);
  }

  if (typeof payload === "string") {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = payload;
    messageContainer.appendChild(messageDiv);
    return;
  }

  const wageLine = document.createElement("div");
  wageLine.textContent = `Hourly Wage: ${payload.hourlyWage}`;
  infoSection.appendChild(wageLine);

  const currencyLine = document.createElement("div");
  currencyLine.textContent = `Website Currency: ${payload.domainCurrency}`;
  infoSection.appendChild(currencyLine);

  const prices = payload.prices || [];
  if (prices.length === 0) {
    const empty = document.createElement("div");
    empty.textContent = "No prices found on this page.";
    messageContainer.appendChild(empty);
    return;
  }

  prices.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);
  });
}
