import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { customer } from "../app/data";
import { C } from "../app/theme";
import type { WorkspacePageProps } from "../app/types";
import { AgentBlock, Card, CardPad, ConfidenceBar, DecisionTensionCard, GhostBtn, Header, PrimaryBtn, PriorityCard, Row, SecondaryBtn, SectionTitle, Tag, DangerBtn, getPriorityTone } from "../app/ui";

export default function WorkspacePage({ roleVariant, taskPanelState, setTaskPanelState, onOpenMessages }: WorkspacePageProps) {
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
            suggestedActions: ["优先按“家庭体验 + 品牌对比”双线组织本轮沟通，不要直接切报价。", "先把配偶顾虑拆成品牌认知、空间体验、预算三个维度，再决定是否需要经理介入。", "如果客户能确认周末档期，下一步可同步准备家庭场景试驾路线与服务承诺材料。"],
            blockedItems: ["仍不得直接联系配偶本人", "折扣承诺与金融方案口径不能先于审批给出", "售后响应时效不能口头扩大承诺"],
            currentUnderstanding: "当前任务已从单人高意向跟进切换为双人共同决策推动。客户本人在推进，配偶态度出现松动，但是否真正在意品牌形象、空间体验还是保值率，还需要继续收集一手表达。",
            questionsToConfirm: ["配偶愿意参加的是到店体验还是单独看资料？", "客户预算上限是否因家庭讨论发生变化？", "这次补充信息里有没有明确提到竞品品牌？"],
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
            suggestedActions: ["先确认客户更适合微信回访还是电话沟通，再安排服务说明发送节奏。", "围绕家庭体验安排、服务承诺说明和响应方式三点收集反馈，不要直接进入成交推动。", "确认结果后同步给销售 owner，由销售决定是否继续推进家庭到店体验。"],
            blockedItems: ["仍不得直接联系配偶本人", "不得承诺折扣与金融政策", "不得替销售 owner 输出成交判断"],
            currentUnderstanding: "当前客服版本的任务重点是稳住关系温度，并通过服务说明和体验协同确认帮助销售继续推进，而不是直接承担成交推进职责。",
            questionsToConfirm: ["客户更接受微信回访还是电话沟通？", "客户是否希望先收到服务承诺说明再确认家庭体验？", "客服回访结果是否需要当天同步给销售 owner？"],
          },
          submittedHistoryEvent: { id: "E-042", type: "CS_OUTREACH", typeLabel: "客服回访", owner: "李明", date: "今天", summary: "已提交本轮服务回访与家庭体验协同确认结果：确认客户愿意先接收服务说明，并等待销售继续承接家庭体验安排。", status: "已提交" },
        } as const;
  const { currentTask, reviewPacket, processingSteps, liveWorkspace, submittedHistoryEvent } = workspaceTaskContent;
  const historyEvents = (taskPanelState === "已提交" ? [submittedHistoryEvent, ...customer.events] : customer.events).filter((event) => historyOwnerFilter === "全部" || event.owner === historyOwnerFilter);
  const historyOwnerOptions = ["全部", "王芳", "赵晨", "李明"] as const;
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
  const orderedSuggestedActions = [...liveWorkspace.suggestedActions.filter((item) => !completedSuggestedActions.includes(item)), ...liveWorkspace.suggestedActions.filter((item) => completedSuggestedActions.includes(item))];
  const orderedQuestionsToConfirm = [...liveWorkspace.questionsToConfirm.filter((item) => !completedQuestionsToConfirm.includes(item)), ...liveWorkspace.questionsToConfirm.filter((item) => completedQuestionsToConfirm.includes(item))];
  const detailSectionTitleStyle: CSSProperties = { fontSize: 13, color: C.text3, letterSpacing: 0.4 };

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
        <div className="execution-live-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16 }}>
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
            <div style={{ background: "#FCFDFE", border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>实时更新的建议动作</div>
              {orderedSuggestedActions.map((item, index) => {
                const checked = completedSuggestedActions.includes(item);
                return <Row key={item} last={index === orderedSuggestedActions.length - 1} style={{ alignItems: "flex-start", padding: "8px 0" }}><label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", width: "100%" }}><input type="checkbox" checked={checked} onChange={(e) => setCompletedSuggestedActions((prev) => e.target.checked ? [...prev, item] : prev.filter((entry) => entry !== item))} style={{ marginTop: 2, accentColor: C.green, width: 16, height: 16, cursor: "pointer", flexShrink: 0 }} /><span style={{ fontSize: 13, color: checked ? C.text3 : C.text0, lineHeight: 1.65, textDecoration: checked ? "line-through" : "none" }}>{item}</span></label></Row>;
              })}
            </div>
            <div>
              <div style={{ background: "#FCFDFE", border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>待确认问题</div>
                {orderedQuestionsToConfirm.map((item, index) => {
                  const checked = completedQuestionsToConfirm.includes(item);
                  return <Row key={item} last={index === orderedQuestionsToConfirm.length - 1} style={{ alignItems: "flex-start", padding: "8px 0" }}><div style={{ display: "flex", gap: 10, alignItems: "flex-start", width: "100%" }}><label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", flex: 1, minWidth: 0 }}><input type="checkbox" checked={checked} onChange={(e) => setCompletedQuestionsToConfirm((prev) => e.target.checked ? [...prev, item] : prev.filter((entry) => entry !== item))} style={{ marginTop: 2, accentColor: C.amber, width: 16, height: 16, cursor: "pointer", flexShrink: 0 }} /><span style={{ fontSize: 13, color: checked ? C.text3 : C.text0, lineHeight: 1.65, textDecoration: checked ? "line-through" : "none" }}>{item}</span></label><SecondaryBtn style={{ padding: "5px 10px", fontSize: 12, marginLeft: "auto", flexShrink: 0 }}>备注</SecondaryBtn></div></Row>;
                })}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>文本输入区</div>
              <div style={{ fontSize: 12.5, color: C.text1, marginBottom: 10 }}>输入客户第一手信息 / 访谈记录</div>
              <textarea value={executionInput} onChange={(e) => { setExecutionInput(e.target.value); setDraftSaved(false); }} placeholder="记录客户原话、现场观察、配偶反馈、销售自己的即时判断……" style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 8, background: C.surface, color: C.text0, fontSize: 13, padding: "10px 12px", resize: "vertical", minHeight: 120, outline: "none", fontFamily: C.sans }} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}><PrimaryBtn onClick={saveDraft}>提交</PrimaryBtn><SecondaryBtn onClick={() => setInputModalOpen(true)}>语音输入</SecondaryBtn></div>
            </div>
            <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>语音上传 / 转写入口</div>
              <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65, marginBottom: 10 }}>支持上传门店录音、现场纪要，转写后会继续回流到左侧理解区。</div>
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px dashed ${C.borderMd}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: C.text1, background: C.surface, cursor: "pointer" }}>
                <span>上传语音或转写文件</span><span style={{ color: C.blue, fontWeight: 600 }}>选择文件</span>
                <input type="file" multiple style={{ display: "none" }} onChange={(e) => { setSelectedFiles(Array.from(e.target.files ?? []).map((file) => file.name)); setDraftSaved(false); }} />
              </label>
            </div>
            <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>图片 / 文件上传入口</div>
              <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65, marginBottom: 10 }}>上传访谈截图、手写记录、图片或其他文件，助手会继续归并进当前理解。</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}><SecondaryBtn onClick={uploadMaterials}>上传到材料列表</SecondaryBtn>{selectedFiles.length > 0 && <Tag label={`待上传 ${selectedFiles.length} 项`} variant="blue" small />}</div>
            </div>
            <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>已上传材料列表</div>
              <div style={{ display: "grid", gap: 2 }}>{uploadedMaterials.map((item, index) => <Row key={`${item.name}-${index}`} last={index === uploadedMaterials.length - 1}><Tag label={item.type} variant={item.type === "照片" ? "blue" : "neutral"} small /><span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item.name}</span><span style={{ fontSize: 11.5, color: C.text2 }}>{item.time}</span></Row>)}</div>
            </div>
          </div>
        </div>
      );
    }
    if (taskPanelState === "整理中") {
      return <div style={{ display: "grid", gap: 14 }}><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>已上传材料清单</div>{uploadedMaterials.map((item, index) => <Row key={`${item.name}-${index}`} last={index === uploadedMaterials.length - 1}><Tag label={item.type} variant={item.type === "照片" ? "blue" : "neutral"} small /><span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item.name}</span><span style={{ fontSize: 11.5, color: C.text2 }}>{item.time}</span></Row>)}</div><div style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 6 }}>助手正在汇总本轮完整报告...</div><div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.6, marginBottom: 10 }}>这一阶段只是在收束本轮结果，不是重新等待上传。已收集的执行材料会继续被合并成候选结论与报告草稿。</div>{processingSteps.map((step, index) => <div key={step.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: index === processingSteps.length - 1 ? "8px 0 0" : "8px 0", borderBottom: index === processingSteps.length - 1 ? "none" : `1px solid ${C.blueBorder}` }}><span style={{ fontSize: 13, color: C.text0 }}>{step.label}</span><Tag label={step.status} variant={step.status === "已完成" ? "green" : step.status === "进行中" ? "blue" : "neutral"} small /></div>)}</div></div>;
    }
    if (taskPanelState === "确认本轮结果") {
      return <div style={{ display: "grid", gap: 14 }}><div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>原始材料摘要</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{reviewPacket.rawSummary}</div></div><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>推荐版本</div><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Tag label={reviewPacket.versionRecommendation} variant={reviewPacket.versionRecommendation === "主要版本" ? "amber" : "neutral"} /></div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.65 }}>{reviewPacket.versionReason}</div></div></div><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{roleVariant === "sales" ? "销售视角解读" : "客服视角解读"}</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{reviewPacket.interpretation}</div></div><div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}><div style={{ background: C.surface, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>候选状态更新</div>{reviewPacket.candidateUpdates.map((item) => <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 10px", background: C.greenLight, borderRadius: 7, marginBottom: 6, border: `1px solid ${C.greenBorder}` }}><span style={{ color: C.green, fontWeight: 700 }}>+</span><span style={{ fontSize: 13, color: C.text0 }}>{item}</span></div>)}</div><div style={{ display: "grid", gap: 14 }}><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>置信度</div><ConfidenceBar value={reviewPacket.confidence} /></div><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>未决问题</div>{reviewPacket.unresolvedQuestions.map((item, index) => <Row key={item} last={index === reviewPacket.unresolvedQuestions.length - 1}><span style={{ color: C.red, fontWeight: 700 }}>?</span><span style={{ fontSize: 13, color: C.text0 }}>{item}</span></Row>)}</div></div></div><div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.border}` }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>本角色建议动作</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{reviewPacket.roleRecommendation}</div></div></div>;
    }
    return <div style={{ display: "grid", gap: 14 }}><div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "14px 16px" }}><div style={{ fontSize: 15, fontWeight: 700, color: C.green, marginBottom: 8 }}>任务已提交</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>本次任务结果已提交，新的事件条目将进入客户触达任务历史。系统接下来会触发状态更新评估，并等待编排助手重新安排下一步动作。</div></div><div className="task-state-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>事件去向</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{roleVariant === "sales" ? "事件已进入任务历史，等待销售与状态编排链路继续处理。" : "事件已进入任务历史，等待客服回访结果同步并交由编排链路继续处理。"}</div></div><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>下一步系统动作</div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>等待状态更新结果，随后由编排助手判断是否需要调整 owner、协同角色与下个任务窗口。</div></div></div></div>;
  };

  const renderTaskStateActions = () => {
    if (taskPanelState === "待执行") return null;
    if (taskPanelState === "执行中") return <>{draftSaved ? <SecondaryBtn onClick={resumeSupplement}>继续补充材料</SecondaryBtn> : <SecondaryBtn onClick={saveDraft}>暂存草稿</SecondaryBtn>}<PrimaryBtn onClick={generateRoundReport}>生成本轮完整报告</PrimaryBtn></>;
    if (taskPanelState === "整理中") return <><SecondaryBtn onClick={() => setTaskPanelState("执行中")}>返回继续补充</SecondaryBtn><PrimaryBtn onClick={() => setTaskPanelState("确认本轮结果")}>查看本轮结果</PrimaryBtn></>;
    if (taskPanelState === "确认本轮结果") return <><PrimaryBtn onClick={() => setTaskPanelState("已提交")}>审批并提交事件结果</PrimaryBtn><SecondaryBtn onClick={() => setTaskPanelState("已提交")}>修改后提交</SecondaryBtn><DangerBtn onClick={() => setTaskPanelState("执行中")}>驳回并返回执行中</DangerBtn></>;
    return <><GhostBtn onClick={() => setWorkTab("history")}>查看任务历史</GhostBtn><GhostBtn onClick={() => setWorkTab("history")}>查看状态更新结果</GhostBtn><PrimaryBtn onClick={() => setTaskPanelState("待执行")}>返回工作台</PrimaryBtn></>;
  };

  return (
    <div>
      <Header page={roleVariant === "sales" ? "workspaceSales" : "workspaceCs"} />
      <div style={{ margin: "24px 0", padding: "0 28px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase", marginBottom: 12 }}>Layer 2 · 顶部摘要层</div>
        <div className="top-dual" style={{ display: "grid", gridTemplateColumns: taskPanelState === "已提交" ? "1fr" : "1fr 2fr", gap: 24, marginBottom: 24 }}>
          <Card><CardPad><div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>当前客户承接卡</div><div style={{ fontSize: 30, fontWeight: 700, color: C.text0, lineHeight: 1.1, marginBottom: 8 }}>{summary.customerIdentity.name}</div><div style={{ fontSize: 14, color: C.text1, lineHeight: 1.6, marginBottom: 14 }}><span style={{ fontWeight: 600, color: C.text0 }}>{summary.customerIdentity.stage}</span><span style={{ color: C.text3, margin: "0 8px" }}>｜</span>{summary.customerIdentity.profileLine}</div><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>核心状态总结</div><div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}>{summary.stateSummary}</div></div><div style={{ display: "flex", flexDirection: "column", gap: 9 }}><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, textTransform: "uppercase", letterSpacing: 0.5 }}>当前 owner</div><GhostBtn onClick={openAssignmentSection} style={{ padding: 0, minHeight: "auto", textAlign: "right", justifyContent: "flex-end", flexShrink: 0 }}>查看责任协同详情</GhostBtn></div><div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}><strong style={{ color: C.text0 }}>{summary.assignment.owner.name}</strong>（{summary.assignment.owner.role}）</div></div><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>当前风险</div><div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}><Tag label={summary.workflow.risk.level} variant="amber" small /> <span style={{ marginLeft: 6 }}>{summary.workflow.risk.reason}</span></div></div><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>当前审核</div><div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}><strong style={{ color: C.text0 }}>{summary.workflow.reviewStatus}</strong></div></div></div></CardPad></Card>
          {taskPanelState !== "已提交" && <Card style={{ background: C.surface, borderColor: C.border }}><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 12 }}><div><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}><div style={{ fontSize: 11, fontWeight: 600, color: C.amber, letterSpacing: 0.8, textTransform: "uppercase" }}>负责人专属当前任务</div><Tag label="仅负责人可见" variant="amber" small /><Tag label={`时间窗口：${currentTask.timeWindow}`} variant="neutral" small /></div><div style={{ fontSize: 12.5, color: C.text2 }}>人机协作任务面板</div></div><Tag label={`当前状态：${taskPanelState}`} variant={taskPanelState === "确认本轮结果" ? "amber" : taskPanelState === "执行中" || taskPanelState === "整理中" ? "blue" : "neutral"} /></div>{taskPanelState === "确认本轮结果" && <div style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}`, borderRadius: 10, padding: "10px 12px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}><div style={{ fontSize: 13, color: C.text1 }}>个人消息已推送“确认客户画像更新”，请在右上角消息中心处理。</div><SecondaryBtn onClick={onOpenMessages}>打开消息中心</SecondaryBtn></div>}{renderTaskStateBody()}<div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>{renderTaskStateActions()}</div></CardPad></Card>}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase", marginBottom: 12 }}>Layer 3 · 主体工作层</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, margin: "0 0 24px", padding: "0 28px" }}>
        <div ref={assignmentSectionRef} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase" }}>客户状态详情</div>
          <Card><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><SectionTitle style={detailSectionTitleStyle}>Customer State 摘要</SectionTitle><div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><Tag label={`最新状态版本：${stateDetail.summary.stateVersion}`} variant="blue" small /><Tag label={`更新时间：${stateDetail.summary.updatedAt}`} variant="neutral" small /></div></div><div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}><div style={{ fontSize: 13, color: C.text2, marginBottom: 8, letterSpacing: 0.2 }}>当前摘要</div><div style={{ fontSize: 15, color: C.text0, lineHeight: 1.85, letterSpacing: 0.1 }}>{stateDetail.summary.summaryText}</div></div></CardPad></Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card><CardPad><SectionTitle style={detailSectionTitleStyle}>判断相关特征</SectionTitle><div className="detail-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{stateDetail.decisionRelevantTraits.map((trait, index) => { const priority = (["P0", "P1", "P2", "P3"] as const)[index % 4]; const tone = getPriorityTone(priority); return <div key={trait.label} style={{ background: tone.bg, border: `1px solid ${tone.border}`, borderRadius: 12, padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 44, height: 30, padding: "0 10px", border: `1px solid ${tone.border}`, background: tone.tagBg, color: tone.color, fontSize: 13, fontWeight: 500 }}>{priority}</span><span style={{ display: "inline-flex", alignItems: "center", minHeight: 30, padding: "0 12px", border: `1px solid ${tone.border}`, background: tone.tagBg, color: tone.color, fontSize: 14, fontWeight: 600 }}>{trait.label}</span><div style={{ fontSize: 20, color: C.text1, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0.1 }}>{trait.value}</div></div><div><div style={{ fontSize: 13, color: C.text2, marginBottom: 8, fontWeight: 600, letterSpacing: 0.1 }}>对当前判断的影响</div><div style={{ fontSize: 14.5, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{trait.impact}</div></div></div>; })}</div></CardPad></Card>
            <Card><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><SectionTitle style={detailSectionTitleStyle}>可行动</SectionTitle><Tag label={`${stateDetail.actionable.length} 条`} variant="green" small /></div><div className="detail-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{stateDetail.actionable.map((item) => <PriorityCard key={item} priority="P3" title={item} />)}</div></CardPad></Card>
            <Card style={{ borderColor: C.amberBorder }}><CardPad><SectionTitle style={detailSectionTitleStyle}>决策张力结构</SectionTitle><DecisionTensionCard data={stateDetail.tension} showManualControls /></CardPad></Card>
            <Card style={{ gridColumn: "1 / -1" }}><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><SectionTitle style={detailSectionTitleStyle}>关键待验证项</SectionTitle><Tag label={`当前 ${stateDetail.keyValidationItems.length} 项`} variant="amber" small /></div><div className="detail-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{stateDetail.keyValidationItems.map((item) => { const normalizedPriority = item.priority === "P1" ? "P0" : "P1"; return <PriorityCard key={item.title} priority={normalizedPriority} badgeLabel={item.priority} title={item.title}><div style={{ display: "grid", gap: 10 }}><div><div style={{ fontSize: 13, color: C.text2, marginBottom: 5, fontWeight: 600 }}>当前缺口</div><div style={{ fontSize: 14, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{item.gap}</div></div><div><div style={{ fontSize: 13, color: C.text2, marginBottom: 5, fontWeight: 600 }}>影响判断</div><div style={{ fontSize: 14, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{item.affects}</div></div><div><div style={{ fontSize: 13, color: C.text2, marginBottom: 5, fontWeight: 600 }}>对动作的影响</div><div style={{ fontSize: 14, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{item.impact}</div></div></div><div style={{ marginTop: "auto", paddingTop: 4 }}><div style={{ fontSize: 13, color: C.text2, marginBottom: 6, fontWeight: 600 }}>建议补证方式</div><div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><span style={{ color: getPriorityTone(normalizedPriority).color, fontWeight: 700, fontSize: 14 }}>•</span><span style={{ fontSize: 14, color: C.text0, lineHeight: 1.8, letterSpacing: 0.1 }}>{item.suggestion}</span></div></div></PriorityCard>; })}</div></CardPad></Card>
          </div>
          <Card><CardPad><SectionTitle style={detailSectionTitleStyle}>最新状态版本摘要</SectionTitle><div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}><span style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{customer.stateVersions[0].version}</span><Tag label={customer.stateVersions[0].level} variant={customer.stateVersions[0].level === "重要更新" ? "amber" : "neutral"} small /><Tag label={customer.stateVersions[0].date} variant="neutral" small /></div><div style={{ fontSize: 12.5, color: C.text1, marginBottom: 8 }}>触发原因：{customer.stateVersions[0].trigger}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>{customer.stateVersions[0].changed.map((field) => <Tag key={field} label={field} variant="purple" small />)}</div><div style={{ fontSize: 12, color: C.text2 }}>审批人：{customer.stateVersions[0].approvedBy}</div><div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}><button onClick={() => setVersionTraceExpanded((prev) => !prev)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}><span style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, textTransform: "uppercase", letterSpacing: 0.5 }}>状态版本流 / 治理追溯</span><span style={{ fontSize: 13, color: C.blue, fontWeight: 600 }}>{versionTraceExpanded ? "收起" : "展开"}</span></button>{versionTraceExpanded && <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>{customer.stateVersions.map((version) => <div key={version.version} style={{ border: `1px solid ${version.level === "重要更新" ? C.amberBorder : C.border}`, borderLeft: `3px solid ${version.level === "重要更新" ? C.amber : C.borderMd}`, borderRadius: 8, padding: "12px 14px", background: C.surfaceAlt }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8, flexWrap: "wrap" }}><div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><span style={{ fontSize: 13.5, fontWeight: 700, color: C.text0 }}>{version.version}</span><Tag label={version.level} variant={version.level === "重要更新" ? "amber" : "neutral"} small /></div><span style={{ fontSize: 11.5, color: C.text3 }}>{version.date}</span></div><div style={{ fontSize: 12, color: C.text2, marginBottom: 8 }}>触发原因：{version.trigger}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>{version.changed.map((field) => <Tag key={field} label={field} variant="purple" small />)}</div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: C.text2, marginBottom: version.note ? 8 : 0, gap: 8, flexWrap: "wrap" }}><span>审批人：<strong style={{ color: C.text1 }}>{version.approvedBy}</strong></span><span>参与助手：{version.agents.join("、")}</span></div>{version.note && <div style={{ background: C.surface, borderRadius: 6, padding: "8px 12px", fontSize: 12, color: C.text1 }}>{version.note}</div>}</div>)}</div>}</div></CardPad></Card>
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
