export type Category =
  | "Watch"
  | "Read"
  | "Eat"
  | "Go"
  | "Try"
  | "Learn"
  | "Buy";

export type ItemStatus =
  | "Later"
  | "Doing"
  | "Done"
  | "Dropped";

export type Priority =
  | "Low"
  | "Normal"
  | "High";

export interface LaterItem {
  id: string;

  name: string;

  category: Category;

  note?: string;

  image?: string;

  priority: Priority;

  status: ItemStatus;

  savedAt: string;

  completedAt?: string;

  skipCount: number;

  lastSuggested?: string;
}