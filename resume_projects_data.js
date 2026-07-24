// 简历「实习经历 + 项目经历」合一 · 面试口述背诵
// 交互对齐申论范文：关键句 / 技术词可隐藏展示；文下附基础知识点延伸

const RESUME_ORAL_SCRIPTS = [
  {
    id: "oral_momenta",
    title: "Momenta｜60秒口述",
    project: "momenta",
    projectName: "实习·Momenta后端",
    oneLiner: "工业级数据生产平台上的工作流后端负责人之一。",
    paragraphs: [
      {
        type: "hook",
        label: "开场",
        text: "Momenta 实习期间，我参与建设自动驾驶场景下的 DDOD 数据生产流水线平台：面向内部数据生产与标注业务，支撑多类型任务的创建、编排、调度与监控。我主要负责 OCC 工作流与任务管理模块后端。",
        masks: [
          { text: "DDOD 数据生产流水线平台", type: "key" },
          { text: "OCC 工作流与任务管理模块后端", type: "key" }
        ]
      },
      {
        type: "body",
        label: "模块",
        text: "模块可以拆成四块：Union/Occ/Task 核心 REST API；UnionOccTaskService 核心链路，做数据集解析、批量 MD5、并发创建 workflow、任务落库与状态刷新；monitor 监控子系统，覆盖进度同步、部署状态、成本计算与告警前置判断；ORMMethodService 统一数据访问门面。整体把「任务提交→解析→落库→状态流转→外部对接→监控告警」做成可追溯、可观测的闭环。",
        masks: [
          { text: "数据集解析、批量 MD5、并发创建 workflow", type: "tech" },
          { text: "进度同步、部署状态、成本计算与告警前置判断", type: "tech" },
          { text: "任务提交→解析→落库→状态流转→外部对接→监控告警", type: "key" }
        ]
      },
      {
        type: "close",
        label: "收束",
        text: "技术栈是 Spring Boot、MyBatis、多数据源、RESTful API 与外部系统集成。面试关键词：工作流编排、任务状态机、批量与并发、可观测性。",
        masks: [
          { text: "Spring Boot、MyBatis、多数据源", type: "tech" },
          { text: "工作流编排、任务状态机、批量与并发、可观测性", type: "key" }
        ]
      }
    ],
    knowledge: [
      {
        id: "k_workflow",
        title: "工作流 / 任务状态机",
        summary: "把任务生命周期建模成状态流转，而不是散落的 if-else。",
        detail: "常见状态：CREATED → RUNNING → SUCCESS/FAILED（可加 CANCELLED、RETRY）。每次流转写清触发条件与副作用（落库、回调、告警）。面试可补一句：幂等与可重入——同一任务重复提交不应产生脏数据。"
      },
      {
        id: "k_observability",
        title: "可观测性三件套",
        summary: "Metrics / Logging / Tracing，支撑进度、成本、告警。",
        detail: "监控子系统本质是可观测：进度同步看运行态，成本计算看资源账，告警前置判断避免事后救火。基础点：指标要能下钻到任务维度，日志带 traceId，外部对接失败要有明确错误码。"
      }
    ]
  },
  {
    id: "oral_farm",
    title: "银黄农场｜60秒口述",
    project: "farm_robot",
    projectName: "实习·银黄农场巡检",
    oneLiner: "智慧农业具身智能的田间落地实践。",
    paragraphs: [
      {
        type: "hook",
        label: "开场",
        text: "银黄农场专业实践针对温室大棚人工巡检效率低、成本高的痛点，参与智能巡检机器人系统研发与联调，覆盖外壳结构、巡检方案对比、路径规划集成与田间实测。",
        masks: [
          { text: "温室大棚人工巡检效率低、成本高", type: "key" },
          { text: "外壳结构、巡检方案对比、路径规划集成与田间实测", type: "key" }
        ]
      },
      {
        type: "body",
        label: "模块",
        text: "四块工作：数据采集与视觉定位，视觉 SLAM 精度约从 25% 提升到 70%；巡检感知方案对比，覆盖 OpenCV 巡线、YOLO 路面分割、视觉/激光 SLAM；路径规划对比 A*/RRT*/Hybrid A*，局部 TEB 并保留作物安全距离，集成 ROS Navigation；SOLIDWORKS 外壳与 10m 行间实测，跟踪误差小于 15cm。",
        masks: [
          { text: "视觉 SLAM 精度约从 25% 提升到 70%", type: "key" },
          { text: "OpenCV 巡线、YOLO 路面分割、视觉/激光 SLAM", type: "tech" },
          { text: "Hybrid A*", type: "tech" },
          { text: "跟踪误差小于 15cm", type: "key" }
        ]
      },
      {
        type: "close",
        label: "收束",
        text: "口述三段论：视觉 SLAM 解决「我在哪」，YOLO/分割解决「路在哪」，Hybrid A*+TEB 解决「怎么走且不伤作物」。核心理念是「算法对比选边界 + 田间实测定指标」。",
        masks: [
          { text: "视觉 SLAM 解决「我在哪」", type: "key" },
          { text: "YOLO/分割解决「路在哪」", type: "key" },
          { text: "Hybrid A*+TEB 解决「怎么走且不伤作物」", type: "key" }
        ]
      }
    ],
    knowledge: [
      {
        id: "k_slam",
        title: "SLAM 一句话",
        summary: "同时估计自身位姿与环境地图。",
        detail: "视觉 SLAM 靠相机特征，激光 SLAM 靠点云；温棚无轨、纹理重复时视觉更易漂。你项目里用精度提升讲清「为什么做方案对比」，比只报模型名更有说服力。"
      },
      {
        id: "k_teb",
        title: "全局规划 vs 局部规划",
        summary: "Hybrid A* 管全局可行性，TEB 管局部避障与平滑。",
        detail: "全局规划给参考路径；局部规划（如 TEB）根据实时障碍与运动学约束微调。作物安全距离是业务约束，要写进代价函数或膨胀半径，面试官爱听「约束如何落到参数」。"
      }
    ]
  },
  {
    id: "oral_zhinnong",
    title: "智农云眸｜60秒口述",
    project: "zhinnong",
    projectName: "项目·智农云眸",
    oneLiner: "农业 AI 业务下的高并发后端攻坚。",
    paragraphs: [
      {
        type: "hook",
        label: "开场",
        text: "智农云眸是面向 C 端与 B 端的智慧农业全栈平台，集成多模态病虫害识别、RAG 专家问答与 Multi-Agent 调度。我重点负责高并发链路、缓存一致性治理与短链接系统优化。",
        masks: [
          { text: "多模态病虫害识别、RAG 专家问答与 Multi-Agent 调度", type: "tech" },
          { text: "高并发链路、缓存一致性治理与短链接系统优化", type: "key" }
        ]
      },
      {
        type: "body",
        label: "模块",
        text: "四条线：大模型对话上下文采用先更新 DB 再删缓存，并加分布式重试；高并发网址跳转做缓存多层判断与 synchronized，治理击穿/穿透，避免大 Key；短链接用 ShardingSphere 基因法分表，分表信息嵌入短链；发号用 Redis 批量号段 + AtomicLong 自增与越界校验。",
        masks: [
          { text: "先更新 DB 再删缓存", type: "key" },
          { text: "击穿/穿透", type: "tech" },
          { text: "ShardingSphere 基因法分表", type: "tech" },
          { text: "Redis 批量号段 + AtomicLong", type: "tech" }
        ]
      },
      {
        type: "close",
        label: "收束",
        text: "技术栈：Spring Boot、RocketMQ、ShardingSphere、Redis、MySQL、Sentinel。核心理念是「业务可用 + 高并发稳定」——对话要最终一致，短链要抗击穿并可分片扩展。",
        masks: [
          { text: "业务可用 + 高并发稳定", type: "key" },
          { text: "对话要最终一致，短链要抗击穿并可分片扩展", type: "key" }
        ]
      }
    ],
    knowledge: [
      {
        id: "k_cache_aside",
        title: "Cache-Aside（旁路缓存）",
        summary: "读：先缓存，miss 再 DB 回填；写：通常改 DB 再删缓存。",
        detail: "为什么删缓存而不是更新缓存？避免并发写导致缓存脏数据。主从延迟场景可配合延迟双删或订阅 binlog。你项目里的「先更 DB 再删缓存 + 重试」就是在保证最终一致。"
      },
      {
        id: "k_cache_three",
        title: "穿透 / 击穿 / 雪崩",
        summary: "穿透=查不存在；击穿=热点 key 过期；雪崩=大量 key 同时过期。",
        detail: "穿透：布隆过滤器或缓存空值。击穿：互斥锁 / 逻辑过期，你用的 synchronized 属于互斥回源。雪崩：过期时间加随机抖动 + 集群高可用。面试再补一句大 Key 危害：阻塞网络与慢查询。"
      },
      {
        id: "k_shard_gene",
        title: "基因法分片",
        summary: "把分片信息编码进业务 ID，路由无需二次查表。",
        detail: "短链里嵌入分表位，解析短链即可定位分片，避免「先查路由表再查数据」。号段发号则是用 Redis 一次取一段，本地 AtomicLong 消耗，降低 Redis 往返。"
      }
    ]
  },
  {
    id: "oral_fruit",
    title: "水果病害小程序｜60秒口述",
    project: "fruit_mp",
    projectName: "项目·水果病害小程序",
    oneLiner: "数据集工具链的端侧独立交付。",
    paragraphs: [
      {
        type: "hook",
        label: "开场",
        text: "水果病害小程序是我独立开发的采集标注工具，面向智慧农业研究与机器学习数据集建设：多维属性采集、可视化画框标注、端侧 AI 辅助识别、JSON/CSV 导出。已开源。",
        masks: [
          { text: "多维属性采集、可视化画框标注、端侧 AI 辅助识别、JSON/CSV 导出", type: "key" },
          { text: "已开源", type: "key" }
        ]
      },
      {
        type: "body",
        label: "模块",
        text: "核心能力：Canvas 画框标注（YOLO/XML）；端侧 ONNX/YOLOv8 推理，含预处理、NMS、结果回填；双推理引擎——InferenceSession 失败则降级到 Canvas+HSV 规则引擎；模型策略是轻量本地打包 + CDN 远程按需缓存，突破小程序包体积限制。",
        masks: [
          { text: "预处理、NMS、结果回填", type: "tech" },
          { text: "InferenceSession 失败则降级到 Canvas+HSV", type: "key" },
          { text: "轻量本地打包 + CDN 远程按需缓存", type: "key" }
        ]
      },
      {
        type: "close",
        label: "收束",
        text: "核心理念：端侧要「能跑还要兜底」。主路径 createInferenceSession，失败降级 HSV；大模型走 CDN 静默缓存，小模型内置。定位：采集—标注—推理—导出闭环。",
        masks: [
          { text: "能跑还要兜底", type: "key" },
          { text: "采集—标注—推理—导出闭环", type: "key" }
        ]
      }
    ],
    knowledge: [
      {
        id: "k_nms",
        title: "NMS（非极大值抑制）",
        summary: "同一目标多个框时，保留置信度最高并抑制重叠框。",
        detail: "按置信度排序，计算 IoU，超过阈值则丢弃。端侧还要注意预处理：letterbox 缩放、归一化、输出坐标映射回原图。面试可对比 Soft-NMS。"
      },
      {
        id: "k_onnx_fallback",
        title: "端侧推理兜底",
        summary: "主模型失败时用规则引擎保底，保证产品可用。",
        detail: "小程序 createInferenceSession 受机型/内存影响可能失败。HSV 颜色分割是弱监督兜底：精度不如深度学习，但能演示闭环。CDN 缓存模型解决主包 2MB 级限制。"
      }
    ]
  },
  {
    id: "oral_combo",
    title: "综合｜60秒串联开场",
    project: "skills",
    projectName: "综合串联与技术栈",
    oneLiner: "实习偏真实业务落地，项目偏完整闭环与技术深度。",
    paragraphs: [
      {
        type: "hook",
        label: "开场",
        text: "我的实践主线是智慧农业与工程落地：专业实践在银黄农场把 SLAM/规划做到田间指标；项目上参与智农云眸，负责缓存一致性与短链高并发；实习在 Momenta 做自动驾驶 DDOD/OCC 工作流后端；另外独立完成水果病害采集小程序并开源。",
        masks: [
          { text: "智慧农业与工程落地", type: "key" },
          { text: "缓存一致性与短链高并发", type: "key" },
          { text: "DDOD/OCC 工作流后端", type: "tech" }
        ]
      },
      {
        type: "body",
        label: "怎么开口",
        text: "简历两大块可以这样说：实习两条——Momenta（工业级数据流水线后端）、银黄农场（农业巡检机器人实地验证）；项目两条——智农云眸（农业 AI 全栈高并发）、水果病害小程序（端侧采集标注独立开发）。一句话收束：实习偏真实业务与联调落地，项目偏完整闭环与技术深度，主线都是智慧农业 + 工程能力。",
        masks: [
          { text: "实习偏真实业务与联调落地", type: "key" },
          { text: "项目偏完整闭环与技术深度", type: "key" },
          { text: "智慧农业 + 工程能力", type: "key" }
        ]
      },
      {
        type: "close",
        label: "技术栈",
        text: "后端：Java/Spring Boot/MyBatis、Redis 一致性与穿透击穿雪崩、RocketMQ、ShardingSphere、Sentinel。AI 与具身：RAG/Tool Calling/Multi-Agent，OpenCV/YOLO/SLAM/ROS，小程序端侧 ONNX。",
        masks: [
          { text: "Redis 一致性与穿透击穿雪崩", type: "tech" },
          { text: "RAG/Tool Calling/Multi-Agent", type: "tech" },
          { text: "小程序端侧 ONNX", type: "tech" }
        ]
      }
    ],
    knowledge: [
      {
        id: "k_star",
        title: "口述结构建议（STAR）",
        summary: "Situation → Task → Action → Result，每段 15–20 秒。",
        detail: "开场给背景与职责（S/T），中间讲 2–3 个可验证动作（A），收束给指标或定位句（R）。关键句挖空就是为了让你在 A/R 上不卡壳。"
      },
      {
        id: "k_depth",
        title: "实习 vs 项目怎么对比",
        summary: "实习强调约束与联调；项目强调闭环与取舍。",
        detail: "面试官常问「你独立负责什么」。实习用「模块边界 + 协作接口」答；项目用「从 0 到 1 的决策」答。两条线都落到智慧农业，故事更顺。"
      }
    ]
  }
];

const RESUME_PROJECTS_DATA = {
  name: "实习与项目·面试口述",
  icon: "项",
  categories: [
    { id: "momenta", name: "实习·Momenta后端" },
    { id: "farm_robot", name: "实习·银黄农场巡检" },
    { id: "zhinnong", name: "项目·智农云眸" },
    { id: "fruit_mp", name: "项目·水果病害小程序" },
    { id: "skills", name: "综合串联与技术栈" }
  ],
  oralScripts: RESUME_ORAL_SCRIPTS,
  // 考点速查：一篇一条，不把知识点与口述正文揉在同一卡片
  facts: RESUME_ORAL_SCRIPTS.map((script) => {
    const parts = (script.paragraphs || [])
      .map((p) => `【${p.label || "段落"}】${p.text}`)
      .join("\n\n");
    const know = (script.knowledge || [])
      .map((k) => `· ${k.title}：${k.summary}`)
      .join("\n");
    return {
      title: script.title,
      cat: script.project,
      content: `【定位】${script.oneLiner}\n\n${parts}${know ? `\n\n【延伸提纲】\n${know}` : ""}`
    };
  }),
  questions: [
    {
      id: "rp_m_01",
      type: "fill",
      category: "momenta",
      categoryName: "实习·Momenta后端",
      question: "【实习】Momenta 参与建设自动驾驶场景下的______数据生产流水线平台，本人负责 OCC 工作流与任务管理后端。",
      options: [],
      answer: ["DDOD", "ddod"],
      explanation: "关键词：DDOD 平台 + OCC 工作流。建议回口述稿把「任务提交→…→监控告警」整句背熟。"
    },
    {
      id: "rp_m_02",
      type: "single",
      category: "momenta",
      categoryName: "实习·Momenta后端",
      question: "【实习】UnionOccTaskService 核心链路主要不包含哪一项？",
      options: ["数据集解析与批量 MD5", "并发创建 workflow", "前端页面像素级还原", "任务落库与状态刷新"],
      answer: "C",
      explanation: "后端链路侧重解析、并发提交、落库与状态；不是 UI 还原。"
    },
    {
      id: "rp_f_01",
      type: "fill",
      category: "farm_robot",
      categoryName: "实习·银黄农场巡检",
      question: "【实习】银黄农场视觉 SLAM 精度约从______提升到______；行间实测跟踪误差小于______。",
      options: [],
      answer: ["25%", "70%", "15cm", "15 cm"],
      explanation: "指标句是收分点：25%→70%，误差<15cm。"
    },
    {
      id: "rp_z_01",
      type: "single",
      category: "zhinnong",
      categoryName: "项目·智农云眸",
      question: "【项目】对话上下文缓存一致性，更稳妥的常见写法是？",
      options: ["只更新缓存不改 DB", "先更新 DB 再删缓存", "同时强行双写且不等待", "永不过期不做失效"],
      answer: "B",
      explanation: "Cache-Aside 常见写路径：改 DB 再删缓存，配合重试保证最终一致。"
    },
    {
      id: "rp_z_02",
      type: "fill",
      category: "zhinnong",
      categoryName: "项目·智农云眸",
      question: "【项目】短链接分表采用 ShardingSphere______，发号采用 Redis______。",
      options: [],
      answer: ["基因法", "批量号段", "号段"],
      explanation: "基因法分片 + 号段发号，是短链高并发的两个抓手。"
    },
    {
      id: "rp_p_01",
      type: "single",
      category: "fruit_mp",
      categoryName: "项目·水果病害小程序",
      question: "【项目】端侧推理主路径失败时的兜底是？",
      options: ["直接崩溃提示重装", "Canvas+HSV 规则引擎", "强制下载 100MB 模型", "改为纯服务端且无离线"],
      answer: "B",
      explanation: "双引擎：InferenceSession → HSV 兜底，体现「能跑还要兜底」。"
    },
    {
      id: "rp_s_01",
      type: "single",
      category: "skills",
      categoryName: "综合串联与技术栈",
      question: "【综合】面试开场更合适的定位是？",
      options: [
        "只讲课程作业",
        "实习偏业务落地、项目偏闭环深度，主线智慧农业+工程能力",
        "只报框架名词堆叠",
        "回避所有指标"
      ],
      answer: "B",
      explanation: "用主线把四段经历串起来，比堆技术词更清晰。"
    }
  ]
};

if (typeof SUBJECT_DATA !== "undefined") {
  SUBJECT_DATA.resume_projects = RESUME_PROJECTS_DATA;
}
