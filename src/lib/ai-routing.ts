export const AI_MODELS = {
  reasoning: {
    id: "nvidia/nemotron-3-ultra-550b-a55b:free",
    label: "Nemotron 3 Ultra",
    maxTokens: 4_096,
    reasoning: { max_tokens: 1_024, exclude: true },
    temperature: 0.25,
  },
  balanced: {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    label: "Nemotron 3 Super",
    maxTokens: 3_200,
    reasoning: { max_tokens: 768, exclude: true },
    temperature: 0.3,
  },
  language: {
    id: "google/gemma-4-31b-it:free",
    label: "Gemma 4 31B",
    maxTokens: 3_200,
    reasoning: null,
    temperature: 0.45,
  },
} as const;

export type AIModelConfig = (typeof AI_MODELS)[keyof typeof AI_MODELS];

type RoutingInput = {
  subject: string;
  topic: string;
  type: string;
};

const stemPattern =
  /\b(math(?:ematic)?s?|algebra|geometry|trigonometry|calculus|statistics|physics|chemistry|biology|science|computer|coding|programming|informatics)\b/i;
const commercePattern =
  /\b(account(?:ancy|ing)?|business|commerce|economics?|entrepreneurship|finance|marketing)\b/i;
const languageHumanitiesPattern =
  /\b(english|hindi|sanskrit|language|literature|grammar|writing|history|geography|political|civics|social science|humanities|fine arts?|physical education)\b/i;

export function selectAIModel(input: RoutingInput): AIModelConfig {
  const routingText = `${input.subject} ${input.topic}`;
  if (input.type === "ANNOUNCEMENT") return AI_MODELS.language;
  if (commercePattern.test(routingText)) return AI_MODELS.balanced;
  if (languageHumanitiesPattern.test(routingText)) return AI_MODELS.language;
  if (stemPattern.test(routingText)) return AI_MODELS.reasoning;
  return AI_MODELS.balanced;
}

export function getAIModelCandidates(input: RoutingInput): AIModelConfig[] {
  const primary = selectAIModel(input);
  const secondary =
    primary.id === AI_MODELS.balanced.id
      ? AI_MODELS.reasoning
      : AI_MODELS.balanced;
  return [primary, secondary];
}

export function aiProviderLabel(provider: string): string {
  if (provider === "deterministic-fallback") return "Safe fallback mode";
  const modelId = provider.startsWith("openrouter:")
    ? provider.slice("openrouter:".length)
    : provider;
  const match = Object.values(AI_MODELS).find((model) => model.id === modelId);
  return match
    ? `OpenRouter · ${match.label}`
    : "OpenRouter · Subject-matched model";
}
