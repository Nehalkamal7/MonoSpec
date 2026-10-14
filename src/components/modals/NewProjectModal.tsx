'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, Sparkles, Layers, ShieldCheck, Check } from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { COMPANIES } from '@/lib/constants';
import { CompanyId, Project } from '@/types';

export function NewProjectModal() {
  const { isNewProjectModalOpen, setNewProjectModalOpen, createProject } = useMonoSpecStore();

  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState<CompanyId>('awamer');
  const [description, setDescription] = useState('');
  const [architectureTier, setArchitectureTier] = useState<Project['architectureTier']>('Tier 1 Enterprise');

  // Intelligent prefix detector: aa: -> awamer, cs: -> creative
  useEffect(() => {
    const trimmed = title.trim().toLowerCase();
    if (trimmed.startsWith('aa:') || trimmed.startsWith('aa ') || trimmed.startsWith('[aa]') || trimmed.startsWith('aa-')) {
      if (companyId !== 'awamer') setCompanyId('awamer');
    } else if (trimmed.startsWith('cs:') || trimmed.startsWith('cs ') || trimmed.startsWith('[cs]') || trimmed.startsWith('cs-')) {
      if (companyId !== 'creative') setCompanyId('creative');
    }
  }, [title, companyId]);

  if (!isNewProjectModalOpen) return null;

  const handleApplyPrefix = (prefix: 'aa' | 'cs') => {
    if (prefix === 'aa') {
      setCompanyId('awamer');
      // If title doesn't already have prefix, prepend it
      const clean = title.replace(/^(aa|cs)[:\-\s]*/i, '');
      setTitle(`aa: ${clean.trim()}`);
    } else {
      setCompanyId('creative');
      const clean = title.replace(/^(aa|cs)[:\-\s]*/i, '');
      setTitle(`cs: ${clean.trim()}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createProject({
      title: title.trim(),
      companyId,
      description: description.trim() || 'Enterprise software architecture specification created via MonoSpec.',
      architectureTier,
    });

    setTitle('');
    setDescription('');
    setNewProjectModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-2xl overflow-hidden text-[var(--text-primary)]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-bold text-xs">
              +
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Initialize New Project</h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                Assign to <strong className="text-[var(--text-primary)]">AA (Awamer)</strong> or <strong className="text-[var(--text-primary)]">CS (Creative)</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setNewProjectModalOpen(false)}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company Selection (AA vs CS) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                Enterprise Client / Company Code
              </label>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                Active Code: <strong className="text-[var(--text-primary)]">{companyId === 'awamer' ? 'aa' : 'cs'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Awamer Alshabaka (aa) */}
              <button
                type="button"
                onClick={() => setCompanyId('awamer')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                  companyId === 'awamer'
                    ? 'border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] shadow-xs'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    Awamer Alshabaka
                  </span>
                  <span className="text-[11px] font-mono font-black px-1.5 py-0.5 rounded bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)]">
                    aa
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-sans">
                  <span>أوامر الشبكة</span>
                  <span className="text-[10px] font-mono opacity-80">CITC / ZATCA</span>
                </div>
              </button>

              {/* Creative System (cs) */}
              <button
                type="button"
                onClick={() => setCompanyId('creative')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                  companyId === 'creative'
                    ? 'border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] shadow-xs'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    Creative System
                  </span>
                  <span className="text-[11px] font-mono font-black px-1.5 py-0.5 rounded bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)]">
                    cs
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-sans">
                  <span>كرييتف سيستم</span>
                  <span className="text-[10px] font-mono opacity-80">Modular Tech</span>
                </div>
              </button>
            </div>
          </div>

          {/* Project Title with Quick Prefix Helper */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                Project Title
              </label>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-[10px] text-[var(--text-muted)]">Quick Prefix:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPrefix('aa')}
                  className={`px-1.5 py-0.5 rounded font-mono text-[10px] transition-colors border ${
                    companyId === 'awamer'
                      ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] border-transparent'
                      : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  + aa:
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPrefix('cs')}
                  className={`px-1.5 py-0.5 rounded font-mono text-[10px] transition-colors border ${
                    companyId === 'creative'
                      ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] border-transparent'
                      : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  + cs:
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                placeholder={companyId === 'awamer' ? 'e.g. aa: Logistics Fleet Dispatch' : 'e.g. cs: SoftPOS Contactless SDK'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)] transition-colors font-sans"
              />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-mono">
              Auto-detect: Typing &quot;aa:&quot; or &quot;cs:&quot; automatically selects the corresponding company.
            </p>
          </div>

          {/* Architecture Tier */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              Architecture Criticality Tier
            </label>
            <select
              value={architectureTier}
              onChange={(e) => setArchitectureTier(e.target.value as Project['architectureTier'])}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)] transition-colors"
            >
              <option value="Tier 1 Enterprise">Tier 1 Enterprise (SLA 99.99%, Distributed Multi-AZ)</option>
              <option value="Mission Critical">Mission Critical (Financial / Sovereign Gateway, Zero-Loss)</option>
              <option value="Core Platform">Core Platform (High Availability Cloud Native)</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              System Scope & Architectural Objective
            </label>
            <textarea
              rows={3}
              placeholder="Detail high-level requirements, expected throughput, and integration boundaries..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)] transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              All specs saved to persistent history
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNewProjectModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] hover:opacity-90 disabled:opacity-40 transition-all shadow-xs"
              >
                Create Project Workspace
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
