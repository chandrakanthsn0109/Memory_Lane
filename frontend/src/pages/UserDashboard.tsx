import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMemories } from "../hooks/useMemories";
import { useEvents } from "../hooks/useEvents";
import { MemoryCard } from "../components/MemoryCard";
import { EventCard } from "../components/EventCard";
import apiService from "../services/api";
import styles from "./UserDashboard.module.css";

export const UserDashboard: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<"memories" | "events">("memories");
  const [generatingEventId, setGeneratingEventId] = useState<string | null>(null);
  const { memories, loading: memoriesLoading } = useMemories(userId || null);
  const { events, loading: eventsLoading } = useEvents(userId || null);

  const handleGenerateMemory = async (eventId: string) => {
    if (!userId) return;

    try {
      setGeneratingEventId(eventId);
      await apiService.generateMemory(userId, eventId);
      // Refresh memories
      window.location.reload();
    } catch (error) {
      console.error("Error generating memory:", error);
      alert("Failed to generate memory");
    } finally {
      setGeneratingEventId(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          MemoryLane
        </Link>
        <div className={styles.userInfo}>
          <span>Employee ID: <strong>{userId}</strong></span>
        </div>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "memories" ? styles.active : ""}`}
          onClick={() => setActiveTab("memories")}
        >
          📖 Memories ({memories.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "events" ? styles.active : ""}`}
          onClick={() => setActiveTab("events")}
        >
          📅 Events ({events.length})
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "memories" && (
          <div className={styles.section}>
            <h2>Your Memories</h2>
            {memoriesLoading ? (
              <p className={styles.loading}>Loading memories...</p>
            ) : memories.length === 0 ? (
              <p className={styles.empty}>No memories yet. Generate one from your events!</p>
            ) : (
              <div className={styles.grid}>
                {memories.map((memory) => (
                  <MemoryCard key={memory.memory_id} memory={memory} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "events" && (
          <div className={styles.section}>
            <h2>Available Events</h2>
            {eventsLoading ? (
              <p className={styles.loading}>Loading events...</p>
            ) : events.length === 0 ? (
              <p className={styles.empty}>No events found.</p>
            ) : (
              <div className={styles.eventsList}>
                {events.map((event) => (
                  <EventCard
                    key={event.event_id}
                    event={event}
                    onGenerate={handleGenerateMemory}
                    generating={generatingEventId === event.event_id}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
