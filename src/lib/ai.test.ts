import { afterEach, describe, expect, it, vi } from "vitest";
import { generateAI } from "./ai";

describe("AI service fallback", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("returns an editable deterministic lesson plan without an API key", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    const result = await generateAI({ type: "LESSON_PLAN", topic: "Goodwill valuation", grade: "12" });
    expect(result.provider).toBe("deterministic-fallback");
    expect(result.content).toContain("45-minute flow");
    expect(result.content).toContain("Teacher review");
  });
  it("does not frame student doubt help as a final answer", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    const result = await generateAI({ type: "DOUBT_HELP", topic: "Sacrificing ratio", grade: "12", audience: "student" });
    expect(result.content).toContain("without giving away assessed work");
    expect(result.content).toContain("Learning safety");
    expect(result.content).not.toContain("Teacher review");
  });
});
