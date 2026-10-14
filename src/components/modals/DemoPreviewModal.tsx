'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, Activity, Server, Database, Shield, CheckCircle2, RefreshCw, Cpu, Layers } from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { STAGES, COMPANIES } from '@/lib/constants';

export function DemoPreviewModal() {
  const { isDemoModalOpen, setDemoModalOpen, getActiveProject } = useMonoSpecStore();
  const [latency, setLatency] = useState(18);
  const [throughput, setThroughput] = useState(14820);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'stages' | 'logs'>('pipeline');

  const activeProject = getActiveProject();

  useEffect(() => {
    if (!isDemoModalOpen) return;
    const interval = setInterval(() => {
      setLatency(Math.floor(14 + Math.random() * 8));
      setThroughput(Math.floor(14500 + Math.random() * 800));
    }, 1500);
    return () => clearInterval(interval);
  }, [isDemoModalOpen]);

  if (!isDemoModalOpen || !activeProject) return null;

  const company = COMPANIES[activeProject.companyId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-2xl overflow-hidden text-[var(--text-primary)] flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight">MonoSpec Architectural Sandbox</h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
                  LIVE SIMULATION
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                {activeProject.title} ({company.name})
              </p>
            </div>
          </div>
          <button
            onClick={() => setDemoModalOpen(false)}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] divide-x divide-[var(--border-subtle)] text-xs font-mono shrink-0">
          <div className="p-3 flex flex-col">
            <span className="text-[10px] text-[var(--text-muted)] uppercase">p99 Latency</span>
            <span className="text-base font-bold text-[var(--text-primary)] mt-0.5">{latency}ms</span>
          </div>
          <div className="p-3 flex flex-col">
            <span className="text-[10px] text-[var(--text-muted)] uppercase">Throughput</span>
            <span className="text-base font-bold text-[var(--text-primary)] mt-0.5">
              {throughput.toLocaleString()} RPS
            </span>
          </div>
          <div className="p-3 flex flex-col">
            <span className="text-[10px] text-[var(--text-muted)] uppercase">Architecture Tier</span>
            <span className="text-xs font-semibold text-[var(--text-primary)] mt-1 truncate">
              {activeProject.architectureTier}
            </span>
          </div>
          <div className="p-3 flex flex-col">
            <span className="text-[10px] text-[var(--text-muted)] uppercase">Cluster Health</span>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% SLA</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] flex gap-4 text-xs font-medium shrink-0">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'pipeline'
                ? 'border-[var(--border-strong)] text-[var(--text-primary)] font-semibold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Topology & Ingestion Pipeline
          </button>
          <button
            onClick={() => setActiveTab('stages')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'stages'
                ? 'border-[var(--border-strong)] text-[var(--text-primary)] font-semibold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            6-Stage Readiness Matrix
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Simulated Event Stream Broker</span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    Kafka Topic: {activeProject.slug}.events
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <Cpu className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Ingress Router</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      mTLS Verified / HMAC-SHA256
                    </p>
                    <div className="text-[10px] font-mono text-emerald-500 font-bold">0 Drop Rate</div>
                  </div>

                  <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <Database className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Storage Partition</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Monthly Range / PostGIS
                    </p>
                    <div className="text-[10px] font-mono text-[var(--text-primary)] font-bold">
                      3 AZ Replicated
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <Shield className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Compliance Engine</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      ZATCA Phase-2 / SAMA Standard
                    </p>
                    <div className="text-[10px] font-mono text-emerald-500 font-bold">Pass Validated</div>
                  </div>
                </div>
              </div>

              {/* Sample simulated payload */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--code-bg)] p-3 font-mono text-[11px] space-y-1">
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Active Runtime Telemetry Event (JSON)
                </div>
                <div className="text-[var(--text-primary)]">
                  {`{ "event": "WAYBILL_INGESTED", "project": "${activeProject.slug}", "partition": 4, "clusterId": "awm-prod-01", "latencyMs": ${latency}, "status": "202_ACCEPTED" }`}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stages' && (
            <div className="space-y-2">
              {STAGES.map((st) => {
                const deliverable = activeProject.stages[st.id];
                return (
                  <div
                    key={st.id}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[var(--text-muted)]">0{st.index}</span>
                      <div>
                        <div className="font-semibold text-[var(--text-primary)]">{st.labelEn}</div>
                        <div className="text-[11px] text-[var(--text-muted)] font-sans">{st.labelAr}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {deliverable?.checklist.filter((c) => c.done).length} / {deliverable?.checklist.length} tasks
                      </span>
                      <span className="px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] font-bold">
                        {deliverable?.progress}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[var(--text-muted)] font-mono">
            MonoSpec Sandbox v2.4 • Strict Monochrome Runtime
          </div>
          <button
            onClick={() => setDemoModalOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] hover:opacity-90 transition-opacity"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}
