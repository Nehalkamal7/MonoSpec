'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  ArrowRight,
  Shield,
  FileCode,
  Gauge,
  GitBranch,
} from 'lucide-react';
import { FigmaIcon } from '@/components/ui/FigmaIcon';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { STAGES } from '@/lib/constants';
import { CodeBlock } from './CodeBlock';

export function ChatWorkspace() {
  const {
    activeProjectId,
    activeStageId,
    chatMessages,
    isGeneratingSpec,
    sendChatMessage,
    quickGenerateForActiveStage,
    getActiveProject,
  } = useMonoSpecStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeProject = getActiveProject();
  const chatKey = `${activeProjectId}-${activeStageId}`;
  const messages = chatMessages[chatKey] || [];
  const currentStage = STAGES.find((s) => s.id === activeStageId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGeneratingSpec]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGeneratingSpec) return;
    sendChatMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-canvas)] overflow-hidden transition-colors">
      {/* Chat Stage Header */}
      <div className="h-12 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            Architect Assistant
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">/</span>
          <span className="text-xs text-[var(--text-secondary)] font-medium">
            {currentStage?.labelEn}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Stage Feed Active</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-[var(--text-primary)]">
                {currentStage?.labelEn} Workspace Feed
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] max-w-xs mt-1">
                Collaborate with MonoSpec to formulate, verify, and validate precision architectural specifications.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender !== 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 shadow-xs">
                  M
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 space-y-2 border ${
                  msg.sender === 'user'
                    ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] border-transparent'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 select-none opacity-70 text-[10px] font-mono">
                  <span>{msg.sender === 'user' ? 'Architect' : 'MonoSpec Core'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="markdown-prose text-xs">
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
                            className="px-1 py-0.5 rounded text-[10px] font-mono border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Suggested prompt actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-[var(--border-subtle)] select-none">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => sendChatMessage(`Execute action: ${action.label}`)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <Zap className="w-2.5 h-2.5 text-[var(--text-muted)]" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                  <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </div>
              )}
            </div>
          ))
        )}

        {isGeneratingSpec && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 animate-pulse">
              M
            </div>
            <div className="rounded-xl p-3 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-mono ml-1">Formulating precision spec...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Stage Quick Suggestions Bar */}
      <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
        <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0 flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3" /> Quick:
        </span>
        <button
          onClick={() => quickGenerateForActiveStage('schema')}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <FileCode className="w-3 h-3 text-[var(--text-muted)]" />
          <span>OpenAPI Schema</span>
        </button>
        <button
          onClick={() => quickGenerateForActiveStage('security')}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Shield className="w-3 h-3 text-[var(--text-muted)]" />
          <span>Security Threat Matrix</span>
        </button>
        <button
          onClick={() => quickGenerateForActiveStage('perf')}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Gauge className="w-3 h-3 text-[var(--text-muted)]" />
          <span>k6 Load Test</span>
        </button>
        <button
          onClick={() => quickGenerateForActiveStage('figma')}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <FigmaIcon className="w-3 h-3 text-[var(--text-muted)]" />
          <span>Tokens JSON</span>
        </button>
      </div>

      {/* Input Message Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
        <div className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] focus-within:border-[var(--border-strong)] transition-colors p-2 shadow-2xs">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask or instruct MonoSpec on ${currentStage?.labelEn}... (Enter to send)`}
            rows={2}
            className="w-full bg-transparent resize-none text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden leading-relaxed"
          />
          <div className="flex items-center justify-between pt-1 select-none">
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Shift+Enter for newline
            </span>
            <button
              type="submit"
              disabled={!input.trim() || isGeneratingSpec}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
