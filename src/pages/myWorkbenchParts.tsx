import { myWorkbench } from "../app/data";
import { C } from "../app/theme";
import { getAlertVariant, getRiskVariant, getTaskStatusVariant, SecondaryBtn, StatusPill, Tag } from "../app/ui";

export type ApprovalItem = (typeof myWorkbench.approvals)[number];

export function WorkItemRow({ item, last = false, onOpenWorkspace }: { item: { customerName: string; stage: string; taskTitle: string; status: string; risk: string; dueTime: string; ownerReason: string }; last?: boolean; onOpenWorkspace: () => void }) {
  return (
    <div className="work-item-row" style={{ padding: "16px 18px", borderBottom: last ? "none" : `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1.4fr 1.8fr 0.9fr 0.9fr auto", gap: 14, alignItems: "center" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text0, letterSpacing: 0.1 }}>{item.customerName}</span>
          <Tag label={item.stage} variant="neutral" small />
        </div>
        <div style={{ fontSize: 13.5, color: C.text2, lineHeight: 1.75, letterSpacing: 0.1 }}>{item.ownerReason}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 15, color: C.text0, fontWeight: 600, marginBottom: 5, letterSpacing: 0.1 }}>{item.taskTitle}</div>
        <div style={{ fontSize: 13.5, color: C.text2 }}>当前阶段：{item.stage}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <StatusPill label={item.status} variant={getTaskStatusVariant(item.status)} />
        <Tag label={item.risk} variant={getRiskVariant(item.risk)} small />
      </div>
      <div style={{ fontSize: 13.5, color: C.text1, lineHeight: 1.7 }}>
        <div style={{ fontSize: 12, color: C.text2, marginBottom: 5 }}>截止时间 / 时间窗口</div>
        <div>{item.dueTime}</div>
      </div>
      <div style={{ justifySelf: "end" }}>
        <SecondaryBtn onClick={onOpenWorkspace} style={{ whiteSpace: "nowrap" }}>进入客户工作台</SecondaryBtn>
      </div>
    </div>
  );
}

export function ApprovalItemRow({ item, last = false, onOpenDetail }: { item: ApprovalItem; last?: boolean; onOpenDetail: (item: ApprovalItem) => void }) {
  return (
    <div className="approval-item-row" style={{ padding: "16px 18px", borderBottom: last ? "none" : `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 0.8fr auto", gap: 14, alignItems: "center" }}>
      <div><div style={{ fontSize: 16, fontWeight: 700, color: C.text0, letterSpacing: 0.1 }}>{item.customerName}</div></div>
      <div style={{ fontSize: 14.5, color: C.text0 }}>{item.type}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <StatusPill label={item.status} variant={item.status.includes("审批") ? "amber" : "blue"} />
      </div>
      <div style={{ fontSize: 13.5, color: C.text2 }}>提交时间：{item.submittedAt}</div>
      <div style={{ display: "flex", gap: 8, justifySelf: "end", flexWrap: "wrap", justifyContent: "flex-end" }}>
        <SecondaryBtn onClick={() => onOpenDetail(item)} style={{ padding: "7px 12px" }}>查看</SecondaryBtn>
      </div>
    </div>
  );
}

export function AlertItemRow({ item, last = false }: { item: (typeof myWorkbench.alerts)[number]; last?: boolean }) {
  return (
    <div style={{ padding: "14px 0", borderBottom: last ? "none" : `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 4fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.text0, letterSpacing: 0.1 }}>{item.customerName}</span>
        <Tag label={item.type} variant={getAlertVariant(item.type)} small />
      </div>
      <div style={{ fontSize: 14, color: C.text1, lineHeight: 1.8, letterSpacing: 0.1 }}>{item.message}</div>
    </div>
  );
}
