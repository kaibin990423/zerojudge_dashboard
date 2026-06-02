from collections import Counter
import json

# 1. 設定輸入與輸出檔案路徑
input_file = "result.json"
output_file = "analysis_report.txt"

try:
    # 2. 讀取 JSON 檔案
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    tag_counter = Counter()
    source_counter = Counter()

    # 3. 走訪每題資料並清理、統計
    for item in data:
        # 統計標籤 (清除前後空白)
        if "tags" in item and isinstance(item["tags"], list):
            for tag in item["tags"]:
                clean_tag = tag.strip()
                if clean_tag:  # 確保不是空字串
                    tag_counter[clean_tag] += 1

        # 統計出處 (清除前後空白與換行符號)
        if "source" in item and isinstance(item["source"], list):
            for source in item["source"]:
                clean_source = source.strip()
                if clean_source:  # 確保不是空字串
                    source_counter[clean_source] += 1

    # 4. 將統計結果寫入文字檔 (使用 utf-8 編碼確保中文不亂碼)
    with open(output_file, "w", encoding="utf-8") as out:
        out.write("=========================================\n")
        out.write("         result.json 統計分析報告         \n")
        out.write("=========================================\n\n")

        # 寫入標籤統計結果
        out.write(f"=== 標籤 (Tags) 出現數量統計 (總計 {len(tag_counter)} 種) ===\n")
        for tag, count in tag_counter.most_common():
            out.write(f"{tag}:{count}\n")

        out.write("\n" + "="*40 + "\n\n")

        # 寫入出處統計結果
        out.write(f"=== 出處 (Source) 出現數量統計 (總計 {len(source_counter)} 種) ===\n")
        for source, count in source_counter.most_common():
            out.write(f"{source}:{count}\n")

    print(f"【分析完成】結果已成功儲存至文字檔：'{output_file}'")

except FileNotFoundError:
    print(f"錯誤：找不到檔案 '{input_file}'，請確認檔案路徑是否正確。")
except json.JSONDecodeError:
    print("錯誤：檔案格式不是正確的 JSON。")