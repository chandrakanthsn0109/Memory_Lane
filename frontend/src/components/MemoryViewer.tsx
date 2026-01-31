import React from "react";
import styles from "./MemoryViewer.module.css";
import { Memory } from "../services/api";

interface MemoryViewerProps {
  memory: Memory;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const MemoryViewer: React.FC<MemoryViewerProps> = ({
  memory,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}) => {
  const emotionEmojis: Record<string, string> = {
    PRIDE: "🏆",
    JOY: "😊",
    BELONGING: "❤️",
    GRATITUDE: "🙏",
    ACHIEVEMENT: "🎯",
    GROWTH: "🌱",
    INSPIRATION: "✨",
    DEFAULT: "💫",
  };

  const emotionColors: Record<string, { gradient: string; text: string }> = {
    PRIDE: { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "#667eea" },
    JOY: { gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", text: "#f5576c" },
    BELONGING: { gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", text: "#4facfe" },
    GRATITUDE: { gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", text: "#43e97b" },
    ACHIEVEMENT: { gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", text: "#fa709a" },
    GROWTH: { gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", text: "#30cfd0" },
    INSPIRATION: { gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", text: "#a8edea" },
  };

  const colors =
    emotionColors[memory.emotion_primary] || emotionColors.DEFAULT;
  const emoji = emotionEmojis[memory.emotion_primary] || emotionEmojis.DEFAULT;

  if (!isOpen) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* Main Content with Gradient Background */}
        <div
          className={styles.mainContent}
          style={{ background: colors.gradient }}
        >
          {/* Top Section */}
          <div className={styles.topSection}>
            <div className={styles.emotionBadge}>
              <span className={styles.emoji}>{emoji}</span>
              <span className={styles.emotionLabel}>
                {memory.emotion_primary}
              </span>
            </div>
            <div className={styles.scoreBadge}>
              ⭐ {memory.final_score.toFixed(1)}
            </div>
          </div>

          {/* Middle Section - Headline and Category */}
          <div className={styles.headlineSection}>
            <h1 className={styles.headline}>{memory.headline}</h1>
            <p className={styles.category}>{memory.memory_category}</p>
          </div>

          {/* Story Section */}
          <div className={styles.storySection}>
            <p className={styles.story}>{memory.story_text}</p>
          </div>

          {/* Emotional Close */}
          <div className={styles.closeSection}>
            <p className={styles.emotionalClose}>
              {memory.emotional_close}
            </p>
          </div>

          {/* Footer Date */}
          <div className={styles.dateFooter}>
            <span>{formatDate(memory.created_at)}</span>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className={styles.navFooter}>
          {onPrevious && (
            <button className={styles.navBtn} onClick={onPrevious}>
              ← Previous
            </button>
          )}
          {onNext && (
            <button className={styles.navBtn} onClick={onNext}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
