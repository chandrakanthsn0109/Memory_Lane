import { getConnection } from "@/lib/db";
import { classifyUser } from "@/lib/classifier";
import { calculateScore } from "@/lib/scorer";
import { buildBlueprint } from "@/lib/blueprint";
import { generateText } from "@/lib/ai";
import { saveMemory } from "@/lib/writer";
import { randomUUID } from "crypto";

export async function runMemoryLaneJob() {
  const conn = await getConnection();

  const users = await conn.execute(
    `SELECT DISTINCT subject_emp_id FROM ML_EVENT_UNIFIED WHERE employee_status = 'ACTIVE'`
  );

  for (const row of users.rows || []) {
    const userId = row[0];

    const eventsResult = await conn.execute(
      `SELECT * FROM ML_EVENT_UNIFIED WHERE subject_emp_id = :id`,
      [userId]
    );

    const events = eventsResult.rows || [];
    const userType = classifyUser(events);

    let bestEvent = null;
    let bestScore = -Infinity;

    for (const event of events) {
      const score = calculateScore(event, userType, events);
      if (score > bestScore) {
        bestScore = score;
        bestEvent = event;
      }
    }

    if (!bestEvent) continue;

    const blueprint = buildBlueprint(bestEvent, userType);
    const text = await generateText(blueprint);

    await saveMemory({
      id: randomUUID(),
      user: userId,
      event: bestEvent.event_id,
      category: blueprint.category,
      emotion: blueprint.emotion,
      intensity: blueprint.intensity,
      score: bestScore,
      headline: text.headline,
      story: text.story,
      close: text.close
    });
  }

  await conn.close();
}
