import { useState, useEffect } from "react";
import apiService, { Event } from "../services/api";

export function useEvents(userId: string | null) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getEvents(userId);
        setEvents(data.events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  return { events, loading, error };
}
