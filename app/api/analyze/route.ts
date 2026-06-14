import { getGroqClient } from '@/lib/groq';
import { NextRequest, NextResponse } from 'next/server';

export interface AnalysisResult {
  summary: string;
  keyFindings: string[];
  recommendations: Recommendation[];
  dataInsight: string;
}

export interface Recommendation {
  action: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
}

const SYSTEM_PROMPT = `You are a senior business intelligence analyst at Careem.
Your job is to analyze raw business data and produce crisp, executive-level decision briefs.
Always respond with valid JSON matching the schema exactly — no markdown fences, no extra keys.`;

function buildPrompt(
  data: string,
  filename: string,
  fileType: string,
  rowCount?: number,
  columnCount?: number
): string {
  const meta =
    rowCount !== undefined
      ? `Rows: ${rowCount}, Columns: ${columnCount}`
      : 'Unstructured text';

  return `Analyze the following data and return a JSON decision brief.

Source: ${filename || 'Pasted text'}
Format: ${fileType}
${meta}

DATA:
${data.slice(0, 12000)}

Return JSON exactly matching this schema:
{
  "summary": "<3-5 sentence executive summary of what the data reveals>",
  "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>", "<finding 4>", "<finding 5>"],
  "recommendations": [
    {
      "action": "<short action title>",
      "description": "<1-2 sentence explanation of the recommended action>",
      "priority": "high" | "medium" | "low",
      "impact": "<expected business outcome>"
    }
  ],
  "dataInsight": "<one sentence about data quality or coverage>"
}

Provide 5-7 recommendations. Be specific, actionable, and tailored to the data shown.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, filename, fileType, rowCount, columnCount } = body as {
      data: string;
      filename?: string;
      fileType?: string;
      rowCount?: number;
      columnCount?: number;
    };

    if (!data || data.trim().length === 0) {
      return NextResponse.json({ error: 'No data provided.' }, { status: 400 });
    }

    const groq = getGroqClient();

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: buildPrompt(data, filename ?? '', fileType ?? 'text', rowCount, columnCount),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const result: AnalysisResult = JSON.parse(raw);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
