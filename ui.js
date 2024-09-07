function createFloatingDiv() {
  // Check if floatingDiv already exists
  let floatingDiv = document.getElementById("priceFloatingDiv");

  if (!floatingDiv) {
    // Create the div if it doesn't exist
    floatingDiv = document.createElement("div");
    floatingDiv.id = "priceFloatingDiv";
    floatingDiv.style.position = "fixed";
    floatingDiv.style.top = "10px";
    floatingDiv.style.right = "10px";
    floatingDiv.style.width = "300px";
    floatingDiv.style.padding = "15px";
    floatingDiv.style.backgroundColor = "rgba(0, 123, 255, 0.9)";
    floatingDiv.style.color = "#fff";
    floatingDiv.style.fontSize = "14px";
    floatingDiv.style.borderRadius = "5px";
    floatingDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    floatingDiv.style.zIndex = "9999";
    floatingDiv.style.display = "block"; // Always visible

    document.body.appendChild(floatingDiv);
  }

  // Clear the floating div before adding new elements
  floatingDiv.innerHTML = "";

  // Create the close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.style.position = "absolute";
  closeButton.style.top = "5px";
  closeButton.style.right = "5px";
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.border = "none";
  closeButton.style.color = "#fff";
  closeButton.style.fontSize = "16px";
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener(
    "click",
    () => (floatingDiv.style.display = "none")
  );
  floatingDiv.appendChild(closeButton);

  // Create Check Prices button
  const checkPricesButton = document.createElement("button");
  checkPricesButton.textContent = "Check Prices";
  checkPricesButton.style.marginTop = "10px";
  checkPricesButton.style.width = "100%";
  checkPricesButton.style.padding = "10px";
  checkPricesButton.style.backgroundColor = "#007bff";
  checkPricesButton.style.color = "#fff";
  checkPricesButton.style.border = "none";
  checkPricesButton.style.borderRadius = "4px";
  checkPricesButton.style.cursor = "pointer";
  checkPricesButton.addEventListener("click", loadWageAndProcessPage);
  floatingDiv.appendChild(checkPricesButton);

  // Create manual price input
  const manualPriceInput = document.createElement("input");
  manualPriceInput.id = "manualPriceInput";
  manualPriceInput.type = "number";
  manualPriceInput.placeholder = "Enter price to convert";
  manualPriceInput.style.marginTop = "10px";
  manualPriceInput.style.width = "100%";
  manualPriceInput.style.padding = "10px";
  manualPriceInput.style.border = "1px solid #007bff";
  manualPriceInput.style.borderRadius = "4px";
  floatingDiv.appendChild(manualPriceInput);

  // Create Calculate Hours button
  const calculateBtn = document.createElement("button");
  calculateBtn.textContent = "Calculate Hours";
  calculateBtn.style.marginTop = "10px";
  calculateBtn.style.width = "100%";
  calculateBtn.style.padding = "10px";
  calculateBtn.style.backgroundColor = "#007bff";
  calculateBtn.style.color = "#fff";
  calculateBtn.style.border = "none";
  calculateBtn.style.borderRadius = "4px";
  calculateBtn.style.cursor = "pointer";
  calculateBtn.addEventListener("click", calculateManualPriceToHours);
  floatingDiv.appendChild(calculateBtn);

  // Result display for manual price calculation
  const resultDiv = document.createElement("p");
  resultDiv.id = "manualPriceResult";
  resultDiv.style.fontWeight = "bold";
  resultDiv.style.textAlign = "center";
  resultDiv.style.marginTop = "10px";
  floatingDiv.appendChild(resultDiv);

  // Create a container for the results
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("results");
  floatingDiv.appendChild(messageContainer);

  return floatingDiv;
}

function updateFloatingDiv(messages) {
  const floatingDiv =
    document.getElementById("priceFloatingDiv") || createFloatingDiv();
  const messageContainer = floatingDiv.querySelector(".results");

  // Clear any existing messages
  messageContainer.innerHTML = "";

  // Add new messages
  messages.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);
  });
}
