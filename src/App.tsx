import { useState } from "react";
import { profileUpdatePacket } from "./app/data";
import { C } from "./app/theme";
import type { PageId, TaskPanelState } from "./app/types";
import { Card, CardPad, DecisionTensionCard, PrimaryBtn, SecondaryBtn, SectionTitle, Tag } from "./app/ui";
import CSPage from "./pages/CSPage";
import GovernancePage from "./pages/GovernancePage";
import MyWorkbenchPage from "./pages/MyWorkbenchPage";
import SalesPage from "./pages/SalesPage";
import WorkspacePage from "./pages/WorkspacePage";
import type { ApprovalItem } from "./pages/myWorkbenchParts";

const taskStateOptions: TaskPanelState[] = ["待执行", "执行中", "整理中", "确认本轮结果", "已提交"];

const nav: Array<{ id: PageId; label: string }> = [
  { id: "myWorkbench", label: "我的工作台" },
  { id: "workspaceSales", label: "客户状态工作台" },
  { id: "workspaceCs", label: "客户状态工作台" },
  { id: "sales", label: "销售轻记录" },
  { id: "cs", label: "客服触达检查" },
  { id: "governance", label: "智能体后台管理" },
];

export default function App() {
  const [page, setPage] = useState<PageId>("myWorkbench");
  const [globalTaskState, setGlobalTaskState] = useState<TaskPanelState>("待执行");
  const [messagePanelOpen, setMessagePanelOpen] = useState(false);

  const openApprovalDetail = (item: ApprovalItem) => {
    setMessagePanelOpen(false);
    setPage(item.source === "CS Agent" ? "cs" : "sales");
  };

  const messages =
    globalTaskState === "确认本轮结果"
      ? [
          {
            id: "profile-update",
            title: profileUpdatePacket.title,
            subtitle: "客户画像候选更新待你确认",
            time: "刚刚",
            unread: true,
          },
        ]
      : [];

  return (
    <div className="min-h-screen bg-stone-100" style={{ fontFamily: C.sans, background: C.bg, minHeight: "100vh", color: C.text0 }}>
      <style>{`
        input:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px ${C.blueLight}; }
        textarea:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px ${C.blueLight}; outline: none; }
        button:hover { opacity: 0.94; }
        @media (max-width: 980px) {
          .workbench-dual,
          .workbench-summary-grid,
          .work-item-row,
          .approval-item-row,
          .top-dual,
          .decision-tension-grid,
          .governance-top-grid,
          .governance-summary-grid,
          .governance-module-grid,
          .governance-row-grid,
          .governance-rule-grid,
          .governance-detail-grid,
          .agent-directory-grid,
          .detail-cards-grid,
          .two-col,
          .split-grid,
          .task-state-grid,
          .task-grid,
          .mini-grid,
          .execution-live-grid { grid-template-columns: 1fr !important; }
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
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: C.text0,
            padding: "14px 16px",
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            margin: "10px 4px 10px 0",
            letterSpacing: -0.3,
            flexShrink: 0,
            background: C.surfaceAlt,
          }}
        >
          客户旅程<span style={{ color: C.brick }}>·</span>系统
        </div>
        <div style={{ display: "flex", alignItems: "center", overflowX: "auto", flex: 1 }}>
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                background: page === item.id ? C.surfaceAlt : "transparent",
                border: `1px solid ${page === item.id ? C.border : "transparent"}`,
                borderRadius: 10,
                padding: "10px 14px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: page === item.id ? 600 : 500,
                color: page === item.id ? C.text0 : C.text2,
                margin: "0 4px",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span>{item.label}</span>
                {item.id === "workspaceSales" && <Tag label="销售版本" variant="blue" small />}
                {item.id === "workspaceCs" && <Tag label="客服版本" variant="green" small />}
              </span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ display: "flex", background: C.surfaceAlt, borderRadius: 10, padding: 4, border: `1px solid ${C.border}` }}>
            {taskStateOptions.map((state) => (
              <button
                key={state}
                onClick={() => setGlobalTaskState(state)}
                style={{
                  padding: "7px 10px",
                  borderRadius: 8,
                  border: `1px solid ${globalTaskState === state ? C.border : "transparent"}`,
                  background: globalTaskState === state ? C.surface : "transparent",
                  color: globalTaskState === state ? C.text0 : C.text2,
                  fontSize: 12,
                  fontWeight: globalTaskState === state ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {state}
              </button>
            ))}
          </div>
          <button
            onClick={() => setMessagePanelOpen((prev) => !prev)}
            style={{
              position: "relative",
              border: `1px solid ${C.border}`,
              background: C.surface,
              borderRadius: 999,
              width: 38,
              height: 38,
              cursor: "pointer",
              color: C.text1,
              fontSize: 15,
            }}
          >
            信
            {messages.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -2,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  background: C.red,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
              >
                {messages.length}
              </span>
            )}
          </button>
          <div
            onClick={() => setPage("myWorkbench")}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: C.brick,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
            title="进入我的工作台"
          >
            王
          </div>
        </div>
      </div>

      {messagePanelOpen && (
        <div style={{ position: "fixed", top: 66, right: 28, width: 420, maxWidth: "calc(100vw - 32px)", zIndex: 120 }}>
          <Card style={{ boxShadow: "0 8px 24px rgba(16,24,40,0.08)" }}>
            <CardPad>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text0 }}>个人消息</div>
                  <div style={{ fontSize: 12, color: C.text2 }}>用于处理助手推送与待确认更新</div>
                </div>
                <SecondaryBtn style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => setMessagePanelOpen(false)}>
                  关闭
                </SecondaryBtn>
              </div>
              {messages.length === 0 ? (
                <div style={{ background: C.surfaceAlt, borderRadius: 10, padding: "14px 16px", fontSize: 13, color: C.text2 }}>当前没有新的个人消息。</div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text0 }}>{messages[0].title}</div>
                      <Tag label="待确认" variant="amber" small />
                    </div>
                    <div style={{ fontSize: 12, color: C.text2 }}>
                      {messages[0].subtitle} · {messages[0].time}
                    </div>
                  </div>
                  <div style={{ border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "12px 14px", background: C.surface }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <SectionTitle>{profileUpdatePacket.title}</SectionTitle>
                      <Tag label={profileUpdatePacket.status} variant="amber" />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>关注重点：新增</div>
                      {profileUpdatePacket.priorities.map((item) => (
                        <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 10px", background: C.greenLight, borderRadius: 7, marginBottom: 5, border: `1px solid ${C.greenBorder}` }}>
                          <span style={{ color: C.green, fontWeight: 700 }}>+</span>
                          <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item}</span>
                          <SecondaryBtn style={{ padding: "3px 10px", fontSize: 11 }}>编辑</SecondaryBtn>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>异议事项：更新</div>
                      {profileUpdatePacket.objections.map((item) => (
                        <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 10px", background: C.greenLight, borderRadius: 7, marginBottom: 5, border: `1px solid ${C.greenBorder}` }}>
                          <span style={{ color: C.green, fontWeight: 700 }}>+</span>
                          <span style={{ fontSize: 13, color: C.text0, flex: 1 }}>{item}</span>
                          <SecondaryBtn style={{ padding: "3px 10px", fontSize: 11 }}>编辑</SecondaryBtn>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text2, marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>决策张力：更新</div>
                      <DecisionTensionCard data={profileUpdatePacket.tension} compact />
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <PrimaryBtn onClick={() => setGlobalTaskState("已提交")}>确认状态更新</PrimaryBtn>
                      <SecondaryBtn>修改</SecondaryBtn>
                    </div>
                  </div>
                </div>
              )}
            </CardPad>
          </Card>
        </div>
      )}

      {page === "myWorkbench" && <MyWorkbenchPage onOpenWorkspace={() => setPage("workspaceSales")} onOpenApprovalDetail={openApprovalDetail} />}
      {page === "workspaceSales" && <WorkspacePage roleVariant="sales" taskPanelState={globalTaskState} setTaskPanelState={setGlobalTaskState} onOpenMessages={() => setMessagePanelOpen(true)} />}
      {page === "workspaceCs" && <WorkspacePage roleVariant="cs" taskPanelState={globalTaskState} setTaskPanelState={setGlobalTaskState} onOpenMessages={() => setMessagePanelOpen(true)} />}
      {page === "sales" && <SalesPage />}
      {page === "cs" && <CSPage />}
      {page === "governance" && <GovernancePage />}
    </div>
  );
}
