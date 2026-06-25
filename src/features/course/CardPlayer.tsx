import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Chapter, CourseCard, QuizCard } from "@/content/courseTypes";
import { calculateAnswerXp } from "@/domain/xp";

function isQuiz(card: CourseCard): card is QuizCard {
  return (
    card.type === "quiz-single" ||
    card.type === "quiz-true-false" ||
    card.type === "quiz-match"
  );
}

export function CardPlayer({
  chapter,
  onCompleteChapter,
}: {
  chapter: Chapter;
  onCompleteChapter: (chapterId: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const card = chapter.cards[index];
  const quiz = isQuiz(card) ? card : null;
  const isLast = index === chapter.cards.length - 1;
  const selectedIsCorrect =
    quiz && selectedOptionId ? selectedOptionId === quiz.correctOptionId : false;
  const selectedXp = selectedOptionId ? calculateAnswerXp(selectedIsCorrect) : 0;

  function next() {
    if (isLast) {
      onCompleteChapter(chapter.id);
      return;
    }

    setSelectedOptionId(null);
    setIndex((current) => current + 1);
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="font-semibold text-amber">{chapter.title}</p>
        <p className="text-stone-400">
          {index + 1}/{chapter.cards.length}
        </p>
      </div>
      <h1 className="mt-3 text-2xl font-bold leading-tight">{card.title}</h1>
      <p className="mt-4 leading-7 text-stone-200">{card.body}</p>

      {"keyThought" in card && card.keyThought ? (
        <p className="mt-4 rounded-xl border border-moss/20 bg-moss/10 px-4 py-3 text-sm leading-6 text-moss">
          {card.keyThought}
        </p>
      ) : null}

      {quiz ? (
        <div className="mt-6 grid gap-3">
          {quiz.options.map((option) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <Button
                key={option.id}
                variant="ghost"
                className={
                  isSelected
                    ? "border border-amber/50 bg-amber/15 text-foreground"
                    : "border border-white/10"
                }
                onClick={() => setSelectedOptionId(option.id)}
              >
                {option.text}
              </Button>
            );
          })}
          {selectedOptionId ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-200">
              <p className="font-bold text-foreground">
                {selectedIsCorrect
                  ? `Верно. +${selectedXp} XP`
                  : `Неверно. +${selectedXp} XP`}
              </p>
              <p className="mt-2">
                {selectedIsCorrect ? quiz.successFeedback : quiz.errorFeedback}
              </p>
              <p className="mt-2 text-stone-300">{quiz.explanation}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      <Button
        className="mt-6 w-full"
        onClick={next}
        disabled={Boolean(quiz && !selectedOptionId)}
      >
        {isLast ? "Завершить главу" : "Дальше"}
      </Button>
    </Card>
  );
}
