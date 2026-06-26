import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Chapter, CourseCard, QuizCard } from "@/content/courseTypes";
import { calculateAnswerXp } from "@/domain/xp";
import { CardIllustration, getCardVisual } from "./cardVisuals";
import { TastingNoteForm, type TastingNoteDraft } from "./TastingNoteForm";

function isQuiz(card: CourseCard): card is QuizCard {
  return (
    card.type === "quiz-single" ||
    card.type === "quiz-true-false" ||
    card.type === "quiz-match"
  );
}

function splitBodyIntoParagraphs(body: string): string[] {
  const sentences = body.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((item) => item.trim()) ?? [body];

  if (sentences.length <= 1) return [body];
  if (sentences.length <= 4) return sentences;

  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(" "));
  }

  return paragraphs;
}

function ReadableBody({ body }: { body: string }) {
  return (
    <div className="mt-5 grid gap-4 text-[15px] leading-7 text-stone-200">
      {splitBodyIntoParagraphs(body).map((paragraph) => (
        <p key={paragraph} data-testid="card-body-paragraph">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function CardPlayer({
  chapter,
  onAnswerSelected,
  onCompleteChapter,
  onSaveTastingNote,
}: {
  chapter: Chapter;
  onAnswerSelected?: (answer: {
    chapterId: string;
    activityId: string;
    answer: string;
    isCorrect: boolean;
    xpDelta: number;
  }) => void | Promise<void>;
  onCompleteChapter: (chapterId: string) => void | Promise<void>;
  onSaveTastingNote?: (note: TastingNoteDraft) => Promise<void>;
}) {
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [isCompletingChapter, setIsCompletingChapter] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const card = chapter.cards[index];
  const quiz = isQuiz(card) ? card : null;
  const isLast = index === chapter.cards.length - 1;
  const selectedIsCorrect =
    quiz && selectedOptionId ? selectedOptionId === quiz.correctOptionId : false;
  const selectedXp = selectedOptionId ? calculateAnswerXp(selectedIsCorrect) : 0;
  const visual = getCardVisual(chapter.id, card, index);

  async function persistAnswer(optionId: string, quizCard: QuizCard) {
    const isCorrect = optionId === quizCard.correctOptionId;
    setIsSavingAnswer(true);
    setAnswerError(null);
    try {
      await onAnswerSelected?.({
        chapterId: chapter.id,
        activityId: quizCard.id,
        answer: optionId,
        isCorrect,
        xpDelta: calculateAnswerXp(isCorrect),
      });
    } catch {
      setAnswerError("Не удалось сохранить ответ. Проверьте связь и попробуйте ещё раз.");
    } finally {
      setIsSavingAnswer(false);
    }
  }

  function selectOption(optionId: string) {
    if (!quiz || selectedOptionId || isSavingAnswer) return;

    setSelectedOptionId(optionId);
    void persistAnswer(optionId, quiz);
  }

  async function retryAnswerSave() {
    if (!quiz || !selectedOptionId || isSavingAnswer) return;
    await persistAnswer(selectedOptionId, quiz);
  }

  async function next() {
    if (isLast) {
      setIsCompletingChapter(true);
      setCompletionError(null);
      try {
        await onCompleteChapter(chapter.id);
      } catch {
        setCompletionError("Не удалось сохранить прогресс. Проверьте связь и попробуйте ещё раз.");
      } finally {
        setIsCompletingChapter(false);
      }
      return;
    }

    setSelectedOptionId(null);
    setAnswerError(null);
    setCompletionError(null);
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
      {visual ? <CardIllustration visual={visual} /> : null}
      <ReadableBody body={card.body} />

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
                disabled={Boolean(selectedOptionId)}
                onClick={() => selectOption(option.id)}
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
              {answerError ? (
                <div className="mt-3 grid gap-2">
                  <p className="text-red-200">{answerError}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void retryAnswerSave()}
                    disabled={isSavingAnswer}
                  >
                    {isSavingAnswer ? "Сохраняем..." : "Повторить сохранение"}
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {card.type === "practice" && onSaveTastingNote ? (
        <TastingNoteForm onSave={onSaveTastingNote} />
      ) : null}

      <Button
        className="mt-6 w-full"
        onClick={() => void next()}
        disabled={Boolean(
          (quiz && (!selectedOptionId || isSavingAnswer || answerError)) ||
            isCompletingChapter,
        )}
      >
        {isCompletingChapter ? "Сохраняем прогресс..." : isLast ? "Завершить главу" : "Дальше"}
      </Button>
      {completionError ? <p className="mt-3 text-sm text-red-200">{completionError}</p> : null}
    </Card>
  );
}
