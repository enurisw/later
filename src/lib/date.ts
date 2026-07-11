const DAY_IN_MS = 1000 * 60 * 60 * 24;

export function formatSavedAge(savedAt: string): string {
  const savedTime = new Date(savedAt).getTime();

  if (Number.isNaN(savedTime)) {
    return "Saved recently";
  }

  const days = Math.max(
    0,
    Math.floor((Date.now() - savedTime) / DAY_IN_MS)
  );

  if (days === 0) {
    return "Saved today";
  }

  if (days === 1) {
    return "Saved yesterday";
  }

  if (days < 30) {
    return `Saved ${days} days ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `Saved ${months} ${months === 1 ? "month" : "months"} ago`;
  }

  const years = Math.floor(months / 12);

  return `Saved ${years} ${years === 1 ? "year" : "years"} ago`;
}