let isActive = true;
const toggleBtn = document.getElementById("toggleBtn");

function updateButtonColor() {
  toggleBtn.style.backgroundColor = isActive ? "green" : "red";
}

// Set the initial color of the toggle button
updateButtonColor();

toggleBtn.addEventListener("click", () => {
  isActive = !isActive;
  updateButtonColor();

  // Send message to background script
  chrome.runtime.sendMessage({
    action: isActive ? "startObserver" : "stopObserver",
  });
});
