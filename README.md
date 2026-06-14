# Decision Brief Generator — Careem Challenge

> Turn raw business data into executive summaries and prioritized action recommendations — powered by Groq + LLaMA 3.3 70B.

Built by **Azaan Nabi Khan** as a submission for the Careem Engineering Challenge.

---

## Overview

The Decision Brief Generator is a fully responsive Next.js web application that accepts raw business data in any common format (CSV, Excel, or plain text) and uses a large language model to instantly produce a structured decision brief containing:

- An **executive summary** of what the data reveals
- **Key findings** extracted from the dataset
- **Prioritized business action recommendations** with expected impact statements

The goal is to eliminate the manual effort of turning raw data dumps into actionable insights — a task that would typically take an analyst hours is reduced to seconds.

---

## Features

| Feature | Detail |
|---|---|
| **Multi-format input** | Upload `.txt`, `.csv`, `.xlsx`, `.xls` files via drag-and-drop, or paste raw text directly |
| **AI-powered analysis** | Uses Groq's inference API with the `llama-3.3-70b-versatile` model |
| **Structured output** | Executive summary, numbered key findings, and recommendation cards |
| **Priority tagging** | Each recommendation is tagged High / Medium / Low with a business impact statement |
| **Copy to clipboard** | One-click export of the full brief as formatted plain text |
| **File metadata** | Displays detected row count, column count, and column names for tabular files |
| **Fully responsive** | Works on mobile, tablet, and desktop |
| **Careem branded** | Careem green (`#00b140`) design system throughout |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| LLM Inference | [Groq SDK](https://console.groq.com/) — `llama-3.3-70b-versatile` |
| CSV Parsing | [PapaParse](https://www.papaparse.com/) |
| Excel Parsing | [SheetJS (xlsx)](https://sheetjs.com/) |
| File Upload UI | [react-dropzone](https://react-dropzone.js.org/) |
| Icons | [Lucide React](https://lucide.dev/) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com/)

### Installation

```bash
git clone <repo-url>
cd careem-brief
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> Get a free API key at [console.groq.com](https://console.groq.com/). The free tier is sufficient for this application.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
careem-brief/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts        # Groq API route — processes data and returns JSON brief
│   ├── globals.css             # Global styles + animation keyframes
│   ├── layout.tsx              # Root layout with metadata
│   └── page.tsx                # Main page (state machine: idle → ready → loading → done)
├── components/
│   ├── Header.tsx              # Careem-branded header with app title
│   ├── Footer.tsx              # Footer with Careem brand and author credit
│   ├── DataInput.tsx           # Tab switcher: file upload vs. paste text
│   ├── FileUpload.tsx          # Drag-and-drop file zone (react-dropzone)
│   └── ResultsDisplay.tsx      # Renders summary, findings, and recommendation cards
├── lib/
│   ├── parsers.ts              # File parsers for CSV, Excel, and plain text
│   └── groq.ts                 # Groq SDK singleton
├── .env.local                  # API key (not committed)
├── .gitignore
└── README.md
```

---

## How It Works

1. **Input** — The user uploads a file or pastes raw text. Files are parsed entirely client-side using PapaParse (CSV) or SheetJS (Excel), extracting up to 200 rows as a structured string.

2. **API Call** — The parsed content is sent to the `/api/analyze` Next.js server route along with metadata (filename, file type, row/column counts).

3. **LLM Prompt** — The route constructs a structured prompt instructing LLaMA 3.3 70B to act as a senior business intelligence analyst and return a strict JSON object with `summary`, `keyFindings`, `recommendations`, and `dataInsight` fields. Groq's `json_object` response format guarantees valid JSON output.

4. **Results** — The parsed JSON is rendered as a Decision Brief with an executive summary card, a key findings list, and a responsive grid of recommendation cards tagged by priority.

---

## API Reference

### `POST /api/analyze`

**Request body:**

```json
{
  "data": "string — the raw parsed content",
  "filename": "string — original file name",
  "fileType": "text | csv | excel",
  "rowCount": 1200,
  "columnCount": 8
}
```

**Response:**

```json
{
  "summary": "Executive summary paragraph...",
  "keyFindings": [
    "Finding one...",
    "Finding two..."
  ],
  "recommendations": [
    {
      "action": "Expand delivery zones in high-demand areas",
      "description": "Data shows 34% of dropped orders originate from zones with no active drivers...",
      "priority": "high",
      "impact": "Estimated 15-20% reduction in order drop rate"
    }
  ],
  "dataInsight": "Dataset covers 3 months of ride-hailing transactions across 5 cities."
}
```

---

## Author

**Azaan Nabi Khan**  
Submitted for the Careem Engineering Challenge — Decision Brief Generator track.
