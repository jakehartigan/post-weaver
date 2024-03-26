export type PostNodeStatus =
  | "draft"
  | "published"
  | "scheduled"
  | "toDelete"
  | "deleted"
  | "archived"
  | "readyToSchedule"
  | "posted";

export const POST_NODE_STATUS_OPTIONS: PostNodeStatus[] = [
  "draft",
  "published",
  "scheduled",
  "toDelete",
  "deleted",
  "archived",
  "readyToSchedule",
  "posted",
];
