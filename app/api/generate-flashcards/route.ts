import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import pdfParse from "pdf-parse";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;
    const count = parseInt((formData.get("count") as string) || "10");

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    // Convert file to buffer and extract text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length < 100) {
      return NextResponse.json(
        { error: "Could not extract meaningful text from the PDF. Make sure it's not a scanned image." },
        { status: 400 }
      );
    }

    // Truncate to ~15000 chars to stay within context limits
    const truncatedText = pdfText.slice(0, 15000);

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are an expert educator. Analyze the following PDF content and generate exactly ${count} high-quality Q&A flashcards.

Rules:
- Questions should test understanding, not just recall
- Answers should be concise but complete (2-4 sentences max)
- Cover the most important concepts in the document
- Vary difficulty: include factual, conceptual, and application questions
- Make questions clear and unambiguous

Return ONLY a valid JSON array (no markdown, no explanation) in this exact format:
[
  {
    "id": 1,
    "question": "Your question here?",
    "answer": "Your concise answer here.",
    "topic": "Short topic label (2-4 words)"
  }
]

PDF Content:
${truncatedText}`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON response
    let flashcards;
    try {
      // Strip any accidental markdown fences
      const cleaned = responseText.replace(/```json|```/g, "").trim();
      flashcards = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      flashcards,
      pageCount: pdfData.numpages,
      filename: file.name,
    });
  } catch (error: unknown) {
    console.error("Flashcard generation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate flashcards: ${message}` },
      { status: 500 }
    );
  }
}
