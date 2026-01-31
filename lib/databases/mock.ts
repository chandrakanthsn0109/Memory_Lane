import "dotenv/config";
import { IConnection, IDatabase } from "../interfaces/IDatabase";
import * as fs from "fs";
import * as path from "path";

/**
 * Mock Database Implementation
 * Provides in-memory data store with file-based persistence
 * Useful for development and testing without a real database
 */

const DATA_DIR = path.join(process.cwd(), ".mock-data");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");
const MEMORIES_FILE = path.join(DATA_DIR, "memories.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface MockEvent {
  event_id: string;
  subject_emp_id: string;
  event_category: string;
  event_description: string;
  event_date: string;
  employee_status: string;
  created_at: string;
  updated_at: string;
}

interface MockMemory {
  memory_id: string;
  user_id: string;
  memory_date: string;
  primary_event_id: string;
  memory_category: string;
  emotion_primary: string;
  emotion_intensity: string;
  final_score: number;
  headline: string;
  story_text: string;
  emotional_close: string;
  created_at: string;
  updated_at: string;
}

let eventsData: MockEvent[] = [];
let memoriesData: MockMemory[] = [];

// Load data from files if they exist
function loadData() {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE, "utf-8"));
    }
    if (fs.existsSync(MEMORIES_FILE)) {
      memoriesData = JSON.parse(fs.readFileSync(MEMORIES_FILE, "utf-8"));
    }
  } catch (error) {
    console.warn("Could not load mock data:", error);
  }
}

function saveData() {
  try {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2));
    fs.writeFileSync(MEMORIES_FILE, JSON.stringify(memoriesData, null, 2));
  } catch (error) {
    console.error("Could not save mock data:", error);
  }
}

// Initialize with sample data if empty
function initializeWithSampleData() {
  if (eventsData.length === 0) {
    const now = new Date();
    eventsData = [
      {
        event_id: "evt-001",
        subject_emp_id: "EMP001",
        event_category: "Achievement",
        event_description: "Successfully completed Q4 project ahead of schedule",
        event_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        employee_status: "ACTIVE",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        event_id: "evt-002",
        subject_emp_id: "EMP001",
        event_category: "Promotion",
        event_description: "Promoted to Senior Engineer",
        event_date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        employee_status: "ACTIVE",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        event_id: "evt-003",
        subject_emp_id: "EMP002",
        event_category: "Recognition",
        event_description: "Team Player Award",
        event_date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        employee_status: "ACTIVE",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        event_id: "evt-004",
        subject_emp_id: "EMP002",
        event_category: "Learning",
        event_description: "Completed AWS certification",
        event_date: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        employee_status: "ACTIVE",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        event_id: "evt-005",
        subject_emp_id: "EMP003",
        event_category: "Social",
        event_description: "Led team building event",
        event_date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        employee_status: "GHOST",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
    ];
    saveData();
  }
}

class MockConnection implements IConnection {
  async execute(sql: string, params?: any[] | Record<string, any>): Promise<any> {
    const paramMap = this.normalizeParams(params);
    const sqlUpper = sql.toUpperCase();

    if (sqlUpper.includes("SELECT")) {
      return this.handleSelect(sql, paramMap);
    } else if (sqlUpper.includes("INSERT")) {
      return this.handleInsert(sql, paramMap);
    } else if (sqlUpper.includes("UPDATE")) {
      return this.handleUpdate(sql, paramMap);
    } else if (sqlUpper.includes("DELETE")) {
      return this.handleDelete(sql, paramMap);
    }

    return { rows: [], rowsAffected: 0 };
  }

  async commit(): Promise<void> {
    saveData();
  }

  async close(): Promise<void> {
    // No-op for mock
  }

  private normalizeParams(params?: any[] | Record<string, any>): Record<string, any> {
    const map: Record<string, any> = {};
    if (!params) return map;

    if (Array.isArray(params)) {
      params.forEach((val, idx) => {
        map[idx.toString()] = val;
        map[(idx + 1).toString()] = val;
      });
    } else {
      Object.assign(map, params);
    }
    return map;
  }

  private handleSelect(sql: string, params: Record<string, any>): any {
    const sqlUpper = sql.toUpperCase();

    if (sqlUpper.includes("ML_EVENT_UNIFIED")) {
      return this.selectFromEvents(sql, params);
    } else if (sqlUpper.includes("ML_MEMORY_PROCESSED")) {
      return this.selectFromMemories(sql, params);
    }

    return { rows: [], rowsAffected: 0 };
  }

  private selectFromEvents(sql: string, params: Record<string, any>): any {
    let rows = [...eventsData];

    if (sql.includes("subject_emp_id")) {
      const id = params["id"] || params["1"] || params["userId"];
      if (id) {
        rows = rows.filter((e) => e.subject_emp_id === id);
      }
    }

    if (sql.includes("ORDER BY")) {
      rows.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
    }

    return { rows, rowsAffected: rows.length };
  }

  private selectFromMemories(sql: string, params: Record<string, any>): any {
    let rows = [...memoriesData];

    if (sql.includes("memory_id = :id")) {
      const id = params["id"] || params["1"];
      if (id) {
        rows = rows.filter((m) => m.memory_id === id);
      }
    }

    if (sql.includes("user_id = :id")) {
      const id = params["id"] || params["1"] || params["userId"];
      if (id) {
        rows = rows.filter((m) => m.user_id === id);
      }
    }

    if (sql.includes("ORDER BY")) {
      rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    if (sql.includes("ROWS")) {
      const match = sql.match(/ROWS\s+(\d+)/i);
      if (match) {
        const limit = parseInt(match[1]);
        rows = rows.slice(0, limit);
      }
    }

    return { rows, rowsAffected: rows.length };
  }

  private handleInsert(sql: string, params: Record<string, any>): any {
    const sqlUpper = sql.toUpperCase();

    if (sqlUpper.includes("ML_EVENT_UNIFIED")) {
      const event: MockEvent = {
        event_id: params["id"] || "",
        subject_emp_id: params["emp"] || "",
        event_category: params["category"] || "",
        event_description: params["description"] || "",
        event_date: params["date"] || new Date().toISOString(),
        employee_status: params["status"] || "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      eventsData.push(event);
      return { rows: [event], rowsAffected: 1 };
    } else if (sqlUpper.includes("ML_MEMORY_PROCESSED")) {
      const memory: MockMemory = {
        memory_id: params["id"] || "",
        user_id: params["user"] || "",
        memory_date: params["memory_date"] || new Date().toISOString(),
        primary_event_id: params["event"] || "",
        memory_category: params["category"] || "",
        emotion_primary: params["emotion"] || "",
        emotion_intensity: params["intensity"] || "",
        final_score: parseFloat(params["score"] || "0"),
        headline: params["headline"] || "",
        story_text: params["story"] || "",
        emotional_close: params["close"] || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      memoriesData.push(memory);
      return { rows: [memory], rowsAffected: 1 };
    }

    return { rows: [], rowsAffected: 0 };
  }

  private handleUpdate(sql: string, params: Record<string, any>): any {
    return { rows: [], rowsAffected: 0 };
  }

  private handleDelete(sql: string, params: Record<string, any>): any {
    return { rows: [], rowsAffected: 0 };
  }
}

class MockDatabase implements IDatabase {
  constructor() {
    loadData();
    initializeWithSampleData();
  }

  async getConnection(): Promise<IConnection> {
    return new MockConnection();
  }
}

export const mockDb = new MockDatabase();
