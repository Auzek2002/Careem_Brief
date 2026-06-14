import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export type ParsedData = {
  content: string;
  fileType: 'text' | 'csv' | 'excel';
  rowCount?: number;
  columnCount?: number;
  columns?: string[];
};

export async function parseFile(file: File): Promise<ParsedData> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'csv') {
    return parseCsv(file);
  } else if (ext === 'xlsx' || ext === 'xls') {
    return parseExcel(file);
  } else {
    return parseText(file);
  }
}

async function parseText(file: File): Promise<ParsedData> {
  const content = await file.text();
  return { content, fileType: 'text' };
}

async function parseCsv(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const columns = results.meta.fields || [];
        const rows = results.data as Record<string, unknown>[];

        const preview = rows.slice(0, 200);
        const lines = [
          columns.join(', '),
          ...preview.map((row) =>
            columns.map((col) => String(row[col] ?? '')).join(', ')
          ),
        ];

        resolve({
          content: lines.join('\n'),
          fileType: 'csv',
          rowCount: rows.length,
          columnCount: columns.length,
          columns,
        });
      },
      error: reject,
    });
  });
}

async function parseExcel(file: File): Promise<ParsedData> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: '',
  });

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  const preview = rows.slice(0, 200);
  const lines = [
    columns.join(', '),
    ...preview.map((row) =>
      columns.map((col) => String(row[col] ?? '')).join(', ')
    ),
  ];

  return {
    content: lines.join('\n'),
    fileType: 'excel',
    rowCount: rows.length,
    columnCount: columns.length,
    columns,
  };
}
