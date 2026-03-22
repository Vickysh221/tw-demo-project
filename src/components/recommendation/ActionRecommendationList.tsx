import { useMemo, useState } from "react";
import { C } from "../../app/theme";
import type { ActionRecommendationItem } from "../../app/types";
import { PrimaryBtn, Row, SecondaryBtn, Tag } from "../../app/ui";

function ConfidenceRing({ confidence }: { confidence: number }) {
  return (
    <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <svg width="36" height="36" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx="18" cy="18" r="16" fill="none" stroke={C.border} strokeWidth="2" />
        <circle cx="18" cy="18" r="16" fill="none" stroke={C.green} strokeWidth="2" strokeDasharray={`${confidence * 1.005} 100`} strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: 10, fontWeight: 700, color: C.green }}>{confidence}%</span>
    </div>
  );
}

function FeedbackControls({
  confidence,
  liked,
  onFeedback,
}: {
  confidence: number;
  liked: boolean | null | undefined;
  onFeedback: (value: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <button onClick={() => onFeedback(true)} style={{ border: `1px solid ${liked === true ? C.green : C.border}`, background: liked === true ? C.greenLight : C.surface, borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: liked === true ? C.green : C.text2 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
      </button>
      <button onClick={() => onFeedback(false)} style={{ border: `1px solid ${liked === false ? C.red : C.border}`, background: liked === false ? C.redLight : C.surface, borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: liked === false ? C.red : C.text2 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
      </button>
      <ConfidenceRing confidence={confidence} />
    </div>
  );
}

function getConfirmationState({
  selectedDecision,
  selectedPrediction,
  submittedActualResult,
}: {
  selectedDecision?: string;
  selectedPrediction?: string;
  submittedActualResult?: string;
}) {
  if ((selectedPrediction && selectedPrediction !== "__other__") || (selectedPrediction === "__other__" && submittedActualResult)) {
    return {
      label: "已确认",
      result: selectedPrediction === "__other__" ? submittedActualResult ?? "" : selectedPrediction ?? "",
      tone: { color: C.green, bg: C.greenLight, border: C.greenBorder },
    };
  }
  if (selectedDecision || selectedPrediction === "__other__") {
    return {
      label: "部分确认",
      result: "",
      tone: { color: C.amber, bg: C.amberLight, border: C.amberBorder },
    };
  }
  return {
    label: "未确认",
    result: "",
    tone: { color: C.text2, bg: C.surfaceAlt, border: C.border },
  };
}

export default function ActionRecommendationList({
  items,
  onDecisionSelect,
}: {
  items: ActionRecommendationItem[];
  onDecisionSelect?: (itemId: string, optionId: string) => void;
}) {
  const initialFeedback = useMemo(
    () => Object.fromEntries(items.map((item) => [item.id, item.feedback?.liked ?? null])),
    [items],
  );
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id ?? null);
  const [selectedDecisions, setSelectedDecisions] = useState<Record<string, string>>({});
  const [decisionOtherOpen, setDecisionOtherOpen] = useState<Record<string, boolean>>({});
  const [otherDecisionDrafts, setOtherDecisionDrafts] = useState<Record<string, string>>({});
  const [selectedPredictionOptions, setSelectedPredictionOptions] = useState<Record<string, string>>({});
  const [predictionOtherOpen, setPredictionOtherOpen] = useState<Record<string, boolean>>({});
  const [feedbackState, setFeedbackState] = useState<Record<string, boolean | null>>(initialFeedback);
  const [actualResultDrafts, setActualResultDrafts] = useState<Record<string, string>>({});
  const [submittedActualResults, setSubmittedActualResults] = useState<Record<string, string>>({});

  return (
    <div style={{ background: "#FCFDFE", border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>实时更新的建议动作</div>
      {items.map((item, index) => {
        const expanded = expandedId === item.id;
        const confirmationState = getConfirmationState({
          selectedDecision: selectedDecisions[item.id],
          selectedPrediction: selectedPredictionOptions[item.id],
          submittedActualResult: submittedActualResults[item.id],
        });
        return (
          <div key={item.id}>
            <Row last={index === items.length - 1 && !expanded} style={{ alignItems: "flex-start", padding: "8px 0" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", width: "100%", justifyContent: "space-between", flexWrap: "wrap" }}>
                <button onClick={() => setExpandedId((prev) => (prev === item.id ? null : item.id))} style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1, minWidth: 280, background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 22, height: 22, borderRadius: 999, border: `1px solid ${expanded ? C.green : C.borderMd}`, display: "inline-flex", alignItems: "center", justifyContent: "center", color: expanded ? C.green : C.text3, flexShrink: 0, marginTop: 1, fontSize: 12, fontWeight: 700 }}>
                    {expanded ? "−" : "+"}
                  </span>
                  <div style={{ display: "grid", gap: 4 }}>
                    <span style={{ fontSize: 13.5, color: C.text0, lineHeight: 1.65, fontWeight: 600 }}>{item.title}</span>
                    <span style={{ fontSize: 12, color: C.text2, lineHeight: 1.55 }}>{item.shortHint ?? "推荐动作 · 点击展开查看决策入口与执行结果"}</span>
                  </div>
                </button>
                <FeedbackControls confidence={item.confidence} liked={feedbackState[item.id]} onFeedback={(value) => setFeedbackState((prev) => ({ ...prev, [item.id]: value }))} />
              </div>
            </Row>
            {expanded && (
              <div style={{ margin: "4px 0 8px 34px", border: `1px solid ${C.greenBorder}`, borderRadius: 12, background: "#F3FBF5", padding: "14px 16px", display: "grid", gap: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    <Tag label={item.badgeLabel ?? "推荐动作"} variant="green" small />
                    <Tag label={`置信度 ${item.confidence}%`} variant="neutral" small />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text0, marginBottom: 8 }}>{item.panelTitle}</div>
                  <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item.description}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>基于</div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {item.basedOn.map((entry) => (
                      <div key={entry} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ color: C.green, fontWeight: 700 }}>•</span>
                        <span style={{ fontSize: 13, color: C.text1, lineHeight: 1.65 }}>{entry}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: item.risk.length > 0 ? "1fr 1fr" : "1fr", gap: 12 }}>
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>影响</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {item.impact.map((entry) => (
                        <div key={entry} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: C.green, fontWeight: 700 }}>+</span>
                          <span style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{entry}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {item.risk.length > 0 && (
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontSize: 11, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>风险</div>
                      <div style={{ display: "grid", gap: 6 }}>
                        {item.risk.map((entry) => (
                          <div key={entry} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span style={{ color: C.red, fontWeight: 700 }}>!</span>
                            <span style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{entry}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: C.text2, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>决策入口</div>
                  <div style={{ fontSize: 13, color: C.text0, marginBottom: 10 }}>{item.decisionQuestion}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {item.decisionOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedDecisions((prev) => ({ ...prev, [item.id]: option.id }));
                          onDecisionSelect?.(item.id, option.id);
                        }}
                        style={{
                          padding: "7px 12px",
                          borderRadius: 999,
                          border: `1px solid ${selectedDecisions[item.id] === option.id ? C.greenBorder : C.border}`,
                          background: selectedDecisions[item.id] === option.id ? C.greenLight : C.surface,
                          color: selectedDecisions[item.id] === option.id ? C.green : C.text1,
                          fontSize: 12.5,
                          fontWeight: option.isPrimary ? 700 : 600,
                          cursor: "pointer",
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setDecisionOtherOpen((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                      style={{
                        padding: "7px 12px",
                        borderRadius: 999,
                        border: `1px solid ${decisionOtherOpen[item.id] ? C.greenBorder : C.border}`,
                        background: decisionOtherOpen[item.id] ? C.greenLight : C.surface,
                        color: decisionOtherOpen[item.id] ? C.green : C.text1,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      其他
                    </button>
                  </div>
                  {decisionOtherOpen[item.id] && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 10 }}>
                      <span style={{ fontSize: 12.5, color: C.text2, fontWeight: 600 }}>其他:</span>
                      <input
                        value={otherDecisionDrafts[item.id] ?? ""}
                        onChange={(event) => setOtherDecisionDrafts((prev) => ({ ...prev, [item.id]: event.target.value }))}
                        placeholder="输入其他决策方式"
                        style={{ flex: "1 1 220px", minWidth: 180, border: `1px solid ${C.border}`, borderRadius: 999, background: C.surfaceAlt, color: C.text0, fontSize: 12.5, padding: "8px 12px", outline: "none" }}
                      />
                      <PrimaryBtn
                        onClick={() => {
                          const value = (otherDecisionDrafts[item.id] ?? "").trim();
                          if (!value) return;
                          setSelectedDecisions((prev) => ({ ...prev, [item.id]: `other:${value}` }));
                          onDecisionSelect?.(item.id, `other:${value}`);
                        }}
                        style={{ padding: "8px 14px", fontSize: 12.5 }}
                      >
                        确定
                      </PrimaryBtn>
                    </div>
                  )}
                </div>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: C.text2, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>执行结果</div>
                  <div style={{ background: confirmationState.tone.bg, border: `1px solid ${confirmationState.tone.border}`, borderRadius: 10, padding: "10px 12px", marginBottom: 10, display: "grid", gap: 4 }}>
                    <div style={{ fontSize: 12.5, color: confirmationState.tone.color, fontWeight: 700 }}>状态：{confirmationState.label}</div>
                    {confirmationState.result && <div style={{ fontSize: 12.5, color: C.text0, fontWeight: 600 }}>判断结果：{confirmationState.result}</div>}
                  </div>
                  {item.executionResult.meta && <div style={{ fontSize: 12, color: C.text2, marginBottom: 8 }}>{item.executionResult.meta}</div>}
                  <div style={{ fontSize: 12, color: C.text2, marginBottom: 8, fontWeight: 600 }}>候选判断（待确认）</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {item.executionResult.bullets.map((entry) => (
                      <button
                        key={entry}
                        onClick={() => {
                          setSelectedPredictionOptions((prev) => ({ ...prev, [item.id]: entry }));
                          setPredictionOtherOpen((prev) => ({ ...prev, [item.id]: false }));
                        }}
                        style={{
                          padding: "7px 12px",
                          borderRadius: 999,
                          border: `1px solid ${selectedPredictionOptions[item.id] === entry ? C.greenBorder : C.border}`,
                          background: selectedPredictionOptions[item.id] === entry ? C.greenLight : C.surface,
                          color: selectedPredictionOptions[item.id] === entry ? C.green : C.text1,
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {selectedPredictionOptions[item.id] === entry ? "✔ " : "  "}
                        {entry}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedPredictionOptions((prev) => ({ ...prev, [item.id]: "仍不明确" }));
                        setPredictionOtherOpen((prev) => ({ ...prev, [item.id]: false }));
                      }}
                      style={{
                        padding: "7px 12px",
                        borderRadius: 999,
                        border: `1px solid ${selectedPredictionOptions[item.id] === "仍不明确" ? C.greenBorder : C.border}`,
                        background: selectedPredictionOptions[item.id] === "仍不明确" ? C.greenLight : C.surface,
                        color: selectedPredictionOptions[item.id] === "仍不明确" ? C.green : C.text1,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {selectedPredictionOptions[item.id] === "仍不明确" ? "✔ " : "  "}
                      仍不明确
                    </button>
                    <button
                      onClick={() => {
                        setPredictionOtherOpen((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                        setSelectedPredictionOptions((prev) => ({ ...prev, [item.id]: "__other__" }));
                      }}
                      style={{
                        padding: "7px 12px",
                        borderRadius: 999,
                        border: `1px solid ${predictionOtherOpen[item.id] ? C.greenBorder : C.border}`,
                        background: predictionOtherOpen[item.id] ? C.greenLight : C.surface,
                        color: predictionOtherOpen[item.id] ? C.green : C.text1,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {selectedPredictionOptions[item.id] === "__other__" ? "✔ " : "  "}
                      其他
                    </button>
                  </div>
                  {predictionOtherOpen[item.id] && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 12, color: C.text2, marginBottom: 8, fontWeight: 600 }}>实际执行结果</div>
                    <textarea
                      value={actualResultDrafts[item.id] ?? ""}
                      onChange={(event) => setActualResultDrafts((prev) => ({ ...prev, [item.id]: event.target.value }))}
                      placeholder="输入本次实际执行结果，例如客户真实反馈、沟通方式、是否已确认下一步。"
                      style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 8, background: C.surfaceAlt, color: C.text0, fontSize: 13, padding: "10px 12px", resize: "vertical", minHeight: 84, outline: "none", fontFamily: "inherit" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginTop: 10 }}>
                      <PrimaryBtn
                        onClick={() => {
                          const value = (actualResultDrafts[item.id] ?? "").trim();
                          if (!value) return;
                          setSubmittedActualResults((prev) => ({ ...prev, [item.id]: value }));
                        }}
                        style={{ padding: "8px 14px", fontSize: 12.5 }}
                      >
                        提交
                      </PrimaryBtn>
                      {submittedActualResults[item.id] && (
                        <div style={{ flex: 1, minWidth: 220, background: C.blueLight, border: `1px solid ${C.blueBorder}`, borderRadius: 8, padding: "9px 12px" }}>
                          <div style={{ fontSize: 11, color: C.blue, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>已提交的实际执行结果</div>
                          <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{submittedActualResults[item.id]}</div>
                        </div>
                      )}
                    </div>
                  </div>}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <SecondaryBtn style={{ padding: "5px 10px", fontSize: 12 }}>备注</SecondaryBtn>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
