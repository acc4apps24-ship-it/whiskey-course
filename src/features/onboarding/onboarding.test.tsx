import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { AgeGate } from "./AgeGate";
import { NameGate } from "./NameGate";

const mocks = vi.hoisted(() => ({
  cookie: null as string | null,
  repository: {
    getSession: vi.fn(),
    createSession: vi.fn(),
    saveProgress: vi.fn(),
    recordAnswer: vi.fn(),
    saveTastingNote: vi.fn(),
    getLeaderboard: vi.fn(),
  },
  getSessionIdCookie: vi.fn(),
  setSessionIdCookie: vi.fn(),
  clearSessionIdCookie: vi.fn(),
}));

vi.mock("@/repositories/learningRepository", () => ({
  createLearningRepository: () => mocks.repository,
}));

vi.mock("@/lib/cookies", () => ({
  SESSION_COOKIE: "wj_session_id",
  getSessionIdCookie: mocks.getSessionIdCookie,
  setSessionIdCookie: mocks.setSessionIdCookie,
  clearSessionIdCookie: mocks.clearSessionIdCookie,
}));

const session = {
  userId: "user_1",
  sessionId: "session_1",
  displayName: "Ada",
  totalXp: 0,
  completedChapterIds: [],
  achievements: [],
};

describe("onboarding", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mocks.cookie = null;
    vi.clearAllMocks();
    mocks.getSessionIdCookie.mockImplementation(() => mocks.cookie);
    mocks.setSessionIdCookie.mockImplementation((sessionId: string) => {
      mocks.cookie = sessionId;
    });
    mocks.clearSessionIdCookie.mockImplementation(() => {
      mocks.cookie = null;
    });
    mocks.repository.getSession.mockResolvedValue(null);
    mocks.repository.createSession.mockResolvedValue(session);
  });

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

  it("restores an existing cookie session", async () => {
    mocks.cookie = "session_1";
    mocks.repository.getSession.mockResolvedValue(session);

    render(<App />);

    expect(await screen.findByText("С возвращением, Ada.")).toBeInTheDocument();
    expect(mocks.repository.getSession).toHaveBeenCalledWith("session_1");
  });

  it("clears a dead cookie session and returns to the age gate", async () => {
    mocks.cookie = "dead_session";
    mocks.repository.getSession.mockResolvedValue(null);

    render(<App />);

    expect(await screen.findByRole("button", { name: "Мне есть 18" })).toBeInTheDocument();
    expect(mocks.clearSessionIdCookie).toHaveBeenCalled();
    expect(mocks.cookie).toBeNull();
  });

  it("creates a session, stores its cookie, and opens the course", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("button", { name: "Мне есть 18" }));
    await user.type(screen.getByLabelText("Имя в рейтинге"), "  Ada  ");
    await user.click(screen.getByRole("button", { name: "Начать путешествие" }));

    expect(await screen.findByText("С возвращением, Ada.")).toBeInTheDocument();
    expect(mocks.repository.createSession).toHaveBeenCalledWith("Ada");
    expect(mocks.setSessionIdCookie).toHaveBeenCalledWith("session_1");
  });

  it("shows session creation errors and stays on the name gate", async () => {
    const user = userEvent.setup();
    mocks.repository.createSession.mockRejectedValue(new Error("network"));
    render(<App />);

    await user.click(await screen.findByRole("button", { name: "Мне есть 18" }));
    await user.type(screen.getByLabelText("Имя в рейтинге"), "Ada");
    await user.click(screen.getByRole("button", { name: "Начать путешествие" }));

    expect(await screen.findByText("Не удалось создать сессию.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Начать путешествие" })).toBeEnabled();
    expect(mocks.setSessionIdCookie).not.toHaveBeenCalled();
  });

  it("does not create duplicate sessions while a submit is pending", async () => {
    const user = userEvent.setup();
    let resolveSession: (value: typeof session) => void = () => {};
    mocks.repository.createSession.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSession = resolve;
        }),
    );
    render(<App />);

    await user.click(await screen.findByRole("button", { name: "Мне есть 18" }));
    await user.type(screen.getByLabelText("Имя в рейтинге"), "Ada");
    await user.dblClick(screen.getByRole("button", { name: "Начать путешествие" }));

    expect(mocks.repository.createSession).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Создаём сессию..." })).toBeDisabled();

    resolveSession(session);
    await waitFor(() => {
      expect(screen.getByText("С возвращением, Ada.")).toBeInTheDocument();
    });
  });
});
