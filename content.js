console.log("Content script loaded");

let observer;

function startObserver() {
  console.log("Starting observer");
  const config = {childList: true, subtree: true};

  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeName.toLowerCase() === "ytd-enforcement-message-view-model"
          ) {
            const closeButton = document.querySelector(
              "yt-button-view-model#dismiss-button button"
            );
            if (closeButton) closeButton.click();

            setTimeout(() => {
              const playButton = document.querySelector(".ytp-play-button");
              if (playButton) playButton.click();
            }, 1000);
            console.alert("WE GOT ONE");
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
window.addEventListener("popstate", startObserver);
// Non-standard events; may not work as expected
// window.addEventListener("pushState", startObserver);
// window.addEventListener("replaceState", startObserver);
// Alternative: custom event fired by some libraries
// window.addEventListener("statechange", startObserver);
