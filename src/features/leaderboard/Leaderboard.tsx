import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { LeaderboardEntry } from "@/repositories/learningRepository";

function formatChapterCount(count: number) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} глав`;
  }

  if (lastDigit === 1) {
    return `${count} глава`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} главы`;
  }

  return `${count} глав`;
}

export function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <Card>
        <p className="text-base leading-7 text-stone-300">
          Пока нет результатов. Стань первым в лиге.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-3">
        <Trophy className="h-5 w-5 text-amber" aria-hidden="true" />
        <div>
          <p className="text-[13px] font-bold uppercase leading-5 text-moss">Рейтинг</p>
          <h2 className="mt-1 text-[22px] font-bold leading-tight">Лига Whisky Journey</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {entries.map((entry) => (
          <article
            key={entry.userId}
            className="rounded-xl border border-white/10 bg-black/20 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-bold leading-6 text-amber">#{entry.rank}</p>
                <h3 className="mt-1 break-words text-lg font-bold leading-tight">
                  {entry.displayName}
                </h3>
              </div>
              <p className="shrink-0 text-[15px] font-bold leading-6 text-amber">
                {entry.totalXp} XP
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] leading-5">
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-semibold text-stone-300">
                {formatChapterCount(entry.completedChapters)}
              </span>
              {entry.isCurrentUser ? (
                <span className="rounded-full border border-moss/30 bg-moss/10 px-3 py-1 font-bold text-moss">
                  Текущий игрок
                </span>
              ) : null}
            </div>

            <p className="mt-3 text-[13px] leading-5 text-stone-400">
              {entry.achievements.length > 0
                ? entry.achievements.join(", ")
                : "Достижения ещё впереди"}
            </p>
          </article>
        ))}
      </div>
    </Card>
  );
}
