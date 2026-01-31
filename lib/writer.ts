import { getConnection } from "./db";

export interface MemoryRecord {
  id: string;
  user: string;
  date: string;
  event: string;
  category: string;
  emotion: string;
  intensity: number;
  baseWeight: number;
  recencyFactor: number;
  hierarchyMultiplier: number;
  freshnessPenalty: number;
  repetitionPenalty: number;
  score: number;
  headline: string;
  story: string;
  close: string;
  theme: string;
  animation: string;
  cta: string;
  hasComment: boolean;
  hasPoints: boolean;
  hasBadge: boolean;
  cooldownUntil?: string;
  createdBy: string;
}

export async function saveMemory(memory: MemoryRecord) {
  const conn = await getConnection();

  // Calculate cooldown date (30 days from now)
  const cooldownDate = new Date();
  cooldownDate.setDate(cooldownDate.getDate() + 30);
  
  // Calculate expiration (120 days from now)
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 120);

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
     (:id, :user, :date, :event,
      :category, :emotion, :intensity,
      :baseWeight, :recencyFactor, :hierarchyMultiplier,
      :freshnessPenalty, :repetitionPenalty, :score,
      :headline, :story, :close,
      :theme, :animation, :cta,
      :hasComment, :hasPoints, :hasBadge,
      :cooldownUntil, :expirationDate, :createdBy, CURRENT_TIMESTAMP)`,
    {
      ...memory,
      cooldownUntil: cooldownDate.toISOString().split('T')[0],
      expirationDate: expirationDate.toISOString(),
    }
  );

  await conn.commit();
  await conn.close();
}
