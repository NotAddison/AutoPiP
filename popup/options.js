// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// chrome.storage.sync.get({ optOutAnalytics: false }, results => {
//   const optOutAnalyticsCheckbox = document.querySelector('#optOutAnalytics');

//   optOutAnalyticsCheckbox.checked = results.optOutAnalytics;
//   optOutAnalyticsCheckbox.onchange = _ => {
//     chrome.storage.sync.set({
//       optOutAnalytics: optOutAnalyticsCheckbox.checked
//     }, _ => {
//       // Reload extension to make opt-out change immediate. 
//       chrome.runtime.reload();
//       window.close();
//     });
//   };
// });

let toggle = false;
const disabled = '#FF6961';
const enabled = '#25D158';

// --- [ INITALIZE Setting ] --- //
chrome.storage.sync.get(['toggle'], function(result) {
  result.toggle ? toggle = true : toggle = false;
  document.getElementById("toggle").innerHTML = toggle ? "ENABLED" : "DISABLED";
  document.getElementById("toggle").style.color = toggle ? enabled : disabled;
});

// Set Verison
document.getElementById("version").innerHTML = chrome.runtime.getManifest().version;


// --- [ FUNCTION: Report Issue Button ] --- //
document.getElementById("report").addEventListener("click", report);
function report(){
  const url = "https://github.com/NotAddison/AutoPiP/issues/new"
  chrome.tabs.create({ url: url });
}


// --- [ FUNCTION: On / Off Toggle ] --- //
document.getElementById("toggle").addEventListener("click", onoff);
function onoff(){
  toggle = !toggle;
  document.getElementById("toggle").innerHTML = toggle ? "ENABLED" : "DISABLED";
  document.getElementById("toggle").style.color = toggle ? enabled : disabled;
  chrome.storage.sync.set({ toggle: toggle });
  chrome.runtime.reload();
}


// --- [ FUNCTION: Show Badge Text ] --- //
function badge(text, color, time = 1000) {
  chrome.action.setBadgeText({ text: text });
  chrome.action.setBadgeBackgroundColor({ color: color });
  setTimeout(() => chrome.action.setBadgeText({ text: '' }), time || 1000);
}