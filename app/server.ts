import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { getConnection } from "../lib/db";
import { classifyUser } from "../lib/classifier";
import { calculateScore } from "../lib/scorer";
import { buildBlueprint } from "../lib/blueprint";
import { generateText } from "../lib/ai";
import { saveMemory } from "../lib/writer";
import { randomUUID } from "crypto";
import { initializeScheduler, processAllMemories } from "../lib/scheduler";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/build")));

// API Routes

/**
 * GET /api/health
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * GET /api/events
 * Get all events for a user
 */
app.get("/api/events", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT * FROM employee_memory_events WHERE subject_emp_id = $1 ORDER BY event_date DESC`,
      [userId]
    );
    await conn.close();

    res.json({
      userId,
      events: result.rows || [],
      total: (result.rows || []).length,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch events",
        message: error instanceof Error ? error.message : "",
      });
  }
});

/**
 * GET /api/memories
 * Get all memories for a user
 */
app.get("/api/memories", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT * FROM ML_MEMORY_PROCESSED WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    await conn.close();

    res.json({
      userId,
      memories: result.rows || [],
      total: (result.rows || []).length,
    });
  } catch (error) {
    console.error("Error fetching memories:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch memories",
        message: error instanceof Error ? error.message : "",
      });
  }
});

/**
 * GET /api/memory/:id
 * Get a specific memory
 */
app.get("/api/memory/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT * FROM ML_MEMORY_PROCESSED WHERE memory_id = :id`,
      [id]
    );
    await conn.close();

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Memory not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching memory:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch memory",
        message: error instanceof Error ? error.message : "",
      });
  }
});

/**
 * POST /api/generate-memory
 * Generate a memory for a specific event with detailed scoring breakdown
 */
app.post("/api/generate-memory", async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res
        .status(400)
        .json({ error: "userId and eventId are required" });
    }

    const conn = await getConnection();

    // Fetch the event
    const eventResult = await conn.execute(
      `SELECT * FROM employee_memory_events WHERE event_id = $1 AND subject_emp_id = $2`,
      [eventId, userId]
    );

    if (!eventResult.rows || eventResult.rows.length === 0) {
      await conn.close();
      return res.status(404).json({ error: "Event not found" });
    }

    const event = eventResult.rows[0];

    // Fetch recent memories for freshness penalty calculation
    const memoriesResult = await conn.execute(
      `SELECT * FROM ML_MEMORY_PROCESSED WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [userId]
    );

    const recentMemories = memoriesResult.rows || [];

    // Classify user based on event history
    const eventsResult = await conn.execute(
      `SELECT * FROM employee_memory_events WHERE subject_emp_id = $1`,
      [userId]
    );

    const userType = classifyUser(eventsResult.rows || []);
    
    // Calculate detailed score breakdown
    const scoreBreakdown = calculateScore(event, userType, recentMemories);

    // Build memory blueprint with visual theme and animation
    const blueprint = buildBlueprint(event, userType);
    
    // Generate AI narrative using Gemini
    const text = await generateText(blueprint);

    // Save memory with all detailed fields
    const memoryId = randomUUID();
    const memoryDate = new Date(event.event_date).toISOString().split('T')[0];
    
    // Calculate lifecycle dates
    const cooldownUntil = new Date();
    cooldownUntil.setDate(cooldownUntil.getDate() + 30);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 120);
    
    const params: any = {
      memory_id: memoryId,
      user_id: userId,
      memory_date: memoryDate,
      primary_event_id: eventId,
      memory_category: blueprint.category,
      emotion_primary: blueprint.emotion,
      emotion_intensity: parseInt(String(Math.max(1, Math.min(100, Math.floor(blueprint.intensity)))), 10),
      base_weight: scoreBreakdown.baseWeight,
      recency_factor: parseFloat((scoreBreakdown.recencyFactor).toFixed(2)),
      hierarchy_multiplier: scoreBreakdown.hierarchyMultiplier,
      freshness_penalty: scoreBreakdown.freshnessPenalty,
      repetition_penalty: scoreBreakdown.repetitionPenalty,
      final_score: Math.floor(scoreBreakdown.finalScore),
      headline: text.headline || "",
      story_text: text.story || "",
      emotional_close: text.close || "",
      visual_theme: blueprint.visualTheme,
      animation_type: blueprint.animationType,
      cta_type: blueprint.ctaType,
      has_comment: !!event.comment_text,
      has_points: !!event.points_value && event.points_value > 0,
      has_badge: !!event.badge_code,
      cooldown_until: cooldownUntil.toISOString().split('T')[0],
      expires_at: expiresAt.toISOString(),
      created_by: "SYSTEM",
    };

    await conn.execute(
      `INSERT INTO ML_MEMORY_PROCESSED
       (memory_id, user_id, memory_date, primary_event_id,
        memory_category, emotion_primary, emotion_intensity,
        base_weight, recency_factor, hierarchy_multiplier,
        freshness_penalty, repetition_penalty, final_score,
        headline, story_text, emotional_close,
        visual_theme, animation_type, cta_type,
        has_comment, has_points, has_badge,
        cooldown_until, expires_at, created_by, created_at)
       VALUES
       ($1, $2, $3, $4,
        $5, $6, $7,
        $8, $9, $10,
        $11, $12, $13,
        $14, $15, $16,
        $17, $18, $19,
        $20, $21, $22,
        $23, $24, $25, CURRENT_TIMESTAMP)`,
      [
        params.memory_id,
        params.user_id,
        params.memory_date,
        params.primary_event_id,
        params.memory_category,
        params.emotion_primary,
        params.emotion_intensity,
        params.base_weight,
        params.recency_factor,
        params.hierarchy_multiplier,
        params.freshness_penalty,
        params.repetition_penalty,
        params.final_score,
        params.headline,
        params.story_text,
        params.emotional_close,
        params.visual_theme,
        params.animation_type,
        params.cta_type,
        params.has_comment,
        params.has_points,
        params.has_badge,
        params.cooldown_until,
        params.expires_at,
        params.created_by,
      ]
    );

    await conn.commit();
    await conn.close();

    res.json({
      memoryId,
      event,
      scoreBreakdown,
      memory: {
        headline: text.headline,
        story: text.story,
        close: text.close,
      },
      visual: {
        theme: blueprint.visualTheme,
        animation: blueprint.animationType,
        cta: blueprint.ctaType,
      },
      features: {
        hasComment: !!event.comment_text,
        hasPoints: !!event.points_value && event.points_value > 0,
        hasBadge: !!event.badge_code,
      },
    });
  } catch (error) {
    console.error("Error generating memory:", error);
    res
      .status(500)
      .json({
        error: "Failed to generate memory",
        message: error instanceof Error ? error.message : "",
      });
  }
});

/**
 * GET /api/scheduler/status
 * Get the status of the automatic memory processing scheduler
 */
app.get("/api/scheduler/status", (req, res) => {
  res.json({
    status: "running",
    schedule: "Daily at 00:00 (midnight)",
    description: "Memories are automatically generated for all active employees",
    nextRun: "Tomorrow at 00:00 UTC",
  });
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  } catch (error) {
    res.status(404).json({ error: "Frontend not found" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ MemoryLane Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`🎨 Frontend available at http://localhost:${PORT}`);
  console.log("Server started successfully - listening for requests...");
});

// Keep the server alive with a dummy interval
const keepAliveInterval = setInterval(() => {
  // This keeps the event loop active
}, 60000);

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("[MemoryLane] Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("[MemoryLane] Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit - let the server keep running
});
