var data;

function renderLevel(data) {
    if (data) {
        if (data.chestsInfo && data.chestsInfo.uncommon > 0 && data.keys > 0) {
            chrome.browserAction.setBadgeText({
                text: String(data.chestsInfo.charge.toFixed(0))
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: '#9C27B0'
            });
        } else {
            chrome.browserAction.setBadgeText({
                text: String(data.level)
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: '#2196f3'
            });
        }
    }
}

function saveToStorage(data) {
    var object = {
        currentLvl: data.level,
        chestsNormal: data.chestsInfo.common,
        chestsCharged: data.chestsInfo.uncommon,
        keys: data.keys,
        runes: data.runes
    };
    object = JSON.stringify(object);

    var d = new Date();
    var n = d.getTime();
    n = JSON.stringify(n);
    localStorage.setItem(n, object);
}

window.setInterval(function() {
    renderLevel();
}, 1000);


document.addEventListener('DOMContentLoaded', function() {
    chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
            if (details.url == "http://kong.timetravel.tap-adventure.com/c/user/update/") {
                data = JSON.parse(details.requestBody.formData.data[0]);
                renderLevel(data);
                saveToStorage(data);
            }
        }, {
            urls: ["<all_urls>"]
        }, ['requestBody']);
});
