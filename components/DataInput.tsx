'use client';

import { useState } from 'react';
import FileUpload from './FileUpload';
import { parseFile, ParsedData } from '@/lib/parsers';
import { AlignLeft, Upload } from 'lucide-react';

interface DataInputProps {
  onDataReady: (parsed: ParsedData, filename: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

type Tab = 'upload' | 'text';

export default function DataInput({ onDataReady, onClear, disabled }: DataInputProps) {
  const [tab, setTab] = useState<Tab>('upload');
  const [textValue, setTextValue] = useState('');
  const [parseError, setParseError] = useState('');

  const handleFile = async (file: File) => {
    setParseError('');
    try {
      const parsed = await parseFile(file);
      onDataReady(parsed, file.name);
    } catch {
      setParseError('Failed to parse file. Please try a different format.');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTextValue(val);
    if (val.trim().length > 0) {
      onDataReady({ content: val, fileType: 'text' }, 'pasted-text.txt');
    } else {
      onClear();
    }
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex rounded-xl bg-gray-100 p-1 mb-4 w-fit gap-1">
        <button
          onClick={() => { setTab('upload'); onClear(); setTextValue(''); }}
          disabled={disabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'upload'
              ? 'bg-white text-[#00b140] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          } disabled:opacity-50`}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
        <button
          onClick={() => { setTab('text'); onClear(); }}
          disabled={disabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'text'
              ? 'bg-white text-[#00b140] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          } disabled:opacity-50`}
        >
          <AlignLeft className="w-4 h-4" />
          Paste Text
        </button>
      </div>

      {tab === 'upload' ? (
        <FileUpload onFileAccepted={handleFile} disabled={disabled} />
      ) : (
        <textarea
          value={textValue}
          onChange={handleTextChange}
          disabled={disabled}
          placeholder="Paste your raw data here — sales figures, customer feedback, operational metrics, report exports, anything…"
          className="w-full h-48 rounded-2xl border-2 border-gray-300 focus:border-[#00b140] focus:outline-none resize-none p-4 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 transition-colors disabled:opacity-50"
        />
      )}

      {parseError && (
        <p className="mt-2 text-sm text-red-500">{parseError}</p>
      )}
    </div>
  );
}
