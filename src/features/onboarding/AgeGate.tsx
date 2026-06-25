import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AgeGate({ onAccept }: { onAccept: () => void }) {
  const [blocked, setBlocked] = useState(false);

  if (blocked) {
    return (
      <Card>
        <p className="text-sm font-semibold text-amber">18+</p>
        <h1 className="mt-3 text-2xl font-bold leading-tight">Спасибо за честность</h1>
        <p className="mt-4 leading-7 text-stone-300">
          Спасибо за честность. Этот курс доступен только совершеннолетним пользователям.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-sm font-semibold text-amber">18+</p>
      <h1 className="mt-3 text-3xl font-bold leading-tight">Whisky Journey</h1>
      <p className="mt-4 leading-7 text-stone-300">
        Whisky Journey — интерактивная игра про шотландский виски для пользователей
        18+. Подтвердите, что вам есть 18 лет.
      </p>
      <p className="mt-4 text-sm leading-6 text-stone-400">
        Для обучения не обязательно пить алкоголь: многие задания можно пройти по
        описаниям, а дегустационную практику можно заменить наблюдением за ароматом
        или безалкогольной альтернативой.
      </p>
      <div className="mt-6 grid gap-3">
        <Button onClick={onAccept}>Мне есть 18</Button>
        <Button variant="ghost" onClick={() => setBlocked(true)}>
          Мне нет 18
        </Button>
      </div>
    </Card>
  );
}
