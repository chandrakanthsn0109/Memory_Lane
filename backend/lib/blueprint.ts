export interface MemoryBlueprint {
  category: string;
  emotion: string;
  intensity: number;
  visualTheme: string;
  animationType: string;
  ctaType: string;
}

function getEmotionByEventType(
  eventType: string,
  userType: string
): { emotion: string; intensity: number } {
  const emotionMap: Record<string, { emotion: string; intensity: number }> = {
    PROMOTION: { emotion: "JOY", intensity: 100 },
    ACHIEVEMENT: { emotion: "PRIDE", intensity: 95 },
    MILESTONE: { emotion: "ACHIEVEMENT", intensity: 90 },
    RECOGNITION: { emotion: "BELONGING", intensity: 85 },
    COLLABORATION: { emotion: "BELONGING", intensity: 80 },
    LEARNING: { emotion: "GROWTH", intensity: 75 },
    SOCIAL: { emotion: "BELONGING", intensity: 70 },
    SERVICE_ANNIVERSARY: { emotion: "GRATITUDE", intensity: 85 },
  };

  if (userType === "GHOST") {
    return { emotion: "INSPIRATION", intensity: 80 };
  }

  return emotionMap[eventType] || { emotion: "PRIDE", intensity: 70 };
}

function getVisualTheme(
  eventType: string,
  emotion: string
): string {
  const themeMap: Record<string, Record<string, string>> = {
    PROMOTION: { JOY: "GRADIENT_PINK", default: "GRADIENT_PINK" },
    ACHIEVEMENT: { PRIDE: "GRADIENT_PURPLE", default: "GRADIENT_PURPLE" },
    RECOGNITION: { BELONGING: "GRADIENT_CYAN", default: "GRADIENT_CYAN" },
    LEARNING: { GROWTH: "GRADIENT_GREEN", default: "GRADIENT_GREEN" },
    SOCIAL: { BELONGING: "GRADIENT_CYAN", default: "GRADIENT_CYAN" },
  };

  return (
    themeMap[eventType]?.[emotion] ||
    themeMap[eventType]?.["default"] ||
    "GRADIENT_PURPLE"
  );
}

function getAnimationType(eventType: string): string {
  const animationMap: Record<string, string> = {
    PROMOTION: "SLIDE_UP",
    ACHIEVEMENT: "FADE_IN_CASCADE",
    RECOGNITION: "FADE_IN",
    LEARNING: "ZOOM_IN",
    COLLABORATION: "FADE_IN",
    SOCIAL: "BOUNCE_IN",
    MILESTONE: "SCALE_UP",
  };

  return animationMap[eventType] || "FADE_IN";
}

function getCtaType(eventType: string): string {
  const ctaMap: Record<string, string> = {
    PROMOTION: "CELEBRATE",
    ACHIEVEMENT: "SHARE",
    RECOGNITION: "ACKNOWLEDGE",
    LEARNING: "INSPIRE",
    SOCIAL: "CONNECT",
    MILESTONE: "REFLECT",
  };

  return ctaMap[eventType] || "SHARE";
}

export function buildBlueprint(event: any, userType: string): MemoryBlueprint {
  const eventType = event.event_type || "OTHER";
  const { emotion, intensity } = getEmotionByEventType(eventType, userType);
  const visualTheme = getVisualTheme(eventType, emotion);
  const animationType = getAnimationType(eventType);
  const ctaType = getCtaType(eventType);

  return {
    category: event.event_subtype || eventType,
    emotion,
    intensity,
    visualTheme,
    animationType,
    ctaType,
  };
}
