import "server-only";
import type { AIContentType } from "@prisma/client";

export type GenerateInput = {
  type: AIContentType;
  topic: string;
  grade: string;
  details?: string;
  context?: string;
  audience?: "teacher" | "student";
};
export type GenerateResult = { content: string; provider: string };

const label: Record<AIContentType, string> = {
  LESSON_PLAN: "Lesson plan",
  EXPLANATION: "Topic explanation",
  NOTES: "Study notes",
  QUESTIONS: "Question set",
  QUIZ: "Quiz",
  FEEDBACK: "Feedback suggestion",
  REVISION_SHEET: "Revision sheet",
  ANNOUNCEMENT: "Announcement",
  DOUBT_HELP: "Doubt support",
  REVISION_HELP: "Revision plan",
};

function fallback(i: GenerateInput): string {
  const head = `${label[i.type]}: ${i.topic} · Class ${i.grade}`;
  const studentFacing = i.audience === "student";
  const safety = studentFacing
    ? "\n\nLearning safety: This is AI-assisted guidance and may contain errors. Check it against your class materials, show your own working, and ask your teacher when unsure."
    : "\n\nTeacher review: This is an AI-assisted suggestion. Verify accuracy, adapt it to learner needs, and approve it before classroom or evaluation use.";
  const templates: Partial<Record<AIContentType, string>> = {
    LESSON_PLAN: `${head}\n\nLearning outcomes\n• Explain the core concept using precise subject vocabulary.\n• Apply the concept to one CBSE-style problem.\n• Identify and correct a common misconception.\n\n45-minute flow\n1. Connect (5 min): Use a familiar real-life scenario and a diagnostic question.\n2. Model (10 min): Teacher think-aloud with one worked example.\n3. Guided practice (12 min): Pairs solve a scaffolded question; pause for a hinge check.\n4. Independent practice (12 min): Students attempt one board-style question.\n5. Exit ticket (6 min): One concept question and one application question.\n\nDifferentiation\n• Support: vocabulary bank and partially completed working.\n• Stretch: justify an alternative method and compare outcomes.\n\nEvidence of learning\nCollect the exit ticket and group students for the next revision cycle.`,
    NOTES: `${head}\n\nCore idea\n${i.topic} should be understood as a connected process, not a formula to memorise.\n\nKey points\n• Define each term before applying it.\n• Show the full method and working.\n• Link every entry or step to its effect.\n• Check units, signs, ratios, and final presentation.\n\nCommon mistake\nStudents often jump to the final step without establishing the governing rule. Write the rule first, then substitute values.\n\nQuick recall\nExplain the concept in 30 words, solve one example, and name one error to avoid.`,
    QUESTIONS: `${head}\n\n1. Recall (2 marks): Define ${i.topic} and state one key feature.\n2. Explain (3 marks): Distinguish the concept from a closely related idea.\n3. Apply (5 marks): Solve a structured CBSE-style scenario, showing complete working.\n4. Analyse (5 marks): Identify two errors in a worked response and correct them.\n5. Reflect (2 marks): Write one check you would perform before finalising your answer.\n\nSuggested marking approach\nAward method marks separately from the final answer; accept valid alternative working.`,
    EXPLANATION: `${head}\n\nThink of ${i.topic} as a sequence of decisions: identify the rule, collect the relevant facts, apply the method, and check what the result means. Start with a simple example, then vary one condition at a time.\n\nWhy it matters\nIt connects classroom procedure to the reasoning examiners expect to see.\n\nCheck your understanding\nCan you explain why each step is needed, not only reproduce it?`,
    QUIZ: `${head}\n\n1. Which statement best describes ${i.topic}?\nA. A distractor based on a common error\nB. The precise concept definition ✓\nC. An unrelated rule\nD. A partly true but incomplete statement\n\n2. In a new scenario, what should be established first?\nA. The governing rule ✓\nB. The final answer\nC. The presentation format\nD. An assumption\n\n3. Short response: Apply the concept and justify one step.`,
    REVISION_SHEET: `${head}\n\nMust know\n• Definition and purpose\n• Standard method or format\n• Two common adjustments\n• One frequent exam error\n\n20-minute revision loop\n5 min recall without notes → 8 min worked question → 4 min error check → 3 min teach-back.\n\nSelf-check\n□ I can define it. □ I can apply it. □ I can explain my working. □ I can spot a mistake.`,
    ANNOUNCEMENT: `${head}\n\nHello everyone,\nWe will focus on ${i.topic} in our next learning cycle. Please review the shared notes and bring one question or example you found challenging. Complete the short preparation task before class so we can spend more time on guided practice.`,
    FEEDBACK: `${head}\n\nWhat is working\nThe response shows a sound start and relevant method.\n\nNext improvement\nMake each reasoning step visible, check the governing rule, and label the final answer clearly.\n\nAction for the learner\nCorrect one similar question using a different colour, then explain the corrected step in one sentence.`,
    DOUBT_HELP: `${head}\n\nLet’s unpack this without giving away assessed work. First, write what you already know and identify the exact step where the reasoning becomes unclear. Use this hint: connect the question facts to the governing rule before choosing a formula or entry.\n\nTry it\nExplain your next step in one sentence. If it still feels uncertain, ask your teacher with the working you have attempted.`,
    REVISION_HELP: `${head}\n\nToday: 10-minute recall, one guided example, one independent question.\nTomorrow: correct errors and retry without notes.\nAfter 3 days: mixed practice with a related topic.\nAfter 7 days: timed retrieval check.\n\nFocus signal\nPrioritise errors in method before speed or presentation.`,
  };
  return (
    (templates[i.type] ??
      `${head}\n\nCreate a clear, age-appropriate learning resource with worked examples and checks for understanding.`) +
    (i.details
      ? `\n\n${studentFacing ? "Learner context" : "Teacher context"}\n${i.details}`
      : "") +
    safety
  );
}

export async function generateAI(
  input: GenerateInput,
): Promise<GenerateResult> {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey)
    return { content: fallback(input), provider: "deterministic-fallback" };
  try {
    const systemPrompt =
      input.audience === "student"
        ? "You are an Indian CBSE learning assistant. Provide hints, explanations, and revision support without completing assessed work. State uncertainty, encourage original working, and recommend teacher verification when needed."
        : "You are an Indian CBSE teaching assistant. Produce accurate, editable suggestions. Never make final grading decisions. End with a teacher-verification reminder.";
    const response = await fetch(
      "https://ai-gateway.vercel.sh/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL ?? "openai/gpt-5-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify(input) },
          ],
        }),
        signal: AbortSignal.timeout(45000),
      },
    );
    if (!response.ok) throw new Error("AI gateway unavailable");
    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || fallback(input),
      provider: process.env.AI_MODEL ?? "ai-gateway",
    };
  } catch {
    return { content: fallback(input), provider: "deterministic-fallback" };
  }
}
