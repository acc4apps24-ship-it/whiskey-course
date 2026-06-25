import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Course } from "@/content/courseTypes";
import { isFinalChallengeUnlocked } from "@/domain/progress";

export function CourseMap({
  course,
  completedChapterIds,
  onOpenChapter,
}: {
  course: Course;
  completedChapterIds: string[];
  onOpenChapter: (chapterId: string) => void;
}) {
  const requiredChapterIds = course.chapters.map((chapter) => chapter.id);
  const completedRequiredChapterIds = requiredChapterIds.filter((chapterId) =>
    completedChapterIds.includes(chapterId),
  );
  const finalUnlocked = isFinalChallengeUnlocked(
    completedChapterIds,
    requiredChapterIds,
  );
  const progress =
    course.chapters.length > 0
      ? Math.round((completedRequiredChapterIds.length / course.chapters.length) * 100)
      : 0;

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden">
        <p className="text-sm font-semibold text-moss">Whisky Map</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight">
          Путешествие по Шотландии
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-300">
          Выбирай главу, проходи карточки и открывай финальное испытание.
        </p>
        <div className="mt-5">
          <Progress value={progress} />
          <p className="mt-2 text-sm text-stone-300">
            {completedRequiredChapterIds.length}/{course.chapters.length} глав
          </p>
        </div>
      </Card>

      <div className="grid gap-3">
        {course.chapters.map((chapter, index) => {
          const completed = completedChapterIds.includes(chapter.id);

          return (
            <Card key={chapter.id} className="grid gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-amber">
                    Глава {index + 1}
                  </p>
                  <h2 className="mt-1 text-xl font-bold">{chapter.title}</h2>
                </div>
                {completed ? (
                  <span className="rounded-full border border-moss/30 bg-moss/10 px-3 py-1 text-xs font-bold text-moss">
                    Пройдена
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-stone-300">
                {chapter.subtitle} · {chapter.durationMinutes} мин
              </p>
              <Button
                onClick={() => onOpenChapter(chapter.id)}
                aria-label={`Открыть ${chapter.title}`}
              >
                Открыть
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="border-amber/20 bg-copper/10">
        <p className="text-xs font-bold uppercase text-amber">Финиш</p>
        <h2 className="mt-1 text-xl font-bold">{course.finalChallenge.title}</h2>
        <p className="mt-2 text-sm text-stone-300">
          {finalUnlocked
            ? "Финальное испытание доступно"
            : "Финальное испытание закрыто"}
        </p>
      </Card>
    </div>
  );
}
