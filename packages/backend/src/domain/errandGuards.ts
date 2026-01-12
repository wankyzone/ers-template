import { ErrandStatus, ERRAND_TRANSITIONS } from "./errandStatus";

export function assertValidTransition(
  from: ErrandStatus,
  to: ErrandStatus
) {
  const allowed = ERRAND_TRANSITIONS[from] ?? [];

  if (!allowed.includes(to)) {
    throw new Error(
      `Invalid errand transition: ${from} → ${to}`
    );
  }
}
