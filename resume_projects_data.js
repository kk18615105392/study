// 简历「实习经历 + 项目经历」合一 · 面试口述背诵
// 交互对齐申论范文：关键句 / 技术词可隐藏展示；文下附基础知识点延伸

/** 各篇口述正文里出现的通用技术名词（按篇 terms 再叠加） */
const RESUME_ORAL_COMMON_TERMS = [
  { id: "c_spring", term: "Spring Boot", title: "Spring Boot", summary: "Java 快速开发框架，自动配置 + 内嵌容器。", detail: "实习/项目都用：快速搭 REST 服务、整合 MyBatis/Redis/MQ；面试说「约定优于配置、starter 一键集成」。" },
  { id: "c_mybatis", term: "MyBatis", title: "MyBatis", summary: "半自动 ORM，SQL 与 Java 映射。", detail: "适合复杂 SQL 与多数据源场景；口述强调「SQL 可控、性能可优化」。" },
  { id: "c_redis", term: "Redis", title: "Redis", summary: "内存 KV 存储，做缓存/发号/限流。", detail: "智农云眸用于缓存、号段发号；要会讲数据结构选型与过期策略。" },
  { id: "c_mysql", term: "MySQL", title: "MySQL", summary: "关系型数据库，业务主库。", detail: "短链分表、对话上下文落库；配合 ShardingSphere 做水平扩展。" },
  { id: "c_java", term: "Java", title: "Java 后端", summary: "你的主力后端语言。", detail: "实习 Momenta + 项目智农云眸均以 Java/Spring 生态为主。" }
];

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
    ],
    terms: [
      { id: "m_ddod", term: "DDOD", title: "DDOD", summary: "Data-Driven OD，自动驾驶数据生产业务域。", detail: "Momenta 内部数据生产流水线平台所属业务线；口述=「自动驾驶场景下的数据生产平台」。" },
      { id: "m_ddod_full", term: "DDOD 数据生产流水线平台", title: "DDOD 数据生产流水线平台", summary: "面向标注与数据生产的端到端流水线。", detail: "支撑任务创建、编排、调度、监控；你负责其中 OCC 工作流与任务管理后端。" },
      { id: "m_occ", term: "OCC", title: "OCC（Occupancy）", summary: "Occupancy 占据栅格相关工作流，自动驾驶感知数据生产子域。", detail: "你主要负责 OCC 工作流与任务管理模块后端；与 Union、Task 模块并列。勿与 OCR 混淆。" },
      { id: "m_occ_alias", term: "OCCD", title: "OCC / DDOD（易混提醒）", summary: "口述/简历里常见 OCC 与 DDOD，不是 OCR。", detail: "OCC = Occupancy 工作流子域；DDOD = 数据生产平台业务域。若面试官写错成 OCCD，可礼貌纠正并解释二者分工。" },
      { id: "m_occ_wf", term: "OCC 工作流", title: "OCC 工作流", summary: "OCC 类数据从提交到产出的编排链路。", detail: "包含解析、落库、状态流转、对接外部系统；是实习口述的核心职责。" },
      { id: "m_occ_mgmt", term: "OCC 工作流与任务管理模块后端", title: "OCC 工作流与任务管理", summary: "你实习主要负责的后端模块。", detail: "覆盖任务 CRUD、状态机、与 workflow 引擎/外部系统对接。" },
      { id: "m_union", term: "Union", title: "Union 模块", summary: "数据生产平台中 Union 类任务域。", detail: "与 Occ、Task 并列，通过 REST API 对外提供创建/查询/状态流转。" },
      { id: "m_occ_slash", term: "Occ", title: "Occ（Union/Occ/Task）", summary: "平台三大任务域之一，Occ 子域。", detail: "文本里 Union/Occ/Task 表示三类核心 API；Occ 对应 OCC 相关业务。" },
      { id: "m_task", term: "Task", title: "Task 模块", summary: "通用任务管理域，与 Union/Occ 并列。", detail: "负责任务生命周期管理，是你 REST API 设计的三块之一。" },
      { id: "m_union_api", term: "Union/Occ/Task", title: "Union/Occ/Task 核心 API", summary: "三类核心 REST 接口族。", detail: "统一承担创建、查询、状态流转；体现领域拆分清晰。" },
      { id: "m_uots", term: "UnionOccTaskService", title: "UnionOccTaskService", summary: "核心服务类，串联解析→落库→建 workflow。", detail: "数据集解析、批量 MD5、并发创建 workflow、任务落库与状态刷新都在这条链路里。" },
      { id: "m_orm", term: "ORMMethodService", title: "ORMMethodService", summary: "数据访问门面，统一 DPL 相关表操作。", detail: "封装 upsert/查询，隔离底层多数据源与表细节，业务层只调门面。" },
      { id: "m_rest", term: "REST API", title: "REST API", summary: "HTTP + 资源化路径的接口风格。", detail: "Union/Occ/Task 对外暴露 RESTful 接口；动词对应 CRUD 与状态变更。" },
      { id: "m_restful", term: "RESTful API", title: "RESTful API", summary: "符合 REST 约束的 API 设计。", detail: "与外部系统集成、内部前端/调度器调用；强调幂等与状态码规范。" },
      { id: "m_dataset", term: "数据集解析", title: "数据集解析", summary: "解析数据集元信息与内容清单。", detail: "把原始数据包/配置解析为可落库结构：路径、版本、样本列表、workflow 参数等。" },
      { id: "m_batch_md5", term: "批量 MD5", title: "批量 MD5", summary: "批量计算文件指纹用于去重校验。", detail: "减少逐文件串行 I/O；指纹一致可跳过重复处理，提升吞吐。" },
      { id: "m_md5", term: "MD5", title: "MD5", summary: "128 位摘要算法，生成内容指纹。", detail: "此处用于去重与完整性校验，非加密场景；可说「内容哈希键」。" },
      { id: "m_wf_create", term: "并发创建 workflow", title: "并发创建 workflow", summary: "并行向编排系统提交多个 workflow 实例。", detail: "需控制线程池、限流、重试与幂等，防止外部系统过载或重复建单。" },
      { id: "m_workflow", term: "workflow", title: "Workflow 工作流", summary: "任务编排单元，描述多步骤执行图。", detail: "数据生产常见：解析→训练/标注→质检；后端负责创建实例并跟踪状态。" },
      { id: "m_wf_orch", term: "工作流编排", title: "工作流编排", summary: "把多步骤任务按依赖关系组织执行。", detail: "面试关键词；强调状态机 + 可重试 + 可观测，而不是散落定时任务。" },
      { id: "m_persist", term: "任务落库", title: "任务落库", summary: "把任务元数据写入数据库持久化。", detail: "落库后才有状态流转、监控、对账；通常与解析、建 workflow 同事务或最终一致。" },
      { id: "m_refresh", term: "状态刷新", title: "状态刷新", summary: "同步外部/编排系统的最新任务状态。", detail: "轮询或回调更新 DB；monitor 子系统会做进度同步。" },
      { id: "m_monitor", term: "monitor", title: "Monitor 监控子系统", summary: "运行态监控与告警模块。", detail: "覆盖进度同步、部署状态、成本计算、告警前置判断。" },
      { id: "m_prog", term: "进度同步", title: "进度同步", summary: "把 workflow 执行进度回写到平台。", detail: "用户/运营能看到任务完成百分比；异常进度触发告警。" },
      { id: "m_deploy", term: "部署状态", title: "部署状态", summary: "任务/workflow 在集群上的部署与运行态。", detail: "与进度配合，判断是排队、运行中还是失败。" },
      { id: "m_cost", term: "成本计算", title: "成本计算", summary: "按资源用量核算任务成本。", detail: "数据生产平台常见 GPU/存储计费；可观测性的一部分。" },
      { id: "m_alert", term: "告警前置判断", title: "告警前置判断", summary: "在故障扩大前规则化触发告警。", detail: "如超时、失败率飙升、成本异常；避免事后才发现。" },
      { id: "m_multi_ds", term: "多数据源", title: "多数据源", summary: "同一应用连接多个数据库实例。", detail: "Momenta 场景常见业务库 + DPL 库；Spring 动态数据源 + MyBatis 路由。" },
      { id: "m_state", term: "任务状态机", title: "任务状态机", summary: "用状态迁移描述任务生命周期。", detail: "CREATED→RUNNING→SUCCESS/FAILED；每次迁移记日志，支持幂等重试。" },
      { id: "m_batch", term: "批量与并发", title: "批量与并发", summary: "批量处理 + 并行提交提升吞吐。", detail: "批量 MD5、并发建 workflow 是典型例子；要讲清线程安全与限流。" },
      { id: "m_obs", term: "可观测性", title: "可观测性", summary: "Metrics / Logging / Tracing。", detail: "monitor 子系统体现可观测：进度、成本、告警；日志带 traceId。" },
      { id: "m_ext", term: "外部系统集成", title: "外部系统集成", summary: "与编排引擎、存储、标注系统等对接。", detail: "闭环里「外部对接」一环；接口超时、重试、错误码要规范。" },
      { id: "m_trace", term: "可追溯", title: "可追溯", summary: "任务全链路可追查。", detail: "从提交→解析→落库→状态→告警，有日志与任务 ID 串联。" },
      { id: "m_auto", term: "自动驾驶", title: "自动驾驶", summary: "Momenta 业务场景。", detail: "DDOD/OCC 都服务自动驾驶数据生产与模型迭代。" },
      { id: "m_anno", term: "标注", title: "数据标注", summary: "对感知数据打标签的生产环节。", detail: "平台面向「数据生产与标注业务」，OCC 是其中一条产线。" }
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
    ],
    terms: [
      { id: "f_slam", term: "SLAM", title: "SLAM", summary: "Simultaneous Localization and Mapping，同步定位与建图。", detail: "回答「机器人在哪、地图什么样」；分视觉 SLAM 与激光 SLAM。" },
      { id: "f_vis_slam", term: "视觉 SLAM", title: "视觉 SLAM", summary: "用相机特征估计位姿与地图。", detail: "精度从 25%→70% 是你核心指标；温棚纹理重复易漂移。" },
      { id: "f_laser_slam", term: "激光 SLAM", title: "激光 SLAM", summary: "用激光雷达点云建图定位。", detail: "与视觉 SLAM 对比鲁棒性；无轨温棚下的方案选型。" },
      { id: "f_slam_ratio", term: "视觉/激光 SLAM", title: "视觉 vs 激光 SLAM", summary: "两类 SLAM 方案对比。", detail: "巡检方案对比的核心：成本、精度、环境适应性。" },
      { id: "f_opencv", term: "OpenCV", title: "OpenCV", summary: "开源计算机视觉库。", detail: "用于巡线等传统方案，作为深度学习 baseline。" },
      { id: "f_line", term: "OpenCV 巡线", title: "OpenCV 巡线", summary: "基于边缘/颜色的传统巡线。", detail: "实现快、可解释；复杂光照下不如深度学习稳。" },
      { id: "f_yolo", term: "YOLO", title: "YOLO", summary: "You Only Look Once，单阶段检测/分割。", detail: "用于路面分割判断可通行区域；与巡线、SLAM 做方案对比。" },
      { id: "f_seg", term: "路面分割", title: "路面/路径分割", summary: "像素级划分可通行区域。", detail: "YOLO 分割输出 mask，供规划模块使用。" },
      { id: "f_yolo_seg", term: "YOLO 路面分割", title: "YOLO 路面分割", summary: "用 YOLO 做路面可通行区分割。", detail: "解决「路在哪」；与 SLAM 的「我在哪」配合。" },
      { id: "f_astar", term: "A*", title: "A* 算法", summary: "启发式栅格最短路径搜索。", detail: "路径规划 baseline；未考虑运动学约束。" },
      { id: "f_rrt", term: "RRT*", title: "RRT*", summary: "采样-based 渐近最优路径规划。", detail: "适合高维空间；与 Hybrid A* 一起作为对比方案。" },
      { id: "f_hybrid", term: "Hybrid A*", title: "Hybrid A*", summary: "考虑运动学约束的 Hybrid A* 规划。", detail: "全局规划常用；输出可行路径给局部规划器。" },
      { id: "f_teb", term: "TEB", title: "TEB", summary: "Timed Elastic Band 局部规划。", detail: "局部避障与轨迹平滑；保留作物安全距离。" },
      { id: "f_hybrid_teb", term: "Hybrid A*+TEB", title: "Hybrid A* + TEB", summary: "全局 + 局部规划组合。", detail: "三段论：SLAM 定位、分割感知、Hybrid A*+TEB 走且不伤作物。" },
      { id: "f_ros", term: "ROS", title: "ROS", summary: "Robot Operating System 机器人中间件。", detail: "提供节点通信、TF、导航栈等；田间联调基础。" },
      { id: "f_ros_nav", term: "ROS Navigation", title: "ROS Navigation", summary: "ROS 导航功能包栈。", detail: "集成定位、代价地图、全局/局部规划；你接入 Hybrid A* 与 TEB。" },
      { id: "f_plan", term: "路径规划", title: "路径规划", summary: "从起点到终点的可行/最优路径。", detail: "对比 A*/RRT*/Hybrid A*；田间要考虑作物安全距离。" },
      { id: "f_sw", term: "SOLIDWORKS", title: "SOLIDWORKS", summary: "三维机械结构设计软件。", detail: "用于巡检机器人外壳设计，支撑实地验证。" },
      { id: "f_track", term: "跟踪误差", title: "跟踪误差", summary: "实际轨迹与规划路径的偏差。", detail: "10m 行间实测 <15cm 是可量化指标，面试必讲。" },
      { id: "f_15cm", term: "15cm", title: "跟踪误差 <15cm", summary: "田间实测精度指标。", detail: "体现算法+结构+联调落地；比只报算法名更有说服力。" },
      { id: "f_greenhouse", term: "温室大棚", title: "温室大棚场景", summary: "无轨、窄通道、光照变化的农业场景。", detail: "痛点：人工巡检效率低成本高；机器人需适应弱纹理环境。" },
      { id: "f_inspect", term: "巡检", title: "智能巡检", summary: "自动巡视作物/设施状态。", detail: "感知+规划+结构+实地验证构成完整闭环。" }
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
    ],
    terms: [
      { id: "z_rag", term: "RAG", title: "RAG", summary: "Retrieval-Augmented Generation，检索增强生成。", detail: "先查农业知识库再生成回答，减少幻觉、可溯源。" },
      { id: "z_agent", term: "Multi-Agent", title: "Multi-Agent", summary: "多智能体协同调度。", detail: "不同 Agent 负责识别、检索、工具调用；平台能力之一。" },
      { id: "z_multi", term: "多模态", title: "多模态识别", summary: "融合图像、文本等多种输入。", detail: "病虫害识别可结合图像+描述；体现平台 AI 能力广度。" },
      { id: "z_cache_w", term: "先更新 DB 再删缓存", title: "Cache-Aside 写路径", summary: "写库成功后再删缓存。", detail: "大模型对话上下文一致性方案；配合分布式重试。" },
      { id: "z_cache", term: "缓存一致性", title: "缓存一致性", summary: "缓存与数据库最终一致。", detail: "你负责「缓存一致性治理」；读写路径都要能讲清。" },
      { id: "z_retry", term: "分布式重试", title: "分布式重试", summary: "删缓存/写库失败时跨节点重试。", detail: "保证最终一致；注意幂等与重试风暴。" },
      { id: "z_sync", term: "synchronized", title: "synchronized 互斥", summary: "JVM 内置锁，防止缓存击穿。", detail: "高并发跳转时互斥回源，只有一个线程查 DB。" },
      { id: "z_hit", term: "击穿", title: "缓存击穿", summary: "热点 key 过期，并发打穿到 DB。", detail: "用 synchronized / 逻辑过期 / 永不过期等治理。" },
      { id: "z_pierce", term: "穿透", title: "缓存穿透", summary: "查询不存在的数据，缓存无效。", detail: "布隆过滤器 + 空值缓存；与击穿、雪崩区分。" },
      { id: "z_avalanche", term: "雪崩", title: "缓存雪崩", summary: "大量 key 同时过期或 Redis 故障。", detail: "过期加随机抖动、集群高可用、限流降级。" },
      { id: "z_bigkey", term: "大 Key", title: "Redis 大 Key", summary: "体积过大的缓存键。", detail: "阻塞网络、拖慢 Redis；短链/跳转场景要避免。" },
      { id: "z_shard", term: "ShardingSphere", title: "ShardingSphere", summary: "Apache 分库分表中间件。", detail: "短链基因法分表、读写分离；Java 生态常用。" },
      { id: "z_gene", term: "基因法分表", title: "基因法分表", summary: "分片位编码进业务 ID。", detail: "解析短链即可路由分片，无需二次查路由表。" },
      { id: "z_shard_full", term: "ShardingSphere 基因法分表", title: "ShardingSphere 基因法", summary: "短链分表完整方案。", detail: "分表信息嵌入短链，查询性能近翻倍（口述指标）。" },
      { id: "z_short", term: "短链接", title: "短链接系统", summary: "长 URL 映射为短码跳转。", detail: "你优化的高并发模块：分表 + 号段发号 + 缓存防击穿。" },
      { id: "z_seg_id", term: "批量号段", title: "Redis 批量号段", summary: "一次取一段 ID 本地发号。", detail: "降低 Redis RTT；AtomicLong 自增消耗号段。" },
      { id: "z_atomic", term: "AtomicLong", title: "AtomicLong", summary: "JUC 原子长整型，线程安全自增。", detail: "本地发号无锁自增；号段用尽再向 Redis 申请。" },
      { id: "z_rocket", term: "RocketMQ", title: "RocketMQ", summary: "阿里开源消息队列。", detail: "异步解耦、削峰填谷；平台技术栈之一。" },
      { id: "z_sentinel", term: "Sentinel", title: "Sentinel", summary: "流量控制、熔断降级组件。", detail: "高并发链路保护；与 Hystrix 类似，国内常用。" },
      { id: "z_hc", term: "高并发", title: "高并发", summary: "大流量下系统仍稳定可用。", detail: "你负责高并发链路：短链跳转、缓存治理、分片扩展。" },
      { id: "z_final", term: "最终一致", title: "最终一致性", summary: "允许短暂不一致，最终数据对齐。", detail: "对话上下文、缓存与 DB 的典型一致性级别。" },
      { id: "z_llm", term: "大模型", title: "大模型对话", summary: "LLM 多轮对话与上下文管理。", detail: "上下文缓存一致性是你负责点之一。" }
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
    ],
    terms: [
      { id: "p_canvas", term: "Canvas", title: "Canvas 画框标注", summary: "小程序画布组件画矩形框。", detail: "标注病害区域，导出 YOLO/XML 格式训练数据。" },
      { id: "p_yolo", term: "YOLO", title: "YOLO 标注格式", summary: "归一化中心点+宽高标注格式。", detail: "与 XML 并列导出；对接训练 pipeline。" },
      { id: "p_xml", term: "XML", title: "XML 标注", summary: "另一种常见标注交换格式。", detail: "部分数据集/工具链使用；与 YOLO 双格式导出。" },
      { id: "p_onnx", term: "ONNX", title: "ONNX", summary: "开放神经网络交换格式。", detail: "模型导出为 .onnx，端侧 createInferenceSession 加载。" },
      { id: "p_yolov8", term: "YOLOv8", title: "YOLOv8", summary: "Ultralytics 新一代检测模型。", detail: "训练后导出 ONNX；端侧推理识别病害。" },
      { id: "p_pre", term: "预处理", title: "推理预处理", summary: "缩放、归一化、letterbox 等。", detail: "输入尺寸对齐模型；输出坐标要映射回原图。" },
      { id: "p_nms", term: "NMS", title: "NMS", summary: "Non-Maximum Suppression，非极大值抑制。", detail: "去重叠检测框；按置信度+IoU 阈值筛选。" },
      { id: "p_iou", term: "IoU", title: "IoU", summary: "Intersection over Union，框重叠度。", detail: "NMS 核心指标；阈值决定保留哪几个框。" },
      { id: "p_fill", term: "结果回填", title: "结果回填", summary: "把推理框画回界面/标注层。", detail: "推理后更新 Canvas 显示，辅助人工校对。" },
      { id: "p_infer", term: "InferenceSession", title: "InferenceSession", summary: "微信小程序端侧推理会话。", detail: "wx.createInferenceSession 加载 ONNX；主推理路径。" },
      { id: "p_create_infer", term: "createInferenceSession", title: "createInferenceSession", summary: "小程序创建推理会话 API。", detail: "主路径成功则走深度学习；失败降级 HSV。" },
      { id: "p_hsv", term: "HSV", title: "HSV 颜色空间", summary: "色调-饱和度-明度，用于颜色分割。", detail: "规则引擎兜底：按颜色阈值分割病害区域。" },
      { id: "p_dual", term: "双推理引擎", title: "双推理引擎", summary: "深度学习 + 规则引擎两套推理。", detail: "主路径 ONNX，失败走 Canvas+HSV，体现「能跑还要兜底」。" },
      { id: "p_cdn", term: "CDN", title: "CDN", summary: "内容分发网络，远程托管大模型。", detail: "突破小程序 2MB 包限制；静默下载缓存。" },
      { id: "p_mp", term: "小程序", title: "微信小程序", summary: "端侧运行环境，包体积受限。", detail: "独立开发；ONNX 推理 + 采集标注一体化。" },
      { id: "p_json", term: "JSON", title: "JSON 导出", summary: "结构化数据导出格式。", detail: "与 CSV 并列，供训练与统计分析。" },
      { id: "p_csv", term: "CSV", title: "CSV 导出", summary: "表格化导出，方便 Excel 分析。", detail: "采集元数据与标注结果批量导出。" },
      { id: "p_edge", term: "端侧", title: "端侧 AI", summary: "在设备本地跑推理，不依赖云端。", detail: "低延迟、隐私好；受机型与包体积约束。" }
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
    ],
    terms: [
      { id: "s_star", term: "STAR", title: "STAR 口述结构", summary: "Situation → Task → Action → Result。", detail: "每段 15–20 秒：背景→职责→动作→指标。" },
      { id: "s_ddod_occ", term: "DDOD/OCC", title: "DDOD/OCC", summary: "Momenta 数据平台与 OCC 工作流。", detail: "实习一句话：自动驾驶数据生产 + OCC 工作流后端。" },
      { id: "s_tool", term: "Tool Calling", title: "Tool Calling", summary: "大模型调用外部工具/API。", detail: "与 RAG、Multi-Agent 并列，体现 Agent 能力。" },
      { id: "s_onnx_edge", term: "端侧 ONNX", title: "端侧 ONNX", summary: "小程序本地跑 ONNX 模型。", detail: "水果小程序独立交付能力。" }
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
