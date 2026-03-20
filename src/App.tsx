import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type PageId = "workspace" | "sales" | "cs";
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

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
};

const C = {
  bg: "#F7F6F2",
  surface: "#FFFFFF",
  surfaceAlt: "#F4F3EF",
  border: "#E8E6E0",
  borderMd: "#D4D0C8",
  text0: "#1A1A1A",
  text1: "#4A4A4A",
  text2: "#8C8C8C",
  text3: "#B0ACA4",
  blue: "#2563EB",
  blueLight: "#EFF4FF",
  blueBorder: "#BFD3FD",
  green: "#16A34A",
  greenLight: "#F0FDF4",
  greenBorder: "#BBF7D0",
  amber: "#D97706",
  amberLight: "#FFFBEB",
  amberBorder: "#FDE68A",
  red: "#DC2626",
  redLight: "#FEF2F2",
  redBorder: "#FECACA",
  brick: "#B91C1C",
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
  confidence: 72,
  stateVersion: "v1.4",
  lastUpdated: "2024年11月17日 16:10",
  stateSummary:
    "客户已完成第二次试驾，对辅助驾驶体验满意，但对价格区间仍有抵触。近期配偶加入决策链，决策时间线可能延长 1 至 2 周。",
  persona: {
    "年龄 / 家庭": "38岁，已婚，两子",
    "职业背景": "软件公司技术总监，理性决策型",
    "预算区间": "35 至 42 万元（设有上限）",
    "决策风格": "数据驱动，需充分比较后推进",
    "交付意向": "春节前，实际窗口约 3 周",
  },
  priorities: [
    { item: "智能驾驶辅助体验（导航辅助驾驶）", weight: "高", status: "verified", statusLabel: "已验证满意" },
    { item: "续航实测与官方数据对比", weight: "高", status: "concern", statusLabel: "仍有疑虑" },
    { item: "售后服务覆盖（成都区域）", weight: "中", status: "pending", statusLabel: "未充分沟通" },
    { item: "金融方案灵活性", weight: "中", status: "pending", statusLabel: "待提供方案" },
  ],
  objections: [
    { text: "价格比竞品高 2–3 万", severity: "high", resolved: false },
    { text: "配偶偏好传统品牌（宝马/奔驰）", severity: "high", resolved: false },
    { text: "充电桩在居住区覆盖不足", severity: "medium", resolved: false },
    { text: "冬季续航衰减担忧", severity: "low", resolved: true },
  ],
  decisionTension:
    "配偶加入后形成双核决策结构。刘浩主导技术偏好，配偶持品牌否决倾向。核心张力：技术体验与品牌社会认知。",
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
      type: "STATE_UPDATE",
      typeLabel: "状态更新",
      owner: "系统",
      date: "11月17日",
      summary: "状态升级：「配偶决策参与」列为高优先级阻力，置信度下调至 72%。",
      status: "自动",
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
      changed: ["决策张力", "异议项增加 1 条", "置信度 78→72", "优先事项增加 1 项"],
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
    purple: { color: "#6D28D9", bg: "#F5F3FF", border: "#DDD6FE" },
  };
  const s = styles[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: small ? "1px 7px" : "2px 9px",
        borderRadius: 5,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        fontSize: small ? 10.5 : 11.5,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.8,
        color: C.text2,
        textTransform: "uppercase",
        marginBottom: 12,
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
        padding: "11px 0",
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
        borderRadius: 14,
        overflow: "hidden",
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
        background: "#F5F3FF",
        border: "1px solid #DDD6FE",
        borderLeft: "3px solid #7C3AED",
        borderRadius: 8,
        padding: "11px 14px",
      }}
    >
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          color: "#6D28D9",
          marginBottom: 6,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, color: "#4C1D95", lineHeight: 1.7, fontStyle: "italic" }}>{text}</div>
    </div>
  );
}

function PrimaryBtn({ children, onClick, style = {} }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: C.brick,
        color: "#fff",
        border: "none",
        borderRadius: 8,
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
        border: `1.5px solid ${C.border}`,
        borderRadius: 8,
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 500,
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
        border: `1.5px solid ${C.redBorder}`,
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Header({ page }: HeaderProps) {
  const pageTitles: Record<PageId, string> = {
    workspace: "客户状态工作台",
    sales: "销售轻记录",
    cs: "客服触达检查",
  };
  const riskMap: Record<"high" | "medium" | "low", PillVariant> = { high: "red", medium: "amber", low: "green" };
  const riskVariant = riskMap[customer.risk as "high" | "medium" | "low"];

  return (
    <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 28px" }}>
      <div style={{ fontSize: 11.5, color: C.text2, marginBottom: 5 }}>{pageTitles[page]}</div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: C.text0, marginRight: 4 }}>{customer.name}</span>
        <StatusPill label={customer.stage} variant="blue" />
        <StatusPill label={`负责人：${customer.currentOwner} · ${customer.ownerRole}`} variant="neutral" />
        <StatusPill label={customer.routeStatus} variant="green" />
        <StatusPill label={{ high: "高风险", medium: "中风险", low: "低风险" }[customer.risk as "high" | "medium" | "low"]} variant={riskVariant} />
        {customer.reviewState === "pending" && <StatusPill label="待审核" variant="amber" />}
        <StatusPill
          label={customer.yourMode === "owner" ? "★ 负责人模式" : "仅查看"}
          variant={customer.yourMode === "owner" ? "green" : "neutral"}
        />
      </div>
    </div>
  );
}

function WorkspacePage() {
  const [workTab, setWorkTab] = useState<"history" | "ownerTasks">("history");
  const [note, setNote] = useState("");
  const ownerEvents = customer.events.filter((event) => event.owner === customer.currentOwner);

  return (
    <div>
      <Header page="workspace" />
      {customer.yourMode === "owner" && (
        <div style={{ background: "#FFFBF0", borderBottom: `1px solid ${C.amberBorder}`, padding: "16px 28px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.amber, letterSpacing: 0.7, textTransform: "uppercase" }}>
                    负责人专属当前任务
                  </span>
                  <Tag label="仅负责人可见" variant="amber" small />
                  <Tag label={`时间窗口：${customer.currentTask.timeWindow}`} variant="neutral" small />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text0, marginBottom: 5 }}>{customer.currentTask.title}</div>
                <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.6, maxWidth: 600 }}>{customer.currentTask.why}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", alignItems: "flex-start" }}>
                <Tag label="需要审核" variant="amber" />
                <PrimaryBtn>审核并提交</PrimaryBtn>
                <SecondaryBtn>修改</SecondaryBtn>
                <DangerBtn>升级处理</DangerBtn>
              </div>
            </div>

            <div className="task-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14, marginTop: 16 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  建议动作
                </div>
                <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{customer.currentTask.recommendedAction}</div>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.redBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  受限事项
                </div>
                {customer.currentTask.blockedActions.map((action) => (
                  <div key={action} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                    <span style={{ color: C.red, fontWeight: 700, flexShrink: 0 }}>✕</span>
                    <span style={{ fontSize: 12, color: C.text1, lineHeight: 1.5 }}>{action}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "#6D28D9", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  助手草稿
                </div>
                <div style={{ fontSize: 12, color: "#4C1D95", lineHeight: 1.65, fontStyle: "italic" }}>{customer.currentTask.agentDraft}</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="提交前补充你的备注或调整意见……"
                style={{
                  width: "100%",
                  border: `1.5px solid ${C.amberBorder}`,
                  borderRadius: 8,
                  background: C.surface,
                  color: C.text0,
                  fontSize: 13,
                  padding: "9px 12px",
                  resize: "vertical",
                  minHeight: 56,
                  outline: "none",
                  fontFamily: C.sans,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1200, margin: "24px auto", padding: "0 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>客户状态区</div>

          <Card>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <SectionTitle>客户状态概要 · {customer.stateVersion}</SectionTitle>
                <Tag label={customer.lastUpdated} variant="neutral" small />
              </div>
              <div style={{ fontSize: 13.5, color: C.text0, lineHeight: 1.75, marginBottom: 14 }}>{customer.stateSummary}</div>
              <ConfidenceBar value={customer.confidence} />
            </CardPad>
          </Card>

          <Card>
            <CardPad style={{ paddingBottom: 4 }}>
              <SectionTitle>画像概览</SectionTitle>
              {Object.entries(customer.persona).map(([key, value], index, list) => (
                <Row key={key} last={index === list.length - 1}>
                  <span style={{ fontSize: 12, color: C.text2, minWidth: 100 }}>{key}</span>
                  <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{value}</span>
                </Row>
              ))}
            </CardPad>
          </Card>

          <Card>
            <CardPad style={{ paddingBottom: 4 }}>
              <SectionTitle>关注重点</SectionTitle>
              {customer.priorities.map((priority, index) => (
                <Row key={priority.item} last={index === customer.priorities.length - 1}>
                  <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{priority.item}</span>
                  <Tag label={priority.weight} variant={priority.weight === "高" ? "blue" : "neutral"} small />
                  <Tag
                    label={priority.statusLabel}
                    variant={priority.status === "verified" ? "green" : priority.status === "concern" ? "amber" : "neutral"}
                    small
                  />
                </Row>
              ))}
            </CardPad>
          </Card>

          <Card style={{ borderColor: customer.objections.some((item) => !item.resolved && item.severity === "high") ? C.redBorder : C.border }}>
            <CardPad style={{ paddingBottom: 4 }}>
              <SectionTitle>顾虑</SectionTitle>
              {customer.objections.map((objection, index) => (
                <Row key={objection.text} last={index === customer.objections.length - 1}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: objection.resolved ? C.green : objection.severity === "high" ? C.red : C.amber,
                    }}
                  />
                  <span style={{ fontSize: 13, color: objection.resolved ? C.text2 : C.text0, flex: 1 }}>{objection.text}</span>
                  {objection.resolved ? (
                    <StatusPill label="✓ 已解决" variant="green" />
                  ) : (
                    <Tag label={objection.severity === "high" ? "高" : objection.severity === "medium" ? "中" : "低"} variant={objection.severity === "high" ? "red" : "amber"} small />
                  )}
                </Row>
              ))}
            </CardPad>
          </Card>

          <Card style={{ borderColor: C.amberBorder }}>
            <CardPad>
              <SectionTitle>决策张力</SectionTitle>
              <div style={{ background: C.amberLight, borderLeft: `3px solid ${C.amber}`, borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "#92400E", lineHeight: 1.7 }}>
                {customer.decisionTension}
              </div>
            </CardPad>
          </Card>

          <Card>
            <CardPad style={{ paddingBottom: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <SectionTitle>未决问题</SectionTitle>
                <Tag label={`待解 ${customer.unresolvedQuestions.length} 项`} variant="red" small />
              </div>
              {customer.unresolvedQuestions.map((question, index) => (
                <Row key={question} last={index === customer.unresolvedQuestions.length - 1}>
                  <span style={{ color: C.red, fontSize: 15, flexShrink: 0, fontWeight: 700 }}>?</span>
                  <span style={{ fontSize: 13, color: C.text0 }}>{question}</span>
                </Row>
              ))}
            </CardPad>
          </Card>
          <Card>
            <CardPad>
              <SectionTitle>最新状态版本摘要</SectionTitle>
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
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  状态版本流 / 治理追溯
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
              </div>
            </CardPad>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>工作区</div>
          <div style={{ display: "flex", background: C.surfaceAlt, borderRadius: 10, padding: 4, border: `1px solid ${C.border}` }}>
            {[
              { id: "history", label: "客户触达任务历史" },
              { id: "ownerTasks", label: "我负责的任务" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setWorkTab(item.id as "history" | "ownerTasks")}
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
                <SectionTitle>客户触达任务历史</SectionTitle>
                {customer.events.map((event) => {
                  const typeColor = { SALES_VISIT: C.blue, STATE_UPDATE: "#6D28D9", CS_OUTREACH: C.green }[event.type];
                  const typeBg = { SALES_VISIT: C.blueLight, STATE_UPDATE: "#F5F3FF", CS_OUTREACH: C.greenLight }[event.type];

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
              </CardPad>
            </Card>
          )}
          {workTab === "ownerTasks" && (
            <Card>
              <CardPad style={{ paddingBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8, flexWrap: "wrap" }}>
                  <SectionTitle>我负责的任务</SectionTitle>
                  <Tag label={`当前责任人：${customer.currentOwner}`} variant="blue" small />
                </div>
                {ownerEvents.length > 0 ? (
                  ownerEvents.map((event) => {
                    const typeColor = { SALES_VISIT: C.blue, STATE_UPDATE: "#6D28D9", CS_OUTREACH: C.green }[event.type];
                    const typeBg = { SALES_VISIT: C.blueLight, STATE_UPDATE: "#F5F3FF", CS_OUTREACH: C.greenLight }[event.type];

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
                              <span style={{ fontSize: 11.5, color: C.text3 }}>{event.date}</span>
                            </div>
                            <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.65, marginBottom: 8 }}>{event.summary}</div>
                            <div style={{ fontSize: 12, color: C.text2 }}>责任人：{event.owner}</div>
                          </CardPad>
                        </Card>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 13, color: C.text2 }}>
                    当前责任人暂无客户触达记录。
                  </div>
                )}
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
  const candidates = {
    priorities: ["配偶认可度（新增，优先级高）", "品牌认知与功能体验的决策权重"],
    objections: ["配偶偏好传统品牌（新增）", "价格偏高（确认，持续）"],
    tension: "家庭内部决策分歧：功能主导（刘浩）与品牌社会认知（配偶）",
    evidence: ["「他老婆更想买奔驰」→ 配偶主动偏好", "「觉得不够档次」→ 品牌感知障碍", "「价格高了点」→ 价格阻力确认"],
  } as const;

  return (
    <div>
      <Header page="sales" />
      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24, maxWidth: 1200, margin: "24px auto", padding: "0 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>决策张力：更新</div>
                <div style={{ background: C.amberLight, border: `1px solid ${C.amberBorder}`, borderLeft: `3px solid ${C.amber}`, borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "#92400E" }}>
                  {candidates.tension}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>证据引用</div>
                {candidates.evidence.map((item) => (
                  <div key={item} style={{ fontSize: 12.5, color: C.text1, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                    {item}
                  </div>
                ))}
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

export default function App() {
  const [page, setPage] = useState<PageId>("workspace");
  const nav: Array<{ id: PageId; label: string }> = [
    { id: "workspace", label: "客户状态工作台" },
    { id: "sales", label: "销售轻记录" },
    { id: "cs", label: "客服触达检查" },
  ];

  return (
    <div className="min-h-screen bg-stone-100" style={{ fontFamily: C.sans, background: C.bg, minHeight: "100vh", color: C.text0 }}>
      <style>{`
        input:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px ${C.blueLight}; }
        textarea:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px ${C.blueLight}; outline: none; }
        button:hover { opacity: 0.88; }
        @media (max-width: 980px) {
          .two-col,
          .split-grid,
          .task-grid,
          .mini-grid { grid-template-columns: 1fr !important; }
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
          overflowX: "auto",
        }}
      >
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: C.text0,
            padding: "14px 20px 14px 0",
            borderRight: `1px solid ${C.border}`,
            marginRight: 4,
            letterSpacing: -0.3,
            flexShrink: 0,
          }}
        >
          客户旅程<span style={{ color: C.brick }}>·</span>系统
        </div>
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              background: "none",
              border: "none",
              padding: "15px 18px",
              cursor: "pointer",
              fontSize: 13.5,
              fontWeight: page === item.id ? 600 : 400,
              color: page === item.id ? C.text0 : C.text2,
              borderBottom: page === item.id ? `2px solid ${C.brick}` : "2px solid transparent",
              marginBottom: -1,
              transition: "color 0.15s",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {page === "workspace" && <WorkspacePage />}
      {page === "sales" && <SalesPage />}
      {page === "cs" && <CSPage />}
    </div>
  );
}
