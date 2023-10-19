console.log("Content script loaded");

let observer;

setInterval(() => {
  console.log("Checking for popups");
  const popupContainer = document.querySelector("ytd-popup-container");
  if (popupContainer) {
    console.log("Popup found, removing");
    popupContainer.remove();
  }
}, 1000); // Checks every 1 second

function startObserver() {
  console.log("Starting observer");
  const config = {childList: true, subtree: true};

  const urlObserverConfig = {
    childList: true,
    subtree: true,
    characterData: true,
  };
  const urlObserverCallback = function () {
    const popupContainer = document.querySelector("ytd-popup-container");
    if (popupContainer) {
      popupContainer.remove();
    }
  };
  const urlObserver = new MutationObserver(urlObserverCallback);
  urlObserver.observe(document.body, urlObserverConfig);

  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName.toLowerCase() === "ytd-popup-container") {
            const popupContainer = document.querySelector(
              "ytd-popup-container"
            );
            if (popupContainer) {
              popupContainer.remove();
            }
          }
        });
      }
    }
  };

  observer = new MutationObserver(callback);
  observer.observe(document.body, config);
}

function stopObserver() {
  console.log("Stopping observer");
  if (observer) observer.disconnect();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
  if (message.action === "startObserver") {
    startObserver();
    sendResponse({status: "success"});
  } else if (message.action === "stopObserver") {
    stopObserver();
    sendResponse({status: "success"});
  }
});

// Send a ready message to the extension
chrome.runtime.sendMessage({status: "ready"});

// Re-start observing on page navigation
window.addEventListener("hashchange", startObserver);
