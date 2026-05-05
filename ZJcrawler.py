import time
import requests
from bs4 import BeautifulSoup



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

        span = soup.find("div", class_="problembox")
        source = [a.text.strip() for a in span.find_all("a")]
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

a = get_problem('d050')
print(a)