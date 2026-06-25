import { useEffect, useMemo, useState } from "react";
import { AppProvider, useAppState } from "@/app/AppProvider";
import { BrandedLoader } from "@/components/BrandedLoader";
import { course, getChapter } from "@/content/course";
import { CardPlayer } from "@/features/course/CardPlayer";
import { CourseMap } from "@/features/course/CourseMap";
import { Leaderboard } from "@/features/leaderboard/Leaderboard";
import { AgeGate } from "@/features/onboarding/AgeGate";
import { NameGate } from "@/features/onboarding/NameGate";
import type { LeaderboardEntry } from "@/repositories/learningRepository";

function AppContent() {
  const app = useAppState();
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [locallyCompletedChapterIds, setLocallyCompletedChapterIds] = useState<
    string[]
  >([]);
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

  useEffect(() => {
    if (!app.session) {
      setLeaderboard([]);
      return;
    }

    let isMounted = true;

    Promise.resolve(app.repository.getLeaderboard(app.session.userId))
      .then((entries) => {
        if (isMounted) {
          setLeaderboard(entries ?? []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLeaderboard([]);
        }
      });

    return () => {
      isMounted = false;
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

              await app.repository.recordAnswer({
                userId: app.session.userId,
                ...answer,
              });
            }}
            onCompleteChapter={async (chapterId) => {
              if (app.session) {
                await app.repository.saveProgress({
                  userId: app.session.userId,
                  chapterId,
                  status: "completed",
                });
              }
              setLocallyCompletedChapterIds((current) =>
                Array.from(new Set([...current, chapterId])),
              );
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
            <CourseMap
              course={course}
              completedChapterIds={completedChapterIds}
              onOpenChapter={setActiveChapterId}
            />
            <Leaderboard entries={leaderboard} />
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
