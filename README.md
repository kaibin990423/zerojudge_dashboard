# zerojudge_dashboard
## 取得題目列表
- 使用JavaScript對題目列表頁面(https://zerojudge.tw/UserStatistic)
```js
const linksText = Array.from(document.querySelectorAll('a'))
  .map(a => a.textContent.trim());

// 把內容轉成文字（每行一個）
const content = linksText.join('\n');

// 建立 Blob
const blob = new Blob([content], { type: 'text/plain' });

// 建立下載連結
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'links.txt';

// 觸發下載
a.click();

// 釋放記憶體
URL.revokeObjectURL(a.href);
```
## 取得題目資訊
-標題、標籤、通過比率、出處(作者)

