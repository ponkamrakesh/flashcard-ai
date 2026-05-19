import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import pdfParse from "pdf-parse";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "placeholder" });

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length < 100) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Make sure it's not a scanned image." },
        { status: 400 }
      );
    }

    const truncatedText = pdfText.slice(0, 15000);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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
      temperature: 0.7,
      max_tokens: 4096,
    });

    const responseText = completion.choices[0]?.message?.content || "";

    let flashcards;
    try {
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
