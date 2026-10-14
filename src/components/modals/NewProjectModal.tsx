'use client';

import React, { useState } from 'react';
import { X, Building2, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { COMPANIES } from '@/lib/constants';
import { CompanyId, Project } from '@/types';

export function NewProjectModal() {
  const { isNewProjectModalOpen, setNewProjectModalOpen, createProject } = useMonoSpecStore();

  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState<CompanyId>('awamer');
  const [description, setDescription] = useState('');
  const [architectureTier, setArchitectureTier] = useState<Project['architectureTier']>('Tier 1 Enterprise');

  if (!isNewProjectModalOpen) return null;

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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
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
                Create a 6-stage precision specification lifecycle
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
          {/* Company Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              Enterprise Client / Company
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(COMPANIES) as CompanyId[]).map((cid) => {
                const isSelected = companyId === cid;
                const comp = COMPANIES[cid];
                return (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => setCompanyId(cid)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] shadow-xs'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{comp.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        {comp.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] font-sans">
                      {comp.nameAr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              Project Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cross-Border Freight Brokerage V2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)] transition-colors"
            />
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
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border-subtle)]">
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
              Create Specification Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
