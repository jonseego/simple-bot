chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: 'red' });//111
  chrome.webNavigation.onCompleted.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
      if (id) {
        chrome.action.disable(id);
      }
    });
  }, { url: [{ hostContains: 'google.com' }] });//111 all except google domain
});