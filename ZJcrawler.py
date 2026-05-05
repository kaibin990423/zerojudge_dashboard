import time
import json
import os
import requests
from bs4 import BeautifulSoup

SAVE_INTERVAL = 100
OUTPUT_FILE = "result.json"

# 如果已經有舊檔 → 讀進來（續跑關鍵🔥）
if os.path.exists(OUTPUT_FILE):
    with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
        problems = json.load(f)
else:
    problems = []

# 建立已抓過的ID集合（避免重抓）
done_ids = set(p["id"] for p in problems)


def get_problem(pid):
    url = f"https://zerojudge.tw/ShowProblem?problemid={pid}"
    print(url)
    
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    
    try:
        res = requests.get(url, headers=headers, timeout=10)
        # print(res.status_code)
        if res.status_code != 200:
            return None
        # print(res.text)
        soup = BeautifulSoup(res.text, "html.parser")
        
        title = soup.find("title").text.strip()
        content = soup.get_text()
        # print(content)
        span = soup.find("span", class_="tag")
        tags = [a.text.strip() for a in span.find_all("a")]
        # print(tags)
        span = soup.find("span", title="解題統計")
        passrate = [a.text.strip() for a in span.find_all("a")]

       
        # 找到 span id="reference"
        span = soup.find("span", id="reference")

        # 抓裡面所有 a 的文字
       
        if span==None:
            source=[]
        else:
            source = [a.text.strip() for a in span.find_all("a")]
        print(source)
        return {
            "id": pid,
            "title": title,
            "tags":tags,
            "passrate": passrate,
            "source": source
            # "content": content
        }
    
    except:
        return None


# 讀取題號清單
with open("list.txt", "r") as f:
    ids = [line.strip() for line in f if line.strip()]


count = 0

for pid in ids:
    # ✅ 跳過已抓過的
    if pid in done_ids:
        print("略過:", pid)
        continue
    
    data = get_problem(pid)
    
    if data:
        problems.append(data)
        done_ids.add(pid)
        count += 1
    
    # ✅ 每100筆存檔
    if count % SAVE_INTERVAL == 0:
        print(f"💾 已存 {len(problems)} 筆")
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(problems, f, ensure_ascii=False, indent=2)
    
    time.sleep(1)

# 最後再存一次
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(problems, f, ensure_ascii=False, indent=2)

print("✅ 完成！")
