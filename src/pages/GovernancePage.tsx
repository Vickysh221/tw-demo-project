import { useState } from "react";
import type { ReactNode } from "react";
import { stateGovernanceWorkbench } from "../app/data";
import { C } from "../app/theme";
import { Card, CardPad, GhostBtn, GovernanceToggle, Header, PrimaryBtn, SecondaryBtn, SectionTitle, Tag } from "../app/ui";
import CustomerStateDebugConsolePanel from "../components/CustomerStateDebugConsolePanel";

function AgentDirectoryCard({ agent, active = false, onOpen }: { agent: { englishName: string; chineseName: string; subtitle: string; responsibility: string; statusSummary: string }; active?: boolean; onOpen: () => void }) {
  return (
    <Card style={{ borderColor: active ? C.blueBorder : C.border, background: active ? C.blueLight : C.surface }}>
      <CardPad>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
          <div><div style={{ fontSize: 18, fontWeight: 700, color: C.text0, marginBottom: 6 }}>{agent.englishName}</div><div style={{ fontSize: 14, color: C.text1, fontWeight: 600 }}>{agent.chineseName}</div></div>
        </div>
        <div style={{ fontSize: 13.5, color: C.text2, marginBottom: 8 }}>{agent.subtitle}</div>
        <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.75, marginBottom: 14 }}>{agent.responsibility}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{agent.statusSummary.split("｜").map((item) => <Tag key={item} label={item} variant={item.includes("待发布") ? "amber" : item.includes("需") ? "blue" : "neutral"} small />)}</div>
          <SecondaryBtn onClick={onOpen} style={{ padding: "8px 12px", fontSize: 12 }}>查看/管理规则</SecondaryBtn>
        </div>
      </CardPad>
    </Card>
  );
}

function GovernanceRuleTable({ columns, rows, columnTemplate }: { columns: string[]; rows: Array<{ key: string; cells: ReactNode[] }>; columnTemplate: string }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.surface }}>
      <div className="governance-rule-grid" style={{ display: "grid", gridTemplateColumns: columnTemplate, gap: 14, padding: "12px 16px", background: C.surfaceAlt, borderBottom: `1px solid ${C.border}` }}>
        {columns.map((column) => <div key={column} style={{ fontSize: 12, color: C.text2, fontWeight: 600, letterSpacing: 0.2 }}>{column}</div>)}
      </div>
      {rows.map((row, index) => <div key={row.key} className="governance-rule-grid" style={{ display: "grid", gridTemplateColumns: columnTemplate, gap: 14, padding: "14px 16px", alignItems: "start", borderBottom: index === rows.length - 1 ? "none" : `1px solid ${C.border}` }}>{row.cells.map((cell, cellIndex) => <div key={`${row.key}-${cellIndex}`} style={{ minWidth: 0 }}>{cell}</div>)}</div>)}
    </div>
  );
}

function GovernanceChangeRow({ item, last = false }: { item: { changedBy: string; change: string; effectiveAt: string; impact: string; roleImpact: string; agentImpact: string; status: string }; last?: boolean }) {
  return (
    <div className="governance-row-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr 1fr 1fr 0.8fr auto", gap: 14, alignItems: "start", padding: "14px 0", borderBottom: last ? "none" : `1px solid ${C.border}` }}>
      <div><div style={{ fontSize: 13.5, color: C.text0, fontWeight: 700 }}>{item.effectiveAt}</div><div style={{ fontSize: 11.5, color: C.text2 }}>{item.changedBy}</div></div>
      <div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.7 }}>{item.change}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}><Tag label={item.impact} variant="neutral" small /></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}><Tag label={item.roleImpact} variant="blue" small /></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}><Tag label={item.agentImpact} variant="purple" small /></div>
      <div><Tag label={item.status} variant={item.status === "已生效" ? "green" : "amber"} small /></div>
      <div style={{ justifySelf: "end" }}><SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>差异</SecondaryBtn></div>
    </div>
  );
}

export default function GovernancePage() {
  type GovernanceAgentId = "customer_state" | "sales" | "cs" | "presale" | "orchestrator";
  const g = stateGovernanceWorkbench;
  const [adminCardOpen, setAdminCardOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<GovernanceAgentId>("customer_state");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const adminProfile = { name: "Vicky Shou", dept: "智能体平台 / 产品设计", title: "平台管理员 · Staff", phone: "138-0013-1024", badge: "VS" } as const;
  const governanceAgents: Array<{ id: GovernanceAgentId; englishName: string; chineseName: string; subtitle: string; responsibility: string; statusSummary: string; rolePrompt: string; tableTitle: string; tableColumns: string[]; tableColumnTemplate: string; tableRows: Array<{ key: string; cells: ReactNode[] }>; changeLog: Array<{ changedBy: string; change: string; effectiveAt: string; impact: string; roleImpact: string; agentImpact: string; status: string }> }> = [
    {
      id: "customer_state", englishName: "Customer State Agent", chineseName: "客户状态智能体", subtitle: "负责客户状态结构、维度沉淀、解释结果与候选状态更新。", responsibility: "重点治理它如何定义状态维度、如何输出候选状态更新，以及哪些内容必须进入 owner 确认。", statusSummary: "已启用｜影响 3 个页面｜2 项待发布变更",
      rolePrompt: `# 客户状态智能体

## 关注要点
- 维度是否进入正式版本沉淀
- 候选状态更新的写入边界
- 角色解释是否偏离统一 State 结构`,
      tableTitle: "维度配置表", tableColumns: ["维度名", "定义说明", "进入版本沉淀", "首屏显示", "角色共享", "适用页面", "适用角色", "编辑"], tableColumnTemplate: "1.1fr 1.8fr 0.8fr 0.8fr 0.8fr 1.1fr 1fr auto",
      tableRows: g.stateDimensions.map((item) => ({ key: item.code, cells: [<div><div style={{ fontSize: 14, fontWeight: 700, color: C.text0, marginBottom: 4 }}>{item.name}</div><div style={{ fontSize: 12, color: C.text2 }}>{item.code}</div></div>, <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item.description}</div>, <GovernanceToggle enabled={item.versioned} />, <GovernanceToggle enabled={item.visibleOnTop} />, <GovernanceToggle enabled={item.sharedAcrossRoles} />, <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{item.pages.map((page) => <Tag key={page} label={page} variant="neutral" small />)}</div>, <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{item.roles.map((role) => <Tag key={role} label={role} variant="blue" small />)}</div>, <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>编辑</SecondaryBtn>] })),
      changeLog: g.changeLog.filter((item) => item.agentImpact.includes("Customer")),
    },
    {
      id: "sales", englishName: "Sales Agent", chineseName: "销售智能体", subtitle: "负责销售动作建议、沟通草稿、异议处理与跟进节奏建议。", responsibility: "重点治理它输出什么销售类结果、在哪些阶段启用、哪些内容必须由 owner 最终确认。", statusSummary: "已启用｜输出需 owner 确认",
      rolePrompt: `# 销售智能体

## 关注要点
- 输出建议不能越权替代 owner
- 跟进时机建议要结合阶段和风险`,
      tableTitle: "输出规范表", tableColumns: ["输出类型", "说明", "是否启用", "必须 owner 确认", "适用阶段", "适用页面", "编辑"], tableColumnTemplate: "1fr 1.6fr 0.8fr 0.9fr 1fr 1fr auto",
      tableRows: [["跟进建议", "根据阶段、异议与窗口给出下一步推进建议。", true, true, "意向 / 评估", "我的工作台"], ["沟通草稿", "生成可修改的销售沟通文案。", true, true, "全阶段", "当前任务区"], ["试驾总结草稿", "沉淀试驾后要点与后续推进提示。", true, true, "试驾后", "销售轻记录"], ["异议处理提示", "针对 objection 给出应对切口与材料建议。", true, true, "评估 / 成交前", "客户状态工作台"], ["联系时机建议", "结合活跃度和阶段给出触达节奏。", true, false, "全阶段", "我的工作台"], ["交接摘要", "在需要让位时输出交接给售前/客服的摘要。", false, true, "升级场景", "客户状态工作台"]].map((item) => ({ key: item[0] as string, cells: [<div style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{item[0]}</div>, <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item[1]}</div>, <GovernanceToggle enabled={item[2] as boolean} />, <GovernanceToggle enabled={item[3] as boolean} />, <Tag label={item[4] as string} variant="neutral" small />, <Tag label={item[5] as string} variant="blue" small />, <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>编辑</SecondaryBtn>] })),
      changeLog: [{ changedBy: "周岚", change: "新增试驾总结草稿模板", effectiveAt: "2026-03-21 11:20", impact: "销售轻记录", roleImpact: "销售", agentImpact: "销售智能体", status: "待发布" }, { changedBy: "王芳", change: "提高价格相关内容的 owner 确认门槛", effectiveAt: "2026-03-20 18:10", impact: "当前任务区", roleImpact: "销售 owner", agentImpact: "销售智能体", status: "已生效" }],
    },
    {
      id: "cs", englishName: "CS Agent", chineseName: "客服智能体", subtitle: "负责服务通知、回访建议、满意度回收与异常升级提示。", responsibility: "重点治理客服类任务是否允许主动触达、渠道限制、确认要求和被打扰风险控制。", statusSummary: "已启用｜影响 2 个页面｜渠道受限",
      rolePrompt: `# 客服智能体

## 关注要点
- 主动触达必须遵守授权与渠道偏好
- 服务响应不能越权承诺`,
      tableTitle: "触达与服务配置表", tableColumns: ["任务类型", "说明", "渠道限制", "允许主动触达", "需要确认", "适用页面", "编辑"], tableColumnTemplate: "1fr 1.5fr 1fr 0.9fr 0.8fr 1fr auto",
      tableRows: [["服务通知", "发送服务节点通知与已授权资料。", "微信 / 短信", true, false, "客服触达检查"], ["外呼回访", "对服务节点后的体验做主动回访。", "仅授权电话", false, true, "客服触达检查"], ["满意度回访", "收集服务满意度和负面反馈。", "微信优先", true, true, "客服触达检查"], ["异常升级建议", "发现服务异常时建议升级人工处理。", "不限", true, true, "客户状态工作台"], ["服务反馈结构化结果", "把服务反馈整理成可追溯结果。", "不限", false, false, "客户状态工作台"]].map((item) => ({ key: item[0] as string, cells: [<div style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{item[0]}</div>, <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item[1]}</div>, <Tag label={item[2] as string} variant="neutral" small />, <GovernanceToggle enabled={item[3] as boolean} />, <GovernanceToggle enabled={item[4] as boolean} />, <Tag label={item[5] as string} variant="blue" small />, <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>编辑</SecondaryBtn>] })),
      changeLog: [{ changedBy: "李明", change: "补充满意度回访的渠道偏好限制", effectiveAt: "2026-03-21 09:50", impact: "客服触达检查", roleImpact: "客服", agentImpact: "客服智能体", status: "已生效" }, { changedBy: "周岚", change: "新增投诉风险下的强制确认规则", effectiveAt: "2026-03-20 16:40", impact: "异常升级", roleImpact: "客服、经理", agentImpact: "客服智能体", status: "待发布" }],
    },
    {
      id: "presale", englishName: "Presale Agent", chineseName: "售前智能体", subtitle: "负责技术解释、材料推荐、技术风险边界说明与售前支持建议。", responsibility: "重点治理售前智能体在什么条件下介入、可以生成哪些技术支持类内容、何时可主导参与。", statusSummary: "已启用｜技术支持需触发条件",
      rolePrompt: `# 售前智能体

## 关注要点
- 技术解释不能脱离已确认事实
- 技术介入要有明确触发条件`,
      tableTitle: "技术支持配置表", tableColumns: ["能力模块", "说明", "是否启用", "可主导介入", "适用页面", "编辑"], tableColumnTemplate: "1.1fr 1.8fr 0.8fr 0.9fr 1fr auto",
      tableRows: [["技术解释摘要", "把复杂技术信息整理为可交付说明。", true, false, "客户状态工作台"], ["技术材料推荐", "根据问题类型推荐适配材料。", true, false, "售前支持页"], ["风险边界说明", "明确技术能力边界与使用限制。", true, false, "客户状态工作台"], ["售前支持建议", "在需要技术协同时输出行动建议。", true, true, "客户状态工作台"]].map((item) => ({ key: item[0] as string, cells: [<div style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{item[0]}</div>, <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}>{item[1]}</div>, <GovernanceToggle enabled={item[2] as boolean} />, <GovernanceToggle enabled={item[3] as boolean} />, <Tag label={item[4] as string} variant="blue" small />, <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>编辑</SecondaryBtn>] })),
      changeLog: [{ changedBy: "赵晨", change: "新增技术材料推荐模块", effectiveAt: "2026-03-21 10:05", impact: "售前支持页", roleImpact: "售前、销售", agentImpact: "售前智能体", status: "已生效" }],
    },
    {
      id: "orchestrator", englishName: "Orchestrator", chineseName: "旅程编排器", subtitle: "负责 route、owner、handoff 规则以及 review / override 机制。", responsibility: "重点治理不同场景下默认 owner、自动切换条件、review 门槛和升级逻辑。", statusSummary: "已启用｜影响 4 个页面｜1 项待发布变更",
      rolePrompt: `# 旅程编排器

## 关注要点
- owner 与 route 规则必须稳定可解释
- 高风险冲突禁止自动切换`,
      tableTitle: "指派与流转规则表", tableColumns: ["场景", "默认 owner", "route 规则", "自动切换", "需要 review", "影响页面 / 角色", "编辑"], tableColumnTemplate: "1fr 1fr 1.4fr 0.8fr 0.8fr 1.2fr auto",
      tableRows: g.ownershipRules.map((item) => ({ key: item.scenario, cells: [<div style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{item.scenario}</div>, <Tag label={item.scenario.includes("成交前") ? "销售" : item.scenario.includes("交付后") ? "客服 / 售后" : item.scenario.includes("技术验证") ? "销售（售前候选）" : "经理 review"} variant="neutral" small />, <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.75 }}><div style={{ marginBottom: 4 }}>{item.rule}</div><div style={{ color: C.text2 }}>触发：{item.trigger}</div></div>, <GovernanceToggle enabled={item.mode.includes("自动")} />, <GovernanceToggle enabled={item.review.includes("review") || item.review.includes("审批")} />, <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}><Tag label="客户状态工作台" variant="neutral" small /><Tag label="销售 / 客服 / 经理" variant="blue" small /></div>, <SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>编辑</SecondaryBtn>] })),
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
                <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.75, marginBottom: 14 }}>本页面用于对所有智能体进行统一管理，可定义和修改话术风格、能力边界、任务类型、审批规则与协作方式。</div>
              </div>
              <div style={{ position: "relative", flex: "0 0 320px", maxWidth: "100%" }}>
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.surfaceAlt }}>
                  <div><div style={{ fontSize: 12, color: C.text2, marginBottom: 4 }}>管理员</div><div style={{ fontSize: 13.5, color: C.text1 }}>点击头像查看信息</div></div>
                  <button onClick={() => setAdminCardOpen((prev) => !prev)} style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${C.blueBorder}`, background: C.blueLight, color: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, letterSpacing: 0.3, flexShrink: 0, cursor: "pointer" }}>{adminProfile.badge}</button>
                </div>
                {adminCardOpen && <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 10px 24px rgba(16,24,40,0.08)", padding: "14px 16px", zIndex: 5 }}><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}><div style={{ width: 48, height: 48, borderRadius: "50%", border: `1px solid ${C.blueBorder}`, background: C.blueLight, color: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>{adminProfile.badge}</div><div><div style={{ fontSize: 17, fontWeight: 700, color: C.text0, marginBottom: 4 }}>{adminProfile.name}</div><Tag label="页面管理员" variant="blue" small /></div></div><div style={{ display: "grid", gap: 10 }}><div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }}><div style={{ fontSize: 12.5, color: C.text2 }}>部门</div><div style={{ fontSize: 13.5, color: C.text0 }}>{adminProfile.dept}</div></div><div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }}><div style={{ fontSize: 12.5, color: C.text2 }}>职级</div><div style={{ fontSize: 13.5, color: C.text0 }}>{adminProfile.title}</div></div><div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }}><div style={{ fontSize: 12.5, color: C.text2 }}>联系电话</div><div style={{ fontSize: 13.5, color: C.text0 }}>{adminProfile.phone}</div></div></div></div>}
              </div>
            </div>
          </CardPad>
        </Card>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.9, textTransform: "uppercase" }}>智能体治理目录</div>
        <div className="agent-directory-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>{governanceAgents.map((agent) => <AgentDirectoryCard key={agent.id} agent={agent} active={selectedAgent === agent.id && detailModalOpen} onOpen={() => { setSelectedAgent(agent.id); setDetailModalOpen(true); }} />)}</div>
      </div>
      {detailModalOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(16,24,40,0.18)", zIndex: 140, padding: 24 }}><div style={{ width: "calc(100vw - 48px)", height: "calc(100vh - 48px)", margin: "0 auto", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}><div><div style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>智能体参数仪表 / 规则详情</div><div style={{ fontSize: 26, fontWeight: 700, color: C.text0 }}>{selectedAgentDetail.chineseName}</div></div><button onClick={() => setDetailModalOpen(false)} style={{ border: "none", background: "transparent", fontSize: 28, lineHeight: 1, color: C.text0, cursor: "pointer", padding: 4 }} aria-label="关闭">×</button></div><div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "22px 24px 28px" }}><div style={{ display: "grid", gap: 18, minHeight: "min-content" }}>{selectedAgentDetail.id === "customer_state" ? <CustomerStateDebugConsolePanel /> : <Card><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}><div><div style={{ fontSize: 11, color: C.text2, fontWeight: 600, letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 8 }}>智能体角色定义 Prompt</div><div style={{ fontSize: 26, fontWeight: 700, color: C.text0, marginBottom: 6 }}>{selectedAgentDetail.chineseName}</div><div style={{ fontSize: 14, color: C.text1, lineHeight: 1.75 }}>{selectedAgentDetail.subtitle}</div></div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Tag label={selectedAgentDetail.statusSummary} variant="blue" /><SecondaryBtn style={{ padding: "8px 12px", fontSize: 12 }}>编辑</SecondaryBtn></div></div><div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", fontSize: 14, color: C.text1, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{selectedAgentDetail.rolePrompt}</div></CardPad></Card>}<Card><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}><SectionTitle>{selectedAgentDetail.tableTitle}</SectionTitle><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><SecondaryBtn style={{ padding: "7px 12px", fontSize: 12 }}>新增规则</SecondaryBtn><PrimaryBtn style={{ padding: "8px 12px", fontSize: 12 }}>保存修改</PrimaryBtn></div></div><GovernanceRuleTable columns={selectedAgentDetail.tableColumns} rows={selectedAgentDetail.tableRows} columnTemplate={selectedAgentDetail.tableColumnTemplate} /></CardPad></Card><Card><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}><SectionTitle>治理变更记录</SectionTitle><GhostBtn>查看全部记录</GhostBtn></div><div style={{ fontSize: 13, color: C.text2, marginBottom: 10 }}>用于回溯该智能体最近是谁改了什么、何时生效，以及影响了哪些页面和角色。</div>{selectedAgentDetail.changeLog.map((item, index) => <GovernanceChangeRow key={`${selectedAgentDetail.id}-${item.effectiveAt}-${item.change}`} item={item} last={index === selectedAgentDetail.changeLog.length - 1} />)}</CardPad></Card></div></div></div></div>}
    </div>
  );
}
