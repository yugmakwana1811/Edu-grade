export const CBSE_GRADES = ["6", "7", "8", "9", "10", "11", "12"] as const;

export type CbseGrade = (typeof CBSE_GRADES)[number];

export const CBSE_SUBJECTS = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Sanskrit",
  "Social Science",
  "History",
  "Geography",
  "Political Science",
  "Economics",
  "Accountancy",
  "Business Studies",
  "Computer Science",
  "Informatics Practices",
  "Physical Education",
  "Fine Arts",
  "General",
] as const;

export function isCbseGrade(value: string | null | undefined): value is CbseGrade {
  return CBSE_GRADES.includes(value as CbseGrade);
}

export function normalizeCbseGrade(value: string | null | undefined): CbseGrade {
  return isCbseGrade(value) ? value : "12";
}
