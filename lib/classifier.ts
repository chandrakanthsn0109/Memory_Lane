export function classifyUser(events: any[]) {
  const received = events.filter(e => e.event_type === "RECOGNITION_RECEIVED").length;
  const sent = events.filter(e => e.event_type === "RECOGNITION_SENT").length;

  if (received < 3 || sent === 0) return "GHOST";
  return "ACTIVE";
}
