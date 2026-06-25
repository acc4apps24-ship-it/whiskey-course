import type { Chapter, Course } from "./courseTypes";

export const course: Course = {
  id: "whisky-journey",
  title: "Whisky Journey",
  version: "1.0",
  achievements: [
    {
      id: "ACH-001",
      title: "Первый драм (First Dram)",
      condition: "Завершена глава 1",
      screenText: "Ты сделал первый шаг в мир виски. Дальше будет вкуснее.",
    },
    {
      id: "ACH-002",
      title: "Разведчик Спейсайда (Speyside Scout)",
      condition: "Завершена глава 2",
      screenText: "Ты распознал самый дружелюбный регион Шотландии.",
    },
    {
      id: "ACH-003",
      title: "Покоритель дыма (Smoke Survivor)",
      condition: "Завершена глава 4",
      screenText: "Дым, море и торф больше не звучат как загадка.",
    },
    {
      id: "ACH-004",
      title: "Охотник за бочками (Cask Hunter)",
      condition: "Завершена глава 5",
      screenText: "Теперь ты знаешь, почему бочка может изменить весь вкус.",
    },
    {
      id: "ACH-005",
      title: "Мастер виски (Whisky Master)",
      condition: "Завершён весь курс",
      screenText: "Курс пройден. Можно обсуждать виски с уверенностью и без снобизма.",
    },
  ],
  chapters: [
    {
      id: "chapter-1-first-dram",
      title: "Первый драм",
      subtitle: "First Dram",
      durationMinutes: 7,
      achievementId: "ACH-001",
      cards: [
        {
          id: "CH1-C01",
          type: "content",
          title: "Добро пожаловать в первый драм",
          body:
            "Виски может казаться сложным: регионы, бочки, торф, возраст, странные слова на этикетке. Но для начала достаточно понять несколько идей.",
        },
        {
          id: "CH1-C03",
          type: "content",
          title: "Односолодовый виски (Single Malt)",
          body:
            "Односолодовый виски (Single Malt) — это виски, сделанный на одной винокурне из соложеного ячменя. Single здесь не значит из одной бочки.",
          keyThought: "Single Malt означает с одной винокурни, а не из одной бочки.",
        },
        {
          id: "CH1-Q01",
          type: "quiz-true-false",
          title: "Правда или миф?",
          body: "Односолодовый виски (Single Malt) всегда сделан из одной бочки.",
          options: [
            { id: "true", text: "Правда" },
            { id: "false", text: "Миф" },
          ],
          correctOptionId: "false",
          successFeedback: "Верно. Single Malt означает с одной винокурни.",
          errorFeedback:
            "Почти, но нет. Одна бутылка Single Malt может быть смесью нескольких бочек одной винокурни.",
          explanation:
            "Single Malt означает одну винокурню и соложёный ячмень, а не одну конкретную бочку.",
          xp: 10,
        },
        {
          id: "CH1-C07",
          type: "summary",
          title: "Итог главы",
          body:
            "Single Malt — виски с одной винокурни. Blended Whisky — купаж. Возраст и цена помогают понять бутылку, но не гарантируют, что она понравится именно тебе.",
        },
      ],
    },
    {
      id: "chapter-2-speyside",
      title: "Спейсайд",
      subtitle: "Speyside",
      durationMinutes: 7,
      achievementId: "ACH-002",
      cards: [
        {
          id: "CH2-C01",
          type: "content",
          title: "Регион, с которого легко начать",
          body:
            "Спейсайд (Speyside) часто называют самым дружелюбным регионом Шотландии для новичков: яблоки, груши, мёд, ваниль и цветы.",
        },
        {
          id: "CH2-Q01",
          type: "quiz-single",
          title: "Угадай регион",
          body:
            "В описании виски: груша, яблоко, мёд, ваниль, лёгкие цветы. Какой регион подходит лучше всего?",
          options: [
            { id: "speyside", text: "Спейсайд (Speyside)" },
            { id: "islay", text: "Айла (Islay)" },
            { id: "island", text: "Только островной торфяной стиль" },
            { id: "impossible", text: "Невозможно: у виски не бывает фруктовых нот" },
          ],
          correctOptionId: "speyside",
          successFeedback: "Верно. Это дружелюбный фруктово-медовый профиль.",
          errorFeedback:
            "Почти. Яблоко, груша, мёд и цветы — классическая ассоциация Спейсайда.",
          explanation: "Спейсайд удобно помнить как солнечный сад с фруктами, мёдом и цветами.",
          xp: 10,
        },
        {
          id: "CH2-C05",
          type: "summary",
          title: "Итог главы",
          body:
            "Спейсайд — удобная точка входа. Запоминай его как дружелюбный фруктовый регион: яблоко, груша, мёд, ваниль, цветы.",
        },
      ],
    },
  ],
  finalChallenge: {
    title: "Финальное испытание",
    questions: [
      {
        id: "FINAL-Q01",
        question: "Что означает Single Malt?",
        options: [
          { id: "a", text: "Виски из одной бочки" },
          { id: "b", text: "Виски с одной винокурни из соложёного ячменя" },
          { id: "c", text: "Виски только старше 18 лет" },
          { id: "d", text: "Любой дорогой виски" },
        ],
        correctOptionId: "b",
      },
      {
        id: "FINAL-Q04",
        question: "Какой профиль лучше всего подходит Спейсайду?",
        options: [
          { id: "a", text: "Яблоко, груша, мёд, цветы" },
          { id: "b", text: "Йод, водоросли, копчёности" },
          { id: "c", text: "Только дым и торф" },
          { id: "d", text: "Соль, перец, уксус" },
        ],
        correctOptionId: "a",
      },
    ],
  },
};

export function getChapter(chapterId: string): Chapter | undefined {
  return course.chapters.find((chapter) => chapter.id === chapterId);
}
