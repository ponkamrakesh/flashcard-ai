import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlashGenius – AI Flashcard Generator",
  description: "Upload a PDF and instantly generate smart Q&A flashcards powered by Claude AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
