import { Category, LaterItem, Priority } from "../types/LaterItem";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const priorityWeights: Record<Priority, number> = {
  Low: 1,
  Normal: 3,
  High: 6,
};

function getAgeInDays(savedAt: string): number {
  const savedTime = new Date(savedAt).getTime();

  if (Number.isNaN(savedTime)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor((Date.now() - savedTime) / DAY_IN_MS)
  );
}

function getRecentSuggestionPenalty(lastSuggested?: string): number {
  if (!lastSuggested) {
    return 0;
  }

  const suggestedTime = new Date(lastSuggested).getTime();

  if (Number.isNaN(suggestedTime)) {
    return 0;
  }

  const daysSinceSuggestion = Math.floor(
    (Date.now() - suggestedTime) / DAY_IN_MS
  );

  if (daysSinceSuggestion <= 0) {
    return 8;
  }

  if (daysSinceSuggestion === 1) {
    return 4;
  }

  if (daysSinceSuggestion <= 3) {
    return 2;
  }

  return 0;
}

export function getSuggestionScore(item: LaterItem): number {
  const ageScore = Math.min(getAgeInDays(item.savedAt) / 7, 12);
  const priorityScore = priorityWeights[item.priority];
  const skipPenalty = Math.min(item.skipCount * 1.5, 8);
  const recentPenalty = getRecentSuggestionPenalty(item.lastSuggested);

  return Math.max(
    1,
    2 + ageScore + priorityScore - skipPenalty - recentPenalty
  );
}

export function getWeightedSuggestion(
  items: LaterItem[],
  category?: Category,
  excludedIds: string[] = []
): LaterItem | null {
  const eligibleItems = items.filter((item) => {
    const isAvailable = item.status === "Later";
    const matchesCategory = category
      ? item.category === category
      : true;
    const isNotExcluded = !excludedIds.includes(item.id);

    return isAvailable && matchesCategory && isNotExcluded;
  });

  if (eligibleItems.length === 0) {
    return null;
  }

  const weightedItems = eligibleItems.map((item) => ({
    item,
    score: getSuggestionScore(item),
  }));

  const totalScore = weightedItems.reduce(
    (total, entry) => total + entry.score,
    0
  );

  let randomValue = Math.random() * totalScore;

  for (const entry of weightedItems) {
    randomValue -= entry.score;

    if (randomValue <= 0) {
      return entry.item;
    }
  }

  return weightedItems[weightedItems.length - 1].item;
}