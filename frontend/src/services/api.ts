import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "/api";

export interface Event {
  event_id: string;
  event_type: string;
  event_date: string;
  subject_emp_id: string;
  actor_emp_id?: string;
  actor_role?: string;
  comment_text?: string;
  points_value?: number;
  badge_code?: string;
}

export interface Memory {
  memory_id: string;
  user_id: string;
  headline: string;
  story_text: string;
  emotional_close: string;
  memory_category: string;
  emotion_primary: string;
  emotion_intensity: number;
  final_score: number;
  created_at: string;
  visual_theme?: string;
  animation_type?: string;
  cta_type?: string;
  base_weight?: number;
  recency_factor?: number;
  hierarchy_multiplier?: number;
  freshness_penalty?: number;
  repetition_penalty?: number;
  has_comment?: boolean;
  has_points?: boolean;
  has_badge?: boolean;
}

class ApiService {
  async getHealth() {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  }

  async getEvents(userId: string) {
    const response = await axios.get(`${API_BASE}/events`, {
      params: { userId },
    });
    return response.data;
  }

  async getMemories(userId: string) {
    const response = await axios.get(`${API_BASE}/memories`, {
      params: { userId },
    });
    return response.data;
  }

  async getMemory(id: string) {
    const response = await axios.get(`${API_BASE}/memory/${id}`);
    return response.data;
  }

  async generateMemory(userId: string, eventId: string) {
    const response = await axios.post(`${API_BASE}/generate-memory`, {
      userId,
      eventId,
    });
    return response.data;
  }

  async getSchedulerStatus() {
    const response = await axios.get(`${API_BASE}/scheduler/status`);
    return response.data;
  }
}

export default new ApiService();
