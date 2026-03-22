import { useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { customer } from "../app/data";
import { C } from "../app/theme";
import type { ActionCard, WorkspacePageProps } from "../app/types";
import { AgentBlock, Card, CardPad, ConfidenceBar, DecisionTensionCard, GhostBtn, Header, PrimaryBtn, PriorityCard, Row, SecondaryBtn, SectionTitle, Tag, DangerBtn, getPriorityTone } from "../app/ui";
import { getActionRecommendationItems } from "../data/actionRecommendationMock";
import ActionRecommendationList from "../components/recommendation/ActionRecommendationList";

function FeedbackWidget({ confidence }: { confidence: number }) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [showToast, setShowToast] = useState(false);
  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, position: "relative" }}>
      <button onClick={() => handleFeedback("up")} style={{ border: `1px solid ${feedback === "up" ? C.green : C.border}`, background: feedback === "up" ? C.greenLight : C.surface, borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: feedback === "up" ? C.green : C.text2, transition: "all 0.15s" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
      </button>
      <button onClick={() => handleFeedback("down")} style={{ border: `1px solid ${feedback === "down" ? C.red : C.border}`, background: feedback === "down" ? "#FEF2F2" : C.surface, borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: feedback === "down" ? C.red : C.text2, transition: "all 0.15s" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <svg width="36" height="36" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle cx="18" cy="18" r="16" fill="none" stroke={C.border} strokeWidth="2" />
            <circle cx="18" cy="18" r="16" fill="none" stroke={C.green} strokeWidth="2" strokeDasharray={`${confidence * 1.005} 100`} strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.green }}>{confidence}%</span>
        </div>
      </div>
      {showToast && <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", background: C.text0, color: "#fff", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>已收到反馈</div>}
    </div>
  );
}

function TraitInsightTabs({
  impact,
  modelImplication,
  evidenceSummary,
}: {
  impact: string;
  modelImplication: readonly string[];
  evidenceSummary: readonly string[];
}) {
  const [activeTab, setActiveTab] = useState<"impact" | "model" | "evidence">("impact");
  const tabs = [
    { id: "impact" as const, label: "对当前判断的影响" },
    { id: "model" as const, label: "对 customer model 的含义" },
    { id: "evidence" as const, label: "证据来源" },
  ];

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", background: C.surfaceAlt, padding: 4, borderBottom: `1px solid ${C.border}`, gap: 3, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "6px 11px",
              borderRadius: 7,
              border: `1px solid ${activeTab === tab.id ? C.border : "transparent"}`,
              background: activeTab === tab.id ? C.surface : "transparent",
              color: activeTab === tab.id ? C.blue : C.text2,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ background: C.surface, padding: "12px 14px" }}>
        {activeTab === "impact" && (
          <div>
            <div style={{ fontSize: 12, color: C.text2, marginBottom: 6, fontWeight: 600, letterSpacing: 0.2, textTransform: "uppercase" }}>对当前判断的影响</div>
            <div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{impact}</div>
          </div>
        )}
        {activeTab === "model" && (
          <div>
            <div style={{ fontSize: 12, color: C.text2, marginBottom: 6, fontWeight: 600, letterSpacing: 0.2, textTransform: "uppercase" }}>对 customer model 的含义</div>
            <div style={{ display: "grid", gap: 6 }}>
              {modelImplication.map((item) => (
                <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: C.text3, fontWeight: 700, fontSize: 13, lineHeight: 1.7 }}>•</span>
                  <span style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "evidence" && (
          <div>
            <div style={{ fontSize: 12, color: C.text2, marginBottom: 6, fontWeight: 600, letterSpacing: 0.2, textTransform: "uppercase" }}>证据来源</div>
            <div style={{ display: "grid", gap: 6 }}>
              {evidenceSummary.map((item) => (
                <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: C.text3, fontWeight: 700, fontSize: 13, lineHeight: 1.7 }}>•</span>
                  <span style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ValidationItemTabs({
  gapLabel,
  gap,
  judgmentImpact,
  actionImpact,
  verificationMethod,
}: {
  gapLabel: string;
  gap: string;
  judgmentImpact: string;
  actionImpact: string;
  verificationMethod: string;
}) {
  const [activeTab, setActiveTab] = useState<"gap" | "judgment" | "action" | "verification">("gap");
  const tabs = [
    { id: "gap" as const, label: gapLabel },
    { id: "judgment" as const, label: "影响判断" },
    { id: "action" as const, label: "对动作的影响" },
    { id: "verification" as const, label: "建议补证方式" },
  ];

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", background: C.surfaceAlt, padding: 4, borderBottom: `1px solid ${C.border}`, gap: 3, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "6px 11px",
              borderRadius: 7,
              border: `1px solid ${activeTab === tab.id ? C.border : "transparent"}`,
              background: activeTab === tab.id ? C.surface : "transparent",
              color: activeTab === tab.id ? C.blue : C.text2,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ background: C.surface, padding: "12px 14px" }}>
        {activeTab === "gap" && (
          <div>
            <div style={{ fontSize: 12, color: C.text2, marginBottom: 6, fontWeight: 600, letterSpacing: 0.2, textTransform: "uppercase" }}>{gapLabel}</div>
            <div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{gap}</div>
          </div>
        )}
        {activeTab === "judgment" && (
          <div>
            <div style={{ fontSize: 12, color: C.text2, marginBottom: 6, fontWeight: 600, letterSpacing: 0.2, textTransform: "uppercase" }}>影响判断</div>
            <div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{judgmentImpact}</div>
          </div>
        )}
        {activeTab === "action" && (
          <div>
            <div style={{ fontSize: 12, color: C.text2, marginBottom: 6, fontWeight: 600, letterSpacing: 0.2, textTransform: "uppercase" }}>对动作的影响</div>
            <div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{actionImpact}</div>
          </div>
        )}
        {activeTab === "verification" && (
          <div>
            <div style={{ fontSize: 12, color: C.text2, marginBottom: 6, fontWeight: 600, letterSpacing: 0.2, textTransform: "uppercase" }}>建议补证方式</div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: C.text3, fontWeight: 700, fontSize: 13, lineHeight: 1.7 }}>•</span>
              <span style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{verificationMethod}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionCardItem({
  item,
}: {
  item: ActionCard;
}) {
  const [expanded, setExpanded] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setExpanded((prev) => !prev)} style={{ width: "100%", background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: expanded ? 0 : 0 }}>
          <PriorityCard priority={item.priority} title={item.title} style={{ paddingRight: 80, wordBreak: "break-word", whiteSpace: "normal", borderRadius: expanded ? 12 : "12px 12px 0 0" }} />
          {!expanded && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 14px", background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: "0 0 12px 12px" }}>
              <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>行动依据</span>
              <span style={{ fontSize: 16, color: C.green }}>▾</span>
            </div>
          )}
        </div>
      </button>
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <FeedbackWidget confidence={item.confidence} />
      </div>
      {expanded && (
        <div style={{ margin: 0, borderTop: `1px solid ${C.greenBorder}`, borderRadius: "0 0 12px 12px", background: "#F3FBF5", padding: "12px 16px 16px", display: "grid", gap: 10 }}>
          {!!item.explanation_summary?.length && (
            <div>
              <div style={{ fontSize: 13, color: C.green, marginBottom: 8, fontWeight: 600 }}>行动依据</div>
              <div style={{ display: "grid", gap: 6 }}>
                {item.explanation_summary.slice(0, 3).map((entry) => (
                  <div key={entry} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: C.text2, fontWeight: 700 }}>•</span>
                    <span style={{ fontSize: 13, color: C.text1, lineHeight: 1.65 }}>{entry}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!!item.evidence_refs?.length && (
            <div>
              <SecondaryBtn onClick={() => setEvidenceOpen((prev) => !prev)} style={{ padding: "8px 14px", fontSize: 12.5 }}>
                {evidenceOpen ? "收起证据" : "查看证据"}
              </SecondaryBtn>
              {evidenceOpen && (
                    <div style={{ marginTop: 10, borderTop: `1px solid ${C.greenBorder}`, paddingTop: 10, display: "grid", gap: 8 }}>
                  {item.evidence_refs.map((ref) => (
                    <div key={`${ref.type}-${ref.title}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <Tag label={ref.type} variant="neutral" small />
                        <span style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{ref.title}</span>
                      </div>
                      {ref.timestamp && <span style={{ fontSize: 12, color: C.text2, whiteSpace: "nowrap" }}>{ref.timestamp}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type DecisionEntryItem = {
  id: string;
  type: "action" | "decision";
  label: string;
  title: string;
  summary: string;
  basedOn: string[];
  confidence: number;
  impact: string[];
  risk: string[];
  decisionPrompt: string;
  decisionOptions: string[];
  executionStatus: string;
  executionMeta?: string;
  executionResult: string[];
  statusChange?: string;
};

function TaskFeedbackRow({
  title,
  summary,
  confidence,
  feedbackAccent,
  last = false,
  action,
  expanded = false,
  onToggle,
}: {
  title: string;
  summary: string;
  confidence: number;
  feedbackAccent: string;
  last?: boolean;
  action?: ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  return (
    <Row
      last={last}
      style={{
        alignItems: "flex-start",
        padding: "8px 0",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", width: "100%", justifyContent: "space-between", flexWrap: "wrap" }}>
        <button onClick={onToggle} style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1, minWidth: 280, background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
          <span style={{ width: 22, height: 22, borderRadius: 999, border: `1px solid ${expanded ? feedbackAccent : C.borderMd}`, display: "inline-flex", alignItems: "center", justifyContent: "center", color: expanded ? feedbackAccent : C.text3, flexShrink: 0, marginTop: 1, fontSize: 12, fontWeight: 700 }}>
            {expanded ? "−" : "+"}
          </span>
          <div style={{ display: "grid", gap: 4 }}>
            <span style={{ fontSize: 13.5, color: C.text0, lineHeight: 1.65, fontWeight: 600 }}>{title}</span>
            <span style={{ fontSize: 12, color: C.text2, lineHeight: 1.55 }}>{summary}</span>
          </div>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {action}
          <div style={{ color: feedbackAccent }}>
            <FeedbackWidget confidence={confidence} />
          </div>
        </div>
      </div>
    </Row>
  );
}

export default function WorkspacePage({ roleVariant, taskPanelState, setTaskPanelState }: WorkspacePageProps) {
  const [workTab, setWorkTab] = useState<"history" | "assignment">("assignment");
  const [historyOwnerFilter, setHistoryOwnerFilter] = useState<"全部" | "王芳" | "赵晨" | "李明">("全部");
  const [versionTraceExpanded, setVersionTraceExpanded] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const assignmentSectionRef = useRef<HTMLDivElement | null>(null);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [decisionSelections, setDecisionSelections] = useState<Record<string, string>>({});
  const [questionDecisionOtherOpen, setQuestionDecisionOtherOpen] = useState<Record<string, boolean>>({});
  const [otherQuestionDecisionDrafts, setOtherQuestionDecisionDrafts] = useState<Record<string, string>>({});
  const [selectedQuestionPredictions, setSelectedQuestionPredictions] = useState<Record<string, string>>({});
  const [questionPredictionOtherOpen, setQuestionPredictionOtherOpen] = useState<Record<string, boolean>>({});
  const [actualQuestionResultDrafts, setActualQuestionResultDrafts] = useState<Record<string, string>>({});
  const [submittedQuestionResults, setSubmittedQuestionResults] = useState<Record<string, string>>({});
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
            interpretation: "销售视角判断：客户从个人高意向推进到家庭双人决策阶段，配偶已从隐性阻力转为可被触达的关键影响者。当前任务重点不是继续讲参数，而是组织一次面向双人决策的体验场景。",
            candidateUpdates: ["新增关注点：家庭空间与品牌认知联合评估", "更新异议：配偶品牌偏好从推测升级为已确认阻力", "更新决策张力：技术体验满意，但家庭品牌认知尚未收敛"],
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
              {
                id: "sales-action-1",
                type: "action",
                label: "推荐动作",
                title: "家庭体验导向沟通",
                summary: "优先按“家庭体验 + 品牌对比”双线组织本轮沟通，不要直接切报价。",
                basedOn: ["双人决策阶段", "配偶态度松动", "当前仍在认知阶段"],
                confidence: 85,
                impact: ["有助于形成共同决策", "降低价格敏感触发"],
                risk: ["沟通节奏过慢可能延长周期"],
                decisionPrompt: "你要如何推进？",
                decisionOptions: ["立即沟通（体验导向）", "稍后安排", "改为价格沟通", "标记不适用"],
                executionStatus: "已沟通",
                executionMeta: "今天 15:30 · 微信",
                executionResult: ["客户表示愿意带配偶到店", "仍未讨论价格"],
                statusChange: "“单人推进” → “双人共同决策”",
              },
              {
                id: "sales-action-2",
                type: "action",
                label: "推荐动作",
                title: "拆解配偶顾虑",
                summary: "先把配偶顾虑拆成品牌认知、空间体验、预算三个维度，再决定是否需要经理介入。",
                basedOn: ["配偶态度松动但不明确", "决策维度不清晰"],
                confidence: 81,
                impact: ["明确真实决策阻力", "提高沟通针对性"],
                risk: ["过度追问可能引起防御"],
                decisionPrompt: "你要如何处理？",
                decisionOptions: ["主动引导拆解", "等待客户自然表达", "跳过此步骤"],
                executionStatus: "已执行",
                executionResult: ["主要顾虑：空间体验 + 品牌认知", "预算未明确"],
                statusChange: "“模糊顾虑” → “结构化顾虑”",
              },
              {
                id: "sales-action-3",
                type: "action",
                label: "推荐动作",
                title: "推进周末到店体验",
                summary: "如果客户能确认周末档期，下一步可同步准备家庭场景试驾路线与服务承诺材料。",
                basedOn: ["已有初步兴趣", "存在家庭参与意愿"],
                confidence: 78,
                impact: ["提升成交概率", "加快决策节奏"],
                risk: ["若体验准备不足可能反效果"],
                decisionPrompt: "你要如何推进？",
                decisionOptions: ["立即确认时间", "先发送资料再确认", "暂不推进"],
                executionStatus: "已确认",
                executionResult: ["周六下午到店", "需要家庭场景体验准备"],
                statusChange: "“意向” → “到店预约”",
              },
            ],
            blockedItems: ["仍不得直接联系配偶本人", "折扣承诺与金融方案口径不能先于审批给出", "售后响应时效不能口头扩大承诺"],
            currentUnderstanding: "当前任务已从单人高意向跟进切换为双人共同决策推动。客户本人在推进，配偶态度出现松动，但是否真正在意品牌形象、空间体验还是保值率，还需要继续收集一手表达。",
            questionsToConfirm: [
              {
                id: "sales-question-1",
                type: "decision",
                label: "关键决策",
                title: "配偶参与方式",
                summary: "配偶愿意参加的是到店体验还是单独看资料？",
                basedOn: ["当前不确定：到店体验 vs 看资料"],
                confidence: 76,
                impact: ["决定推进路径", "影响沟通策略"],
                risk: [],
                decisionPrompt: "你要怎么确认？",
                decisionOptions: ["直接询问客户", "通过试探性话术确认", "暂不确认"],
                executionStatus: "已确认",
                executionResult: ["配偶更倾向到店体验"],
                statusChange: "→ 转为“家庭体验路线”",
              },
              {
                id: "sales-question-2",
                type: "decision",
                label: "关键决策",
                title: "预算是否变化",
                summary: "客户预算上限是否因家庭讨论发生变化？",
                basedOn: ["当前不确定：家庭讨论后是否调整预算"],
                confidence: 71,
                impact: ["决定报价策略", "决定是否引入金融方案"],
                risk: [],
                decisionPrompt: "你要怎么处理？",
                decisionOptions: ["直接询问预算", "通过方案试探", "暂不处理"],
                executionStatus: "未完全确认",
                executionResult: ["未确认明确预算", "客户表达“需要对比”"],
                statusChange: "→ “价格敏感”上升",
              },
              {
                id: "sales-question-3",
                type: "decision",
                label: "关键决策",
                title: "是否存在竞品对比",
                summary: "这次补充信息里有没有明确提到竞品品牌？",
                basedOn: ["当前不确定：是否在对比其他品牌"],
                confidence: 68,
                impact: ["决定是否进入“对比话术”", "决定竞争策略"],
                risk: [],
                decisionPrompt: "你要怎么确认？",
                decisionOptions: ["直接询问竞品", "通过引导话术探测", "不主动触碰"],
                executionStatus: "已确认",
                executionResult: ["已确认竞品：XXX 品牌"],
                statusChange: "→ 引入“品牌对比 + 差异化”",
              },
            ],
          },
          submittedHistoryEvent: { id: "E-042", type: "SALES_VISIT", typeLabel: "销售拜访", owner: customer.currentOwner, date: "今天", summary: "已提交本轮家庭体验邀约整理结果：确认客户愿意继续推进配偶共同体验，并补充了品牌对比、家庭空间体验与预算边界相关一线信息。", status: "已提交" },
        }
      : {
          currentTask: { ...customer.currentTask, title: "推进客户服务回访与家庭体验协同确认", why: "当前仍处于双人决策阶段，但客服更适合承接服务说明、回访跟进和体验协同确认，帮助销售继续推进。", recommendedAction: "本周内由客服确认客户对服务承诺、家庭体验安排和后续响应方式的接受度，并把结果同步销售 owner。", blockedActions: ["不得直接联系配偶本人", "不得承诺折扣与金融口径", "不得替销售直接推进成交结论"], agentDraft: "「刘总，这边想先跟您确认一下家庭体验安排和售后服务说明，我们会把确认结果同步给销售同事，一起把后续安排衔接好。」" },
          reviewPacket: {
            rawSummary: "本次执行共补充 2 份服务侧材料，核心聚焦在家庭体验安排确认、服务承诺说明和回访节奏是否合适。",
            interpretation: "客服视角判断：当前不宜主动推进成交，而应通过服务承诺说明与体验安排确认稳定关系温度，为销售后续承接提供清晰反馈。",
            candidateUpdates: ["新增关注点：客户对服务说明与体验衔接方式的接受度", "更新协同建议：客服适合补充服务承诺说明并回传反馈", "更新决策张力：家庭决策仍未完全收敛，需先稳住关系温度"],
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
              {
                id: "cs-action-1",
                type: "action",
                label: "推荐动作",
                title: "确认回访渠道并安排服务说明",
                summary: "先确认客户更适合微信回访还是电话沟通，再安排服务说明发送节奏。",
                basedOn: ["客户触达方式尚未明确", "需要控制服务说明节奏"],
                confidence: 85,
                impact: ["提升回访接受度", "避免无效打扰"],
                risk: ["触达方式判断错误会降低响应率"],
                decisionPrompt: "你要如何推进？",
                decisionOptions: ["立即微信确认", "先电话确认", "稍后安排"],
                executionStatus: "已沟通",
                executionMeta: "今天 15:10 · 微信",
                executionResult: ["客户接受微信沟通", "服务说明待晚间发送"],
                statusChange: "“待触达” → “已建立服务沟通通道”",
              },
              {
                id: "cs-action-2",
                type: "action",
                label: "推荐动作",
                title: "围绕三点收集反馈",
                summary: "围绕家庭体验安排、服务承诺说明和响应方式三点收集反馈，不要直接进入成交推动。",
                basedOn: ["当前目标是稳住关系温度", "客服不适合越权推进成交"],
                confidence: 81,
                impact: ["补齐服务侧信息", "稳定客户感受"],
                risk: ["问题过散会削弱回访效率"],
                decisionPrompt: "你要如何处理？",
                decisionOptions: ["按三点结构回访", "先聚焦服务承诺", "跳过本轮收集"],
                executionStatus: "已执行",
                executionResult: ["客户关注服务承诺说明", "家庭体验安排可继续沟通"],
                statusChange: "“泛化反馈” → “结构化服务反馈”",
              },
              {
                id: "cs-action-3",
                type: "action",
                label: "推荐动作",
                title: "同步结果给销售 owner",
                summary: "确认结果后同步给销售 owner，由销售决定是否继续推进家庭到店体验。",
                basedOn: ["客服回访结果已形成", "下一步推进权在销售 owner"],
                confidence: 78,
                impact: ["保持职责边界清晰", "加快销售承接"],
                risk: ["同步不及时会耽误到店推进"],
                decisionPrompt: "你要如何推进？",
                decisionOptions: ["立即同步", "整理后同步", "暂不同步"],
                executionStatus: "已同步",
                executionResult: ["销售 owner 已收到结果", "等待销售决定是否推进家庭到店体验"],
                statusChange: "“客服单线回访” → “销售承接协同”",
              },
            ],
            blockedItems: ["仍不得直接联系配偶本人", "不得承诺折扣与金融政策", "不得替销售 owner 输出成交判断"],
            currentUnderstanding: "当前客服版本的任务重点是稳住关系温度，并通过服务说明和体验协同确认帮助销售继续推进，而不是直接承担成交推进职责。",
            questionsToConfirm: [
              {
                id: "cs-question-1",
                type: "decision",
                label: "关键决策",
                title: "客户更接受哪种回访方式",
                summary: "客户更接受微信回访还是电话沟通？",
                basedOn: ["当前不确定：微信回访 vs 电话沟通"],
                confidence: 76,
                impact: ["决定回访路径", "影响响应效率"],
                risk: [],
                decisionPrompt: "你要怎么确认？",
                decisionOptions: ["直接询问客户", "先发微信试探", "暂不确认"],
                executionStatus: "已确认",
                executionResult: ["客户更接受微信回访"],
                statusChange: "→ 后续优先走微信回访",
              },
              {
                id: "cs-question-2",
                type: "decision",
                label: "关键决策",
                title: "是否先发服务承诺说明",
                summary: "客户是否希望先收到服务承诺说明再确认家庭体验？",
                basedOn: ["当前不确定：是否先接收材料再推进体验"],
                confidence: 71,
                impact: ["决定服务材料发送顺序", "影响家庭体验确认节奏"],
                risk: [],
                decisionPrompt: "你要怎么处理？",
                decisionOptions: ["直接询问偏好", "先发送摘要试探", "暂不处理"],
                executionStatus: "已确认",
                executionResult: ["客户希望先收到服务承诺说明"],
                statusChange: "→ 先发说明，再确认家庭体验",
              },
              {
                id: "cs-question-3",
                type: "decision",
                label: "关键决策",
                title: "是否当天同步给销售 owner",
                summary: "客服回访结果是否需要当天同步给销售 owner？",
                basedOn: ["当前不确定：同步时效是否影响销售承接"],
                confidence: 68,
                impact: ["决定协同效率", "影响销售是否及时推进"],
                risk: [],
                decisionPrompt: "你要怎么确认？",
                decisionOptions: ["当天同步", "次日整理后同步", "由系统自动同步"],
                executionStatus: "已确认",
                executionResult: ["建议当天同步给销售 owner"],
                statusChange: "→ 协同节奏前置",
              },
            ],
          },
          submittedHistoryEvent: { id: "E-042", type: "CS_OUTREACH", typeLabel: "客服回访", owner: "李明", date: "今天", summary: "已提交本轮服务回访与家庭体验协同确认结果：确认客户愿意先接收服务说明，并等待销售继续承接家庭体验安排。", status: "已提交" },
        } as const;
  const { currentTask, reviewPacket, processingSteps, liveWorkspace, submittedHistoryEvent } = workspaceTaskContent;
  const historyEvents = (taskPanelState === "无任务" ? [submittedHistoryEvent, ...customer.events] : customer.events).filter((event) => historyOwnerFilter === "全部" || event.owner === historyOwnerFilter);
  const historyOwnerOptions = ["全部", "王芳", "赵晨", "李明"] as const;
  const latestStateVersion = customer.stateVersions[0];
  const latestVersionNewItems =
    roleVariant === "sales"
      ? [
          "新增优先关注项：家庭体验邀约需围绕“品牌对比 + 家庭空间体验”组织，不再直接推进价格沟通。",
          "新增决策结构判断：从销售 owner 单点推进，切换为面向夫妻双人决策的协同推进。",
          "新增异议确认：配偶品牌偏好由推测升级为已确认阻力，需要进入主版本摘要。",
        ]
      : [
          "新增服务协同项：客服补充服务承诺说明与回访节奏，帮助销售承接后续家庭体验安排。",
          "新增关系温度判断：当前优先稳住客户感受与服务信任，而不是由客服直接推进成交。",
          "新增回传要求：本轮服务回访结果需同步销售 owner，作为是否继续推进双人到店体验的依据。",
        ];
  const openAssignmentSection = () => {
    setWorkTab("assignment");
    requestAnimationFrame(() => {
      assignmentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const uploadMaterials = () => {
    const incoming = selectedFiles.length > 0 ? selectedFiles.map((name, index) => ({ name, type: name.endsWith(".jpg") || name.endsWith(".png") ? "照片" : "语音", time: `今天 14:${28 + index}` })) : [{ name: `门店补充跟进记录_${uploadedMaterials.length + 1}.wav`, type: "语音", time: "今天 14:30" }];
    setUploadedMaterials((prev) => [...prev, ...incoming]);
    setSelectedFiles([]);
    setDraftSaved(false);
  };
  const saveDraft = () => {
    if (selectedFiles.length > 0) uploadMaterials();
    setDraftSaved(true);
  };
  const resumeSupplement = () => setDraftSaved(false);
  const generateRoundReport = () => {
    if (selectedFiles.length > 0) uploadMaterials();
    setDraftSaved(true);
    setTaskPanelState("整理中");
  };
  const orderedQuestionsToConfirm = liveWorkspace.questionsToConfirm as DecisionEntryItem[];
  const actionRecommendations = getActionRecommendationItems(roleVariant);
  const detailSectionTitleStyle: CSSProperties = { fontSize: 13, color: C.text3, letterSpacing: 0.4 };
  const purple = { color: "#6D5BD0", bg: "#F3F0FF", border: "#DDD6FE" } as const;
  const setDecisionSelection = (itemId: string, option: string) => {
    setDecisionSelections((prev) => ({ ...prev, [itemId]: option }));
  };
  const getQuestionConfirmationState = (itemId: string) => {
    const selectedDecision = decisionSelections[itemId];
    const selectedPrediction = selectedQuestionPredictions[itemId];
    const submittedActualResult = submittedQuestionResults[itemId];
    if ((selectedPrediction && selectedPrediction !== "__other__") || (selectedPrediction === "__other__" && submittedActualResult)) {
      return {
        label: "已确认",
        result: selectedPrediction === "__other__" ? submittedActualResult ?? "" : selectedPrediction ?? "",
        tone: { color: accentGreen.color, bg: accentGreen.bg, border: accentGreen.border },
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
  };
  const accentGreen = { color: C.green, bg: C.greenLight, border: C.greenBorder };
  const rightColumnPanelStyle: CSSProperties = {
    background: C.surfaceAlt,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    alignSelf: "start",
  };
  const renderTagSection = (title: string, items: readonly string[], variant: "blue" | "neutral" | "amber" = "neutral") => (
    <div>
      <div style={{ fontSize: 13, color: C.text2, marginBottom: 6, fontWeight: 600 }}>{title}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {items.map((item) => (
          <Tag key={`${title}-${item}`} label={item} variant={variant} small />
        ))}
      </div>
    </div>
  );
  const renderDecisionPanel = (item: DecisionEntryItem, accent: { color: string; bg: string; border: string }) => (
    <div style={{ margin: "4px 0 8px 34px", border: `1px solid ${accent.border}`, borderRadius: 12, background: accent.bg, padding: "14px 16px", display: "grid", gap: 14 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <Tag label={item.label} variant={item.type === "action" ? "green" : "amber"} small />
          <Tag label={`置信度 ${item.confidence}%`} variant="neutral" small />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text0, marginBottom: 8 }}>{item.title}</div>
        <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item.summary}</div>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>基于</div>
          <div style={{ display: "grid", gap: 6 }}>
            {item.basedOn.map((entry) => (
              <div key={entry} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: accent.color, fontWeight: 700 }}>•</span>
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
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 11, color: C.text2, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>决策入口</div>
        <div style={{ fontSize: 13, color: C.text0, marginBottom: 10 }}>{item.decisionPrompt}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {item.decisionOptions.map((option) => (
            <button
              key={option}
              onClick={() => setDecisionSelection(item.id, option)}
              style={{
                padding: "7px 12px",
                borderRadius: 999,
                border: `1px solid ${decisionSelections[item.id] === option ? accent.border : C.border}`,
                background: decisionSelections[item.id] === option ? accent.bg : C.surface,
                color: decisionSelections[item.id] === option ? accent.color : C.text1,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {option}
            </button>
          ))}
          <button
            onClick={() => setQuestionDecisionOtherOpen((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
            style={{
              padding: "7px 12px",
              borderRadius: 999,
              border: `1px solid ${questionDecisionOtherOpen[item.id] ? accent.border : C.border}`,
              background: questionDecisionOtherOpen[item.id] ? accent.bg : C.surface,
              color: questionDecisionOtherOpen[item.id] ? accent.color : C.text1,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            其他
          </button>
        </div>
        {questionDecisionOtherOpen[item.id] && <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 10 }}>
          <span style={{ fontSize: 12.5, color: C.text2, fontWeight: 600 }}>其他:</span>
          <input
            value={otherQuestionDecisionDrafts[item.id] ?? ""}
            onChange={(event) => setOtherQuestionDecisionDrafts((prev) => ({ ...prev, [item.id]: event.target.value }))}
            placeholder="输入其他处理方式"
            style={{ flex: "1 1 220px", minWidth: 180, border: `1px solid ${C.border}`, borderRadius: 999, background: C.surfaceAlt, color: C.text0, fontSize: 12.5, padding: "8px 12px", outline: "none" }}
          />
          <PrimaryBtn
            onClick={() => {
              const value = (otherQuestionDecisionDrafts[item.id] ?? "").trim();
              if (!value) return;
              setDecisionSelection(item.id, `其他：${value}`);
            }}
            style={{ padding: "8px 14px", fontSize: 12.5 }}
          >
            确定
          </PrimaryBtn>
        </div>}
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 11, color: C.text2, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>执行结果</div>
        {item.executionMeta && <div style={{ fontSize: 12, color: C.text2, marginBottom: 8 }}>{item.executionMeta}</div>}
        <div style={{ fontSize: 12, color: C.text2, marginBottom: 8, fontWeight: 600 }}>候选判断（待确认）</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {item.executionResult.map((entry) => (
            <button
              key={entry}
              onClick={() => {
                setSelectedQuestionPredictions((prev) => ({ ...prev, [item.id]: entry }));
                setQuestionPredictionOtherOpen((prev) => ({ ...prev, [item.id]: false }));
              }}
              style={{
                padding: "7px 12px",
                borderRadius: 999,
                border: `1px solid ${selectedQuestionPredictions[item.id] === entry ? accent.border : C.border}`,
                background: selectedQuestionPredictions[item.id] === entry ? accent.bg : C.surface,
                color: selectedQuestionPredictions[item.id] === entry ? accent.color : C.text1,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {selectedQuestionPredictions[item.id] === entry ? "✔ " : "  "}
              {entry}
            </button>
          ))}
          <button
            onClick={() => {
              setSelectedQuestionPredictions((prev) => ({ ...prev, [item.id]: "仍不明确" }));
              setQuestionPredictionOtherOpen((prev) => ({ ...prev, [item.id]: false }));
            }}
            style={{
              padding: "7px 12px",
              borderRadius: 999,
              border: `1px solid ${selectedQuestionPredictions[item.id] === "仍不明确" ? accent.border : C.border}`,
              background: selectedQuestionPredictions[item.id] === "仍不明确" ? accent.bg : C.surface,
              color: selectedQuestionPredictions[item.id] === "仍不明确" ? accent.color : C.text1,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {selectedQuestionPredictions[item.id] === "仍不明确" ? "✔ " : "  "}
            仍不明确
          </button>
          <button
            onClick={() => {
              setQuestionPredictionOtherOpen((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
              setSelectedQuestionPredictions((prev) => ({ ...prev, [item.id]: "__other__" }));
            }}
            style={{
              padding: "7px 12px",
              borderRadius: 999,
              border: `1px solid ${questionPredictionOtherOpen[item.id] ? accent.border : C.border}`,
              background: questionPredictionOtherOpen[item.id] ? accent.bg : C.surface,
              color: questionPredictionOtherOpen[item.id] ? accent.color : C.text1,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {selectedQuestionPredictions[item.id] === "__other__" ? "✔ " : "  "}
            其他
          </button>
        </div>
        {questionPredictionOtherOpen[item.id] && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, color: C.text2, marginBottom: 8, fontWeight: 600 }}>实际执行结果</div>
          <textarea
            value={actualQuestionResultDrafts[item.id] ?? ""}
            onChange={(event) => setActualQuestionResultDrafts((prev) => ({ ...prev, [item.id]: event.target.value }))}
            placeholder="输入本次实际执行结果，例如客户真实回答、是否已确认、下一步如何处理。"
            style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 8, background: C.surfaceAlt, color: C.text0, fontSize: 13, padding: "10px 12px", resize: "vertical", minHeight: 84, outline: "none", fontFamily: C.sans }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginTop: 10 }}>
            <PrimaryBtn
              onClick={() => {
                const value = (actualQuestionResultDrafts[item.id] ?? "").trim();
                if (!value) return;
                setSubmittedQuestionResults((prev) => ({ ...prev, [item.id]: value }));
              }}
              style={{ padding: "8px 14px", fontSize: 12.5 }}
            >
              提交
            </PrimaryBtn>
            {submittedQuestionResults[item.id] && (
              <div style={{ flex: 1, minWidth: 220, background: C.blueLight, border: `1px solid ${C.blueBorder}`, borderRadius: 8, padding: "9px 12px" }}>
                <div style={{ fontSize: 11, color: C.blue, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>已提交的实际执行结果</div>
                <div style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{submittedQuestionResults[item.id]}</div>
              </div>
            )}
          </div>
        </div>}
        {(() => {
          const confirmationState = getQuestionConfirmationState(item.id);
          return (
            <div style={{ background: confirmationState.tone.bg, border: `1px solid ${confirmationState.tone.border}`, borderRadius: 10, padding: "10px 12px", marginTop: 10, display: "grid", gap: 4 }}>
              <div style={{ fontSize: 12.5, color: confirmationState.tone.color, fontWeight: 700 }}>状态：{confirmationState.label}</div>
              {confirmationState.result && <div style={{ fontSize: 12.5, color: C.text0, fontWeight: 600 }}>判断结果：{confirmationState.result}</div>}
            </div>
          );
        })()}
      </div>
    </div>
  );
  const renderApprovalActions = () => (
    <>
      <PrimaryBtn onClick={() => setTaskPanelState("无任务")}>审批并提交</PrimaryBtn>
      <SecondaryBtn onClick={() => setTaskPanelState("无任务")}>修改后提交</SecondaryBtn>
      <DangerBtn onClick={() => setTaskPanelState("执行中")}>驳回并返回执行中</DangerBtn>
    </>
  );
  const renderGeneratedPanel = ({
    label,
    accent,
    helperLabel,
    background,
    children,
  }: {
    label: string;
    accent: { color: string; bg: string; border: string };
    helperLabel?: string;
    background?: string;
    children: ReactNode;
  }) => (
    <div style={{ border: `1px solid ${accent.border}`, borderRadius: 14, background: background ?? C.surface, padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: helperLabel ? 12 : 0, flexWrap: "wrap" }}>
        <Tag label={label} variant={accent === purple ? "purple" : "blue"} small />
        {helperLabel && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: accent.color, fontSize: 13, fontWeight: 700 }}>
            <span style={{ width: 14, height: 14, borderRadius: 999, background: accent.color, boxShadow: `0 0 0 3px ${accent.bg}` }} />
            <span>{helperLabel}</span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
  const renderLatestVersionSummaryCard = (showApprovalActions = false) => (
    <Card style={{ borderColor: taskPanelState === "确认本轮结果" ? C.amberBorder : C.border }}>
      <CardPad>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
          <div>
            <SectionTitle style={detailSectionTitleStyle}>最新状态版本摘要</SectionTitle>
            <div style={{ fontSize: 12.5, color: C.text2, marginTop: 4 }}>
              在客户状态详情顶部优先展示最新一条状态版本摘要，便于审批时先看本轮变化。
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Tag label={latestStateVersion.version} variant="blue" small />
            <Tag label={latestStateVersion.level} variant={latestStateVersion.level === "重要更新" ? "amber" : "neutral"} small />
            <Tag label={latestStateVersion.date} variant="neutral" small />
          </div>
        </div>
        <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.75, marginBottom: 10 }}>{stateDetail.summary.summaryText}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {latestStateVersion.changed.map((field) => (
              <Tag key={field} label={field} variant="purple" small />
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7 }}>
            触发原因：{latestStateVersion.trigger}，审批人：{latestStateVersion.approvedBy}
          </div>
        </div>
        {taskPanelState === "确认本轮结果" && (
          <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "12px 14px", marginBottom: showApprovalActions ? 14 : 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>基于负责人专属当前任务，本轮新增项目</div>
            <div style={{ display: "grid", gap: 6 }}>
              {latestVersionNewItems.map((item) => (
                <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>+</span>
                  <span style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {!showApprovalActions && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <button onClick={() => setVersionTraceExpanded((prev) => !prev)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, textTransform: "uppercase", letterSpacing: 0.5 }}>状态版本流 / 治理追溯</span>
              <span style={{ fontSize: 13, color: C.blue, fontWeight: 600 }}>{versionTraceExpanded ? "收起" : "展开"}</span>
            </button>
            {versionTraceExpanded && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                {customer.stateVersions.map((version) => (
                  <div key={version.version} style={{ border: `1px solid ${version.level === "重要更新" ? C.amberBorder : C.border}`, borderLeft: `3px solid ${version.level === "重要更新" ? C.amber : C.borderMd}`, borderRadius: 8, padding: "12px 14px", background: C.surfaceAlt }}>
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
                      <span>审批人：<strong style={{ color: C.text1 }}>{version.approvedBy}</strong></span>
                      <span>参与助手：{version.agents.join("、")}</span>
                    </div>
                    {version.note && <div style={{ background: C.surface, borderRadius: 6, padding: "8px 12px", fontSize: 12, color: C.text1 }}>{version.note}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardPad>
    </Card>
  );

  const renderTopAssignmentCard = () => (
    <Card style={{ borderRadius: 16 }}>
      <CardPad style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "stretch", gap: 28, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 520px", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.text0, lineHeight: 1.1 }}>{summary.customerIdentity.name}</div>
              <Tag label={summary.workflow.risk.level} variant="amber" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.text0 }}>{summary.customerIdentity.stage}</span>
              <span style={{ fontSize: 15, color: C.text3 }}>|</span>
              {summary.customerIdentity.profileLine.split("｜").map((item) => (
                <span key={item} style={{ fontSize: 15, fontWeight: 600, color: C.text1 }}>
                  {item}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.65, maxWidth: 680 }}>{summary.stateSummary}</div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", flex: "0 1 auto", marginLeft: "auto" }}>
            <div style={{ minWidth: 210, background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 18, padding: "18px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>当前 owner</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text1, lineHeight: 1.6, marginBottom: 8 }}>
                {summary.assignment.owner.name}（{summary.assignment.owner.role}）
              </div>
              <GhostBtn onClick={openAssignmentSection} style={{ padding: 0, fontSize: 12.5 }}>
                查看责任协同详情
              </GhostBtn>
            </div>
            <div style={{ minWidth: 210, background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 18, padding: "18px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>当前审核</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text1, lineHeight: 1.6 }}>{summary.workflow.reviewStatus}</div>
            </div>
          </div>
        </div>
      </CardPad>
    </Card>
  );

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
            <div style={{ width: "100%" }}><PrimaryBtn style={{ width: "100%" }} onClick={() => setTaskPanelState("执行中")}>开始执行并实时共创</PrimaryBtn></div>
          </div>
        </div>
      );
    }
    if (taskPanelState === "执行中") {
      return (
        <div className="execution-live-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 12, background: "#F5F8FF", border: `1px solid ${C.blueBorder}`, borderRadius: 14, padding: 12 }}>
            <div style={{ background: "#EAF1FF", border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: C.blue, boxShadow: `0 0 0 3px ${C.blueLight}` }} /><span style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>助手实时整理中...</span></div>
              <div style={{ fontSize: 12, color: C.text1 }}>边执行，边整理，边更新理解</div>
            </div>
            <div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "#FCFDFE", border: `1px solid ${C.redBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>实时更新的受限事项</div>
                {liveWorkspace.blockedItems.map((item, index) => <Row key={item} last={index === liveWorkspace.blockedItems.length - 1} style={{ alignItems: "flex-start", padding: "8px 0" }}><span style={{ color: C.red, fontWeight: 700, fontSize: 14 }}>✕</span><span style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{item}</span></Row>)}
              </div>
              <div style={{ background: "#FCFDFE", border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>当前临时理解</div>
                <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{liveWorkspace.currentUnderstanding}</div>
              </div>
            </div>
            <div>
              <div style={{ background: "#FCFDFE", border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>待确认问题</div>
                {orderedQuestionsToConfirm.map((item, index) => {
                  const expanded = openQuestionId === item.id;
                  return (
                    <div key={item.id}>
                      <TaskFeedbackRow
                        title={item.summary}
                        summary={`${item.label} · 点击展开查看决策入口与执行结果`}
                        last={index === orderedQuestionsToConfirm.length - 1 && !expanded}
                        confidence={item.confidence}
                        feedbackAccent={C.amber}
                        action={<SecondaryBtn style={{ padding: "5px 10px", fontSize: 12 }}>备注</SecondaryBtn>}
                        expanded={expanded}
                        onToggle={() => setOpenQuestionId((prev) => (prev === item.id ? null : item.id))}
                      />
                      {expanded && renderDecisionPanel(item, { color: C.amber, bg: "#FFF9EC", border: C.amberBorder })}
                    </div>
                  );
                })}
              </div>
            </div>
            <ActionRecommendationList items={actionRecommendations} />
          </div>
          <div style={{ display: "grid", gap: 12, alignSelf: "start", height: "fit-content" }}>
            <div style={rightColumnPanelStyle}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>文本输入区</div>
              <div style={{ fontSize: 12.5, color: C.text1, marginBottom: 10 }}>输入客户第一手信息 / 访谈记录</div>
              <textarea value={executionInput} onChange={(e) => { setExecutionInput(e.target.value); setDraftSaved(false); }} placeholder="记录客户原话、现场观察、配偶反馈、销售自己的即时判断……" style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 8, background: C.surface, color: C.text0, fontSize: 13, padding: "10px 12px", resize: "vertical", minHeight: 120, outline: "none", fontFamily: C.sans }} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}><PrimaryBtn onClick={saveDraft}>提交</PrimaryBtn><SecondaryBtn onClick={() => setInputModalOpen(true)}>语音输入</SecondaryBtn></div>
            </div>
            <div style={rightColumnPanelStyle}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>语音上传 / 转写入口</div>
              <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65, marginBottom: 10 }}>支持上传门店录音、现场纪要，转写后会继续回流到左侧理解区。</div>
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px dashed ${C.borderMd}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: C.text1, background: C.surface, cursor: "pointer" }}>
                <span>上传语音或转写文件</span><span style={{ color: C.blue, fontWeight: 600 }}>选择文件</span>
                <input type="file" multiple style={{ display: "none" }} onChange={(e) => { setSelectedFiles(Array.from(e.target.files ?? []).map((file) => file.name)); setDraftSaved(false); }} />
              </label>
            </div>
            <div style={rightColumnPanelStyle}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>图片 / 文件上传入口</div>
              <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65, marginBottom: 10 }}>上传访谈截图、手写记录、图片或其他文件，助手会继续归并进当前理解。</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}><SecondaryBtn onClick={uploadMaterials}>上传到材料列表</SecondaryBtn>{selectedFiles.length > 0 && <Tag label={`待上传 ${selectedFiles.length} 项`} variant="blue" small />}</div>
            </div>
            <div style={rightColumnPanelStyle}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>已上传材料列表</div>
              <div style={{ display: "grid", gap: 2 }}>{uploadedMaterials.map((item, index) => <Row key={`${item.name}-${index}`} last={index === uploadedMaterials.length - 1}><Tag label={item.type} variant={item.type === "照片" ? "blue" : "neutral"} small /><span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item.name}</span><span style={{ fontSize: 11.5, color: C.text2 }}>{item.time}</span></Row>)}</div>
            </div>
          </div>
        </div>
      );
    }
    if (taskPanelState === "整理中") {
      return <div style={{ display: "grid", gap: 14 }}><div style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 6 }}>助手正在汇总本轮完整报告...</div><div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.6, marginBottom: 10 }}>这一阶段只是在收束本轮结果，不是重新等待上传。已收集的执行材料会继续被合并成候选结论与报告草稿。</div>{processingSteps.map((step, index) => <div key={step.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: index === processingSteps.length - 1 ? "8px 0 0" : "8px 0", borderBottom: index === processingSteps.length - 1 ? "none" : `1px solid ${C.blueBorder}` }}><span style={{ fontSize: 13, color: C.text0 }}>{step.label}</span><Tag label={step.status} variant={step.status === "已完成" ? "green" : step.status === "进行中" ? "blue" : "neutral"} small /></div>)}</div></div>;
    }
    if (taskPanelState === "确认本轮结果") {
      return (
        <div style={{ display: "grid", gap: 14 }}>
          {renderGeneratedPanel({
            label: roleVariant === "sales" ? "销售智能体生成" : "客服智能体生成",
            accent: { color: C.blue, bg: C.blueLight, border: C.blueBorder },
            background: "linear-gradient(180deg, #D4DCFF 0%, rgba(244, 246, 255, 0) 50%)",
            children: (
              <Card style={{ width: "100%" }}>
                <CardPad>
                  <div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>原始材料摘要</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{reviewPacket.rawSummary}</div></div>
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>推荐版本</div><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Tag label={reviewPacket.versionRecommendation} variant={reviewPacket.versionRecommendation === "主要版本" ? "amber" : "neutral"} /></div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65 }}>{reviewPacket.versionReason}</div></div>
                  </div>
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginTop: 14 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{roleVariant === "sales" ? "销售视角解读" : "客服视角解读"}</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{reviewPacket.interpretation}</div></div>
                  <div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14, marginTop: 14 }}>
                    <div style={{ background: C.surface, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>候选状态更新</div>{reviewPacket.candidateUpdates.map((item) => <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 10px", background: C.greenLight, borderRadius: 7, marginBottom: 6, border: `1px solid ${C.greenBorder}` }}><span style={{ color: C.green, fontWeight: 700 }}>+</span><span style={{ fontSize: 13, color: C.text0 }}>{item}</span></div>)}</div>
                    <div style={{ display: "grid", gap: 14 }}>
                      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>置信度</div><ConfidenceBar value={reviewPacket.confidence} /></div>
                      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>未决问题</div>{reviewPacket.unresolvedQuestions.map((item, index) => <Row key={item} last={index === reviewPacket.unresolvedQuestions.length - 1}><span style={{ color: C.red, fontWeight: 700 }}>?</span><span style={{ fontSize: 13, color: C.text0 }}>{item}</span></Row>)}</div>
                    </div>
                  </div>
                  <div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.border}`, marginTop: 14 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>本角色建议动作</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{reviewPacket.roleRecommendation}</div></div>
                </CardPad>
              </Card>
            ),
          })}
          {renderGeneratedPanel({
            label: "客户状态智能体生成",
            accent: purple,
            background: "linear-gradient(180deg, #E3D5FF 0%, rgba(245, 240, 255, 0) 50%)",
            children: renderLatestVersionSummaryCard(false),
          })}
        </div>
      );
    }
    return <div style={{ display: "grid", gap: 14 }}><div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "14px 16px" }}><div style={{ fontSize: 15, fontWeight: 700, color: C.green, marginBottom: 8 }}>任务已提交</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>本次任务结果已提交，新的事件条目将进入客户触达任务历史。系统接下来会触发状态更新评估，并等待编排助手重新安排下一步动作。</div></div><div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>事件去向</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{roleVariant === "sales" ? "事件已进入任务历史，等待销售与状态编排链路继续处理。" : "事件已进入任务历史，等待客服回访结果同步并交由编排链路继续处理。"}</div></div><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>下一步系统动作</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>等待状态更新结果，随后由编排助手判断是否需要调整 owner、协同角色与下个任务窗口。</div></div></div></div>;
  };

  const renderTaskStateActions = () => {
    if (taskPanelState === "待执行") return null;
    if (taskPanelState === "执行中") return <>{draftSaved ? <SecondaryBtn onClick={resumeSupplement}>继续补充材料</SecondaryBtn> : <SecondaryBtn onClick={saveDraft}>暂存草稿</SecondaryBtn>}<PrimaryBtn onClick={generateRoundReport}>生成本轮完整报告</PrimaryBtn></>;
    if (taskPanelState === "整理中") return <><SecondaryBtn onClick={() => setTaskPanelState("执行中")}>返回继续补充</SecondaryBtn><PrimaryBtn onClick={() => setTaskPanelState("确认本轮结果")}>查看本轮结果</PrimaryBtn></>;
    if (taskPanelState === "确认本轮结果") return renderApprovalActions();
    return <><GhostBtn onClick={() => setWorkTab("history")}>查看任务历史</GhostBtn><GhostBtn onClick={() => setWorkTab("history")}>查看状态更新结果</GhostBtn><PrimaryBtn onClick={() => setTaskPanelState("待执行")}>返回工作台</PrimaryBtn></>;
  };

  return (
    <div>
      <Header page={roleVariant === "sales" ? "workspaceSales" : "workspaceCs"} />
      <div style={{ margin: "24px 0", padding: "0 28px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase", marginBottom: 12 }}>Layer 2 · 顶部摘要层</div>
        <div style={{ marginBottom: 24 }}>
          {renderTopAssignmentCard()}
        </div>
        <div className="top-dual" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 24 }}>
          {taskPanelState !== "无任务" && <Card style={{ background: C.surface, borderColor: "#E8B4B4", borderWidth: 4 }}><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 12 }}><div><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}><div style={{ fontSize: 11, fontWeight: 600, color: C.amber, letterSpacing: 0.8, textTransform: "uppercase" }}>负责人专属当前任务</div><Tag label="仅负责人可见" variant="amber" small /><Tag label={`时间窗口：${currentTask.timeWindow}`} variant="neutral" small /></div><div style={{ fontSize: 12.5, color: C.text2 }}>人机协作任务面板</div></div><Tag label={`当前状态：${taskPanelState}`} variant={taskPanelState === "确认本轮结果" ? "amber" : taskPanelState === "执行中" || taskPanelState === "整理中" ? "blue" : "neutral"} /></div>{renderTaskStateBody()}<div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>{renderTaskStateActions()}</div></CardPad></Card>}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase", marginBottom: 12 }}>Layer 3 · 主体工作层</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, margin: "0 0 24px", padding: "0 28px" }}>
        <div ref={assignmentSectionRef} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase" }}>客户状态详情</div>
          {taskPanelState !== "确认本轮结果" && renderLatestVersionSummaryCard(false)}
          <Card><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><SectionTitle style={detailSectionTitleStyle}>Customer State 摘要</SectionTitle><div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><Tag label={`最新状态版本：${stateDetail.summary.stateVersion}`} variant="blue" small /><Tag label={`更新时间：${stateDetail.summary.updatedAt}`} variant="neutral" small /></div></div><div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}><div style={{ fontSize: 13, color: C.text2, marginBottom: 8, letterSpacing: 0.2 }}>当前摘要</div><div style={{ fontSize: 15, color: C.text0, lineHeight: 1.85, letterSpacing: 0.1 }}>{stateDetail.summary.summaryText}</div></div></CardPad></Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card><CardPad><SectionTitle style={detailSectionTitleStyle}>判断相关特征</SectionTitle><div className="detail-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{stateDetail.decisionRelevantTraits.map((trait, index) => { const priority = (["P0", "P1", "P2", "P3"] as const)[index % 4]; const tone = getPriorityTone(priority); const confidence = [85, 72, 68, 91][index % 4]; return <div key={trait.label} style={{ background: tone.bg, border: `1px solid ${tone.border}`, borderRadius: 12, padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 16, position: "relative" }}><div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flex: 1 }}><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 36, height: 22, padding: "0 8px", border: `1px solid ${tone.border}`, background: tone.tagBg, color: tone.color, fontSize: 11.5, fontWeight: 700, borderRadius: 6, letterSpacing: 0.3 }}>{priority}</span><Tag label={trait.ontologyTypeLabel} variant="neutral" small /><Tag label={trait.stabilityLabel} variant={trait.stabilityLabel === "稳定" ? "green" : trait.stabilityLabel === "易变" ? "amber" : "neutral"} small /></div><FeedbackWidget confidence={confidence} /></div><div style={{ fontSize: 14.5, color: C.text1, fontWeight: 700, lineHeight: 1.5 }}>{trait.label}</div><div style={{ fontSize: 20, color: C.text1, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0.1 }}>{trait.value}</div><TraitInsightTabs impact={trait.impact} modelImplication={trait.modelImplication} evidenceSummary={trait.evidenceSummary} />{renderTagSection("关联到", trait.relations.relatedTo, "blue")}{renderTagSection("影响", trait.relations.impacts, "neutral")}</div>; })}</div></CardPad></Card>
            <Card><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><SectionTitle style={detailSectionTitleStyle}>可行动</SectionTitle><Tag label={`${stateDetail.actionable.length} 条`} variant="green" small /></div><div className="detail-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{stateDetail.actionable.map((item) => <ActionCardItem key={item.id} item={item} />)}</div></CardPad></Card>
            <Card style={{ borderColor: C.amberBorder }}><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}><SectionTitle style={detailSectionTitleStyle}>决策张力结构</SectionTitle><FeedbackWidget confidence={76} /></div><DecisionTensionCard data={stateDetail.tension} showManualControls /></CardPad></Card>
            <Card style={{ gridColumn: "1 / -1" }}><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><SectionTitle style={detailSectionTitleStyle}>关键待验证项</SectionTitle><Tag label={`当前 ${stateDetail.keyValidationItems.length} 项`} variant="amber" small /></div><div className="detail-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{stateDetail.keyValidationItems.map((item, index) => { const normalizedPriority = item.priority === "P1" ? "P0" : "P1"; const stabilityVariant = item.stabilityLabel === "部分验证" ? "amber" : item.stabilityLabel === "待验证" ? "neutral" : "green"; return <div key={item.title} style={{ position: "relative" }}><PriorityCard priority={normalizedPriority} badgeLabel={item.priority} badgeExtras={<Tag label={item.stabilityLabel} variant={stabilityVariant} small />} title={item.title}><div style={{ display: "grid", gap: 10 }}><ValidationItemTabs gapLabel={item.gapLabel} gap={item.gap} judgmentImpact={item.judgmentImpact} actionImpact={item.actionImpact} verificationMethod={item.verificationMethod} />{renderTagSection("关联对象", item.relatedTo, "blue")}</div></PriorityCard><div style={{ position: "absolute", top: 10, right: 10 }}><FeedbackWidget confidence={[70, 65, 80, 75][index % 4]} /></div></div>; })}</div></CardPad></Card>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>事件与版本</div>
          <div style={{ display: "flex", background: C.surfaceAlt, borderRadius: 10, padding: 4, border: `1px solid ${C.border}` }}>{[{ id: "history", label: "客户触达任务历史" }, { id: "assignment", label: "责任协同详情" }].map((item) => <button key={item.id} onClick={() => setWorkTab(item.id as "history" | "assignment")} style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: workTab === item.id ? C.surface : "none", border: workTab === item.id ? `1px solid ${C.border}` : "1px solid transparent", color: workTab === item.id ? C.text0 : C.text2, fontSize: 12.5, fontWeight: workTab === item.id ? 600 : 400, cursor: "pointer", transition: "all 0.15s" }}>{item.label}</button>)}</div>
          {workTab === "history" && <Card><CardPad style={{ paddingBottom: 8 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}><SectionTitle style={detailSectionTitleStyle}>客户触达任务历史</SectionTitle><div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><div style={{ fontSize: 12, color: C.text2 }}>责任人筛选</div><div style={{ display: "flex", background: C.surfaceAlt, borderRadius: 8, padding: 4, border: `1px solid ${C.border}` }}>{historyOwnerOptions.map((owner) => <button key={owner} onClick={() => setHistoryOwnerFilter(owner)} style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: historyOwnerFilter === owner ? C.surface : "transparent", color: historyOwnerFilter === owner ? C.text0 : C.text2, fontSize: 12, fontWeight: historyOwnerFilter === owner ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>{owner}</button>)}</div></div></div>{historyEvents.map((event) => { const typeColor = { SALES_VISIT: C.blue, PRE_SALES: C.amber, CS_OUTREACH: C.green }[event.type]; const typeBg = { SALES_VISIT: C.blueLight, PRE_SALES: C.amberLight, CS_OUTREACH: C.greenLight }[event.type]; return <div key={event.id} style={{ marginBottom: 12 }}><Card style={{ borderLeft: `3px solid ${typeColor}` }}><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ background: typeBg, color: typeColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 5 }}>{event.typeLabel}</span><span style={{ fontSize: 11.5, color: C.text2 }}>{event.id}</span></div><div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ fontSize: 12, color: C.text2 }}>{event.owner}</span><span style={{ fontSize: 11.5, color: C.text3 }}>{event.date}</span></div></div><div style={{ fontSize: 13, color: C.text0, lineHeight: 1.65 }}>{event.summary}</div></CardPad></Card></div>; })}{historyEvents.length === 0 && <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 13, color: C.text2 }}>当前筛选条件下暂无客户触达记录。</div>}</CardPad></Card>}
          {workTab === "assignment" && <Card><CardPad style={{ paddingBottom: 8 }}><div style={{ fontSize: 11, color: C.text2, marginBottom: 4 }}>当前 owner</div><div style={{ fontSize: 18, color: C.text0, fontWeight: 700, marginBottom: 16 }}>{summary.assignment.owner.name}（{summary.assignment.owner.role}）</div><SectionTitle style={detailSectionTitleStyle}>责任协同详情</SectionTitle><div style={{ display: "flex", flexDirection: "column", gap: 10 }}><div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}><div style={{ fontSize: 13, color: C.text1 }}>销售</div><div style={{ fontSize: 14, color: C.text0, fontWeight: 700, textAlign: "right" }}>{summary.assignment.owner.name}</div></div>{summary.assignment.collaborators.map((item) => <div key={item.type} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}><div style={{ fontSize: 13, color: C.text1 }}>{item.role}</div><div style={{ fontSize: 14, color: C.text0, fontWeight: 700, textAlign: "right" }}>{item.name}</div></div>)}<div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}><div style={{ fontSize: 13, color: C.text1 }}>{summary.assignment.supervisor.role}</div><div style={{ fontSize: 14, color: C.text0, fontWeight: 700, textAlign: "right" }}>{summary.assignment.supervisor.name}</div></div></div></CardPad></Card>}
        </div>
      </div>
      {inputModalOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,26,0.28)", zIndex: 130, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}><div style={{ width: 760, maxWidth: "100%", maxHeight: "90vh", overflow: "auto", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }}><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12 }}><div><div style={{ fontSize: 16, fontWeight: 700, color: C.text0, marginBottom: 4 }}>信息输入</div><div style={{ fontSize: 12, color: C.text2 }}>用于录入第一手客户信息并上传执行材料</div></div><SecondaryBtn style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => setInputModalOpen(false)}>关闭</SecondaryBtn></div><div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>输入用户第一手信息</div><textarea value={executionInput} onChange={(e) => setExecutionInput(e.target.value)} placeholder="记录刚刚获取到的客户原话、家庭成员反馈、现场观察等……" style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 8, background: C.surface, color: C.text0, fontSize: 13, padding: "10px 12px", resize: "vertical", minHeight: 108, outline: "none", fontFamily: C.sans }} /></div><div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}><div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>文件上传入口</div><div style={{ fontSize: 13, color: C.text1, marginBottom: 10 }}>选择语音、照片等材料</div><label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px dashed ${C.borderMd}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: C.text1, background: C.surface, cursor: "pointer", marginBottom: 10 }}><span>{selectedFiles.length > 0 ? `已选择 ${selectedFiles.length} 个文件` : "浏览文件"}</span><span style={{ color: C.blue, fontWeight: 600 }}>浏览文件</span><input type="file" multiple style={{ display: "none" }} onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []).map((file) => file.name))} /></label><div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}><SecondaryBtn onClick={uploadMaterials}>一键上传</SecondaryBtn><span style={{ fontSize: 12, color: C.text2 }}>支持语音、图片、现场备注截图</span></div></div><div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>已上传材料列表</div>{uploadedMaterials.map((item, index) => <Row key={`${item.name}-${index}`} last={index === uploadedMaterials.length - 1}><Tag label={item.type} variant={item.type === "照片" ? "blue" : "neutral"} small /><span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item.name}</span><span style={{ fontSize: 11.5, color: C.text2 }}>{item.time}</span></Row>)}</div></div><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}><PrimaryBtn onClick={uploadMaterials}>提交面客资料</PrimaryBtn><SecondaryBtn onClick={() => setInputModalOpen(false)}>关闭并返回任务面板</SecondaryBtn></div></CardPad></div></div>}
    </div>
  );
}
