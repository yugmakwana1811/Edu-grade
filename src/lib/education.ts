export const CBSE_GRADES = ["6", "7", "8", "9", "10", "11", "12"] as const;

export type CbseGrade = (typeof CBSE_GRADES)[number];

export type SubjectGroup = {
  label: string;
  subjects: readonly string[];
};

export const CBSE_LANGUAGE_SUBJECTS = [
  "Arabic",
  "Assamese",
  "Bahasa Melayu",
  "Bengali",
  "Bhoti",
  "Bhutia",
  "Bodo",
  "Dogri",
  "English",
  "French",
  "German",
  "Gujarati",
  "Gurung",
  "Hindi",
  "Japanese",
  "Kannada",
  "Kashmiri",
  "Kokborok",
  "Konkani",
  "Lepcha",
  "Limboo",
  "Maithili",
  "Malayalam",
  "Manipuri",
  "Marathi",
  "Mizo",
  "Nepali",
  "Odia",
  "Persian",
  "Punjabi",
  "Rai",
  "Russian",
  "Sanskrit",
  "Santhali",
  "Sherpa",
  "Sindhi",
  "Spanish",
  "Tamang",
  "Tamil",
  "Tangkhul",
  "Telugu AP",
  "Telugu Telangana",
  "Thai",
  "Tibetan",
  "Urdu",
] as const;

const middleCore = [
  "Mathematics",
  "Science",
  "Social Science",
  "Computational Thinking & Artificial Intelligence",
  "Skill Education (Kaushal Bodh)",
  "Art Education",
  "Physical Education & Well-being",
  "Work Education",
  "General",
] as const;

const middleSkillModules = [
  "Marketing (Skill Module)",
  "Tourism (Skill Module)",
  "Photography Module 1",
  "Photography Module 2",
  "Photography Module 3",
] as const;

const class9Main = [
  "Mathematics",
  "Mathematics at Advanced Level",
  "Science",
  "Science at Advanced Level",
  "Social Science",
  "Interdisciplinary Area",
  "Individuals in Society",
  "Vocational Education (Kaushal Vikas)",
  "Computational Thinking & AI",
  "Physical Education & Well-being",
  "Art Education",
] as const;

const class10Main = [
  "Mathematics - Basic",
  "Mathematics - Standard",
  "Science",
  "Social Science",
] as const;

const class10Languages = [
  "Arabic",
  "Assamese",
  "Bengali",
  "Bhoti",
  "Bhutia",
  "Bodo",
  "English Communicative",
  "English Language and Literature",
  "French",
  "German",
  "Gujarati",
  "Gurung",
  "Hindi Course-A",
  "Hindi Course-B",
  "Japanese",
  "Kannada",
  "Kashmiri",
  "Kokborok",
  "Lepcha",
  "Limboo",
  "Malayalam",
  "Manipuri",
  "Marathi",
  "Mizo",
  "Nepali",
  "Odia",
  "Persian",
  "Punjabi",
  "Rai",
  "Russian",
  "Sanskrit",
  "Sanskrit Communicative",
  "Sherpa",
  "Sindhi",
  "Spanish",
  "Tamang",
  "Tamil",
  "Tangkhul",
  "Telugu AP",
  "Telugu Telangana",
  "Thai",
  "Tibetan",
  "Urdu Course-A",
  "Urdu Course-B",
] as const;

const secondaryAcademicElectives = [
  "Carnatic Music (Vocal)",
  "Carnatic Music (Melodic Instruments)",
  "Carnatic Music (Percussion Instruments)",
  "Hindustani Music (Vocal)",
  "Hindustani Music (Melodic Instruments)",
  "Hindustani Music (Percussion Instruments)",
  "Painting",
  "Home Science",
  "National Cadet Corps (NCC)",
  "Computer Applications",
  "Elements of Business",
  "Elements of Book Keeping and Accountancy",
] as const;

const secondaryInternalSubjects = [
  "Health and Physical Education",
  "Work Experience",
  "Art Education",
] as const;

const secondarySkillSubjects = [
  "Employability Skills",
  "Retail",
  "Information Technology",
  "Security",
  "Automotive",
  "Introduction to Financial Markets",
  "Introduction to Tourism",
  "Beauty and Wellness",
  "Agriculture",
  "Food Production",
  "Front Office Operations",
  "Banking and Insurance",
  "Marketing and Sales",
  "Health Care",
  "Apparel",
  "Multi-Media",
  "Multi Skill Foundation Course",
  "Artificial Intelligence",
  "Physical Activity Trainer",
  "Data Science",
  "Electronics & Hardware",
  "Foundation Skills for Sciences (Pharmaceutical & Biotechnology)",
  "Design Thinking",
] as const;

const seniorLanguages = [
  "Arabic",
  "Assamese",
  "Bengali",
  "Bhoti",
  "Bhutia",
  "Bodo",
  "English Core",
  "English Elective",
  "French",
  "German",
  "Gujarati",
  "Hindi Core",
  "Hindi Elective",
  "Japanese",
  "Kannada",
  "Kashmiri",
  "Kokborok",
  "Lepcha",
  "Limboo",
  "Malayalam",
  "Manipuri",
  "Marathi",
  "Mizo",
  "Nepali",
  "Odia",
  "Persian",
  "Punjabi",
  "Russian",
  "Sanskrit Core",
  "Sanskrit Elective",
  "Sindhi",
  "Spanish",
  "Tamil",
  "Tangkhul",
  "Telugu AP",
  "Telugu Telangana",
  "Tibetan",
  "Urdu Core",
  "Urdu Elective",
] as const;

const seniorAcademicElectives = [
  "Accountancy",
  "Applied Mathematics",
  "Biology",
  "Biotechnology",
  "Business Studies",
  "Carnatic Melodic",
  "Carnatic Percussion",
  "Carnatic Vocal",
  "Chemistry",
  "Computer Science",
  "Dance",
  "Economics",
  "Engineering Graphics",
  "Entrepreneurship",
  "Fine Arts",
  "Geography",
  "Hindustani Melodic",
  "Hindustani Percussion",
  "Hindustani Vocal",
  "History",
  "Home Science",
  "Informatics Practices",
  "Knowledge Tradition - Practices India",
  "Legal Studies",
  "Mathematics",
  "National Cadet Corps (NCC)",
  "Physical Education",
  "Physics",
  "Political Science",
  "Psychology",
  "Sociology",
] as const;

const seniorInternalSubjects = [
  "Health and Physical Education",
  "Work Experience",
  "General Studies",
] as const;

const seniorSkillSubjects = [
  "Employability Skills",
  "Retail",
  "Information Technology",
  "Web Applications",
  "Automotive",
  "Financial Markets Management",
  "Tourism",
  "Beauty and Wellness",
  "Agriculture",
  "Food Production",
  "Front Office Operations",
  "Banking",
  "Marketing",
  "Health Care",
  "Insurance",
  "Horticulture",
  "Typography and Computer Application",
  "Geospatial Technology",
  "Electrical Technology",
  "Electronics Technology",
  "Multi-Media",
  "Taxation",
  "Cost Accounting",
  "Office Procedures and Practices",
  "Shorthand English",
  "Shorthand Hindi",
  "Air Conditioning and Refrigeration",
  "Medical Diagnostics",
  "Textile Design",
  "Design",
  "Salesmanship",
  "Business Administration",
  "Food Nutrition and Dietetics",
  "Mass Media Studies",
  "Library and Information Science",
  "Fashion Studies",
  "Yoga",
  "Early Childhood Care and Education",
  "Artificial Intelligence",
  "Data Science",
  "Physical Activity Trainer",
  "Land Transportation",
  "Electronics & Hardware",
  "Design Thinking and Innovation",
] as const;

const middleGroups: readonly SubjectGroup[] = [
  { label: "Core and curricular subjects", subjects: middleCore },
  { label: "Languages", subjects: CBSE_LANGUAGE_SUBJECTS },
  { label: "Optional skill modules", subjects: middleSkillModules },
];

const class9Groups: readonly SubjectGroup[] = [
  { label: "Main subjects", subjects: class9Main },
  { label: "Languages", subjects: CBSE_LANGUAGE_SUBJECTS },
  { label: "Academic electives", subjects: secondaryAcademicElectives },
  { label: "Skill subjects", subjects: secondarySkillSubjects },
];

const class10Groups: readonly SubjectGroup[] = [
  { label: "Main subjects", subjects: class10Main },
  { label: "Languages", subjects: class10Languages },
  { label: "Academic electives", subjects: secondaryAcademicElectives },
  { label: "Skill subjects", subjects: secondarySkillSubjects },
  { label: "Internal assessment", subjects: secondaryInternalSubjects },
];

const seniorGroups: readonly SubjectGroup[] = [
  { label: "Languages", subjects: seniorLanguages },
  { label: "Academic electives", subjects: seniorAcademicElectives },
  { label: "Skill subjects", subjects: seniorSkillSubjects },
  { label: "Internal assessment", subjects: seniorInternalSubjects },
];

export const SUBJECT_GROUPS_BY_GRADE: Record<
  CbseGrade,
  readonly SubjectGroup[]
> = {
  "6": middleGroups,
  "7": middleGroups,
  "8": middleGroups,
  "9": class9Groups,
  "10": class10Groups,
  "11": seniorGroups,
  "12": seniorGroups,
};

export const CBSE_SUBJECTS = Array.from(
  new Set(
    Object.values(SUBJECT_GROUPS_BY_GRADE).flatMap((groups) =>
      groups.flatMap((group) => group.subjects),
    ),
  ),
);

export function isCbseGrade(value: string | null | undefined): value is CbseGrade {
  return CBSE_GRADES.includes(value as CbseGrade);
}

export function normalizeCbseGrade(value: string | null | undefined): CbseGrade {
  return isCbseGrade(value) ? value : "12";
}

export function getSubjectGroupsForGrade(
  grade: string | null | undefined,
): readonly SubjectGroup[] {
  return SUBJECT_GROUPS_BY_GRADE[normalizeCbseGrade(grade)];
}

export function getSubjectsForGrade(
  grade: string | null | undefined,
): string[] {
  return Array.from(
    new Set(
      getSubjectGroupsForGrade(grade).flatMap((group) => group.subjects),
    ),
  );
}

export function isCbseLanguageSubject(subject: string): boolean {
  const normalized = subject.toLowerCase();
  return [
    ...CBSE_LANGUAGE_SUBJECTS,
    ...class10Languages,
    ...seniorLanguages,
  ].some((language) => normalized.startsWith(language.toLowerCase()));
}
