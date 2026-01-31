import { getFreshnessPenalty, getRepetitionPenalty } from "./freshness";

export interface ScoringBreakdown {
  baseWeight: number;
  recencyFactor: number;
  hierarchyMultiplier: number;
  freshnessPenalty: number;
  repetitionPenalty: number;
  finalScore: number;
}

function getBaseWeight(eventType: string): number {
  const weights: Record<string, number> = {
    PROMOTION: 95,
    ACHIEVEMENT: 85,
    MILESTONE: 80,
    RECOGNITION: 75,
    COLLABORATION: 65,
    LEARNING: 70,
    SOCIAL: 50,
    OTHER: 60,
  };
  return weights[eventType] || weights.OTHER;
}

function getRecencyFactor(eventDate: string | Date): number {
  const eventTime = new Date(eventDate).getTime();
  const now = new Date().getTime();
  const daysPassed = (now - eventTime) / (1000 * 60 * 60 * 24);

  if (daysPassed <= 30) return 1.5;
  if (daysPassed <= 90) return 1.2;
  if (daysPassed <= 180) return 1.0;
  return 0.7;
}

function getHierarchyMultiplier(
  actorHierarchyLevel?: number,
  isTopHierarchy?: boolean
): number {
  if (isTopHierarchy) return 2;
  if (!actorHierarchyLevel) return 1;
  if (actorHierarchyLevel >= 4) return 2;
  if (actorHierarchyLevel >= 3) return 1;
  return 1;
}

export function calculateScore(
  event: any,
  userType: string,
  recentMemories: any[] = []
): ScoringBreakdown {
  // Calculate components
  const baseWeight = getBaseWeight(event.event_type || event.event_category);
  const recencyFactor = getRecencyFactor(event.event_date);
  const hierarchyMultiplier = getHierarchyMultiplier(
    event.actor_hierarchy_level,
    event.is_top_hierarchy === 'Y'
  );
  
  const freshnessPenalty = getFreshnessPenalty(event, recentMemories);
  const repetitionPenalty = getRepetitionPenalty(event, recentMemories);

  // Calculate final score
  const scoreBeforePenalties =
    baseWeight * recencyFactor * hierarchyMultiplier;
  
  const finalScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(scoreBeforePenalties - freshnessPenalty - repetitionPenalty)
    )
  );

  return {
    baseWeight,
    recencyFactor,
    hierarchyMultiplier,
    freshnessPenalty,
    repetitionPenalty,
    finalScore,
  };
}
