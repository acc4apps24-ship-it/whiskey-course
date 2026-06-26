import { useEffect, useMemo, useRef, useState } from "react";
import { AppProvider, useAppState } from "@/app/AppProvider";
import { BrandedLoader } from "@/components/BrandedLoader";
import { Button } from "@/components/ui/button";
import { course, getChapter } from "@/content/course";
import { getUnlockedAchievementIds } from "@/domain/achievements";
import { isFinalChallengeUnlocked } from "@/domain/progress";
import { CardPlayer } from "@/features/course/CardPlayer";
import { CourseMap } from "@/features/course/CourseMap";
import { FinalChallenge } from "@/features/final/FinalChallenge";
import { Leaderboard } from "@/features/leaderboard/Leaderboard";
import { AgeGate } from "@/features/onboarding/AgeGate";
import { NameGate } from "@/features/onboarding/NameGate";
import type { LeaderboardEntry } from "@/repositories/learningRepository";

function AppContent() {
  const app = useAppState();
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [isFinalChallengeOpen, setIsFinalChallengeOpen] = useState(false);
  const [locallyCompletedChapterIds, setLocallyCompletedChapterIds] = useState<
    string[]
  >([]);
  const [localXp, setLocalXp] = useState(0);
  const locallyRecordedAnswerIdsRef = useRef(new Set<string>());
  const leaderboardRequestIdRef = useRef(0);
  const [finalResult, setFinalResult] = useState<{
    correctAnswers: number;
    xp: number;
  } | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const activeChapter = activeChapterId ? getChapter(activeChapterId) : undefined;
  const completedChapterIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...(app.session?.completedChapterIds ?? []),
          ...locallyCompletedChapterIds,
        ]),
      ),
    [app.session?.completedChapterIds, locallyCompletedChapterIds],
  );
  const finalChallengeUnlocked = isFinalChallengeUnlocked(
    completedChapterIds,
    course.chapters.map((chapter) => chapter.id),
  );
  const currentLeaderboardEntry = leaderboard.find(
    (entry) => entry.userId === app.session?.userId,
  );
  const achievementTitleById = new Map<string, string>(
    course.achievements.map((achievement) => [achievement.id, achievement.title]),
  );
  const finalSummary = finalResult
    ? {
        totalXp:
          currentLeaderboardEntry?.totalXp ??
          (app.session?.totalXp ?? 0) + localXp + finalResult.xp,
        achievements: Array.from(
          new Set([
            ...(app.session?.achievements ?? []),
            ...getUnlockedAchievementIds(completedChapterIds, true),
          ]),
        ).map((achievementId) => achievementTitleById.get(achievementId) ?? achievementId),
        leaderboardRank: currentLeaderboardEntry?.rank,
      }
    : undefined;

  async function refreshLeaderboardForCurrentSession() {
    if (!app.session) {
      leaderboardRequestIdRef.current += 1;
      setLeaderboard([]);
      return [];
    }

    const requestId = leaderboardRequestIdRef.current + 1;
    leaderboardRequestIdRef.current = requestId;

    try {
      const entries = await app.repository.getLeaderboard(app.session.userId);
      const safeEntries = entries ?? [];
      if (leaderboardRequestIdRef.current === requestId) {
        setLeaderboard(safeEntries);
      }
      return safeEntries;
    } catch {
      if (leaderboardRequestIdRef.current === requestId) {
        setLeaderboard([]);
      }
      return [];
    }
  }

  useEffect(() => {
    refreshLeaderboardForCurrentSession().catch(() => undefined);

    return () => {
      leaderboardRequestIdRef.current += 1;
    };
  }, [app.repository, app.session]);

  return (
    <main className="min-h-[100svh] px-5 py-6 safe-bottom">
      <section className="mx-auto flex min-h-[calc(100svh-3rem)] max-w-md flex-col justify-center">
        {app.error && app.screen !== "name-gate" ? (
          <p className="mb-4 rounded-lg border border-red-300/30 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {app.error}
          </p>
        ) : null}
        {app.screen === "loading" ? <BrandedLoader label="Готовим первый драм" /> : null}
        {app.screen === "age-gate" ? <AgeGate onAccept={app.acceptAgeGate} /> : null}
        {app.screen === "name-gate" ? (
          <NameGate
            error={app.error}
            isSubmitting={app.isCreatingSession}
            onSubmit={app.createSession}
          />
        ) : null}
        {app.screen === "course" && activeChapter ? (
          <CardPlayer
            chapter={activeChapter}
            onAnswerSelected={async (answer) => {
              if (!app.session) return;

              const result = await app.repository.recordAnswer({
                userId: app.session.userId,
                ...answer,
              });
              if (!locallyRecordedAnswerIdsRef.current.has(answer.activityId)) {
                locallyRecordedAnswerIdsRef.current.add(answer.activityId);
                setLocalXp((current) => current + result.xpAwarded);
              }
            }}
            onCompleteChapter={async (chapterId) => {
              const alreadyCompleted = completedChapterIds.includes(chapterId);
              let progressResult = { xpAwarded: 0 };
              if (app.session) {
                progressResult = await app.repository.saveProgress({
                  userId: app.session.userId,
                  chapterId,
                  status: "completed",
                });
              }
              setLocallyCompletedChapterIds((current) =>
                Array.from(new Set([...current, chapterId])),
              );
              if (!alreadyCompleted) {
                setLocalXp((current) => current + progressResult.xpAwarded);
              }
              setActiveChapterId(null);
            }}
            onSaveTastingNote={async (note) => {
              if (!app.session) return;

              await app.repository.saveTastingNote({
                userId: app.session.userId,
                chapterId: activeChapter.id,
                ...note,
              });
            }}
          />
        ) : null}
        {app.screen === "course" && !activeChapter ? (
          <div className="grid gap-4">
            <p className="text-sm text-smoke">
              С возвращением, {app.session?.displayName}.
            </p>
            {isFinalChallengeOpen ? (
              <div className="grid gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsFinalChallengeOpen(false)}
                >
                  Вернуться к карте курса
                </Button>
                <FinalChallenge
                  summary={finalSummary}
                  questions={course.finalChallenge.questions}
                  onComplete={async (result) => {
                    if (!app.session) return;

                    const saved = await app.repository.recordFinalResult({
                      userId: app.session.userId,
                      correctAnswers: result.correctAnswers,
                      xpDelta: result.xp,
                    });
                    const savedResult = { ...result, xp: saved.xpAwarded };
                    await refreshLeaderboardForCurrentSession();
                    setFinalResult(savedResult);
                    return savedResult;
                  }}
                />
              </div>
            ) : (
              <>
                <CourseMap
                  course={course}
                  completedChapterIds={completedChapterIds}
                  onOpenChapter={(chapterId) => {
                    setIsFinalChallengeOpen(false);
                    setActiveChapterId(chapterId);
                  }}
                />
                {finalChallengeUnlocked ? (
                  <Button type="button" onClick={() => setIsFinalChallengeOpen(true)}>
                    Открыть финальное испытание
                  </Button>
                ) : null}
              </>
            )}
            <Leaderboard entries={leaderboard} />
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default function App() {
  const previewMode =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("preview")
      : null;

  if (previewMode === "loader") {
    return (
      <main className="grid min-h-[100svh] place-items-center px-5 py-6 safe-bottom">
        <BrandedLoader label="Готовим первый драм" />
      </main>
    );
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
