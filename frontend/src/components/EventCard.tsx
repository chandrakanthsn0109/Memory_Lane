import React from "react";
import styles from "./EventCard.module.css";
import { Event } from "../services/api";

interface EventCardProps {
  event: Event;
  onGenerate?: (eventId: string) => void;
  generating?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onGenerate,
  generating,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4>{event.event_type}</h4>
        <span className={styles.role}>{event.actor_role}</span>
      </div>

      <div className={styles.body}>
        <p>
          <strong>From:</strong> {event.actor_emp_id}
        </p>
        <p>
          <strong>Date:</strong> {formatDate(event.event_date)}
        </p>
      </div>

      {onGenerate && (
        <button
          className={styles.button}
          onClick={() => onGenerate(event.event_id)}
          disabled={generating}
        >
          {generating ? "Generating..." : "Generate Memory"}
        </button>
      )}
    </div>
  );
};
