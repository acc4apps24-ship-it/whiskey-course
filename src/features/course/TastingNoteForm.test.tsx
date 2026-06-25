import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TastingNoteForm } from "./TastingNoteForm";

afterEach(() => {
  cleanup();
});

describe("TastingNoteForm", () => {
  it("saves partial notes without clearing data", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<TastingNoteForm onSave={onSave} />);

    await userEvent.type(screen.getByLabelText("Аромат (Nose)"), "яблоко и мёд");
    await userEvent.click(screen.getByRole("button", { name: "Сохранить заметку" }));

    expect(onSave).toHaveBeenCalledWith({ nose: "яблоко и мёд" });
    expect(screen.getByDisplayValue("яблоко и мёд")).toBeInTheDocument();
  });

  it("does not save blank notes", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<TastingNoteForm onSave={onSave} />);

    await userEvent.click(screen.getByRole("button", { name: "Сохранить заметку" }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText("Добавьте хотя бы одно наблюдение.")).toBeInTheDocument();
  });

  it("keeps text visible when saving fails", async () => {
    const onSave = vi.fn().mockRejectedValue(new Error("network"));
    render(<TastingNoteForm onSave={onSave} />);

    await userEvent.type(screen.getByLabelText("Аромат (Nose)"), "дым");
    await userEvent.click(screen.getByRole("button", { name: "Сохранить заметку" }));

    expect(await screen.findByText("Не удалось сохранить заметку. Текст остался на месте, попробуйте ещё раз.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("дым")).toBeInTheDocument();
  });
});
