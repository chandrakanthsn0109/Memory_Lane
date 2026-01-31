import React from "react";
import styles from "./MemoryCard.module.css";
import { Memory } from "../services/api";

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onClick,
}) => {

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getYear = (date: string) => {
    return new Date(date).getFullYear();
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

  const emotionGradients: Record<string, string> = {
    PRIDE: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    JOY: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    BELONGING: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    GRATITUDE: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    ACHIEVEMENT: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    GROWTH: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    INSPIRATION: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  };

  const emoji = emotionEmojis[memory.emotion_primary] || "💫";
  const gradient = emotionGradients[memory.emotion_primary] || "linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)";

  return (
    <div
      className={styles.card}
      onClick={onClick}
      style={{ background: gradient }}
    >
      <div className={styles.emojiHeader}>{emoji}</div>
      <div className={styles.yearBadge}>{getYear(memory.created_at)}</div>
    </div>
  );
};
