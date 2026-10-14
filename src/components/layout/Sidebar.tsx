'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Shield,
  CircleDot,
  Database,
} from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { COMPANIES, STAGES } from '@/lib/constants';
import { CompanyId } from '@/types';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Sidebar() {
  const {
    activeProjectId,
    sidebarCollapsed,
    searchQuery,
    selectedCompanyFilter,
    setActiveProject,
    toggleSidebar,
    setSearchQuery,
    setSelectedCompanyFilter,
    setNewProjectModalOpen,
    setTrainingModalOpen,
    getFilteredProjects,
  } = useMonoSpecStore();

  const [expandedCompanies, setExpandedCompanies] = useState<Record<CompanyId, boolean>>({
    awamer: true,
    creative: true,
  });

  const toggleCompanyExpand = (companyId: CompanyId) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  const filteredProjects = getFilteredProjects();

  const awamerProjects = filteredProjects.filter((p) => p.companyId === 'awamer');
  const creativeProjects = filteredProjects.filter((p) => p.companyId === 'creative');

  if (sidebarCollapsed) {
    return (
      <aside className="w-16 h-screen border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col items-center justify-between py-4 select-none transition-all duration-200 shrink-0">
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Collapsed Brand Monogram */}
          <button
            onClick={toggleSidebar}
            title="Expand Sidebar"
            className="w-10 h-10 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-black text-lg tracking-tighter hover:opacity-90 transition-opacity"
          >
            M
          </button>

          <button
            onClick={() => setNewProjectModalOpen(true)}
            title="New Project (⌘N)"
            className="w-10 h-10 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] flex items-center justify-center text-[var(--text-primary)] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={() => setTrainingModalOpen(true)}
            title="AI Training Datasets"
            className="w-10 h-10 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Database className="w-4 h-4" />
          </button>

          <div className="w-8 h-px bg-[var(--border-subtle)] my-1" />

          {/* Quick company shortcuts */}
          <button
            onClick={() => setSelectedCompanyFilter(selectedCompanyFilter === 'awamer' ? 'all' : 'awamer')}
            title="Filter Awamer Alshabaka"
            className={`w-9 h-9 rounded-md text-xs font-mono font-bold flex items-center justify-center border transition-all ${
              selectedCompanyFilter === 'awamer'
                ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] border-transparent'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            AWM
          </button>

          <button
            onClick={() => setSelectedCompanyFilter(selectedCompanyFilter === 'creative' ? 'all' : 'creative')}
            title="Filter Creative System"
            className={`w-9 h-9 rounded-md text-xs font-mono font-bold flex items-center justify-center border transition-all ${
              selectedCompanyFilter === 'creative'
                ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] border-transparent'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            CRT
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 w-full px-2">
          <ThemeToggle compact />
          <button
            onClick={toggleSidebar}
            title="Expand Sidebar"
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 h-screen border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between select-none transition-all duration-200 shrink-0">
      {/* Top Header / Branding */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-black text-sm tracking-tighter shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-[var(--text-primary)]">MonoSpec</span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border border-[var(--border-subtle)] text-[var(--text-muted)]">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-none mt-0.5">
                Precision in Every Spec.
              </p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            title="Collapse Sidebar"
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Action: New Project */}
        <button
          onClick={() => setNewProjectModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-medium hover:opacity-95 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>New Project</span>
          </div>
          <span className="text-[10px] opacity-75 font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-primary)]">
            ⌘N
          </span>
        </button>

        {/* Search filter input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Filter projects & specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[var(--border-strong)] transition-colors"
          />
        </div>
      </div>

      {/* Projects List Grouped by Company */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Company 1: Awamer Alshabaka */}
        <div className="space-y-1">
          <button
            onClick={() => toggleCompanyExpand('awamer')}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors group"
          >
            <div className="flex items-center gap-1.5">
              {expandedCompanies.awamer ? (
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              )}
              <div className="text-left">
                <span className="tracking-tight">{COMPANIES.awamer.name}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-normal ml-1.5 font-sans">
                  ({COMPANIES.awamer.nameAr})
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
              {awamerProjects.length}
            </span>
          </button>

          {expandedCompanies.awamer && (
            <div className="space-y-0.5 pl-3 border-l border-[var(--border-subtle)] ml-3">
              {awamerProjects.map((project) => {
                const isActive = project.id === activeProjectId;
                const activeStage = STAGES.find((s) => s.id === project.activeStageId);
                const deliverable = project.stages[project.activeStageId];

                return (
                  <button
                    key={project.id}
                    onClick={() => setActiveProject(project.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex flex-col gap-1 border ${
                      isActive
                        ? 'bg-[var(--bg-surface-elevated)] border-[var(--border-strong)] text-[var(--text-primary)] shadow-xs'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-medium truncate">{project.title}</span>
                      {deliverable?.progress === 100 ? (
                        <CheckCircle2 className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                      ) : (
                        <CircleDot className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                      <span className="truncate">{activeStage?.labelEn}</span>
                      <span className="font-mono">{deliverable?.progress}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Company 2: Creative System */}
        <div className="space-y-1">
          <button
            onClick={() => toggleCompanyExpand('creative')}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors group"
          >
            <div className="flex items-center gap-1.5">
              {expandedCompanies.creative ? (
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              )}
              <div className="text-left">
                <span className="tracking-tight">{COMPANIES.creative.name}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-normal ml-1.5 font-sans">
                  ({COMPANIES.creative.nameAr})
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
              {creativeProjects.length}
            </span>
          </button>

          {expandedCompanies.creative && (
            <div className="space-y-0.5 pl-3 border-l border-[var(--border-subtle)] ml-3">
              {creativeProjects.map((project) => {
                const isActive = project.id === activeProjectId;
                const activeStage = STAGES.find((s) => s.id === project.activeStageId);
                const deliverable = project.stages[project.activeStageId];

                return (
                  <button
                    key={project.id}
                    onClick={() => setActiveProject(project.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex flex-col gap-1 border ${
                      isActive
                        ? 'bg-[var(--bg-surface-elevated)] border-[var(--border-strong)] text-[var(--text-primary)] shadow-xs'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-medium truncate">{project.title}</span>
                      {deliverable?.progress === 100 ? (
                        <CheckCircle2 className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                      ) : (
                        <CircleDot className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                      <span className="truncate">{activeStage?.labelEn}</span>
                      <span className="font-mono">{deliverable?.progress}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Theme Switcher & User Profile */}
      <div className="p-3 border-t border-[var(--border-subtle)] space-y-3 bg-[var(--bg-surface)]">
        {/* AI Training Datasets trigger */}
        <button
          onClick={() => setTrainingModalOpen(true)}
          title="Manage Few-Shot Training Datasets"
          className="w-full flex items-center justify-between p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-primary)] transition-colors group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Database className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
            <span className="font-semibold text-xs truncate">AI Training Data</span>
          </div>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)]">
            RAG
          </span>
        </button>

        {/* Theme mode toggle */}
        <div>
          <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] mb-1.5 px-0.5">
            Appearance
          </div>
          <ThemeToggle />
        </div>

        {/* User profile card */}
        <div className="flex items-center justify-between p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-bold text-xs shrink-0">
              LA
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                Lead Architect
              </div>
              <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Enterprise Active</span>
              </div>
            </div>
          </div>
          <span className="text-[9px] font-mono px-1 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--text-muted)]">
            PRO
          </span>
        </div>
      </div>
    </aside>
  );
}
