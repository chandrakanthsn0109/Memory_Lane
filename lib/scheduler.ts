import cron from "node-cron";
import { getConnection } from "../lib/db";
import { classifyUser } from "../lib/classifier";
import { calculateScore } from "../lib/scorer";
import { buildBlueprint } from "../lib/blueprint";
import { generateText } from "../lib/ai";
import { randomUUID } from "crypto";

interface ProcessingResult {
  userId: string;
  memoryId: string;
  score: number;
  eventId: string;
}

/**
 * Process all active users and generate memories
 * This function is extracted so it can be used both by the scheduled job and the API endpoint
 */
export async function processAllMemories(): Promise<ProcessingResult[]> {
  let conn;
  try {
    conn = await getConnection();

    const usersResult = await conn.execute(
      `SELECT DISTINCT subject_emp_id FROM employee_memory_events WHERE employee_status = 'ACTIVE'`
    );

    const processedMemories: ProcessingResult[] = [];

    for (const row of usersResult.rows || []) {
      const userId = row[0];

      const eventsResult = await conn.execute(
        `SELECT * FROM employee_memory_events WHERE subject_emp_id = $1`,
        [userId]
      );

      const events = eventsResult.rows || [];
      if (events.length === 0) continue;

      const userType = classifyUser(events);

      let bestEvent = null;
      let bestScore = -Infinity;
      let bestScoreBreakdown = null;

      for (const event of events) {
        const scoreBreakdown = calculateScore(event, userType, events);
        if (scoreBreakdown.finalScore > bestScore) {
          bestScore = scoreBreakdown.finalScore;
          bestEvent = event;
          bestScoreBreakdown = scoreBreakdown;
        }
      }

      if (!bestEvent) continue;

      try {
        const blueprint = buildBlueprint(bestEvent, userType);
        const text = await generateText(blueprint);

        const memoryId = randomUUID();
        const memoryDate = new Date(bestEvent.event_date).toISOString().split('T')[0];
        
        // Calculate lifecycle dates
        const cooldownUntil = new Date();
        cooldownUntil.setDate(cooldownUntil.getDate() + 30);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 120);
        
        const params: any = {
          memory_id: memoryId,
          user_id: userId,
          memory_date: memoryDate,
          primary_event_id: bestEvent.event_id,
          memory_category: blueprint.category,
          emotion_primary: blueprint.emotion,
          emotion_intensity: blueprint.intensity,
          base_weight: bestScoreBreakdown.baseWeight,
          recency_factor: bestScoreBreakdown.recencyFactor.toFixed(3),
          hierarchy_multiplier: bestScoreBreakdown.hierarchyMultiplier,
          freshness_penalty: bestScoreBreakdown.freshnessPenalty,
          repetition_penalty: bestScoreBreakdown.repetitionPenalty,
          final_score: bestScoreBreakdown.finalScore,
          headline: text.headline,
          story_text: text.story,
          emotional_close: text.close,
          visual_theme: blueprint.visualTheme,
          animation_type: blueprint.animationType,
          cta_type: blueprint.ctaType,
          has_comment: !!bestEvent.comment_text,
          has_points: !!bestEvent.points_value && bestEvent.points_value > 0,
          has_badge: !!bestEvent.badge_code,
          cooldown_until: cooldownUntil.toISOString().split('T')[0],
          expires_at: expiresAt.toISOString(),
          created_by: "SYSTEM",
        };
        
        await conn.execute(
          `INSERT INTO ML_MEMORY_PROCESSED
           (memory_id, user_id, memory_date, primary_event_id,
            memory_category, emotion_primary, emotion_intensity,
            base_weight, recency_factor, hierarchy_multiplier,
            freshness_penalty, repetition_penalty, final_score,
            headline, story_text, emotional_close,
            visual_theme, animation_type, cta_type,
            has_comment, has_points, has_badge,
            cooldown_until, expires_at, created_by, created_at)
           VALUES
           ($1, $2, $3, $4,
            $5, $6, $7,
            $8, $9, $10,
            $11, $12, $13,
            $14, $15, $16,
            $17, $18, $19,
            $20, $21, $22,
            $23, $24, $25, CURRENT_TIMESTAMP)`,
          [
            params.memory_id,
            params.user_id,
            params.memory_date,
            params.primary_event_id,
            params.memory_category,
            params.emotion_primary,
            params.emotion_intensity,
            params.base_weight,
            params.recency_factor,
            params.hierarchy_multiplier,
            params.freshness_penalty,
            params.repetition_penalty,
            params.final_score,
            params.headline,
            params.story_text,
            params.emotional_close,
            params.visual_theme,
            params.animation_type,
            params.cta_type,
            params.has_comment,
            params.has_points,
            params.has_badge,
            params.cooldown_until,
            params.expires_at,
            params.created_by,
          ]
        );

        processedMemories.push({
          userId,
          memoryId,
          score: bestScore,
          eventId: bestEvent.event_id,
        });

        console.log(
          `[MemoryLane Scheduler] Generated memory ${memoryId} for user ${userId}`
        );
      } catch (userError) {
        console.warn(
          `[MemoryLane Scheduler] Skipping memory for user ${userId}:`,
          userError instanceof Error ? userError.message : "Unknown error"
        );
        continue;
      }
    }

    await conn.commit();
    await conn.close();

    console.log(
      `[MemoryLane Scheduler] Successfully processed ${processedMemories.length} memories`
    );
    return processedMemories;
  } catch (error) {
    console.error("[MemoryLane Scheduler] Error processing memories:", error);
    throw error;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        // Ignore close errors
      }
    }
  }
}

/**
 * Initialize scheduled job to process memories daily at midnight
 * Schedule: 0 0 * * * (Every day at 00:00)
 */
export function initializeScheduler() {
  console.log("[MemoryLane Scheduler] Initializing daily memory processing job");

  // Run at midnight every day (00:00:00)
  cron.schedule("0 0 * * *", async () => {
    const now = new Date().toISOString();
    console.log(`[MemoryLane Scheduler] Starting scheduled job at ${now}`);

    try {
      const results = await processAllMemories();
      console.log(
        `[MemoryLane Scheduler] Job completed successfully. Processed ${results.length} memories.`
      );
    } catch (error) {
      console.error("[MemoryLane Scheduler] Job failed:", error);
    }
  });

  console.log(
    "[MemoryLane Scheduler] Daily memory processing job initialized (runs at midnight)"
  );
}

/**
 * Optional: For testing, create a function to manually trigger the job
 */
export async function manuallyProcessMemories() {
  console.log("[MemoryLane Scheduler] Manual trigger - processing memories");
  return await processAllMemories();
}
