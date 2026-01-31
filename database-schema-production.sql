-- MemoryLane Production Database Schema
-- PostgreSQL DDL for real event and memory tables

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS ML_MEMORY_PROCESSED CASCADE;
DROP TABLE IF EXISTS ML_EVENT_UNIFIED CASCADE;

-- ============================================================
-- TABLE 1: ML_EVENT_UNIFIED (Source Events Table)
-- ============================================================
CREATE TABLE ML_EVENT_UNIFIED (
  event_id VARCHAR(50) PRIMARY KEY,
  event_type VARCHAR(100),
  event_subtype VARCHAR(100),
  event_date DATE,
  subject_emp_id VARCHAR(50) NOT NULL,
  actor_emp_id VARCHAR(50),
  actor_role VARCHAR(100),
  actor_hierarchy_level NUMERIC(5, 2),
  is_outside_hierarchy CHAR(1) DEFAULT 'N',
  is_top_hierarchy CHAR(1) DEFAULT 'N',
  points_value NUMERIC(10, 2),
  points_bucket VARCHAR(50),
  badge_code VARCHAR(50),
  behavior_code VARCHAR(50),
  comment_text TEXT,
  card_id VARCHAR(50),
  is_first_time CHAR(1) DEFAULT 'N',
  source_system VARCHAR(100),
  employee_status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_event_emp_status ON ML_EVENT_UNIFIED(subject_emp_id, employee_status);
CREATE INDEX idx_event_date ON ML_EVENT_UNIFIED(event_date DESC);
CREATE INDEX idx_event_type ON ML_EVENT_UNIFIED(event_type);

-- ============================================================
-- TABLE 2: ML_MEMORY_PROCESSED (Destination Memories Table)
-- ============================================================
CREATE TABLE ML_MEMORY_PROCESSED (
  memory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(50) NOT NULL,
  memory_date DATE,
  primary_event_id VARCHAR(50) NOT NULL,
  memory_category VARCHAR(100),
  
  -- Emotional Components
  emotion_primary VARCHAR(50),
  emotion_intensity SMALLINT,
  
  -- Scoring Components (Detailed Breakdown)
  base_weight INTEGER,
  recency_factor NUMERIC(5, 3),
  hierarchy_multiplier INTEGER,
  freshness_penalty INTEGER,
  repetition_penalty INTEGER,
  final_score INTEGER,
  
  -- Narrative Components
  headline VARCHAR(500),
  story_text TEXT,
  emotional_close VARCHAR(500),
  
  -- Visual & UX Components
  cta_type VARCHAR(50),
  visual_theme VARCHAR(50),
  animation_type VARCHAR(50),
  
  -- Feature Flags
  has_comment BOOLEAN DEFAULT FALSE,
  has_points BOOLEAN DEFAULT FALSE,
  has_badge BOOLEAN DEFAULT FALSE,
  
  -- Freshness & Lifecycle Management
  cooldown_until DATE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit Trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  
  -- Foreign Key Relationship
  FOREIGN KEY (primary_event_id) REFERENCES ML_EVENT_UNIFIED(event_id) ON DELETE CASCADE,
  CONSTRAINT memory_score_valid CHECK (final_score >= 0 AND final_score <= 100)
);

-- Create indexes for efficient memory retrieval
CREATE INDEX idx_memory_user_date ON ML_MEMORY_PROCESSED(user_id, memory_date DESC);
CREATE INDEX idx_memory_score ON ML_MEMORY_PROCESSED(final_score DESC);
CREATE INDEX idx_memory_emotion ON ML_MEMORY_PROCESSED(emotion_primary);
CREATE INDEX idx_memory_expires ON ML_MEMORY_PROCESSED(expires_at);
CREATE INDEX idx_memory_cooldown ON ML_MEMORY_PROCESSED(cooldown_until);

-- ============================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================

-- Insert sample events
INSERT INTO ML_EVENT_UNIFIED (
  event_id, event_type, event_subtype, event_date,
  subject_emp_id, actor_emp_id, actor_role,
  actor_hierarchy_level, is_outside_hierarchy, is_top_hierarchy,
  points_value, points_bucket, badge_code, behavior_code,
  comment_text, card_id, is_first_time, source_system,
  employee_status, created_at
) VALUES
  ('EVT001', 'ACHIEVEMENT', 'PROJECT_COMPLETION', '2026-01-28',
   'EMP001', 'EMP002', 'Manager', 3, 'N', 'N',
   100, 'HIGH', 'EXCELLENCE', 'DELIVERY',
   'Delivered Q4 project ahead of schedule', 'CARD001', 'N', 'HRIS',
   'ACTIVE', CURRENT_TIMESTAMP),
  
  ('EVT002', 'PROMOTION', 'LEVEL_INCREASE', '2025-11-28',
   'EMP001', 'EMP003', 'Director', 4, 'N', 'Y',
   250, 'VERY_HIGH', 'LEADERSHIP', 'ADVANCEMENT',
   'Promoted to Senior Engineer', 'CARD002', 'Y', 'HRIS',
   'ACTIVE', CURRENT_TIMESTAMP),
  
  ('EVT003', 'RECOGNITION', 'PEER_AWARD', '2026-01-20',
   'EMP002', 'EMP004', 'HR', 2, 'Y', 'N',
   50, 'MEDIUM', 'TEAMWORK', 'COLLABORATION',
   'Team Player Award from peers', 'CARD003', 'N', 'RECOGNITION',
   'ACTIVE', CURRENT_TIMESTAMP),
  
  ('EVT004', 'LEARNING', 'CERTIFICATION', '2025-12-15',
   'EMP002', 'EMP001', 'Senior', 3, 'N', 'N',
   75, 'HIGH', 'GROWTH', 'DEVELOPMENT',
   'Completed AWS Solutions Architect certification', 'CARD004', 'N', 'LEARNING',
   'ACTIVE', CURRENT_TIMESTAMP),
  
  ('EVT005', 'SOCIAL', 'TEAM_EVENT', '2026-01-15',
   'EMP003', 'EMP001', 'Manager', 3, 'N', 'N',
   30, 'LOW', NULL, 'ENGAGEMENT',
   'Led successful team building event', 'CARD005', 'N', 'EVENTS',
   'GHOST', CURRENT_TIMESTAMP);

-- Insert sample memories (generated from events)
INSERT INTO ML_MEMORY_PROCESSED (
  user_id, memory_date, primary_event_id, memory_category,
  emotion_primary, emotion_intensity,
  base_weight, recency_factor, hierarchy_multiplier,
  freshness_penalty, repetition_penalty, final_score,
  headline, story_text, emotional_close,
  cta_type, visual_theme, animation_type,
  has_comment, has_points, has_badge,
  cooldown_until, expires_at, created_by
) VALUES
  ('EMP001', '2026-01-28', 'EVT001', 'ACHIEVEMENT',
   'PRIDE', 95,
   85, 0.95, 1,
   0, 0, 80,
   'Delivering Excellence: The Q4 Project Victory',
   'In the heart of the fourth quarter, when deadlines loom large and expectations are high, you took charge of a critical project. With focused determination and strategic thinking, you navigated complex challenges, overcame obstacles, and delivered exceptional results ahead of schedule. Your technical excellence and leadership set a new standard for what''s possible.',
   'This achievement stands as a testament to your ability to deliver excellence under pressure, inspiring your team and setting a new benchmark for success.',
   'SHARE', 'GRADIENT_PURPLE', 'FADE_IN_CASCADE',
   TRUE, TRUE, FALSE,
   '2026-02-28', '2026-04-28 23:59:59+00:00', 'SYSTEM'),
  
  ('EMP001', '2025-11-28', 'EVT002', 'PROMOTION',
   'JOY', 100,
   95, 0.75, 2,
   5, 0, 85,
   'Ascending New Heights: Your Senior Engineer Promotion',
   'The moment you''ve been working toward has arrived. Your promotion to Senior Engineer is recognition of not just your technical excellence, but your leadership, mentoring, and unwavering commitment to your team. This milestone marks a turning point in your career, acknowledging the tremendous impact you''ve made on projects and people alike.',
   'Your journey to this level showcases the power of dedication, continuous learning, and genuine care for excellence. Celebrate this well-deserved achievement.',
   'CELEBRATE', 'GRADIENT_PINK', 'SLIDE_UP',
   TRUE, TRUE, TRUE,
   '2026-01-28', '2026-05-28 23:59:59+00:00', 'SYSTEM'),
  
  ('EMP002', '2026-01-20', 'EVT003', 'RECOGNITION',
   'BELONGING', 85,
   70, 0.92, 1,
   2, 0, 70,
   'The Power of Collaboration: Your Team Player Award',
   'Your peers have recognized something special in you: the ability to lift others up while driving results. Your Team Player Award reflects your genuine commitment to collaboration, your willingness to support teammates, and your ability to create a positive, inclusive environment where everyone can thrive.',
   'This recognition from your peers is a powerful reminder of the human connections that make work meaningful and impactful.',
   'SHARE', 'GRADIENT_CYAN', 'FADE_IN',
   TRUE, FALSE, TRUE,
   '2026-02-20', '2026-04-20 23:59:59+00:00', 'SYSTEM');

-- Grant permissions (adjust user names as needed)
-- GRANT SELECT, INSERT, UPDATE ON ML_EVENT_UNIFIED TO app_user;
-- GRANT SELECT, INSERT, UPDATE ON ML_MEMORY_PROCESSED TO app_user;

COMMIT;
