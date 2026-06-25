export function isFinalChallengeUnlocked(completedChapterIds: string[], requiredChapterIds: string[]): boolean {
  const completed = new Set(completedChapterIds);
  return requiredChapterIds.every((chapterId) => completed.has(chapterId));
}
