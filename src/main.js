var prevTab = 0;
var targetTab = null;
var log = []

chrome.tabs.onActivated.addListener(function(tab, info) {
  const files = ["functions.js"];

  // Init prevTab Value
  if (prevTab === 0) prevTab = tab.tabId;

  // Log tabId : To retrieve target tab (Stop logging if PiP is Enabled)
  if (targetTab === null) log.push(tab.tabId)
  
  // [ Enter PiP ] --> If video is found
  if (prevTab != tab.tabId && targetTab == null){
    chrome.scripting.executeScript({
      target: { tabId: prevTab, allFrames: true },
      world: "MAIN",
      files,
    }, (results) => {
      console.log("Has Video:", results[0].result && results[0].result != null)
      if (results[0].result && results[0].result != null){
        console.log("Enter PiP")
        targetTab = log[log.length - 2];
        log = []
      }
    });
  }

  // [ Exit PiP ] --> If in target tab
  if (targetTab === tab.tabId) {
    chrome.scripting.executeScript({
      target: { tabId: tab.tabId, allFrames: true },
      world: "MAIN",
      files,
    }, (results) => {
      if (results[0].result === "Exit"){
        console.log("Exit PiP")
        targetTab = null;
      }
    });
  }

  console.clear();
  console.log("Current:", tab)
  console.log("Previous:", prevTab)
  console.log("Target:", targetTab)
  console.log("Log:", log)

  // Update prevTab Value
  prevTab = tab.tabId;
});