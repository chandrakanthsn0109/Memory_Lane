import React, { useState } from "react";
import styles from "./MemoryCard.module.css";
import { Memory } from "../services/api";
import { MemoryViewer } from "./MemoryViewer";

interface MemoryCardProps {
  memory: Memory;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onNext,
  onPrevious,
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const emotionEmojis: Record<string, string> = {
    PRIDE: "🏆",
    JOY: "😊",
    BELONGING: "❤️",
    GRATITUDE: "🙏",
    ACHIEVEMENT: "🎯",
    GROWTH: "🌱",
    INSPIRATION: "✨",
  };

  const emotionColors: Record<string, string> = {
    PRIDE: "#667eea",
    BELONGING: "#4facfe",
    JOY: "#f5576c",
    GRATITUDE: "#43e97b",
    ACHIEVEMENT: "#fa709a",
    GROWTH: "#30cfd0",
    INSPIRATION: "#a8edea",
  };

  const emoji = emotionEmojis[memory.emotion_primary] || "💫";
  const color = emotionColors[memory.emotion_primary] || "#E0E0E0";

  return (
    <>
      <div
        className={styles.card}
        onClick={() => setIsViewerOpen(true)}
        style={{ borderLeftColor: color }}
      >
        <div className={styles.emotionIndicator} style={{ backgroundColor: color }}>
          <span className={styles.emotionEmoji}>{emoji}</span>
        </div>

        <div className={styles.content}>
          <h3 className={styles.headline}>{memory.headline}</h3>
          <p className={styles.preview}>{memory.story_text.substring(0, 100)}...</p>

          <div className={styles.footer}>
            <div className={styles.meta}>
              <span className={styles.category}>{memory.memory_category}</span>
              <span className={styles.score}>⭐ {memory.final_score}</span>
            </div>
            <div className={styles.tagline}>
              {memory.cta_type && (
                <span className={styles.cta}>{memory.cta_type}</span>
              )}
              <span className={styles.date}>{formatDate(memory.created_at)}</span>
            </div>
          </div>
        </div>

        <div className={styles.viewButton}>
          <span>View Memory →</span>
        </div>
      </div>

      <MemoryViewer
        memory={memory}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </>
  );
};
