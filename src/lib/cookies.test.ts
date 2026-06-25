import { afterEach, describe, expect, it } from "vitest";

import { clearSessionIdCookie, getSessionIdCookie, setSessionIdCookie } from "./cookies";

describe("session cookie", () => {
  afterEach(() => {
    clearSessionIdCookie();
  });

  it("stores and reads wj_session_id", () => {
    setSessionIdCookie("session_123");

    expect(getSessionIdCookie()).toBe("session_123");
  });

  it("clears wj_session_id", () => {
    setSessionIdCookie("session_123");

    clearSessionIdCookie();

    expect(getSessionIdCookie()).toBeNull();
  });
});
