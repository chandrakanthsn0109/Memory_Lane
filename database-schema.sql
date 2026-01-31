-- MemoryLane Database Schema
-- PostgreSQL DDL for required tables

-- Source table: employee_memory_events (already exists with production data)
-- Columns: event_id, event_type, event_subtype, event_date, subject_emp_id, 
--          actor_emp_id, actor_role, actor_hierarchy_level, is_outside_hierarchy,
--          is_top_hierarchy, points_value, points_bucket, badge_code, behavior_code,
--          comment_text, card_id, is_first_time, source_system, employee_status, created_at

-- Destination table: ML_MEMORY_PROCESSED (where processed memories are stored)
CREATE TABLE IF NOT EXISTS ML_MEMORY_PROCESSED (
  memory_id UUID PRIMARY KEY,
  user_id VARCHAR(50),
  memory_date DATE,
  primary_event_id VARCHAR(36),
  memory_category VARCHAR(100),
  emotion_primary VARCHAR(50),
  emotion_intensity SMALLINT,
  base_weight INTEGER,
  recency_factor NUMERIC,
  hierarchy_multiplier INTEGER,
  freshness_penalty INTEGER,
  repetition_penalty INTEGER,
  final_score INTEGER,
  headline VARCHAR(500),
  story_text TEXT,
  emotional_close VARCHAR(500),
  cta_type VARCHAR(50),
  visual_theme VARCHAR(50),
  animation_type VARCHAR(50),
  has_comment BOOLEAN,
  has_points BOOLEAN,
  has_badge BOOLEAN,
  cooldown_until DATE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR(50)
);

-- Create indexes on ML_MEMORY_PROCESSED for efficient retrieval
CREATE INDEX IF NOT EXISTS idx_memory_user_date 
  ON ML_MEMORY_PROCESSED(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_score 
  ON ML_MEMORY_PROCESSED(final_score DESC);

-- End of schema
