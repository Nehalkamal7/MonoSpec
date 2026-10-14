'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  Download,
  Copy,
  Check,
  Edit3,
  Eye,
  CheckSquare,
  Square,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Maximize2,
} from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { STAGES, COMPANIES } from '@/lib/constants';
import { CodeBlock } from './CodeBlock';

export function SpecCanvas() {
  const {
    getActiveProject,
    activeStageId,
    updateSpecMarkdown,
    toggleChecklistItem,
  } = useMonoSpecStore();

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeProject = getActiveProject();

  if (!activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-[var(--text-muted)] text-sm">
        Select a project to inspect architectural specifications.
      </div>
    );
  }

  const deliverable = activeProject.stages[activeStageId];
  const stageDef = STAGES.find((s) => s.id === activeStageId);
  const company = COMPANIES[activeProject.companyId];

  const handleCopyMarkdown = () => {
    if (typeof window !== 'undefined' && deliverable?.specMarkdown) {
      navigator.clipboard.writeText(deliverable.specMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    if (typeof window === 'undefined' || !deliverable) return;
    const blob = new Blob([deliverable.specMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeProject.slug}-${stageDef?.id || 'spec'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-canvas)] border-l border-[var(--border-subtle)] overflow-hidden transition-colors">
      {/* Spec Canvas Toolbar */}
      <div className="h-12 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            Specification Document
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
            {stageDef?.badge}
          </span>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-1.5">
          {/* Edit / Preview Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] transition-colors"
          >
            {isEditing ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Raw</span>
              </>
            )}
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            title="Copy Spec as Markdown"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download .md */}
          <button
            onClick={handleDownloadFile}
            title="Download .md file"
            className="flex items-center gap-1 p-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Spec Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Definition of Done (DoD) Checklist Card */}
        {deliverable && deliverable.checklist.length > 0 && (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  Stage Definition of Done (DoD)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
                  {deliverable.checklist.filter((c) => c.done).length} / {deliverable.checklist.length} Complete
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                {deliverable.progress}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden mb-3">
              <div
                className="h-full bg-[var(--accent-contrast)] transition-all duration-300"
                style={{ width: `${deliverable.progress}%` }}
              />
            </div>

            {/* Interactive checklist items */}
            <div className="space-y-1.5">
              {deliverable.checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklistItem(activeProject.id, activeStageId, item.id)}
                  className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors group"
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-[var(--accent-contrast)] mt-0.5 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] mt-0.5 shrink-0" />
                  )}
                  <span className={item.done ? 'line-through opacity-70 text-[var(--text-muted)]' : ''}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spec Content or Editor */}
        {isEditing ? (
          <div className="space-y-2">
            <div className="text-xs text-[var(--text-muted)] flex items-center justify-between">
              <span>Editing raw Markdown specification:</span>
              <span className="font-mono text-[10px]">Autosaved to active project</span>
            </div>
            <textarea
              value={deliverable?.specMarkdown ?? ''}
              onChange={(e) =>
                updateSpecMarkdown(activeProject.id, activeStageId, e.target.value)
              }
              rows={24}
              className="w-full p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--code-bg)] text-[var(--text-primary)] font-mono text-xs leading-relaxed focus:outline-hidden focus:border-[var(--border-strong)] transition-colors"
            />
          </div>
        ) : (
          <article className="markdown-prose max-w-none pb-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');

                  if (match) {
                    return (
                      <CodeBlock
                        language={match[1]}
                        code={codeString}
                      />
                    );
                  }

                  return (
                    <code
                      className="px-1.5 py-0.5 rounded text-[11px] font-mono border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {deliverable?.specMarkdown || '# No specification drafted yet for this stage.'}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
