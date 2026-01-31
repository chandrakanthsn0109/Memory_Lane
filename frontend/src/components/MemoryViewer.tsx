import React, { useState, useEffect } from "react";
import styles from "./MemoryViewer.module.css";
import { Memory } from "../services/api";

interface MemoryViewerProps {
  memory: Memory;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isLastMemory?: boolean;
}

type SlideType = "story" | "cta";

export const MemoryViewer: React.FC<MemoryViewerProps> = ({
  memory,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  isLastMemory = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState<SlideType>("story");

  // Reset to story slide when memory changes
  useEffect(() => {
    setCurrentSlide("story");
  }, [memory.memory_id]);

  if (!isOpen) return null;

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

  const emotionGradients: Record<string, string> = {
    PRIDE: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    JOY: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    BELONGING: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    GRATITUDE: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    ACHIEVEMENT: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    GROWTH: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    INSPIRATION: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  };

  const emoji = emotionEmojis[memory.emotion_primary] || emotionEmojis.DEFAULT;
  const gradient = emotionGradients[memory.emotion_primary] || "linear-gradient(135deg, #333 0%, #000 100%)";

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide === "story") {
      // Only show CTA if this is the last memory
      if (isLastMemory) {
        setCurrentSlide("cta");
      } else {
        // Go directly to next memory
        if (onNext) onNext();
        else onClose();
      }
    } else {
      // On CTA slide, close the viewer
      if (onNext) onNext();
      else onClose();
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide === "cta") {
      setCurrentSlide("story");
    } else {
      if (onPrevious) onPrevious();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container} style={{ background: gradient }}>
        {/* Progress Bars */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={`${styles.progressFill} ${currentSlide === "story" ? styles.active : styles.viewed}`} />
          </div>
          {isLastMemory && (
            <div className={styles.progressBar}>
              <div className={`${styles.progressFill} ${currentSlide === "cta" ? styles.active : ""}`} />
            </div>
          )}
        </div>

        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Navigation Tap Areas */}
        <div className={`${styles.navArea} ${styles.navPrev}`} onClick={handlePrevious} />
        <div className={`${styles.navArea} ${styles.navNext}`} onClick={handleNext} />

        {/* Content */}
        <div className={styles.storyContent}>
          <div className={styles.contentInner}>
            {currentSlide === "story" ? (
              <>
                <div className={styles.emotionTag}>
                  <span>{emoji}</span> {memory.emotion_primary}
                </div>
                <div>
                  <h1 className={styles.headline}>{memory.headline}</h1>
                  <p className={styles.storyText}>{memory.story_text}</p>
                </div>
                <div style={{ textAlign: "center", opacity: 0.7, fontSize: 14 }}>
                  {new Date(memory.created_at).toLocaleDateString()}
                </div>
              </>
            ) : (
              <div className={styles.ctaContainer}>
                <div style={{ fontSize: 60, marginBottom: 20 }}>{emoji}</div>
                <h2 className={styles.ctaTitle}>Share this moment</h2>
                <p className={styles.ctaDescription}>
                  {memory.emotional_close}
                </p>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <button
                    className={`${styles.actionButton} ${styles.primaryAction}`}
                    onClick={(e) => { e.stopPropagation(); alert("Recognition sent!"); }}
                    style={{ position: 'relative', zIndex: 60 }}
                  >
                    🚀 Send Recognition to Team
                  </button>

                  <button
                    className={`${styles.actionButton} ${styles.secondaryAction}`}
                    onClick={(e) => { e.stopPropagation(); alert("Shared to social media!"); }}
                    style={{ position: 'relative', zIndex: 60 }}
                  >
                    📤 Share to Internal Feed
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
