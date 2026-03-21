import { myWorkbench } from "../app/data";
import { C } from "../app/theme";
import { ApprovalItem, AlertItemRow, ApprovalItemRow, WorkItemRow } from "./myWorkbenchParts";
import { Card, CardPad, Header, SectionTitle, SummaryStat, Tag } from "../app/ui";

export default function MyWorkbenchPage({ onOpenWorkspace, onOpenApprovalDetail }: { onOpenWorkspace: () => void; onOpenApprovalDetail: (item: ApprovalItem) => void }) {
  type WorkbenchTaskItem = {
    customerName: string;
    stage: string;
    taskTitle: string;
    status: string;
    risk: string;
    dueTime: string;
    ownerReason: string;
  };

  const taskGroups: Array<{ key: keyof typeof myWorkbench.tasks; title: string; count: number; items: readonly WorkbenchTaskItem[] }> = [
    { key: "pending", title: "待执行", count: myWorkbench.tasks.pending.length, items: myWorkbench.tasks.pending },
    { key: "inProgress", title: "执行中", count: myWorkbench.tasks.inProgress.length, items: myWorkbench.tasks.inProgress },
    { key: "submitted", title: "已提交待更新", count: myWorkbench.tasks.submitted.length, items: myWorkbench.tasks.submitted },
    { key: "completed", title: "已完成", count: myWorkbench.tasks.completed.length, items: myWorkbench.tasks.completed },
  ];

  return (
    <div>
      <Header page="myWorkbench" />
      <div style={{ margin: "24px 0 40px", padding: "0 28px", display: "grid", gap: 24 }}>
        <Card>
          <CardPad style={{ paddingBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
              <div>
                <SectionTitle>今日待处理总览</SectionTitle>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.text0, marginBottom: 8, letterSpacing: 0.2 }}>我的工作台</div>
                <div style={{ fontSize: 14.5, color: C.text2, lineHeight: 1.75, letterSpacing: 0.1 }}>优先查看当前待执行事项、待审批输出，以及因路由变更需要你立即接手的客户。</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Tag label="个人视角入口" variant="blue" small />
                <Tag label="业务 owner 工作总览" variant="neutral" small />
              </div>
            </div>
            <div className="workbench-summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 12 }}>
              <SummaryStat label="待执行" value={myWorkbench.summary.todoCount} variant="amber" />
              <SummaryStat label="执行中" value={myWorkbench.summary.inProgressCount} variant="blue" />
              <SummaryStat label="待审批" value={myWorkbench.summary.pendingApprovalCount} variant="amber" />
              <SummaryStat label="新分配" value={myWorkbench.summary.newAssignedCount} variant="amber" />
              <SummaryStat label="高风险" value={myWorkbench.summary.highRiskCount} variant="red" />
            </div>
          </CardPad>
        </Card>

        <Card>
          <CardPad>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
              <div>
                <SectionTitle>我的任务</SectionTitle>
                <div style={{ fontSize: 13, color: C.text2 }}>按执行状态分组，优先回答“我现在最该先处理什么”。</div>
              </div>
              <Tag label="以任务推进为主，不混入审批事项" variant="neutral" small />
            </div>
            <div style={{ display: "grid", gap: 18 }}>
              {taskGroups.map((group) => {
                const tone =
                  group.key === "inProgress"
                    ? { bg: C.blueLight, border: C.blueBorder, tag: "blue" as const }
                    : group.key === "completed"
                      ? { bg: C.greenLight, border: C.greenBorder, tag: "green" as const }
                      : group.key === "submitted"
                        ? { bg: C.amberLight, border: C.amberBorder, tag: "amber" as const }
                        : { bg: "#FFF3EE", border: "#EFC6B8", tag: "amber" as const };
                return (
                  <div key={group.key} style={{ border: `1px solid ${tone.border}`, borderRadius: 12, overflow: "hidden", background: C.surface }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: tone.bg, borderBottom: `1px solid ${tone.border}` }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.text0 }}>{group.title}</div>
                      <Tag label={`${group.count} 项`} variant={tone.tag} small />
                    </div>
                    <div>
                      {group.items.map((item, index) => (
                        <WorkItemRow key={`${group.key}-${item.customerName}-${item.taskTitle}`} item={item} last={index === group.items.length - 1} onOpenWorkspace={onOpenWorkspace} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardPad>
        </Card>

        <Card>
          <CardPad>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
              <div>
                <SectionTitle>待我审批</SectionTitle>
                <div style={{ fontSize: 13, color: C.text2 }}>审批流独立于任务流，用于处理 agent / system output 的人工确认。</div>
              </div>
              <Tag label={`${myWorkbench.approvals.length} 条待处理`} variant="amber" small />
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
              {myWorkbench.approvals.map((item, index) => (
                <ApprovalItemRow key={`${item.customerName}-${item.type}`} item={item} last={index === myWorkbench.approvals.length - 1} onOpenDetail={onOpenApprovalDetail} />
              ))}
            </div>
          </CardPad>
        </Card>

        <div className="workbench-dual" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 22 }}>
          <Card>
            <CardPad>
              <div style={{ marginBottom: 8 }}>
                <SectionTitle>系统提醒 / 最新变化</SectionTitle>
                <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.7 }}>这里说明为什么这些客户、任务和审批会轮到你处理，以及你现在需要介入的原因。</div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                {myWorkbench.alerts.map((item, index) => (
                  <AlertItemRow key={`${item.customerName}-${item.type}`} item={item} last={index === myWorkbench.alerts.length - 1} />
                ))}
              </div>
            </CardPad>
          </Card>
        </div>
      </div>
    </div>
  );
}
