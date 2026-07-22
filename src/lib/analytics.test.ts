import { describe, expect, it } from "vitest";
import { learningStreak, topicPerformance } from "./analytics";

describe("topicPerformance", () => {
  it("groups real results by topic and sorts weakest first", () => {
    expect(
      topicPerformance([
        { topic: "Ratios", title: "Test A", marks: 4, maxMarks: 10 },
        { topic: "ratios", title: "Test B", marks: 6, maxMarks: 10 },
        { topic: "Goodwill", title: "Test C", marks: 9, maxMarks: 10 },
      ]),
    ).toEqual([
      { topic: "Ratios", average: 50, evidenceCount: 2 },
      { topic: "Goodwill", average: 90, evidenceCount: 1 },
    ]);
  });

  it("ignores invalid assessment totals", () => {
    expect(
      topicPerformance([
        { topic: "Invalid", title: "Test", marks: 2, maxMarks: 0 },
      ]),
    ).toEqual([]);
  });
});

describe("learningStreak", () => {
  it("counts consecutive active days including today", () => {
    const now = new Date("2026-07-22T12:00:00.000Z");
    expect(
      learningStreak(
        [
          new Date("2026-07-22T08:00:00.000Z"),
          new Date("2026-07-21T08:00:00.000Z"),
          new Date("2026-07-20T08:00:00.000Z"),
          new Date("2026-07-18T08:00:00.000Z"),
        ],
        now,
      ),
    ).toBe(3);
  });

  it("allows a streak to continue when today has no activity yet", () => {
    const now = new Date("2026-07-22T01:00:00.000Z");
    expect(learningStreak([new Date("2026-07-21T08:00:00.000Z")], now)).toBe(1);
  });
});
