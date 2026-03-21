import { useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type PageId = "myWorkbench" | "workspaceSales" | "workspaceCs" | "sales" | "cs" | "governance";
type PillVariant = "green" | "blue" | "amber" | "red" | "neutral";
type TagVariant = PillVariant | "purple";

type StatusPillProps = {
  label: string;
  variant: PillVariant;
};

type TagProps = {
  label: string;
  variant?: TagVariant;
  small?: boolean;
};

type SectionTitleProps = {
  children: ReactNode;
  style?: CSSProperties;
};

type RowProps = {
  children: ReactNode;
  last?: boolean;
  style?: CSSProperties;
};

type CardProps = {
  children: ReactNode;
  style?: CSSProperties;
  noPad?: boolean;
};

type HeaderProps = {
  page: PageId;
};

type ApprovalItem = (typeof myWorkbench.approvals)[number];

type WorkspacePageProps = {
  roleVariant: "sales" | "cs";
  taskPanelState: TaskPanelState;
  setTaskPanelState: (state: TaskPanelState) => void;
  onOpenMessages: () => void;
};

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
};

type DecisionTensionData = {
  title: string;
  leftLabel: string;
  leftSummary: string;
  leftForces: readonly string[];
  rightLabel: string;
  rightSummary: string;
  rightForces: readonly string[];
  currentBalance: string;
  balanceDirection: "left" | "right" | "center";
  whyItMatters: string;
  actionHint: string;
  evidenceEntryLabel: string;
  evidence: readonly string[];
};

type TaskPanelState = "待执行" | "执行中" | "整理中" | "确认本轮结果" | "已提交";

const C = {
  bg: "#F6F8FB",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FAFC",
  border: "#E6EAF0",
  borderMd: "#D7DEE8",
  text0: "#1F2937",
  text1: "#4B5563",
  text2: "#8B96A8",
  text3: "#BEC6D2",
  blue: "#4F6EF7",
  blueLight: "#F3F6FF",
  blueBorder: "#D7DFFF",
  green: "#5B9A74",
  greenLight: "#F4FAF6",
  greenBorder: "#D9EBDC",
  amber: "#BE8A36",
  amberLight: "#FCF8EF",
  amberBorder: "#EEDDB9",
  red: "#C86D67",
  redLight: "#FEF7F6",
  redBorder: "#F0D7D4",
  brick: "#4F6EF7",
  mono: "'JetBrains Mono', 'IBM Plex Mono', monospace",
  sans: "'Inter', 'DM Sans', system-ui, sans-serif",
} as const;

const customer = {
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
    },
  },
  unresolvedQuestions: [
    "配偶的具体顾虑是否被直接倾听过？",
    "金融方案能否实现月供低于 6,000 元？",
    "成都东区售后响应时效有无承诺文件？",
  ],
  currentTask: {
    title: "推进配偶参与的双人体验邀约",
    why: "刘浩已进入高意向阶段，但配偶是当前主要阻力。尚未有针对配偶的直接触达或体验。",
    recommendedAction:
      "本周内邀请刘浩配偶参加周末家庭专场试驾活动，同时准备品牌价值与竞品的非技术对比材料。",
    blockedActions: ["不得直接致电配偶（未获联系授权）", "不得承诺额外折扣（需区域经理审批）"],
    timeWindow: "2024年11月18日至11月22日",
    reviewState: "需销售经理确认邀约方案",
    agentDraft:
      "「刘总，您上次提到夫人也在参与选车，我们本周六有个家庭体验日，专门为双方决策设计，不涉及任何销售压力……」",
  },
  events: [
    {
      id: "E-041",
      type: "SALES_VISIT",
      typeLabel: "销售拜访",
      owner: "王芳",
      date: "11月17日",
      summary: "第二次试驾完成，导航辅助驾驶体验评价高。客户提出配偶尚未参与决策。",
      status: "已完成",
    },
    {
      id: "E-040",
      type: "PRE_SALES",
      typeLabel: "售前咨询",
      owner: "赵晨",
      date: "11月15日",
      summary: "围绕智能驾驶能力做了重点说明，明确 NOA、泊车辅助与安全冗余边界，帮助客户建立了对技术能力的初步认知。",
      status: "已完成",
    },
    {
      id: "E-039",
      type: "CS_OUTREACH",
      typeLabel: "客服触达",
      owner: "李明",
      date: "11月14日",
      summary: "主动关怀：回应冬季续航疑虑，发送实测数据报告。客户已确认满意。",
      status: "已完成",
    },
    {
      id: "E-038",
      type: "SALES_VISIT",
      typeLabel: "销售拜访",
      owner: "王芳",
      date: "11月10日",
      summary: "首次试驾。续航和充电覆盖有疑虑，未明确决策时间线。",
      status: "已完成",
    },
  ],
  stateVersions: [
    {
      version: "v1.4",
      level: "重要更新",
      trigger: "E-040 · 配偶加入决策链",
      changed: ["决策张力结构", "待验证项增加 1 条", "决策结构更新", "优先事项增加 1 项"],
      approvedBy: "王芳",
      agents: ["状态整理助手", "旅程编排助手"],
      note: "决策结构变化触发重要更新，需销售经理知悉。",
      date: "11月17日",
    },
    {
      version: "v1.3",
      level: "一般更新",
      trigger: "E-039 · CS 回应冬季续航",
      changed: ["冬季续航异议 → 已解决"],
      approvedBy: "李明",
      agents: ["客户助手"],
      note: "低风险自动记录。",
      date: "11月14日",
    },
    {
      version: "v1.2",
      level: "重要更新",
      trigger: "E-038 · 首次试驾反馈",
      changed: ["优先事项", "异议项", "时间线", "初始置信度"],
      approvedBy: "王芳",
      agents: ["状态整理助手", "旅程编排助手", "客户助手"],
      note: "首次完整状态建立，需销售负责人确认。",
      date: "11月10日",
    },
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
    script:
      "「刘总，想问问您周末有没有时间，我们有个家庭体验活动，主要让家人也感受一下……」（角色助手可生成完整版，人工确认后使用）",
  },
} as const;

const profileUpdatePacket = {
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
  },
} as const;

const myWorkbench = {
  summary: {
    todoCount: 4,
    inProgressCount: 2,
    pendingApprovalCount: 3,
    newAssignedCount: 1,
    highRiskCount: 2,
  },
  tasks: {
    pending: [
      {
        customerName: "刘浩",
        stage: "深度意向期",
        taskTitle: "家庭体验邀约方案确认",
        status: "待执行",
        risk: "中风险",
        dueTime: "今天 18:00",
        ownerReason: "客户进入双人决策阶段，当前 owner 为你，需要你确认邀约节奏。",
      },
      {
        customerName: "王洁",
        stage: "方案评估期",
        taskTitle: "预算顾虑升级后的跟进策略确定",
        status: "待执行",
        risk: "高风险",
        dueTime: "今天 17:30",
        ownerReason: "风险等级上调后由系统路由给当前业务 owner 优先处理。",
      },
    ],
    inProgress: [
      {
        customerName: "陈晨",
        stage: "对比评估期",
        taskTitle: "补充技术疑问回访记录",
        status: "执行中",
        risk: "低风险",
        dueTime: "今天 20:00",
        ownerReason: "客户状态版本刚更新，需要你补齐一线记录后继续推进。",
      },
      {
        customerName: "林楠",
        stage: "成交推进期",
        taskTitle: "金融方案二次确认与交付窗口锁定",
        status: "执行中",
        risk: "中风险",
        dueTime: "明天 11:00",
        ownerReason: "你是当前成交 owner，且交付窗口进入锁定期。",
      },
    ],
    submitted: [
      {
        customerName: "周宁",
        stage: "意向确认期",
        taskTitle: "门店体验反馈已提交待状态更新",
        status: "已提交待更新",
        risk: "低风险",
        dueTime: "等待系统回写",
        ownerReason: "你提交的执行材料正在等待状态整理与版本回写。",
      },
    ],
    completed: [
      {
        customerName: "何静",
        stage: "已完成签约",
        taskTitle: "交车前最终确认",
        status: "已完成",
        risk: "低风险",
        dueTime: "今天 09:20 已完成",
        ownerReason: "该客户上一轮已由你完成关键动作，本事项已闭环。",
      },
    ],
  },
  approvals: [
    {
      customerName: "刘浩",
      source: "销售 Agent",
      type: "待审批分析结果",
      status: "待审批",
      submittedAt: "今天 10:20",
    },
    {
      customerName: "陈晨",
      source: "Customer Agent",
      type: "待确认状态更新",
      status: "待确认",
      submittedAt: "今天 14:10",
    },
    {
      customerName: "王洁",
      source: "CS Agent",
      type: "待确认动作建议",
      status: "待 review / override",
      submittedAt: "今天 15:35",
    },
  ],
  alerts: [
    {
      customerName: "王洁",
      type: "风险升高",
      message: "预算顾虑上升，建议今日跟进，避免进入竞品比较拉锯。",
    },
    {
      customerName: "陈晨",
      type: "owner 切换",
      message: "状态版本更新后已切换到你，当前需补齐回访记录并确认下一步动作。",
    },
    {
      customerName: "林楠",
      type: "新客户分配给我",
      message: "成交窗口压缩到 48 小时内，系统按成交优先级分配给你处理。",
    },
    {
      customerName: "刘浩",
      type: "状态版本更新",
      message: "配偶参与决策已进入主状态版本，需要你确认邀约方案与审批结果。",
    },
  ],
} as const;

const stateGovernanceWorkbench = {
  summary: {
    activeRulesCount: 24,
    pendingChangesCount: 3,
    recentChangesCount: 5,
    governedPagesCount: 4,
  },
  stateDimensions: [
    {
      name: "旅程阶段",
      code: "Journey Stage",
      description: "定义客户所处推进阶段，并决定默认 owner 与板块优先级。",
      versioned: true,
      visibleOnTop: true,
      sharedAcrossRoles: true,
      pages: ["客户状态工作台", "我的工作台"],
      roles: ["销售", "客服", "经理"],
    },
    {
      name: "优先关注项",
      code: "Priority",
      description: "记录当前最值得处理的推进重点，用于任务编排与首屏提示。",
      versioned: true,
      visibleOnTop: true,
      sharedAcrossRoles: true,
      pages: ["客户状态工作台", "我的工作台"],
      roles: ["销售", "客服"],
    },
    {
      name: "异议事项",
      code: "Objection",
      description: "沉淀客户明确表达或推断出的持续阻力。",
      versioned: true,
      visibleOnTop: false,
      sharedAcrossRoles: true,
      pages: ["客户状态工作台", "当前任务区"],
      roles: ["销售", "客服", "售前"],
    },
    {
      name: "决策张力",
      code: "Tension",
      description: "描述当前最关键的决策拉扯，而非简单标签罗列。",
      versioned: true,
      visibleOnTop: true,
      sharedAcrossRoles: true,
      pages: ["客户状态工作台", "销售轻记录"],
      roles: ["销售", "经理"],
    },
    {
      name: "关系模式",
      code: "Relationship Mode",
      description: "定义当前是单人、双人还是多人协同决策结构。",
      versioned: true,
      visibleOnTop: false,
      sharedAcrossRoles: true,
      pages: ["客户状态工作台"],
      roles: ["销售", "客服"],
    },
    {
      name: "建议动作",
      code: "Recommended Action",
      description: "给出当前最合适的业务动作，但不直接等同于正式任务。",
      versioned: false,
      visibleOnTop: true,
      sharedAcrossRoles: false,
      pages: ["我的工作台", "当前任务区"],
      roles: ["销售 owner", "客服 owner"],
    },
    {
      name: "证据与不确定性",
      code: "Evidence / Uncertainty",
      description: "说明当前判断基于什么证据，以及缺口在哪里。",
      versioned: true,
      visibleOnTop: false,
      sharedAcrossRoles: true,
      pages: ["客户状态工作台", "销售轻记录", "客服触达检查"],
      roles: ["销售", "客服", "经理"],
    },
    {
      name: "角色视角解释",
      code: "Role-specific Interpretation",
      description: "允许销售、客服、经理看到不同解释口径，但不改写统一 State。",
      versioned: false,
      visibleOnTop: false,
      sharedAcrossRoles: false,
      pages: ["我的工作台", "客服触达检查"],
      roles: ["销售", "客服", "经理"],
    },
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
      toggles: [
        { label: "显示“可行动 / 待验证”", enabled: true },
        { label: "显示“判断相关特征”", enabled: true },
        { label: "显示“责任移交记录”", enabled: true },
      ],
    },
    myWorkbench: {
      name: "我的工作台",
      modules: [
        { name: "今日待处理总览", firstScreen: true, collapsible: false, order: 1, note: "对 owner 呈现当日待办、待批、提醒。" },
        { name: "我的任务", firstScreen: true, collapsible: false, order: 2, note: "按当前责任与时效排序。" },
        { name: "待我审批", firstScreen: true, collapsible: true, order: 3, note: "承接 agent 输出审批。" },
        { name: "系统提醒", firstScreen: false, collapsible: true, order: 4, note: "仅异常路由与高风险变更置顶。" },
      ],
      toggles: [
        { label: "首屏显示“当前 owner”", enabled: true },
        { label: "显示 manager override trace", enabled: false },
        { label: "显示整体状态可信度", enabled: false },
      ],
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
      toggles: [
        { label: "默认显示执行材料区", enabled: true },
        { label: "显示跨角色解释差异", enabled: false },
        { label: "显示审批前后 diff", enabled: true },
      ],
    },
  },
  agentRules: [
    {
      agent: "销售 Agent",
      outputs: ["推荐动作", "沟通草稿", "角色视角分析"],
      approvalRequired: true,
      managerReviewRequired: false,
      directWriteAllowed: false,
      writeBoundary: "仅可写入候选输出，不可改正式 State。",
    },
    {
      agent: "Customer Agent",
      outputs: ["候选状态更新", "证据归纳", "不确定性提示"],
      approvalRequired: true,
      managerReviewRequired: false,
      directWriteAllowed: false,
      writeBoundary: "不可直接写入正式 Customer State。",
    },
    {
      agent: "Journey Orchestrator",
      outputs: ["owner 建议", "route 建议", "下一步任务编排"],
      approvalRequired: true,
      managerReviewRequired: true,
      directWriteAllowed: false,
      writeBoundary: "高风险或跨角色切换时必须进入 manager review。",
    },
    {
      agent: "客服 Agent",
      outputs: ["触达建议", "风险提示", "服务说明草稿"],
      approvalRequired: true,
      managerReviewRequired: false,
      directWriteAllowed: false,
      writeBoundary: "不可承诺价格与跨权限政策。",
    },
  ],
  ownershipRules: [
    {
      scenario: "成交前默认主导",
      rule: "销售为 owner，客服与售前以协同身份进入。",
      trigger: "客户仍处于意向、试驾、方案评估或成交推进阶段",
      mode: "自动切换",
      review: "无需 manager review",
    },
    {
      scenario: "交付后默认主导",
      rule: "售后或客服成为 owner，销售转为支持角色。",
      trigger: "状态进入交付、售后服务、复购培育阶段",
      mode: "自动切换",
      review: "关键客户可被 manager override",
    },
    {
      scenario: "技术验证升高",
      rule: "售前进入主导候选，但需销售 owner 确认。",
      trigger: "客户决策高度依赖技术验证、方案定制或竞品对照",
      mode: "建议切换",
      review: "owner 审批后生效",
    },
    {
      scenario: "风险冲突升高",
      rule: "route 必须升级到经理 review，禁止自动换 owner。",
      trigger: "高风险、跨角色争议、合规边界不清",
      mode: "禁止自动切换",
      review: "必须 manager review",
    },
  ],
  changeLog: [
    {
      changedBy: "Vicky",
      change: "新增“可行动 / 待验证”板块",
      effectiveAt: "2026-03-21 10:30",
      impact: "客户状态工作台",
      roleImpact: "销售、客服",
      agentImpact: "Customer Agent",
      status: "已生效",
    },
    {
      changedBy: "周岚",
      change: "关闭“整体状态可信度”首屏显示",
      effectiveAt: "2026-03-21 09:40",
      impact: "我的工作台",
      roleImpact: "销售 owner",
      agentImpact: "Journey Orchestrator",
      status: "已生效",
    },
    {
      changedBy: "Vicky",
      change: "提高高风险 route 的 manager review 门槛",
      effectiveAt: "2026-03-21 08:55",
      impact: "状态路由规则",
      roleImpact: "经理、销售",
      agentImpact: "Journey Orchestrator",
      status: "待发布",
    },
    {
      changedBy: "李明",
      change: "补充客服 Agent 对服务承诺草稿的写入边界",
      effectiveAt: "2026-03-20 17:20",
      impact: "客服触达检查",
      roleImpact: "客服",
      agentImpact: "客服 Agent",
      status: "已生效",
    },
    {
      changedBy: "Vicky",
      change: "新增“决策张力”进入正式版本沉淀",
      effectiveAt: "2026-03-20 16:10",
      impact: "Customer State",
      roleImpact: "销售、经理",
      agentImpact: "Customer Agent",
      status: "已生效",
    },
  ],
} as const;

function StatusPill({ label, variant }: StatusPillProps) {
  const styles: Record<PillVariant, { color: string; bg: string; border: string }> = {
    green: { color: C.green, bg: C.greenLight, border: C.greenBorder },
    blue: { color: C.blue, bg: C.blueLight, border: C.blueBorder },
    amber: { color: C.amber, bg: C.amberLight, border: C.amberBorder },
    red: { color: C.red, bg: C.redLight, border: C.redBorder },
    neutral: { color: C.text2, bg: C.surfaceAlt, border: C.border },
  };
  const s = styles[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 11px",
        borderRadius: 20,
        border: `1.5px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        fontSize: 12.5,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function Tag({ label, variant = "neutral", small = false }: TagProps) {
  const styles: Record<TagVariant, { color: string; bg: string; border: string }> = {
    green: { color: C.green, bg: C.greenLight, border: C.greenBorder },
    amber: { color: C.amber, bg: C.amberLight, border: C.amberBorder },
    red: { color: C.red, bg: C.redLight, border: C.redBorder },
    blue: { color: C.blue, bg: C.blueLight, border: C.blueBorder },
    neutral: { color: C.text1, bg: C.surfaceAlt, border: C.border },
    purple: { color: "#667085", bg: "#F7F8FB", border: "#E4E7EC" },
  };
  const s = styles[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: small ? "2px 8px" : "4px 10px",
        borderRadius: 999,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        fontSize: small ? 10.5 : 11.5,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function SectionTitle({ children, style = {} }: SectionTitleProps) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.8,
        color: C.text2,
        textTransform: "uppercase",
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Row({ children, last = false, style = {} }: RowProps) {
  return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 0",
          borderBottom: last ? "none" : `1px solid ${C.border}`,
          ...style,
        }}
    >
      {children}
    </div>
  );
}

function Card({ children, style = {}, noPad = false }: CardProps) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
        ...(noPad ? {} : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardPad({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ padding: "18px 20px", ...style }}>{children}</div>;
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 75 ? C.green : value >= 55 ? C.amber : C.red;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          flex: 1,
          height: 5,
          background: C.surfaceAlt,
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 32, textAlign: "right" }}>{value}%</span>
      <span style={{ fontSize: 11, color: C.text2 }}>置信度</span>
    </div>
  );
}

function AgentBlock({ text, label = "助手草稿" }: { text: string; label?: string }) {
  return (
    <div
      style={{
        background: C.blueLight,
        border: `1px solid ${C.blueBorder}`,
        borderLeft: `3px solid ${C.blue}`,
        borderRadius: 10,
        padding: "11px 14px",
      }}
    >
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          color: C.blue,
          marginBottom: 6,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{text}</div>
    </div>
  );
}

function getPriorityTone(priority: "P0" | "P1" | "P2" | "P3") {
  if (priority === "P0") return { bg: C.redLight, border: C.redBorder, color: C.red, tagBg: "#FFF1F0" };
  if (priority === "P1") return { bg: C.amberLight, border: C.amberBorder, color: C.amber, tagBg: "#FFF7ED" };
  if (priority === "P2") return { bg: C.blueLight, border: C.blueBorder, color: C.blue, tagBg: "#EEF4FF" };
  return { bg: C.greenLight, border: C.greenBorder, color: C.green, tagBg: "#F2FAF5" };
}

function PriorityCard({
  priority,
  badgeLabel,
  title,
  children,
}: {
  priority: "P0" | "P1" | "P2" | "P3";
  badgeLabel?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  const tone = getPriorityTone(priority);

  return (
    <div
      style={{
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        borderRadius: 12,
        padding: "14px 16px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 44,
            height: 30,
            padding: "0 10px",
            border: `1px solid ${tone.border}`,
            background: tone.tagBg,
            color: tone.color,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {badgeLabel ?? priority}
        </span>
        <div style={{ fontSize: 20, color: C.text1, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0.1 }}>{title}</div>
      </div>
      {children ? children : null}
    </div>
  );
}

function DecisionTensionCard({
  data,
  showManualControls = false,
  compact = false,
}: {
  data: DecisionTensionData;
  showManualControls?: boolean;
  compact?: boolean;
}) {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [manualFlag, setManualFlag] = useState<"changed" | "incorrect" | null>(null);

  const balanceOffset = { left: "18%", center: "50%", right: "82%" }[data.balanceDirection];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 12 : 14 }}>
      <div
        className="decision-tension-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <div style={{ border: `1px solid ${C.greenBorder}`, borderRadius: 12, background: C.greenLight, padding: compact ? "12px 14px" : "14px 16px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Left Force</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text1, lineHeight: 1.4, marginBottom: 6 }}>{data.leftLabel}</div>
          <div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.7, marginBottom: 10 }}>{data.leftSummary}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {data.leftForces.map((item) => (
              <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: C.green, fontWeight: 700, lineHeight: 1.4 }}>+</span>
                <span style={{ fontSize: 12.5, color: C.text0, lineHeight: 1.65 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: compact ? 42 : 54 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.text2, letterSpacing: 1.2 }}>VS</div>
        </div>

        <div style={{ border: `1px solid ${C.redBorder}`, borderRadius: 12, background: C.redLight, padding: compact ? "12px 14px" : "14px 16px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Right Force</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text1, lineHeight: 1.4, marginBottom: 6 }}>{data.rightLabel}</div>
          <div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.7, marginBottom: 10 }}>{data.rightSummary}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {data.rightForces.map((item) => (
              <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: C.red, fontWeight: 700, lineHeight: 1.4 }}>-</span>
                <span style={{ fontSize: 12.5, color: C.text0, lineHeight: 1.65 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ border: `1px solid ${C.amberBorder}`, borderRadius: 12, background: "#FFFDF7", padding: compact ? "12px 14px" : "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Tension Title</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text1 }}>{data.title}</div>
          </div>
          <Tag label={data.evidenceEntryLabel} variant="amber" small />
        </div>

        <div style={{ position: "relative", height: 38, marginBottom: 10 }}>
          <div style={{ position: "absolute", top: 18, left: 0, right: 0, height: 2, background: C.border, borderRadius: 999 }} />
          <div style={{ position: "absolute", top: 10, left: "50%", width: 1, height: 18, background: C.borderMd }} />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: balanceOffset,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 999, background: C.amber, boxShadow: `0 0 0 3px ${C.amberLight}` }} />
            <div style={{ fontSize: 11, color: "#92400E", fontWeight: 600 }}>当前偏向</div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.7, marginBottom: 12 }}>{data.currentBalance}</div>

        <button
          onClick={() => setActionOpen((prev) => !prev)}
          style={{
            width: "100%",
            textAlign: "left",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "10px 12px",
            cursor: "pointer",
            marginBottom: evidenceOpen || showManualControls || actionOpen ? 10 : 0,
          }}
        >
          <div style={{ fontSize: 11, color: C.text2, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Why it matters</div>
          <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.7 }}>{data.whyItMatters}</div>
        </button>

        {actionOpen && (
          <div style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: C.blue, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Action Hint</div>
            <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.7 }}>{data.actionHint}</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <SecondaryBtn onClick={() => setEvidenceOpen((prev) => !prev)} style={{ padding: "7px 12px", fontSize: 12 }}>
            {evidenceOpen ? "收起证据来源" : "查看证据来源"}
          </SecondaryBtn>
          {showManualControls && (
            <>
              <SecondaryBtn onClick={() => setManualFlag("changed")} style={{ padding: "7px 12px", fontSize: 12 }}>
                标记张力已变化
              </SecondaryBtn>
              <DangerBtn onClick={() => setManualFlag("incorrect")} style={{ padding: "7px 12px", fontSize: 12 }}>
                标记系统判断有误
              </DangerBtn>
            </>
          )}
        </div>

        {manualFlag && (
          <div
            style={{
              marginTop: 10,
              background: manualFlag === "incorrect" ? C.redLight : C.blueLight,
              border: `1px solid ${manualFlag === "incorrect" ? C.redBorder : C.blueBorder}`,
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 12.5,
              color: manualFlag === "incorrect" ? C.red : C.blue,
            }}
          >
            {manualFlag === "changed" ? "已标记：当前张力已变化，建议重新评估下一步动作。" : "已标记：系统判断可能有误，需人工复核证据与状态更新。"}
          </div>
        )}

        {evidenceOpen && (
          <div style={{ marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
            <div style={{ fontSize: 11, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Evidence Entry</div>
            {data.evidence.map((item, index) => (
              <div key={item} title={item} style={{ padding: "8px 0", borderBottom: index === data.evidence.length - 1 ? "none" : `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.7 }}>{item}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PrimaryBtn({ children, onClick, style = {} }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: C.blue,
        color: "#fff",
        border: `1px solid ${C.blue}`,
        borderRadius: 10,
        padding: "9px 18px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function SecondaryBtn({ children, onClick, style = {} }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: C.surface,
        color: C.text1,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style = {} }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: C.blue,
        border: "none",
        borderRadius: 8,
        padding: "6px 0",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function DangerBtn({ children, onClick, style = {} }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: C.redLight,
        color: C.red,
        border: `1px solid ${C.redBorder}`,
        borderRadius: 10,
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function getTaskStatusVariant(status: string): PillVariant {
  if (status.includes("执行中")) return "blue";
  if (status.includes("待执行")) return "amber";
  if (status.includes("待审批") || status.includes("待更新")) return "amber";
  if (status.includes("完成")) return "green";
  return "neutral";
}

function getRiskVariant(risk: string): TagVariant {
  if (risk.includes("高")) return "red";
  if (risk.includes("中")) return "amber";
  if (risk.includes("低")) return "green";
  return "neutral";
}

function getAlertVariant(type: string): TagVariant {
  if (type.includes("风险")) return "red";
  if (type.includes("owner")) return "blue";
  if (type.includes("分配")) return "amber";
  return "neutral";
}

function SummaryStat({ label, value, variant }: { label: string; value: number; variant: TagVariant }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 18px", minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 13.5, color: C.text1, letterSpacing: 0.2 }}>{label}</div>
        <Tag label={label} variant={variant} small />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 34, fontWeight: 700, color: C.text0, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 13, color: C.text2 }}>项</span>
      </div>
    </div>
  );
}

function GovernanceToggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: enabled ? "flex-end" : "flex-start",
        width: 34,
        height: 20,
        borderRadius: 999,
        background: enabled ? C.greenLight : C.surfaceAlt,
        border: `1px solid ${enabled ? C.greenBorder : C.border}`,
        padding: 2,
      }}
    >
      <span style={{ width: 14, height: 14, borderRadius: 999, background: enabled ? C.green : C.text3 }} />
    </span>
  );
}

function AgentDirectoryCard({
  agent,
  active = false,
  onOpen,
}: {
  agent: {
    englishName: string;
    chineseName: string;
    subtitle: string;
    responsibility: string;
    statusSummary: string;
  };
  active?: boolean;
  onOpen: () => void;
}) {
  return (
    <Card style={{ borderColor: active ? C.blueBorder : C.border, background: active ? C.blueLight : C.surface }}>
      <CardPad>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text0, marginBottom: 6 }}>{agent.englishName}</div>
            <div style={{ fontSize: 14, color: C.text1, fontWeight: 600 }}>{agent.chineseName}</div>
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: C.text2, marginBottom: 8 }}>{agent.subtitle}</div>
        <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.75, marginBottom: 14 }}>{agent.responsibility}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {agent.statusSummary.split("｜").map((item) => (
              <Tag
                key={item}
                label={item}
                variant={item.includes("待发布") ? "amber" : item.includes("需") ? "blue" : "neutral"}
                small
              />
            ))}
          </div>
          <SecondaryBtn onClick={onOpen} style={{ padding: "8px 12px", fontSize: 12 }}>
            查看/管理规则
          </SecondaryBtn>
        </div>
      </CardPad>
    </Card>
  );
}

function GovernanceRuleTable({
  columns,
  rows,
  columnTemplate,
}: {
  columns: string[];
  rows: Array<{ key: string; cells: ReactNode[] }>;
  columnTemplate: string;
}) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.surface }}>
      <div className="governance-rule-grid" style={{ display: "grid", gridTemplateColumns: columnTemplate, gap: 14, padding: "12px 16px", background: C.surfaceAlt, borderBottom: `1px solid ${C.border}` }}>
        {columns.map((column) => (
          <div key={column} style={{ fontSize: 12, color: C.text2, fontWeight: 600, letterSpacing: 0.2 }}>
            {column}
          </div>
        ))}
      </div>
      {rows.map((row, index) => (
        <div
          key={row.key}
          className="governance-rule-grid"
          style={{
            display: "grid",
            gridTemplateColumns: columnTemplate,
            gap: 14,
            padding: "14px 16px",
            alignItems: "start",
            borderBottom: index === rows.length - 1 ? "none" : `1px solid ${C.border}`,
          }}
        >
          {row.cells.map((cell, cellIndex) => (
            <div key={`${row.key}-${cellIndex}`} style={{ minWidth: 0 }}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function GovernanceChangeRow({
  item,
  last = false,
}: {
  item: {
    changedBy: string;
    change: string;
    effectiveAt: string;
    impact: string;
    roleImpact: string;
    agentImpact: string;
    status: string;
  };
  last?: boolean;
}) {
  return (
    <div
      className="governance-row-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.6fr 1fr 1fr 1fr 0.8fr auto",
        gap: 14,
        alignItems: "start",
        padding: "14px 0",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
      }}
    >
      <div>
        <div style={{ fontSize: 13.5, color: C.text0, fontWeight: 700 }}>{item.effectiveAt}</div>
        <div style={{ fontSize: 11.5, color: C.text2 }}>{item.changedBy}</div>
      </div>
      <div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.7 }}>{item.change}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <Tag label={item.impact} variant="neutral" small />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <Tag label={item.roleImpact} variant="blue" small />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <Tag label={item.agentImpact} variant="purple" small />
      </div>
      <div>
        <Tag label={item.status} variant={item.status === "已生效" ? "green" : "amber"} small />
      </div>
      <div style={{ justifySelf: "end" }}>
        <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>差异</SecondaryBtn>
      </div>
    </div>
  );
}

function WorkItemRow({
  item,
  last = false,
  onOpenWorkspace,
}: {
  item: {
    customerName: string;
    stage: string;
    taskTitle: string;
    status: string;
    risk: string;
    dueTime: string;
    ownerReason: string;
  };
  last?: boolean;
  onOpenWorkspace: () => void;
}) {
  return (
    <div
      className="work-item-row"
      style={{
        padding: "16px 18px",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
        display: "grid",
        gridTemplateColumns: "1.4fr 1.8fr 0.9fr 0.9fr auto",
        gap: 14,
        alignItems: "center",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text0, letterSpacing: 0.1 }}>{item.customerName}</span>
          <Tag label={item.stage} variant="neutral" small />
        </div>
        <div style={{ fontSize: 13.5, color: C.text2, lineHeight: 1.75, letterSpacing: 0.1 }}>{item.ownerReason}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 15, color: C.text0, fontWeight: 600, marginBottom: 5, letterSpacing: 0.1 }}>{item.taskTitle}</div>
        <div style={{ fontSize: 13.5, color: C.text2 }}>当前阶段：{item.stage}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <StatusPill label={item.status} variant={getTaskStatusVariant(item.status)} />
        <Tag label={item.risk} variant={getRiskVariant(item.risk)} small />
      </div>
      <div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}>
        <div style={{ fontSize: 12, color: C.text2, marginBottom: 5 }}>截止时间 / 时间窗口</div>
        <div>{item.dueTime}</div>
      </div>
      <div style={{ justifySelf: "end" }}>
        <SecondaryBtn onClick={onOpenWorkspace} style={{ whiteSpace: "nowrap" }}>
          进入客户工作台
        </SecondaryBtn>
      </div>
    </div>
  );
}

function ApprovalItemRow({
  item,
  last = false,
  onOpenDetail,
}: {
  item: ApprovalItem;
  last?: boolean;
  onOpenDetail: (item: ApprovalItem) => void;
}) {
  return (
    <div
      className="approval-item-row"
      style={{
        padding: "16px 18px",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr 1fr 0.8fr auto",
        gap: 14,
        alignItems: "center",
      }}
    >
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text0, letterSpacing: 0.1 }}>{item.customerName}</div>
      </div>
      <div style={{ fontSize: 14.5, color: C.text0 }}>{item.type}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <StatusPill label={item.status} variant={item.status.includes("审批") ? "amber" : "blue"} />
      </div>
      <div style={{ fontSize: 13.5, color: C.text2 }}>提交时间：{item.submittedAt}</div>
      <div style={{ display: "flex", gap: 8, justifySelf: "end", flexWrap: "wrap", justifyContent: "flex-end" }}>
        <SecondaryBtn onClick={() => onOpenDetail(item)} style={{ padding: "7px 12px" }}>
          查看
        </SecondaryBtn>
      </div>
    </div>
  );
}

function AlertItemRow({ item, last = false }: { item: (typeof myWorkbench.alerts)[number]; last?: boolean }) {
  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
        display: "grid",
        gridTemplateColumns: "1fr 4fr",
        gap: 16,
        alignItems: "start",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.text0, letterSpacing: 0.1 }}>{item.customerName}</span>
        <Tag label={item.type} variant={getAlertVariant(item.type)} small />
      </div>
      <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{item.message}</div>
    </div>
  );
}

function MyWorkbenchPage({ onOpenWorkspace, onOpenApprovalDetail }: { onOpenWorkspace: () => void; onOpenApprovalDetail: (item: ApprovalItem) => void }) {
  type WorkbenchTaskItem = {
    customerName: string;
    stage: string;
    taskTitle: string;
    status: string;
    risk: string;
    dueTime: string;
    ownerReason: string;
  };

  const taskGroups: Array<{
    key: keyof typeof myWorkbench.tasks;
    title: string;
    count: number;
    items: readonly WorkbenchTaskItem[];
  }> = [
    { key: "pending", title: "待执行", count: myWorkbench.tasks.pending.length, items: myWorkbench.tasks.pending },
    { key: "inProgress", title: "执行中", count: myWorkbench.tasks.inProgress.length, items: myWorkbench.tasks.inProgress },
    { key: "submitted", title: "已提交待更新", count: myWorkbench.tasks.submitted.length, items: myWorkbench.tasks.submitted },
    { key: "completed", title: "已完成", count: myWorkbench.tasks.completed.length, items: myWorkbench.tasks.completed },
  ];

  return (
    <div>
      <Header page="myWorkbench" />
      <div style={{ margin: "24px 0 40px", padding: "0 28px", display: "grid", gap: 24 }}>
        <Card>
          <CardPad style={{ paddingBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
              <div>
                <SectionTitle>今日待处理总览</SectionTitle>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.text0, marginBottom: 8, letterSpacing: 0.2 }}>我的工作台</div>
                <div style={{ fontSize: 14.5, color: C.text2, lineHeight: 1.75, letterSpacing: 0.1 }}>
                  优先查看当前待执行事项、待审批输出，以及因路由变更需要你立即接手的客户。
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Tag label="个人视角入口" variant="blue" small />
                <Tag label="业务 owner 工作总览" variant="neutral" small />
              </div>
            </div>
            <div className="workbench-summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 12 }}>
              <SummaryStat label="待执行" value={myWorkbench.summary.todoCount} variant="amber" />
              <SummaryStat label="执行中" value={myWorkbench.summary.inProgressCount} variant="blue" />
              <SummaryStat label="待审批" value={myWorkbench.summary.pendingApprovalCount} variant="amber" />
              <SummaryStat label="新分配" value={myWorkbench.summary.newAssignedCount} variant="amber" />
              <SummaryStat label="高风险" value={myWorkbench.summary.highRiskCount} variant="red" />
            </div>
          </CardPad>
        </Card>

        <Card>
          <CardPad>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
              <div>
                <SectionTitle>我的任务</SectionTitle>
                <div style={{ fontSize: 13, color: C.text2 }}>按执行状态分组，优先回答“我现在最该先处理什么”。</div>
              </div>
              <Tag label="以任务推进为主，不混入审批事项" variant="neutral" small />
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              {taskGroups.map((group) => {
                const tone =
                  group.key === "inProgress"
                    ? { bg: C.blueLight, border: C.blueBorder, tag: "blue" as const }
                    : group.key === "completed"
                      ? { bg: C.greenLight, border: C.greenBorder, tag: "green" as const }
                    : group.key === "submitted"
                        ? { bg: C.amberLight, border: C.amberBorder, tag: "amber" as const }
                        : { bg: "#FFF3EE", border: "#EFC6B8", tag: "amber" as const };

                return (
                <div key={group.key} style={{ border: `1px solid ${tone.border}`, borderRadius: 12, overflow: "hidden", background: C.surface }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: tone.bg, borderBottom: `1px solid ${tone.border}` }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.text0 }}>{group.title}</div>
                    <Tag label={`${group.count} 项`} variant={tone.tag} small />
                  </div>
                  <div>
                    {group.items.map((item, index) => (
                      <WorkItemRow key={`${group.key}-${item.customerName}-${item.taskTitle}`} item={item} last={index === group.items.length - 1} onOpenWorkspace={onOpenWorkspace} />
                    ))}
                  </div>
                </div>
              )})}
            </div>
          </CardPad>
        </Card>

        <Card>
          <CardPad>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
              <div>
                <SectionTitle>待我审批</SectionTitle>
                <div style={{ fontSize: 13, color: C.text2 }}>审批流独立于任务流，用于处理 agent / system output 的人工确认。</div>
              </div>
              <Tag label={`${myWorkbench.approvals.length} 条待处理`} variant="amber" small />
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
              {myWorkbench.approvals.map((item, index) => (
                <ApprovalItemRow key={`${item.customerName}-${item.type}`} item={item} last={index === myWorkbench.approvals.length - 1} onOpenDetail={onOpenApprovalDetail} />
              ))}
            </div>
          </CardPad>
        </Card>

        <div className="workbench-dual" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 22 }}>
          <Card>
            <CardPad>
              <div style={{ marginBottom: 8 }}>
                <SectionTitle>系统提醒 / 最新变化</SectionTitle>
                <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.7 }}>
                  这里说明为什么这些客户、任务和审批会轮到你处理，以及你现在需要介入的原因。
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                {myWorkbench.alerts.map((item, index) => (
                  <AlertItemRow key={`${item.customerName}-${item.type}`} item={item} last={index === myWorkbench.alerts.length - 1} />
                ))}
              </div>
            </CardPad>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Header({ page }: HeaderProps) {
  const pageTitles: Record<PageId, string> = {
    myWorkbench: "我的工作台",
    workspaceSales: "客户状态工作台",
    workspaceCs: "客户状态工作台",
    sales: "销售轻记录",
    cs: "客服触达检查",
    governance: "智能体后台管理",
  };
  const summary = customer.summaryBlock;

  if (page === "workspaceSales" || page === "workspaceCs" || page === "myWorkbench" || page === "governance") {
    return (
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 28px" }}>
        <div style={{ fontSize: 11.5, color: C.text2, marginBottom: 4 }}>页面</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text0, letterSpacing: 0.2 }}>{pageTitles[page]}</div>
      </div>
    );
  }

  return (
    <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 28px" }}>
      <div style={{ fontSize: 11.5, color: C.text2, marginBottom: 5 }}>{pageTitles[page]}</div>
      <div
        style={{
          background: C.surfaceAlt,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: "18px 20px",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>
          当前客户承接卡
        </div>
        <div className="header-summary-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 16, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.text0, lineHeight: 1.15, marginBottom: 8 }}>{summary.customerIdentity.name}</div>
            <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.6, marginBottom: 12 }}>
              <span style={{ fontWeight: 600, color: C.text0 }}>{summary.customerIdentity.stage}</span>
              <span style={{ color: C.text3, margin: "0 8px" }}>｜</span>
              {summary.customerIdentity.profileLine}
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}>
              {summary.stateSummary}
            </div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 10 }}>当前责任结构</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, color: C.text1 }}>
                当前 owner：<strong style={{ color: C.text0 }}>{summary.assignment.owner.name}</strong>（{summary.assignment.owner.role}）
              </div>
              {summary.assignment.collaborators.map((item) => (
                <div key={item.type} style={{ fontSize: 13, color: C.text1 }}>
                  {item.type}：<strong style={{ color: C.text0 }}>{item.name}</strong>（{item.role}）
                </div>
              ))}
              <div style={{ fontSize: 13, color: C.text1 }}>
                {summary.assignment.supervisor.type}：<strong style={{ color: C.text0 }}>{summary.assignment.supervisor.name}</strong>（{summary.assignment.supervisor.role}）
              </div>
            </div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 10 }}>当前推进状态</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, color: C.text1 }}>
                处理状态：<strong style={{ color: C.text0 }}>{summary.workflow.progressStatus}</strong>
              </div>
              <div style={{ fontSize: 13, color: C.text1 }}>
                当前任务：<strong style={{ color: C.text0 }}>{summary.workflow.currentTask}</strong>
              </div>
              <div style={{ fontSize: 13, color: C.text1 }}>
                当前风险：<Tag label={summary.workflow.risk.level} variant="amber" small /> <span style={{ marginLeft: 6 }}>{summary.workflow.risk.reason}</span>
              </div>
              <div style={{ fontSize: 13, color: C.text1 }}>
                当前审核：<strong style={{ color: C.text0 }}>{summary.workflow.reviewStatus}</strong>
              </div>
              <div style={{ fontSize: 13, color: C.text1 }}>
                当前模式：<strong style={{ color: C.text0 }}>{summary.workflow.mode}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 980px) {
          .header-summary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function WorkspacePage({ roleVariant, taskPanelState, setTaskPanelState, onOpenMessages }: WorkspacePageProps) {
  const [workTab, setWorkTab] = useState<"history" | "assignment">("history");
  const [historyOwnerFilter, setHistoryOwnerFilter] = useState<"全部" | "王芳" | "赵晨" | "李明">("全部");
  const [versionTraceExpanded, setVersionTraceExpanded] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const assignmentSectionRef = useRef<HTMLDivElement | null>(null);
  const [completedSuggestedActions, setCompletedSuggestedActions] = useState<string[]>([]);
  const [completedQuestionsToConfirm, setCompletedQuestionsToConfirm] = useState<string[]>([]);
  const [executionInput, setExecutionInput] = useState("客户反馈：配偶愿意参加周末到店体验，但希望先看品牌对比和家庭空间体验。");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadedMaterials, setUploadedMaterials] = useState([
    { name: "第二次试驾客户语音纪要.m4a", type: "语音", time: "今天 14:10" },
    { name: "家庭决策顾虑手写照片.jpg", type: "照片", time: "今天 14:18" },
  ]);
  const summary = customer.summaryBlock;
  const stateDetail = customer.customerStateDetail;
  const workspaceTaskContent =
    roleVariant === "sales"
      ? {
          currentTask: customer.currentTask,
          reviewPacket: {
            rawSummary: "本次执行共采集 2 份材料，确认配偶愿意参与到店体验，核心关注点集中在品牌认知、家庭空间体验和预算上限。",
            interpretation:
              "销售视角判断：客户从个人高意向推进到家庭双人决策阶段，配偶已从隐性阻力转为可被触达的关键影响者。当前任务重点不是继续讲参数，而是组织一次面向双人决策的体验场景。",
            candidateUpdates: [
              "新增关注点：家庭空间与品牌认知联合评估",
              "更新异议：配偶品牌偏好从推测升级为已确认阻力",
              "更新决策张力：技术体验满意，但家庭品牌认知尚未收敛",
            ],
            confidence: 76,
            unresolvedQuestions: ["配偶最在意的是品牌形象还是二手保值？", "是否需要销售经理提前参与邀约确认？"],
            roleRecommendation: "先由王芳发出家庭体验邀约，再由李明补充售后与服务说明，避免直接进入价格谈判。",
            versionRecommendation: "主要版本",
            versionReason: "本次材料改变了决策结构判断，建议进入主要版本更新。",
          },
          processingSteps: [
            { label: "正在整理原始记录", status: "已完成" },
            { label: "正在提取候选状态更新", status: "进行中" },
            { label: "正在生成销售视角分析", status: "等待中" },
          ],
          liveWorkspace: {
            suggestedActions: [
              "优先按“家庭体验 + 品牌对比”双线组织本轮沟通，不要直接切报价。",
              "先把配偶顾虑拆成品牌认知、空间体验、预算三个维度，再决定是否需要经理介入。",
              "如果客户能确认周末档期，下一步可同步准备家庭场景试驾路线与服务承诺材料。",
            ],
            blockedItems: ["仍不得直接联系配偶本人", "折扣承诺与金融方案口径不能先于审批给出", "售后响应时效不能口头扩大承诺"],
            currentUnderstanding:
              "当前任务已从单人高意向跟进切换为双人共同决策推动。客户本人在推进，配偶态度出现松动，但是否真正在意品牌形象、空间体验还是保值率，还需要继续收集一手表达。",
            questionsToConfirm: ["配偶愿意参加的是到店体验还是单独看资料？", "客户预算上限是否因家庭讨论发生变化？", "这次补充信息里有没有明确提到竞品品牌？"],
          },
          submittedHistoryEvent: {
            id: "E-042",
            type: "SALES_VISIT",
            typeLabel: "销售拜访",
            owner: customer.currentOwner,
            date: "今天",
            summary: "已提交本轮家庭体验邀约整理结果：确认客户愿意继续推进配偶共同体验，并补充了品牌对比、家庭空间体验与预算边界相关一线信息。",
            status: "已提交",
          },
        }
      : {
          currentTask: {
            ...customer.currentTask,
            title: "推进客户服务回访与家庭体验协同确认",
            why: "当前仍处于双人决策阶段，但客服更适合承接服务说明、回访跟进和体验协同确认，帮助销售继续推进。",
            recommendedAction: "本周内由客服确认客户对服务承诺、家庭体验安排和后续响应方式的接受度，并把结果同步销售 owner。",
            blockedActions: ["不得直接联系配偶本人", "不得承诺折扣与金融口径", "不得替销售直接推进成交结论"],
            agentDraft: "「刘总，这边想先跟您确认一下家庭体验安排和售后服务说明，我们会把确认结果同步给销售同事，一起把后续安排衔接好。」",
          },
          reviewPacket: {
            rawSummary: "本次执行共补充 2 份服务侧材料，核心聚焦在家庭体验安排确认、服务承诺说明和回访节奏是否合适。",
            interpretation:
              "客服视角判断：当前不宜主动推进成交，而应通过服务承诺说明与体验安排确认稳定关系温度，为销售后续承接提供清晰反馈。",
            candidateUpdates: [
              "新增关注点：客户对服务说明与体验衔接方式的接受度",
              "更新协同建议：客服适合补充服务承诺说明并回传反馈",
              "更新决策张力：家庭决策仍未完全收敛，需先稳住关系温度",
            ],
            confidence: 74,
            unresolvedQuestions: ["客户更希望通过微信确认还是电话回访？", "是否需要由客服先发出服务承诺说明再交回销售？"],
            roleRecommendation: "先由李明完成服务说明与回访确认，再把结果同步王芳，避免客服越权进入成交推进。",
            versionRecommendation: "主要版本",
            versionReason: "本次材料补充了服务协同信号，建议纳入主要版本更新供 owner 判断。",
          },
          processingSteps: [
            { label: "正在整理服务回访记录", status: "已完成" },
            { label: "正在提取客服协同建议", status: "进行中" },
            { label: "正在生成客服视角分析", status: "等待中" },
          ],
          liveWorkspace: {
            suggestedActions: [
              "先确认客户更适合微信回访还是电话沟通，再安排服务说明发送节奏。",
              "围绕家庭体验安排、服务承诺说明和响应方式三点收集反馈，不要直接进入成交推动。",
              "确认结果后同步给销售 owner，由销售决定是否继续推进家庭到店体验。",
            ],
            blockedItems: ["仍不得直接联系配偶本人", "不得承诺折扣与金融政策", "不得替销售 owner 输出成交判断"],
            currentUnderstanding:
              "当前客服版本的任务重点是稳住关系温度，并通过服务说明和体验协同确认帮助销售继续推进，而不是直接承担成交推进职责。",
            questionsToConfirm: ["客户更接受微信回访还是电话沟通？", "客户是否希望先收到服务承诺说明再确认家庭体验？", "客服回访结果是否需要当天同步给销售 owner？"],
          },
          submittedHistoryEvent: {
            id: "E-042",
            type: "CS_OUTREACH",
            typeLabel: "客服回访",
            owner: "李明",
            date: "今天",
            summary: "已提交本轮服务回访与家庭体验协同确认结果：确认客户愿意先接收服务说明，并等待销售继续承接家庭体验安排。",
            status: "已提交",
          },
        } as const;
  const { currentTask, reviewPacket, processingSteps, liveWorkspace, submittedHistoryEvent } = workspaceTaskContent;
  const historyEvents = (taskPanelState === "已提交" ? [submittedHistoryEvent, ...customer.events] : customer.events).filter(
    (event) => historyOwnerFilter === "全部" || event.owner === historyOwnerFilter,
  );
  const historyOwnerOptions = ["全部", "王芳", "赵晨", "李明"] as const;
  const openAssignmentSection = () => {
    setWorkTab("assignment");
    requestAnimationFrame(() => {
      assignmentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const uploadMaterials = () => {
    const incoming =
      selectedFiles.length > 0
        ? selectedFiles.map((name, index) => ({ name, type: name.endsWith(".jpg") || name.endsWith(".png") ? "照片" : "语音", time: `今天 14:${28 + index}` }))
        : [{ name: `门店补充跟进记录_${uploadedMaterials.length + 1}.wav`, type: "语音", time: "今天 14:30" }];

    setUploadedMaterials((prev) => [...prev, ...incoming]);
    setSelectedFiles([]);
    setDraftSaved(false);
  };

  const saveDraft = () => {
    if (selectedFiles.length > 0) {
      uploadMaterials();
    }
    setDraftSaved(true);
  };

  const resumeSupplement = () => {
    setDraftSaved(false);
  };

  const generateRoundReport = () => {
    if (selectedFiles.length > 0) {
      uploadMaterials();
    }
    setDraftSaved(true);
    setTaskPanelState("整理中");
  };

  const orderedSuggestedActions = [
    ...liveWorkspace.suggestedActions.filter((item) => !completedSuggestedActions.includes(item)),
    ...liveWorkspace.suggestedActions.filter((item) => completedSuggestedActions.includes(item)),
  ];
  const orderedQuestionsToConfirm = [
    ...liveWorkspace.questionsToConfirm.filter((item) => !completedQuestionsToConfirm.includes(item)),
    ...liveWorkspace.questionsToConfirm.filter((item) => completedQuestionsToConfirm.includes(item)),
  ];
  const detailSectionTitleStyle: CSSProperties = {
    fontSize: 13,
    color: C.text3,
    letterSpacing: 0.4,
  };

  const renderTaskStateBody = () => {
    if (taskPanelState === "待执行") {
      return (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>任务标题</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text0, marginBottom: 4 }}>{currentTask.title}</div>
            <div style={{ fontSize: 12.5, color: C.amber, fontWeight: 600, marginBottom: 8 }}>{currentTask.timeWindow}</div>
            <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65 }}>{currentTask.why}</div>
          </div>
          <div className="task-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>建议动作</div>
              <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{currentTask.recommendedAction}</div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.redBorder}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>受限事项</div>
              {currentTask.blockedActions.map((action) => (
                <div key={action} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                  <span style={{ color: C.red, fontWeight: 700, flexShrink: 0 }}>✕</span>
                  <span style={{ fontSize: 12, color: C.text1, lineHeight: 1.5 }}>{action}</span>
                </div>
              ))}
            </div>
            <AgentBlock text={currentTask.agentDraft} label="话术建议" />
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "12px 14px", width: "100%" }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>信息输入</div>
            <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65, marginBottom: 10 }}>进入执行态后，owner 可一边补材料，一边让助手实时整理理解与风险。</div>
            <div style={{ width: "100%" }}>
              <PrimaryBtn style={{ width: "100%" }} onClick={() => setTaskPanelState("执行中")}>
                开始执行并实时共创
              </PrimaryBtn>
            </div>
          </div>
        </div>
      );
    }

    if (taskPanelState === "执行中") {
      return (
        <div className="execution-live-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16 }}>
          <div style={{ display: "grid", gap: 12, background: "#F5F8FF", border: `1px solid ${C.blueBorder}`, borderRadius: 14, padding: 12 }}>
            <div style={{ background: "#EAF1FF", border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: C.blue, boxShadow: `0 0 0 3px ${C.blueLight}` }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>助手实时整理中...</span>
              </div>
              <div style={{ fontSize: 12, color: C.text1 }}>边执行，边整理，边更新理解</div>
            </div>

            <div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "#FCFDFE", border: `1px solid ${C.redBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>实时更新的受限事项</div>
                {liveWorkspace.blockedItems.map((item, index) => (
                  <Row key={item} last={index === liveWorkspace.blockedItems.length - 1} style={{ alignItems: "flex-start", padding: "8px 0" }}>
                    <span style={{ color: C.red, fontWeight: 700, fontSize: 14 }}>✕</span>
                    <span style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{item}</span>
                  </Row>
                ))}
              </div>
              <div style={{ background: "#FCFDFE", border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>当前临时理解</div>
                <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{liveWorkspace.currentUnderstanding}</div>
              </div>
            </div>

            <div style={{ background: "#FCFDFE", border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>实时更新的建议动作</div>
              {orderedSuggestedActions.map((item, index) => {
                const checked = completedSuggestedActions.includes(item);

                return (
                  <Row key={item} last={index === orderedSuggestedActions.length - 1} style={{ alignItems: "flex-start", padding: "8px 0" }}>
                    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", width: "100%" }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setCompletedSuggestedActions((prev) =>
                            e.target.checked ? [...prev, item] : prev.filter((entry) => entry !== item),
                          )
                        }
                        style={{ marginTop: 2, accentColor: C.green, width: 16, height: 16, cursor: "pointer", flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          color: checked ? C.text3 : C.text0,
                          lineHeight: 1.65,
                          textDecoration: checked ? "line-through" : "none",
                        }}
                      >
                        {item}
                      </span>
                    </label>
                  </Row>
                );
              })}
            </div>

            <div>
              <div style={{ background: "#FCFDFE", border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>待确认问题</div>
                {orderedQuestionsToConfirm.map((item, index) => {
                  const checked = completedQuestionsToConfirm.includes(item);

                  return (
                    <Row key={item} last={index === orderedQuestionsToConfirm.length - 1} style={{ alignItems: "flex-start", padding: "8px 0" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", width: "100%" }}>
                        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", flex: 1, minWidth: 0 }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              setCompletedQuestionsToConfirm((prev) =>
                                e.target.checked ? [...prev, item] : prev.filter((entry) => entry !== item),
                              )
                            }
                            style={{ marginTop: 2, accentColor: C.amber, width: 16, height: 16, cursor: "pointer", flexShrink: 0 }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              color: checked ? C.text3 : C.text0,
                              lineHeight: 1.65,
                              textDecoration: checked ? "line-through" : "none",
                            }}
                          >
                            {item}
                          </span>
                        </label>
                        <SecondaryBtn style={{ padding: "5px 10px", fontSize: 12, marginLeft: "auto", flexShrink: 0 }}>备注</SecondaryBtn>
                      </div>
                    </Row>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>文本输入区</div>
              <div style={{ fontSize: 12.5, color: C.text1, marginBottom: 10 }}>输入客户第一手信息 / 访谈记录</div>
              <textarea
                value={executionInput}
                onChange={(e) => {
                  setExecutionInput(e.target.value);
                  setDraftSaved(false);
                }}
                placeholder="记录客户原话、现场观察、配偶反馈、销售自己的即时判断……"
                style={{
                  width: "100%",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 8,
                  background: C.surface,
                  color: C.text0,
                  fontSize: 13,
                  padding: "10px 12px",
                  resize: "vertical",
                  minHeight: 120,
                  outline: "none",
                  fontFamily: C.sans,
                }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <PrimaryBtn onClick={saveDraft}>提交</PrimaryBtn>
                <SecondaryBtn onClick={() => setInputModalOpen(true)}>语音输入</SecondaryBtn>
              </div>
            </div>

            <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>语音上传 / 转写入口</div>
              <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65, marginBottom: 10 }}>支持上传门店录音、现场纪要，转写后会继续回流到左侧理解区。</div>
              <label
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: `1px dashed ${C.borderMd}`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontSize: 13,
                  color: C.text1,
                  background: C.surface,
                  cursor: "pointer",
                }}
              >
                <span>上传语音或转写文件</span>
                <span style={{ color: C.blue, fontWeight: 600 }}>选择文件</span>
                <input
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    setSelectedFiles(Array.from(e.target.files ?? []).map((file) => file.name));
                    setDraftSaved(false);
                  }}
                />
              </label>
            </div>

            <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>图片 / 文件上传入口</div>
              <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65, marginBottom: 10 }}>上传访谈截图、手写记录、图片或其他文件，助手会继续归并进当前理解。</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <SecondaryBtn onClick={uploadMaterials}>上传到材料列表</SecondaryBtn>
                {selectedFiles.length > 0 && <Tag label={`待上传 ${selectedFiles.length} 项`} variant="blue" small />}
              </div>
            </div>

            <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>已上传材料列表</div>
              <div style={{ display: "grid", gap: 2 }}>
                {uploadedMaterials.map((item, index) => (
                  <Row key={`${item.name}-${index}`} last={index === uploadedMaterials.length - 1}>
                    <Tag label={item.type} variant={item.type === "照片" ? "blue" : "neutral"} small />
                    <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item.name}</span>
                    <span style={{ fontSize: 11.5, color: C.text2 }}>{item.time}</span>
                  </Row>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (taskPanelState === "整理中") {
      return (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>已上传材料清单</div>
            {uploadedMaterials.map((item, index) => (
              <Row key={`${item.name}-${index}`} last={index === uploadedMaterials.length - 1}>
                <Tag label={item.type} variant={item.type === "照片" ? "blue" : "neutral"} small />
                <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item.name}</span>
                <span style={{ fontSize: 11.5, color: C.text2 }}>{item.time}</span>
              </Row>
            ))}
          </div>
          <div style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 6 }}>助手正在汇总本轮完整报告...</div>
            <div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.6, marginBottom: 10 }}>这一阶段只是在收束本轮结果，不是重新等待上传。已收集的执行材料会继续被合并成候选结论与报告草稿。</div>
            {processingSteps.map((step, index) => (
              <div key={step.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: index === processingSteps.length - 1 ? "8px 0 0" : "8px 0", borderBottom: index === processingSteps.length - 1 ? "none" : `1px solid ${C.blueBorder}` }}>
                <span style={{ fontSize: 13, color: C.text0 }}>{step.label}</span>
                <Tag label={step.status} variant={step.status === "已完成" ? "green" : step.status === "进行中" ? "blue" : "neutral"} small />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (taskPanelState === "确认本轮结果") {
      return (
        <div style={{ display: "grid", gap: 14 }}>
          <div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>原始材料摘要</div>
              <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{reviewPacket.rawSummary}</div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>推荐版本</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Tag label={reviewPacket.versionRecommendation} variant={reviewPacket.versionRecommendation === "主要版本" ? "amber" : "neutral"} />
              </div>
              <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65 }}>{reviewPacket.versionReason}</div>
            </div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {roleVariant === "sales" ? "销售视角解读" : "客服视角解读"}
            </div>
            <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{reviewPacket.interpretation}</div>
          </div>
          <div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>候选状态更新</div>
              {reviewPacket.candidateUpdates.map((item) => (
                <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 10px", background: C.greenLight, borderRadius: 7, marginBottom: 6, border: `1px solid ${C.greenBorder}` }}>
                  <span style={{ color: C.green, fontWeight: 700 }}>+</span>
                  <span style={{ fontSize: 13, color: C.text0 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>置信度</div>
                <ConfidenceBar value={reviewPacket.confidence} />
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>未决问题</div>
                {reviewPacket.unresolvedQuestions.map((item, index) => (
                  <Row key={item} last={index === reviewPacket.unresolvedQuestions.length - 1}>
                    <span style={{ color: C.red, fontWeight: 700 }}>?</span>
                    <span style={{ fontSize: 13, color: C.text0 }}>{item}</span>
                  </Row>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>本角色建议动作</div>
            <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{reviewPacket.roleRecommendation}</div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.green, marginBottom: 8 }}>任务已提交</div>
          <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>
            本次任务结果已提交，新的事件条目将进入客户触达任务历史。系统接下来会触发状态更新评估，并等待编排助手重新安排下一步动作。
          </div>
        </div>
        <div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>事件去向</div>
            <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>
              {roleVariant === "sales" ? "事件已进入任务历史，等待销售与状态编排链路继续处理。" : "事件已进入任务历史，等待客服回访结果同步并交由编排链路继续处理。"}
            </div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>下一步系统动作</div>
            <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>等待状态更新结果，随后由编排助手判断是否需要调整 owner、协同角色与下个任务窗口。</div>
          </div>
        </div>
      </div>
    );
  };

  const renderTaskStateActions = () => {
    if (taskPanelState === "待执行") {
      return null;
    }

    if (taskPanelState === "执行中") {
      return (
        <>
          {draftSaved ? (
            <SecondaryBtn onClick={resumeSupplement}>继续补充材料</SecondaryBtn>
          ) : (
            <SecondaryBtn onClick={saveDraft}>暂存草稿</SecondaryBtn>
          )}
          <PrimaryBtn onClick={generateRoundReport}>生成本轮完整报告</PrimaryBtn>
        </>
      );
    }

    if (taskPanelState === "整理中") {
      return (
        <>
          <SecondaryBtn onClick={() => setTaskPanelState("执行中")}>返回继续补充</SecondaryBtn>
          <PrimaryBtn onClick={() => setTaskPanelState("确认本轮结果")}>查看本轮结果</PrimaryBtn>
        </>
      );
    }

    if (taskPanelState === "确认本轮结果") {
      return (
        <>
          <PrimaryBtn onClick={() => setTaskPanelState("已提交")}>审批并提交事件结果</PrimaryBtn>
          <SecondaryBtn onClick={() => setTaskPanelState("已提交")}>修改后提交</SecondaryBtn>
          <DangerBtn onClick={() => setTaskPanelState("执行中")}>驳回并返回执行中</DangerBtn>
        </>
      );
    }

    return (
      <>
        <GhostBtn onClick={() => setWorkTab("history")}>查看任务历史</GhostBtn>
        <GhostBtn onClick={() => setWorkTab("history")}>查看状态更新结果</GhostBtn>
        <PrimaryBtn onClick={() => setTaskPanelState("待执行")}>返回工作台</PrimaryBtn>
      </>
    );
  };

  return (
    <div>
      <Header page={roleVariant === "sales" ? "workspaceSales" : "workspaceCs"} />
      <div style={{ margin: "24px 0", padding: "0 28px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase", marginBottom: 12 }}>
          Layer 2 · 顶部摘要层
        </div>
        <div className="top-dual" style={{ display: "grid", gridTemplateColumns: taskPanelState === "已提交" ? "1fr" : "1fr 2fr", gap: 24, marginBottom: 24 }}>
          <Card>
            <CardPad>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>
                当前客户承接卡
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: C.text0, lineHeight: 1.1, marginBottom: 8 }}>{summary.customerIdentity.name}</div>
              <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.6, marginBottom: 14 }}>
                <span style={{ fontWeight: 600, color: C.text0 }}>{summary.customerIdentity.stage}</span>
                <span style={{ color: C.text3, margin: "0 8px" }}>｜</span>
                {summary.customerIdentity.profileLine}
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  核心状态总结
                </div>
                <div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}>{summary.stateSummary}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, textTransform: "uppercase", letterSpacing: 0.5 }}>当前 owner</div>
                    <GhostBtn onClick={openAssignmentSection} style={{ padding: 0, minHeight: "auto", textAlign: "right", justifyContent: "flex-end", flexShrink: 0 }}>
                      查看责任协同详情
                    </GhostBtn>
                  </div>
                  <div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}>
                    <strong style={{ color: C.text0 }}>{summary.assignment.owner.name}</strong>（{summary.assignment.owner.role}）
                  </div>
                </div>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>当前风险</div>
                  <div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}>
                    <Tag label={summary.workflow.risk.level} variant="amber" small /> <span style={{ marginLeft: 6 }}>{summary.workflow.risk.reason}</span>
                  </div>
                </div>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>当前审核</div>
                  <div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}>
                    <strong style={{ color: C.text0 }}>{summary.workflow.reviewStatus}</strong>
                  </div>
                </div>
              </div>
            </CardPad>
          </Card>

          {taskPanelState !== "已提交" && (
          <Card style={{ background: C.surface, borderColor: C.border }}>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.amber, letterSpacing: 0.8, textTransform: "uppercase" }}>负责人专属当前任务</div>
                    <Tag label="仅负责人可见" variant="amber" small />
                    <Tag label={`时间窗口：${currentTask.timeWindow}`} variant="neutral" small />
                  </div>
                  <div style={{ fontSize: 12.5, color: C.text2 }}>人机协作任务面板</div>
                </div>
                <Tag
                  label={`当前状态：${taskPanelState}`}
                  variant={taskPanelState === "确认本轮结果" ? "amber" : taskPanelState === "执行中" || taskPanelState === "整理中" ? "blue" : "neutral"}
                />
              </div>
              {taskPanelState === "确认本轮结果" && (
                <div style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "10px 12px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 13, color: C.text1 }}>个人消息已推送“确认客户画像更新”，请在右上角消息中心处理。</div>
                  <SecondaryBtn onClick={onOpenMessages}>打开消息中心</SecondaryBtn>
                </div>
              )}

              {renderTaskStateBody()}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                {renderTaskStateActions()}
              </div>
            </CardPad>
          </Card>
          )}
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase", marginBottom: 12 }}>
          Layer 3 · 主体工作层
        </div>
      </div>

      {inputModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,26,0.28)", zIndex: 130, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: 760, maxWidth: "100%", maxHeight: "90vh", overflow: "auto", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }}>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text0, marginBottom: 4 }}>信息输入</div>
                  <div style={{ fontSize: 12, color: C.text2 }}>用于录入第一手客户信息并上传执行材料</div>
                </div>
                <SecondaryBtn style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => setInputModalOpen(false)}>
                  关闭
                </SecondaryBtn>
              </div>

              <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>输入用户第一手信息</div>
                <textarea
                  value={executionInput}
                  onChange={(e) => setExecutionInput(e.target.value)}
                  placeholder="记录刚刚获取到的客户原话、家庭成员反馈、现场观察等……"
                  style={{
                    width: "100%",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 8,
                    background: C.surface,
                    color: C.text0,
                    fontSize: 13,
                    padding: "10px 12px",
                    resize: "vertical",
                    minHeight: 108,
                    outline: "none",
                    fontFamily: C.sans,
                  }}
                />
              </div>

              <div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>
                <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>文件上传入口</div>
                  <div style={{ fontSize: 13, color: C.text1, marginBottom: 10 }}>选择语音、照片等材料</div>
                  <label
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: `1px dashed ${C.borderMd}`,
                      borderRadius: 8,
                      padding: "10px 12px",
                      fontSize: 13,
                      color: C.text1,
                      background: C.surface,
                      cursor: "pointer",
                      marginBottom: 10,
                    }}
                  >
                    <span>{selectedFiles.length > 0 ? `已选择 ${selectedFiles.length} 个文件` : "浏览文件"}</span>
                    <span style={{ color: C.blue, fontWeight: 600 }}>浏览文件</span>
                    <input
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []).map((file) => file.name))}
                    />
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <SecondaryBtn onClick={uploadMaterials}>一键上传</SecondaryBtn>
                    <span style={{ fontSize: 12, color: C.text2 }}>支持语音、图片、现场备注截图</span>
                  </div>
                </div>

                <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>已上传材料列表</div>
                  {uploadedMaterials.map((item, index) => (
                    <Row key={`${item.name}-${index}`} last={index === uploadedMaterials.length - 1}>
                      <Tag label={item.type} variant={item.type === "照片" ? "blue" : "neutral"} small />
                      <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item.name}</span>
                      <span style={{ fontSize: 11.5, color: C.text2 }}>{item.time}</span>
                    </Row>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                <PrimaryBtn onClick={uploadMaterials}>提交面客资料</PrimaryBtn>
                <SecondaryBtn onClick={() => setInputModalOpen(false)}>关闭并返回任务面板</SecondaryBtn>
              </div>
            </CardPad>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 24, margin: "0 0 24px", padding: "0 28px" }}>
        <div ref={assignmentSectionRef} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase" }}>客户状态详情</div>

          <Card>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <SectionTitle style={detailSectionTitleStyle}>Customer State 摘要</SectionTitle>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Tag label={`最新状态版本：${stateDetail.summary.stateVersion}`} variant="blue" small />
                  <Tag label={`更新时间：${stateDetail.summary.updatedAt}`} variant="neutral" small />
                </div>
              </div>
              <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 13, color: C.text2, marginBottom: 8, letterSpacing: 0.2 }}>当前摘要</div>
                <div style={{ fontSize: 15, color: C.text0, lineHeight: 1.85, letterSpacing: 0.1 }}>{stateDetail.summary.summaryText}</div>
              </div>
            </CardPad>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <CardPad>
                <SectionTitle style={detailSectionTitleStyle}>判断相关特征</SectionTitle>
                <div className="detail-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {stateDetail.decisionRelevantTraits.map((trait, index) => {
                    const priority = (["P0", "P1", "P2", "P3"] as const)[index % 4];
                    const tone = getPriorityTone(priority);

                    return (
                      <div
                        key={trait.label}
                        style={{
                          background: tone.bg,
                          border: `1px solid ${tone.border}`,
                          borderRadius: 12,
                          padding: "14px 16px 16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 16,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: 44,
                              height: 30,
                              padding: "0 10px",
                              border: `1px solid ${tone.border}`,
                              background: tone.tagBg,
                              color: tone.color,
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            {priority}
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              minHeight: 30,
                              padding: "0 12px",
                              border: `1px solid ${tone.border}`,
                              background: tone.tagBg,
                              color: tone.color,
                              fontSize: 14,
                              fontWeight: 600,
                            }}
                          >
                            {trait.label}
                          </span>
                          <div style={{ fontSize: 20, color: C.text1, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0.1 }}>{trait.value}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 13, color: C.text2, marginBottom: 8, fontWeight: 600, letterSpacing: 0.1 }}>对当前判断的影响</div>
                          <div style={{ fontSize: 14.5, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{trait.impact}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardPad>
            </Card>

            <Card>
              <CardPad>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <SectionTitle style={detailSectionTitleStyle}>可行动</SectionTitle>
                  <Tag label={`${stateDetail.actionable.length} 条`} variant="green" small />
                </div>
                <div className="detail-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {stateDetail.actionable.map((item) => (
                    <PriorityCard key={item} priority="P3" title={item} />
                  ))}
                </div>
              </CardPad>
            </Card>

            <Card style={{ borderColor: C.amberBorder }}>
              <CardPad>
                <SectionTitle style={detailSectionTitleStyle}>决策张力结构</SectionTitle>
                <DecisionTensionCard data={stateDetail.tension} showManualControls />
              </CardPad>
            </Card>

            <Card style={{ gridColumn: "1 / -1" }}>
              <CardPad>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <SectionTitle style={detailSectionTitleStyle}>关键待验证项</SectionTitle>
                  <Tag label={`当前 ${stateDetail.keyValidationItems.length} 项`} variant="amber" small />
                </div>
                <div className="detail-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {stateDetail.keyValidationItems.map((item) => {
                    const normalizedPriority = item.priority === "P1" ? "P0" : "P1";

                    return (
                      <PriorityCard key={item.title} priority={normalizedPriority} badgeLabel={item.priority} title={item.title}>
                        <div style={{ display: "grid", gap: 10 }}>
                          <div>
                            <div style={{ fontSize: 13, color: C.text2, marginBottom: 5, fontWeight: 600 }}>当前缺口</div>
                            <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{item.gap}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 13, color: C.text2, marginBottom: 5, fontWeight: 600 }}>影响判断</div>
                            <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{item.affects}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 13, color: C.text2, marginBottom: 5, fontWeight: 600 }}>对动作的影响</div>
                            <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{item.impact}</div>
                          </div>
                        </div>

                        <div style={{ marginTop: "auto", paddingTop: 4 }}>
                          <div style={{ fontSize: 13, color: C.text2, marginBottom: 6, fontWeight: 600 }}>建议补证方式</div>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span style={{ color: getPriorityTone(normalizedPriority).color, fontWeight: 700, fontSize: 14 }}>•</span>
                            <span style={{ fontSize: 14, color: C.text0, lineHeight: 1.8, letterSpacing: 0.1 }}>{item.suggestion}</span>
                          </div>
                        </div>
                      </PriorityCard>
                    );
                  })}
                </div>
              </CardPad>
            </Card>
          </div>
          <Card>
            <CardPad>
              <SectionTitle style={detailSectionTitleStyle}>最新状态版本摘要</SectionTitle>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{customer.stateVersions[0].version}</span>
                <Tag label={customer.stateVersions[0].level} variant={customer.stateVersions[0].level === "重要更新" ? "amber" : "neutral"} small />
                <Tag label={customer.stateVersions[0].date} variant="neutral" small />
              </div>
              <div style={{ fontSize: 12.5, color: C.text1, marginBottom: 8 }}>触发原因：{customer.stateVersions[0].trigger}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {customer.stateVersions[0].changed.map((field) => (
                  <Tag key={field} label={field} variant="purple" small />
                ))}
              </div>
              <div style={{ fontSize: 12, color: C.text2 }}>审批人：{customer.stateVersions[0].approvedBy}</div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                <button
                  onClick={() => setVersionTraceExpanded((prev) => !prev)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    状态版本流 / 治理追溯
                  </span>
                  <span style={{ fontSize: 13, color: C.blue, fontWeight: 600 }}>{versionTraceExpanded ? "收起" : "展开"}</span>
                </button>
                {versionTraceExpanded && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                    {customer.stateVersions.map((version) => (
                      <div
                        key={version.version}
                        style={{
                          border: `1px solid ${version.level === "重要更新" ? C.amberBorder : C.border}`,
                          borderLeft: `3px solid ${version.level === "重要更新" ? C.amber : C.borderMd}`,
                          borderRadius: 8,
                          padding: "12px 14px",
                          background: C.surfaceAlt,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text0 }}>{version.version}</span>
                            <Tag label={version.level} variant={version.level === "重要更新" ? "amber" : "neutral"} small />
                          </div>
                          <span style={{ fontSize: 11.5, color: C.text3 }}>{version.date}</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.text2, marginBottom: 8 }}>触发原因：{version.trigger}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                          {version.changed.map((field) => (
                            <Tag key={field} label={field} variant="purple" small />
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: C.text2, marginBottom: version.note ? 8 : 0, gap: 8, flexWrap: "wrap" }}>
                          <span>
                            审批人：<strong style={{ color: C.text1 }}>{version.approvedBy}</strong>
                          </span>
                          <span>参与助手：{version.agents.join("、")}</span>
                        </div>
                        {version.note && <div style={{ background: C.surface, borderRadius: 6, padding: "8px 12px", fontSize: 12, color: C.text1 }}>{version.note}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardPad>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>事件与版本</div>
          <div style={{ display: "flex", background: C.surfaceAlt, borderRadius: 10, padding: 4, border: `1px solid ${C.border}` }}>
            {[
              { id: "history", label: "客户触达任务历史" },
              { id: "assignment", label: "责任协同详情" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setWorkTab(item.id as "history" | "assignment")}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 8,
                  background: workTab === item.id ? C.surface : "none",
                  border: workTab === item.id ? `1px solid ${C.border}` : "1px solid transparent",
                  color: workTab === item.id ? C.text0 : C.text2,
                  fontSize: 12.5,
                  fontWeight: workTab === item.id ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          {workTab === "history" && (
            <Card>
              <CardPad style={{ paddingBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                  <SectionTitle style={detailSectionTitleStyle}>客户触达任务历史</SectionTitle>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 12, color: C.text2 }}>责任人筛选</div>
                    <div style={{ display: "flex", background: C.surfaceAlt, borderRadius: 8, padding: 4, border: `1px solid ${C.border}` }}>
                      {historyOwnerOptions.map((owner) => (
                        <button
                          key={owner}
                          onClick={() => setHistoryOwnerFilter(owner)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "none",
                            background: historyOwnerFilter === owner ? C.surface : "transparent",
                            color: historyOwnerFilter === owner ? C.text0 : C.text2,
                            fontSize: 12,
                            fontWeight: historyOwnerFilter === owner ? 600 : 400,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {owner}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {historyEvents.map((event) => {
                  const typeColor = { SALES_VISIT: C.blue, PRE_SALES: C.amber, CS_OUTREACH: C.green }[event.type];
                  const typeBg = { SALES_VISIT: C.blueLight, PRE_SALES: C.amberLight, CS_OUTREACH: C.greenLight }[event.type];

                  return (
                    <div key={event.id} style={{ marginBottom: 12 }}>
                      <Card style={{ borderLeft: `3px solid ${typeColor}` }}>
                        <CardPad>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <span style={{ background: typeBg, color: typeColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 5 }}>
                                {event.typeLabel}
                              </span>
                              <span style={{ fontSize: 11.5, color: C.text2 }}>{event.id}</span>
                            </div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <span style={{ fontSize: 12, color: C.text2 }}>{event.owner}</span>
                              <span style={{ fontSize: 11.5, color: C.text3 }}>{event.date}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{event.summary}</div>
                        </CardPad>
                      </Card>
                    </div>
                  );
                })}
                {historyEvents.length === 0 && (
                  <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 13, color: C.text2 }}>
                    当前筛选条件下暂无客户触达记录。
                  </div>
                )}
              </CardPad>
            </Card>
          )}
          {workTab === "assignment" && (
            <Card>
              <CardPad style={{ paddingBottom: 8 }}>
                <div style={{ fontSize: 11, color: C.text2, marginBottom: 4 }}>当前 owner</div>
                <div style={{ fontSize: 18, color: C.text0, fontWeight: 700, marginBottom: 16 }}>
                  {summary.assignment.owner.name}（{summary.assignment.owner.role}）
                </div>
                <SectionTitle style={detailSectionTitleStyle}>责任协同详情</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 13, color: C.text1 }}>销售</div>
                    <div style={{ fontSize: 14, color: C.text0, fontWeight: 700, textAlign: "right" }}>{summary.assignment.owner.name}</div>
                  </div>
                  {summary.assignment.collaborators.map((item) => (
                    <div key={item.type} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                      <div style={{ fontSize: 13, color: C.text1 }}>{item.role}</div>
                      <div style={{ fontSize: 14, color: C.text0, fontWeight: 700, textAlign: "right" }}>{item.name}</div>
                    </div>
                  ))}
                  <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 13, color: C.text1 }}>{summary.assignment.supervisor.role}</div>
                    <div style={{ fontSize: 14, color: C.text0, fontWeight: 700, textAlign: "right" }}>{summary.assignment.supervisor.name}</div>
                  </div>
                </div>
              </CardPad>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function SalesPage() {
  const [inputText, setInputText] = useState("");
  const signal = "刘总说他老婆更想买奔驰，觉得比亚迪不够档次，但他自己挺喜欢这个车的智能系统，就是觉得价格高了点。";
  const approvalMaterials = [
    {
      agent: "Sales Agent",
      title: "销售跟进摘要",
      summary: "确认客户本人仍保持高意向，但家庭决策已从单人推进切换为双人共识推进。",
      time: "今天 10:20",
    },
    {
      agent: "Sales Agent",
      title: "现场补充记录",
      summary: "建议优先组织家庭到店体验，并提前准备品牌对比与空间体验素材。",
      time: "今天 10:26",
    },
    {
      agent: "Customer Agent",
      title: "状态候选更新",
      summary: "配偶从隐性阻力升级为关键影响者，预算与品牌认知成为主状态张力。",
      time: "今天 10:28",
    },
  ] as const;
  const candidates = {
    priorities: ["配偶认可度（新增，优先级高）", "品牌认知与功能体验的决策权重"],
    objections: ["配偶偏好传统品牌（新增）", "价格偏高（确认，持续）"],
    tension: {
      title: "功能体验偏好 vs 品牌认知与价格阻力",
      leftLabel: "功能体验偏好",
      leftSummary: "客户本人已表现出对智能系统的明确兴趣，技术体验仍是可推进点。",
      leftForces: ["挺喜欢智能系统", "客户本人保持正向体验反馈", "功能优势仍有说服空间"],
      rightLabel: "品牌认知与价格阻力",
      rightSummary: "配偶偏好传统品牌，同时价格偏高让家庭决策更保守。",
      rightForces: ["老婆更想买奔驰", "觉得不够档次", "价格高了点"],
      currentBalance: "当前仍受品牌认知阻力主导，价格敏感同步压制推进",
      balanceDirection: "right",
      whyItMatters: "这说明下一步不能继续只讲参数，而要优先处理家庭层面的品牌顾虑。",
      actionHint: "先补品牌对比材料和家庭体验场景，再判断是否适合进入报价推进。",
      evidenceEntryLabel: "Based on 3 signals",
      evidence: ["「他老婆更想买奔驰」→ 配偶主动偏好", "「觉得不够档次」→ 品牌感知障碍", "「价格高了点」→ 价格阻力确认"],
    },
  } as const;

  return (
    <div>
      <Header page="sales" />
      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24, maxWidth: 1200, margin: "24px auto", padding: "0 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ borderColor: C.amberBorder }}>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <SectionTitle>待审批详情</SectionTitle>
                  <div style={{ fontSize: 13, color: C.text2 }}>默认展示 Sales Agent 与 Customer Agent 的材料，用于你完成本次审批。</div>
                </div>
                <Tag label="销售视角" variant="amber" small />
              </div>
              <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                {approvalMaterials.map((item) => (
                  <div key={`${item.agent}-${item.title}`} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <Tag label={item.agent} variant={item.agent === "Sales Agent" ? "blue" : "neutral"} small />
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{item.title}</span>
                      </div>
                      <span style={{ fontSize: 12, color: C.text2 }}>{item.time}</span>
                    </div>
                    <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{item.summary}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <PrimaryBtn style={{ minWidth: 106 }}>审批</PrimaryBtn>
                <SecondaryBtn style={{ minWidth: 180 }}>修改后提交</SecondaryBtn>
                <DangerBtn style={{ minWidth: 106 }}>驳回</DangerBtn>
              </div>
            </CardPad>
          </Card>

          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>理解构建</div>

          <Card>
            <CardPad>
              <SectionTitle>输入区</SectionTitle>
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="输入拜访记录、客户原话或关键信号…"
                  style={{
                    flex: 1,
                    minWidth: 220,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: 13,
                    color: C.text0,
                    background: C.surface,
                    outline: "none",
                    fontFamily: C.sans,
                  }}
                />
                <SecondaryBtn style={{ padding: "9px 12px", fontSize: 16 }}>🎤</SecondaryBtn>
                <PrimaryBtn>分析</PrimaryBtn>
              </div>
              <div style={{ fontSize: 12, color: C.text2 }}>近期背景：第二次试驾完成 · 配偶加入决策 · 价格阻力持续</div>
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <SectionTitle>原始信号</SectionTitle>
              <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", fontSize: 13.5, color: C.text0, lineHeight: 1.8, fontStyle: "italic", marginBottom: 12 }}>
                {signal}
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>关键信号短语</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["老婆更想买奔驰", "不够档次", "挺喜欢智能系统", "价格高了点"].map((phrase) => (
                  <Tag key={phrase} label={phrase} variant="amber" />
                ))}
              </div>
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <SectionTitle>人工解读</SectionTitle>
                <Tag label="置信度高" variant="green" small />
              </div>
              <div style={{ fontSize: 13.5, color: C.text0, lineHeight: 1.75, marginBottom: 10 }}>
                核心判断：<strong>决策核心已从刘浩个人变为双核家庭决策</strong>，配偶持有品牌否决权，价格是次要但持续的阻力。
              </div>
              <div style={{ background: C.surfaceAlt, borderRadius: 6, padding: "9px 12px", fontSize: 12.5, color: C.text1, lineHeight: 1.65 }}>
                系统理解：「不够档次」反映的是品牌社会认知问题，而非产品功能问题。配偶介入是关键状态变化。
              </div>
            </CardPad>
          </Card>

          <Card style={{ borderColor: C.greenBorder }}>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <SectionTitle>候选状态更新</SectionTitle>
                <Tag label="待确认" variant="amber" />
              </div>
              {[{ label: "关注重点：新增", items: candidates.priorities }, { label: "异议事项：更新", items: candidates.objections }].map((section) => (
                <div key={section.label} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>{section.label}</div>
                  {section.items.map((item) => (
                    <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 10px", background: C.greenLight, borderRadius: 7, marginBottom: 5, border: `1px solid ${C.greenBorder}` }}>
                      <span style={{ color: C.green, fontWeight: 700 }}>+</span>
                      <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item}</span>
                      <SecondaryBtn style={{ padding: "3px 10px", fontSize: 11 }}>编辑</SecondaryBtn>
                    </div>
                  ))}
                </div>
              ))}

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>决策张力：更新</div>
                <DecisionTensionCard data={candidates.tension} compact />
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <PrimaryBtn style={{ flex: 1 }}>确认状态更新</PrimaryBtn>
                <SecondaryBtn>修改</SecondaryBtn>
              </div>
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <SectionTitle>置信度与不确定性</SectionTitle>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>低置信字段</div>
                {["配偶的具体品牌偏好来源", "配偶在决策中的实际否决权重"].map((field, index) => (
                  <Row key={field} last={index === 1}>
                    <span style={{ color: C.amber, fontWeight: 700 }}>~</span>
                    <span style={{ fontSize: 13, color: C.text1 }}>{field}</span>
                  </Row>
                ))}
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>待解问题</div>
              {["配偶是否有机会直接体验产品？", "是否存在家庭联合决策的最优接触点？"].map((question, index) => (
                <Row key={question} last={index === 1}>
                  <span style={{ color: C.red, fontWeight: 700 }}>?</span>
                  <span style={{ fontSize: 13, color: C.text0 }}>{question}</span>
                </Row>
              ))}
              <div style={{ marginTop: 10, background: C.surfaceAlt, borderRadius: 6, padding: "9px 12px", fontSize: 12, color: C.text2 }}>
                置信度影响：配偶决策权不明 → 整体置信度维持 72%，等待配偶体验后再评估
              </div>
            </CardPad>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>编排反馈</div>

          <Card style={{ borderColor: C.blueBorder }}>
            <CardPad>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.blue, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>当前负责人</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text0 }}>{customer.currentOwner}</div>
              <div style={{ fontSize: 12, color: C.text2 }}>当前路径：进行中 · 暂无转交</div>
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <SectionTitle>建议下一步动作</SectionTitle>
              <div style={{ fontSize: 13.5, color: C.text0, lineHeight: 1.7, background: C.surfaceAlt, padding: "10px 12px", borderRadius: 7, marginBottom: 12 }}>
                {customer.currentTask.recommendedAction}
              </div>
              <div style={{ fontSize: 11, color: C.text2, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>时间窗口</div>
              <div style={{ fontSize: 13, color: C.amber, fontWeight: 500 }}>{customer.currentTask.timeWindow}</div>
            </CardPad>
          </Card>

          <Card style={{ borderColor: C.redBorder }}>
            <CardPad style={{ paddingBottom: 8 }}>
              <SectionTitle>受限动作</SectionTitle>
              {customer.currentTask.blockedActions.map((action, index) => (
                <Row key={action} last={index === customer.currentTask.blockedActions.length - 1}>
                  <span style={{ color: C.red, fontWeight: 700 }}>✕</span>
                  <span style={{ fontSize: 13, color: C.text1 }}>{action}</span>
                </Row>
              ))}
            </CardPad>
          </Card>

          <Card style={{ borderColor: C.amberBorder }}>
            <CardPad>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.amber, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>审核级别</div>
              <div style={{ fontSize: 13, color: C.text0 }}>{customer.currentTask.reviewState}</div>
            </CardPad>
          </Card>

          <AgentBlock text={customer.currentTask.agentDraft} label="角色助手 · 建议话术" />

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <PrimaryBtn style={{ flex: 1 }}>提交记录</PrimaryBtn>
            <SecondaryBtn>保存草稿</SecondaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function CSPage() {
  const cr = customer.contactReadiness;
  const ro = customer.recommendedOutreach;
  const approvalMaterials = [
    {
      agent: "CS Agent",
      title: "触达限制判断",
      summary: "本轮外呼仅建议通过已授权主联系人触达，不可直接联系配偶，也不可提前给出口头优惠承诺。",
      time: "今天 15:35",
    },
    {
      agent: "CS Agent",
      title: "回访建议草稿",
      summary: "建议用服务与体验补充切入，确认客户是否愿意安排家庭体验窗口。",
      time: "今天 15:38",
    },
    {
      agent: "Customer Agent",
      title: "状态候选更新",
      summary: "客户进入需要服务协同的家庭决策阶段，当前应先稳住关系温度，再补齐关键验证信息。",
      time: "今天 15:40",
    },
  ] as const;

  return (
    <div>
      <Header page="cs" />
      <div style={{ background: C.amberLight, borderBottom: `1px solid ${C.amberBorder}`, padding: "10px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#92400E", fontWeight: 500 }}>
            ⚠ 本次外呼需遵守授权边界。直接联系配偶及承诺折扣均受限，需升级审批。
          </span>
          <Tag label="需要审核" variant="amber" small />
        </div>
      </div>

      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24, maxWidth: 1200, margin: "24px auto", padding: "0 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ borderColor: C.amberBorder }}>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <SectionTitle>待审批详情</SectionTitle>
                  <div style={{ fontSize: 13, color: C.text2 }}>默认展示 CS Agent 与 Customer Agent 的材料，用于你完成本次审批。</div>
                </div>
                <Tag label="客服视角" variant="amber" small />
              </div>
              <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                {approvalMaterials.map((item) => (
                  <div key={`${item.agent}-${item.title}`} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <Tag label={item.agent} variant={item.agent === "CS Agent" ? "blue" : "neutral"} small />
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{item.title}</span>
                      </div>
                      <span style={{ fontSize: 12, color: C.text2 }}>{item.time}</span>
                    </div>
                    <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{item.summary}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <PrimaryBtn style={{ minWidth: 106 }}>审批</PrimaryBtn>
                <SecondaryBtn style={{ minWidth: 180 }}>修改后提交</SecondaryBtn>
                <DangerBtn style={{ minWidth: 106 }}>驳回</DangerBtn>
              </div>
            </CardPad>
          </Card>

          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>触达准备度</div>

          <Card style={{ borderColor: C.greenBorder }}>
            <CardPad style={{ paddingBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <SectionTitle>允许动作</SectionTitle>
                <Tag label={`允许 ${cr.allowed.length} 项`} variant="green" small />
              </div>
              {cr.allowed.map((action, index) => (
                <Row key={action} last={index === cr.allowed.length - 1}>
                  <span style={{ color: C.green, fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: 13, color: C.text0 }}>{action}</span>
                </Row>
              ))}
            </CardPad>
          </Card>

          <Card style={{ borderColor: C.redBorder }}>
            <CardPad style={{ paddingBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <SectionTitle>受限动作</SectionTitle>
                <Tag label={`受限 ${cr.blocked.length} 项`} variant="red" small />
              </div>
              {cr.blocked.map((action, index) => (
                <Row key={action} last={index === cr.blocked.length - 1}>
                  <span style={{ color: C.red, fontWeight: 700 }}>✕</span>
                  <span style={{ fontSize: 13, color: C.text1 }}>{action}</span>
                </Row>
              ))}
              <div style={{ marginTop: 12, background: C.redLight, borderRadius: 7, padding: "9px 12px", fontSize: 12, color: C.red }}>
                限制来源：授权边界 / 合规策略 / 审批流程。如需突破，提交升级申请。
              </div>
            </CardPad>
          </Card>

          <div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Card>
              <CardPad>
                <SectionTitle>优先渠道</SectionTitle>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 22 }}>💬</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text0 }}>{cr.channel}</div>
                    <div style={{ fontSize: 11.5, color: C.text2 }}>{cr.channelNote}</div>
                  </div>
                </div>
              </CardPad>
            </Card>
            <Card>
              <CardPad>
                <SectionTitle>关系温度</SectionTitle>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: C.surfaceAlt, borderRadius: 3, overflow: "hidden", border: `1px solid ${C.border}` }}>
                    <div style={{ width: "70%", height: "100%", background: C.amber, borderRadius: 3 }} />
                  </div>
                  <Tag label={cr.tempLabel} variant="amber" small />
                </div>
              </CardPad>
            </Card>
          </div>

          <Card>
            <CardPad style={{ paddingBottom: 4 }}>
              <SectionTitle>近期触达记录</SectionTitle>
              {cr.contacts.map((contact, index) => (
                <Row key={`${contact.date}-${contact.type}`} last={index === cr.contacts.length - 1}>
                  <span style={{ fontSize: 12, color: C.text2, minWidth: 58 }}>{contact.date}</span>
                  <Tag label={contact.channel} variant="neutral" small />
                  <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{contact.type}</span>
                  <StatusPill label={contact.result === "positive" ? "✓ 正向反馈" : contact.result} variant={contact.result === "positive" ? "green" : "neutral"} />
                </Row>
              ))}
            </CardPad>
          </Card>

          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>近期背景</div>

          <Card>
            <CardPad>
              <SectionTitle>最新相关事件</SectionTitle>
              <div style={{ borderLeft: `3px solid ${C.blue}`, paddingLeft: 12 }}>
                <div style={{ fontSize: 11, color: C.text2, marginBottom: 4 }}>
                  {customer.events[0].id} · {customer.events[0].typeLabel}
                </div>
                <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{customer.events[0].summary}</div>
              </div>
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <SectionTitle>最新状态版本</SectionTitle>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{customer.stateVersions[0].version}</span>
                <Tag label="重要更新" variant="amber" small />
              </div>
              <div style={{ fontSize: 12, color: C.text2, marginBottom: 4 }}>变更内容：{customer.stateVersions[0].changed.join("、")}</div>
              <div style={{ fontSize: 12, color: C.text2 }}>触发原因：{customer.stateVersions[0].trigger}</div>
            </CardPad>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>建议触达方案</div>

          <Card style={{ borderColor: C.blueBorder }}>
            <CardPad>
              <SectionTitle>触达目标</SectionTitle>
              <div style={{ fontSize: 14, color: C.text0, lineHeight: 1.7, background: C.surfaceAlt, padding: "10px 12px", borderRadius: 7, marginBottom: 12 }}>{ro.goal}</div>
              <Row>
                <span style={{ fontSize: 11.5, color: C.text2, minWidth: 72 }}>话术风格</span>
                <span style={{ fontSize: 13, color: C.text0 }}>{ro.style}</span>
              </Row>
              <Row last>
                <span style={{ fontSize: 11.5, color: C.text2, minWidth: 72 }}>时间窗口</span>
                <span style={{ fontSize: 13, color: C.amber, fontWeight: 500 }}>{ro.window}</span>
              </Row>
            </CardPad>
          </Card>

          <Card style={{ borderColor: C.amberBorder }}>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <SectionTitle>审核状态</SectionTitle>
                <Tag label="需要审核" variant="amber" small />
              </div>
              <div style={{ fontSize: 13, color: C.text0 }}>{ro.review}</div>
            </CardPad>
          </Card>

          <AgentBlock text={ro.script} label="客户助手 · 话术草稿" />

          <Card>
            <CardPad>
              <SectionTitle>置信度与风险</SectionTitle>
              <ConfidenceBar value={customer.confidence} />
              <div style={{ marginTop: 12, background: C.surfaceAlt, borderRadius: 6, padding: "9px 12px", fontSize: 12, color: C.text1, lineHeight: 1.65 }}>
                配偶决策权重未知，置信度维持 72%。本次外呼如能推动配偶参与体验，置信度预计可升至 82%。
              </div>
            </CardPad>
          </Card>

          <Card>
            <CardPad style={{ paddingBottom: 8 }}>
              <SectionTitle>待解问题</SectionTitle>
              {customer.unresolvedQuestions.map((question, index) => (
                <Row key={question} last={index === customer.unresolvedQuestions.length - 1}>
                  <span style={{ color: C.red, fontWeight: 700 }}>?</span>
                  <span style={{ fontSize: 13, color: C.text0 }}>{question}</span>
                </Row>
              ))}
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <SectionTitle>允许原因与受限原因</SectionTitle>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.green, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>允许原因</div>
                <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65 }}>售后资料属于已授权信息范围；家庭体验邀约通过主联系人刘浩转达，不直接触达配偶。</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.red, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>受限原因</div>
                <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65 }}>直接联系配偶违反数据授权规则；承诺折扣超出客服角色权限范围。</div>
              </div>
            </CardPad>
          </Card>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <PrimaryBtn style={{ flex: 1 }}>记录触达</PrimaryBtn>
            <DangerBtn>升级处理</DangerBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function GovernancePage() {
  type GovernanceAgentId = "customer_state" | "sales" | "cs" | "presale" | "orchestrator";
  const g = stateGovernanceWorkbench;
  const [adminCardOpen, setAdminCardOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<GovernanceAgentId>("customer_state");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const adminProfile = {
    name: "Vicky Shou",
    dept: "智能体平台 / 产品设计",
    title: "平台管理员 · Staff",
    phone: "138-0013-1024",
    badge: "VS",
  } as const;
  const governanceAgents: Array<{
    id: GovernanceAgentId;
    englishName: string;
    chineseName: string;
    subtitle: string;
    responsibility: string;
    statusSummary: string;
    rolePrompt: string;
    specialCards: Array<{ title: string; content: string }>;
    tableTitle: string;
    tableColumns: string[];
    tableColumnTemplate: string;
    tableRows: Array<{ key: string; cells: ReactNode[] }>;
    changeLog: Array<{
      changedBy: string;
      change: string;
      effectiveAt: string;
      impact: string;
      roleImpact: string;
      agentImpact: string;
      status: string;
    }>;
  }> = [
    {
      id: "customer_state",
      englishName: "Customer State Agent",
      chineseName: "客户状态智能体",
      subtitle: "负责客户状态结构、维度沉淀、解释结果与候选状态更新。",
      responsibility: "重点治理它如何定义状态维度、如何输出候选状态更新，以及哪些内容必须进入 owner 确认。",
      statusSummary: "已启用｜影响 3 个页面｜2 项待发布变更",
      rolePrompt: `# 客户状态智能体

## 关注要点
- 维度是否进入正式版本沉淀
- 候选状态更新的写入边界
- 角色解释是否偏离统一 State 结构

## 禁止动作边界
- 不得直接写入正式 Customer State
- 不得替销售 owner 生成最终业务决策
- 不得绕过 owner 审批修改关键关系模式与核心 objection

## 让位 / 交接时机
- 当进入成交推进或明确业务动作决策时，让位给销售智能体
- 当 route、owner 或 review 门槛发生变化时，让位给旅程编排器

## 生成内容规范
- 可生成：候选状态更新、证据归纳、不确定性提示、角色解释
- 候选状态更新只作为建议，不直接入库
- 涉及关系模式、核心异议、owner 判断时必须 owner 确认

## 职责边界
- 服务对象：销售 owner、客服、经理
- 不负责：成交推进、外呼动作、route 切换决策
- 协作边界：为销售智能体和旅程编排器提供状态理解基础，不替代 owner 判断`,
      specialCards: [
        { title: "冲突处理原则", content: "当事实记录与角色解释冲突时，以一线事实和明确证据优先，角色解释只能作为补充视角。" },
        { title: "输出是否必须 owner 确认", content: "涉及关键维度变更、关系结构调整、核心 objection 更新时，必须进入 owner 确认。" },
        { title: "写入边界", content: "candidate state updates 只可写入候选缓冲区，不可直接覆盖正式版本与治理规则。" },
      ],
      tableTitle: "维度配置表",
      tableColumns: ["维度名", "定义说明", "进入版本沉淀", "首屏显示", "角色共享", "适用页面", "适用角色", "编辑"],
      tableColumnTemplate: "1.1fr 1.8fr 0.8fr 0.8fr 0.8fr 1.1fr 1fr auto",
      tableRows: g.stateDimensions.map((item) => ({
        key: item.code,
        cells: [
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text0, marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: C.text2 }}>{item.code}</div>
          </div>,
          <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item.description}</div>,
          <GovernanceToggle enabled={item.versioned} />,
          <GovernanceToggle enabled={item.visibleOnTop} />,
          <GovernanceToggle enabled={item.sharedAcrossRoles} />,
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{item.pages.map((page) => <Tag key={page} label={page} variant="neutral" small />)}</div>,
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{item.roles.map((role) => <Tag key={role} label={role} variant="blue" small />)}</div>,
          <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>编辑</SecondaryBtn>,
        ],
      })),
      changeLog: g.changeLog.filter((item) => item.agentImpact.includes("Customer")),
    },
    {
      id: "sales",
      englishName: "Sales Agent",
      chineseName: "销售智能体",
      subtitle: "负责销售动作建议、沟通草稿、异议处理与跟进节奏建议。",
      responsibility: "重点治理它输出什么销售类结果、在哪些阶段启用、哪些内容必须由 owner 最终确认。",
      statusSummary: "已启用｜输出需 owner 确认",
      rolePrompt: `# 销售智能体

## 关注要点
- 输出建议不能越权替代 owner
- 跟进时机建议要结合阶段和风险
- 沟通草稿不能出现违规承诺与过度逼单

## 禁止动作边界
- 不得承诺折扣、金融政策、交付窗口等超权限信息
- 不得绕过授权直接联系受限对象
- 不得把建议动作直接视为正式任务

## 让位 / 交接时机
- 技术验证升高时让位给售前智能体
- 服务投诉或回访场景让位给客服智能体
- 高风险 route 冲突时让位给旅程编排器 / 经理 review

## 生成内容规范
- 可生成：跟进建议、沟通草稿、试驾总结草稿、异议处理提示、联系时机建议、交接摘要
- 所有销售类输出默认只是建议
- 涉及价格承诺、跨角色交接、重大状态判断时必须 owner 确认

## 职责边界
- 服务对象：销售 owner
- 不负责：写入客户状态、定义客服触达规则、自动切换 owner
- 协作边界：依赖客户状态智能体提供解释基础，配合旅程编排器调整节奏，不直接决定 route`,
      specialCards: [
        { title: "关注要点", content: "重点关注客户阶段、核心异议、联系时机与销售 owner 当前目标，不生成脱离上下文的销售话术。" },
        { title: "禁止动作边界", content: "不得承诺折扣、金融政策、交付窗口等超权限信息，不得绕过授权直接联系受限对象。" },
        { title: "让位 / 交接时机", content: "当技术验证、服务争议或高风险冲突升高时，需提示让位给售前、客服或经理 review。" },
      ],
      tableTitle: "输出规范表",
      tableColumns: ["输出类型", "说明", "是否启用", "必须 owner 确认", "适用阶段", "适用页面", "编辑"],
      tableColumnTemplate: "1fr 1.6fr 0.8fr 0.9fr 1fr 1fr auto",
      tableRows: [
        ["跟进建议", "根据阶段、异议与窗口给出下一步推进建议。", true, true, "意向 / 评估", "我的工作台"],
        ["沟通草稿", "生成可修改的销售沟通文案。", true, true, "全阶段", "当前任务区"],
        ["试驾总结草稿", "沉淀试驾后要点与后续推进提示。", true, true, "试驾后", "销售轻记录"],
        ["异议处理提示", "针对 objection 给出应对切口与材料建议。", true, true, "评估 / 成交前", "客户状态工作台"],
        ["联系时机建议", "结合活跃度和阶段给出触达节奏。", true, false, "全阶段", "我的工作台"],
        ["交接摘要", "在需要让位时输出交接给售前/客服的摘要。", false, true, "升级场景", "客户状态工作台"],
      ].map((item) => ({
        key: item[0] as string,
        cells: [
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{item[0]}</div>,
          <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item[1]}</div>,
          <GovernanceToggle enabled={item[2] as boolean} />,
          <GovernanceToggle enabled={item[3] as boolean} />,
          <Tag label={item[4] as string} variant="neutral" small />,
          <Tag label={item[5] as string} variant="blue" small />,
          <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>编辑</SecondaryBtn>,
        ],
      })),
      changeLog: [
        { changedBy: "周岚", change: "新增试驾总结草稿模板", effectiveAt: "2026-03-21 11:20", impact: "销售轻记录", roleImpact: "销售", agentImpact: "销售智能体", status: "待发布" },
        { changedBy: "王芳", change: "提高价格相关内容的 owner 确认门槛", effectiveAt: "2026-03-20 18:10", impact: "当前任务区", roleImpact: "销售 owner", agentImpact: "销售智能体", status: "已生效" },
      ],
    },
    {
      id: "cs",
      englishName: "CS Agent",
      chineseName: "客服智能体",
      subtitle: "负责服务通知、回访建议、满意度回收与异常升级提示。",
      responsibility: "重点治理客服类任务是否允许主动触达、渠道限制、确认要求和被打扰风险控制。",
      statusSummary: "已启用｜影响 2 个页面｜渠道受限",
      rolePrompt: `# 客服智能体

## 关注要点
- 主动触达必须遵守授权与渠道偏好
- 服务响应不能越权承诺
- 投诉和被打扰风险要优先拦截

## 禁止动作边界
- 不得主动联系未授权对象
- 不得承诺折扣、交付与金融政策
- 不得将服务反馈直接升级为正式状态结论

## 让位 / 交接时机
- 涉及成交推进时让位给销售智能体
- 涉及技术解释时让位给售前智能体
- 风险升级与 route 冲突时让位给旅程编排器 / 经理

## 生成内容规范
- 可生成：服务通知、外呼回访、满意度回访、异常升级建议、服务反馈结构化结果
- 服务反馈结构化结果可进入候选记录，但不能自动写入最终服务结论
- 主动外呼、异常升级建议默认需要客服 owner 确认

## 职责边界
- 服务对象：客服 owner 与服务协同角色
- 不负责：成交推进、技术方案说明、客户状态版本判断
- 协作边界：与销售智能体共享上下文，配合旅程编排器升级异常，但不改写 owner`,
      specialCards: [
        { title: "允许 / 受限动作", content: "允许发送服务通知与售后资料；受限于主动联系配偶、承诺折扣、跨角色说明金融政策。" },
        { title: "渠道偏好规则", content: "优先遵守客户已授权渠道；当客户明确拒绝外呼时，仅保留被动响应与授权内触达。" },
        { title: "投诉 / 被打扰风险控制", content: "同一自然日避免重复主动触达；出现投诉信号时，优先升级人工 review。" },
      ],
      tableTitle: "触达与服务配置表",
      tableColumns: ["任务类型", "说明", "渠道限制", "允许主动触达", "需要确认", "适用页面", "编辑"],
      tableColumnTemplate: "1fr 1.5fr 1fr 0.9fr 0.8fr 1fr auto",
      tableRows: [
        ["服务通知", "发送服务节点通知与已授权资料。", "微信 / 短信", true, false, "客服触达检查"],
        ["外呼回访", "对服务节点后的体验做主动回访。", "仅授权电话", false, true, "客服触达检查"],
        ["满意度回访", "收集服务满意度和负面反馈。", "微信优先", true, true, "客服触达检查"],
        ["异常升级建议", "发现服务异常时建议升级人工处理。", "不限", true, true, "客户状态工作台"],
        ["服务反馈结构化结果", "把服务反馈整理成可追溯结果。", "不限", false, false, "客户状态工作台"],
      ].map((item) => ({
        key: item[0] as string,
        cells: [
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{item[0]}</div>,
          <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item[1]}</div>,
          <Tag label={item[2] as string} variant="neutral" small />,
          <GovernanceToggle enabled={item[3] as boolean} />,
          <GovernanceToggle enabled={item[4] as boolean} />,
          <Tag label={item[5] as string} variant="blue" small />,
          <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>编辑</SecondaryBtn>,
        ],
      })),
      changeLog: [
        { changedBy: "李明", change: "补充满意度回访的渠道偏好限制", effectiveAt: "2026-03-21 09:50", impact: "客服触达检查", roleImpact: "客服", agentImpact: "客服智能体", status: "已生效" },
        { changedBy: "周岚", change: "新增投诉风险下的强制确认规则", effectiveAt: "2026-03-20 16:40", impact: "异常升级", roleImpact: "客服、经理", agentImpact: "客服智能体", status: "待发布" },
      ],
    },
    {
      id: "presale",
      englishName: "Presale Agent",
      chineseName: "售前智能体",
      subtitle: "负责技术解释、材料推荐、技术风险边界说明与售前支持建议。",
      responsibility: "重点治理售前智能体在什么条件下介入、可以生成哪些技术支持类内容、何时可主导参与。",
      statusSummary: "已启用｜技术支持需触发条件",
      rolePrompt: `# 售前智能体

## 关注要点
- 技术解释不能脱离已确认事实
- 技术介入要有明确触发条件
- 不能替销售承接非技术类推进任务

## 禁止动作边界
- 不得把技术支持内容包装成成交承诺
- 不得直接主导非技术类客户推进
- 不得绕过销售 owner 自行升级 route

## 让位 / 交接时机
- 技术问题解决后让位回销售智能体
- 服务类问题出现时让位给客服智能体
- route 或 owner 争议时让位给旅程编排器

## 生成内容规范
- 可生成：技术解释摘要、技术材料推荐、风险边界说明、售前支持建议
- 技术材料推荐与边界说明仅作为支持资料
- 技术验证升高时，售前支持建议需要销售 owner 确认后生效

## 职责边界
- 服务对象：销售 owner 与客户技术验证场景
- 不负责：非技术类成交推进、服务投诉处理、最终 route 决策
- 协作边界：与销售智能体协同服务技术验证阶段，与旅程编排器共享介入信号，不自行升级 owner`,
      specialCards: [
        { title: "技术验证型问题分类", content: "区分参数确认、能力边界、竞品对照、交付风险四类问题，避免售前内容泛化。" },
        { title: "介入条件", content: "客户明确提出技术验证、竞品参数差异、功能边界确认时，允许售前进入协同支持。" },
        { title: "主导候选条件", content: "只有当技术验证成为推进主阻力时，售前才进入主导候选，并需销售 owner 确认。" },
      ],
      tableTitle: "技术支持配置表",
      tableColumns: ["能力模块", "说明", "是否启用", "可主导介入", "适用页面", "编辑"],
      tableColumnTemplate: "1.1fr 1.8fr 0.8fr 0.9fr 1fr auto",
      tableRows: [
        ["技术解释摘要", "把复杂技术信息整理为可交付说明。", true, false, "客户状态工作台"],
        ["技术材料推荐", "根据问题类型推荐适配材料。", true, false, "售前支持页"],
        ["风险边界说明", "明确技术能力边界与使用限制。", true, false, "客户状态工作台"],
        ["售前支持建议", "在需要技术协同时输出行动建议。", true, true, "客户状态工作台"],
      ].map((item) => ({
        key: item[0] as string,
        cells: [
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{item[0]}</div>,
          <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item[1]}</div>,
          <GovernanceToggle enabled={item[2] as boolean} />,
          <GovernanceToggle enabled={item[3] as boolean} />,
          <Tag label={item[4] as string} variant="blue" small />,
          <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>编辑</SecondaryBtn>,
        ],
      })),
      changeLog: [
        { changedBy: "赵晨", change: "新增技术材料推荐模块", effectiveAt: "2026-03-21 10:05", impact: "售前支持页", roleImpact: "售前、销售", agentImpact: "售前智能体", status: "已生效" },
      ],
    },
    {
      id: "orchestrator",
      englishName: "Orchestrator",
      chineseName: "旅程编排器",
      subtitle: "负责 route、owner、handoff 规则以及 review / override 机制。",
      responsibility: "重点治理不同场景下默认 owner、自动切换条件、review 门槛和升级逻辑。",
      statusSummary: "已启用｜影响 4 个页面｜1 项待发布变更",
      rolePrompt: `# 旅程编排器

## 关注要点
- owner 与 route 规则必须稳定可解释
- 高风险冲突禁止自动切换
- override 只在高权限 review 后生效

## 禁止动作边界
- 不得生成业务话术
- 不得定义客户状态内容
- 不得替业务 owner 直接落地执行动作

## 让位 / 交接时机
- 当进入具体业务执行时让位给销售 / 客服 / 售前智能体
- 当进入经理 review 时让位给人工 override

## 生成内容规范
- 可生成：owner 建议、route 建议、handoff 提示、blocked action hints
- route 建议和 owner 建议都只作为候选，不自动生效
- 涉及跨角色切换、高风险升级时必须进入 review / override

## 职责边界
- 服务对象：owner、经理、多智能体协作流程
- 不负责：业务话术、客户状态定义、服务触达策略
- 协作边界：依赖客户状态智能体提供状态信号，调用其他智能体能力，但不替代任何业务 owner`,
      specialCards: [
        { title: "handoff 触发条件", content: "技术验证升高、服务问题升级、关系冲突上升、高风险异议持续时触发 handoff 候选。" },
        { title: "review / override 门槛", content: "跨角色切换、高风险升级、blocked action 冲突时必须进入 review，经理可 override。" },
        { title: "升级逻辑", content: "当 blocked action hints 被连续触发或 route 争议升高时，自动推送经理 review。" },
      ],
      tableTitle: "指派与流转规则表",
      tableColumns: ["场景", "默认 owner", "route 规则", "自动切换", "需要 review", "影响页面 / 角色", "编辑"],
      tableColumnTemplate: "1fr 1fr 1.4fr 0.8fr 0.8fr 1.2fr auto",
      tableRows: g.ownershipRules.map((item) => ({
        key: item.scenario,
        cells: [
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{item.scenario}</div>,
          <Tag
            label={
              item.scenario.includes("成交前")
                ? "销售"
                : item.scenario.includes("交付后")
                  ? "客服 / 售后"
                  : item.scenario.includes("技术验证")
                    ? "销售（售前候选）"
                    : "经理 review"
            }
            variant="neutral"
            small
          />,
          <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>
            <div style={{ marginBottom: 4 }}>{item.rule}</div>
            <div style={{ color: C.text2 }}>触发：{item.trigger}</div>
          </div>,
          <GovernanceToggle enabled={item.mode.includes("自动")} />,
          <GovernanceToggle enabled={item.review.includes("review") || item.review.includes("审批")} />,
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Tag label="客户状态工作台" variant="neutral" small />
            <Tag label="销售 / 客服 / 经理" variant="blue" small />
          </div>,
          <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>编辑</SecondaryBtn>,
        ],
      })),
      changeLog: g.changeLog.filter((item) => item.agentImpact.includes("Orchestrator")),
    },
  ];
  const selectedAgentDetail = governanceAgents.find((item) => item.id === selectedAgent) ?? governanceAgents[0];

  return (
    <div>
      <Header page="governance" />
      <div style={{ margin: "24px 0 40px", padding: "0 28px", display: "grid", gap: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase" }}>顶部摘要</div>
        <Card style={{ borderColor: C.borderMd, overflow: "visible" }}>
          <CardPad>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 560px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>摘要</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: C.text0, lineHeight: 1.1, marginBottom: 10 }}>智能体后台管理</div>
                <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.75, marginBottom: 14 }}>
                  本页面用于对所有智能体进行统一管理，可定义和修改话术风格、能力边界、任务类型、审批规则与协作方式。
                </div>
              </div>

              <div style={{ position: "relative", flex: "0 0 320px", maxWidth: "100%" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    background: C.surfaceAlt,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: C.text2, marginBottom: 4 }}>管理员</div>
                    <div style={{ fontSize: 13.5, color: C.text1 }}>点击头像查看信息</div>
                  </div>
                  <button
                    onClick={() => setAdminCardOpen((prev) => !prev)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: `1px solid ${C.blueBorder}`,
                      background: C.blueLight,
                      color: C.blue,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: 0.3,
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                  >
                    {adminProfile.badge}
                  </button>
                </div>

                {adminCardOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: "100%",
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      boxShadow: "0 10px 24px rgba(16,24,40,0.08)",
                      padding: "14px 16px",
                      zIndex: 5,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          border: `1px solid ${C.blueBorder}`,
                          background: C.blueLight,
                          color: C.blue,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          fontWeight: 700,
                        }}
                      >
                        {adminProfile.badge}
                      </div>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: C.text0, marginBottom: 4 }}>{adminProfile.name}</div>
                        <Tag label="页面管理员" variant="blue" small />
                      </div>
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }}>
                        <div style={{ fontSize: 12.5, color: C.text2 }}>部门</div>
                        <div style={{ fontSize: 13.5, color: C.text0 }}>{adminProfile.dept}</div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }}>
                        <div style={{ fontSize: 12.5, color: C.text2 }}>职级</div>
                        <div style={{ fontSize: 13.5, color: C.text0 }}>{adminProfile.title}</div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }}>
                        <div style={{ fontSize: 12.5, color: C.text2 }}>联系电话</div>
                        <div style={{ fontSize: 13.5, color: C.text0 }}>{adminProfile.phone}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </CardPad>
        </Card>

        <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase" }}>智能体治理目录</div>
        <div className="agent-directory-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
          {governanceAgents.map((agent) => (
            <AgentDirectoryCard
              key={agent.id}
              agent={agent}
              active={selectedAgent === agent.id && detailModalOpen}
              onOpen={() => {
                setSelectedAgent(agent.id);
                setDetailModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {detailModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(16,24,40,0.18)",
            zIndex: 140,
            padding: 24,
          }}
        >
          <div
            style={{
              width: "calc(100vw - 48px)",
              height: "calc(100vh - 48px)",
              margin: "0 auto",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 18,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "18px 22px",
                borderBottom: `1px solid ${C.border}`,
                background: C.surface,
                flexShrink: 0,
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>智能体参数仪表 / 规则详情</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.text0 }}>{selectedAgentDetail.chineseName}</div>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                style={{ border: "none", background: "transparent", fontSize: 28, lineHeight: 1, color: C.text0, cursor: "pointer", padding: 4 }}
                aria-label="关闭"
              >
                ×
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "22px 24px 28px",
              }}
            >
              <div style={{ display: "grid", gap: 18, minHeight: "min-content" }}>
                <Card>
                  <CardPad>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, color: C.text2, fontWeight: 600, letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 8 }}>智能体角色定义 Prompt</div>
                        <div style={{ fontSize: 26, fontWeight: 700, color: C.text0, marginBottom: 6 }}>{selectedAgentDetail.chineseName}</div>
                        <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.75 }}>{selectedAgentDetail.subtitle}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Tag label={selectedAgentDetail.statusSummary} variant="blue" />
                        <SecondaryBtn style={{ padding: "8px 12px", fontSize: 12 }}>编辑</SecondaryBtn>
                      </div>
                    </div>
                    <div
                      style={{
                        background: C.surfaceAlt,
                        border: `1px solid ${C.border}`,
                        borderRadius: 12,
                        padding: "16px 18px",
                        fontSize: 14,
                        color: C.text1,
                        lineHeight: 1.9,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {selectedAgentDetail.rolePrompt}
                    </div>
                  </CardPad>
                </Card>

              <Card>
                <CardPad>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                    <SectionTitle>{selectedAgentDetail.tableTitle}</SectionTitle>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>新增规则</SecondaryBtn>
                      <PrimaryBtn style={{ padding: "8px 12px", fontSize: 12 }}>保存修改</PrimaryBtn>
                    </div>
                  </div>
                  <GovernanceRuleTable columns={selectedAgentDetail.tableColumns} rows={selectedAgentDetail.tableRows} columnTemplate={selectedAgentDetail.tableColumnTemplate} />
                </CardPad>
              </Card>

              <Card>
                <CardPad>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                    <SectionTitle>治理变更记录</SectionTitle>
                    <GhostBtn>查看全部记录</GhostBtn>
                  </div>
                  <div style={{ fontSize: 13, color: C.text2, marginBottom: 10 }}>用于回溯该智能体最近是谁改了什么、何时生效，以及影响了哪些页面和角色。</div>
                  {selectedAgentDetail.changeLog.map((item, index) => (
                    <GovernanceChangeRow key={`${selectedAgentDetail.id}-${item.effectiveAt}-${item.change}`} item={item} last={index === selectedAgentDetail.changeLog.length - 1} />
                  ))}
                </CardPad>
              </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<PageId>("myWorkbench");
  const [globalTaskState, setGlobalTaskState] = useState<TaskPanelState>("待执行");
  const [messagePanelOpen, setMessagePanelOpen] = useState(false);
  const openApprovalDetail = (item: ApprovalItem) => {
    setMessagePanelOpen(false);
    if (item.source === "CS Agent") {
      setPage("cs");
      return;
    }
    setPage("sales");
  };
  const taskStateOptions: TaskPanelState[] = ["待执行", "执行中", "整理中", "确认本轮结果", "已提交"];
  const messages =
    globalTaskState === "确认本轮结果"
      ? [
          {
            id: "profile-update",
            title: profileUpdatePacket.title,
            subtitle: "客户画像候选更新待你确认",
            time: "刚刚",
            unread: true,
          },
        ]
      : [];
  const nav: Array<{ id: PageId; label: string }> = [
    { id: "myWorkbench", label: "我的工作台" },
    { id: "workspaceSales", label: "客户状态工作台" },
    { id: "workspaceCs", label: "客户状态工作台" },
    { id: "sales", label: "销售轻记录" },
    { id: "cs", label: "客服触达检查" },
    { id: "governance", label: "智能体后台管理" },
  ];

  return (
    <div className="min-h-screen bg-stone-100" style={{ fontFamily: C.sans, background: C.bg, minHeight: "100vh", color: C.text0 }}>
      <style>{`
        input:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px ${C.blueLight}; }
        textarea:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px ${C.blueLight}; outline: none; }
        button:hover { opacity: 0.94; }
        @media (max-width: 980px) {
          .workbench-dual,
          .workbench-summary-grid,
          .work-item-row,
          .approval-item-row,
          .top-dual,
          .decision-tension-grid,
          .governance-top-grid,
          .governance-summary-grid,
          .governance-module-grid,
          .governance-row-grid,
          .governance-rule-grid,
          .governance-detail-grid,
          .agent-directory-grid,
          .detail-cards-grid,
          .two-col,
          .split-grid,
          .task-state-grid,
          .task-grid,
          .mini-grid,
          .execution-live-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: C.text0,
            padding: "14px 16px",
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            margin: "10px 4px 10px 0",
            letterSpacing: -0.3,
            flexShrink: 0,
            background: C.surfaceAlt,
          }}
        >
          客户旅程<span style={{ color: C.brick }}>·</span>系统
        </div>
        <div style={{ display: "flex", alignItems: "center", overflowX: "auto", flex: 1 }}>
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                background: page === item.id ? C.surfaceAlt : "transparent",
                border: `1px solid ${page === item.id ? C.border : "transparent"}`,
                borderRadius: 10,
                padding: "10px 14px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: page === item.id ? 600 : 500,
                color: page === item.id ? C.text0 : C.text2,
                margin: "0 4px",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span>{item.label}</span>
                {item.id === "workspaceSales" && <Tag label="销售版本" variant="blue" small />}
                {item.id === "workspaceCs" && <Tag label="客服版本" variant="green" small />}
              </span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ display: "flex", background: C.surfaceAlt, borderRadius: 10, padding: 4, border: `1px solid ${C.border}` }}>
            {taskStateOptions.map((state) => (
              <button
                key={state}
                onClick={() => setGlobalTaskState(state)}
                style={{
                  padding: "7px 10px",
                  borderRadius: 8,
                  border: `1px solid ${globalTaskState === state ? C.border : "transparent"}`,
                  background: globalTaskState === state ? C.surface : "transparent",
                  color: globalTaskState === state ? C.text0 : C.text2,
                  fontSize: 12,
                  fontWeight: globalTaskState === state ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {state}
              </button>
            ))}
          </div>
          <button
            onClick={() => setMessagePanelOpen((prev) => !prev)}
            style={{
              position: "relative",
              border: `1px solid ${C.border}`,
              background: C.surface,
              borderRadius: 999,
              width: 38,
              height: 38,
              cursor: "pointer",
              color: C.text1,
              fontSize: 15,
            }}
          >
            信
            {messages.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -2,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  background: C.red,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
              >
                {messages.length}
              </span>
            )}
          </button>
          <div
            onClick={() => setPage("myWorkbench")}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: C.brick,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
            title="进入我的工作台"
          >
            王
          </div>
        </div>
      </div>

      {messagePanelOpen && (
        <div style={{ position: "fixed", top: 66, right: 28, width: 420, maxWidth: "calc(100vw - 32px)", zIndex: 120 }}>
          <Card style={{ boxShadow: "0 8px 24px rgba(16,24,40,0.08)" }}>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>个人消息</div>
                  <div style={{ fontSize: 12, color: C.text2 }}>用于处理助手推送与待确认更新</div>
                </div>
                <SecondaryBtn style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => setMessagePanelOpen(false)}>
                  关闭
                </SecondaryBtn>
              </div>
              {messages.length === 0 ? (
                <div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "14px 16px", fontSize: 13, color: C.text2 }}>
                  当前没有新的个人消息。
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text0 }}>{messages[0].title}</div>
                      <Tag label="待确认" variant="amber" small />
                    </div>
                    <div style={{ fontSize: 12, color: C.text2 }}>{messages[0].subtitle} · {messages[0].time}</div>
                  </div>
                  <div style={{ border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "12px 14px", background: C.surface }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <SectionTitle>{profileUpdatePacket.title}</SectionTitle>
                      <Tag label={profileUpdatePacket.status} variant="amber" />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>关注重点：新增</div>
                      {profileUpdatePacket.priorities.map((item) => (
                        <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 10px", background: C.greenLight, borderRadius: 7, marginBottom: 5, border: `1px solid ${C.greenBorder}` }}>
                          <span style={{ color: C.green, fontWeight: 700 }}>+</span>
                          <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item}</span>
                          <SecondaryBtn style={{ padding: "3px 10px", fontSize: 11 }}>编辑</SecondaryBtn>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>异议事项：更新</div>
                      {profileUpdatePacket.objections.map((item) => (
                        <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 10px", background: C.greenLight, borderRadius: 7, marginBottom: 5, border: `1px solid ${C.greenBorder}` }}>
                          <span style={{ color: C.green, fontWeight: 700 }}>+</span>
                          <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item}</span>
                          <SecondaryBtn style={{ padding: "3px 10px", fontSize: 11 }}>编辑</SecondaryBtn>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>决策张力：更新</div>
                      <DecisionTensionCard data={profileUpdatePacket.tension} compact />
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <PrimaryBtn onClick={() => setGlobalTaskState("已提交")}>确认状态更新</PrimaryBtn>
                      <SecondaryBtn>修改</SecondaryBtn>
                    </div>
                  </div>
                </div>
              )}
            </CardPad>
          </Card>
        </div>
      )}

      {page === "myWorkbench" && <MyWorkbenchPage onOpenWorkspace={() => setPage("workspaceSales")} onOpenApprovalDetail={openApprovalDetail} />}
      {page === "workspaceSales" && <WorkspacePage roleVariant="sales" taskPanelState={globalTaskState} setTaskPanelState={setGlobalTaskState} onOpenMessages={() => setMessagePanelOpen(true)} />}
      {page === "workspaceCs" && <WorkspacePage roleVariant="cs" taskPanelState={globalTaskState} setTaskPanelState={setGlobalTaskState} onOpenMessages={() => setMessagePanelOpen(true)} />}
      {page === "sales" && <SalesPage />}
      {page === "cs" && <CSPage />}
      {page === "governance" && <GovernancePage />}
    </div>
  );
}
