import type { DecisionTensionData } from "./types";

export const customer = {
  name: "刘浩",
  stage: "深度意向期",
  currentOwner: "王芳",
  ownerRole: "销售",
  routeStatus: "进行中",
  risk: "medium",
  reviewState: "pending",
  yourMode: "owner",
  summaryBlock: {
    customerIdentity: {
      name: "刘浩",
      stage: "深度意向期",
      profileLine: "38岁｜已婚｜技术决策型",
    },
    stateSummary: "当前处于双人决策阶段，配偶品牌偏好成为主要阻力。",
    assignment: {
      owner: { name: "王芳", role: "销售" },
      collaborators: [
        { name: "李明", role: "客服", type: "协同支持" },
        { name: "赵晨", role: "售前", type: "待命支持" },
      ],
      supervisor: { name: "周岚", role: "销售经理", type: "管理监督" },
    },
    workflow: {
      progressStatus: "销售推进中",
      currentTask: "家庭体验邀约方案待确认",
      risk: {
        level: "中风险",
        reason: "配偶品牌认知阻力未解决",
      },
      reviewStatus: "待销售经理确认",
      mode: "负责人模式",
    },
  },
  confidence: 72,
  stateVersion: "v1.4",
  lastUpdated: "2024年11月17日 16:10",
  stateSummary:
    "客户已完成第二次试驾，对辅助驾驶体验满意，但对价格区间仍有抵触。近期配偶加入决策链，决策时间线可能延长 1 至 2 周。",
  customerStateDetail: {
    summary: {
      stateVersion: "v1.4",
      updatedAt: "2024年11月17日 16:10",
      summaryText: "技术体验认可度已形成，但家庭共识与服务信任尚未闭环，当前不宜直接进入成交推进。",
    },
    decisionRelevantTraits: [
      {
        label: "决策结构",
        value: "已婚，配偶已加入决策",
        impact: "当前关系模式已从单人评估转向双人协商，关键动作需面向双方共同推进。",
      },
      {
        label: "信息偏好",
        value: "理性比对型，重视实测与参数对照",
        impact: "当前动作更适合提供对比材料与实测证据，而不是直接推进情绪型逼单。",
      },
      {
        label: "预算边界",
        value: "35 至 42 万元，存在明确上限",
        impact: "价格 objection 会持续影响推进节奏，金融方案验证前不适合定型报价策略。",
      },
      {
        label: "时间窗口",
        value: "春节前提车意愿明确，实际窗口约 3 周",
        impact: "若 1 至 2 周内无法收敛家庭共识，将直接压缩成交推进与交付排产窗口。",
      },
    ],
    actionable: [
      "当前处于深度意向期，仍有继续推进的业务价值。",
      "智能驾驶体验是主要吸引点，可作为家庭体验邀约的切入口。",
      "当前 owner 仍应由销售主导，客服与售前提供材料支持即可。",
      "下一步更适合推进家庭体验邀约，而不是直接进入成交推进或价格逼单。",
    ],
    keyValidationItems: [
      {
        priority: "P1",
        title: "配偶真实顾虑未被直接验证",
        affects: "关系模式 / 核心 objection",
        gap: "当前只有刘浩转述，没有配偶本人直接表达，无法确认真实阻力究竟是品牌偏好、预算，还是家庭使用场景。",
        impact: "当前不宜直接进入成交推进，否则动作会建立在错误阻力判断上。",
        suggestion: "安排双人体验沟通，直接确认配偶核心顾虑。",
      },
      {
        priority: "P1",
        title: "金融承受区间未确认",
        affects: "推荐动作 / 报价策略",
        gap: "尚未确认客户能够接受的月供区间，也没有完成可行的金融试算对齐。",
        impact: "报价节奏不能定型，容易提前触发价格防御。",
        suggestion: "提供金融方案试算，并确认月供接受范围。",
      },
      {
        priority: "P2",
        title: "售后承诺文件未核实",
        affects: "服务信任",
        gap: "当前缺少明确的服务响应凭证或承诺材料，服务信任仍停留在口头层面。",
        impact: "会削弱服务信任说服力，也无法确认是否适合推进签约相关动作。",
        suggestion: "补充售后服务响应说明或承诺材料。",
      },
    ],
    tension: {
      title: "智能体验诉求 vs 家庭品牌与价格顾虑",
      leftLabel: "想要更强智能体验",
      leftSummary: "刘浩已认可辅助驾驶与技术体验，希望保留高感知差异点。",
      leftForces: ["第二次试驾后对辅助驾驶体验满意", "技术体验认可度高", "春节前交付意愿明确"],
      rightLabel: "家庭品牌与价格顾虑",
      rightSummary: "配偶品牌偏好更强，价格与服务信任一起拉住决策继续前进。",
      rightForces: ["配偶偏好传统品牌", "价格较竞品高 2 至 3 万", "售后覆盖与服务信任尚未充分建立"],
      currentBalance: "当前更受家庭品牌顾虑与价格敏感主导",
      balanceDirection: "right",
      whyItMatters: "如果继续主推高配体验而不先处理配偶品牌认知，成交阻力会继续上升。",
      actionHint: "优先组织面向夫妻双方的家庭体验与品牌对比说明，不要先推进高配报价。",
      evidenceEntryLabel: "Based on 3 signals",
      evidence: ["第二次试驾后对辅助驾驶体验满意", "客户明确提到配偶尚未参与决策", "客户持续表达对价格区间的抵触"],
    } satisfies DecisionTensionData,
  },
  unresolvedQuestions: ["配偶的具体顾虑是否被直接倾听过？", "金融方案能否实现月供低于 6,000 元？", "成都东区售后响应时效有无承诺文件？"],
  currentTask: {
    title: "推进配偶参与的双人体验邀约",
    why: "刘浩已进入高意向阶段，但配偶是当前主要阻力。尚未有针对配偶的直接触达或体验。",
    recommendedAction: "本周内邀请刘浩配偶参加周末家庭专场试驾活动，同时准备品牌价值与竞品的非技术对比材料。",
    blockedActions: ["不得直接致电配偶（未获联系授权）", "不得承诺额外折扣（需区域经理审批）"],
    timeWindow: "2024年11月18日至11月22日",
    reviewState: "需销售经理确认邀约方案",
    agentDraft: "「刘总，您上次提到夫人也在参与选车，我们本周六有个家庭体验日，专门为双方决策设计，不涉及任何销售压力……」",
  },
  events: [
    { id: "E-041", type: "SALES_VISIT", typeLabel: "销售拜访", owner: "王芳", date: "11月17日", summary: "第二次试驾完成，导航辅助驾驶体验评价高。客户提出配偶尚未参与决策。", status: "已完成" },
    { id: "E-040", type: "PRE_SALES", typeLabel: "售前咨询", owner: "赵晨", date: "11月15日", summary: "围绕智能驾驶能力做了重点说明，明确 NOA、泊车辅助与安全冗余边界，帮助客户建立了对技术能力的初步认知。", status: "已完成" },
    { id: "E-039", type: "CS_OUTREACH", typeLabel: "客服触达", owner: "李明", date: "11月14日", summary: "主动关怀：回应冬季续航疑虑，发送实测数据报告。客户已确认满意。", status: "已完成" },
    { id: "E-038", type: "SALES_VISIT", typeLabel: "销售拜访", owner: "王芳", date: "11月10日", summary: "首次试驾。续航和充电覆盖有疑虑，未明确决策时间线。", status: "已完成" },
  ],
  stateVersions: [
    { version: "v1.4", level: "重要更新", trigger: "E-040 · 配偶加入决策链", changed: ["决策张力结构", "待验证项增加 1 条", "决策结构更新", "优先事项增加 1 项"], approvedBy: "王芳", agents: ["状态整理助手", "旅程编排助手"], note: "决策结构变化触发重要更新，需销售经理知悉。", date: "11月17日" },
    { version: "v1.3", level: "一般更新", trigger: "E-039 · CS 回应冬季续航", changed: ["冬季续航异议 → 已解决"], approvedBy: "李明", agents: ["客户助手"], note: "低风险自动记录。", date: "11月14日" },
    { version: "v1.2", level: "重要更新", trigger: "E-038 · 首次试驾反馈", changed: ["优先事项", "异议项", "时间线", "初始置信度"], approvedBy: "王芳", agents: ["状态整理助手", "旅程编排助手", "客户助手"], note: "首次完整状态建立，需销售负责人确认。", date: "11月10日" },
  ],
  contactReadiness: {
    allowed: ["发送售后服务覆盖资料（成都区域）", "邀请家庭体验活动（通过刘浩转达）", "提供金融方案模拟计算器链接"],
    blocked: ["直接联系配偶（无联系授权）", "承诺额外折扣或优惠（需经理审批）", "分享竞品对比材料（合规限制）"],
    channel: "微信",
    channelNote: "客户明确表示偏好",
    temp: "warm",
    tempLabel: "较热",
    contacts: [
      { date: "11月14日", channel: "微信", type: "主动关怀", result: "positive" },
      { date: "11月10日", channel: "到店", type: "试驾", result: "positive" },
    ],
  },
  recommendedOutreach: {
    goal: "确认家庭体验日邀约意向，铺垫配偶参与场景",
    style: "非销售型，以家庭生活场景切入，避免价格和技术参数",
    window: "11月18日至11月20日，工作日晚间 18:00 至 20:00",
    review: "需销售经理确认邀约文本",
    script: "「刘总，想问问您周末有没有时间，我们有个家庭体验活动，主要让家人也感受一下……」（角色助手可生成完整版，人工确认后使用）",
  },
} as const;

export const profileUpdatePacket = {
  title: "确认客户画像更新",
  status: "待确认",
  priorities: ["配偶认可度（新增，优先级高）", "品牌认知与功能体验的决策权重"],
  objections: ["配偶偏好传统品牌（新增）", "价格偏高（确认，持续）"],
  tension: {
    title: "功能体验偏好 vs 品牌认知与价格阻力",
    leftLabel: "想保留功能体验优势",
    leftSummary: "刘浩本人对智能系统有明显偏好，技术体验是当前最强吸引点。",
    leftForces: ["挺喜欢这个车的智能系统", "个人偏好更偏向功能体验", "已具备进一步比较意愿"],
    rightLabel: "品牌认知与价格阻力",
    rightSummary: "配偶对品牌档次有明显顾虑，价格偏高进一步放大犹豫。",
    rightForces: ["他老婆更想买奔驰", "觉得不够档次", "价格高了点"],
    currentBalance: "当前仍由品牌认知顾虑主导，价格阻力次级跟随",
    balanceDirection: "right",
    whyItMatters: "如果销售继续只讲参数，无法处理真正的家庭决策阻力，下一步推进会卡住。",
    actionHint: "先准备品牌对比与家庭场景体验，再决定是否进入报价或金融方案沟通。",
    evidenceEntryLabel: "Based on 3 signals",
    evidence: ["「他老婆更想买奔驰」→ 配偶主动偏好", "「觉得不够档次」→ 品牌感知障碍", "「价格高了点」→ 价格阻力确认"],
  } satisfies DecisionTensionData,
} as const;

export const myWorkbench = {
  summary: { todoCount: 4, inProgressCount: 2, pendingApprovalCount: 3, newAssignedCount: 1, highRiskCount: 2 },
  tasks: {
    pending: [
      { customerName: "刘浩", stage: "深度意向期", taskTitle: "家庭体验邀约方案确认", status: "待执行", risk: "中风险", dueTime: "今天 18:00", ownerReason: "客户进入双人决策阶段，当前 owner 为你，需要你确认邀约节奏。" },
      { customerName: "王洁", stage: "方案评估期", taskTitle: "预算顾虑升级后的跟进策略确定", status: "待执行", risk: "高风险", dueTime: "今天 17:30", ownerReason: "风险等级上调后由系统路由给当前业务 owner 优先处理。" },
    ],
    inProgress: [
      { customerName: "陈晨", stage: "对比评估期", taskTitle: "补充技术疑问回访记录", status: "执行中", risk: "低风险", dueTime: "今天 20:00", ownerReason: "客户状态版本刚更新，需要你补齐一线记录后继续推进。" },
      { customerName: "林楠", stage: "成交推进期", taskTitle: "金融方案二次确认与交付窗口锁定", status: "执行中", risk: "中风险", dueTime: "明天 11:00", ownerReason: "你是当前成交 owner，且交付窗口进入锁定期。" },
    ],
    submitted: [{ customerName: "周宁", stage: "意向确认期", taskTitle: "门店体验反馈已提交待状态更新", status: "已提交待更新", risk: "低风险", dueTime: "等待系统回写", ownerReason: "你提交的执行材料正在等待状态整理与版本回写。" }],
    completed: [{ customerName: "何静", stage: "已完成签约", taskTitle: "交车前最终确认", status: "已完成", risk: "低风险", dueTime: "今天 09:20 已完成", ownerReason: "该客户上一轮已由你完成关键动作，本事项已闭环。" }],
  },
  approvals: [
    { customerName: "刘浩", source: "销售 Agent", type: "待审批分析结果", status: "待审批", submittedAt: "今天 10:20" },
    { customerName: "陈晨", source: "Customer Agent", type: "待确认状态更新", status: "待确认", submittedAt: "今天 14:10" },
    { customerName: "王洁", source: "CS Agent", type: "待确认动作建议", status: "待 review / override", submittedAt: "今天 15:35" },
  ],
  alerts: [
    { customerName: "王洁", type: "风险升高", message: "预算顾虑上升，建议今日跟进，避免进入竞品比较拉锯。" },
    { customerName: "陈晨", type: "owner 切换", message: "状态版本更新后已切换到你，当前需补齐回访记录并确认下一步动作。" },
    { customerName: "林楠", type: "新客户分配给我", message: "成交窗口压缩到 48 小时内，系统按成交优先级分配给你处理。" },
    { customerName: "刘浩", type: "状态版本更新", message: "配偶参与决策已进入主状态版本，需要你确认邀约方案与审批结果。" },
  ],
} as const;

export const stateGovernanceWorkbench = {
  summary: { activeRulesCount: 24, pendingChangesCount: 3, recentChangesCount: 5, governedPagesCount: 4 },
  stateDimensions: [
    { name: "旅程阶段", code: "Journey Stage", description: "定义客户所处推进阶段，并决定默认 owner 与板块优先级。", versioned: true, visibleOnTop: true, sharedAcrossRoles: true, pages: ["客户状态工作台", "我的工作台"], roles: ["销售", "客服", "经理"] },
    { name: "优先关注项", code: "Priority", description: "记录当前最值得处理的推进重点，用于任务编排与首屏提示。", versioned: true, visibleOnTop: true, sharedAcrossRoles: true, pages: ["客户状态工作台", "我的工作台"], roles: ["销售", "客服"] },
    { name: "异议事项", code: "Objection", description: "沉淀客户明确表达或推断出的持续阻力。", versioned: true, visibleOnTop: false, sharedAcrossRoles: true, pages: ["客户状态工作台", "当前任务区"], roles: ["销售", "客服", "售前"] },
    { name: "决策张力", code: "Tension", description: "描述当前最关键的决策拉扯，而非简单标签罗列。", versioned: true, visibleOnTop: true, sharedAcrossRoles: true, pages: ["客户状态工作台", "销售轻记录"], roles: ["销售", "经理"] },
    { name: "关系模式", code: "Relationship Mode", description: "定义当前是单人、双人还是多人协同决策结构。", versioned: true, visibleOnTop: false, sharedAcrossRoles: true, pages: ["客户状态工作台"], roles: ["销售", "客服"] },
    { name: "建议动作", code: "Recommended Action", description: "给出当前最合适的业务动作，但不直接等同于正式任务。", versioned: false, visibleOnTop: true, sharedAcrossRoles: false, pages: ["我的工作台", "当前任务区"], roles: ["销售 owner", "客服 owner"] },
    { name: "证据与不确定性", code: "Evidence / Uncertainty", description: "说明当前判断基于什么证据，以及缺口在哪里。", versioned: true, visibleOnTop: false, sharedAcrossRoles: true, pages: ["客户状态工作台", "销售轻记录", "客服触达检查"], roles: ["销售", "客服", "经理"] },
    { name: "角色视角解释", code: "Role-specific Interpretation", description: "允许销售、客服、经理看到不同解释口径，但不改写统一 State。", versioned: false, visibleOnTop: false, sharedAcrossRoles: false, pages: ["我的工作台", "客服触达检查"], roles: ["销售", "客服", "经理"] },
  ],
  workspaceModules: {
    customerWorkspace: {
      name: "客户状态工作台",
      modules: [
        { name: "当前客户承接卡", firstScreen: true, collapsible: false, order: 1, note: "固定置顶，承载 owner 与当前推进状态。" },
        { name: "客户状态详情", firstScreen: true, collapsible: false, order: 2, note: "展示正式 State 结构与证据来源。" },
        { name: "事件与版本", firstScreen: false, collapsible: true, order: 3, note: "用于追溯状态变更与触达历史。" },
        { name: "责任移交记录", firstScreen: false, collapsible: true, order: 4, note: "仅高权限角色默认展开。" },
      ],
      toggles: [{ label: "显示“可行动 / 待验证”", enabled: true }, { label: "显示“判断相关特征”", enabled: true }, { label: "显示“责任移交记录”", enabled: true }],
    },
    myWorkbench: {
      name: "我的工作台",
      modules: [
        { name: "今日待处理总览", firstScreen: true, collapsible: false, order: 1, note: "对 owner 呈现当日待办、待批、提醒。" },
        { name: "我的任务", firstScreen: true, collapsible: false, order: 2, note: "按当前责任与时效排序。" },
        { name: "待我审批", firstScreen: true, collapsible: true, order: 3, note: "承接 agent 输出审批。" },
        { name: "系统提醒", firstScreen: false, collapsible: true, order: 4, note: "仅异常路由与高风险变更置顶。" },
      ],
      toggles: [{ label: "首屏显示“当前 owner”", enabled: true }, { label: "显示 manager override trace", enabled: false }, { label: "显示整体状态可信度", enabled: false }],
    },
    taskPanel: {
      name: "当前任务区",
      modules: [
        { name: "待执行", firstScreen: true, collapsible: false, order: 1, note: "面向单任务的执行入口。" },
        { name: "执行中", firstScreen: true, collapsible: false, order: 2, note: "保留执行材料与一线记录。" },
        { name: "整理中", firstScreen: false, collapsible: false, order: 3, note: "聚合本轮执行材料并生成候选报告。" },
        { name: "确认本轮结果", firstScreen: false, collapsible: false, order: 4, note: "进入 owner 或 manager 审核确认流。" },
        { name: "已提交", firstScreen: false, collapsible: false, order: 5, note: "作为任务闭环与版本触发点。" },
      ],
      toggles: [{ label: "默认显示执行材料区", enabled: true }, { label: "显示跨角色解释差异", enabled: false }, { label: "显示审批前后 diff", enabled: true }],
    },
  },
  ownershipRules: [
    { scenario: "成交前默认主导", rule: "销售为 owner，客服与售前以协同身份进入。", trigger: "客户仍处于意向、试驾、方案评估或成交推进阶段", mode: "自动切换", review: "无需 manager review" },
    { scenario: "交付后默认主导", rule: "售后或客服成为 owner，销售转为支持角色。", trigger: "状态进入交付、售后服务、复购培育阶段", mode: "自动切换", review: "关键客户可被 manager override" },
    { scenario: "技术验证升高", rule: "售前进入主导候选，但需销售 owner 确认。", trigger: "客户决策高度依赖技术验证、方案定制或竞品对照", mode: "建议切换", review: "owner 审批后生效" },
    { scenario: "风险冲突升高", rule: "route 必须升级到经理 review，禁止自动换 owner。", trigger: "高风险、跨角色争议、合规边界不清", mode: "禁止自动切换", review: "必须 manager review" },
  ],
  changeLog: [
    { changedBy: "Vicky", change: "新增“可行动 / 待验证”板块", effectiveAt: "2026-03-21 10:30", impact: "客户状态工作台", roleImpact: "销售、客服", agentImpact: "Customer Agent", status: "已生效" },
    { changedBy: "周岚", change: "关闭“整体状态可信度”首屏显示", effectiveAt: "2026-03-21 09:40", impact: "我的工作台", roleImpact: "销售 owner", agentImpact: "Journey Orchestrator", status: "已生效" },
    { changedBy: "Vicky", change: "提高高风险 route 的 manager review 门槛", effectiveAt: "2026-03-21 08:55", impact: "状态路由规则", roleImpact: "经理、销售", agentImpact: "Journey Orchestrator", status: "待发布" },
    { changedBy: "李明", change: "补充客服 Agent 对服务承诺草稿的写入边界", effectiveAt: "2026-03-20 17:20", impact: "客服触达检查", roleImpact: "客服", agentImpact: "客服 Agent", status: "已生效" },
    { changedBy: "Vicky", change: "新增“决策张力”进入正式版本沉淀", effectiveAt: "2026-03-20 16:10", impact: "Customer State", roleImpact: "销售、经理", agentImpact: "Customer Agent", status: "已生效" },
  ],
} as const;
