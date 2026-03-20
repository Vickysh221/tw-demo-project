import { useState } from "react";

// ─── Design Tokens (Light Enterprise) ────────────────────────────────────────
const C = {
  bg:       "#F7F6F2",   // warm off-white page bg
  surface:  "#FFFFFF",   // card bg
  surfaceAlt: "#F4F3EF", // subtle inner bg
  border:   "#E8E6E0",   // row dividers, card borders
  borderMd: "#D4D0C8",   // stronger borders
  text0:    "#1A1A1A",   // primary
  text1:    "#4A4A4A",   // secondary
  text2:    "#8C8C8C",   // tertiary / labels
  text3:    "#B0ACA4",   // placeholder
  blue:     "#2563EB",   blueLight: "#EFF4FF", blueBorder: "#BFD3FD",
  green:    "#16A34A",   greenLight: "#F0FDF4", greenBorder: "#BBF7D0",
  amber:    "#D97706",   amberLight: "#FFFBEB", amberBorder: "#FDE68A",
  red:      "#DC2626",   redLight:   "#FEF2F2", redBorder:   "#FECACA",
  brick:    "#B91C1C",   // CTA / primary action color
  mono:     "'JetBrains Mono', 'IBM Plex Mono', monospace",
  sans:     "'Inter', 'DM Sans', system-ui, sans-serif",
};

// ─── Sample Data ──────────────────────────────────────────────────────────────
const customer = {
  name: "刘浩 / Leo Liu", stage: "深度意向期",
  currentOwner: "王芳", ownerRole: "Sales",
  routeStatus: "Active", risk: "medium", reviewState: "pending",
  yourMode: "owner", confidence: 72, stateVersion: "v1.4",
  lastUpdated: "Nov 17, 2024 · 16:10",
  stateSummary: "客户已完成第二次试驾，对 ADAS 体验满意，但对价格区间仍有抵触。近期配偶加入决策链，决策时间线可能延长 1–2 周。",
  persona: { "年龄 / 家庭": "38岁，已婚，两子", "职业背景": "软件公司技术总监，理性决策型", "预算区间": "35–42万 RMB（设有上限）", "决策风格": "数据驱动，需充分比较后推进", "交付意向": "春节前，实际窗口约 3 周" },
  priorities: [
    { item: "智能驾驶辅助体验 (NOA)", weight: "高", status: "verified", statusLabel: "已验证满意" },
    { item: "续航实测 vs 官方数据", weight: "高", status: "concern", statusLabel: "仍有疑虑" },
    { item: "售后服务覆盖（成都区域）", weight: "中", status: "pending", statusLabel: "未充分沟通" },
    { item: "金融方案灵活性", weight: "中", status: "pending", statusLabel: "待提供方案" },
  ],
  objections: [
    { text: "价格比竞品高 2–3 万", severity: "high", resolved: false },
    { text: "配偶偏好传统品牌（宝马/奔驰）", severity: "high", resolved: false },
    { text: "充电桩在居住区覆盖不足", severity: "medium", resolved: false },
    { text: "冬季续航衰减担忧", severity: "low", resolved: true },
  ],
  decisionTension: "配偶加入后形成双核决策结构。刘浩主导技术偏好，配偶持品牌否决倾向。核心张力：技术体验 vs 品牌社会认知。",
  unresolvedQuestions: [
    "配偶的具体顾虑是否被直接倾听过？",
    "金融方案能否实现月供低于 6,000 元？",
    "成都东区售后响应时效有无承诺文件？",
  ],
  currentTask: {
    title: "推进配偶参与的双人体验邀约",
    why: "刘浩已进入高意向阶段，但配偶是当前主要阻力。尚未有针对配偶的直接触达或体验。",
    recommendedAction: "本周内邀请刘浩配偶参加周末 VIP 家庭试驾活动，同时准备品牌价值 vs 竞品的非技术对比材料。",
    blockedActions: ["不得直接致电配偶（未获联系授权）", "不得承诺额外折扣（需区域经理审批）"],
    timeWindow: "Nov 18–22, 2024", reviewState: "需销售经理确认邀约方案",
    agentDraft: "「刘总，您上次提到夫人也在参与选车，我们本周六有个家庭体验日，专门为双方决策设计，不涉及任何销售压力……」",
  },
  events: [
    { id: "E-041", type: "SALES_VISIT", typeLabel: "Sales Visit", owner: "王芳", date: "Nov 17", summary: "第二次试驾完成，NOA 体验评价高。客户提出配偶尚未参与决策。", status: "Done" },
    { id: "E-040", type: "STATE_UPDATE", typeLabel: "State Update", owner: "System", date: "Nov 17", summary: "状态升级：「配偶决策参与」列为高优先级阻力，置信度下调至 72%。", status: "Auto" },
    { id: "E-039", type: "CS_OUTREACH", typeLabel: "CS Outreach", owner: "李明", date: "Nov 14", summary: "主动关怀：回应冬季续航疑虑，发送实测数据报告。客户已确认满意。", status: "Done" },
    { id: "E-038", type: "SALES_VISIT", typeLabel: "Sales Visit", owner: "王芳", date: "Nov 10", summary: "首次试驾。续航和充电覆盖有疑虑，未明确决策时间线。", status: "Done" },
  ],
  stateVersions: [
    { version: "v1.4", level: "Major", trigger: "E-040 · 配偶加入决策链", changed: ["decision_tension", "objections +1", "confidence 78→72", "priorities +1"], approvedBy: "王芳", agents: ["State Compiler", "Journey Orchestrator"], note: "决策结构变化触发 Major 更新，需销售经理知悉。", date: "Nov 17" },
    { version: "v1.3", level: "Minor", trigger: "E-039 · CS 回应冬季续航", changed: ["objections.winter_range → resolved"], approvedBy: "李明", agents: ["Customer Agent"], note: "低风险自动记录。", date: "Nov 14" },
    { version: "v1.2", level: "Major", trigger: "E-038 · 首次试驾反馈", changed: ["priorities", "objections", "timeline", "confidence init"], approvedBy: "王芳", agents: ["State Compiler", "Journey Orchestrator", "Customer Agent"], note: "首次完整状态建立，需销售负责人确认。", date: "Nov 10" },
  ],
  contactReadiness: {
    allowed: ["发送售后服务覆盖资料（成都区域）", "邀请家庭体验活动（通过刘浩转达）", "提供金融方案模拟计算器链接"],
    blocked: ["直接联系配偶（无联系授权）", "承诺额外折扣或优惠（需经理审批）", "分享竞品对比材料（合规限制）"],
    channel: "微信", channelNote: "客户明确表示偏好",
    temp: "warm", tempLabel: "Warm",
    contacts: [
      { date: "Nov 14", channel: "微信", type: "主动关怀", result: "positive" },
      { date: "Nov 10", channel: "到店", type: "试驾", result: "positive" },
    ],
  },
  recommendedOutreach: {
    goal: "确认家庭体验日邀约意向，铺垫配偶参与场景",
    style: "非销售型，以家庭生活场景切入，避免价格和技术参数",
    window: "Nov 18–20，工作日晚间 18:00–20:00",
    review: "需销售经理确认邀约文本",
    script: "「刘总，想问问您周末有没有时间，我们有个家庭体验活动，主要让家人也感受一下……」（Role Agent 可生成完整版，人工确认后使用）",
  },
};

// ─── Utility ──────────────────────────────────────────────────────────────────
function fmt(d) { return d; }

// ─── Shared Components ────────────────────────────────────────────────────────

function StatusPill({ label, variant }) {
  const styles = {
    green:  { color: C.green,  bg: C.greenLight,  border: C.greenBorder },
    blue:   { color: C.blue,   bg: C.blueLight,   border: C.blueBorder },
    amber:  { color: C.amber,  bg: C.amberLight,  border: C.amberBorder },
    red:    { color: C.red,    bg: C.redLight,    border: C.redBorder },
    neutral:{ color: C.text2,  bg: C.surfaceAlt,  border: C.border },
  };
  const s = styles[variant] || styles.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 11px", borderRadius: 20,
      border: `1.5px solid ${s.border}`,
      background: s.bg, color: s.color,
      fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function Tag({ label, variant = "neutral", small }) {
  const styles = {
    green:   { color: C.green,  bg: C.greenLight,  border: C.greenBorder },
    amber:   { color: C.amber,  bg: C.amberLight,  border: C.amberBorder },
    red:     { color: C.red,    bg: C.redLight,     border: C.redBorder },
    blue:    { color: C.blue,   bg: C.blueLight,    border: C.blueBorder },
    neutral: { color: C.text1,  bg: C.surfaceAlt,   border: C.border },
    purple:  { color: "#6D28D9", bg: "#F5F3FF",     border: "#DDD6FE" },
  };
  const s = styles[variant] || styles.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: small ? "1px 7px" : "2px 9px",
      borderRadius: 5, border: `1px solid ${s.border}`,
      background: s.bg, color: s.color,
      fontSize: small ? 10.5 : 11.5, fontWeight: 500, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: C.text2, textTransform: "uppercase", marginBottom: 12 }}>{children}</div>;
}

function Row({ children, last, style = {} }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: last ? "none" : `1px solid ${C.border}`, ...style }}>{children}</div>;
}

function StateBadge({ abbr }) {
  return (
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.surfaceAlt, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.text1, flexShrink: 0 }}>{abbr}</div>
  );
}

function Card({ children, style = {}, noPad }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", ...(noPad ? {} : {}), ...style }}>
      {children}
    </div>
  );
}

function CardPad({ children, style = {} }) {
  return <div style={{ padding: "18px 20px", ...style }}>{children}</div>;
}

function ConfidenceBar({ value }) {
  const color = value >= 75 ? C.green : value >= 55 ? C.amber : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 5, background: C.surfaceAlt, borderRadius: 3, overflow: "hidden", border: `1px solid ${C.border}` }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 32, textAlign: "right" }}>{value}%</span>
      <span style={{ fontSize: 11, color: C.text2 }}>confidence</span>
    </div>
  );
}

function AgentBlock({ text, label = "Agent draft" }) {
  return (
    <div style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", borderLeft: "3px solid #7C3AED", borderRadius: 8, padding: "11px 14px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: "#6D28D9", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 13, color: "#4C1D95", lineHeight: 1.7, fontStyle: "italic" }}>{text}</div>
    </div>
  );
}

function PrimaryBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: C.brick, color: "#fff", border: "none",
      borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600,
      cursor: "pointer", ...style,
    }}>{children}</button>
  );
}

function SecondaryBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: C.surface, color: C.text1,
      border: `1.5px solid ${C.border}`, borderRadius: 8,
      padding: "8px 16px", fontSize: 13, fontWeight: 500,
      cursor: "pointer", ...style,
    }}>{children}</button>
  );
}

function DangerBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: C.redLight, color: C.red,
      border: `1.5px solid ${C.redBorder}`, borderRadius: 8,
      padding: "8px 14px", fontSize: 13, fontWeight: 500,
      cursor: "pointer", ...style,
    }}>{children}</button>
  );
}

// ─── Global Header ────────────────────────────────────────────────────────────
function Header({ page }) {
  const pageTitles = { workspace: "Customer State Workspace", sales: "Sales Light Record", cs: "CS Outreach Check" };
  const riskVariant = { high: "red", medium: "amber", low: "green" }[customer.risk];
  return (
    <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 28px" }}>
      <div style={{ fontSize: 11.5, color: C.text2, marginBottom: 5 }}>{pageTitles[page]}</div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: C.text0, marginRight: 4 }}>{customer.name}</span>
        <StatusPill label={customer.stage} variant="blue" />
        <StatusPill label={`Owner: ${customer.currentOwner} · ${customer.ownerRole}`} variant="neutral" />
        <StatusPill label={customer.routeStatus} variant="green" />
        <StatusPill label={{ high: "High Risk", medium: "Medium Risk", low: "Low Risk" }[customer.risk]} variant={riskVariant} />
        {customer.reviewState === "pending" && <StatusPill label="Pending Review" variant="amber" />}
        <StatusPill label={customer.yourMode === "owner" ? "★ Owner Mode" : "View Only"} variant={customer.yourMode === "owner" ? "green" : "neutral"} />
      </div>
    </div>
  );
}

// ─── Page 1: Customer State Workspace ────────────────────────────────────────
function WorkspacePage() {
  const [stream, setStream] = useState("events");
  const [note, setNote] = useState("");

  return (
    <div>
      <Header page="workspace" />

      {/* Current Task — elevated priority block (owner only) */}
      {customer.yourMode === "owner" && (
        <div style={{ background: "#FFFBF0", borderBottom: `1px solid ${C.amberBorder}`, padding: "16px 28px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.amber, letterSpacing: 0.7, textTransform: "uppercase" }}>Current Task Focus</span>
                  <Tag label="Owner Only" variant="amber" small />
                  <Tag label={`Window: ${customer.currentTask.timeWindow}`} variant="neutral" small />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text0, marginBottom: 5 }}>{customer.currentTask.title}</div>
                <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.6, maxWidth: 600 }}>{customer.currentTask.why}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", alignItems: "flex-start" }}>
                <Tag label="Review Required" variant="amber" />
                <PrimaryBtn>Approve & Submit</PrimaryBtn>
                <SecondaryBtn>Modify</SecondaryBtn>
                <DangerBtn>Escalate</DangerBtn>
              </div>
            </div>

            {/* Expand detail */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14, marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ background: C.surface, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Recommended Action</div>
                <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{customer.currentTask.recommendedAction}</div>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.redBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Blocked</div>
                {customer.currentTask.blockedActions.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                    <span style={{ color: C.red, fontWeight: 700, flexShrink: 0 }}>✕</span>
                    <span style={{ fontSize: 12, color: C.text1, lineHeight: 1.5 }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "#6D28D9", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Agent Draft</div>
                <div style={{ fontSize: 12, color: "#4C1D95", lineHeight: 1.65, fontStyle: "italic" }}>{customer.currentTask.agentDraft}</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <textarea
                value={note} onChange={e => setNote(e.target.value)}
                placeholder="Add your notes or adjustments before submitting…"
                style={{ width: "100%", border: `1.5px solid ${C.amberBorder}`, borderRadius: 8, background: C.surface, color: C.text0, fontSize: 13, padding: "9px 12px", resize: "vertical", minHeight: 56, boxSizing: "border-box", outline: "none", fontFamily: C.sans }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1200, margin: "24px auto", padding: "0 28px" }}>
        
        {/* Left: Customer Continuity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>Customer Continuity</div>

          {/* State summary */}
          <Card>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <SectionTitle>Customer State · {customer.stateVersion}</SectionTitle>
                <Tag label={customer.lastUpdated} variant="neutral" small />
              </div>
              <div style={{ fontSize: 13.5, color: C.text0, lineHeight: 1.75, marginBottom: 14 }}>{customer.stateSummary}</div>
              <ConfidenceBar value={customer.confidence} />
            </CardPad>
          </Card>

          {/* Persona */}
          <Card>
            <CardPad style={{ paddingBottom: 4 }}>
              <SectionTitle>Persona Snapshot</SectionTitle>
              {Object.entries(customer.persona).map(([k, v], i, arr) => (
                <Row key={k} last={i === arr.length - 1}>
                  <span style={{ fontSize: 12, color: C.text2, minWidth: 100 }}>{k}</span>
                  <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{v}</span>
                </Row>
              ))}
            </CardPad>
          </Card>

          {/* Priorities */}
          <Card>
            <CardPad style={{ paddingBottom: 4 }}>
              <SectionTitle>Priorities</SectionTitle>
              {customer.priorities.map((p, i) => (
                <Row key={i} last={i === customer.priorities.length - 1}>
                  <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{p.item}</span>
                  <Tag label={p.weight} variant={p.weight === "高" ? "blue" : "neutral"} small />
                  <Tag label={p.statusLabel} variant={p.status === "verified" ? "green" : p.status === "concern" ? "amber" : "neutral"} small />
                </Row>
              ))}
            </CardPad>
          </Card>

          {/* Objections */}
          <Card style={{ borderColor: customer.objections.some(o => !o.resolved && o.severity === "high") ? C.redBorder : C.border }}>
            <CardPad style={{ paddingBottom: 4 }}>
              <SectionTitle>Objections</SectionTitle>
              {customer.objections.map((o, i) => (
                <Row key={i} last={i === customer.objections.length - 1}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: o.resolved ? C.green : o.severity === "high" ? C.red : C.amber }} />
                  <span style={{ fontSize: 13, color: o.resolved ? C.text2 : C.text0, flex: 1 }}>{o.text}</span>
                  {o.resolved
                    ? <StatusPill label="✓ Resolved" variant="green" />
                    : <Tag label={o.severity} variant={o.severity === "high" ? "red" : "amber"} small />}
                </Row>
              ))}
            </CardPad>
          </Card>

          {/* Decision Tension */}
          <Card style={{ borderColor: C.amberBorder }}>
            <CardPad>
              <SectionTitle>Decision Tension</SectionTitle>
              <div style={{ background: C.amberLight, borderLeft: `3px solid ${C.amber}`, borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "#92400E", lineHeight: 1.7 }}>
                {customer.decisionTension}
              </div>
            </CardPad>
          </Card>

          {/* Unresolved Questions */}
          <Card>
            <CardPad style={{ paddingBottom: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <SectionTitle>Unresolved Questions</SectionTitle>
                <Tag label={`${customer.unresolvedQuestions.length} open`} variant="red" small />
              </div>
              {customer.unresolvedQuestions.map((q, i) => (
                <Row key={i} last={i === customer.unresolvedQuestions.length - 1}>
                  <span style={{ color: C.red, fontSize: 15, flexShrink: 0, fontWeight: 700 }}>?</span>
                  <span style={{ fontSize: 13, color: C.text0 }}>{q}</span>
                </Row>
              ))}
            </CardPad>
          </Card>
        </div>

        {/* Right: Work Continuity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>Work Continuity</div>

          {/* Stream toggle */}
          <div style={{ display: "flex", background: C.surfaceAlt, borderRadius: 10, padding: 4, border: `1px solid ${C.border}` }}>
            {[{ id: "events", label: "Event Stream" }, { id: "versions", label: "State Version Stream" }].map(s => (
              <button key={s.id} onClick={() => setStream(s.id)} style={{
                flex: 1, padding: "8px 0", borderRadius: 8,
                background: stream === s.id ? C.surface : "none",
                border: stream === s.id ? `1px solid ${C.border}` : "1px solid transparent",
                color: stream === s.id ? C.text0 : C.text2,
                fontSize: 12.5, fontWeight: stream === s.id ? 600 : 400,
                cursor: "pointer", transition: "all 0.15s",
              }}>{s.label}</button>
            ))}
          </div>

          {stream === "events" && customer.events.map((e, idx) => {
            const typeColor = { SALES_VISIT: C.blue, STATE_UPDATE: "#6D28D9", CS_OUTREACH: C.green }[e.type] || C.text2;
            const typeBg = { SALES_VISIT: C.blueLight, STATE_UPDATE: "#F5F3FF", CS_OUTREACH: C.greenLight }[e.type] || C.surfaceAlt;
            return (
              <Card key={e.id} style={{ borderLeft: `3px solid ${typeColor}` }}>
                <CardPad>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ background: typeBg, color: typeColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 5 }}>{e.typeLabel}</span>
                      <span style={{ fontSize: 11.5, color: C.text2 }}>{e.id}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: C.text2 }}>{e.owner}</span>
                      <span style={{ fontSize: 11.5, color: C.text3 }}>{e.date}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{e.summary}</div>
                </CardPad>
              </Card>
            );
          })}

          {stream === "versions" && customer.stateVersions.map((v) => (
            <Card key={v.version} style={{ borderLeft: `3px solid ${v.level === "Major" ? C.amber : C.border}` }}>
              <CardPad>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text0 }}>{v.version}</span>
                    <Tag label={v.level} variant={v.level === "Major" ? "amber" : "neutral"} small />
                  </div>
                  <span style={{ fontSize: 11.5, color: C.text3 }}>{v.date}</span>
                </div>
                <div style={{ fontSize: 12, color: C.text2, marginBottom: 8 }}>Trigger: {v.trigger}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                  {v.changed.map(f => <Tag key={f} label={f} variant="purple" small />)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: C.text2, marginBottom: 8 }}>
                  <span>Approved: <strong style={{ color: C.text1 }}>{v.approvedBy}</strong></span>
                  <span>Agents: {v.agents.join(", ")}</span>
                </div>
                {v.note && <div style={{ background: C.surfaceAlt, borderRadius: 6, padding: "8px 12px", fontSize: 12, color: C.text1 }}>{v.note}</div>}
              </CardPad>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page 2: Sales Light Record ───────────────────────────────────────────────
function SalesPage() {
  const [inputText, setInputText] = useState("");
  const SIGNAL = "刘总说他老婆更想买奔驰，觉得比亚迪不够档次，但他自己挺喜欢这个车的智能系统，就是觉得价格高了点。";
  const CANDIDATES = {
    priorities: ["配偶认可度（新增，优先级高）", "品牌认知 vs 功能体验的决策权重"],
    objections: ["配偶偏好传统品牌（新增）", "价格偏高（确认，持续）"],
    tension: "家庭内部决策分歧：功能主导（刘浩）vs 品牌社会认知（配偶）",
    evidence: ["「他老婆更想买奔驰」→ 配偶主动偏好", "「觉得不够档次」→ 品牌感知障碍", "「价格高了点」→ 价格阻力确认"],
  };

  return (
    <div>
      <Header page="sales" />
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24, maxWidth: 1200, margin: "24px auto", padding: "0 28px" }}>

        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>Understanding Construction</div>

          <Card>
            <CardPad>
              <SectionTitle>Input Zone</SectionTitle>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <input value={inputText} onChange={e => setInputText(e.target.value)} placeholder="输入拜访记录、客户原话或关键信号…" style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: C.text0, background: C.surface, outline: "none", fontFamily: C.sans }} />
                <SecondaryBtn style={{ padding: "9px 12px", fontSize: 16 }}>🎤</SecondaryBtn>
                <PrimaryBtn>Analyze</PrimaryBtn>
              </div>
              <div style={{ fontSize: 12, color: C.text2 }}>Recent context: 第二次试驾完成 · 配偶加入决策 · 价格阻力持续</div>
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <SectionTitle>Raw Signal</SectionTitle>
              <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", fontSize: 13.5, color: C.text0, lineHeight: 1.8, fontStyle: "italic", marginBottom: 12 }}>{SIGNAL}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Key Phrases</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["老婆更想买奔驰", "不够档次", "挺喜欢智能系统", "价格高了点"].map(p => (
                  <Tag key={p} label={p} variant="amber" />
                ))}
              </div>
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <SectionTitle>Human Interpretation</SectionTitle>
                <Tag label="Confidence: High" variant="green" small />
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
                <SectionTitle>Candidate State Update</SectionTitle>
                <Tag label="Awaiting Confirm" variant="amber" />
              </div>

              {[{ label: "Priorities — new", items: CANDIDATES.priorities }, { label: "Objections — updated", items: CANDIDATES.objections }].map(s => (
                <div key={s.label} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                  {s.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 10px", background: C.greenLight, borderRadius: 7, marginBottom: 5, border: `1px solid ${C.greenBorder}` }}>
                      <span style={{ color: C.green, fontWeight: 700 }}>+</span>
                      <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item}</span>
                      <SecondaryBtn style={{ padding: "3px 10px", fontSize: 11 }}>Edit</SecondaryBtn>
                    </div>
                  ))}
                </div>
              ))}

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>Decision Tension — update</div>
                <div style={{ background: C.amberLight, border: `1px solid ${C.amberBorder}`, borderLeft: `3px solid ${C.amber}`, borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "#92400E" }}>{CANDIDATES.tension}</div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>Evidence References</div>
                {CANDIDATES.evidence.map((e, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: C.text1, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>{e}</div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <PrimaryBtn style={{ flex: 1 }}>Confirm State Update</PrimaryBtn>
                <SecondaryBtn>Modify</SecondaryBtn>
              </div>
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <SectionTitle>Confidence · Uncertainty</SectionTitle>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Low Confidence Fields</div>
                {["配偶的具体品牌偏好来源", "配偶在决策中的实际否决权重"].map((f, i) => (
                  <Row key={i} last={i === 1}>
                    <span style={{ color: C.amber, fontWeight: 700 }}>~</span>
                    <span style={{ fontSize: 13, color: C.text1 }}>{f}</span>
                  </Row>
                ))}
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Unresolved Questions</div>
              {["配偶是否有机会直接体验产品？", "是否存在家庭联合决策的最优接触点？"].map((q, i) => (
                <Row key={i} last={i === 1}>
                  <span style={{ color: C.red, fontWeight: 700 }}>?</span>
                  <span style={{ fontSize: 13, color: C.text0 }}>{q}</span>
                </Row>
              ))}
              <div style={{ marginTop: 10, background: C.surfaceAlt, borderRadius: 6, padding: "9px 12px", fontSize: 12, color: C.text2 }}>
                Confidence impact: 配偶决策权不明 → 整体置信度维持 72%，等待配偶体验后再评估
              </div>
            </CardPad>
          </Card>
        </div>

        {/* Right: Orchestrator Feedback */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>Orchestrator Feedback</div>

          <Card style={{ borderColor: C.blueBorder }}>
            <CardPad>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.blue, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Current Owner</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text0 }}>{customer.currentOwner}</div>
              <div style={{ fontSize: 12, color: C.text2 }}>Route: Active · No transfer pending</div>
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <SectionTitle>Recommended Next Action</SectionTitle>
              <div style={{ fontSize: 13.5, color: C.text0, lineHeight: 1.7, background: C.surfaceAlt, padding: "10px 12px", borderRadius: 7, marginBottom: 12 }}>{customer.currentTask.recommendedAction}</div>
              <div style={{ fontSize: 11, color: C.text2, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Time Window</div>
              <div style={{ fontSize: 13, color: C.amber, fontWeight: 500 }}>{customer.currentTask.timeWindow}</div>
            </CardPad>
          </Card>

          <Card style={{ borderColor: C.redBorder }}>
            <CardPad style={{ paddingBottom: 8 }}>
              <SectionTitle>Blocked Actions</SectionTitle>
              {customer.currentTask.blockedActions.map((a, i) => (
                <Row key={i} last={i === customer.currentTask.blockedActions.length - 1}>
                  <span style={{ color: C.red, fontWeight: 700 }}>✕</span>
                  <span style={{ fontSize: 13, color: C.text1 }}>{a}</span>
                </Row>
              ))}
            </CardPad>
          </Card>

          <Card style={{ borderColor: C.amberBorder }}>
            <CardPad>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.amber, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Review Level</div>
              <div style={{ fontSize: 13, color: C.text0 }}>{customer.currentTask.reviewState}</div>
            </CardPad>
          </Card>

          <AgentBlock text={customer.currentTask.agentDraft} label="Role Agent · Suggested Script" />

          <div style={{ display: "flex", gap: 8 }}>
            <PrimaryBtn style={{ flex: 1 }}>Submit Record</PrimaryBtn>
            <SecondaryBtn>Save Draft</SecondaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page 3: CS Outreach Check ────────────────────────────────────────────────
function CSPage() {
  const cr = customer.contactReadiness;
  const ro = customer.recommendedOutreach;

  return (
    <div>
      <Header page="cs" />

      {/* Top alert bar */}
      <div style={{ background: C.amberLight, borderBottom: `1px solid ${C.amberBorder}`, padding: "10px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#92400E", fontWeight: 500 }}>⚠ 本次外呼需遵守授权边界。直接联系配偶及承诺折扣均受限，需升级审批。</span>
          <Tag label="Review Required" variant="amber" small />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24, maxWidth: 1200, margin: "24px auto", padding: "0 28px" }}>

        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>Contact Readiness</div>

          <Card style={{ borderColor: C.greenBorder }}>
            <CardPad style={{ paddingBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <SectionTitle>Allowed Actions</SectionTitle>
                <Tag label={`${cr.allowed.length} permitted`} variant="green" small />
              </div>
              {cr.allowed.map((a, i) => (
                <Row key={i} last={i === cr.allowed.length - 1}>
                  <span style={{ color: C.green, fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: 13, color: C.text0 }}>{a}</span>
                </Row>
              ))}
            </CardPad>
          </Card>

          <Card style={{ borderColor: C.redBorder }}>
            <CardPad style={{ paddingBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <SectionTitle>Blocked Actions</SectionTitle>
                <Tag label={`${cr.blocked.length} blocked`} variant="red" small />
              </div>
              {cr.blocked.map((a, i) => (
                <Row key={i} last={i === cr.blocked.length - 1}>
                  <span style={{ color: C.red, fontWeight: 700 }}>✕</span>
                  <span style={{ fontSize: 13, color: C.text1 }}>{a}</span>
                </Row>
              ))}
              <div style={{ marginTop: 12, background: C.redLight, borderRadius: 7, padding: "9px 12px", fontSize: 12, color: C.red }}>
                限制来源：授权边界 / 合规策略 / 审批流程。如需突破，提交升级申请。
              </div>
            </CardPad>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Card>
              <CardPad>
                <SectionTitle>Preferred Channel</SectionTitle>
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
                <SectionTitle>Relationship</SectionTitle>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: C.surfaceAlt, borderRadius: 3, overflow: "hidden", border: `1px solid ${C.border}` }}>
                    <div style={{ width: "70%", height: "100%", background: C.amber, borderRadius: 3 }} />
                  </div>
                  <Tag label="Warm" variant="amber" small />
                </div>
              </CardPad>
            </Card>
          </div>

          <Card>
            <CardPad style={{ paddingBottom: 4 }}>
              <SectionTitle>Recent Contact History</SectionTitle>
              {cr.contacts.map((c, i) => (
                <Row key={i} last={i === cr.contacts.length - 1}>
                  <span style={{ fontSize: 12, color: C.text2, minWidth: 58 }}>{c.date}</span>
                  <Tag label={c.channel} variant="neutral" small />
                  <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{c.type}</span>
                  <StatusPill label={c.result === "positive" ? "✓ Positive" : c.result} variant={c.result === "positive" ? "green" : "neutral"} />
                </Row>
              ))}
            </CardPad>
          </Card>

          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>Recent Context</div>

          <Card>
            <CardPad>
              <SectionTitle>Latest Relevant Event</SectionTitle>
              <div style={{ borderLeft: `3px solid ${C.blue}`, paddingLeft: 12 }}>
                <div style={{ fontSize: 11, color: C.text2, marginBottom: 4 }}>{customer.events[0].id} · {customer.events[0].typeLabel}</div>
                <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{customer.events[0].summary}</div>
              </div>
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <SectionTitle>Latest State Version</SectionTitle>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{customer.stateVersions[0].version}</span>
                <Tag label="Major" variant="amber" small />
              </div>
              <div style={{ fontSize: 12, color: C.text2, marginBottom: 4 }}>Changed: {customer.stateVersions[0].changed.join(", ")}</div>
              <div style={{ fontSize: 12, color: C.text2 }}>Trigger: {customer.stateVersions[0].trigger}</div>
            </CardPad>
          </Card>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>Recommended Outreach</div>

          <Card style={{ borderColor: C.blueBorder }}>
            <CardPad>
              <SectionTitle>Outreach Goal</SectionTitle>
              <div style={{ fontSize: 14, color: C.text0, lineHeight: 1.7, background: C.surfaceAlt, padding: "10px 12px", borderRadius: 7, marginBottom: 12 }}>{ro.goal}</div>
              <Row>
                <span style={{ fontSize: 11.5, color: C.text2, minWidth: 72 }}>Script style</span>
                <span style={{ fontSize: 13, color: C.text0 }}>{ro.style}</span>
              </Row>
              <Row last>
                <span style={{ fontSize: 11.5, color: C.text2, minWidth: 72 }}>Time window</span>
                <span style={{ fontSize: 13, color: C.amber, fontWeight: 500 }}>{ro.window}</span>
              </Row>
            </CardPad>
          </Card>

          <Card style={{ borderColor: C.amberBorder }}>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <SectionTitle>Review State</SectionTitle>
                <Tag label="Review Required" variant="amber" small />
              </div>
              <div style={{ fontSize: 13, color: C.text0 }}>{ro.review}</div>
            </CardPad>
          </Card>

          <AgentBlock text={ro.script} label="Customer Agent · Script Draft" />

          <Card>
            <CardPad>
              <SectionTitle>Confidence · Risk</SectionTitle>
              <ConfidenceBar value={customer.confidence} />
              <div style={{ marginTop: 12, background: C.surfaceAlt, borderRadius: 6, padding: "9px 12px", fontSize: 12, color: C.text1, lineHeight: 1.65 }}>
                配偶决策权重未知，置信度维持 72%。本次外呼如能推动配偶参与体验，置信度预计可升至 82%。
              </div>
            </CardPad>
          </Card>

          <Card>
            <CardPad style={{ paddingBottom: 8 }}>
              <SectionTitle>Unresolved Issues</SectionTitle>
              {customer.unresolvedQuestions.map((q, i) => (
                <Row key={i} last={i === customer.unresolvedQuestions.length - 1}>
                  <span style={{ color: C.red, fontWeight: 700 }}>?</span>
                  <span style={{ fontSize: 13, color: C.text0 }}>{q}</span>
                </Row>
              ))}
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <SectionTitle>Why Allowed / Why Blocked</SectionTitle>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.green, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Allowed Because</div>
                <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65 }}>售后资料属于已授权信息范围；家庭体验邀约通过主联系人刘浩转达，不直接触达配偶。</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.red, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Blocked Because</div>
                <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65 }}>直接联系配偶违反数据授权规则；承诺折扣超出 CS 角色权限范围。</div>
              </div>
            </CardPad>
          </Card>

          <div style={{ display: "flex", gap: 8 }}>
            <PrimaryBtn style={{ flex: 1 }}>Log Outreach</PrimaryBtn>
            <DangerBtn>Escalate</DangerBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("workspace");
  const NAV = [
    { id: "workspace", label: "Customer State Workspace" },
    { id: "sales", label: "Sales Light Record" },
    { id: "cs", label: "CS Outreach Check" },
  ];

  return (
    <div style={{ fontFamily: C.sans, background: C.bg, minHeight: "100vh", color: C.text0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        textarea, input, button { font-family: inherit; }
        input:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px ${C.blueLight}; }
        textarea:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px ${C.blueLight}; outline: none; }
        button:hover { opacity: 0.88; }
        @media (max-width: 800px) {
          .two-col { grid-template-columns: 1fr !important; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Top nav */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 28px", display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text0, padding: "14px 20px 14px 0", borderRight: `1px solid ${C.border}`, marginRight: 4, letterSpacing: -0.3 }}>
          CJO<span style={{ color: C.brick }}>·</span>SYS
        </div>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            background: "none", border: "none", padding: "15px 18px",
            cursor: "pointer", fontSize: 13.5,
            fontWeight: page === n.id ? 600 : 400,
            color: page === n.id ? C.text0 : C.text2,
            borderBottom: page === n.id ? `2px solid ${C.brick}` : "2px solid transparent",
            marginBottom: -1, transition: "color 0.15s",
          }}>{n.label}</button>
        ))}
      </div>

      {page === "workspace" && <WorkspacePage />}
      {page === "sales" && <SalesPage />}
      {page === "cs" && <CSPage />}
    </div>
  );
}
