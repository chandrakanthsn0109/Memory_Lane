import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

export const Home: React.FC = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      navigate(`/user/${userId}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Welcome to MemoryLane</h1>
        <p>Discover and celebrate your workplace moments</p>

        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Enter your Employee ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            View My Memories
          </button>
        </form>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>📝 Curated Memories</h3>
            <p>Your best workplace moments, beautifully written</p>
          </div>
          <div className={styles.feature}>
            <h3>⭐ Event Scoring</h3>
            <p>Intelligent scoring to find your most meaningful events</p>
          </div>
          <div className={styles.feature}>
            <h3>🎯 Personalized</h3>
            <p>Content tailored to your role and interaction history</p>
          </div>
        </div>
      </div>
    </div>
  );
};
