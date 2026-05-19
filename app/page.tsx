"use client";

import { useState, useRef, useCallback } from "react";

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  topic: string;
}

interface GenerateResult {
  flashcards: Flashcard[];
  pageCount: number;
  filename: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cardCount, setCardCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [currentCard, setCurrentCard] = useState(0);
  const [viewMode, setViewMode] = useState<"deck" | "grid">("deck");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setResult(null);
      setError(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setResult(null);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setFlipped({});
    setCurrentCard(0);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("count", String(cardCount));

      const res = await fetch("/api/generate-flashcards", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (id: number) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const goNext = () => {
    if (result && currentCard < result.flashcards.length - 1) {
      setCurrentCard((c) => c + 1);
    }
  };

  const goPrev = () => {
    if (currentCard > 0) setCurrentCard((c) => c - 1);
  };

  const topicColors: Record<string, string> = {};
  const palette = [
    "#e8f4fd", "#fef9e7", "#eafaf1", "#fdf2f8", "#f0f3ff",
    "#fff3e0", "#e8f8f5", "#fce4ec", "#f3e5f5", "#e1f5fe",
  ];
  const getTopicColor = (topic: string) => {
    if (!topicColors[topic]) {
      const keys = Object.keys(topicColors);
      topicColors[topic] = palette[keys.length % palette.length];
    }
    return topicColors[topic];
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">FlashGenius</span>
          </div>
          <p className="tagline">PDF → Smart Flashcards in seconds</p>
        </div>
      </header>

      <div className="container">
        {/* Upload Section */}
        {!result && (
          <section className="upload-section">
            <div
              className={`drop-zone ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {file ? (
                <div className="file-info">
                  <div className="file-icon">📄</div>
                  <div>
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <span className="change-hint">Click to change</span>
                </div>
              ) : (
                <div className="drop-prompt">
                  <div className="drop-icon">☁️</div>
                  <p className="drop-title">Drop your PDF here</p>
                  <p className="drop-sub">or click to browse files</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="controls">
              <div className="count-control">
                <label className="control-label">Number of flashcards</label>
                <div className="count-buttons">
                  {[5, 10, 15, 20].map((n) => (
                    <button
                      key={n}
                      className={`count-btn ${cardCount === n ? "active" : ""}`}
                      onClick={() => setCardCount(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={!file || loading}
              >
                {loading ? (
                  <span className="loading-inner">
                    <span className="spinner" />
                    Generating...
                  </span>
                ) : (
                  "✨ Generate Flashcards"
                )}
              </button>
            </div>

            {error && (
              <div className="error-box">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Feature Pills */}
            <div className="features">
              {["AI-Powered", "Instant Results", "Multiple Formats", "Free to Use"].map((f) => (
                <span key={f} className="feature-pill">{f}</span>
              ))}
            </div>
          </section>
        )}

        {/* Results Section */}
        {result && (
          <section className="results-section">
            {/* Meta bar */}
            <div className="meta-bar">
              <div className="meta-info">
                <span className="meta-file">📄 {result.filename}</span>
                <span className="meta-stat">{result.pageCount} pages · {result.flashcards.length} cards</span>
              </div>
              <div className="meta-actions">
                <div className="view-toggle">
                  <button
                    className={`toggle-btn ${viewMode === "deck" ? "active" : ""}`}
                    onClick={() => setViewMode("deck")}
                  >🃏 Deck</button>
                  <button
                    className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >⊞ Grid</button>
                </div>
                <button className="reset-btn" onClick={() => { setResult(null); setFile(null); }}>
                  + New PDF
                </button>
              </div>
            </div>

            {/* Deck View */}
            {viewMode === "deck" && (
              <div className="deck-view">
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${((currentCard + 1) / result.flashcards.length) * 100}%` }}
                  />
                </div>
                <p className="deck-counter">{currentCard + 1} / {result.flashcards.length}</p>

                {result.flashcards[currentCard] && (
                  <div
                    className={`card-3d-wrap ${flipped[result.flashcards[currentCard].id] ? "flipped" : ""}`}
                    onClick={() => toggleFlip(result.flashcards[currentCard].id)}
                  >
                    <div className="card-3d">
                      <div className="card-face card-front">
                        <span
                          className="card-topic-badge"
                          style={{ background: getTopicColor(result.flashcards[currentCard].topic) }}
                        >
                          {result.flashcards[currentCard].topic}
                        </span>
                        <div className="card-label">Question</div>
                        <p className="card-question">{result.flashcards[currentCard].question}</p>
                        <div className="card-hint">Tap to reveal answer</div>
                      </div>
                      <div className="card-face card-back">
                        <div className="card-label answer-label">Answer</div>
                        <p className="card-answer">{result.flashcards[currentCard].answer}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="deck-nav">
                  <button className="nav-btn" onClick={goPrev} disabled={currentCard === 0}>← Prev</button>
                  <button
                    className="nav-btn shuffle-btn"
                    onClick={() => {
                      const idx = Math.floor(Math.random() * result.flashcards.length);
                      setCurrentCard(idx);
                    }}
                  >🔀 Shuffle</button>
                  <button className="nav-btn" onClick={goNext} disabled={currentCard === result.flashcards.length - 1}>Next →</button>
                </div>
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid-view">
                {result.flashcards.map((card) => (
                  <div
                    key={card.id}
                    className={`grid-card ${flipped[card.id] ? "flipped" : ""}`}
                    onClick={() => toggleFlip(card.id)}
                  >
                    <div className="grid-card-inner">
                      <div className="grid-card-front">
                        <span
                          className="card-topic-badge"
                          style={{ background: getTopicColor(card.topic) }}
                        >{card.topic}</span>
                        <p className="grid-question">{card.question}</p>
                        <span className="grid-hint">Tap to flip</span>
                      </div>
                      <div className="grid-card-back">
                        <p className="grid-answer">{card.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
