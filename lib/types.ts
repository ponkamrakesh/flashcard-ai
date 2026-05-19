export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  topic: string;
}

export interface GenerateResponse {
  flashcards: Flashcard[];
  pageCount: number;
  filename: string;
  error?: string;
}
