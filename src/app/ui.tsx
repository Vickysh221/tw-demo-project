import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { customer } from "./data";
import { C } from "./theme";
import type { ButtonProps, CardProps, DecisionTensionData, HeaderProps, PageId, PillVariant, RowProps, SectionTitleProps, StatusPillProps, TagProps, TagVariant } from "./types";

export function StatusPill({ label, variant }: StatusPillProps) {
  const styles: Record<PillVariant, { color: string; bg: string; border: string }> = {
    green: { color: C.green, bg: C.greenLight, border: C.greenBorder },
    blue: { color: C.blue, bg: C.blueLight, border: C.blueBorder },
    amber: { color: C.amber, bg: C.amberLight, border: C.amberBorder },
    red: { color: C.red, bg: C.redLight, border: C.redBorder },
    neutral: { color: C.text2, bg: C.surfaceAlt, border: C.border },
  };
  const s = styles[variant];

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 11px", borderRadius: 20, border: `1.5px solid ${s.border}`, background: s.bg, color: s.color, fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

export function Tag({ label, variant = "neutral", small = false }: TagProps) {
  const styles: Record<TagVariant, { color: string; bg: string; border: string }> = {
    green: { color: C.green, bg: C.greenLight, border: C.greenBorder },
    amber: { color: C.amber, bg: C.amberLight, border: C.amberBorder },
    red: { color: C.red, bg: C.redLight, border: C.redBorder },
    blue: { color: C.blue, bg: C.blueLight, border: C.blueBorder },
    neutral: { color: C.text1, bg: C.surfaceAlt, border: C.border },
    purple: { color: "#6D5BD0", bg: "#F3F0FF", border: "#DDD6FE" },
  };
  const s = styles[variant];
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: small ? 32 : 38, padding: small ? "0 12px" : "0 16px", borderRadius: 12, border: `1px solid ${s.border}`, background: s.bg, color: s.color, fontSize: small ? 12 : 13, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>;
}

export function SectionTitle({ children, style = {} }: SectionTitleProps) {
  return <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: C.text2, textTransform: "uppercase", marginBottom: 12, ...style }}>{children}</div>;
}

export function Row({ children, last = false, style = {} }: RowProps) {
  return <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: last ? "none" : `1px solid ${C.border}`, ...style }}>{children}</div>;
}

export function Card({ children, style = {} }: CardProps) {
  return <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 2px rgba(16,24,40,0.04)", ...style }}>{children}</div>;
}

export function CardPad({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ padding: "18px 20px", ...style }}>{children}</div>;
}

export function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 75 ? C.green : value >= 55 ? C.amber : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 5, background: C.surfaceAlt, borderRadius: 3, overflow: "hidden", border: `1px solid ${C.border}` }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 32, textAlign: "right" }}>{value}%</span>
      <span style={{ fontSize: 11, color: C.text2 }}>置信度</span>
    </div>
  );
}

export function AgentBlock({ text, label = "助手草稿" }: { text: string; label?: string }) {
  return (
    <div style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}`, borderLeft: `3px solid ${C.blue}`, borderRadius: 10, padding: "11px 14px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: C.blue, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{text}</div>
    </div>
  );
}

export function getPriorityTone(priority: "P0" | "P1" | "P2" | "P3") {
  if (priority === "P0") return { bg: C.redLight, border: C.redBorder, color: C.red, tagBg: "#FFF1F0" };
  if (priority === "P1") return { bg: C.amberLight, border: C.amberBorder, color: C.amber, tagBg: "#FFF7ED" };
  if (priority === "P2") return { bg: C.blueLight, border: C.blueBorder, color: C.blue, tagBg: "#EEF4FF" };
  return { bg: C.greenLight, border: C.greenBorder, color: C.green, tagBg: "#F2FAF5" };
}

export function PriorityCard({ priority, badgeLabel, badgeExtras, title, children, style = {} }: { priority: "P0" | "P1" | "P2" | "P3"; badgeLabel?: string; badgeExtras?: ReactNode; title: ReactNode; children?: ReactNode; style?: CSSProperties }) {
  const tone = getPriorityTone(priority);
  return (
    <div style={{ background: tone.bg, border: `1px solid ${tone.border}`, borderRadius: 12, padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 16, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 44, height: 30, padding: "0 10px", border: `1px solid ${tone.border}`, background: tone.tagBg, color: tone.color, fontSize: 13, fontWeight: 500 }}>{badgeLabel ?? priority}</span>
        {badgeExtras}
        <div style={{ fontSize: 20, color: C.text1, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0.1 }}>{title}</div>
      </div>
      {children ? children : null}
    </div>
  );
}

export function DecisionTensionCard({ data, showManualControls = false, compact = false }: { data: DecisionTensionData; showManualControls?: boolean; compact?: boolean }) {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [manualFlag, setManualFlag] = useState<"changed" | "incorrect" | null>(null);
  const balanceOffset = { left: "18%", center: "50%", right: "82%" }[data.balanceDirection];
  const signalLabel = data.signalCount ?? data.evidenceEntryLabel;
  const evidenceEntries = data.evidenceEntries ?? data.evidence;
  const reviewActionLabels = {
    toggleEvidence: data.reviewActions?.toggleEvidence ?? "查看证据来源",
    collapseEvidence: data.reviewActions?.collapseEvidence ?? "收起证据来源",
    markChanged: data.reviewActions?.markChanged ?? "标记张力已变化",
    markIncorrect: data.reviewActions?.markIncorrect ?? "标记系统判断有误",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 12 : 14 }}>
      <div className="decision-tension-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "stretch" }}>
        <div style={{ border: `1px solid ${C.greenBorder}`, borderRadius: 12, background: C.greenLight, padding: compact ? "12px 14px" : "14px 16px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{data.leftForceLabel ?? "Left Force"}</div>
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
          <div style={{ fontSize: 10.5, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{data.rightForceLabel ?? "Right Force"}</div>
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
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text1 }}>{data.tensionTitle ?? data.title}</div>
          </div>
          <Tag label={signalLabel} variant="amber" small />
        </div>
        <div style={{ position: "relative", height: 38, marginBottom: 10 }}>
          <div style={{ position: "absolute", top: 18, left: 0, right: 0, height: 2, background: C.border, borderRadius: 999 }} />
          <div style={{ position: "absolute", top: 10, left: "50%", width: 1, height: 18, background: C.borderMd }} />
          <div style={{ position: "absolute", top: 0, left: balanceOffset, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: C.amber, boxShadow: `0 0 0 3px ${C.amberLight}` }} />
            <div style={{ fontSize: 11, color: "#92400E", fontWeight: 600 }}>{data.currentBiasLabel ?? "当前偏向"}</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.7, marginBottom: 12 }}>{data.currentBalance}</div>
        <button onClick={() => setActionOpen((prev) => !prev)} style={{ width: "100%", textAlign: "left", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", marginBottom: evidenceOpen || showManualControls || actionOpen ? 10 : 0 }}>
          <div style={{ fontSize: 11, color: C.text2, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>WHY IT MATTERS</div>
          <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.7 }}>{data.whyItMatters}</div>
        </button>
        {actionOpen && (
          <div style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: C.blue, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Action Hint</div>
            <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.7 }}>{data.actionHint}</div>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <SecondaryBtn onClick={() => setEvidenceOpen((prev) => !prev)} style={{ padding: "7px 12px", fontSize: 12 }}>{evidenceOpen ? reviewActionLabels.collapseEvidence : reviewActionLabels.toggleEvidence}</SecondaryBtn>
          {showManualControls && (
            <>
              <SecondaryBtn onClick={() => setManualFlag("changed")} style={{ padding: "7px 12px", fontSize: 12 }}>{reviewActionLabels.markChanged}</SecondaryBtn>
              <DangerBtn onClick={() => setManualFlag("incorrect")} style={{ padding: "7px 12px", fontSize: 12 }}>{reviewActionLabels.markIncorrect}</DangerBtn>
            </>
          )}
        </div>
        {manualFlag && <div style={{ marginTop: 10, background: manualFlag === "incorrect" ? C.redLight : C.blueLight, border: `1px solid ${manualFlag === "incorrect" ? C.redBorder : C.blueBorder}`, borderRadius: 10, padding: "10px 12px", fontSize: 12.5, color: manualFlag === "incorrect" ? C.red : C.blue }}>{manualFlag === "changed" ? "已标记：当前张力已变化，建议重新评估下一步动作。" : "已标记：系统判断可能有误，需人工复核证据与状态更新。"}</div>}
        {evidenceOpen && (
          <div style={{ marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
            <div style={{ fontSize: 11, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>EVIDENCE ENTRY</div>
            {evidenceEntries.map((item, index) => (
              <div key={item} title={item} style={{ padding: "8px 0", borderBottom: index === evidenceEntries.length - 1 ? "none" : `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.7 }}>{item}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PrimaryBtn({ children, onClick, style = {} }: ButtonProps) {
  return <button onClick={onClick} style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", ...style }}>{children}</button>;
}
export function SecondaryBtn({ children, onClick, style = {} }: ButtonProps) {
  return <button onClick={onClick} style={{ background: C.surface, color: C.text1, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", ...style }}>{children}</button>;
}
export function GhostBtn({ children, onClick, style = {} }: ButtonProps) {
  return <button onClick={onClick} style={{ background: "transparent", color: C.blue, border: "none", borderRadius: 8, padding: "6px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", ...style }}>{children}</button>;
}
export function DangerBtn({ children, onClick, style = {} }: ButtonProps) {
  return <button onClick={onClick} style={{ background: C.surface, color: C.red, border: `1px solid ${C.redBorder}`, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", ...style }}>{children}</button>;
}

export function SummaryStat({ label, value, variant }: { label: string; value: number; variant: TagVariant }) {
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

export function GovernanceToggle({ enabled }: { enabled: boolean }) {
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: enabled ? "flex-end" : "flex-start", width: 34, height: 20, borderRadius: 999, background: enabled ? C.greenLight : C.surfaceAlt, border: `1px solid ${enabled ? C.greenBorder : C.border}`, padding: 2 }}><span style={{ width: 14, height: 14, borderRadius: 999, background: enabled ? C.green : C.text3 }} /></span>;
}

export function getAlertVariant(type: string): TagVariant {
  if (type.includes("风险")) return "red";
  if (type.includes("切换")) return "blue";
  if (type.includes("新")) return "amber";
  return "neutral";
}
export function getTaskStatusVariant(status: string): PillVariant {
  if (status.includes("执行中")) return "blue";
  if (status.includes("待执行")) return "amber";
  if (status.includes("待审批") || status.includes("待更新")) return "amber";
  if (status.includes("完成")) return "green";
  return "neutral";
}
export function getRiskVariant(risk: string): TagVariant {
  if (risk.includes("高")) return "red";
  if (risk.includes("中")) return "amber";
  if (risk.includes("低")) return "green";
  return "neutral";
}

export function Header({ page }: HeaderProps) {
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
    <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "18px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11.5, color: C.text2, marginBottom: 4 }}>页面</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.text0, marginBottom: 8 }}>{pageTitles[page]}</div>
          <div style={{ fontSize: 14, color: C.text1 }}>
            {summary.customerIdentity.name}
            <span style={{ color: C.text3, margin: "0 8px" }}>·</span>
            {summary.customerIdentity.stage}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Tag label={`当前 owner：${summary.assignment.owner.name}`} variant="blue" />
          <Tag label={`风险：${summary.workflow.risk.level}`} variant="amber" />
          <Tag label={`审核：${summary.workflow.reviewStatus}`} variant="neutral" />
        </div>
      </div>
    </div>
  );
}
