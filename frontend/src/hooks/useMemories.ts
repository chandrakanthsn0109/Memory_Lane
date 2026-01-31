import { useState, useEffect } from "react";
import apiService, { Memory } from "../services/api";

export function useMemories(userId: string | null) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchMemories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getMemories(userId);
        setMemories(data.memories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch memories");
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, [userId]);

  return { memories, loading, error };
}
