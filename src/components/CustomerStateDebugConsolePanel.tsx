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
  suggestion: string;
  delta: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSeverityTone(severity: DriftItem["severity"]) {
  if (severity === "high") return { variant: "red" as const, border: C.redBorder, bg: C.redLight };
  if (severity === "medium") return { variant: "amber" as const, border: C.amberBorder, bg: C.amberLight };
  return { variant: "green" as const, border: C.greenBorder, bg: C.greenLight };
}

function getHealthTag(status: HealthItem["status"]) {
  if (status === "stable") return { label: "stable", variant: "green" as const };
  if (status === "warning") return { label: "warning", variant: "amber" as const };
  return { label: "critical", variant: "red" as const };
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
          if (step.ruleId) {
            ruleNegativeCount[step.ruleId] = (ruleNegativeCount[step.ruleId] ?? 0) + 1;
          }
        }
      }
    }
  }

  for (const [evidenceId, override] of Object.entries(evidenceOverrides)) {
    if (override.misleading) {
      for (const judgment of judgments) {
        const ev = judgment.evidence.find((e) => e.id === evidenceId);
        if (ev?.linkedRuleId) {
          ruleNegativeCount[ev.linkedRuleId] = (ruleNegativeCount[ev.linkedRuleId] ?? 0) + 1;
        }
      }
    }
  }

  return Object.entries(ruleNegativeCount)
    .filter(([, count]) => count >= 1)
    .map(([ruleId, count]) => {
      const rule = rules.find((r) => r.id === ruleId)!;
      const delta = -(0.05 * count);
      return { ruleId, ruleLabel: rule.label, suggestion: `反馈 ${count} 次，建议降低权重 ${Math.abs(delta).toFixed(2)}`, delta };
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

// ── Left panel: Rule Control ──────────────────────────────────────────────────

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
        <SectionTitle style={{ marginBottom: 8 }}>Rule Control</SectionTitle>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text0, marginBottom: 6 }}>Rule Control Panel</div>
        <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.7 }}>调整推理规则的权重与启用状态。</div>
      </div>
      {rules.map((rule) => {
        const override = ruleOverrides[rule.id];
        const weight = override?.weight ?? rule.weight;
        const enabled = override?.enabled ?? rule.enabled;
        return (
          <div
            key={rule.id}
            style={{
              border: `1px solid ${enabled ? C.border : C.borderMd}`,
              borderRadius: 12,
              padding: "12px 14px",
              background: enabled ? C.surface : C.surfaceAlt,
              opacity: enabled ? 1 : 0.65,
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text0, lineHeight: 1.5, flex: 1 }}>{rule.label}</div>
              <button
                onClick={() => onToggleEnabled(rule.id)}
                style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 5 }}
              >
                <GovernanceToggle enabled={enabled} />
              </button>
            </div>
            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
              <MetricBadge label="覆盖率" value={`${rule.coverage}%`} tone="blue" />
              <MetricBadge label="冲突率" value={`${rule.conflictRate}%`} tone={rule.conflictRate > 20 ? "red" : "amber"} />
              <MetricBadge label="修正率" value={`${rule.correctionRate}%`} tone={rule.correctionRate > 25 ? "red" : "neutral"} />
            </div>
            {/* Weight control */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 12, color: C.text2, flex: 1 }}>Weight</div>
              <button
                onClick={() => onWeightChange(rule.id, -0.05)}
                disabled={weight <= 0}
                style={{ border: `1px solid ${C.border}`, background: C.surfaceAlt, borderRadius: 6, width: 26, height: 26, fontSize: 16, cursor: weight <= 0 ? "default" : "pointer", color: C.text1, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                −
              </button>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text0, minWidth: 36, textAlign: "center" }}>{weight.toFixed(2)}</div>
              <button
                onClick={() => onWeightChange(rule.id, +0.05)}
                disabled={weight >= 1}
                style={{ border: `1px solid ${C.border}`, background: C.surfaceAlt, borderRadius: 6, width: 26, height: 26, fontSize: 16, cursor: weight >= 1 ? "default" : "pointer", color: C.text1, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                +
              </button>
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
        <div style={{ fontSize: 13.5, color: C.text0, fontWeight: 600, lineHeight: 1.5 }}>{item.label}</div>
        {isMisleading && <Tag label="误导" variant="red" small />}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        <Tag label={`score: ${item.supportScore.toFixed(2)}`} variant={isCounter ? "red" : "green"} small />
        <Tag label={item.relationType} variant="neutral" small />
        <Tag label={`w: ${weight.toFixed(2)}`} variant="neutral" small />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={onDecreaseWeight}
          disabled={weight <= 0}
          style={{
            border: `1px solid ${C.amberBorder}`, background: C.amberLight, color: C.amber,
            borderRadius: 7, padding: "3px 8px", fontSize: 11.5, fontWeight: 600,
            cursor: weight <= 0 ? "default" : "pointer", opacity: weight <= 0 ? 0.5 : 1,
          }}
        >
          − 降低权重
        </button>
        {!isMisleading && (
          <button
            onClick={onMarkMisleading}
            style={{
              border: `1px solid ${C.redBorder}`, background: C.surface, color: C.red,
              borderRadius: 7, padding: "3px 8px", fontSize: 11.5, fontWeight: 600, cursor: "pointer",
            }}
          >
            标记误导
          </button>
        )}
      </div>
    </div>
  );
}

// ── Rule trace card ───────────────────────────────────────────────────────────

function RuleTraceCard({ judgment, evidenceOverrides, rules }: { judgment: JudgmentItem; evidenceOverrides: Record<string, EvidenceOverride>; rules: Rule[] }) {
  const evidenceByRule: Record<string, EvidenceItem[]> = {};
  for (const step of judgment.inferencePath) {
    if (step.ruleId) {
      evidenceByRule[step.ruleId] = judgment.evidence.filter((e) => e.linkedRuleId === step.ruleId);
    }
  }

  return (
    <PanelCard>
      <SectionTitle style={{ marginBottom: 10 }}>Rule Trace</SectionTitle>
      <div style={{ display: "grid", gap: 8 }}>
        {judgment.inferencePath.map((step, index) => {
          const ruleEvidence = step.ruleId ? (evidenceByRule[step.ruleId] ?? []) : [];
          const rule = rules.find((r) => r.id === step.ruleId);
          return (
            <div key={step.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "8px 12px", background: C.surfaceAlt, display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.text2, fontWeight: 700, flexShrink: 0 }}>{index + 1}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text1 }}>{step.label}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  {rule && <Tag label={`w: ${rule.weight.toFixed(2)}`} variant="neutral" small />}
                  <div style={{ fontSize: 13, fontWeight: 700, color: step.delta !== undefined && step.delta >= 0 ? C.blue : C.text2 }}>
                    {typeof step.delta === "number" ? `${step.delta >= 0 ? "+" : ""}${step.delta.toFixed(2)}` : "—"}
                  </div>
                </div>
              </div>
              {ruleEvidence.length > 0 && (
                <div style={{ padding: "8px 12px", display: "grid", gap: 5 }}>
                  {ruleEvidence.map((ev) => {
                    const override = evidenceOverrides[ev.id];
                    const isMisleading = override?.misleading ?? false;
                    const w = override?.weight ?? ev.weight;
                    return (
                      <div key={ev.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: isMisleading ? C.red : ev.polarity === "counter" ? C.amber : C.green, flexShrink: 0 }} />
                        <div style={{ fontSize: 12, color: isMisleading ? C.red : C.text1, flex: 1, lineHeight: 1.5 }}>{ev.label}</div>
                        <div style={{ fontSize: 11.5, color: C.text2, whiteSpace: "nowrap" }}>w: {w.toFixed(2)}</div>
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
    </PanelCard>
  );
}

// ── Feedback module ───────────────────────────────────────────────────────────

function FeedbackModule({ judgmentId, onSubmit }: { judgmentId: string; onSubmit: (entry: FeedbackEntry) => void }) {
  const [verdict, setVerdict] = useState<"correct" | "incorrect" | null>(null);
  const [reason, setReason] = useState<"evidence" | "rule" | "agent" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!verdict || !reason) return;
    onSubmit({ id: `fb-${Date.now()}`, judgmentId, verdict, reason, timestamp: Date.now() });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PanelCard>
        <SectionTitle style={{ marginBottom: 8 }}>判断反馈</SectionTitle>
        <div style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>反馈已提交，感谢您的输入。</div>
      </PanelCard>
    );
  }

  const reasons = [
    { id: "evidence" as const, label: "证据问题" },
    { id: "rule" as const, label: "规则问题" },
    { id: "agent" as const, label: "Agent 问题" },
  ];

  return (
    <PanelCard>
      <SectionTitle style={{ marginBottom: 10 }}>判断反馈</SectionTitle>
      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12.5, color: C.text2, marginBottom: 8 }}>判断是否正确？</div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["correct", "incorrect"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVerdict(v)}
                style={{
                  border: `1px solid ${verdict === v ? (v === "correct" ? C.greenBorder : C.redBorder) : C.border}`,
                  background: verdict === v ? (v === "correct" ? C.greenLight : C.redLight) : C.surface,
                  color: verdict === v ? (v === "correct" ? C.green : C.red) : C.text1,
                  borderRadius: 8, padding: "7px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                }}
              >
                {v === "correct" ? "✓ 正确" : "✗ 不准确"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12.5, color: C.text2, marginBottom: 8 }}>问题来源</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {reasons.map((r) => (
              <button
                key={r.id}
                onClick={() => setReason(r.id)}
                style={{
                  border: `1px solid ${reason === r.id ? C.blueBorder : C.border}`,
                  background: reason === r.id ? C.blueLight : C.surface,
                  color: reason === r.id ? C.blue : C.text1,
                  borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!verdict || !reason}
          style={{
            border: `1px solid ${verdict && reason ? C.blueBorder : C.border}`,
            background: verdict && reason ? C.blue : C.surfaceAlt,
            color: verdict && reason ? "#fff" : C.text2,
            borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700,
            cursor: verdict && reason ? "pointer" : "default",
          }}
        >
          提交反馈
        </button>
      </div>
    </PanelCard>
  );
}

// ── Middle panel: Judgment Control ────────────────────────────────────────────

function JudgmentControlPanel({
  judgments,
  currentCustomerId,
  rules,
  evidenceOverrides,
  onDecreaseWeight,
  onMarkMisleading,
  onFeedback,
}: {
  judgments: JudgmentItem[];
  currentCustomerId: string;
  rules: Rule[];
  evidenceOverrides: Record<string, EvidenceOverride>;
  onDecreaseWeight: (evidenceId: string, currentWeight: number) => void;
  onMarkMisleading: (evidenceId: string) => void;
  onFeedback: (entry: FeedbackEntry) => void;
}) {
  const [activeJudgmentId, setActiveJudgmentId] = useState(judgments[1]?.id ?? judgments[0]?.id ?? "");
  const activeJudgment = useMemo(() => judgments.find((item) => item.id === activeJudgmentId) ?? judgments[0], [activeJudgmentId, judgments]);
  const supportEvidence = activeJudgment.evidence.filter((item) => item.polarity !== "counter");
  const counterEvidence = activeJudgment.evidence.filter((item) => item.polarity === "counter");
  const finalConfidence = activeJudgment.inferencePath.reduce((sum, step) => sum + (step.delta ?? 0), 0);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <SectionTitle style={{ marginBottom: 8 }}>Judgment Control</SectionTitle>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text0, marginBottom: 6 }}>Judgment Control Panel</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <Tag label={`客户：${currentCustomerId}`} variant="blue" small />
          <div style={{ fontSize: 13, color: C.text2 }}>调试推理链路，标记问题证据，提交修正反馈。</div>
        </div>
      </div>

      {/* Judgment selector */}
      <PanelCard>
        <SectionTitle style={{ marginBottom: 10 }}>Current Judgments</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {judgments.map((item) => {
            const active = item.id === activeJudgment.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveJudgmentId(item.id)}
                style={{ textAlign: "left", border: `1px solid ${active ? C.blueBorder : C.border}`, background: active ? C.blueLight : C.surface, borderRadius: 12, padding: "14px 14px 12px", cursor: "pointer" }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text0, lineHeight: 1.5, marginBottom: 10 }}>{item.label}</div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 12, color: C.text2 }}>confidence</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: active ? C.blue : C.text1 }}>{item.confidence.toFixed(2)}</div>
                </div>
              </button>
            );
          })}
        </div>
      </PanelCard>

      {/* Interactive evidence */}
      <PanelCard>
        <SectionTitle style={{ marginBottom: 10 }}>判断依据</SectionTitle>
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text1, marginBottom: 8 }}>支持证据</div>
            <div style={{ display: "grid", gap: 8 }}>
              {supportEvidence.map((item) => (
                <EvidenceCard
                  key={item.id}
                  item={item}
                  override={evidenceOverrides[item.id]}
                  onDecreaseWeight={() => onDecreaseWeight(item.id, item.weight)}
                  onMarkMisleading={() => onMarkMisleading(item.id)}
                />
              ))}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text1, marginBottom: 8 }}>反向信号</div>
            <div style={{ display: "grid", gap: 8 }}>
              {counterEvidence.length > 0 ? (
                counterEvidence.map((item) => (
                  <EvidenceCard
                    key={item.id}
                    item={item}
                    override={evidenceOverrides[item.id]}
                    onDecreaseWeight={() => onDecreaseWeight(item.id, item.weight)}
                    onMarkMisleading={() => onMarkMisleading(item.id)}
                  />
                ))
              ) : (
                <div style={{ fontSize: 13, color: C.text2 }}>当前没有明显反向信号。</div>
              )}
            </div>
          </div>
        </div>
      </PanelCard>

      {/* Rule trace */}
      <RuleTraceCard judgment={activeJudgment} evidenceOverrides={evidenceOverrides} rules={rules} />

      {/* Inference path */}
      <PanelCard>
        <SectionTitle style={{ marginBottom: 10 }}>生成路径</SectionTitle>
        <div style={{ display: "grid", gap: 10 }}>
          {activeJudgment.inferencePath.map((step, index) => (
            <div key={step.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 10, alignItems: "center" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.text2, fontWeight: 700 }}>{index + 1}</div>
              <div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}>{step.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: step.delta !== undefined && step.delta >= 0 ? C.blue : C.text2 }}>
                {typeof step.delta === "number" ? `${step.delta >= 0 ? "+" : ""}${step.delta.toFixed(2)}` : "—"}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div style={{ fontSize: 13, color: C.text2 }}>最终 confidence</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text0 }}>{finalConfidence.toFixed(2)}</div>
        </div>
      </PanelCard>

      {/* Feedback module — reset on judgment switch */}
      <FeedbackModule key={activeJudgment.id} judgmentId={activeJudgment.id} onSubmit={onFeedback} />
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

// ── Right panel: Drift & Control ──────────────────────────────────────────────

function DriftControlPanel({
  driftItems,
  agentPerformance,
  healthItems,
  rules,
  suggestedAdjustments,
  selectedDriftId,
  onSelectDrift,
}: {
  driftItems: DriftItem[];
  agentPerformance: AgentPerformanceItem[];
  healthItems: HealthItem[];
  rules: Rule[];
  suggestedAdjustments: SuggestedAdjustment[];
  selectedDriftId: string | null;
  onSelectDrift: (id: string | null) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <SectionTitle style={{ marginBottom: 8 }}>Drift & Control</SectionTitle>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text0, marginBottom: 6 }}>Drift & Control</div>
        <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.7 }}>查看问题判断，关联规则，查看修正建议。</div>
      </div>

      {/* Problem cards */}
      <PanelCard>
        <SectionTitle style={{ marginBottom: 10 }}>Problem Cards</SectionTitle>
        <div style={{ display: "grid", gap: 8 }}>
          {driftItems.map((item) => {
            const tone = getSeverityTone(item.severity);
            const isSelected = selectedDriftId === item.id;
            const linkedRule = rules.find((r) => r.id === item.linkedRuleId);
            return (
              <div key={item.id}>
                <button
                  onClick={() => onSelectDrift(isSelected ? null : item.id)}
                  style={{
                    width: "100%", textAlign: "left",
                    border: `1px solid ${isSelected ? C.blueBorder : tone.border}`,
                    background: isSelected ? C.blueLight : tone.bg,
                    borderRadius: 10,
                    borderBottomLeftRadius: isSelected ? 0 : 10,
                    borderBottomRightRadius: isSelected ? 0 : 10,
                    padding: "10px 12px", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, color: C.text0, fontWeight: 700, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 12.5, color: C.text1 }}>{item.detail}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <Tag label={item.severity} variant={tone.variant} small />
                    <div style={{ fontSize: 11, color: C.text2 }}>{isSelected ? "▲" : "▼"}</div>
                  </div>
                </button>
                {isSelected && (
                  <div style={{ border: `1px solid ${C.blueBorder}`, borderTop: "none", background: C.surface, borderRadius: "0 0 10px 10px", padding: "12px 12px 14px" }}>
                    {linkedRule && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11.5, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>关联规则</div>
                        <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", background: C.surfaceAlt }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text0, marginBottom: 6 }}>{linkedRule.label}</div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <Tag label={`覆盖 ${linkedRule.coverage}%`} variant="blue" small />
                            <Tag label={`冲突 ${linkedRule.conflictRate}%`} variant={linkedRule.conflictRate > 20 ? "red" : "amber"} small />
                            <Tag label={`修正 ${linkedRule.correctionRate}%`} variant="neutral" small />
                            <Tag label={`w: ${linkedRule.weight.toFixed(2)}`} variant="neutral" small />
                          </div>
                        </div>
                      </div>
                    )}
                    {item.exampleCases && item.exampleCases.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11.5, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>典型案例</div>
                        <div style={{ display: "grid", gap: 5 }}>
                          {item.exampleCases.map((c, i) => (
                            <div key={i} style={{ fontSize: 12.5, color: C.text1, padding: "5px 8px", background: C.surfaceAlt, borderRadius: 6, borderLeft: `2px solid ${tone.border}` }}>
                              {c}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PanelCard>

      {/* Suggested adjustments (feedback loop output) */}
      {suggestedAdjustments.length > 0 && (
        <PanelCard>
          <SectionTitle style={{ marginBottom: 10 }}>建议调整</SectionTitle>
          <div style={{ display: "grid", gap: 8 }}>
            {suggestedAdjustments.map((adj) => (
              <div key={adj.ruleId} style={{ border: `1px solid ${C.amberBorder}`, background: C.amberLight, borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text0, marginBottom: 3 }}>{adj.ruleLabel}</div>
                  <div style={{ fontSize: 12.5, color: C.text1 }}>{adj.suggestion}</div>
                </div>
                <Tag label={adj.delta.toFixed(2)} variant="amber" small />
              </div>
            ))}
          </div>
        </PanelCard>
      )}

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
  );
}

// ── Root component ────────────────────────────────────────────────────────────

export function CustomerStateDebugConsolePanel() {
  const { rules, judgments, driftItems, agentPerformance, healthItems, currentCustomerId } = customerStateDebugMock;

  const [ruleOverrides, setRuleOverrides] = useState<Record<string, { weight: number; enabled: boolean }>>({});
  const [evidenceOverrides, setEvidenceOverrides] = useState<Record<string, EvidenceOverride>>({});
  const [feedbackLog, setFeedbackLog] = useState<FeedbackEntry[]>([]);
  const [selectedDriftId, setSelectedDriftId] = useState<string | null>(null);

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
      const current = prev[ruleId]?.enabled ?? rule.enabled;
      return { ...prev, [ruleId]: { weight: prev[ruleId]?.weight ?? rule.weight, enabled: !current } };
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

  const handleFeedback = (entry: FeedbackEntry) => {
    setFeedbackLog((prev) => [...prev, entry]);
  };

  const suggestedAdjustments = useMemo(
    () => computeSuggestedAdjustments(feedbackLog, evidenceOverrides, judgments, rules),
    [feedbackLog, evidenceOverrides, judgments, rules]
  );

  return (
    <Card style={{ borderColor: C.borderMd }}>
      <CardPad style={{ padding: "18px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <div>
            <SectionTitle style={{ marginBottom: 8 }}>嵌入式控制面板</SectionTitle>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.text0, marginBottom: 6 }}>Customer State Control Panel</div>
            <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.75 }}>调整规则权重，标记问题证据，提交判断反馈，追踪推理链路。</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag label="Governance View" variant="blue" small />
            <Tag label="Control Panel" variant="purple" small />
            {feedbackLog.length > 0 && <Tag label={`${feedbackLog.length} feedbacks`} variant="amber" small />}
          </div>
        </div>
        <div className="customer-state-debug-grid" style={{ display: "grid", gridTemplateColumns: "0.95fr 1.35fr 0.9fr", gap: 14, alignItems: "start" }}>
          <RuleControlPanel
            rules={rules}
            ruleOverrides={ruleOverrides}
            onWeightChange={handleRuleWeightChange}
            onToggleEnabled={handleRuleToggle}
          />
          <JudgmentControlPanel
            judgments={judgments}
            currentCustomerId={currentCustomerId}
            rules={rules}
            evidenceOverrides={evidenceOverrides}
            onDecreaseWeight={handleDecreaseEvidenceWeight}
            onMarkMisleading={handleMarkMisleading}
            onFeedback={handleFeedback}
          />
          <DriftControlPanel
            driftItems={driftItems}
            agentPerformance={agentPerformance}
            healthItems={healthItems}
            rules={rules}
            suggestedAdjustments={suggestedAdjustments}
            selectedDriftId={selectedDriftId}
            onSelectDrift={setSelectedDriftId}
          />
        </div>
      </CardPad>
    </Card>
  );
}

export default CustomerStateDebugConsolePanel;
