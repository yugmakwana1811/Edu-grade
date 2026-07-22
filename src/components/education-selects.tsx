import { CBSE_GRADES, CBSE_SUBJECTS } from "@/lib/education";

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

export function SubjectInput({
  name = "subject",
  defaultValue = "",
  required = true,
}: SelectProps) {
  const listId = `${name}-cbse-subjects`;
  return (
    <>
      <input
      className="field"
      name={name}
      defaultValue={defaultValue}
      required={required}
        list={listId}
        minLength={2}
        maxLength={80}
        placeholder="Select or enter a subject"
      />
      <datalist id={listId}>
        {CBSE_SUBJECTS.map((subject) => (
          <option value={subject} key={subject} />
        ))}
      </datalist>
    </>
  );
}
