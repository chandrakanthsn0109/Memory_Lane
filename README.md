# MemoryLane - Workplace Memory Generation Platform

MemoryLane is a full-stack application that generates and celebrates workplace memories using AI. It analyzes employee events, scores them, and creates personalized memory narratives using Google's Gemini AI.

## Project Structure

```
MemoryLane/
├── app/
│   ├── jobs/
│   │   └── processMemoryLane.ts    # Batch job processor
│   └── server.ts                   # Express API server
├── lib/
│   ├── databases/                  # Database abstraction layer
│   ├── interfaces/                 # TypeScript interfaces
│   ├── ai.ts                       # Gemini AI integration
│   ├── blueprint.ts                # Memory blueprint builder
│   ├── classifier.ts               # User classification
│   ├── db.ts                       # Database interface
│   ├── freshness.ts                # Freshness scoring
│   ├── retry.ts                    # Retry logic
│   ├── scorer.ts                   # Event scoring
│   └── writer.ts                   # Database writer
├── frontend/                       # React frontend application
├── package.json
├── tsconfig.json
├── DATABASE.md                     # Database configuration guide
└── README.md
```

## Features

- 🎯 **Intelligent Event Scoring** - Analyzes events based on type, recency, hierarchy, and user engagement
- 🤖 **AI-Generated Narratives** - Uses Google Gemini to create personalized memory stories
- 👥 **User Classification** - Identifies "ACTIVE" vs "GHOST" users for personalized content
- 📊 **Fresh Content Management** - Prevents repetitive memories with freshness penalties
- 🗄️ **Database Agnostic** - Switch between PostgreSQL and Oracle with environment variables
- 💻 **Full-Stack Web UI** - Beautiful React frontend for exploring memories and events
- ⚡ **REST API** - Complete API for memory management and generation

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express.js
- **Databases**: PostgreSQL / Oracle
- **AI**: Google Generative AI (Gemini)
- **Testing**: Jest

### Frontend
- **Framework**: React 18
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **Routing**: React Router

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL or Oracle database
- Google Gemini API key

### Installation

1. **Clone and setup**
```bash
cd MemoryLane
npm install
cd frontend
npm install
cd ..
```

2. **Create `.env` file** in project root:

**For PostgreSQL:**
```env
DB_TYPE=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=memorylane
GEMINI_API_KEY=your_gemini_api_key
```

**For Oracle:**
```env
DB_TYPE=oracle
DB_USER=your_oracle_user
DB_PASSWORD=your_oracle_password
DB_CONNECT_STRING=your_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### Running the Application

**Development Mode:**
```bash
npm run dev
```
Server runs on `http://localhost:3000`

**Production Build:**
```bash
npm run build
npm start
```

**Run Batch Job:**
```bash
npm run job
```

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Events
- `GET /api/events?userId=<id>` - Get all events for a user
- `POST /api/generate-memory` - Generate a memory for a specific event
  ```json
  { "userId": "EMP123", "eventId": "EVT456" }
  ```

### Memories
- `GET /api/memories?userId=<id>` - Get all memories for a user
- `GET /api/memory/:id` - Get a specific memory

### Processing
- `POST /api/process-all` - Generate memories for all active users

## Scoring Algorithm

The scoring system uses multiple factors:

```
Score = (BaseWeight × RecencyFactor) + HierarchyBoost + GhostBoost - FreshnessPenalty - RepetitionPenalty
```

### Components

1. **Base Weight** - Event type importance
   - PROMOTION: 200
   - ACHIEVEMENT: 180
   - MILESTONE: 170
   - etc.

2. **Recency Factor** - Recent events score higher
   - ≤ 30 days: 1.5x
   - ≤ 90 days: 1.2x
   - ≤ 180 days: 1.0x
   - > 180 days: 0.7x

3. **Hierarchy Boost** - Based on interaction source
   - EXECUTIVE: 100
   - DIRECTOR: 80
   - MANAGER: 60
   - etc.

4. **Ghost Boost** - Boost for inactive users: 150

5. **Penalties**
   - Freshness: -500 (recent similar memories)
   - Repetition: -200 (same sender)

## Database Schema

### ML_EVENT_UNIFIED
```sql
event_id, event_type, event_date, actor_emp_id, actor_role, subject_emp_id, employee_status
```

### ML_MEMORY_PROCESSED
```sql
memory_id, user_id, memory_date, primary_event_id, memory_category, 
emotion_primary, emotion_intensity, final_score, headline, story_text, 
emotional_close, created_at
```

## Switching Databases

To switch from PostgreSQL to Oracle (or vice versa):

1. Update `DB_TYPE` in `.env`
2. Update database credentials
3. Restart the application

No code changes needed! See [DATABASE.md](DATABASE.md) for more details.

## Frontend Usage

1. **Home Page** - Enter your Employee ID to view memories
2. **Memories Tab** - View all generated memories
3. **Events Tab** - View available events and generate memories
4. **Process All** - Trigger batch processing for all users

## Development

### Building TypeScript
```bash
npm run build:server
```

### Running Tests
```bash
npm test
```

### Frontend Development
```bash
cd frontend
npm start
```

## Performance Optimization

- **Connection Pooling** - PostgreSQL uses connection pooling
- **Query Optimization** - Indexed lookups on event_id and user_id
- **Caching** - Frontend caches API responses
- **Lazy Loading** - Events and memories load on demand

## Troubleshooting

### Database Connection Errors
- Verify database credentials in `.env`
- Check database server is running
- Confirm network connectivity

### API Errors
- Check server logs for detailed error messages
- Verify all environment variables are set
- Ensure Gemini API key is valid

### Frontend Issues
- Clear browser cache
- Check browser console for errors
- Verify backend is running on port 3000

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

MIT

## Support

For issues and questions, please create an GitHub issue.

---

**Built with ❤️ for meaningful workplace moments**
