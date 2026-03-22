import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { C } from "../app/theme";
import { Card, CardPad, GovernanceToggle, SectionTitle, Tag } from "../app/ui";
import { customerStateDebugMock } from "../data/customerStateDebugMock";
import type { AgentPerformanceItem, DriftItem, EvidenceItem, HealthItem, JudgmentItem, Rule } from "../data/customerStateDebugMock";

// ── Local types ───────────────────────────────────────────────────────────────

interface FeedbackEntry {
  id: string;
  judgmentId: string;
  verdict: "correct" | "incorrect";
  reason: "evidence" | "rule" | "agent";
  timestamp: number;
}

interface EvidenceOverride {
  weight: number;
  misleading: boolean;
}

interface SuggestedAdjustment {
  ruleId: string;
  ruleLabel: string;
  delta: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getHealthTag(status: HealthItem["status"]) {
  if (status === "stable") return { label: "stable", variant: "green" as const };
  if (status === "warning") return { label: "warning", variant: "amber" as const };
  return { label: "critical", variant: "red" as const };
}

function getVolatilityVariant(v: DriftItem["volatility"]) {
  if (v === "high") return "red" as const;
  if (v === "medium") return "amber" as const;
  return "green" as const;
}

function computeSuggestedAdjustments(
  feedbackLog: FeedbackEntry[],
  evidenceOverrides: Record<string, EvidenceOverride>,
  judgments: JudgmentItem[],
  rules: Rule[]
): SuggestedAdjustment[] {
  const ruleNegativeCount: Record<string, number> = {};

  for (const fb of feedbackLog) {
    if (fb.verdict === "incorrect" && fb.reason === "rule") {
      const judgment = judgments.find((j) => j.id === fb.judgmentId);
      if (judgment) {
        for (const step of judgment.inferencePath) {
          if (step.ruleId) ruleNegativeCount[step.ruleId] = (ruleNegativeCount[step.ruleId] ?? 0) + 1;
        }
      }
    }
  }

  for (const [evidenceId, override] of Object.entries(evidenceOverrides)) {
    if (override.misleading) {
      for (const judgment of judgments) {
        const ev = judgment.evidence.find((e) => e.id === evidenceId);
        if (ev?.linkedRuleId) ruleNegativeCount[ev.linkedRuleId] = (ruleNegativeCount[ev.linkedRuleId] ?? 0) + 1;
      }
    }
  }

  return Object.entries(ruleNegativeCount)
    .filter(([, count]) => count >= 1)
    .map(([ruleId, count]) => {
      const rule = rules.find((r) => r.id === ruleId)!;
      return { ruleId, ruleLabel: rule.label, delta: -(0.05 * count) };
    });
}

// ── Shared components ─────────────────────────────────────────────────────────

function PanelCard({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <Card style={{ minWidth: 0, ...style }}>
      <CardPad style={{ padding: "16px 16px 18px" }}>{children}</CardPad>
    </Card>
  );
}

function MetricBadge({ label, value, tone }: { label: string; value: string; tone: "blue" | "red" | "amber" | "neutral" }) {
  const colors = {
    blue: { bg: C.blueLight, border: C.blueBorder, text: C.blue },
    red: { bg: C.redLight, border: C.redBorder, text: C.red },
    amber: { bg: C.amberLight, border: C.amberBorder, text: C.amber },
    neutral: { bg: C.surfaceAlt, border: C.border, text: C.text1 },
  };
  const c = colors[tone];
  return (
    <div style={{ border: `1px solid ${c.border}`, background: c.bg, borderRadius: 8, padding: "5px 6px", textAlign: "center" }}>
      <div style={{ fontSize: 10.5, color: C.text2, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: c.text }}>{value}</div>
    </div>
  );
}

// ── Left panel: 待处理规则控制面板 ─────────────────────────────────────────────

function RuleControlPanel({
  rules,
  ruleOverrides,
  onWeightChange,
  onToggleEnabled,
}: {
  rules: Rule[];
  ruleOverrides: Record<string, { weight: number; enabled: boolean }>;
  onWeightChange: (ruleId: string, delta: number) => void;
  onToggleEnabled: (ruleId: string) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <SectionTitle style={{ marginBottom: 8 }}>Pending Rules</SectionTitle>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text0, marginBottom: 6 }}>待处理规则控制面板</div>
        <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.7 }}>调整推理规则的权重与启用状态。</div>
      </div>
      {rules.map((rule) => {
        const override = ruleOverrides[rule.id];
        const weight = override?.weight ?? rule.weight;
        const enabled = override?.enabled ?? rule.enabled;
        return (
          <div
            key={rule.id}
            style={{ border: `1px solid ${enabled ? C.border : C.borderMd}`, borderRadius: 12, padding: "14px 16px", background: enabled ? C.surface : C.surfaceAlt, opacity: enabled ? 1 : 0.65, boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text0, lineHeight: 1.5, flex: 1 }}>{rule.label}</div>
              <button onClick={() => onToggleEnabled(rule.id)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}>
                <GovernanceToggle enabled={enabled} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              <MetricBadge label="覆盖率" value={`${rule.coverage}%`} tone="blue" />
              <MetricBadge label="冲突率" value={`${rule.conflictRate}%`} tone={rule.conflictRate > 20 ? "red" : "amber"} />
              <MetricBadge label="修正率" value={`${rule.correctionRate}%`} tone={rule.correctionRate > 25 ? "red" : "neutral"} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 12.5, color: C.text2, flex: 1 }}>Weight</div>
              <button onClick={() => onWeightChange(rule.id, -0.05)} disabled={weight <= 0} style={{ border: `1px solid ${C.border}`, background: C.surfaceAlt, borderRadius: 6, width: 28, height: 28, fontSize: 16, cursor: weight <= 0 ? "default" : "pointer", color: C.text1, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text0, minWidth: 38, textAlign: "center" }}>{weight.toFixed(2)}</div>
              <button onClick={() => onWeightChange(rule.id, +0.05)} disabled={weight >= 1} style={{ border: `1px solid ${C.border}`, background: C.surfaceAlt, borderRadius: 6, width: 28, height: 28, fontSize: 16, cursor: weight >= 1 ? "default" : "pointer", color: C.text1, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Evidence card ─────────────────────────────────────────────────────────────

function EvidenceCard({
  item,
  override,
  onDecreaseWeight,
  onMarkMisleading,
}: {
  item: EvidenceItem;
  override: EvidenceOverride | undefined;
  onDecreaseWeight: () => void;
  onMarkMisleading: () => void;
}) {
  const isCounter = item.polarity === "counter";
  const isMisleading = override?.misleading ?? false;
  const weight = override?.weight ?? item.weight;
  const borderColor = isMisleading ? C.redBorder : isCounter ? C.redBorder : C.greenBorder;
  const bgColor = isMisleading ? C.redLight : isCounter ? C.redLight : C.greenLight;

  return (
    <div style={{ border: `1px solid ${borderColor}`, background: bgColor, borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ fontSize: 13, color: C.text0, fontWeight: 600, lineHeight: 1.5 }}>{item.label}</div>
        {isMisleading && <Tag label="误导" variant="red" small />}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 7 }}>
        <Tag label={`score: ${item.supportScore.toFixed(2)}`} variant={isCounter ? "red" : "green"} small />
        <Tag label={item.relationType} variant="neutral" small />
        <Tag label={`w: ${weight.toFixed(2)}`} variant="neutral" small />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onDecreaseWeight} disabled={weight <= 0} style={{ border: `1px solid ${C.amberBorder}`, background: C.amberLight, color: C.amber, borderRadius: 7, padding: "3px 8px", fontSize: 11.5, fontWeight: 600, cursor: weight <= 0 ? "default" : "pointer", opacity: weight <= 0 ? 0.5 : 1 }}>降权</button>
        {!isMisleading && (
          <button onClick={onMarkMisleading} style={{ border: `1px solid ${C.redBorder}`, background: C.surface, color: C.red, borderRadius: 7, padding: "3px 8px", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>标记错误</button>
        )}
      </div>
    </div>
  );
}

// ── Feedback (inline, no card wrapper) ───────────────────────────────────────

function FeedbackInline({ judgmentId, onSubmit }: { judgmentId: string; onSubmit: (entry: FeedbackEntry) => void }) {
  const [verdict, setVerdict] = useState<"correct" | "incorrect" | null>(null);
  const [reason, setReason] = useState<"evidence" | "rule" | "agent" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <div style={{ fontSize: 13, color: C.green, fontWeight: 600, padding: "4px 0" }}>反馈已提交，感谢您的输入。</div>;
  }

  const reasons = [
    { id: "evidence" as const, label: "证据问题" },
    { id: "rule" as const, label: "规则问题" },
    { id: "agent" as const, label: "Agent 问题" },
  ];

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div>
        <div style={{ fontSize: 12, color: C.text2, marginBottom: 7 }}>判断是否正确？</div>
        <div style={{ display: "flex", gap: 7 }}>
          {(["correct", "incorrect"] as const).map((v) => (
            <button key={v} onClick={() => setVerdict(v)} style={{ border: `1px solid ${verdict === v ? (v === "correct" ? C.greenBorder : C.redBorder) : C.border}`, background: verdict === v ? (v === "correct" ? C.greenLight : C.redLight) : C.surface, color: verdict === v ? (v === "correct" ? C.green : C.red) : C.text1, borderRadius: 8, padding: "6px 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              {v === "correct" ? "✓ 正确" : "✗ 不准确"}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, color: C.text2, marginBottom: 7 }}>问题来源</div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {reasons.map((r) => (
            <button key={r.id} onClick={() => setReason(r.id)} style={{ border: `1px solid ${reason === r.id ? C.blueBorder : C.border}`, background: reason === r.id ? C.blueLight : C.surface, color: reason === r.id ? C.blue : C.text1, borderRadius: 8, padding: "5px 11px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{r.label}</button>
          ))}
        </div>
      </div>
      <button
        onClick={() => { if (verdict && reason) { onSubmit({ id: `fb-${Date.now()}`, judgmentId, verdict, reason, timestamp: Date.now() }); setSubmitted(true); } }}
        disabled={!verdict || !reason}
        style={{ border: `1px solid ${verdict && reason ? C.blueBorder : C.border}`, background: verdict && reason ? C.blue : C.surfaceAlt, color: verdict && reason ? "#fff" : C.text2, borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: verdict && reason ? "pointer" : "default" }}
      >
        提交反馈
      </button>
    </div>
  );
}

// ── Judgment node detail (rendered inside expandable block) ───────────────────

function JudgmentNodeDetail({
  node,
  rules,
  evidenceOverrides,
  onDecreaseWeight,
  onMarkMisleading,
  onFeedback,
}: {
  node: JudgmentItem;
  rules: Rule[];
  evidenceOverrides: Record<string, EvidenceOverride>;
  onDecreaseWeight: (evidenceId: string, currentWeight: number) => void;
  onMarkMisleading: (evidenceId: string) => void;
  onFeedback: (entry: FeedbackEntry) => void;
}) {
  const supportEvidence = node.evidence.filter((e) => e.polarity !== "counter");
  const counterEvidence = node.evidence.filter((e) => e.polarity === "counter");
  const finalConfidence = node.inferencePath.reduce((sum, step) => sum + (step.delta ?? 0), 0);

  const Divider = ({ title }: { title: string }) => (
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 14 }}>
      <SectionTitle style={{ marginBottom: 8 }}>{title}</SectionTitle>
    </div>
  );

  return (
    <div style={{ padding: "0 16px 16px" }}>
      {/* 触发条件 */}
      <div style={{ paddingTop: 12 }}>
        <SectionTitle style={{ marginBottom: 8 }}>触发条件 (Trigger Conditions)</SectionTitle>
        <div style={{ display: "grid", gap: 6 }}>
          {node.triggerConditions.map((tc, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", padding: "7px 10px", background: C.surfaceAlt, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 13, color: C.text1, flex: 1, lineHeight: 1.5 }}>{tc.evidenceLabel}</div>
              <Tag label={`覆盖率 ${tc.coverage}%`} variant="blue" small />
            </div>
          ))}
        </div>
      </div>

      {/* 被修正情况 */}
      <Divider title="被修正情况 (Override Analysis)" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 8, marginBottom: 10 }}>
        <div style={{ fontSize: 13, color: C.text1 }}>改写率</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.red }}>{node.overrideRate}%</div>
      </div>
      <div style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>修正方向</div>
      <div style={{ display: "grid", gap: 5 }}>
        {node.overrideDirections.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: C.text2, fontSize: 12 }}>→</span>
            <div style={{ fontSize: 13, color: C.text1, flex: 1 }}>{d.nodeLabel}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.amber }}>{d.rate}%</div>
          </div>
        ))}
      </div>

      {/* 证据贡献 */}
      <Divider title="证据贡献 (Evidence Contribution)" />
      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, marginBottom: 6 }}>支持信号</div>
          <div style={{ display: "grid", gap: 7 }}>
            {supportEvidence.map((item) => (
              <EvidenceCard key={item.id} item={item} override={evidenceOverrides[item.id]} onDecreaseWeight={() => onDecreaseWeight(item.id, item.weight)} onMarkMisleading={() => onMarkMisleading(item.id)} />
            ))}
          </div>
        </div>
        {counterEvidence.length > 0 && (
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text1, marginBottom: 6 }}>反向信号</div>
            <div style={{ display: "grid", gap: 7 }}>
              {counterEvidence.map((item) => (
                <EvidenceCard key={item.id} item={item} override={evidenceOverrides[item.id]} onDecreaseWeight={() => onDecreaseWeight(item.id, item.weight)} onMarkMisleading={() => onMarkMisleading(item.id)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rule Trace */}
      <Divider title="Rule Trace" />
      <div style={{ display: "grid", gap: 7 }}>
        {node.inferencePath.map((step, index) => {
          const linked = step.ruleId ? node.evidence.filter((e) => e.linkedRuleId === step.ruleId) : [];
          const rule = rules.find((r) => r.id === step.ruleId);
          return (
            <div key={step.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "7px 10px", background: C.surfaceAlt, display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.text2, fontWeight: 700, flexShrink: 0 }}>{index + 1}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text1 }}>{step.label}</div>
                </div>
                <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
                  {rule && <Tag label={`w: ${rule.weight.toFixed(2)}`} variant="neutral" small />}
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: step.delta !== undefined && step.delta >= 0 ? C.blue : C.text2 }}>
                    {typeof step.delta === "number" ? `${step.delta >= 0 ? "+" : ""}${step.delta.toFixed(2)}` : "—"}
                  </div>
                </div>
              </div>
              {linked.length > 0 && (
                <div style={{ padding: "6px 10px", display: "grid", gap: 4 }}>
                  {linked.map((ev) => {
                    const ov = evidenceOverrides[ev.id];
                    const isMisleading = ov?.misleading ?? false;
                    return (
                      <div key={ev.id} style={{ display: "flex", gap: 7, alignItems: "center" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: isMisleading ? C.red : ev.polarity === "counter" ? C.amber : C.green, flexShrink: 0 }} />
                        <div style={{ fontSize: 11.5, color: isMisleading ? C.red : C.text1, flex: 1, lineHeight: 1.5 }}>{ev.label}</div>
                        <div style={{ fontSize: 11, color: C.text2, whiteSpace: "nowrap" }}>w: {(ov?.weight ?? ev.weight).toFixed(2)}</div>
                        {isMisleading && <Tag label="误导" variant="red" small />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 生成路径 */}
      <Divider title="生成路径" />
      <div style={{ display: "grid", gap: 8 }}>
        {node.inferencePath.map((step, index) => (
          <div key={step.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 8, alignItems: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.text2, fontWeight: 700 }}>{index + 1}</div>
            <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{step.label}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: step.delta !== undefined && step.delta >= 0 ? C.blue : C.text2 }}>
              {typeof step.delta === "number" ? `${step.delta >= 0 ? "+" : ""}${step.delta.toFixed(2)}` : "—"}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12.5, color: C.text2 }}>最终 confidence</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text0 }}>{finalConfidence.toFixed(2)}</div>
      </div>

      {/* 判断反馈 */}
      <Divider title="判断反馈" />
      <FeedbackInline judgmentId={node.id} onSubmit={onFeedback} />
    </div>
  );
}

// ── Middle panel: 待处理判断节点 ──────────────────────────────────────────────

function PendingJudgmentPanel({
  judgments,
  rules,
  evidenceOverrides,
  onDecreaseWeight,
  onMarkMisleading,
  onFeedback,
}: {
  judgments: JudgmentItem[];
  rules: Rule[];
  evidenceOverrides: Record<string, EvidenceOverride>;
  onDecreaseWeight: (evidenceId: string, currentWeight: number) => void;
  onMarkMisleading: (evidenceId: string) => void;
  onFeedback: (entry: FeedbackEntry) => void;
}) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => ({
    [judgments[1]?.id ?? judgments[0]?.id ?? ""]: true,
  }));

  const toggle = (id: string) => setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <SectionTitle style={{ marginBottom: 8 }}>Pending Judgment Nodes</SectionTitle>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text0, marginBottom: 6 }}>待处理判断节点</div>
        <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.7 }}>展开节点查看推理详情，标记问题证据并提交反馈。</div>
      </div>

      {judgments.map((node) => {
        const isOpen = openMap[node.id] ?? false;
        return (
          <div
            key={node.id}
            style={{ border: `1px solid ${isOpen ? C.blueBorder : C.border}`, borderRadius: 12, overflow: "hidden", background: C.surface, boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
          >
            {/* Block header */}
            <button
              onClick={() => toggle(node.id)}
              style={{ width: "100%", border: "none", background: isOpen ? C.blueLight : C.surfaceAlt, padding: "13px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left" }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text0, lineHeight: 1.4 }}>{node.label}</div>
              <div style={{ display: "flex", gap: 7, alignItems: "center", flexShrink: 0 }}>
                <Tag label={`conf: ${node.confidence.toFixed(2)}`} variant={isOpen ? "blue" : "neutral"} small />
                <Tag label={`改写 ${node.overrideRate}%`} variant={node.overrideRate > 35 ? "red" : "amber"} small />
                <div style={{ fontSize: 15, color: C.text2, lineHeight: 1 }}>{isOpen ? "−" : "+"}</div>
              </div>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <JudgmentNodeDetail
                node={node}
                rules={rules}
                evidenceOverrides={evidenceOverrides}
                onDecreaseWeight={onDecreaseWeight}
                onMarkMisleading={onMarkMisleading}
                onFeedback={onFeedback}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Agent performance card ────────────────────────────────────────────────────

function AgentPerformanceCard({ item }: { item: AgentPerformanceItem }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 12px 14px", background: C.surface }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text0, marginBottom: 10 }}>{item.name}</div>
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><span style={{ fontSize: 13, color: C.text2 }}>采纳率</span><span style={{ fontSize: 13.5, color: C.text1, fontWeight: 700 }}>{item.adoptionRate}%</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><span style={{ fontSize: 13, color: C.text2 }}>被推翻率</span><span style={{ fontSize: 13.5, color: C.text1, fontWeight: 700 }}>{item.overrideRate}%</span></div>
        <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.7 }}>主要问题：<span style={{ color: C.text1 }}>{item.mainIssue}</span></div>
      </div>
    </div>
  );
}

// ── Bottom row: Judgment Drift Panel (full-width) ─────────────────────────────

function JudgmentDriftPanel({
  driftItems,
  driftPatterns,
  triggerBias,
  staticSuggestions,
  agentPerformance,
  healthItems,
  suggestedAdjustments,
}: {
  driftItems: DriftItem[];
  driftPatterns: { fromNode: string; toNode: string; rate: number }[];
  triggerBias: { evidenceLabel: string; targetNode: string; rate: number }[];
  staticSuggestions: string[];
  agentPerformance: AgentPerformanceItem[];
  healthItems: HealthItem[];
  suggestedAdjustments: SuggestedAdjustment[];
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <SectionTitle style={{ marginBottom: 8 }}>Judgment Drift Panel</SectionTitle>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text0, marginBottom: 6 }}>判断节点偏移分析</div>
        <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.7 }}>追踪节点稳定性、偏移路径与触发偏差。</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {/* 判断节点稳定性排行 */}
        <PanelCard>
          <SectionTitle style={{ marginBottom: 10 }}>判断节点稳定性排行</SectionTitle>
          <div style={{ display: "grid", gap: 8 }}>
            {driftItems.map((item) => (
              <div key={item.id} style={{ border: `1px solid ${C.border}`, background: C.surface, borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text0, marginBottom: 8 }}>{item.label}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Tag label={`改写率 ${item.overrideRatePct}%`} variant={item.overrideRatePct > 40 ? "red" : "amber"} small />
                  <Tag label={`影响客户 ${item.impactedCustomers}%`} variant="neutral" small />
                  <Tag label={`波动 ${item.volatility}`} variant={getVolatilityVariant(item.volatility)} small />
                </div>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* 偏移路径 */}
        <PanelCard>
          <SectionTitle style={{ marginBottom: 10 }}>偏移路径 (Drift Pattern)</SectionTitle>
          <div style={{ display: "grid", gap: 10 }}>
            {driftPatterns.map((dp, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${C.amberBorder}`, paddingLeft: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text0, marginBottom: 4 }}>{dp.fromNode}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: C.text2 }}>→ 被修正为</span>
                  <span style={{ fontSize: 13, color: C.text1, fontWeight: 600 }}>{dp.toNode}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.amber }}>{dp.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* 触发偏差 */}
        <PanelCard>
          <SectionTitle style={{ marginBottom: 10 }}>触发偏差 (Trigger Bias)</SectionTitle>
          <div style={{ display: "grid", gap: 7 }}>
            {triggerBias.map((tb, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", padding: "7px 10px", background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 8 }}>
                <span style={{ fontSize: 12.5, color: C.text1, fontWeight: 600 }}>{tb.evidenceLabel}</span>
                <span style={{ fontSize: 11.5, color: C.text2 }}>→ 误触发</span>
                <span style={{ fontSize: 12.5, color: C.text0, fontWeight: 700 }}>{tb.targetNode}</span>
                <Tag label={`${tb.rate}%`} variant="red" small />
              </div>
            ))}
          </div>
        </PanelCard>

        {/* 调整建议 */}
        <PanelCard>
          <SectionTitle style={{ marginBottom: 10 }}>调整建议 (Suggestions)</SectionTitle>
          <div style={{ display: "grid", gap: 7 }}>
            {staticSuggestions.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: C.text1, lineHeight: 1.65 }}>
                <span style={{ color: C.text2, flexShrink: 0 }}>•</span><span>{s}</span>
              </div>
            ))}
            {suggestedAdjustments.map((adj) => (
              <div key={adj.ruleId} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: C.amber, lineHeight: 1.65 }}>
                <span style={{ flexShrink: 0 }}>•</span>
                <span>降低 {adj.ruleLabel} 权重 {Math.abs(adj.delta).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Agent performance */}
        <PanelCard>
          <SectionTitle style={{ marginBottom: 10 }}>Agent Performance</SectionTitle>
          <div style={{ display: "grid", gap: 8 }}>
            {agentPerformance.map((item) => <AgentPerformanceCard key={item.id} item={item} />)}
          </div>
        </PanelCard>

        {/* State health */}
        <PanelCard>
          <SectionTitle style={{ marginBottom: 10 }}>State Health</SectionTitle>
          <div style={{ display: "grid", gap: 8 }}>
            {healthItems.map((item) => {
              const tone = getHealthTag(item.status);
              return (
                <div key={item.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 12px", background: C.surface, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 13.5, color: C.text1, fontWeight: 600 }}>{item.label}</div>
                  <Tag label={tone.label} variant={tone.variant} small />
                </div>
              );
            })}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

export function CustomerStateDebugConsolePanel() {
  const { rules, judgments, driftItems, driftPatterns, triggerBias, adjustmentSuggestions, agentPerformance, healthItems } = customerStateDebugMock;

  const [ruleOverrides, setRuleOverrides] = useState<Record<string, { weight: number; enabled: boolean }>>({});
  const [evidenceOverrides, setEvidenceOverrides] = useState<Record<string, EvidenceOverride>>({});
  const [feedbackLog, setFeedbackLog] = useState<FeedbackEntry[]>([]);

  const handleRuleWeightChange = (ruleId: string, delta: number) => {
    setRuleOverrides((prev) => {
      const rule = rules.find((r) => r.id === ruleId)!;
      const current = prev[ruleId]?.weight ?? rule.weight;
      return { ...prev, [ruleId]: { enabled: prev[ruleId]?.enabled ?? rule.enabled, weight: Math.min(1, Math.max(0, current + delta)) } };
    });
  };

  const handleRuleToggle = (ruleId: string) => {
    setRuleOverrides((prev) => {
      const rule = rules.find((r) => r.id === ruleId)!;
      return { ...prev, [ruleId]: { weight: prev[ruleId]?.weight ?? rule.weight, enabled: !(prev[ruleId]?.enabled ?? rule.enabled) } };
    });
  };

  const handleDecreaseEvidenceWeight = (evidenceId: string, originalWeight: number) => {
    setEvidenceOverrides((prev) => {
      const current = prev[evidenceId]?.weight ?? originalWeight;
      return { ...prev, [evidenceId]: { misleading: prev[evidenceId]?.misleading ?? false, weight: Math.max(0, current - 0.1) } };
    });
  };

  const handleMarkMisleading = (evidenceId: string) => {
    setEvidenceOverrides((prev) => ({
      ...prev,
      [evidenceId]: { weight: Math.max(0, (prev[evidenceId]?.weight ?? 1) - 0.2), misleading: true },
    }));
  };

  const handleFeedback = (entry: FeedbackEntry) => setFeedbackLog((prev) => [...prev, entry]);

  const suggestedAdjustments = useMemo(
    () => computeSuggestedAdjustments(feedbackLog, evidenceOverrides, judgments, rules),
    [feedbackLog, evidenceOverrides, judgments, rules]
  );

  return (
    <Card style={{ borderColor: C.borderMd }}>
      <CardPad style={{ padding: "18px 20px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <div>
            <SectionTitle style={{ marginBottom: 8 }}>嵌入式控制面板</SectionTitle>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.text0, marginBottom: 6 }}>Judgment Node Control Panel</div>
            <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.75 }}>调整规则权重，标记问题证据，提交判断反馈，追踪推理链路。</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag label="Governance View" variant="blue" small />
            <Tag label="Control Panel" variant="purple" small />
            {feedbackLog.length > 0 && <Tag label={`${feedbackLog.length} feedbacks`} variant="amber" small />}
          </div>
        </div>

        {/* Layout: top row (rules + judgments), bottom row (drift) */}
        <div className="customer-state-debug-grid" style={{ display: "grid", gap: 14 }}>
          {/* Top row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.45fr", gap: 14, alignItems: "start" }}>
            <RuleControlPanel rules={rules} ruleOverrides={ruleOverrides} onWeightChange={handleRuleWeightChange} onToggleEnabled={handleRuleToggle} />
            <PendingJudgmentPanel
              judgments={judgments}
              rules={rules}
              evidenceOverrides={evidenceOverrides}
              onDecreaseWeight={handleDecreaseEvidenceWeight}
              onMarkMisleading={handleMarkMisleading}
              onFeedback={handleFeedback}
            />
          </div>

          {/* Bottom row — full width */}
          <JudgmentDriftPanel
            driftItems={driftItems}
            driftPatterns={driftPatterns}
            triggerBias={triggerBias}
            staticSuggestions={adjustmentSuggestions}
            agentPerformance={agentPerformance}
            healthItems={healthItems}
            suggestedAdjustments={suggestedAdjustments}
          />
        </div>
      </CardPad>
    </Card>
  );
}

export default CustomerStateDebugConsolePanel;
