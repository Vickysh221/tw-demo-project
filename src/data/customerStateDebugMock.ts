export interface Rule {
  id: string;
  label: string;
  coverage: number;
  conflictRate: number;
  correctionRate: number;
  weight: number;
  enabled: boolean;
}

export interface SchemaStateItem {
  id: string;
  label: string;
  impactedCustomers: string;
  overrideRate: string;
  impact: string;
}

export interface SchemaCategory {
  id: string;
  label: string;
  items: SchemaStateItem[];
}

export interface EvidenceItem {
  id: string;
  label: string;
  supportScore: number;
  weight: number;
  relationType: "direct" | "semantic" | "behavior" | "rule";
  polarity?: "support" | "counter";
  linkedRuleId?: string;
}

export interface InferenceStep {
  id: string;
  label: string;
  delta?: number;
  ruleId?: string;
}

export interface JudgmentItem {
  id: string;
  label: string;
  confidence: number;
  triggerConditions: { evidenceLabel: string; coverage: number }[];
  confidenceDistribution: { high: number; mid: number; low: number };
  overrideRate: number;
  overrideDirections: { nodeLabel: string; rate: number }[];
  evidence: EvidenceItem[];
  inferencePath: InferenceStep[];
}

export interface DriftItem {
  id: string;
  label: string;
  detail: string;
  severity: "low" | "medium" | "high";
  overrideRatePct: number;
  impactedCustomers: number;
  volatility: "low" | "medium" | "high";
  linkedRuleId?: string;
  exampleCases?: string[];
}

export interface AgentPerformanceItem {
  id: string;
  name: string;
  adoptionRate: number;
  overrideRate: number;
  mainIssue: string;
}

export interface HealthItem {
  id: string;
  label: string;
  status: "stable" | "warning" | "critical";
}

export interface CustomerStateDebugMock {
  currentCustomerId: string;
  schemaCategories: SchemaCategory[];
  rules: Rule[];
  judgments: JudgmentItem[];
  driftItems: DriftItem[];
  driftPatterns: { fromNode: string; toNode: string; rate: number }[];
  triggerBias: { evidenceLabel: string; targetNode: string; rate: number }[];
  adjustmentSuggestions: string[];
  agentPerformance: AgentPerformanceItem[];
  healthItems: HealthItem[];
}

export const customerStateDebugMock: CustomerStateDebugMock = {
  currentCustomerId: "A123",
  schemaCategories: [
    {
      id: "decision-stage",
      label: "决策阶段",
      items: [
        { id: "awareness", label: "认知", impactedCustomers: "18%", overrideRate: "12%", impact: "沟通方式" },
        { id: "comparison", label: "比较", impactedCustomers: "24%", overrideRate: "32%", impact: "是否推进成交" },
        { id: "decision", label: "决策", impactedCustomers: "14%", overrideRate: "18%", impact: "报价策略" },
        { id: "closed", label: "成交", impactedCustomers: "9%", overrideRate: "6%", impact: "是否推进成交" },
      ],
    },
    {
      id: "decision-structure",
      label: "决策结构",
      items: [
        { id: "solo", label: "单人决策", impactedCustomers: "11%", overrideRate: "15%", impact: "沟通方式" },
        { id: "pair", label: "双人决策", impactedCustomers: "19%", overrideRate: "28%", impact: "是否推进成交" },
        { id: "family", label: "家庭协同", impactedCustomers: "13%", overrideRate: "34%", impact: "沟通方式" },
      ],
    },
  ],
  rules: [
    { id: "rule-role-agent", label: "Role Agent 初始判断", coverage: 82, conflictRate: 15, correctionRate: 12, weight: 0.85, enabled: true },
    { id: "rule-sales-input", label: "销售补充修正规则", coverage: 67, conflictRate: 9, correctionRate: 18, weight: 0.75, enabled: true },
    { id: "rule-policy-close", label: "成交条件排除规则", coverage: 55, conflictRate: 22, correctionRate: 31, weight: 0.65, enabled: true },
    { id: "rule-policy-weight", label: "权重修正规则", coverage: 74, conflictRate: 8, correctionRate: 10, weight: 0.90, enabled: true },
    { id: "rule-policy-risk", label: "风险评估上浮规则", coverage: 48, conflictRate: 28, correctionRate: 35, weight: 0.60, enabled: false },
  ],
  judgments: [
    {
      id: "comparison-stage",
      label: "处于比较阶段",
      confidence: 0.78,
      triggerConditions: [
        { evidenceLabel: "连续询问两款车型配置差异", coverage: 68 },
        { evidenceLabel: "对价格和权益并列对比", coverage: 54 },
      ],
      confidenceDistribution: { high: 42, mid: 35, low: 23 },
      overrideRate: 32,
      overrideDirections: [
        { nodeLabel: "成交阶段", rate: 18 },
        { nodeLabel: "决策阶段", rate: 14 },
      ],
      evidence: [
        { id: "comparison-1", label: "连续询问两款车型配置差异", supportScore: 0.84, weight: 1.0, relationType: "direct", polarity: "support", linkedRuleId: "rule-role-agent" },
        { id: "comparison-2", label: "对价格和权益并列对比", supportScore: 0.69, weight: 1.0, relationType: "behavior", polarity: "support", linkedRuleId: "rule-role-agent" },
        { id: "comparison-3", label: "未明确表达锁单意向", supportScore: 0.36, weight: 1.0, relationType: "rule", polarity: "counter", linkedRuleId: "rule-policy-close" },
      ],
      inferencePath: [
        { id: "comparison-step-1", label: "Role Agent → 初始判断", delta: 0.58, ruleId: "rule-role-agent" },
        { id: "comparison-step-2", label: "Human（销售）→ 补充对比记录", delta: 0.14, ruleId: "rule-sales-input" },
        { id: "comparison-step-3", label: "Policy Rule → 排除成交条件", delta: 0.06, ruleId: "rule-policy-close" },
      ],
    },
    {
      id: "two-person-decision",
      label: "决策结构为双人决策",
      confidence: 0.81,
      triggerConditions: [
        { evidenceLabel: "到店时配偶同行", coverage: 74 },
        { evidenceLabel: "对话中多次使用「我们」", coverage: 61 },
        { evidenceLabel: "咨询家庭用车场景", coverage: 52 },
      ],
      confidenceDistribution: { high: 55, mid: 30, low: 15 },
      overrideRate: 19,
      overrideDirections: [
        { nodeLabel: "单人决策", rate: 12 },
        { nodeLabel: "家庭协同", rate: 7 },
      ],
      evidence: [
        { id: "pair-1", label: "到店时配偶同行", supportScore: 0.91, weight: 1.0, relationType: "direct", polarity: "support", linkedRuleId: "rule-role-agent" },
        { id: "pair-2", label: "对话中多次使用「我们」", supportScore: 0.72, weight: 1.0, relationType: "semantic", polarity: "support", linkedRuleId: "rule-sales-input" },
        { id: "pair-3", label: "咨询家庭用车场景", supportScore: 0.64, weight: 1.0, relationType: "behavior", polarity: "support", linkedRuleId: "rule-role-agent" },
        { id: "pair-4", label: "配偶未参与价格讨论", supportScore: 0.31, weight: 1.0, relationType: "behavior", polarity: "counter", linkedRuleId: "rule-policy-weight" },
      ],
      inferencePath: [
        { id: "pair-step-1", label: "Role Agent → 初始判断", delta: 0.65, ruleId: "rule-role-agent" },
        { id: "pair-step-2", label: "Human（销售）→ 确认", delta: 0.2, ruleId: "rule-sales-input" },
        { id: "pair-step-3", label: "Policy Rule → 权重修正", delta: 0.05, ruleId: "rule-policy-weight" },
      ],
    },
    {
      id: "price-sensitivity-rising",
      label: "风险为价格敏感上升",
      confidence: 0.64,
      triggerConditions: [
        { evidenceLabel: "再次追问置换补贴与金融方案", coverage: 61 },
        { evidenceLabel: "对总价波动反馈明显", coverage: 55 },
      ],
      confidenceDistribution: { high: 28, mid: 44, low: 28 },
      overrideRate: 45,
      overrideDirections: [
        { nodeLabel: "品牌犹豫", rate: 24 },
        { nodeLabel: "时间延迟", rate: 21 },
      ],
      evidence: [
        { id: "price-1", label: "再次追问置换补贴与金融方案", supportScore: 0.79, weight: 1.0, relationType: "direct", polarity: "support", linkedRuleId: "rule-role-agent" },
        { id: "price-2", label: "对总价波动反馈明显", supportScore: 0.67, weight: 1.0, relationType: "behavior", polarity: "support", linkedRuleId: "rule-role-agent" },
        { id: "price-3", label: "仍保留高配版本兴趣", supportScore: 0.29, weight: 1.0, relationType: "semantic", polarity: "counter", linkedRuleId: "rule-policy-risk" },
      ],
      inferencePath: [
        { id: "price-step-1", label: "Role Agent → 初始判断", delta: 0.47, ruleId: "rule-role-agent" },
        { id: "price-step-2", label: "Human（销售）→ 标注预算顾虑", delta: 0.11, ruleId: "rule-sales-input" },
        { id: "price-step-3", label: "Policy Rule → 风险上浮", delta: 0.06, ruleId: "rule-policy-risk" },
      ],
    },
  ],
  driftItems: [
    {
      id: "drift-high-intent",
      label: "高意向客户",
      detail: "62% 被销售改写",
      severity: "high",
      overrideRatePct: 62,
      impactedCustomers: 34,
      volatility: "high",
      linkedRuleId: "rule-role-agent",
      exampleCases: ["意向判断高，销售记录显示需再跟进", "AI 判断高意向，实际下单延迟 14 天"],
    },
    {
      id: "drift-reach-now",
      label: "适合立即触达",
      detail: "45% 被延后",
      severity: "medium",
      overrideRatePct: 45,
      impactedCustomers: 28,
      volatility: "medium",
      linkedRuleId: "rule-sales-input",
      exampleCases: ["触达建议当日，销售延迟 3 天执行", "规则推荐跟进，未执行"],
    },
    {
      id: "drift-rational",
      label: "理性比较型",
      detail: "误差低，稳定性高",
      severity: "low",
      overrideRatePct: 8,
      impactedCustomers: 18,
      volatility: "low",
      linkedRuleId: "rule-policy-close",
      exampleCases: ["识别准确，成交已关闭", "持续比较阶段，判断稳定"],
    },
  ],
  driftPatterns: [
    { fromNode: "高意向客户", toNode: "持续跟进型", rate: 38 },
    { fromNode: "适合立即触达", toNode: "延迟触达", rate: 45 },
    { fromNode: "比较阶段", toNode: "决策阶段", rate: 22 },
  ],
  triggerBias: [
    { evidenceLabel: "置换补贴询问", targetNode: "价格敏感", rate: 72 },
    { evidenceLabel: "到店次数多", targetNode: "高意向客户", rate: 58 },
    { evidenceLabel: "配偶同行", targetNode: "双人决策", rate: 44 },
  ],
  adjustmentSuggestions: [
    "降低「置换补贴询问」证据权重，避免误触发价格敏感节点",
    "增加「家庭场景」维度以改善双人决策识别精度",
    "提高「锁单意向」反向信号阈值，减少比较阶段误判",
  ],
  agentPerformance: [
    { id: "agent-a", name: "Agent A", adoptionRate: 78, overrideRate: 22, mainIssue: "高估节点紧迫性" },
    { id: "agent-b", name: "Agent B", adoptionRate: 71, overrideRate: 29, mainIssue: "对价格敏感波动反应过度" },
  ],
  healthItems: [
    { id: "health-stage", label: "决策阶段", status: "stable" },
    { id: "health-risk", label: "风险判断", status: "warning" },
    { id: "health-window", label: "时间窗口判断", status: "critical" },
  ],
};
