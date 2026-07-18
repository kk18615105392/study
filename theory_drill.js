// 理论讲练·挖空模块：黑体挖空 + 考场传真/母题特训穿插
(function () {
  function isTheoryDrill() {
    return typeof currentSubject !== "undefined" && currentSubject === "theory_drill";
  }

  function poolByKind(kind) {
    const all = (SUBJECT_DATA.theory_drill && SUBJECT_DATA.theory_drill.questions) || [];
    if (kind === "cloze") return all.filter((q) => q.drillType === "cloze");
    if (kind === "exam") return all.filter((q) => q.drillType === "exam");
    if (kind === "drill") return all.filter((q) => q.drillType === "drill");
    if (kind === "mcq") return all.filter((q) => q.drillType === "exam" || q.drillType === "drill");
    return all.slice();
  }

  /**
   * kind: all | cloze | mcq | exam | drill
   * mode: seq | rand | undone
   */
  window.startTheoryDrill = function startTheoryDrill(kind, mode) {
    kind = kind || "all";
    mode = mode || "seq";
    if (!SUBJECT_DATA.theory_drill) {
      alert("理论讲练题库未加载");
      return;
    }
    if (!isTheoryDrill()) selectSubject("theory_drill");

    const pool = poolByKind(kind);
    if (!pool.length) {
      alert("当前筛选下暂无题目");
      return;
    }
    QUESTIONS = pool;

    if (mode === "undone") {
      if (typeof startUndonePractice === "function") startUndonePractice();
      else startPractice("seq");
      return;
    }
    startPractice(mode);
  };

  window.showTheoryDrillCategoryPicker = function showTheoryDrillCategoryPicker() {
    if (!isTheoryDrill()) selectSubject("theory_drill");
    QUESTIONS = poolByKind("all");
    if (typeof showCategoryPicker === "function") showCategoryPicker();
  };
})();
