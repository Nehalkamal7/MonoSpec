'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Plus,
  Sparkles,
  ExternalLink,
  Layers,
  Building2,
  Check,
  FileCode2,
  BookOpen,
  Save,
  Tag,
} from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { listTrainingDatasets, createTrainingDataset, listCompanies } from '@/lib/supabaseClient';
import { TrainingDatasetRow, CompanyRow, CompanyCode } from '@/types/database.types';

export function TrainingDatasetsModal() {
  const { isTrainingModalOpen, setTrainingModalOpen } = useMonoSpecStore();

  const [activeTab, setActiveTab] = useState<'browse' | 'add' | 'guide'>('browse');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<'all' | 'awamer' | 'creative_system'>('all');
  const [datasets, setDatasets] = useState<TrainingDatasetRow[]>([]);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [formCompanyCode, setFormCompanyCode] = useState<CompanyCode>('awamer');
  const [projectTitle, setProjectTitle] = useState('');
  const [scopeDescription, setScopeDescription] = useState('');
  const [technicalAnalysis, setTechnicalAnalysis] = useState('');
  const [figmaRefUrl, setFigmaRefUrl] = useState('');
  const [demoAppUrl, setDemoAppUrl] = useState('');
  const [complianceTags, setComplianceTags] = useState('ZATCA Phase 2, CITC, NCA ECC');

  useEffect(() => {
    if (!isTrainingModalOpen) return;
    loadData();
  }, [isTrainingModalOpen]);

  const loadData = async () => {
    setLoading(true);
    const [compRes, dataRes] = await Promise.all([
      listCompanies(),
      listTrainingDatasets(),
    ]);
    if (compRes.data) setCompanies(compRes.data);
    if (dataRes.data) setDatasets(dataRes.data);
    setLoading(false);
  };

  if (!isTrainingModalOpen) return null;

  const handleCreateDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !technicalAnalysis.trim()) return;

    const company = companies.find((c) => c.code === formCompanyCode) || companies[0];

    const metadata = {
      compliance: complianceTags.split(',').map((s) => s.trim()).filter(Boolean),
      source: 'MonoSpec Training Data UI',
      timestamp: new Date().toISOString(),
    };

    const result = await createTrainingDataset({
      company_id: company?.id || (formCompanyCode === 'awamer' ? '11111111-1111-1111-1111-111111111111' : '22222222-2222-2222-2222-222222222222'),
      project_title: projectTitle.trim(),
      scope_description: scopeDescription.trim() || 'Approved enterprise architectural benchmark.',
      technical_analysis: technicalAnalysis.trim(),
      figma_reference_url: figmaRefUrl.trim() || null,
      demo_app_url: demoAppUrl.trim() || null,
      metadata,
    });

    if (result.data) {
      setDatasets((prev) => [result.data!, ...prev]);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setActiveTab('browse');
      }, 1500);

      // Reset form
      setProjectTitle('');
      setScopeDescription('');
      setTechnicalAnalysis('');
      setFigmaRefUrl('');
      setDemoAppUrl('');
    }
  };

  const filteredDatasets = datasets.filter((d) => {
    if (selectedCompanyFilter === 'all') return true;
    const targetComp = companies.find((c) => c.code === selectedCompanyFilter);
    return targetComp ? d.company_id === targetComp.id : true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-2xl overflow-hidden text-[var(--text-primary)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight">AI Training Datasets & Benchmarks</h2>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
                  SUPABASE REPO
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Manage approved golden specifications that condition AI reasoning per company
              </p>
            </div>
          </div>
          <button
            onClick={() => setTrainingModalOpen(false)}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] flex items-center justify-between shrink-0">
          <div className="flex gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'browse'
                  ? 'border-[var(--border-strong)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Browse Approved Datasets ({datasets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('add')}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'add'
                  ? 'border-[var(--border-strong)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Training Benchmark</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'guide'
                  ? 'border-[var(--border-strong)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Architecture Guide (Where & How)</span>
            </button>
          </div>

          {activeTab === 'browse' && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[var(--text-muted)] mr-1">Filter:</span>
              <button
                onClick={() => setSelectedCompanyFilter('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  selectedCompanyFilter === 'all'
                    ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)]'
                    : 'border border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCompanyFilter('awamer')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  selectedCompanyFilter === 'awamer'
                    ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)]'
                    : 'border border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                AA (Awamer)
              </button>
              <button
                onClick={() => setSelectedCompanyFilter('creative_system')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  selectedCompanyFilter === 'creative_system'
                    ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)]'
                    : 'border border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                CS (Creative)
              </button>
            </div>
          )}
        </div>

        {/* Tab Viewport */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-canvas)]">
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {filteredDatasets.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-xl">
                  No datasets found matching filter.
                </div>
              ) : (
                filteredDatasets.map((ds) => {
                  const comp = companies.find((c) => c.id === ds.company_id);
                  const isAwamer = comp?.code === 'awamer' || ds.company_id.includes('1111');

                  return (
                    <div
                      key={ds.id}
                      className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                isAwamer
                                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                                  : 'bg-zinc-900 text-zinc-200 border border-zinc-700'
                              }`}
                            >
                              {isAwamer ? 'AA · Awamer Alshabaka' : 'CS · Creative System'}
                            </span>
                            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                              {ds.project_title}
                            </h4>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">
                            {ds.scope_description}
                          </p>
                        </div>

                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {new Date(ds.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-[var(--code-bg)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-primary)] leading-relaxed">
                        <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                          Golden Technical Analysis Snippet:
                        </div>
                        {ds.technical_analysis}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3">
                          {ds.figma_reference_url && (
                            <a
                              href={ds.figma_reference_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[11px] text-[var(--text-primary)] hover:underline"
                            >
                              <span>Figma Design Reference</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {ds.demo_app_url && (
                            <a
                              href={ds.demo_app_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[11px] text-[var(--text-primary)] hover:underline"
                            >
                              <span>Live Architecture Demo</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          Table: <code className="text-[var(--text-primary)]">training_datasets</code>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleCreateDataset} className="space-y-4 max-w-2xl mx-auto">
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)]">
                Add an approved gold-standard architectural spec. When the AI generates specifications for this company, it retrieves this dataset as few-shot training context.
              </div>

              {/* Company Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                  Target Enterprise Organization
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormCompanyCode('awamer');
                      setComplianceTags('ZATCA Phase 2, CITC, NCA ECC, KSA Sovereign Cloud');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                      formCompanyCode === 'awamer'
                        ? 'border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] font-semibold shadow-xs'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
                    }`}
                  >
                    <div>
                      <span className="text-xs">Awamer Alshabaka (أوامر الشبكة)</span>
                      <p className="text-[10px] text-[var(--text-muted)] font-normal">Saudi Governance & ZATCA</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)]">
                      AA
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormCompanyCode('creative_system');
                      setComplianceTags('PCI-CPoC, SAMA Regulations, Sub-80ms settlement');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                      formCompanyCode === 'creative_system'
                        ? 'border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] font-semibold shadow-xs'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
                    }`}
                  >
                    <div>
                      <span className="text-xs">Creative System</span>
                      <p className="text-[10px] text-[var(--text-muted)] font-normal">Modern Modular Architecture</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)]">
                      CS
                    </span>
                  </button>
                </div>
              </div>

              {/* Project Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                  Approved Project Benchmark Title
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Sovereign Telemetry & Customs Brokerage Hub"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)]"
                />
              </div>

              {/* Scope Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                  Scope Description
                </label>
                <textarea
                  rows={2}
                  value={scopeDescription}
                  onChange={(e) => setScopeDescription(e.target.value)}
                  placeholder="High-level business scope and requirements..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)] resize-none"
                />
              </div>

              {/* Technical Analysis Ground Truth */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                  Golden Technical Analysis & Architecture Spec (Ground Truth)
                </label>
                <textarea
                  rows={4}
                  required
                  value={technicalAnalysis}
                  onChange={(e) => setTechnicalAnalysis(e.target.value)}
                  placeholder="Write the exemplary system topology, database partition strategy, idempotency locks, or API patterns you want the AI to emulate..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)] resize-none"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">
                    Figma Reference URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={figmaRefUrl}
                    onChange={(e) => setFigmaRefUrl(e.target.value)}
                    placeholder="https://figma.com/@company/design-system"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">
                    Live Demo App URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={demoAppUrl}
                    onChange={(e) => setDemoAppUrl(e.target.value)}
                    placeholder="https://app.company.io"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]">
                {savedSuccess ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <Check className="w-4 h-4" />
                    <span>Saved to Supabase training_datasets!</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">
                    Will be stored in table: training_datasets
                  </span>
                )}

                <button
                  type="submit"
                  disabled={!projectTitle.trim() || !technicalAnalysis.trim()}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Dataset</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 max-w-3xl mx-auto text-xs leading-relaxed text-[var(--text-secondary)]">
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-2">
                  أين تُخزن البيانات وكيف يتدرب/يتعلم عليها النموذج؟ (Architecture Overview)
                </h3>
                <p>
                  يعتمد <strong>MonoSpec</strong> على تقنية <strong>RAG & Few-Shot In-Context Conditioning</strong>. بدلاً من الحاجة لإعادة تدريب الأوزان بتكلفة عالية وبطء، يقوم النظام بحقن أفضل النماذج المعمارية المعتمدة لشركتك مباشرة في سياق كل محادثة.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
                  <h4 className="font-semibold text-[var(--text-primary)]">1. في قاعدة بيانات Supabase (الأساس)</h4>
                  <p>الجدول المسؤول هو <code>training_datasets</code>:</p>
                  <ul className="list-disc pl-4 space-y-1 font-mono text-[11px]">
                    <li><code>id</code> (UUID)</li>
                    <li><code>company_id</code> (Foreign Key لـ Awamer أو Creative)</li>
                    <li><code>project_title</code> (اسم المشروع المرجعي)</li>
                    <li><code>scope_description</code> (نطاق العمل)</li>
                    <li><code>technical_analysis</code> (المواصفات الفنية النموذجية)</li>
                    <li><code>figma_reference_url</code> & <code>demo_app_url</code></li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
                  <h4 className="font-semibold text-[var(--text-primary)]">2. مسار الربط مع الذكاء الاصطناعي</h4>
                  <p>
                    في ملف <code>src/app/api/chat/route.ts</code>، تستدعي الدالة <code>retrieveTrainingContext(companyCode)</code> قاعدة البيانات لجلب آخر المشروعات المعتمدة تلقائياً وحقنها كـ <strong>Reference Benchmarks</strong> في الـ Prompt.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--code-bg)] font-mono text-[11px] text-[var(--text-primary)]">
                <div className="text-[var(--text-muted)] mb-1">// كيف تضيف بيانات جديدة عبر SQL مباشرة:</div>
                <pre className="overflow-x-auto whitespace-pre">
{`INSERT INTO training_datasets (
  company_id, project_title, scope_description, technical_analysis
) VALUES (
  '11111111-1111-1111-1111-111111111111', -- أوامر الشبكة (AA)
  'منصة اللوجستيات وإدارة الشاحنات',
  'نظام تتبع ذكي متوافق مع هيئة النقل وهيئة الزكاة والضريبة والجمارك',
  'معمارية تعتمد على Kafka لنقل إحداثيات GPS و PostgreSQL مقسمة شهرياً مع أقفال Redis لمنع تكرار الإرسال'
);`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between text-xs text-[var(--text-muted)] shrink-0">
          <span>MonoSpec Architecture Knowledge Engine</span>
          <button
            onClick={() => setTrainingModalOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
