// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startObserver" || message.action === "stopObserver") {
    // Get all tabs with the specified URL
    console.log("WE GOT ONE");
    chrome.tabs.query({url: "https://www.youtube.com/*"}, (tabs) => {
      for (let tab of tabs) {
        // Forward the message to each tab
        chrome.tabs.sendMessage(tab.id, message);
      }
    });
  }
});
