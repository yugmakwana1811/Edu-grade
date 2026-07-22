import { describe, expect, it } from "vitest";
import { AI_MODELS, aiProviderLabel, selectAIModel } from "./ai-routing";

describe("subject-aware AI routing", () => {
  it.each([
    ["Mathematics", "Quadratic equations", AI_MODELS.reasoning.id],
    ["Physics", "Electricity", AI_MODELS.reasoning.id],
    ["Computer Science", "Python loops", AI_MODELS.reasoning.id],
    ["Accountancy", "Goodwill valuation", AI_MODELS.balanced.id],
    ["Business Studies", "Marketing mix", AI_MODELS.balanced.id],
    ["English", "Poetry analysis", AI_MODELS.language.id],
    ["History", "Nationalism in India", AI_MODELS.language.id],
    ["Social Science", "Indian democracy", AI_MODELS.language.id],
  ])("routes %s to its approved model", (subject, topic, expected) => {
    expect(selectAIModel({ subject, topic, type: "EXPLANATION" }).id).toBe(
      expected,
    );
  });

  it("uses language generation for announcements regardless of subject", () => {
    expect(
      selectAIModel({
        subject: "Mathematics",
        topic: "Tomorrow's homework",
        type: "ANNOUNCEMENT",
      }).id,
    ).toBe(AI_MODELS.language.id);
  });

  it("shows a transparent provider label", () => {
    expect(aiProviderLabel(`openrouter:${AI_MODELS.reasoning.id}`)).toContain(
      "Nemotron 3 Ultra",
    );
  });
});
