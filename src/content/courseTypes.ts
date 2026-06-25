export type CardType =
  | "content"
  | "fact"
  | "myth"
  | "quiz-single"
  | "quiz-true-false"
  | "quiz-match"
  | "practice"
  | "summary";

export type Achievement = {
  id: "ACH-001" | "ACH-002" | "ACH-003" | "ACH-004" | "ACH-005";
  title: string;
  condition: string;
  screenText: string;
};

export type BaseCard = {
  id: string;
  type: CardType;
  title: string;
  body: string;
};

export type Option = {
  id: string;
  text: string;
};

export type QuizCard = BaseCard & {
  type: "quiz-single" | "quiz-true-false" | "quiz-match";
  options: Option[];
  correctOptionId: string;
  successFeedback: string;
  errorFeedback: string;
  explanation: string;
  xp: number;
};

export type PracticeCard = BaseCard & {
  type: "practice";
  promptFields: string[];
  feedback: string;
};

export type ContentCard = BaseCard & {
  type: "content" | "fact" | "myth" | "summary";
  keyThought?: string;
};

export type CourseCard = ContentCard | QuizCard | PracticeCard;

export type Chapter = {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  achievementId?: Achievement["id"];
  cards: CourseCard[];
};

export type FinalQuestion = {
  id: string;
  question: string;
  options: Option[];
  correctOptionId: string;
};

export type Course = {
  id: "whisky-journey";
  title: string;
  version: "1.0";
  achievements: Achievement[];
  chapters: Chapter[];
  finalChallenge: {
    title: "Финальное испытание";
    questions: FinalQuestion[];
  };
};
