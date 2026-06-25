import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FinalQuestion } from "@/content/courseTypes";
import { calculateFinalXp } from "@/domain/xp";

type FinalChallengeResult = {
  correctAnswers: number;
  xp: number;
};

type FinalChallengeSummary = {
  totalXp?: number;
  achievements?: string[];
  leaderboardRank?: number;
};

function getResultMessage(correctAnswers: number): string {
  if (correctAnswers <= 7) {
    return "Ты только начал путь. Повтори главы про регионы и бочки - там спрятана большая часть ответов.";
  }
  if (correctAnswers <= 13) {
    return "Хороший старт. Ты уже понимаешь базовую карту виски.";
  }
  if (correctAnswers <= 17) {
    return "Отличный результат. С тобой уже можно обсуждать бочки, дым и регионы.";
  }

  return "Whisky Master. Без снобизма, но с уверенностью.";
}

export function FinalChallenge({
  summary,
  questions,
  onComplete,
}: {
  summary?: FinalChallengeSummary;
  questions: FinalQuestion[];
  onComplete: (result: FinalChallengeResult) => void | Promise<void>;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedResult, setCompletedResult] = useState<FinalChallengeResult | null>(
    null,
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const answeredCount = Object.keys(answers).length;
  const correctAnswers = questions.filter(
    (question) => answers[question.id] === question.correctOptionId,
  ).length;
  const xp = calculateFinalXp(correctAnswers);

  function selectAnswer(questionId: string, optionId: string) {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  }

  async function finish() {
    const result = { correctAnswers, xp };
    setIsCompleting(true);
    setError(null);
    try {
      await onComplete(result);
      setCompletedResult(result);
    } catch {
      setError("Не удалось сохранить результат финала. Проверьте связь и попробуйте ещё раз.");
    } finally {
      setIsCompleting(false);
    }
  }

  if (completedResult) {
    return (
      <Card className="grid gap-5">
        <div>
          <p className="text-xs font-bold uppercase text-amber">Финал</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight">
            Путешествие завершено
          </h1>
          <p className="mt-3 leading-7 text-stone-200">
            Теперь у тебя есть карта: регионы, бочки, торф и дегустация. Этого
            достаточно, чтобы говорить о виски увереннее - и без снобизма.
          </p>
        </div>

        <div className="rounded-xl border border-moss/25 bg-moss/10 p-4">
          <p className="text-sm font-bold text-moss">
            Правильных ответов: {completedResult.correctAnswers}/{questions.length}
          </p>
          <p className="mt-2 text-sm text-stone-200">
            XP за финал: {completedResult.xp}
          </p>
          {typeof summary?.totalXp === "number" ? (
            <p className="mt-2 text-sm text-stone-200">
              Общий XP: {summary.totalXp}
            </p>
          ) : null}
          {typeof summary?.leaderboardRank === "number" ? (
            <p className="mt-2 text-sm text-stone-200">
              Место в leaderboard: #{summary.leaderboardRank}
            </p>
          ) : null}
          {summary?.achievements?.length ? (
            <p className="mt-2 text-sm text-stone-200">
              Достижения: {summary.achievements.join(", ")}
            </p>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-stone-200">
            {getResultMessage(completedResult.correctAnswers)}
          </p>
        </div>

        <div className="grid gap-3">
          <Button type="button">Сравнить с друзьями</Button>
          <Button type="button" variant="ghost">
            Повторить сложные главы
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-amber">Финал</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight">
            Финальное испытание
          </h1>
        </div>
        <p className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm font-bold text-stone-200">
          {answeredCount}/{questions.length}
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {questions.map((question, index) => (
          <section
            key={question.id}
            className="rounded-xl border border-white/10 bg-black/20 p-4"
          >
            <p className="text-xs font-bold uppercase text-moss">
              Вопрос {index + 1}
            </p>
            <h2 className="mt-2 text-lg font-bold leading-snug">
              {question.question}
            </h2>
            <div className="mt-4 grid gap-2">
              {question.options.map((option) => {
                const selected = answers[question.id] === option.id;

                return (
                  <Button
                    key={option.id}
                    type="button"
                    variant="ghost"
                    className={
                      selected
                        ? "border border-amber/50 bg-amber/15 text-foreground"
                        : "border border-white/10"
                    }
                    onClick={() => selectAnswer(question.id, option.id)}
                  >
                    {option.text}
                  </Button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <Button
        type="button"
        className="mt-6 w-full"
        disabled={answeredCount < questions.length || isCompleting}
        onClick={() => void finish()}
      >
        {isCompleting ? "Сохраняем результат..." : "Завершить испытание"}
      </Button>
      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </Card>
  );
}
