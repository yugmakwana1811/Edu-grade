export type ScoredTopic = {
  topic?: string | null;
  title: string;
  marks: number;
  maxMarks: number;
};

export type TopicPerformance = {
  topic: string;
  average: number;
  evidenceCount: number;
};

export function topicPerformance(items: ScoredTopic[]): TopicPerformance[] {
  const groups = new Map<
    string,
    { label: string; total: number; count: number }
  >();
  for (const item of items) {
    if (
      !Number.isFinite(item.marks) ||
      !Number.isFinite(item.maxMarks) ||
      item.maxMarks <= 0
    )
      continue;
    const label = item.topic?.trim() || item.title.trim();
    if (!label) continue;
    const key = label.toLocaleLowerCase("en-IN");
    const current = groups.get(key) ?? { label, total: 0, count: 0 };
    current.total += Math.max(
      0,
      Math.min(100, (item.marks / item.maxMarks) * 100),
    );
    current.count += 1;
    groups.set(key, current);
  }
  return [...groups.values()]
    .map((group) => ({
      topic: group.label,
      average: Math.round(group.total / group.count),
      evidenceCount: group.count,
    }))
    .sort((a, b) => a.average - b.average || b.evidenceCount - a.evidenceCount);
}

function utcDay(value: Date) {
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
}

export function learningStreak(activityDates: Date[], now = new Date()) {
  const activeDays = new Set(
    activityDates.map((date) => utcDay(date).toISOString().slice(0, 10)),
  );
  let cursor = utcDay(now);
  const yesterday = new Date(cursor);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  if (!activeDays.has(cursor.toISOString().slice(0, 10))) cursor = yesterday;
  let streak = 0;
  while (activeDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor = new Date(cursor);
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
