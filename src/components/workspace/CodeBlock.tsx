'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  filename?: string;
  code: string;
}

export function CodeBlock({ language = 'text', filename, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--code-bg)] overflow-hidden shadow-xs">
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          {filename ? (
            <span className="text-[var(--text-primary)] font-medium">{filename}</span>
          ) : (
            <span className="uppercase text-[10px] text-[var(--text-muted)] tracking-wider font-bold">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500 font-sans">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-3.5 overflow-x-auto text-xs font-mono text-[var(--text-primary)] leading-relaxed selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
