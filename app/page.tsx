'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DataInput from '@/components/DataInput';
import ResultsDisplay from '@/components/ResultsDisplay';
import { ParsedData } from '@/lib/parsers';
import { AnalysisResult } from '@/app/api/analyze/route';
import { Sparkles, RotateCcw, ChevronRight, Database, FileText, FileSpreadsheet } from 'lucide-react';

type AppState = 'idle' | 'ready' | 'loading' | 'done' | 'error';

const EXAMPLES = [
  { label: 'Sales Report', icon: <FileSpreadsheet className="w-4 h-4" /> },
  { label: 'Customer Feedback', icon: <FileText className="w-4 h-4" /> },
  { label: 'Operational Metrics', icon: <Database className="w-4 h-4" /> },
];

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [filename, setFilename] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDataReady = (data: ParsedData, fname: string) => {
    setParsedData(data);
    setFilename(fname);
    setAppState('ready');
  };

  const handleClear = () => {
    setParsedData(null);
    setFilename('');
    if (appState !== 'done') setAppState('idle');
  };

  const handleGenerate = async () => {
    if (!parsedData) return;
    setAppState('loading');
    setResult(null);
    setErrorMsg('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: parsedData.content,
          filename,
          fileType: parsedData.fileType,
          rowCount: parsedData.rowCount,
          columnCount: parsedData.columnCount,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Request failed (${res.status})`);
      }

      const data: AnalysisResult = await res.json();
      setResult(data);
      setAppState('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setErrorMsg(msg);
      setAppState('error');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setParsedData(null);
    setFilename('');
    setResult(null);
    setErrorMsg('');
  };

  const isLoading = appState === 'loading';
  const isDone = appState === 'done';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero section */}
        {!isDone && (
          <div className="mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-[#00b140]/10 text-[#00b140] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Groq + LLaMA 3.3 70B
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              From raw data to{' '}
              <span className="text-[#00b140]">executive decisions</span>
              <br className="hidden sm:block" /> in seconds.
            </h1>
            <p className="text-base text-gray-500 max-w-xl">
              Upload a CSV, Excel, or text file or paste your data directly. The AI will
              summarize it and generate prioritized business action recommendations.
            </p>

            {/* Supported formats chips */}
            <div className="flex flex-wrap gap-2 mt-5">
              {EXAMPLES.map((ex) => (
                <span
                  key={ex.label}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1"
                >
                  {ex.icon}
                  {ex.label}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00b140] bg-[#00b140]/10 border border-[#00b140]/20 rounded-full px-3 py-1">
                .txt · .csv · .xlsx · .xls
              </span>
            </div>
          </div>
        )}

        {/* Input + Action card */}
        {!isDone && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-fade-in-up mb-8">
            <DataInput
              onDataReady={handleDataReady}
              onClear={handleClear}
              disabled={isLoading}
            />

            {/* File meta */}
            {parsedData && parsedData.rowCount !== undefined && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-1 font-medium">
                  {parsedData.rowCount.toLocaleString()} rows
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-1 font-medium">
                  {parsedData.columnCount} columns
                </span>
                {parsedData.columns && parsedData.columns.length > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-1 font-medium truncate max-w-xs">
                    Cols: {parsedData.columns.slice(0, 5).join(', ')}
                    {parsedData.columns.length > 5 ? ` +${parsedData.columns.length - 5} more` : ''}
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={!parsedData || isLoading}
                className="flex items-center justify-center gap-2 bg-[#00b140] hover:bg-[#009a38] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 text-sm shadow-sm disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Generating Brief…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Decision Brief
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
              {parsedData && !isLoading && (
                <button
                  onClick={handleClear}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Error */}
            {appState === 'error' && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <strong>Error:</strong> {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in-up">
            <div className="w-14 h-14 rounded-2xl bg-[#00b140]/10 flex items-center justify-center">
              <LoadingSpinner large />
            </div>
            <p className="text-sm font-semibold text-gray-700">Analyzing your data…</p>
            <p className="text-xs text-gray-400">The AI is reading patterns and building your brief</p>
          </div>
        )}

        {/* Results */}
        {isDone && result && (
          <div className="space-y-6">
            {/* Reset bar */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Source: <span className="font-medium text-gray-600">{filename}</span></p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#00b140] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Analyze new data
              </button>
            </div>
            <ResultsDisplay result={result} filename={filename} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function LoadingSpinner({ large }: { large?: boolean }) {
  const size = large ? 'w-7 h-7' : 'w-4 h-4';
  return (
    <svg
      className={`${size} animate-spin text-[#00b140]`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
