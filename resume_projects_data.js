// 简历「实习经历 + 项目经历」合一模块 · 面试口述题库
// （基于《崔泽坤_央国企简历》）
// 统一结构：背景 → 模块 → 技术栈 → 实现要点 → 核心理念

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
  facts: [
    // ========== 实习① Momenta ==========
    {
      title: "【实习】Momenta｜一句话总述",
      cat: "momenta",
      content: "【类型：实习经历｜后端开发实习生｜2025.12–2026.02｜北京】Momenta 期间参与建设自动驾驶场景下的 DDOD 数据生产流水线平台：面向内部数据生产与标注业务，支撑多类型任务的创建、编排、调度与监控。我主要负责 OCC 工作流与任务管理模块后端。技术栈：Spring Boot、MyBatis、多数据源、RESTful API、外部系统集成。核心理念：把「任务提交→解析→落库→状态流转→外部对接→监控告警」做成可追溯、可观测的闭环。"
    },
    {
      title: "【实习】Momenta｜模块拆解",
      cat: "momenta",
      content: "模块四块：① Union/Occ/Task 核心 REST API（创建、查询、状态流转）；② UnionOccTaskService 核心链路（数据集解析、批量 MD5、并发创建 workflow、任务落库与状态刷新）；③ monitor 监控子系统（进度同步、部署状态、成本计算、告警前置判断）；④ ORMMethodService 数据访问门面（统一 DPL 相关表 upsert/查询）。整体支撑数据任务全生命周期运营，并在多数据源场景下完成联调排障。"
    },
    {
      title: "【实习】Momenta｜技术与理念",
      cat: "momenta",
      content: "工程抓手三条：多数据源稳定性、批量并发提交与可追溯（MD5/状态刷新）、运行态可观测（进度/成本/告警）。面试关键词：工作流编排、任务状态机、外部系统集成、批量与并发、可观测性。定位一句话：工业级数据生产平台上的工作流后端负责人之一。"
    },

    // ========== 实习② 银黄农场 ==========
    {
      title: "【实习】银黄农场｜一句话总述",
      cat: "farm_robot",
      content: "【类型：实习/专业实践｜智能巡检算法研发与实地验证｜2024.10–2025.06｜北京昌平银黄农场】针对温室大棚人工巡检效率低、成本高的痛点，参与智能巡检机器人系统研发与联调，覆盖外壳结构设计、巡检方案对比、路径规划集成与田间实测。技术栈：Python、OpenCV、YOLO、视觉/激光 SLAM、ROS Navigation、Hybrid A*/TEB、SOLIDWORKS。核心理念：「算法对比选边界 + 田间实测定指标」，把定位与规划落到无轨温棚。"
    },
    {
      title: "【实习】银黄农场｜模块拆解",
      cat: "farm_robot",
      content: "模块四块：① 数据采集与视觉定位（连续田间采集，视觉 SLAM 精度约 25%→70%）；② 巡检感知方案对比（OpenCV 巡线、YOLO 路面分割、视觉 SLAM、激光 SLAM，分析无轨温棚鲁棒性）；③ 路径规划与导航（对比 A*/RRT*/Hybrid A*，局部 TEB + 作物安全距离，集成 ROS Navigation）；④ 结构与落地验证（SOLIDWORKS 外壳，10m 行间实测，跟踪误差 <15cm）。成果支撑怀柔顶秀展示、青创北京/强农杯及专利。"
    },
    {
      title: "【实习】银黄农场｜技术与理念",
      cat: "farm_robot",
      content: "三段论口述：视觉 SLAM 解决「我在哪」，YOLO/分割解决「路在哪」，Hybrid A*+TEB 解决「怎么走且不伤作物」。强调指标量化、方案取舍、ROS 工程集成与实地验证闭环。定位一句话：智慧农业具身智能的田间落地实践。"
    },

    // ========== 项目① 智农云眸 ==========
    {
      title: "【项目】智农云眸｜一句话总述",
      cat: "zhinnong",
      content: "【类型：项目经历｜智慧农业全栈服务平台｜2025.09–2025.11】面向 C 端与 B 端，打造集多模态大模型病虫害图像识别、RAG 智能专家问答、Multi-Agent 自主调度于一体的全栈平台。本人重点：高并发链路、缓存一致性治理与短链接系统优化。技术栈：Spring Boot、RocketMQ、ShardingSphere、Redis、MySQL、Sentinel、Swagger。核心理念：「业务可用 + 高并发稳定」——对话要最终一致，短链要抗击穿并可分片扩展。"
    },
    {
      title: "【项目】智农云眸｜模块拆解",
      cat: "zhinnong",
      content: "本人相关模块：① 大模型对话上下文缓存一致性（先更新 DB 再删缓存 + 分布式重试）；② 高并发网址跳转（缓存多层判断 + synchronized，治理击穿/穿透，避免大 Key）；③ 短链接分表（ShardingSphere 基因法，分表信息嵌入短链，查询性能近翻倍）；④ 短链发号（Redis 批量号段 + AtomicLong 自增 + 越界校验）。平台上层另有识别、RAG、多智能体调度能力。"
    },
    {
      title: "【项目】智农云眸｜技术与理念",
      cat: "zhinnong",
      content: "深挖三条：缓存一致性策略、穿透/击穿/雪崩治理、基因分片 + 号段发号。体现「会用中间件」升级为「能设计一致性与容量路径」。定位一句话：农业 AI 业务下的高并发后端攻坚。"
    },

    // ========== 项目② 水果小程序 ==========
    {
      title: "【项目】水果病害小程序｜一句话总述",
      cat: "fruit_mp",
      content: "【类型：项目经历｜独立开发｜2026.06–2026.07】面向智慧农业研究与机器学习数据集建设，独立开发热带水果及叶部病害采集标注微信小程序：多维属性采集、可视化画框标注、端侧 AI 辅助识别、JSON/CSV 导出。技术栈：微信小程序、JavaScript、ONNX、YOLOv8、Canvas、wx.createInferenceSession、HSV、本地存储。核心理念：「采集—标注—推理—导出」闭环 + 双引擎兜底。开源：github.com/kk18615105392/fruit_miniprogram。"
    },
    {
      title: "【项目】水果病害小程序｜模块拆解",
      cat: "fruit_mp",
      content: "模块七块：① 首页统计与采集录入；② 可视化画框标注（YOLO/XML）；③ 历史检索与详情编辑；④ JSON/CSV 导出与微信分享；⑤ 端侧 ONNX/YOLOv8 推理（芒果/香蕉/石榴/番茄等，含预处理、NMS、回填）；⑥ 双推理引擎（InferenceSession 失败 → Canvas+HSV 规则引擎）；⑦ 模型加载（轻量本地打包 + CDN 远程按需缓存，突破包体积限制）。"
    },
    {
      title: "【项目】水果病害小程序｜技术与理念",
      cat: "fruit_mp",
      content: "核心理念：端侧要「能跑还要兜底」。主路径 createInferenceSession，失败降级 HSV；大模型 CDN 静默缓存，小模型内置。面试可讲：预处理与 NMS、双引擎、包体积策略、标注导出格式。定位一句话：数据集工具链的端侧独立交付。"
    },

    // ========== 综合 ==========
    {
      title: "【综合】实习 vs 项目｜怎么开口",
      cat: "skills",
      content: "简历两大块合一叙述：实习两条——Momenta（工业级数据流水线后端）、银黄农场（农业巡检机器人实地验证）；项目两条——智农云眸（农业 AI 全栈高并发）、水果病害小程序（端侧采集标注独立开发）。面试时可说：「实习偏真实业务与联调落地，项目偏完整闭环与技术深度，主线都是智慧农业 + 工程能力。」"
    },
    {
      title: "【综合】60 秒串联开场",
      cat: "skills",
      content: "我的实践主线是智慧农业与工程落地：专业实践在银黄农场把 SLAM/规划做到田间指标；项目上参与智农云眸，负责缓存一致性与短链高并发；实习在 Momenta 做自动驾驶 DDOD/OCC 工作流后端；另外独立完成水果病害采集小程序并开源。覆盖具身智能、大模型应用、高并发后端与端侧工具。"
    },
    {
      title: "【综合】技术栈总览｜后端与并发",
      cat: "skills",
      content: "Java/Spring Boot/MyBatis、MySQL、多数据源、RESTful 与外部集成；Redis 一致性与穿透/击穿/雪崩；RocketMQ、ShardingSphere、Sentinel；Maven、Git。"
    },
    {
      title: "【综合】技术栈总览｜AI与具身",
      cat: "skills",
      content: "LangChain/Prompt/RAG/Tool Calling/Multi-Agent；OpenCV、YOLO、SLAM、ROS Navigation、Hybrid A*/TEB；微信小程序端侧 ONNX 推理与采集标注系统。"
    }
  ],
  questions: [
    // —— 实习 Momenta ——
    {
      id: "rp_m_01",
      type: "fill",
      category: "momenta",
      categoryName: "实习·Momenta后端",
      question: "【实习】Momenta 参与建设自动驾驶场景下的______数据生产流水线平台，本人负责 OCC 工作流与任务管理后端。",
      options: [],
      answer: ["DDOD", "ddod"],
      explanation: "实习项目关键词：DDOD 平台 + OCC 工作流。"
    },
    {
      id: "rp_m_02",
      type: "single",
      category: "momenta",
      categoryName: "实习·Momenta后端",
      question: "【实习】UnionOccTaskService 核心链路不包含？",
      options: ["数据集解析与批量 MD5", "并发创建 workflow 并落库", "前端可视化拖拽编排", "任务状态刷新与可追溯"],
      answer: "C",
      explanation: "实习职责在后端链路，不是前端编排。"
    },
    {
      id: "rp_m_03",
      type: "fill",
      category: "momenta",
      categoryName: "实习·Momenta后端",
      question: "【实习】monitor 子系统强调为运营提供运行态______能力。",
      options: [],
      answer: ["可观测", "可观测性", "观测"],
      explanation: "进度/成本/告警 → 可观测性。"
    },
    {
      id: "rp_m_04",
      type: "single",
      category: "momenta",
      categoryName: "实习·Momenta后端",
      question: "【实习】ORMMethodService 更接近？",
      options: ["消息中间件", "多表 upsert/查询的数据访问门面", "前端状态库", "训练调度器"],
      answer: "B",
      explanation: "数据访问门面，统一 DPL 表操作。"
    },
    {
      id: "rp_m_05",
      type: "fill",
      category: "momenta",
      categoryName: "实习·Momenta后端",
      question: "【实习】Momenta 技术栈除 SpringBoot、MyBatis 外，还强调______联调排障。",
      options: [],
      answer: ["多数据源", "多数据源场景"],
      explanation: "多数据源 + 外部系统集成。"
    },
    {
      id: "rp_m_06",
      type: "single",
      category: "momenta",
      categoryName: "实习·Momenta后端",
      question: "【实习】Momenta 核心理念最贴切的是？",
      options: ["只追求页面美观", "任务全生命周期可追溯、可观测闭环", "一次性脚本导入", "不做外部对接"],
      answer: "B",
      explanation: "提交到监控告警的闭环。"
    },

    // —— 实习 银黄农场 ——
    {
      id: "rp_f_01",
      type: "single",
      category: "farm_robot",
      categoryName: "实习·银黄农场巡检",
      question: "【实习】银黄农场要解决的痛点是？",
      options: ["电商峰值", "温室大棚人工巡检效率低、成本高", "短链高并发", "小程序包体积"],
      answer: "B",
      explanation: "专业实践一线痛点：人工巡检。"
    },
    {
      id: "rp_f_02",
      type: "fill",
      category: "farm_robot",
      categoryName: "实习·银黄农场巡检",
      question: "【实习】视觉 SLAM 定位精度由约 25% 提升至约______。",
      options: [],
      answer: ["70%", "70"],
      explanation: "实习量化指标。"
    },
    {
      id: "rp_f_03",
      type: "single",
      category: "farm_robot",
      categoryName: "实习·银黄农场巡检",
      question: "【实习】局部规划器采用？",
      options: ["DWA", "TEB（含作物安全距离）", "仅开环 Pure Pursuit", "只用 RRT*"],
      answer: "B",
      explanation: "TEB + 安全距离 + ROS Navigation。"
    },
    {
      id: "rp_f_04",
      type: "fill",
      category: "farm_robot",
      categoryName: "实习·银黄农场巡检",
      question: "【实习】10m 行间实测，路径跟踪误差小于______cm。",
      options: [],
      answer: ["15", "15cm", "15厘米"],
      explanation: "误差 <15cm。"
    },
    {
      id: "rp_f_05",
      type: "single",
      category: "farm_robot",
      categoryName: "实习·银黄农场巡检",
      question: "【实习】技术栈概括最完整的是？",
      options: [
        "SpringBoot / Redis / RocketMQ",
        "Python / OpenCV / YOLO / SLAM / ROS / Hybrid A*·TEB",
        "仅 SOLIDWORKS",
        "仅小程序"
      ],
      answer: "B",
      explanation: "具身与视觉栈。"
    },
    {
      id: "rp_f_06",
      type: "single",
      category: "farm_robot",
      categoryName: "实习·银黄农场巡检",
      question: "【实习】SLAM / YOLO / Hybrid A*+TEB 分别解决？",
      options: [
        "我在哪 / 路在哪 / 怎么走且不伤作物",
        "下单 / 支付 / 物流",
        "缓存 / 分表 / 发号",
        "登录 / 权限 / 审计"
      ],
      answer: "A",
      explanation: "具身导航三段论。"
    },

    // —— 项目 智农云眸 ——
    {
      id: "rp_z_01",
      type: "single",
      category: "zhinnong",
      categoryName: "项目·智农云眸",
      question: "【项目】智农云眸能力组合是？",
      options: [
        "仅 CRUD",
        "多模态病虫害识别 + RAG + Multi-Agent",
        "仅自动驾驶标注",
        "仅机械臂"
      ],
      answer: "B",
      explanation: "识别 + RAG + 多智能体。"
    },
    {
      id: "rp_z_02",
      type: "fill",
      category: "zhinnong",
      categoryName: "项目·智农云眸",
      question: "【项目】缓存一致性：先更新数据库再______缓存，配合分布式重试。",
      options: [],
      answer: ["删除", "删", "del"],
      explanation: "先写库再删缓存。"
    },
    {
      id: "rp_z_03",
      type: "single",
      category: "zhinnong",
      categoryName: "项目·智农云眸",
      question: "【项目】短链分表关键思路？",
      options: ["随机分表无法反查", "ShardingSphere 基因法，分表信息嵌入短链", "只靠单表索引", "一个 Redis 大 Key"],
      answer: "B",
      explanation: "基因法分片。"
    },
    {
      id: "rp_z_04",
      type: "fill",
      category: "zhinnong",
      categoryName: "项目·智农云眸",
      question: "【项目】短链发号：Redis 批量号段 + ______ 内存自增。",
      options: [],
      answer: ["AtomicLong", "atomiclong"],
      explanation: "号段 + AtomicLong。"
    },
    {
      id: "rp_z_05",
      type: "single",
      category: "zhinnong",
      categoryName: "项目·智农云眸",
      question: "【项目】高并发跳转要治理？",
      options: ["仅 SQL 注入", "大 Key、击穿与穿透", "仅前端路由", "仅证书过期"],
      answer: "B",
      explanation: "缓存三大问题 + 大 Key。"
    },
    {
      id: "rp_z_06",
      type: "fill",
      category: "zhinnong",
      categoryName: "项目·智农云眸",
      question: "【项目】本人重点三条线：缓存一致性、高并发跳转、______优化。",
      options: [],
      answer: ["短链接", "短链", "短网址"],
      explanation: "短链接系统。"
    },

    // —— 项目 小程序 ——
    {
      id: "rp_p_01",
      type: "fill",
      category: "fruit_mp",
      categoryName: "项目·水果病害小程序",
      question: "【项目】端侧推理 API：______；失败回退 HSV 规则引擎。",
      options: [],
      answer: ["wx.createInferenceSession", "createInferenceSession"],
      explanation: "双引擎主路径。"
    },
    {
      id: "rp_p_02",
      type: "single",
      category: "fruit_mp",
      categoryName: "项目·水果病害小程序",
      question: "【项目】突破包体积的模型策略？",
      options: [
        "全部进主包",
        "轻量本地打包 + 大模型 CDN 按需缓存",
        "每次重新训练",
        "仅云端阻塞推理"
      ],
      answer: "B",
      explanation: "本地轻量 + CDN。"
    },
    {
      id: "rp_p_03",
      type: "single",
      category: "fruit_mp",
      categoryName: "项目·水果病害小程序",
      question: "【项目】业务闭环？",
      options: [
        "只拍照",
        "采集 → 标注 → 端侧识别 → 编辑 → JSON/CSV 导出",
        "只商城",
        "只权限"
      ],
      answer: "B",
      explanation: "采集标注推理导出。"
    },
    {
      id: "rp_p_04",
      type: "fill",
      category: "fruit_mp",
      categoryName: "项目·水果病害小程序",
      question: "【项目】检测后处理需______解码再回填。",
      options: [],
      answer: ["NMS", "nms", "非极大值抑制"],
      explanation: "NMS。"
    },
    {
      id: "rp_p_05",
      type: "single",
      category: "fruit_mp",
      categoryName: "项目·水果病害小程序",
      question: "【项目】双引擎理念？",
      options: [
        "只追精度不顾可用性",
        "主路径深度学习，失败降级规则引擎，保障低端机",
        "不做端侧推理",
        "只用云端无兜底"
      ],
      answer: "B",
      explanation: "能跑还要兜底。"
    },

    // —— 综合：实习+项目一个模块 ——
    {
      id: "rp_s_01",
      type: "single",
      category: "skills",
      categoryName: "综合串联与技术栈",
      question: "简历里「实习经历」与「项目经历」在本模块中的关系是？",
      options: [
        "分成两个无关科目",
        "合并为同一科目：实习两条 + 项目两条，结构统一口述",
        "只保留实习",
        "只保留项目"
      ],
      answer: "B",
      explanation: "Momenta、银黄农场（实习）+ 智农云眸、水果小程序（项目）= 一个面试口述模块。"
    },
    {
      id: "rp_s_02",
      type: "single",
      category: "skills",
      categoryName: "综合串联与技术栈",
      question: "较合理的四段串联顺序？",
      options: [
        "银黄农场（具身）→ 智农云眸（农业AI高并发）→ Momenta（数据流水线后端）→ 小程序（端侧工具）",
        "只讲奖学金",
        "只讲社团",
        "四条毫无关联"
      ],
      answer: "A",
      explanation: "智慧农业 + 工程能力主线。"
    },
    {
      id: "rp_s_03",
      type: "fill",
      category: "skills",
      categoryName: "综合串联与技术栈",
      question: "高并发口诀：Redis 防穿透/击穿/雪崩；分表用______基因法；发号用 Redis 号段。",
      options: [],
      answer: ["ShardingSphere", "shardingsphere"],
      explanation: "来自智农云眸，可迁移到综合技术问答。"
    },
    {
      id: "rp_s_04",
      type: "single",
      category: "skills",
      categoryName: "综合串联与技术栈",
      question: "若问「实习和项目有何区别」，较贴切？",
      options: [
        "实习无技术含量",
        "实习更偏真实业务联调与指标落地；项目更偏完整闭环与可深挖技术点；二者同一主线",
        "项目都是抄的",
        "没有任何区别也无需解释"
      ],
      answer: "B",
      explanation: "帮助面试官理解简历结构，同时强调统一主线。"
    },
    {
      id: "rp_s_05",
      type: "single",
      category: "skills",
      categoryName: "综合串联与技术栈",
      question: "后端深挖优先选哪条？",
      options: [
        "智农云眸：缓存一致性 + 短链基因分片与号段发号",
        "只会打印日志",
        "只会改 CSS",
        "没有后端"
      ],
      answer: "A",
      explanation: "有策略、中间件与量化效果。"
    }
  ]
};

if (typeof SUBJECT_DATA !== "undefined") {
  SUBJECT_DATA.resume_projects = RESUME_PROJECTS_DATA;
}
