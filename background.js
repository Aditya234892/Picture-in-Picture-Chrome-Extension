chrome.action.onClicked.addListener(async (tab) => {
    console.log("Working!!", tab);
    const files = ["script.js"];
   await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        // files: ["script.js"]
        files: files
    });
});