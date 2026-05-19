# ⚡ FlashGenius – AI Flashcard Generator

Upload any PDF and instantly generate smart Q&A flashcards using Claude AI.

## ✨ Features

- **PDF Upload** — drag-and-drop or file picker
- **AI-Powered Generation** — Claude extracts key concepts and creates questions
- **Flip Cards** — 3D flip animation for question/answer reveal
- **Deck Mode** — study one card at a time with progress bar
- **Grid Mode** — see all cards at once
- **Topic Tags** — cards are labeled with auto-detected topic categories
- **Shuffle** — randomize card order for better retention

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| AI | Anthropic Claude API |
| PDF Parsing | pdf-parse |
| Styling | Custom CSS (no UI framework needed) |
| Deployment | Vercel |

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd flashcard-ai
npm install
```

### 2. Set Up API Key

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Get your key at: https://console.anthropic.com

### 3. Run Locally

```bash
npm run dev
```

Open http://localhost:3000

---

## 🌐 Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B: GitHub + Vercel Dashboard

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Add environment variable: `ANTHROPIC_API_KEY` = your key
5. Click **Deploy** ✅

That's it! Vercel auto-detects Next.js and handles everything.

---

## 📁 Project Structure

```
flashcard-ai/
├── app/
│   ├── api/
│   │   └── generate-flashcards/
│   │       └── route.ts       ← PDF parsing + Claude API call
│   ├── globals.css            ← All styles
│   ├── layout.tsx             ← Root layout + metadata
│   └── page.tsx               ← Main UI (upload + flashcards)
├── .env.example
├── next.config.js
└── package.json
```

## 🔑 How It Works

1. User uploads a PDF
2. `pdf-parse` extracts the text content
3. Text is sent to Claude with a prompt to generate N flashcards as JSON
4. Cards are rendered with 3D flip animations

## 📝 Notes

- Only text-based PDFs work (not scanned images/OCR)
- Text is truncated to ~15,000 characters to fit context limits
- Works best with lecture notes, research papers, textbooks, docs
