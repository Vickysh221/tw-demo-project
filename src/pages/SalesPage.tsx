import { useState } from "react";
import { customer } from "../app/data";
import { C } from "../app/theme";
import { AgentBlock, Card, CardPad, DecisionTensionCard, Header, PrimaryBtn, Row, SecondaryBtn, SectionTitle, Tag, DangerBtn } from "../app/ui";

export default function SalesPage() {
  const [inputText, setInputText] = useState("");
  const signal = "刘总说他老婆更想买奔驰，觉得比亚迪不够档次，但他自己挺喜欢这个车的智能系统，就是觉得价格高了点。";
  const approvalMaterials = [
    { agent: "Sales Agent", title: "销售跟进摘要", summary: "确认客户本人仍保持高意向，但家庭决策已从单人推进切换为双人共识推进。", time: "今天 10:20" },
    { agent: "Sales Agent", title: "现场补充记录", summary: "建议优先组织家庭到店体验，并提前准备品牌对比与空间体验素材。", time: "今天 10:26" },
    { agent: "Customer Agent", title: "状态候选更新", summary: "配偶从隐性阻力升级为关键影响者，预算与品牌认知成为主状态张力。", time: "今天 10:28" },
  ] as const;
  const candidates = {
    priorities: ["配偶认可度（新增，优先级高）", "品牌认知与功能体验的决策权重"],
    objections: ["配偶偏好传统品牌（新增）", "价格偏高（确认，持续）"],
    tension: {
      title: "功能体验偏好 vs 品牌认知与价格阻力",
      leftLabel: "功能体验偏好",
      leftSummary: "客户本人已表现出对智能系统的明确兴趣，技术体验仍是可推进点。",
      leftForces: ["挺喜欢智能系统", "客户本人保持正向体验反馈", "功能优势仍有说服空间"],
      rightLabel: "品牌认知与价格阻力",
      rightSummary: "配偶偏好传统品牌，同时价格偏高让家庭决策更保守。",
      rightForces: ["老婆更想买奔驰", "觉得不够档次", "价格高了点"],
      currentBalance: "当前仍受品牌认知阻力主导，价格敏感同步压制推进",
      balanceDirection: "right" as const,
      whyItMatters: "这说明下一步不能继续只讲参数，而要优先处理家庭层面的品牌顾虑。",
      actionHint: "先补品牌对比材料和家庭体验场景，再判断是否适合进入报价推进。",
      evidenceEntryLabel: "Based on 3 signals",
      evidence: ["「他老婆更想买奔驰」→ 配偶主动偏好", "「觉得不够档次」→ 品牌感知障碍", "「价格高了点」→ 价格阻力确认"],
    },
  } as const;

  return (
    <div>
      <Header page="sales" />
      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24, maxWidth: 1200, margin: "24px auto", padding: "0 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ borderColor: C.amberBorder }}>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <div><SectionTitle>待审批详情</SectionTitle><div style={{ fontSize: 13, color: C.text2 }}>默认展示 Sales Agent 与 Customer Agent 的材料，用于你完成本次审批。</div></div>
                <Tag label="销售视角" variant="amber" small />
              </div>
              <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>{approvalMaterials.map((item) => <div key={`${item.agent}-${item.title}`} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}><div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><Tag label={item.agent} variant={item.agent === "Sales Agent" ? "blue" : "neutral"} small /><span style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>{item.title}</span></div><span style={{ fontSize: 12, color: C.text2 }}>{item.time}</span></div><div style={{ fontSize: 13, color: C.text1, lineHeight: 1.7 }}>{item.summary}</div></div>)}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><PrimaryBtn style={{ minWidth: 106 }}>审批</PrimaryBtn><SecondaryBtn style={{ minWidth: 180 }}>修改后提交</SecondaryBtn><DangerBtn style={{ minWidth: 106 }}>驳回</DangerBtn></div>
            </CardPad>
          </Card>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>理解构建</div>
          <Card><CardPad><SectionTitle>输入区</SectionTitle><div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}><input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="输入拜访记录、客户原话或关键信号…" style={{ flex: 1, minWidth: 220, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: C.text0, background: C.surface, outline: "none", fontFamily: C.sans }} /><SecondaryBtn style={{ padding: "9px 12px", fontSize: 16 }}>🎤</SecondaryBtn><PrimaryBtn>分析</PrimaryBtn></div><div style={{ fontSize: 12, color: C.text2 }}>近期背景：第二次试驾完成 · 配偶加入决策 · 价格阻力持续</div></CardPad></Card>
          <Card><CardPad><SectionTitle>原始信号</SectionTitle><div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", fontSize: 13.5, color: C.text0, lineHeight: 1.8, fontStyle: "italic", marginBottom: 12 }}>{signal}</div><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>关键信号短语</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{["老婆更想买奔驰", "不够档次", "挺喜欢智能系统", "价格高了点"].map((phrase) => <Tag key={phrase} label={phrase} variant="amber" />)}</div></CardPad></Card>
          <Card><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><SectionTitle>人工解读</SectionTitle><Tag label="置信度高" variant="green" small /></div><div style={{ fontSize: 13.5, color: C.text0, lineHeight: 1.75, marginBottom: 10 }}>核心判断：<strong>决策核心已从刘浩个人变为双核家庭决策</strong>，配偶持有品牌否决权，价格是次要但持续的阻力。</div><div style={{ background: C.surfaceAlt, borderRadius: 6, padding: "9px 12px", fontSize: 12.5, color: C.text1, lineHeight: 1.65 }}>系统理解：「不够档次」反映的是品牌社会认知问题，而非产品功能问题。配偶介入是关键状态变化。</div></CardPad></Card>
          <Card style={{ borderColor: C.greenBorder }}><CardPad><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><SectionTitle>候选状态更新</SectionTitle><Tag label="待确认" variant="amber" /></div>{[{ label: "关注重点：新增", items: candidates.priorities }, { label: "异议事项：更新", items: candidates.objections }].map((section) => <div key={section.label} style={{ marginBottom: 12 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>{section.label}</div>{section.items.map((item) => <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 10px", background: C.greenLight, borderRadius: 7, marginBottom: 5, border: `1px solid ${C.greenBorder}` }}><span style={{ color: C.green, fontWeight: 700 }}>+</span><span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item}</span><SecondaryBtn style={{ padding: "3px 10px", fontSize: 11 }}>编辑</SecondaryBtn></div>)}</div>)}<div style={{ marginBottom: 14 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>决策张力：更新</div><DecisionTensionCard data={candidates.tension} compact /></div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><PrimaryBtn style={{ flex: 1 }}>确认状态更新</PrimaryBtn><SecondaryBtn>修改</SecondaryBtn></div></CardPad></Card>
          <Card><CardPad><SectionTitle>置信度与不确定性</SectionTitle><div style={{ marginBottom: 12 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>低置信字段</div>{["配偶的具体品牌偏好来源", "配偶在决策中的实际否决权重"].map((field, index) => <Row key={field} last={index === 1}><span style={{ color: C.amber, fontWeight: 700 }}>~</span><span style={{ fontSize: 13, color: C.text1 }}>{field}</span></Row>)}</div><div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>待解问题</div>{["配偶是否有机会直接体验产品？", "是否存在家庭联合决策的最优接触点？"].map((question, index) => <Row key={question} last={index === 1}><span style={{ color: C.red, fontWeight: 700 }}>?</span><span style={{ fontSize: 13, color: C.text0 }}>{question}</span></Row>)}<div style={{ marginTop: 10, background: C.surfaceAlt, borderRadius: 6, padding: "9px 12px", fontSize: 12, color: C.text2 }}>置信度影响：配偶决策权不明 → 整体置信度维持 72%，等待配偶体验后再评估</div></CardPad></Card>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, letterSpacing: 0.8, textTransform: "uppercase" }}>编排反馈</div>
          <Card style={{ borderColor: C.blueBorder }}><CardPad><div style={{ fontSize: 10.5, fontWeight: 600, color: C.blue, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>当前负责人</div><div style={{ fontSize: 16, fontWeight: 700, color: C.text0 }}>{customer.currentOwner}</div><div style={{ fontSize: 12, color: C.text2 }}>当前路径：进行中 · 暂无转交</div></CardPad></Card>
          <Card><CardPad><SectionTitle>建议下一步动作</SectionTitle><div style={{ fontSize: 13.5, color: C.text0, lineHeight: 1.7, background: C.surfaceAlt, padding: "10px 12px", borderRadius: 7, marginBottom: 12 }}>{customer.currentTask.recommendedAction}</div><div style={{ fontSize: 11, color: C.text2, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>时间窗口</div><div style={{ fontSize: 13, color: C.amber, fontWeight: 500 }}>{customer.currentTask.timeWindow}</div></CardPad></Card>
          <Card style={{ borderColor: C.redBorder }}><CardPad style={{ paddingBottom: 8 }}><SectionTitle>受限动作</SectionTitle>{customer.currentTask.blockedActions.map((action, index) => <Row key={action} last={index === customer.currentTask.blockedActions.length - 1}><span style={{ color: C.red, fontWeight: 700 }}>✕</span><span style={{ fontSize: 13, color: C.text1 }}>{action}</span></Row>)}</CardPad></Card>
          <Card style={{ borderColor: C.amberBorder }}><CardPad><div style={{ fontSize: 10.5, fontWeight: 600, color: C.amber, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>审核级别</div><div style={{ fontSize: 13, color: C.text0 }}>{customer.currentTask.reviewState}</div></CardPad></Card>
          <AgentBlock text={customer.currentTask.agentDraft} label="角色助手 · 建议话术" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><PrimaryBtn style={{ flex: 1 }}>提交记录</PrimaryBtn><SecondaryBtn>保存草稿</SecondaryBtn></div>
        </div>
      </div>
    </div>
  );
}
