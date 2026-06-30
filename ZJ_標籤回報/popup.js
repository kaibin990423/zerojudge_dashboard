








document.addEventListener('DOMContentLoaded', () => {
    // 🔴 請把下方換成你在第一步「發布到網路」取得的 CSV 網址
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQw6sWVYjUIc5BbtMmg7REqy_U9sdYO7rLk5UXlVfEKm2e9fUebCOUuhFr8wgX4BpYAbt_nJ7YxZNwR/pub?gid=1327680315&single=true&output=csv";
                  
    // 🔴 你的 Google 表單基礎設定 (填入你原本的 entry ID)
    const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe2WN_-RHZb9TmH7cILUBgjYXZ_X1oxmVQR9LAlZQbJNJxRiA/viewform?usp=pp_url";
    const idEntry = "entry.589041344";       // 題號欄位
    const titleEntry = "entry.22222222";    // 標題欄位
    const tagEntry = "entry.2039364817";      // 👈 記得補上你 Google 表單中「標籤」欄位的 entry ID

    let currentId = "";
    let currentTitle = "";
    let selectedTags = [];

    // 1. 先抓取雲端現有的標籤清單
    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            console.log(csvText)
            const lines = csvText.split('\n');
            if (lines.length > 0) {
                // CSV 的第一列通常是標頭：["題號", "基本輸出輸入", "迴圈", "陣列"...]
                const headers = lines[0].split(',');
                // 排除第一個元素 "題號"，剩下的就是所有現成標籤
                const existingTags = headers.slice(1).map(t => t.trim()).filter(Boolean);
                console.log(existingTags)
                renderTagButtons(existingTags);
            }
        })
        .catch(err => {
            document.getElementById('tag-box').innerText = "無法載入標籤，請檢查網路或發布設定。";
            console.error(err);
        });

    // 2. 向 Content Script 索取目前 ZeroJudge 的題目資訊
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) return;
        chrome.tabs.sendMessage(tabs[0].id, { action: "getProblem" }, (response) => {
            if (response) {
                currentId = response.id;
                currentTitle = response.title;
                document.getElementById('title-display').innerText = `${currentId} - ${currentTitle}`;
                updateFormUrl(); // 初始更新表單
            } else {
                document.getElementById('title-display').innerText = "未能取得題目資訊";
            }
        });
    });

    // 3. 渲染標籤按鈕的函式
    function renderTagButtons(tags) {
        const box = document.getElementById('tag-box');
        box.innerHTML = ''; // 清空載入中文字
        
        tags.forEach(tag => {
            const btn = document.createElement('div');
            btn.className = 'tag-btn';
            btn.innerText = tag;
            
            btn.addEventListener('click', () => {
                if (selectedTags.includes(tag)) {
                    // 如果已經選了，再點一次就取消
                    selectedTags = selectedTags.filter(t => t !== tag);
                    btn.classList.remove('selected');
                } else {
                    // 沒選過，加入清單
                    selectedTags.push(tag);
                    btn.classList.add('selected');
                }
                // 每次點擊標籤，都要同步更新下方的 Google 表單網址
                updateFormUrl();
            });
            box.appendChild(btn);
        });
    }

    // 4. 核心：把所有選中的東西打包塞進 iframe
    function updateFormUrl() {
        if (!currentId) return;

        const cleanId = encodeURIComponent(currentId);
        const cleanTitle = encodeURIComponent(currentTitle);
        // 把陣列裡的標籤用「逗號加空格」串起來，符合你原本表單紀錄的格式
        const cleanTags = encodeURIComponent(selectedTags.join(', '));

        // 拼接包含 題號、標題、選中標籤 的完整預填網址
        const finalFormUrl = `${baseUrl}&${idEntry}=${cleanId}&${tagEntry}=${cleanTags}`;
        
        // 刷新 Iframe
        document.getElementById('gform').src = finalFormUrl;
    }
});