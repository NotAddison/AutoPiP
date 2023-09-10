var currentTab = 0;
var prevTab = null;
var targetTab = null;
var log = []
var toggle = true;

// Get Settings
chrome.storage.sync.get(['toggle'], function(result) {
  result.toggle ? toggle = true : toggle = false;
  console.log("AutoPiP Enabled:", toggle)
});

chrome.tabs.onActivated.addListener(function(tab) {
  // --- [0] : Check settings  --- //
  if (!toggle) return;
  
  console.clear();
  currentTab = tab.tabId;
  
  // --- [1] : Check for playing videos *(set target)  ---
  if (targetTab === null){
    console.log(">> Check PiP For:", currentTab)
    chrome.scripting.executeScript({target: {tabId: currentTab}, files: ['./scripts/check-video.js']}, (results) => {
      console.log("Has Video:", results[0].result);
      if (results[0].result) targetTab = currentTab;
      else {}
    });
  }

  // --- [2] : Exit PiP *(if user is in target tab)  ---
  if (currentTab === targetTab) {
    console.log(">> Exit PiP")

    // Execute Exit PiP
    chrome.scripting.executeScript({target: {tabId: targetTab}, files: ['./scripts/pip.js']}, (results) => {
      console.log("PiP:", results[0].result);
      targetTab = null;
    });

    // If page has a video, set targetTab
    chrome.scripting.executeScript({target: {tabId: currentTab}, files: ['./scripts/check-video.js']}, (results) => {
      console.log("Has Video:", results[0].result);
      if (results[0].result) targetTab = currentTab;
      else {}
    });
  }

  // --- [3] : Toggle PiP *(if there is a targetTab AND user is not in target tab)  ---
  if (targetTab != null && currentTab != targetTab){

    // [3.1] : Check if there is already a PiP vide
    console.log(">> (CHECK) Toggle PiP")
    chrome.scripting.executeScript({target: {tabId: targetTab}, files: ['./scripts/check-pip.js']}, (results) => {
      console.log("PiP Exists:", results[0].result);

      // [3.2] : No PiP video ; toggle PiP
      if (!results[0].result) {
        console.log(">> (ACTION) Toggle PiP")
        chrome.scripting.executeScript({target: {tabId: targetTab}, files: ['./scripts/pip.js']}, (results) => {
          console.log("PiP:", results[0].result);
        });
      }
    });
  }

  console.log("Current:", tab)
  console.log("Previous:", prevTab)
  console.log("Target:", targetTab)

  // --- [ Update ] ---
  prevTab = tab.tabId;
});