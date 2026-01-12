export type ErrandStatus =
  | "open"
  | "accepted"
  | "in_progress"
  | "completed";

export const ERRAND_TRANSITIONS: Record<
  ErrandStatus,
  ErrandStatus[]
> = {
  open: ["accepted"],
  accepted: ["in_progress"],
  in_progress: ["completed"],
  completed: [],
};
