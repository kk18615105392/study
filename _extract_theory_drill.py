# -*- coding: utf-8 -*-
"""
从《【理论讲练】政治理论&常识判断》抽取：
1) 黑体(SimHei)小标题/要点 → 挖空题
2) 【考场传真】【小黑母题特训】→ 选择题（答案来自书末参考答案）
3) 【考点精析】【知识延伸】→ 解析拓展
"""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

import fitz

ROOT = Path(r"c:\Users\崔泽坤\Desktop\data+new")
OUT_JS = Path(r"c:\Users\崔泽坤\Desktop\data+new\study\theory_drill_data.js")
OUT_JSON = Path(r"c:\Users\崔泽坤\Desktop\data+new\study\data\theory_drill_raw.json")
PDF = sorted(ROOT.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True)[0]

HEADER_NOISE = {"抖音关注公考小黑老师", "时政要点即时学"}
SECTION_MARKERS = ("【考场传真】", "【考点精析】", "【小黑母题特训】", "【知识延伸】")


def clean_ws(s: str) -> str:
    s = s.replace("\u3000", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def join_lines(text: str) -> str:
    """合并被换行打断的中文，保留段落。"""
    lines = [ln.strip() for ln in text.split("\n")]
    out, buf = [], ""
    for ln in lines:
        if not ln:
            if buf:
                out.append(buf)
                buf = ""
            out.append("")
            continue
        if re.match(r"^(?:【|（?[单多判]选）|\d+[\.、．]|[ABCDEFG][\.．、]|[一二三四五六七八九十]+、)", ln):
            if buf:
                out.append(buf)
            buf = ln
            continue
        if not buf:
            buf = ln
        elif buf[-1] in "。！？；：….!?;:”》」）)]":
            out.append(buf)
            buf = ln
        else:
            buf += ln
    if buf:
        out.append(buf)
    return "\n".join(out)


def make_id(prefix: str, *parts: str) -> str:
    raw = "|".join(parts)
    return f"{prefix}_{hashlib.md5(raw.encode('utf-8')).hexdigest()[:10]}"


def extract_page_spans(page) -> list[dict]:
    items = []
    d = page.get_text("dict")
    for b in d.get("blocks", []):
        if b.get("type") != 0:
            continue
        for line in b.get("lines", []):
            for span in line.get("spans", []):
                text = span.get("text", "")
                if not text.strip():
                    continue
                items.append(
                    {
                        "text": text,
                        "font": span.get("font", ""),
                        "size": round(span.get("size", 0), 1),
                        "hei": "SimHei" in span.get("font", ""),
                    }
                )
    return items


def page_plain(spans: list[dict]) -> str:
    # group roughly by concatenating
    return "".join(s["text"] for s in spans)


def build_pages(doc) -> list[dict]:
    pages = []
    for i in range(doc.page_count):
        spans = extract_page_spans(doc[i])
        text = doc[i].get_text("text")
        # drop running headers/footers lines
        lines = []
        for ln in text.split("\n"):
            s = ln.strip()
            if not s or s in HEADER_NOISE:
                continue
            if re.fullmatch(r"\d{1,3}", s):
                continue
            lines.append(s)
        pages.append({"i": i, "text": "\n".join(lines), "spans": spans})
    return pages


def find_answer_start(pages: list[dict]) -> int:
    for p in pages:
        if "参考答案" in p["text"][:80] or re.search(r"(?m)^参考答案\s*$", p["text"]):
            return p["i"]
    for p in pages:
        if "参考答案" in p["text"]:
            return p["i"]
    return len(pages)


def parse_answers(answer_text: str) -> dict:
    """
    返回 key -> {exam: 'C', drills: ['A','C']}
    key 形式尽量用 篇章/章节/知识点N 或 节名
    """
    text = answer_text.replace("答案\n", "\n答案\n")
    # 统一
    text = re.sub(r"答案\s*", "\n答案\n", text)
    blocks = re.split(r"(?=知识点\s*\d+|第[一二三四五六七八九十]+节)", text)
    result = {}
    ctx_chapter = ""
    ctx_section = ""
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        if m := re.match(r"(第[一二三四五六七八九十]+章\s*\S+)", block):
            ctx_chapter = re.sub(r"\s+", "", m.group(1))
        if m := re.match(r"(第[一二三四五六七八九十]+节\s*[^\n答案【]+)", block):
            ctx_section = re.sub(r"\s+", "", m.group(1))
        kp_m = re.match(r"知识点\s*(\d+)", block)
        sec_m = re.match(r"(第[一二三四五六七八九十]+节[^\n答案【]*)", block)

        exam = None
        drills = []
        if m := re.search(r"【考场传真】\s*([A-G])", block):
            exam = m.group(1)
        if m := re.search(r"【小黑母题特训】\s*(\d+\s*[-—–]\s*\d+\s*[：:]\s*[A-G]+|[A-G](?:\s*[A-G])*)", block):
            raw = m.group(1)
            if ":" in raw or "：" in raw:
                letters = re.split(r"[：:]", raw)[-1]
                drills = list(re.sub(r"\s+", "", letters))
            else:
                drills = list(re.sub(r"[\s、,，]", "", raw))
        # also 1-2：AC form
        if not drills and (m := re.search(r"母题特训】\s*\d+\s*[-—–]\s*\d+\s*[：:]\s*([A-G]+)", block)):
            drills = list(m.group(1))

        if kp_m:
            key = f"kp:{kp_m.group(1)}@{ctx_chapter}|{ctx_section}"
            result[key] = {"exam": exam, "drills": drills, "raw": block[:200]}
            # also short keys for sequential matching
            result.setdefault(f"kp_seq:{len([k for k in result if k.startswith('kp_seq:')])}", {"exam": exam, "drills": drills})
        elif sec_m and (exam or drills):
            key = f"sec:{re.sub(r'\\s+', '', sec_m.group(1))}"
            result[key] = {"exam": exam, "drills": drills, "raw": block[:200]}
    return result


def parse_answers_sequential(answer_text: str) -> list[dict]:
    """按出现顺序解析每个知识点/节的答案，便于与正文知识点顺序对齐。"""
    text = answer_text
    # 从参考答案后开始
    idx = text.find("参考答案")
    if idx >= 0:
        text = text[idx:]
    units = []
    # 切分：知识点N 或 第X节...答案
    parts = re.split(
        r"(?=(?:知识点\s*\d+|第[一二三四五六七八九十]+节))",
        text,
    )
    chapter = ""
    section = ""
    part_name = "政治理论"
    for part in parts:
        part = part.strip()
        if not part:
            continue
        if "第一部分" in part[:20]:
            part_name = "政治理论"
        if "第二部分" in part[:20]:
            part_name = "常识判断"
        if m := re.search(r"(第[一二三四五六七八九十]+篇[^\n]*)", part):
            pass
        if m := re.search(r"(第[一二三四五六七八九十]+章[^\n]*)", part):
            chapter = re.sub(r"\s+", "", m.group(1))[:40]
        if m := re.match(r"(第[一二三四五六七八九十]+节[^\n答案【]*)", part):
            section = re.sub(r"\s+", "", m.group(1))[:40]

        label = None
        if m := re.match(r"知识点\s*(\d+)", part):
            label = f"知识点{m.group(1)}"
        elif m := re.match(r"(第[一二三四五六七八九十]+节[^\n答案【]*)", part):
            label = re.sub(r"\s+", "", m.group(1))[:40]
        else:
            continue

        exam = None
        if m := re.search(r"【考场传真】\s*([A-G])", part):
            exam = m.group(1)
        drills = []
        if m := re.search(r"【小黑母题特训】\s*(?:(\d+)\s*[-—–]\s*(\d+)\s*[：:]\s*)?([A-G]+)", part):
            drills = list(m.group(3))
        elif m := re.search(r"【小黑母题特训】\s*([A-G])", part):
            drills = [m.group(1)]

        if exam or drills:
            units.append(
                {
                    "part": part_name,
                    "chapter": chapter,
                    "section": section,
                    "label": label,
                    "exam": exam,
                    "drills": drills,
                }
            )
    return units


def _update_running_meta(ln: str, meta: dict) -> None:
    """根据单行标题更新篇章元数据（顺序扫描全文用）。"""
    s = ln.strip()
    if not s:
        return
    if "第一部分" in s or s in ("政治理论", "第一部分政治理论"):
        if "常识" not in s:
            meta["part"] = "政治理论"
    if "第二部分" in s or s == "常识判断" or s.startswith("第二部分"):
        meta["part"] = "常识判断"
    # 篇/章可能跨行：第一篇\n《文史常识》
    if re.match(r"^第[一二三四五六七八九十]+篇", s):
        meta["pian"] = re.sub(r"\s+", "", s)[:50]
        meta["chapter"] = ""
        meta["_chap_pending"] = False
        meta["_pian_pending"] = bool(re.match(r"^第[一二三四五六七八九十]+篇\s*$", s))
    elif s.startswith("《") and s.endswith("》") and meta.get("_pian_pending"):
        meta["pian"] = (meta.get("pian", "") + s)[:50]
        meta["_pian_pending"] = False
    if re.match(r"^第[一二三四五六七八九十]+章", s):
        meta["chapter"] = re.sub(r"\s+", "", s)[:40]
        meta["_chap_pending"] = bool(re.match(r"^第[一二三四五六七八九十]+章\s*$", s))
    elif meta.get("_chap_pending") and 2 <= len(s) <= 20 and not s.startswith("【") and not s.startswith("知识点"):
        meta["chapter"] = (meta.get("chapter", "") + s)[:40]
        meta["_chap_pending"] = False


def split_knowledge_units(content_text: str) -> list[dict]:
    """按 知识点N / 第X节（且含考场传真）切分正文；篇章元数据按全文顺序追踪。"""
    text = content_text
    text = re.sub(r"(?m)^(抖音关注公考小黑老师|时政要点即时学)$\n?", "", text)
    lines = text.split("\n")

    # 先顺序扫描，记录每个单元起始行上的 meta
    unit_pat = re.compile(
        r"^(?:知识点\s*\d+\s+\S+|第[一二三四五六七八九十]+节\S+)"
    )
    starts: list[tuple[int, dict]] = []
    meta = {
        "part": "政治理论",
        "chapter": "",
        "section": "",
        "pian": "",
        "_pian_pending": False,
        "_chap_pending": False,
    }
    for i, ln in enumerate(lines):
        _update_running_meta(ln, meta)
        if unit_pat.match(ln.strip()):
            snap = {
                "part": meta["part"],
                "chapter": meta["chapter"],
                "section": meta["section"],
                "pian": meta["pian"],
            }
            starts.append((i, snap))

    units = []
    for idx, (start_i, snap) in enumerate(starts):
        end_i = starts[idx + 1][0] if idx + 1 < len(starts) else len(lines)
        part = "\n".join(lines[start_i:end_i]).strip()
        if not part:
            continue

        title_m = re.match(r"(知识点\s*\d+\s+[^\n]+)", part)
        sec_m = re.match(r"(第[一二三四五六七八九十]+节[^\n]+)", part)
        if not title_m and not sec_m:
            continue
        title = re.sub(r"\s+", "", (title_m or sec_m).group(1).strip())
        unit_meta = dict(snap)
        if sec_m:
            unit_meta["section"] = title

        # 必须含讲练结构，避免误切
        if "【考场传真】" not in part and "【考点精析】" not in part:
            continue

        sections = {"传真": "", "精析": "", "延伸": "", "特训": ""}
        chunks = re.split(r"(?=【考场传真】|【考点精析】|【知识延伸】|【小黑母题特训】)", part)
        for ch in chunks:
            ch = ch.strip()
            if ch.startswith("【考场传真】"):
                sections["传真"] = ch.replace("【考场传真】", "", 1).strip()
            elif ch.startswith("【考点精析】"):
                sections["精析"] = ch.replace("【考点精析】", "", 1).strip()
            elif ch.startswith("【知识延伸】"):
                sections["延伸"] = ch.replace("【知识延伸】", "", 1).strip()
            elif ch.startswith("【小黑母题特训】"):
                sections["特训"] = ch.replace("【小黑母题特训】", "", 1).strip()

        # 截断：避免吞进下一知识点
        for key in ("精析", "特训", "传真", "延伸"):
            sections[key] = re.split(
                r"(?m)^(?:知识点\s*\d+\s+\S+|第[一二三四五六七八九十]+节\S+)",
                sections[key],
            )[0].strip()

        units.append(
            {
                "title": title,
                "part": unit_meta["part"] or "政治理论",
                "pian": unit_meta["pian"],
                "chapter": unit_meta["chapter"],
                "section": unit_meta["section"],
                "传真": join_lines(sections["传真"]),
                "精析": join_lines(sections["精析"]),
                "延伸": join_lines(sections["延伸"]),
                "特训": join_lines(sections["特训"]),
            }
        )
    return units


def extract_hei_titles_from_spans(pages: list[dict], start: int, end: int) -> list[dict]:
    """提取正文黑体小标题（约10.4号，或以一、二、三开头）。"""
    titles = []
    for p in pages:
        if p["i"] < start or p["i"] >= end:
            continue
        # reconstruct lines with hei flags
        buf = ""
        buf_hei = False
        line_hei_text = []
        # simpler: scan spans sequentially, merge consecutive hei
        cur = ""
        for sp in p["spans"]:
            t = sp["text"]
            if sp["hei"] and 9.5 <= sp["size"] <= 11.5:
                if t.strip() in HEADER_NOISE or t.strip() in SECTION_MARKERS:
                    if cur.strip():
                        line_hei_text.append(cur.strip())
                        cur = ""
                    continue
                cur += t
            else:
                if cur.strip():
                    line_hei_text.append(cur.strip())
                    cur = ""
        if cur.strip():
            line_hei_text.append(cur.strip())
        for ht in line_hei_text:
            ht = re.sub(r"\s+", "", ht)
            if len(ht) < 4 or ht in SECTION_MARKERS:
                continue
            if ht.startswith("【") and ht.endswith("】"):
                continue
            titles.append({"page": p["i"] + 1, "text": ht})
    # dedupe preserve order
    seen = set()
    out = []
    for t in titles:
        if t["text"] in seen:
            continue
        seen.add(t["text"])
        out.append(t)
    return out


def parse_mcq_block(block: str) -> list[dict]:
    """解析传真/特训中的选择题。"""
    if not block:
        return []
    text = block.strip()
    # 拆题：以 （单选）/（多选）/（判断） 或 1.（单选） 开头
    pieces = re.split(r"(?=(?:(?:\d+[\.、．])?\s*（(?:单选|多选|判断)）))", text)
    questions = []
    for piece in pieces:
        piece = piece.strip()
        if not piece:
            continue
        tm = re.match(r"(?:(\d+)[\.、．])?\s*（(单选|多选|判断)）\s*", piece)
        if not tm:
            # 传真可能无序号，直接（单选）
            if not re.search(r"（(?:单选|多选|判断)）", piece[:20]) and not re.match(r"（(?:单选|多选|判断)）", piece):
                # maybe starts without paren type - skip unless has A．
                if not re.search(r"A[\.．、]", piece):
                    continue
            qtype_raw = "单选"
            stem_start = 0
            num = None
        else:
            num = int(tm.group(1)) if tm.group(1) else None
            qtype_raw = tm.group(2)
            stem_start = tm.end()

        rest = piece[stem_start:] if tm else piece
        # strip leading type if present
        rest = re.sub(r"^（(?:单选|多选|判断)）\s*", "", rest)
        opt_m = list(re.finditer(r"(?m)^([A-G])[\.．、]\s*", rest))
        if not opt_m:
            # options may be inline
            opt_m = list(re.finditer(r"(?:(?<=\s)|(?<=\n)|^)([A-G])[\.．、]\s*", rest))
        if len(opt_m) < 2:
            continue
        stem = rest[: opt_m[0].start()].strip()
        stem = join_lines(stem)
        options = []
        for i, m in enumerate(opt_m):
            start = m.end()
            end = opt_m[i + 1].start() if i + 1 < len(opt_m) else len(rest)
            opt = join_lines(rest[start:end].strip())
            opt = re.sub(r"\s+", "", opt) if len(opt) < 40 else opt
            options.append(opt)
        if len(options) < 2 or len(stem) < 8:
            continue
        qtype = {"单选": "single", "多选": "multiple", "判断": "judgement"}.get(qtype_raw, "single")
        if qtype == "judgement" and len(options) == 0:
            options = ["正确", "错误"]
        questions.append(
            {
                "num": num,
                "type": qtype,
                "stem": stem,
                "options": options[:6],
            }
        )
    return questions


def _cloze_answer_ok(a: str) -> bool:
    if not a or a in HEADER_NOISE:
        return False
    if a in ("新时代", "中国", "人民", "发展", "国家", "社会", "我们党"):
        return False
    if not (2 <= len(a) <= 16):
        return False
    if "是" in a or "（" in a or "(" in a or "、" in a:
        return False
    if re.search(r"[：:；;]", a):
        return False
    return True


def pick_cloze_blanks(analysis: str, hei_titles: list[str]) -> list[dict]:
    """
    从考点精析生成挖空：
    - 优先挖黑体小标题中的核心短语（若出现在正文）
    - 挖书名号/引号内固定表述
    - 挖“……是……”定义句中的关键概念
    """
    if not analysis:
        return []
    blanks = []
    flat = analysis.replace("\n", "")

    # 1) quoted fixed phrases
    for m in re.finditer(r"[“\"]([^”\"“]{2,16})[”\"]", analysis):
        term = m.group(1).strip()
        if term in ("四个意识", "四个自信", "两个维护", "两个结合", "两个确立") or re.match(
            r".*(明确|坚持|成就|必须|意识|自信|维护|布局|矛盾|现代化|复兴).*", term
        ):
            if _cloze_answer_ok(term):
                blanks.append({"answer": term, "kind": "quote"})

    # 2) hei titles appearing in text (strip 一、) — 只要短提纲
    for ht in hei_titles:
        core = re.sub(r"^[一二三四五六七八九十]+、", "", ht)
        core = re.sub(r"^[（(]\d+[）)]", "", core)
        core = re.split(r"[（(]", core)[0].strip()
        if _cloze_answer_ok(core) and core in flat:
            blanks.append({"answer": core, "kind": "hei"})

    # 3) definitional sentences — 只挖较短关键概念
    for sent in re.split(r"(?<=[。！？])", analysis):
        sent = sent.strip().replace("\n", "")
        if len(sent) < 12 or len(sent) > 100:
            continue
        m = re.search(r"^(.{2,16}?)是(.{4,28}?)[。．]$", sent)
        if not m:
            continue
        left, right = m.group(1), m.group(2)
        for cand in (left, right):
            cand = cand.strip("，,、 ")
            if not _cloze_answer_ok(cand):
                continue
            if any(
                k in cand
                for k in (
                    "核心要义",
                    "本质特征",
                    "最大优势",
                    "总任务",
                    "总目标",
                    "基本依据",
                    "根本保证",
                    "根本目的",
                    "主体内容",
                    "世界观",
                    "方法论",
                    "主要矛盾",
                    "战略布局",
                    "总体布局",
                    "首要任务",
                    "中心任务",
                )
            ):
                blanks.append({"answer": cand, "kind": "def", "sentence": sent})
                break

    # dedupe
    seen = set()
    out = []
    for b in blanks:
        a = b["answer"]
        if a in seen or not _cloze_answer_ok(a):
            continue
        seen.add(a)
        out.append(b)
    return out[:12]


def make_cloze_question(sentence: str, answer: str) -> str | None:
    flat = sentence.replace("\n", "")
    if answer not in flat:
        return None
    # only one blank
    q = flat.replace(answer, "______", 1)
    if q == flat:
        return None
    return q


def build_explanation(unit: dict, extra: str = "") -> str:
    parts = []
    if unit.get("精析"):
        # keep first ~500 chars of analysis as core, plus 延伸
        core = unit["精析"]
        if len(core) > 700:
            core = core[:700] + "…"
        parts.append("【考点精析】\n" + core)
    if unit.get("延伸"):
        ext = unit["延伸"]
        if len(ext) > 400:
            ext = ext[:400] + "…"
        parts.append("【知识延伸】\n" + ext)
    if extra:
        parts.append(extra)
    return "\n\n".join(parts)


def category_id(part: str, chapter: str, pian: str = "", title: str = "") -> str:
    blob = f"{part}|{pian}|{chapter}|{title}"
    # 常识：按篇/章/题名
    if part == "常识判断" or "常识" in pian or "常识" in chapter:
        if any(k in blob for k in ("法律", "法理", "宪法", "民法", "刑法", "行政法", "诉讼法")):
            return "common_law"
        if any(
            k in blob
            for k in (
                "科技",
                "物理",
                "化学",
                "生物",
                "力学",
                "热力学",
                "光学",
                "声学",
                "杠杆",
                "非金属",
                "地理",
                "天文",
            )
        ):
            return "common_science"
        if any(
            k in blob
            for k in (
                "文史",
                "历史",
                "文学",
                "文化",
                "古代",
                "汉字",
                "书法",
                "绘画",
                "戏曲",
                "节日",
                "考古",
                "战役",
            )
        ):
            return "common_culture"
        return "common_other"
    # 政治理论
    if any(k in blob for k in ("马克思", "马原", "辩证唯物", "历史唯物", "剩余价值", "唯物辩证", "对立统一")):
        return "marxism"
    if any(k in blob for k in ("毛泽东", "邓论", "邓小平", "三个代表", "科学发展观", "毛概", "中国特色社会主义理论体系概述")):
        return "mao_deng"
    if any(k in blob for k in ("党史", "党建", "中共党史", "新民主主义", "改革开放史")):
        return "party_history"
    if any(
        k in blob
        for k in (
            "习近平",
            "习思想",
            "中国式现代化",
            "两个结合",
            "十个明确",
            "十四个坚持",
            "总论",
            "分论",
        )
    ):
        return "xjp_thought"
    return "theory_other"


def category_name(cid: str) -> str:
    return {
        "xjp_thought": "习思想精讲",
        "marxism": "马原辩证唯物",
        "mao_deng": "毛概邓论科发",
        "party_history": "党史党建",
        "theory_other": "政治理论其他",
        "common_law": "常识·法律",
        "common_culture": "常识·文史文化",
        "common_science": "常识·科技",
        "common_other": "常识·其他",
    }.get(cid, "理论讲练")


def main():
    print("PDF:", PDF.name)
    doc = fitz.open(PDF)
    pages = build_pages(doc)
    ans_i = find_answer_start(pages)
    print("answer start page", ans_i + 1)

    # 正文从第11页起（跳过封面/目录），至参考答案前
    content_text = "\n".join(p["text"] for p in pages if 10 <= p["i"] < ans_i)
    answer_text = "\n".join(p["text"] for p in pages if p["i"] >= ans_i)
    OUT_JSON.parent.mkdir(exist_ok=True)

    answer_units = parse_answers_sequential(answer_text)
    print("answer units", len(answer_units))

    knowledge_units = split_knowledge_units(content_text)
    print("knowledge units", len(knowledge_units))

    # hei titles globally in content
    hei_all = extract_hei_titles_from_spans(pages, 11, ans_i)
    print("hei titles", len(hei_all))

    questions = []
    facts = []
    ans_idx = 0

    # 只把「有传真或特训」的单元与答案顺序对齐
    answerable = [u for u in knowledge_units if u["传真"] or u["特训"]]
    print("answerable units", len(answerable), "vs answers", len(answer_units))

    for ui, unit in enumerate(knowledge_units):
        ans = {"exam": None, "drills": []}
        if unit["传真"] or unit["特训"]:
            if ans_idx < len(answer_units):
                ans = answer_units[ans_idx]
                ans_idx += 1

        cat = category_id(unit["part"], unit["chapter"], unit["pian"], unit["title"])
        cat_name = category_name(cat)
        source = " / ".join(x for x in [unit["part"], unit["pian"], unit["chapter"], unit["section"], unit["title"]] if x)

        # ---- cloze from hei + analysis ----
        # local hei titles: those that appear as lines in 精析 beginning with 一、
        local_hei = re.findall(r"(?m)^([一二三四五六七八九十]+、[^\n]{2,40})$", unit["精析"])
        local_hei += [h["text"] for h in hei_all if h["text"] in unit["精析"].replace("\n", "")]
        blank_specs = pick_cloze_blanks(unit["精析"], local_hei)

        # also create outline cloze from local hei titles themselves（短标题）
        for ht in local_hei:
            core = re.sub(r"^[一二三四五六七八九十]+、", "", ht)
            core = re.split(r"[（(]", core)[0].strip()
            if _cloze_answer_ok(core):
                blank_specs.append(
                    {
                        "answer": core,
                        "kind": "outline",
                        "sentence": f"本知识点黑体提纲：{ht}。请写出：{core}",
                    }
                )

        # dedupe answers
        seen_ans = set()
        cloze_n = 0
        for spec in blank_specs:
            if cloze_n >= 6:
                break
            answer = spec["answer"]
            if answer in seen_ans:
                continue
            seen_ans.add(answer)
            # prefer sentence containing answer
            sentence = spec.get("sentence")
            if not sentence:
                # find a sentence in analysis
                for sent in re.split(r"(?<=[。！？])", unit["精析"]):
                    if answer in sent.replace("\n", "") and len(sent) >= 10:
                        sentence = sent.strip()
                        break
            if not sentence:
                sentence = f"请写出黑体要点：______。（提示：属于「{unit['title']}」）"
                prompt = sentence
            else:
                prompt = make_cloze_question(sentence, answer)
                if not prompt:
                    prompt = f"请补全黑体要点：______\n完整表述：{sentence.replace(answer, '______')}"
            # ensure blank exists
            if "______" not in prompt:
                prompt = prompt.replace(answer, "______", 1) if answer in prompt else f"{prompt}\n补全：______"

            expl = build_explanation(
                unit,
                extra=f"【挖空提示】本题挖空对应讲义黑体/核心表述「{answer}」。建议结合上下文识记，避免孤立背词。",
            )
            questions.append(
                {
                    "id": make_id("tf", unit["title"], answer, str(cloze_n)),
                    "type": "fill",
                    "category": cat,
                    "categoryName": cat_name,
                    "question": prompt,
                    "options": [],
                    "answer": [answer],
                    "explanation": expl,
                    "source": source,
                    "knowledgeTitle": unit["title"],
                    "drillType": "cloze",
                    "tags": ["黑体挖空", unit["part"], cat_name],
                }
            )
            cloze_n += 1

        # ---- MCQ 考场传真 ----
        exam_qs = parse_mcq_block(unit["传真"])
        for qi, mq in enumerate(exam_qs):
            if qi > 0:
                # 答案速查通常每知识点仅给1个考场传真答案
                break
            letter = ans.get("exam")
            if not letter:
                continue
            answer_val = letter
            qtype = "single" if mq["type"] != "judgement" else "judgement"
            max_letter = chr(64 + len(mq["options"]))
            if answer_val > max_letter:
                continue
            # 用精析首句校验：若答案选项完全不出现在精析，仍保留（干扰项题），但记录
            expl = build_explanation(
                unit,
                extra=f"【题目来源】考场传真 · {unit['title']}\n【正确答案】{answer_val}\n"
                f"请回到考点精析中定位与选项对应的原句，理解『为什么对/为什么错』，而不是只记字母。",
            )
            questions.append(
                {
                    "id": make_id("te", unit["title"], mq["stem"][:40], answer_val),
                    "type": qtype,
                    "category": cat,
                    "categoryName": cat_name,
                    "question": mq["stem"],
                    "options": mq["options"],
                    "answer": answer_val,
                    "explanation": expl,
                    "source": source,
                    "knowledgeTitle": unit["title"],
                    "drillType": "exam",
                    "tags": ["考场传真", unit["part"], cat_name],
                }
            )

        # ---- MCQ 母题特训 ----
        drill_qs = parse_mcq_block(unit["特训"])
        drill_ans = ans.get("drills") or []
        for qi, mq in enumerate(drill_qs):
            if qi >= len(drill_ans):
                break
            letter = drill_ans[qi]
            max_letter = chr(64 + len(mq["options"]))
            if letter > max_letter:
                continue
            qtype = mq["type"]
            answer_val = letter
            if qtype == "multiple":
                # 答案速查按题给单字母；若题型多选但只给一字母，仍按单选处理以免错
                qtype = "single"
            expl = build_explanation(
                unit,
                extra=f"【题目来源】小黑母题特训 第{qi+1}题 · {unit['title']}\n【正确答案】{letter}\n"
                f"拓展：对照考点精析中的黑体提纲与关键表述，梳理每个干扰项错在何处（偷换概念/时空错位/绝对化表述）。",
            )
            questions.append(
                {
                    "id": make_id("td", unit["title"], mq["stem"][:40], letter),
                    "type": qtype,
                    "category": cat,
                    "categoryName": cat_name,
                    "question": mq["stem"],
                    "options": mq["options"],
                    "answer": answer_val,
                    "explanation": expl,
                    "source": source,
                    "knowledgeTitle": unit["title"],
                    "drillType": "drill",
                    "tags": ["母题特训", unit["part"], cat_name],
                }
            )

        # fact card from first hei outline + summary
        if unit["精析"]:
            summary = unit["精析"][:180].replace("\n", "")
            facts.append(
                {
                    "title": unit["title"][:40],
                    "cat": cat,
                    "content": summary + ("…" if len(unit["精析"]) > 180 else ""),
                }
            )

    # categories present
    cat_map = {}
    for q in questions:
        cat_map[q["category"]] = q["categoryName"]
    categories = [{"id": k, "name": v} for k, v in cat_map.items()]

    # interleave already natural: cloze then exam then drills per unit

    payload = {
        "name": "理论讲练·挖空",
        "icon": "理",
        "categories": categories,
        "facts": facts,
        "questions": questions,
        "meta": {
            "sourcePdf": PDF.name,
            "total": len(questions),
            "knowledgeUnits": len(knowledge_units),
            "answerUnits": len(answer_units),
            "cloze": sum(1 for q in questions if q["drillType"] == "cloze"),
            "exam": sum(1 for q in questions if q["drillType"] == "exam"),
            "drill": sum(1 for q in questions if q["drillType"] == "drill"),
            "note": "挖空优先取讲义SimHei黑体提纲与核心表述；选择题答案严格对齐书末参考答案，无答案题目不入库。",
        },
    }

    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    js = (
        "// 理论讲练挖空+选择题库（由【理论讲练】政治理论&常识判断 PDF 抽取）\n"
        "// 重新生成: python _extract_theory_drill.py\n"
        "const THEORY_DRILL_DATA = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n\n"
        "if (typeof SUBJECT_DATA !== 'undefined') {\n"
        "  SUBJECT_DATA.theory_drill = THEORY_DRILL_DATA;\n"
        "}\n"
    )
    OUT_JS.write_text(js, encoding="utf-8")
    print("questions", payload["meta"])
    print("wrote", OUT_JS)


if __name__ == "__main__":
    main()
