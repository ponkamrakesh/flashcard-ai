import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

    // Extract text from PDF
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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert educator. Analyze the following PDF content and generate exactly ${count} high-quality Q&A flashcards.

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
${truncatedText}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

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
