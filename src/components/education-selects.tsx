"use client";

import { useId, useState } from "react";
import {
  CBSE_GRADES,
  getSubjectGroupsForGrade,
  getSubjectsForGrade,
  normalizeCbseGrade,
} from "@/lib/education";

type SelectProps = {
  name?: string;
  defaultValue?: string;
  required?: boolean;
};

export function GradeSelect({
  name = "grade",
  defaultValue = "",
  required = true,
}: SelectProps) {
  return (
    <select
      className="field"
      name={name}
      defaultValue={defaultValue}
      required={required}
    >
      <option value="" disabled={required}>
        Select class
      </option>
      {CBSE_GRADES.map((grade) => (
        <option value={grade} key={grade}>
          Class {grade}
        </option>
      ))}
    </select>
  );
}

type GradeSubjectFieldsProps = {
  defaultGrade?: string;
  defaultSubject?: string;
  gradeLabel?: string;
  subjectLabel?: string;
};

const CUSTOM_SUBJECT = "__custom_subject__";

export function GradeSubjectFields({
  defaultGrade = "",
  defaultSubject = "",
  gradeLabel = "Class / grade",
  subjectLabel = "Subject",
}: GradeSubjectFieldsProps) {
  const initialGrade = defaultGrade || "12";
  const normalizedInitialGrade = normalizeCbseGrade(initialGrade);
  const initialSubjects = getSubjectsForGrade(normalizedInitialGrade);
  const initialSelection = defaultSubject
    ? initialSubjects.includes(defaultSubject)
      ? defaultSubject
      : CUSTOM_SUBJECT
    : "";
  const [grade, setGrade] = useState(initialGrade);
  const [selection, setSelection] = useState(initialSelection);
  const [customSubject, setCustomSubject] = useState(
    initialSelection === CUSTOM_SUBJECT ? defaultSubject : "",
  );
  const hintId = useId();
  const subjectGroups = grade ? getSubjectGroupsForGrade(grade) : [];
  const subjectCount = grade ? getSubjectsForGrade(grade).length : 0;
  const submittedSubject =
    selection === CUSTOM_SUBJECT ? customSubject.trim() : selection;

  return (
    <>
      <label>
        <span className="label">{gradeLabel}</span>
        <select
          className="field"
          name="grade"
          value={grade}
          required
          onChange={(event) => {
            const nextGrade = event.target.value;
            setGrade(nextGrade);
            if (
              selection !== CUSTOM_SUBJECT &&
              selection &&
              !getSubjectsForGrade(nextGrade).includes(selection)
            ) {
              setSelection("");
            }
          }}
        >
          <option value="" disabled>
            Select class
          </option>
          {CBSE_GRADES.map((item) => (
            <option value={item} key={item}>
              Class {item}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">{subjectLabel}</span>
        <select
          className="field"
          value={selection}
          required
          aria-describedby={hintId}
          onChange={(event) => setSelection(event.target.value)}
        >
          <option value="" disabled>
            Select subject
          </option>
          {subjectGroups.map((group) => (
            <optgroup label={group.label} key={group.label}>
              {group.subjects.map((subject) => (
                <option value={subject} key={subject}>
                  {subject}
                </option>
              ))}
            </optgroup>
          ))}
          <option value={CUSTOM_SUBJECT}>Other / school-specific subject</option>
        </select>
      </label>
      {selection === CUSTOM_SUBJECT ? (
        <label>
          <span className="label">Enter subject name</span>
          <input
            className="field"
            value={customSubject}
            onChange={(event) => setCustomSubject(event.target.value)}
            required
            minLength={2}
            maxLength={80}
            placeholder="e.g. Environmental Studies"
          />
        </label>
      ) : null}
      <input type="hidden" name="subject" value={submittedSubject} />
      <p className="hint" id={hintId} style={{ margin: 0 }}>
        {grade
          ? `${subjectCount} CBSE options available for Class ${grade}. Use Other for a school-specific subject.`
          : "Choose a class to see its subjects."}
      </p>
    </>
  );
}
