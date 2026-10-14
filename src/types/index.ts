export type CompanyId = 'awamer' | 'creative';

export interface Company {
  id: CompanyId;
  name: string;
  nameAr: string;
  tagline: string;
  code: string;
}

export type StageId =
  | 'tech_analysis'
  | 'ui_ux'
  | 'engineering'
  | 'qa_testing'
  | 'content'
  | 'devops';

export interface StageDefinition {
  id: StageId;
  index: number;
  labelEn: string;
  labelAr: string;
  shortDesc: string;
  badge: string;
}

export interface SpecSection {
  id: string;
  title: string;
  contentMarkdown: string;
  lastUpdated: string;
  author: string;
  status: 'draft' | 'in_review' | 'approved' | 'deprecated';
}

export interface StageDeliverable {
  stageId: StageId;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  progress: number; // 0 - 100
  specTitle: string;
  specMarkdown: string;
  checklist: { id: string; text: string; done: boolean }[];
  updatedAt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  companyId: CompanyId;
  description: string;
  activeStageId: StageId;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'review';
  architectureTier: 'Tier 1 Enterprise' | 'Core Platform' | 'Mission Critical';
  figmaUrl?: string;
  demoUrl?: string;
  stages: Record<StageId, StageDeliverable>;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  stageId: StageId;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
  codeSnippets?: { language: string; filename?: string; code: string }[];
}

export type ThemeMode = 'dark' | 'light' | 'system';
