# ⚡ FlashGenius – AI Flashcard Generator

Upload any PDF and instantly generate smart Q&A flashcards powered by **Groq + Llama 3.3 70B** (completely free).

---

## 🚀 Live Demo
> Add your Vercel URL here after deployment

---

## ✨ Features

- 📄 **PDF Upload** — drag-and-drop or file picker
- 🤖 **AI-Generated Flashcards** — Groq + Llama 3.3 70B extracts key concepts
- 🃏 **3D Flip Cards** — tap to reveal answers with smooth animation
- 📚 **Deck Mode** — study one card at a time with a progress bar
- ⊞ **Grid Mode** — see all cards at a glance
- 🏷️ **Topic Tags** — cards are auto-labeled by topic
- 🔀 **Shuffle** — randomize card order for better retention
- 📱 **Responsive** — works on mobile and desktop

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| AI Model | Llama 3.3 70B via Groq API |
| PDF Parsing | pdf-parse |
| Styling | Custom CSS (no UI framework) |
| Deployment | Vercel |

---

## 🔑 Get Your FREE Groq API Key

1. Go to **https://console.groq.com**
2. Sign up — no credit card required
3. Navigate to **API Keys** → Create API Key
4. Copy the key

**Free tier:** 30 requests/min · 14,400 requests/day

---

## 📦 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/flashcard-ai.git
cd flashcard-ai

# 2. Install dependencies
npm install

# 3. Add your API key
cp .env.example .env.local
# Edit .env.local and paste your Groq API key

# 4. Run locally
npm run dev
```

Open **http://localhost:3000**

---

## 🌐 Deploy to Vercel

### Option A — Vercel Dashboard (Recommended)
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Under **Environment Variables**, add:
   - Name: `GROQ_API_KEY`
   - Value: your Groq API key
5. Click **Deploy** ✅

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel
# Follow prompts, then add env variable in Vercel dashboard
```

---

## 📁 Project Structure

```
flashcard-ai/
├── app/
│   ├── api/
│   │   └── generate-flashcards/
│   │       └── route.ts    ← PDF parsing + Groq API call
│   ├── globals.css          ← All styles & animations
│   ├── layout.tsx           ← Root layout + metadata
│   └── page.tsx             ← Main UI
├── .env.example
├── next.config.js
└── package.json
```

---

## ⚙️ How It Works

1. User uploads a PDF
2. `pdf-parse` extracts the raw text on the server
3. Text is sent to Groq's API with a structured prompt
4. Llama 3.3 70B returns flashcards as a JSON array
5. Cards are rendered with 3D flip animations in the browser

---

## 📝 Limitations

- Only works with **text-based PDFs** (not scanned images)
- PDF text is truncated to ~15,000 characters per request
- Best results with lecture notes, textbooks, research papers, documentation
