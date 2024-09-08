function createFloatingDiv() {
  let floatingDiv = document.getElementById("priceFloatingDiv");

  if (!floatingDiv) {
    // Create the floating div
    floatingDiv = document.createElement("div");
    floatingDiv.id = "priceFloatingDiv";
    floatingDiv.style.position = "fixed";
    floatingDiv.style.top = "10px";
    floatingDiv.style.right = "10px";
    floatingDiv.style.width = "360px";
    floatingDiv.style.padding = "20px";
    floatingDiv.style.backgroundColor = "#f9f9f9";
    floatingDiv.style.border = "1px solid #ddd";
    floatingDiv.style.borderRadius = "8px";
    floatingDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
    floatingDiv.style.zIndex = "9999";
    floatingDiv.style.display = "block";
    floatingDiv.style.fontFamily = "Arial, sans-serif";

    document.body.appendChild(floatingDiv);
  }

  // Clear existing content
  floatingDiv.innerHTML = "";

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "X";
  closeButton.style.position = "absolute";
  closeButton.style.top = "5px";
  closeButton.style.right = "5px";
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.border = "none";
  closeButton.style.color = "#333";
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", () => {
    floatingDiv.style.display = "none";
  });
  floatingDiv.appendChild(closeButton);

  // Section for general information (hourly wage, user currency, domain currency)
  const infoSection = document.createElement("div");
  infoSection.classList.add("section");
  infoSection.style.marginBottom = "20px";
  infoSection.style.padding = "10px";
  infoSection.style.border = "1px solid #ddd";
  infoSection.style.backgroundColor = "#fff";
  infoSection.style.borderRadius = "8px";

  floatingDiv.appendChild(infoSection);

  // Section for price results
  const resultsSection = document.createElement("div");
  resultsSection.classList.add("section");
  resultsSection.style.padding = "10px";
  resultsSection.style.border = "1px solid #ddd";
  resultsSection.style.backgroundColor = "#fff";
  resultsSection.style.borderRadius = "8px";

  const resultsTitle = document.createElement("div");
  resultsTitle.textContent = "Prices Found";
  resultsTitle.style.color = "#555";
  resultsTitle.style.fontWeight = "bold";
  resultsTitle.style.fontSize = "16px";
  resultsSection.appendChild(resultsTitle);

  // Create a container for the results
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("results");
  resultsSection.appendChild(messageContainer);

  floatingDiv.appendChild(resultsSection);

  return floatingDiv;
}

function updateFloatingDiv(messages) {
  const floatingDiv =
    document.getElementById("priceFloatingDiv") || createFloatingDiv();

  const messageContainer = floatingDiv.querySelector(".results");
  const infoSection = floatingDiv.querySelector(".section");

  // Clear previous messages
  messageContainer.innerHTML = "";
  infoSection.innerHTML = "";

  // First three messages are general info, the rest are prices
  const [hourlyWage, userCurrency, domainCurrency, ...prices] = messages;

  // Update the general information section
  const generalInfo = document.createElement("div");
  generalInfo.innerHTML = `
    <strong>Hourly Wage:</strong> ${hourlyWage}<br />
    <strong>User Currency:</strong> ${userCurrency}<br />
    <strong>Domain Currency:</strong> ${domainCurrency}
  `;
  infoSection.appendChild(generalInfo);

  // Add price information to the message container
  prices.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);
  });
}
