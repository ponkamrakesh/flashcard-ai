# ⚡ FlashGenius – AI Flashcard Generator

Upload any PDF and instantly generate smart Q&A flashcards using **Google Gemini AI (free!)**.

## ✨ Features
- PDF drag-and-drop upload
- AI-generated Q&A flashcards (Gemini 1.5 Flash — free tier)
- 3D flip card animations
- Deck study mode + Grid overview mode
- Topic tags & shuffle

## 🛠 Tech Stack
| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| AI | Google Gemini 1.5 Flash (**Free**) |
| PDF Parsing | pdf-parse |
| Deployment | Vercel |

## 🔑 Get Your FREE Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key** — it's instant and free
3. Free tier: **1,500 requests/day**, **1M tokens/min**

## 🚀 Local Setup
```bash
npm install
cp .env.example .env.local
# Paste your Gemini API key into .env.local
npm run dev
```

## 🌐 Deploy to Vercel
1. Push to GitHub
2. Import repo at vercel.com → New Project
3. Add env variable: `GEMINI_API_KEY` = your key
4. Deploy ✅
