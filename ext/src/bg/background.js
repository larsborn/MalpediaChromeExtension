// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.pageAction.show(sender.tab.id);
        sendResponse();
    });


chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: "Lookup on Malpedia",
        contexts: ["selection"],
        onclick: (selection) => {
            const query = selection.selectionText;
            chrome.tabs.create({
                url: new MalpediaApi().quickReferenceUrl(query),
            });
        }
    });
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({
        malpediaReferences: new MalpediaApi().getReferences(),
    });
});
