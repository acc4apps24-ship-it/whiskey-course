import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AgeGate } from "./AgeGate";
import { NameGate } from "./NameGate";

describe("onboarding", () => {
  it("blocks underage users with the required copy", async () => {
    const onAccept = vi.fn();
    render(<AgeGate onAccept={onAccept} />);

    await userEvent.click(screen.getByRole("button", { name: "Мне нет 18" }));

    expect(onAccept).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        "Спасибо за честность. Этот курс доступен только совершеннолетним пользователям.",
      ),
    ).toBeInTheDocument();
  });

  it("validates display name length", async () => {
    const onSubmit = vi.fn();
    render(<NameGate onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Имя в рейтинге"), "A");
    await userEvent.click(screen.getByRole("button", { name: "Начать путешествие" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Имя должно быть от 2 до 24 символов.")).toBeInTheDocument();
  });
});
