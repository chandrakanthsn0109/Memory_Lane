# Quick Start Guide - MemoryLane

## 🚀 Get Started in 5 Minutes

### Step 1: Environment Setup

Create a `.env` file in the project root:

```env
# Database Configuration
DB_TYPE=postgres  # or 'oracle'

# PostgreSQL (if DB_TYPE=postgres)
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=memorylane

# Oracle (if DB_TYPE=oracle)
# DB_USER=your_oracle_user
# DB_PASSWORD=your_oracle_password
# DB_CONNECT_STRING=your_connection_string

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Run the Application

#### Development Mode:
```bash
npm run dev
```
Opens server at `http://localhost:3000`

#### Production Mode:
```bash
npm run build
npm start
```

### Step 4: Use the Application

1. **Open browser** → `http://localhost:3000`
2. **Enter Employee ID** on home page
3. **View Memories** - See all generated memories
4. **View Events** - See available events
5. **Generate Memory** - Click "Generate Memory" for any event
6. **Process All** - Generate memories for all users

## 📚 Project Structure

```
MemoryLane/
├── app/
│   ├── jobs/processMemoryLane.ts  # Batch processing job
│   └── server.ts                  # Express API server
├── lib/
│   ├── databases/                 # Database abstraction
│   ├── ai.ts                      # AI integration
│   ├── classifier.ts              # User classification
│   ├── scorer.ts                  # Scoring logic
│   └── ...
├── frontend/                      # React frontend
└── README.md                      # Full documentation
```

## 🔧 Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Run server in development mode |
| `npm start` | Run production server |
| `npm run job` | Run batch processing job |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run build:server` | Build TypeScript only |

## 🗄️ Database Setup

### PostgreSQL Setup

```sql
CREATE DATABASE memorylane;

CREATE TABLE ML_EVENT_UNIFIED (
  event_id VARCHAR(255) PRIMARY KEY,
  event_type VARCHAR(50),
  event_date TIMESTAMP,
  actor_emp_id VARCHAR(50),
  actor_role VARCHAR(50),
  subject_emp_id VARCHAR(50),
  employee_status VARCHAR(20)
);

CREATE TABLE ML_MEMORY_PROCESSED (
  memory_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(50),
  memory_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  primary_event_id VARCHAR(255),
  memory_category VARCHAR(50),
  emotion_primary VARCHAR(50),
  emotion_intensity INT,
  final_score DECIMAL(10, 2),
  headline VARCHAR(255),
  story_text TEXT,
  emotional_close TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Oracle Setup

Use the same schema above with Oracle-specific syntax (VARCHAR2, etc.)

## 📝 Sample Data

Insert some test events:

```sql
INSERT INTO ML_EVENT_UNIFIED VALUES 
('EVT001', 'PROMOTION', NOW(), 'EMP002', 'MANAGER', 'EMP001', 'ACTIVE'),
('EVT002', 'ACHIEVEMENT', NOW() - INTERVAL 30 DAY, 'EMP003', 'PEER', 'EMP001', 'ACTIVE');
```

## 🎯 API Endpoints

### Memory Management
```
GET /api/memories?userId=EMP001      # Get all memories
GET /api/memory/:id                  # Get specific memory
POST /api/generate-memory             # Generate new memory
  Body: { "userId": "...", "eventId": "..." }
```

### Events
```
GET /api/events?userId=EMP001       # Get all events
```

### Processing
```
POST /api/process-all               # Process all users
```

### Health
```
GET /api/health                     # Server status
```

## 🌐 Frontend Usage

| Screen | Purpose |
|--------|---------|
| **Home** | Enter Employee ID |
| **Memories Tab** | View all your memories |
| **Events Tab** | Browse events and generate memories |
| **Process All** | Trigger batch processing |

## 🔄 Switching Databases

Change `DB_TYPE` in `.env`:

```env
# From PostgreSQL to Oracle
DB_TYPE=oracle
DB_CONNECT_STRING=your_oracle_string
```

No code changes needed!

## 📊 Scoring Algorithm

```
Score = (BaseWeight × RecencyFactor) + HierarchyBoost + GhostBoost 
        - FreshnessPenalty - RepetitionPenalty
```

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Database connection error
- Verify credentials in `.env`
- Check database server is running
- Test connection manually

### Frontend not showing
- Check backend is running
- Clear browser cache
- Check console for errors

## 📚 Documentation

- **README.md** - Full project documentation
- **DATABASE.md** - Database configuration guide
- **FRONTEND.md** - Frontend development guide

## 🎓 Learn More

- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [Google Gemini API](https://ai.google.dev/)

## 🆘 Need Help?

1. Check the relevant documentation file
2. Review error logs in console
3. Verify `.env` file configuration
4. Ensure database is accessible

## 📋 Checklist

- [ ] `.env` file created with credentials
- [ ] Database created and accessible
- [ ] Dependencies installed (`npm install`)
- [ ] Frontend dependencies installed
- [ ] Server starts without errors (`npm run dev`)
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Can enter Employee ID and view data

---

**Happy Memory Lane! 🎉**
