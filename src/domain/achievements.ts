export type AchievementId = "ACH-001" | "ACH-002" | "ACH-003" | "ACH-004" | "ACH-005";

const chapterAchievementMap: Record<string, AchievementId> = {
  "chapter-1-first-dram": "ACH-001",
  "chapter-2-speyside": "ACH-002",
  "chapter-4-islay": "ACH-003",
  "chapter-5-casks": "ACH-004",
};

export function getUnlockedAchievementIds(
  completedChapterIds: string[],
  finalCompleted: boolean,
): AchievementId[] {
  const unlocked = completedChapterIds
    .map((chapterId) => chapterAchievementMap[chapterId])
    .filter((achievementId): achievementId is AchievementId => Boolean(achievementId));

  if (finalCompleted) unlocked.push("ACH-005");

  return Array.from(new Set(unlocked));
}
