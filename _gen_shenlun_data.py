# -*- coding: utf-8 -*-
"""将 miniprogram_data/questions.json 转为京通 SUBJECT_DATA 挂载文件。"""
import json
from pathlib import Path

SRC = Path(r"c:\Users\崔泽坤\Desktop\data+new\miniprogram_data\questions.json")
OUT = Path(r"c:\Users\崔泽坤\Desktop\data+new\study\shenlun_practice_data.js")

CAT_MAP = {
    "单一题": ("danyi", "单一题"),
    "综合题": ("zonghe", "综合题"),
    "公文题": ("gongwen", "公文题"),
    "作文题": ("zuowen", "作文题"),
}

data = json.loads(SRC.read_text(encoding="utf-8"))
questions = []
for q in data["questions"]:
    cat_id, cat_name = CAT_MAP.get(q["category"], ("other", q["category"]))
    questions.append(
        {
            "id": q["id"],
            "type": "essay",
            "category": cat_id,
            "categoryName": cat_name,
            "question": q["stem"],
            "stem": q["stem"],
            "title": q.get("title") or q["stem"][:36],
            "source": q.get("source") or "",
            "requirements": q.get("requirements") or "",
            "materials": q.get("materials") or "",
            "answer": q.get("answer") or "",
            "keyPoints": q.get("keyPoints") or [],
            "analysis": q.get("analysis") or "",
            "reviewTips": q.get("reviewTips") or "",
            "score": q.get("score"),
            "wordLimit": q.get("wordLimit") or "",
            "difficulty": q.get("difficulty") or 3,
            "tags": q.get("tags") or [cat_name],
            "answerNote": q.get("answerNote") or "",
            "explanation": (q.get("reviewTips") or "")
            + (("\n\n" + q["analysis"]) if q.get("analysis") else ""),
        }
    )

categories = [
    {"id": "danyi", "name": "单一题"},
    {"id": "zonghe", "name": "综合题"},
    {"id": "gongwen", "name": "公文题"},
    {"id": "zuowen", "name": "作文题"},
]

facts = [
    {
        "title": "单一题高分口诀",
        "cat": "danyi",
        "content": "材料顺序分层 + 前置词分类。做法找动词短语，概括题优先摘抄标志词，字数不够再归纳。",
    },
    {
        "title": "综合题作答框架",
        "cat": "zonghe",
        "content": "词句理解：释义→相关要素（问题/原因/影响）→对策。认识类题目观点明确，总分结构。",
    },
    {
        "title": "公文题格式提醒",
        "cat": "gongwen",
        "content": "先定文种格式（标题/称谓/落款），再按材料逻辑分层写正文。讲话稿注重口语串联，少标序号。",
    },
    {
        "title": "作文题破题步骤",
        "cat": "zuowen",
        "content": "先定主题与分论点，再回材料找论据。标题含主题词，开头点题，主体对策/分析展开，结尾升华。",
    },
]

payload = {
    "name": "申论分项刷题",
    "icon": "申",
    "categories": categories,
    "facts": facts,
    "questions": questions,
    "meta": {
        "total": len(questions),
        "updatedAt": data.get("updatedAt"),
        "description": data.get("description"),
    },
}

js = (
    "// 申论分项刷题题库（由 PDF 抽取生成，供京通 SUBJECT_DATA 挂载）\n"
    "// 重新生成: python _gen_shenlun_data.py\n"
    "const SHENLUN_PRACTICE_DATA = "
    + json.dumps(payload, ensure_ascii=False, indent=2)
    + ";\n\n"
    "if (typeof SUBJECT_DATA !== 'undefined') {\n"
    "  SUBJECT_DATA.shenlun_practice = SHENLUN_PRACTICE_DATA;\n"
    "}\n"
)
OUT.write_text(js, encoding="utf-8")
print("wrote", OUT, "questions", len(questions), "bytes", OUT.stat().st_size)
