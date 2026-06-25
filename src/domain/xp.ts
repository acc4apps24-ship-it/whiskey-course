export type ChapterCompletionInput = {
  completed: boolean;
  perfect: boolean;
};

export function calculateAnswerXp(isCorrect: boolean): number {
  return isCorrect ? 10 : 0;
}

export function calculateFinalXp(correctAnswers: number): number {
  return Math.max(0, Math.min(correctAnswers, 20)) * 10;
}

export function calculateChapterCompletionXp(input: ChapterCompletionInput): number {
  if (!input.completed) return 0;
  return 100 + (input.perfect ? 50 : 0);
}
