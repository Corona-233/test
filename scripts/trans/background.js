const languages = {
    "zh": "中文",
    "en": "英语",
    "ja": "日语",
    "ko": "韩语",
    "es": "西班牙语"
};

chrome.runtime.onInstalled.addListener(() => {
    for (const [code, name] of Object.entries(languages)) {
        chrome.contextMenus.create({
            id: "translate-" + code,
            title: `翻译为 ${name}`,
            contexts: ["selection"]
        });
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    const text = info.selectionText;
    const targetLang = info.menuItemId.replace("translate-", "");

    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`)
        .then(res => res.json())
        .then(data => {
            const translated = data[0].map(item => item[0]).join('');
            chrome.tabs.executeScript(tab.id, {
                file: "content.js"
            }, () => {
                chrome.tabs.sendMessage(tab.id, { type: "showTranslation", text: translated });
            });
        })
        .catch(() => {
            chrome.tabs.executeScript(tab.id, {
                file: "content.js"
            }, () => {
                chrome.tabs.sendMessage(tab.id, { type: "showTranslation", text: "翻译失败，请检查网络或稍后再试。" });
            });
        });
});