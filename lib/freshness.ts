export function getFreshnessPenalty(
  event: any,
  recentMemories: any[]
): number {
  for (const memory of recentMemories) {
    // Same category recently
    if (memory.memory_category === event.event_type) {
      return 500;
    }

    // Badge cooldown (3 days)
    if (
      event.event_type === "BADGE" &&
      daysBetween(memory.memory_date, new Date()) <= 3
    ) {
      return 500;
    }
  }
  return 0;
}

export function getRepetitionPenalty(
  event: any,
  recentMemories: any[]
): number {
  for (const memory of recentMemories) {
    if (memory.actor_emp_id === event.actor_emp_id) {
      return 200; // same sender again
    }
  }
  return 0;
}

function daysBetween(d1: Date, d2: Date) {
  return Math.abs(
    (d2.getTime() - d1.getTime()) / 86400000
  );
}
