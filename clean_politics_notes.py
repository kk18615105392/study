#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
清洗 时事政治精简笔记.json 中的讲义批注符号，生成干净的 时事政治精简笔记_cleaned.json
"""
import json
import re

INPUT_FILE = "data/时事政治精简笔记.json"
OUTPUT_FILE = "data/时事政治精简笔记_cleaned.json"

ANNOTATION_WORDS = ["挖坑", "Y", "T", "v", "L", "M", "W", "X"]


def is_annotation_line(line: str) -> bool:
    s = line.strip()
    if not s:
        return True
    # 纯符号/数字/中文序号
    if re.match(r"^[①②③④⑤⑥⑦⑧⑨⑩0-9\s\.·\-\~&\n\r]+$", s):
        return True
    # 单个字符或极短
    if len(s) <= 2:
        return True
    # 挖坑开头
    if s.startswith("挖坑：") or s.startswith("挖坑:"):
        return True
    # 单独的批注字母
    if s in ANNOTATION_WORDS:
        return True
    # 日期数字串，如 "2025 2030 4"
    if re.match(r"^\d{2,4}(\s+\d{2,4})+$", s):
        return True
    # "开局五年" / "冲刺五年"
    if re.match(r"^(开局|冲刺)\s*五年$", s):
        return True
    # 包含明显批注关键词
    if re.search(r"挖坑|改成|是错误的|错误$|相关词|Y[A-Za-z\u4e00-\u9fff]", s):
        return True
    # 明显是旁注/知识链接的短行
    if re.match(r"^(内需|外需|消费|投资|出口|进口|相关词|拉动经济|三驾马车)", s):
        return True
    # 短行且含批注性词汇
    if len(s) <= 12 and re.search(
        r"错误|改成|Y|T|v|L|M|W|贴息|降低|提高|刚性|柔性|治权|授权|用权|"
        r"中小微企业|国有企业|大型上市公|新贷款|优质服务",
        s,
    ):
        return True
    return False


def remove_inline_annotations(text: str) -> str:
    # 去除 "挖坑：..."
    text = re.sub(r"挖坑[：:]\s*[^\n]*", "", text)
    # 去除行尾批注字母
    text = re.sub(r"\s*[YTvWLM](?=[\u4e00-\u9fff]|$)", "", text)
    # 去除首尾零碎符号
    text = re.sub(r"[\-\~&\·\s]+$", "", text)
    text = re.sub(r"^[\-\~&\·\s]+", "", text)
    return text.strip()


def clean_reciting_points(points: list) -> list:
    # 第一步：收集所有非批注行，并做行内清洗
    valid_lines = []
    for p in points:
        for line in p.split("\n"):
            line = line.strip()
            if is_annotation_line(line):
                continue
            line = remove_inline_annotations(line)
            # 去除行内 Y/T 等批注字母
            line = re.sub(r"(?<=[\u4e00-\u9fff])\s*[YTvWLM]\s*(?=[\u4e00-\u9fff]|$)", "", line)
            # 去除已知批注残片
            line = re.sub(
                r"(?<=[\u4e00-\u9fff])(国有企业或|大型上市公|自然保护体系以国家公园为|主体，以自然保护区为基础|拉动经济的三驾马车)$",
                "",
                line,
            )
            line = line.strip()
            if not line or len(line) < 5:
                continue
            valid_lines.append(line)

    # 第二步：拼接并按句末标点切分，保留完整句子
    full_text = "".join(valid_lines)
    # 去掉行首的结构序号
    full_text = re.sub(r"^[①②③④⑤⑥⑦⑧⑨⑩\s]+", "", full_text)
    # 去除已知独立批注短语（句首/句中残片）
    full_text = re.sub(r"^(拉动经济的三驾马车|外需：出口|内需：消费和投资)\s*", "", full_text)
    full_text = re.sub(r"(?<=[。！？；\.\s])(拉动经济的三驾马车|外需：出口|内需：消费和投资)\s*", "", full_text)
    # 按句末标点切分
    sentences = re.split(r"(?<=[。！？；\.])\s*", full_text)
    cleaned = []
    for s in sentences:
        s = s.strip()
        if len(s) < 12:
            continue
        # 去除句子内部的行首序号
        s = re.sub(r"\n\s*[①②③④⑤⑥⑦⑧⑨⑩]\s*", "", s)
        s = s.replace("\n", "")
        if len(s) >= 12:
            cleaned.append(s)
    return cleaned


def clean_question_text(text: str) -> str:
    lines = text.split("\n")
    cleaned_lines = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # 单独答案字母
        if re.match(r"^[A-D]$", line):
            continue
        # 纯符号行
        if re.match(r"^[\-\~&]+$", line):
            continue
        # 单独批注字母
        if line in ANNOTATION_WORDS:
            continue
        line = re.sub(r"挖坑[：:]\s*[^\n]*", "", line)
        line = re.sub(r"\s+[A-D]$", "", line)
        line = re.sub(r"\s*[\-\~&]+$", "", line)
        line = re.sub(r"\s*[①②③④⑤⑥⑦⑧⑨⑩]\s*[\-\~&]?$", "", line)
        # 单独的结构序号
        if re.match(r"^[①②③④⑤⑥⑦⑧⑨⑩]\s*[\-\~&]?$", line):
            continue
        line = line.strip()
        if line:
            cleaned_lines.append(line)
    return "\n".join(cleaned_lines)


def clean_option(opt: str) -> str:
    lines = opt.split("\n")
    cleaned_lines = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # 纯符号/数字/批注字母行
        if re.match(r"^[\-\~&\s]+$|^[0-9]+$|^" + "|".join(ANNOTATION_WORDS) + r"$", line):
            continue
        # 短批注行
        if len(line) <= 8 and re.search(
            r"错误|改成|Y|T|v|L|M|W|贴息|降低|提高|刚性|柔性|治权|授权|用权|"
            r"中小微企业|国有企业|大型上市公|新贷款|优质服务",
            line,
        ):
            continue
        line = re.sub(r"挖坑[：:]\s*[^\n]*", "", line)
        line = re.sub(r"\s*[\-\~&]+$", "", line)
        line = re.sub(r"\s*[YTvWLM]$", "", line)
        line = line.strip()
        if line:
            cleaned_lines.append(line)
    return "\n".join(cleaned_lines)


def clean_data(raw_data: list) -> list:
    cleaned_months = []
    for month_data in raw_data:
        cleaned_items = []
        for item in month_data.get("news_items", []):
            cleaned_item = {
                "index": item.get("index"),
                "title": item.get("title", "").strip(),
                "importance": item.get("importance", "").strip(),
                "category": item.get("category", "").strip(),
                "filename": item.get("filename", "").strip(),
                "reciting_points": clean_reciting_points(item.get("reciting_points", [])),
                "questions": [],
            }
            for q in item.get("questions", []):
                cleaned_q = {
                    "question_number": q.get("question_number"),
                    "question_text": clean_question_text(q.get("question_text", "")),
                    "options": [clean_option(o) for o in q.get("options", [])],
                    "answer": str(q.get("answer", "")).strip(),
                    "explanation": q.get("explanation", "").strip(),
                }
                # 去掉空选项
                cleaned_q["options"] = [o for o in cleaned_q["options"] if o]
                cleaned_item["questions"].append(cleaned_q)
            cleaned_items.append(cleaned_item)
        cleaned_months.append({
            "month": month_data.get("month", "").strip(),
            "filename": month_data.get("filename", "").strip(),
            "summary": month_data.get("summary", "").strip(),
            "news_items": cleaned_items,
        })
    return cleaned_months


def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    cleaned_data = clean_data(raw_data)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(cleaned_data, f, ensure_ascii=False, indent=2)

    print(f"清洗完成：{OUTPUT_FILE}")
    # 简单统计
    total_news = sum(len(m["news_items"]) for m in cleaned_data)
    total_q = sum(
        len(n["questions"]) for m in cleaned_data for n in m["news_items"]
    )
    print(f"月份：{len(cleaned_data)}，新闻：{total_news}，题目：{total_q}")


if __name__ == "__main__":
    main()
