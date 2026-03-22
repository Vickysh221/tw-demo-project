import type { CSSProperties, ReactNode } from "react";

export type PageId = "myWorkbench" | "workspaceSales" | "workspaceCs" | "sales" | "cs" | "governance";
export type WorkspaceRoleVariant = "sales" | "cs";
export type PillVariant = "green" | "blue" | "amber" | "red" | "neutral";
export type TagVariant = PillVariant | "purple";
export type TaskPanelState = "待执行" | "执行中" | "整理中" | "确认本轮结果" | "无任务";
export type ActionCardStatus = "none" | "executed" | "confirmed" | "communicated" | "synced";

export type StatusPillProps = {
  label: string;
  variant: PillVariant;
};

export type TagProps = {
  label: string;
  variant?: TagVariant;
  small?: boolean;
};

export type SectionTitleProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export type RowProps = {
  children: ReactNode;
  last?: boolean;
  style?: CSSProperties;
};

export type CardProps = {
  children: ReactNode;
  style?: CSSProperties;
  noPad?: boolean;
};

export type HeaderProps = {
  page: PageId;
};

export type WorkspacePageProps = {
  roleVariant: WorkspaceRoleVariant;
  taskPanelState: TaskPanelState;
  setTaskPanelState: (state: TaskPanelState) => void;
};

export type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
};

export type DecisionTensionData = {
  title: string;
  leftLabel: string;
  leftSummary: string;
  leftForces: readonly string[];
  rightLabel: string;
  rightSummary: string;
  rightForces: readonly string[];
  currentBalance: string;
  balanceDirection: "left" | "right" | "center";
  whyItMatters: string;
  actionHint: string;
  evidenceEntryLabel: string;
  evidence: readonly string[];
};

export interface ActionDecisionOption {
  id: string;
  label: string;
  isPrimary?: boolean;
}

export interface ActionExecutionResult {
  status: ActionCardStatus;
  statusLabel: string;
  meta?: string;
  bullets: string[];
  stateTransition?: string;
}

export interface ActionRecommendationItem {
  id: string;
  roleVariant: WorkspaceRoleVariant;
  title: string;
  shortHint?: string;
  confidence: number;
  badgeLabel?: string;
  panelTitle: string;
  description: string;
  basedOn: string[];
  impact: string[];
  risk: string[];
  decisionQuestion: string;
  decisionOptions: ActionDecisionOption[];
  executionResult: ActionExecutionResult;
  feedback?: {
    liked?: boolean | null;
  };
}
