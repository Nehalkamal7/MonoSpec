import { create } from 'zustand';
import { Project, StageId, ChatMessage, CompanyId } from '@/types';
import { INITIAL_PROJECTS, INITIAL_CHAT_MESSAGES } from '@/lib/mock-data';
import { STAGES } from '@/lib/constants';

export type CanvasViewMode = 'split' | 'canvas-only' | 'chat-only';

interface MonoSpecStore {
  // Projects
  projects: Project[];
  activeProjectId: string;
  activeStageId: StageId;
  searchQuery: string;
  selectedCompanyFilter: CompanyId | 'all';

  // UI state
  sidebarCollapsed: boolean;
  canvasViewMode: CanvasViewMode;
  isNewProjectModalOpen: boolean;
  isFigmaModalOpen: boolean;
  isDemoModalOpen: boolean;
  isGeneratingSpec: boolean;

  // Chat feeds per project-stage
  chatMessages: Record<string, ChatMessage[]>;

  // Computed getters
  getActiveProject: () => Project | undefined;
  getActiveDeliverable: () => Project['stages'][StageId] | undefined;
  getFilteredProjects: () => Project[];

  // Actions
  setActiveProject: (id: string) => void;
  setActiveStage: (stageId: StageId) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCompanyFilter: (filter: CompanyId | 'all') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCanvasViewMode: (mode: CanvasViewMode) => void;
  setNewProjectModalOpen: (open: boolean) => void;
  setFigmaModalOpen: (open: boolean) => void;
  setDemoModalOpen: (open: boolean) => void;

  // Data mutation actions
  createProject: (params: {
    title: string;
    companyId: CompanyId;
    description: string;
    architectureTier: Project['architectureTier'];
  }) => Project;
  updateSpecMarkdown: (projectId: string, stageId: StageId, markdown: string) => void;
  toggleChecklistItem: (projectId: string, stageId: StageId, checkId: string) => void;
  sendChatMessage: (content: string) => void;
  quickGenerateForActiveStage: (promptType: string) => void;
}

export const useMonoSpecStore = create<MonoSpecStore>((set, get) => ({
  projects: INITIAL_PROJECTS,
  activeProjectId: INITIAL_PROJECTS[0].id,
  activeStageId: INITIAL_PROJECTS[0].activeStageId,
  searchQuery: '',
  selectedCompanyFilter: 'all',

  sidebarCollapsed: false,
  canvasViewMode: 'split',
  isNewProjectModalOpen: false,
  isFigmaModalOpen: false,
  isDemoModalOpen: false,
  isGeneratingSpec: false,

  chatMessages: INITIAL_CHAT_MESSAGES,

  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find((p) => p.id === activeProjectId) ?? projects[0];
  },

  getActiveDeliverable: () => {
    const project = get().getActiveProject();
    if (!project) return undefined;
    return project.stages[get().activeStageId];
  },

  getFilteredProjects: () => {
    const { projects, searchQuery, selectedCompanyFilter } = get();
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCompany =
        selectedCompanyFilter === 'all' || p.companyId === selectedCompanyFilter;
      return matchesSearch && matchesCompany;
    });
  },

  setActiveProject: (id) => {
    const project = get().projects.find((p) => p.id === id);
    if (project) {
      set({
        activeProjectId: id,
        activeStageId: project.activeStageId,
      });
    }
  },

  setActiveStage: (stageId) => set({ activeStageId: stageId }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedCompanyFilter: (filter) => set({ selectedCompanyFilter: filter }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setCanvasViewMode: (mode) => set({ canvasViewMode: mode }),

  setNewProjectModalOpen: (open) => set({ isNewProjectModalOpen: open }),

  setFigmaModalOpen: (open) => set({ isFigmaModalOpen: open }),

  setDemoModalOpen: (open) => set({ isDemoModalOpen: open }),

  createProject: ({ title, companyId, description, architectureTier }) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newId = `proj-${companyId.slice(0, 3)}-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const emptyStages: Project['stages'] = STAGES.reduce((acc, stage) => {
      acc[stage.id] = {
        stageId: stage.id,
        status: stage.id === 'tech_analysis' ? 'in_progress' : 'pending',
        progress: stage.id === 'tech_analysis' ? 10 : 0,
        specTitle: `${stage.labelEn} Specification`,
        updatedAt: now,
        checklist: [
          { id: `${stage.id}-chk-1`, text: `Define foundational requirements for ${stage.labelEn}`, done: false },
          { id: `${stage.id}-chk-2`, text: `Draft peer-reviewed specification document`, done: false },
          { id: `${stage.id}-chk-3`, text: `Sign-off with enterprise stakeholder team`, done: false },
        ],
        specMarkdown: `# ${stage.labelEn} Specification: ${title}
**Company:** ${companyId === 'awamer' ? 'Awamer Alshabaka' : 'Creative System'}  
**Status:** Initial Draft  
**Created:** ${new Date().toLocaleDateString()}

---

## 1. Scope & Objective
This document outlines the precision engineering guidelines for the **${stage.labelEn}** stage of the project.

\`\`\`typescript
export interface SystemContext {
  projectId: "${newId}";
  stage: "${stage.id}";
  timestamp: ${Date.now()};
}
\`\`\`
`,
      };
      return acc;
    }, {} as Project['stages']);

    const newProject: Project = {
      id: newId,
      slug,
      title,
      companyId,
      description,
      activeStageId: 'tech_analysis',
      createdAt: now,
      updatedAt: now,
      status: 'active',
      architectureTier,
      stages: emptyStages,
    };

    set((state) => ({
      projects: [newProject, ...state.projects],
      activeProjectId: newId,
      activeStageId: 'tech_analysis',
      isNewProjectModalOpen: false,
    }));

    return newProject;
  },

  updateSpecMarkdown: (projectId, stageId, markdown) => {
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          updatedAt: new Date().toISOString(),
          stages: {
            ...p.stages,
            [stageId]: {
              ...p.stages[stageId],
              specMarkdown: markdown,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      }),
    }));
  },

  toggleChecklistItem: (projectId, stageId, checkId) => {
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p;
        const currentStage = p.stages[stageId];
        const updatedChecklist = currentStage.checklist.map((item) =>
          item.id === checkId ? { ...item, done: !item.done } : item
        );
        const doneCount = updatedChecklist.filter((c) => c.done).length;
        const progress = Math.round((doneCount / updatedChecklist.length) * 100);

        return {
          ...p,
          updatedAt: new Date().toISOString(),
          stages: {
            ...p.stages,
            [stageId]: {
              ...currentStage,
              checklist: updatedChecklist,
              progress,
              status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending',
              updatedAt: new Date().toISOString(),
            },
          },
        };
      }),
    }));
  },

  sendChatMessage: (content) => {
    const { activeProjectId, activeStageId, chatMessages } = get();
    const chatKey = `${activeProjectId}-${activeStageId}`;
    const currentMsgs = chatMessages[chatKey] || [];

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      projectId: activeProjectId,
      stageId: activeStageId,
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set({
      chatMessages: {
        ...chatMessages,
        [chatKey]: [...currentMsgs, userMsg],
      },
      isGeneratingSpec: true,
    });

    // Simulate precise architectural assistant response
    setTimeout(() => {
      const activeProject = get().getActiveProject();
      const stageName = STAGES.find((s) => s.id === activeStageId)?.labelEn || activeStageId;
      
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        projectId: activeProjectId,
        stageId: activeStageId,
        sender: 'assistant',
        content: `### Architectural Analysis & Verification
I have evaluated your request for **${activeProject?.title}** in the **${stageName}** stage.

The specification parameters have been recalculated to ensure strict adherence to our monochrome enterprise standard:
- **Resilience Strategy:** Zero single-point-of-failure with distributed quorum.
- **Traceability:** Correlated transaction telemetry logged to OpenTelemetry collector.

\`\`\`typescript
// Precision Specification Assertion
export const specValidation = {
  verified: true,
  complianceLevel: "Enterprise Strict",
  latencyBudgetMs: 85,
  timestamp: ${Date.now()},
};
\`\`\`

Would you like me to incorporate this directly into the live specification canvas?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Append to Spec Canvas', action: 'append_spec' },
          { label: 'Generate Unit Assertions', action: 'gen_assertions' },
          { label: 'Export Audit Log', action: 'export_audit' },
        ],
      };

      set((state) => ({
        chatMessages: {
          ...state.chatMessages,
          [chatKey]: [...(state.chatMessages[chatKey] || []), assistantMsg],
        },
        isGeneratingSpec: false,
      }));
    }, 700);
  },

  quickGenerateForActiveStage: (promptType) => {
    const { sendChatMessage } = get();
    const prompts: Record<string, string> = {
      schema: 'Generate OpenAPI 3.1 specification schema with strict validation rules and error response definitions.',
      security: 'Perform a threat boundary analysis and define OAuth 2.1 authorization scopes with mTLS requirements.',
      perf: 'Draft k6 high-concurrency performance benchmark scenarios targeting 20,000 requests per second.',
      figma: 'Extract design tokens (spacing, typography, monochrome palette) into Figma Tokens JSON format.',
      ci: 'Generate hardened GitHub Actions CI/CD workflow pipeline with static security scanning and Trivy container audit.',
    };
    sendChatMessage(prompts[promptType] || 'Analyze current stage specifications and identify optimization vectors.');
  },
}));
