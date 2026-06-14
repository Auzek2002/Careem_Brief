'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, FileSpreadsheet, X } from 'lucide-react';

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED = {
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
};

function FileIcon({ ext }: { ext: string }) {
  if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
    return <FileSpreadsheet className="w-5 h-5 text-[#00b140]" />;
  }
  return <FileText className="w-5 h-5 text-[#00b140]" />;
}

export default function FileUpload({ onFileAccepted, disabled }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        setSelectedFile(accepted[0]);
        onFileAccepted(accepted[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 1,
    disabled,
  });

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  const ext = selectedFile?.name.split('.').pop()?.toLowerCase() ?? '';

  const borderColor = isDragReject
    ? 'border-red-400 bg-red-50'
    : isDragActive
    ? 'border-[#00b140] bg-green-50'
    : selectedFile
    ? 'border-[#00b140] bg-green-50'
    : 'border-gray-300 bg-gray-50 hover:border-[#00b140] hover:bg-green-50';

  return (
    <div
      {...getRootProps()}
      className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer ${borderColor} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
        {selectedFile ? (
          <>
            <div className="flex items-center gap-2 bg-white border border-[#00b140]/30 rounded-xl px-4 py-2 shadow-sm">
              <FileIcon ext={ext} />
              <span className="text-sm font-medium text-gray-800 max-w-[220px] truncate">
                {selectedFile.name}
              </span>
              <span className="text-xs text-gray-400">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
              {!disabled && (
                <button
                  onClick={clear}
                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-[#00b140] font-medium">File ready click Generate Brief</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-[#00b140]/10 flex items-center justify-center">
              <UploadCloud className="w-7 h-7 text-[#00b140]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {isDragActive ? 'Drop your file here…' : 'Drag & drop a file, or click to browse'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports .txt, .csv, .xlsx, .xls up to 10 MB
              </p>
            </div>
          </>
        )}
      </div>

      {isDragReject && (
        <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-red-500 font-medium">
          Unsupported file type
        </p>
      )}
    </div>
  );
}
