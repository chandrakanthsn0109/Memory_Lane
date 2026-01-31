-- MemoryLane Database Schema
-- Oracle DDL for required tables

-- Create ML_EVENT_UNIFIED table
CREATE TABLE ML_EVENT_UNIFIED (
  event_id VARCHAR2(36) PRIMARY KEY,
  subject_emp_id VARCHAR2(50) NOT NULL,
  event_category VARCHAR2(100),
  event_description CLOB,
  event_date TIMESTAMP,
  employee_status VARCHAR2(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  updated_at TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_event_emp_status 
  ON ML_EVENT_UNIFIED(subject_emp_id, employee_status);
CREATE INDEX idx_event_date 
  ON ML_EVENT_UNIFIED(event_date DESC);

-- Create ML_MEMORY_PROCESSED table
CREATE TABLE ML_MEMORY_PROCESSED (
  memory_id VARCHAR2(36) PRIMARY KEY,
  user_id VARCHAR2(50) NOT NULL,
  memory_date TIMESTAMP,
  primary_event_id VARCHAR2(36),
  memory_category VARCHAR2(100),
  emotion_primary VARCHAR2(50),
  emotion_intensity VARCHAR2(20),
  final_score NUMBER(10, 4),
  headline VARCHAR2(500),
  story_text CLOB,
  emotional_close CLOB,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  FOREIGN KEY (primary_event_id) REFERENCES ML_EVENT_UNIFIED(event_id) ON DELETE SET NULL
);

-- Create indexes for efficient memory retrieval
CREATE INDEX idx_memory_user_date 
  ON ML_MEMORY_PROCESSED(user_id, created_at DESC);
CREATE INDEX idx_memory_score 
  ON ML_MEMORY_PROCESSED(final_score DESC);

-- Sample data insertion (optional - for testing)
-- Uncomment the INSERT statements below to add test data

/*
INSERT INTO ML_EVENT_UNIFIED (event_id, subject_emp_id, event_category, event_description, event_date, employee_status)
VALUES 
  ('evt-001', 'EMP001', 'Achievement', 'Successfully completed Q4 project ahead of schedule', SYSDATE - 30, 'ACTIVE');

INSERT INTO ML_EVENT_UNIFIED (event_id, subject_emp_id, event_category, event_description, event_date, employee_status)
VALUES 
  ('evt-002', 'EMP001', 'Promotion', 'Promoted to Senior Engineer', SYSDATE - 60, 'ACTIVE');

INSERT INTO ML_EVENT_UNIFIED (event_id, subject_emp_id, event_category, event_description, event_date, employee_status)
VALUES 
  ('evt-003', 'EMP002', 'Recognition', 'Team Player Award', SYSDATE - 15, 'ACTIVE');

INSERT INTO ML_EVENT_UNIFIED (event_id, subject_emp_id, event_category, event_description, event_date, employee_status)
VALUES 
  ('evt-004', 'EMP002', 'Learning', 'Completed AWS certification', SYSDATE - 45, 'ACTIVE');

INSERT INTO ML_EVENT_UNIFIED (event_id, subject_emp_id, event_category, event_description, event_date, employee_status)
VALUES 
  ('evt-005', 'EMP003', 'Social', 'Led team building event', SYSDATE - 7, 'GHOST');

COMMIT;
*/

-- End of schema
