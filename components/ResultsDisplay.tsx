'use client';

import { AnalysisResult, Recommendation } from '@/app/api/analyze/route';
import {
  BookOpen,
  ListChecks,
  Lightbulb,
  TrendingUp,
  Copy,
  CheckCheck,
  AlertCircle,
  ArrowUpCircle,
  MinusCircle,
  ArrowDownCircle,
} from 'lucide-react';
import { useState } from 'react';

const PRIORITY_STYLES: Record<
  Recommendation['priority'],
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  high: {
    label: 'High Priority',
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-600',
    icon: <ArrowUpCircle className="w-4 h-4" />,
  },
  medium: {
    label: 'Medium Priority',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-600',
    icon: <MinusCircle className="w-4 h-4" />,
  },
  low: {
    label: 'Low Priority',
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-600',
    icon: <ArrowDownCircle className="w-4 h-4" />,
  },
};

function PriorityBadge({ priority }: { priority: Recommendation['priority'] }) {
  const style = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.medium;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${style.bg} ${style.text}`}
    >
      {style.icon}
      {style.label}
    </span>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#00b140]">{icon}</span>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

interface ResultsDisplayProps {
  result: AnalysisResult;
  filename: string;
}

export default function ResultsDisplay({ result, filename }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    const text = [
      `DECISION BRIEF — ${filename.toUpperCase()}`,
      '',
      'EXECUTIVE SUMMARY',
      result.summary,
      '',
      'KEY FINDINGS',
      ...(result.keyFindings ?? []).map((f, i) => `${i + 1}. ${f}`),
      '',
      'RECOMMENDED ACTIONS',
      ...(result.recommendations ?? []).map(
        (r, i) =>
          `${i + 1}. [${r.priority?.toUpperCase()}] ${r.action}\n   ${r.description}\n   Impact: ${r.impact}`
      ),
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Decision Brief</h2>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {result.dataInsight}
          </p>
        </div>
        <button
          onClick={copyAll}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 hover:border-[#00b140] hover:text-[#00b140] transition-all"
        >
          {copied ? (
            <>
              <CheckCheck className="w-4 h-4 text-[#00b140]" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Brief
            </>
          )}
        </button>
      </div>

      {/* Executive Summary */}
      <SectionCard icon={<BookOpen className="w-5 h-5" />} title="Executive Summary">
        <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
      </SectionCard>

      {/* Key Findings */}
      <SectionCard icon={<ListChecks className="w-5 h-5" />} title="Key Findings">
        <ul className="space-y-2">
          {(result.keyFindings ?? []).map((finding, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00b140]/10 text-[#00b140] text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              {finding}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Recommendations */}
      <SectionCard icon={<Lightbulb className="w-5 h-5" />} title="Recommended Business Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(result.recommendations ?? []).map((rec, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900 leading-snug flex-1">
                  {rec.action}
                </h3>
                <PriorityBadge priority={rec.priority} />
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{rec.description}</p>
              <div className="flex items-start gap-1.5 mt-auto pt-2 border-t border-gray-200">
                <TrendingUp className="w-3.5 h-3.5 text-[#00b140] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#00b140] font-medium">{rec.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
