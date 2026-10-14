'use client';

import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Sparkles, Code2 } from 'lucide-react';
import { FigmaIcon } from '@/components/ui/FigmaIcon';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { CodeBlock } from '@/components/workspace/CodeBlock';

export function FigmaExportModal() {
  const { isFigmaModalOpen, setFigmaModalOpen, getActiveProject } = useMonoSpecStore();
  const [copied, setCopied] = useState(false);

  const activeProject = getActiveProject();

  if (!isFigmaModalOpen || !activeProject) return null;

  const figmaTokens = {
    $schema: 'https://tr.designtokens.org/format/',
    name: `MonoSpec Tokens - ${activeProject.title}`,
    color: {
      canvas: {
        dark: { value: '#000000', type: 'color' },
        light: { value: '#ffffff', type: 'color' },
      },
      surface: {
        dark: { value: '#0a0a0c', type: 'color' },
        light: { value: '#f9f9fb', type: 'color' },
      },
      accent: {
        zinc900: { value: '#18181b', type: 'color' },
        zinc800: { value: '#27272a', type: 'color' },
        zinc500: { value: '#71717a', type: 'color' },
      },
    },
    typography: {
      fontFamilySans: { value: 'Geist, sans-serif', type: 'fontFamilies' },
      fontFamilyMono: { value: 'Geist Mono, monospace', type: 'fontFamilies' },
      fontSizeH1: { value: '24px', type: 'dimension' },
      fontSizeH2: { value: '18px', type: 'dimension' },
      fontSizeBody: { value: '13px', type: 'dimension' },
    },
    radii: {
      sm: { value: '6px', type: 'dimension' },
      md: { value: '8px', type: 'dimension' },
      lg: { value: '12px', type: 'dimension' },
    },
  };

  const tokensString = JSON.stringify(figmaTokens, null, 2);

  const handleCopyTokens = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(tokensString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-2xl overflow-hidden text-[var(--text-primary)]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center">
              <FigmaIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Export to Figma Design Tokens</h2>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                {activeProject.title}
              </p>
            </div>
          </div>
          <button
            onClick={() => setFigmaModalOpen(false)}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Import these design tokens directly into <strong>Figma Tokens Studio</strong> or sync with your team library. All values strictly follow MonoSpec&apos;s pure monochrome color system (#000000 / #ffffff / #18181b / #27272a / #71717a).
          </p>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)] text-xs font-mono">
              <span className="text-[var(--text-muted)]">tokens.json (W3C DTCG Format)</span>
              <button
                onClick={handleCopyTokens}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied JSON' : 'Copy Tokens JSON'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-[var(--text-primary)] max-h-56 overflow-y-auto leading-tight selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
              {tokensString}
            </pre>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
            {activeProject.figmaUrl ? (
              <a
                href={activeProject.figmaUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-[var(--text-primary)] hover:underline font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Project in Figma</span>
              </a>
            ) : (
              <span className="text-xs text-[var(--text-muted)]">No Figma URL linked yet</span>
            )}

            <button
              onClick={() => setFigmaModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
