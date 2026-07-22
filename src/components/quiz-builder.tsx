"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createQuizAction } from "@/app/quiz-actions";
import { SubmitButton } from "@/components/submit-button";

type DraftQuestion = {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  marks: number;
};

function newQuestion(index: number): DraftQuestion {
  return {
    id: `${Date.now()}-${index}`,
    prompt: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
    marks: 1,
  };
}

export function QuizBuilder({
  classes,
  initialClassId,
}: {
  classes: Array<{ id: string; name: string; grade: string }>;
  initialClassId?: string;
}) {
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    newQuestion(0),
    newQuestion(1),
  ]);
  const serialized = useMemo(
    () =>
      JSON.stringify(
        questions.map(
          ({ prompt, options, correctIndex, explanation, marks }) => ({
            prompt,
            options,
            correctAnswer: options[correctIndex],
            explanation,
            marks,
          }),
        ),
      ),
    [questions],
  );
  const update = (index: number, changes: Partial<DraftQuestion>) =>
    setQuestions((current) =>
      current.map((question, position) =>
        position === index ? { ...question, ...changes } : question,
      ),
    );
  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    option: string,
  ) =>
    setQuestions((current) =>
      current.map((question, position) => {
        if (position !== questionIndex) return question;
        const options = [...question.options] as DraftQuestion["options"];
        options[optionIndex] = option;
        return { ...question, options };
      }),
    );

  return (
    <form action={createQuizAction} style={{ display: "grid", gap: "1rem" }}>
      <input type="hidden" name="questions" value={serialized} />
      <section className="card card-pad">
        <div className="eyebrow">Quiz setup</div>
        <div className="form-grid" style={{ marginTop: ".8rem" }}>
          <label>
            <span className="label">Class</span>
            <select
              className="field"
              name="classId"
              defaultValue={initialClassId ?? classes[0]?.id}
              required
            >
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · Class {item.grade}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">
              Suggested duration{" "}
              <span className="hint">(minutes, optional)</span>
            </span>
            <input
              className="field"
              name="timeLimit"
              type="number"
              min={1}
              max={180}
            />
          </label>
        </div>
        <label style={{ display: "block", marginTop: ".8rem" }}>
          <span className="label">Quiz title</span>
          <input
            className="field"
            name="title"
            minLength={4}
            maxLength={120}
            required
            placeholder="Partnership concept check"
          />
        </label>
        <label style={{ display: "block", marginTop: ".8rem" }}>
          <span className="label">
            Instructions <span className="hint">(optional)</span>
          </span>
          <textarea
            className="field"
            name="description"
            maxLength={1000}
            placeholder="What should learners know before starting?"
          />
        </label>
      </section>
      {questions.map((question, questionIndex) => (
        <section className="card card-pad" key={question.id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: ".7rem",
            }}
          >
            <div>
              <div className="eyebrow">Question {questionIndex + 1}</div>
              <h2
                className="display"
                style={{ fontSize: "1.45rem", margin: ".2rem 0" }}
              >
                Build a valid multiple-choice item
              </h2>
            </div>
            {questions.length > 1 && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() =>
                  setQuestions((current) =>
                    current.filter((_, index) => index !== questionIndex),
                  )
                }
                aria-label={`Remove question ${questionIndex + 1}`}
              >
                <Trash2 size={15} /> Remove
              </button>
            )}
          </div>
          <label style={{ display: "block", marginTop: ".8rem" }}>
            <span className="label">Prompt</span>
            <textarea
              className="field"
              value={question.prompt}
              onChange={(event) =>
                update(questionIndex, { prompt: event.target.value })
              }
              minLength={5}
              maxLength={500}
              required
            />
          </label>
          <div className="form-grid" style={{ marginTop: ".8rem" }}>
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex}>
                <span className="label">
                  Option {String.fromCharCode(65 + optionIndex)}
                </span>
                <input
                  className="field"
                  value={option}
                  onChange={(event) =>
                    updateOption(questionIndex, optionIndex, event.target.value)
                  }
                  maxLength={200}
                  required
                />
              </label>
            ))}
          </div>
          <div className="form-grid" style={{ marginTop: ".8rem" }}>
            <label>
              <span className="label">Correct option</span>
              <select
                className="field"
                value={question.correctIndex}
                onChange={(event) =>
                  update(questionIndex, {
                    correctIndex: Number(event.target.value),
                  })
                }
              >
                {question.options.map((_, optionIndex) => (
                  <option key={optionIndex} value={optionIndex}>
                    Option {String.fromCharCode(65 + optionIndex)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="label">Marks</span>
              <input
                className="field"
                type="number"
                min={1}
                max={20}
                value={question.marks}
                onChange={(event) =>
                  update(questionIndex, { marks: Number(event.target.value) })
                }
                required
              />
            </label>
          </div>
          <label style={{ display: "block", marginTop: ".8rem" }}>
            <span className="label">Explanation shown after submission</span>
            <textarea
              className="field"
              value={question.explanation}
              onChange={(event) =>
                update(questionIndex, { explanation: event.target.value })
              }
              minLength={5}
              maxLength={1000}
              required
            />
          </label>
        </section>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: ".8rem",
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn btn-secondary"
          type="button"
          disabled={questions.length >= 20}
          onClick={() =>
            setQuestions((current) => [...current, newQuestion(current.length)])
          }
        >
          <Plus size={16} /> Add question
        </button>
        <div
          style={{
            display: "flex",
            gap: ".8rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{
              display: "flex",
              gap: ".5rem",
              alignItems: "center",
              fontWeight: 750,
            }}
          >
            <input name="publish" type="checkbox" /> Publish immediately
          </label>
          <SubmitButton
            pendingText="Saving quiz…"
            confirmMessage="Save this quiz? If Publish immediately is selected, enrolled learners will be able to attempt it."
          >
            Save quiz
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
