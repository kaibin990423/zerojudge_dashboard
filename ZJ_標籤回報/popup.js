document.addEventListener('DOMContentLoaded', () => {
    // 1. 主動向當前分頁（Content Script）發送詢問題目資訊的請求
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) return;

        chrome.tabs.sendMessage(tabs[0].id, { action: "getProblem" }, (response) => {
            if (response) {
                // 顯示在 Popup 畫面上（方便使用者看）
                document.getElementById('title-display').innerText = `${response.id} - ${response.title}`;

                // 2. 準備你的 Google 表單基礎網址（記得換成你自己的表單 ID）
                const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe2WN_-RHZb9TmH7cILUBgjYXZ_X1oxmVQR9LAlZQbJNJxRiA/viewform?usp=pp_url";
                
                // 3. 填入你剛剛查到的 entry ID 
                const idEntry = "entry.589041344";      // 👈 換成你的題號欄位暗號

                // 4. 使用 encodeURIComponent 將中文或特殊符號轉碼，避免網址斷掉或亂碼
                const cleanId = encodeURIComponent(response.id);
                const cleanTitle = encodeURIComponent(response.title);

                // 5. 拼接成最終的預填網址
                const finalFormUrl = `${baseUrl}&${idEntry}=${cleanId}`;

                // 6. 將網址塞進 iframe，讓表單自動載入且自動填好欄位
                document.getElementById('gform').src = finalFormUrl;
            } else {
                document.getElementById('title-display').innerText = "未能取得題目資訊（請確認是否在題目頁）";
            }
        });
    });
});