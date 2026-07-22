import { describe, expect, it } from "vitest";
import {
  CBSE_GRADES,
  getSubjectGroupsForGrade,
  getSubjectsForGrade,
  isCbseLanguageSubject,
} from "./education";

describe("grade-aware CBSE subject catalog", () => {
  it.each(["6", "7", "8"])(
    "provides the complete middle-school subject families for Class %s",
    (grade) => {
      const subjects = getSubjectsForGrade(grade);
      expect(subjects).toEqual(
        expect.arrayContaining([
          "Mathematics",
          "Science",
          "Social Science",
          "English",
          "Hindi",
          "Sanskrit",
          "Computational Thinking & Artificial Intelligence",
          "Skill Education (Kaushal Bodh)",
          "Art Education",
          "Physical Education & Well-being",
          "Marketing (Skill Module)",
        ]),
      );
      expect(subjects.length).toBeGreaterThan(50);
    },
  );

  it("includes Class 10 course variants, electives and skill subjects", () => {
    expect(getSubjectsForGrade("10")).toEqual(
      expect.arrayContaining([
        "English Language and Literature",
        "Hindi Course-A",
        "Urdu Course-B",
        "Mathematics - Basic",
        "Computer Applications",
        "Artificial Intelligence",
        "Health and Physical Education",
      ]),
    );
  });

  it.each(["11", "12"])(
    "includes languages, academic electives and skill subjects for Class %s",
    (grade) => {
      expect(getSubjectsForGrade(grade)).toEqual(
        expect.arrayContaining([
          "English Core",
          "Accountancy",
          "Physics",
          "Psychology",
          "Artificial Intelligence",
          "Data Science",
          "Fashion Studies",
        ]),
      );
    },
  );

  it("contains unique choices and labelled groups for every supported grade", () => {
    for (const grade of CBSE_GRADES) {
      const subjects = getSubjectsForGrade(grade);
      expect(new Set(subjects).size).toBe(subjects.length);
      expect(getSubjectGroupsForGrade(grade).length).toBeGreaterThan(0);
    }
  });

  it("recognises regional and course-specific languages", () => {
    expect(isCbseLanguageSubject("Assamese")).toBe(true);
    expect(isCbseLanguageSubject("English Language and Literature")).toBe(true);
    expect(isCbseLanguageSubject("Urdu Course-B")).toBe(true);
    expect(isCbseLanguageSubject("Mathematics")).toBe(false);
  });
});
