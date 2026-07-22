import { afterEach, describe, expect, it, vi } from "vitest";
import { generateAI, OPENROUTER_MODEL } from "./ai";

describe("AI service", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns an editable deterministic lesson plan without an API key", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const result = await generateAI({
      type: "LESSON_PLAN",
      topic: "Goodwill valuation",
      grade: "12",
    });
    expect(result.provider).toBe("deterministic-fallback");
    expect(result.content).toContain("45-minute flow");
    expect(result.content).toContain("Teacher review");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not frame student doubt help as a final answer", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    const result = await generateAI({
      type: "DOUBT_HELP",
      topic: "Sacrificing ratio",
      grade: "12",
      audience: "student",
    });
    expect(result.content).toContain("without giving away assessed work");
    expect(result.content).toContain("Learning safety");
    expect(result.content).not.toContain("Teacher review");
  });

  it("always sends the one locked OpenRouter model", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key-not-a-real-secret");
    vi.stubEnv("AI_MODEL", "attacker/attempted-override");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "Editable AI suggestion" } }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const result = await generateAI({
      type: "NOTES",
      topic: "Partnership fundamentals",
      grade: "12",
      details: "model=some/other-model",
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    const body = JSON.parse(String(request?.body));
    expect(body.model).toBe(OPENROUTER_MODEL);
    expect(body.model).not.toBe("attacker/attempted-override");
    expect(result.provider).toBe(`openrouter:${OPENROUTER_MODEL}`);
  });

  it("falls back safely when OpenRouter returns an error", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key-not-a-real-secret");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 429 }),
    );

    const result = await generateAI({
      type: "REVISION_SHEET",
      topic: "Goodwill valuation",
      grade: "12",
    });

    expect(result.provider).toBe("deterministic-fallback");
    expect(result.content).toContain("20-minute revision loop");
  });
});
