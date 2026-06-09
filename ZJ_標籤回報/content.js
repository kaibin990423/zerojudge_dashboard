// 範例：抓取標題與題號 (需根據實際頁面 DOM 結構微調)
function getProblemInfo() {
    // 假設題目 ID 在 h3 或特定連結內
    const titleElement = document.querySelector('title'); // 請根據實際檢查元素修正
    const problemId = window.location.href.split('problemid=')[1];
    
    return {
        title: titleElement ? titleElement.innerText.split('.')[1].trim().replace(" - 高中生程式解題系統","") : "未知題目",
        id: problemId
    };
}

// 將抓到的資料傳送到 Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getProblem") {
        sendResponse(getProblemInfo());
    }
});