'use client';

import React from 'react';
import {
  FileCode2,
  Palette,
  Terminal,
  CheckSquare,
  FileText,
  Server,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { STAGES } from '@/lib/constants';
import { StageId } from '@/types';

const STAGE_ICONS: Record<StageId, typeof FileCode2> = {
  tech_analysis: FileCode2,
  ui_ux: Palette,
  engineering: Terminal,
  qa_testing: CheckSquare,
  content: FileText,
  devops: Server,
};

export function StageNavigation() {
  const { activeStageId, setActiveStage, getActiveProject } = useMonoSpecStore();
  const activeProject = getActiveProject();

  if (!activeProject) return null;

  return (
    <nav className="h-14 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 flex items-center overflow-x-auto no-scrollbar select-none transition-colors">
      <div className="flex items-center gap-1.5 w-full min-w-max">
        {STAGES.map((stage) => {
          const isActive = stage.id === activeStageId;
          const deliverable = activeProject.stages[stage.id];
          const Icon = STAGE_ICONS[stage.id];
          const isDone = deliverable?.progress === 100;

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs transition-all border ${
                isActive
                  ? 'bg-[var(--bg-canvas)] border-[var(--border-strong)] text-[var(--text-primary)] shadow-xs'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {/* Stage Index & Icon */}
              <div className="flex items-center gap-1.5 font-mono">
                <span
                  className={`text-[11px] font-bold ${
                    isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  0{stage.index}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`} />
              </div>

              {/* Labels (English + Arabic) */}
              <div className="flex flex-col text-left leading-tight">
                <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {stage.labelEn}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-sans opacity-85">
                  {stage.labelAr}
                </span>
              </div>

              {/* Progress Indicator */}
              <div className="ml-1 flex items-center gap-1 pl-1.5 border-l border-[var(--border-subtle)]">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--text-primary)]" />
                ) : (
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {deliverable?.progress ?? 0}%
                  </span>
                )}
              </div>

              {/* Active High-Contrast Bottom Indicator Pill */}
              {isActive && (
                <span className="absolute bottom-[-1px] left-3 right-3 h-[2px] bg-[var(--border-strong)] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
