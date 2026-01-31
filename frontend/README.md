# MemoryLane Frontend Guide

## Overview

The MemoryLane frontend is a modern React application that provides an intuitive interface for users to discover and manage their workplace memories.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── MemoryCard.tsx       # Display individual memory
│   │   ├── MemoryCard.module.css
│   │   ├── EventCard.tsx        # Display individual event
│   │   └── EventCard.module.css
│   ├── hooks/
│   │   ├── useEvents.ts         # Custom hook for events
│   │   └── useMemories.ts       # Custom hook for memories
│   ├── pages/
│   │   ├── Home.tsx             # Landing page
│   │   ├── Home.module.css
│   │   ├── UserDashboard.tsx    # Main user interface
│   │   └── UserDashboard.module.css
│   ├── services/
│   │   └── api.ts               # API client
│   ├── App.tsx                  # Main app component
│   ├── App.css
│   ├── index.tsx                # Entry point
│   └── globals.d.ts             # Type declarations
├── package.json
└── tsconfig.json
```

## Getting Started

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm start
```

The app will run on `http://localhost:3000` with proxy to backend API.

### Build for Production

```bash
npm run build
```

Builds the app for production to the `build/` folder.

## Key Components

### Home Page (`pages/Home.tsx`)
- Landing page with welcome message
- Employee ID input form
- Feature highlights
- Responsive design with gradient background

### User Dashboard (`pages/UserDashboard.tsx`)
- Tabbed interface: Memories and Events
- Memory collection display
- Event list with generation capability
- Process All button for batch processing
- Real-time data fetching

### Memory Card (`components/MemoryCard.tsx`)
- Displays generated memory
- Shows emotion with color coding
- Displays score, category, and creation date
- Responsive card layout

### Event Card (`components/EventCard.tsx`)
- Shows available events
- Event type and actor role
- Actor ID and event date
- Generate memory button

## Custom Hooks

### useEvents(userId)
Fetches events for a specific user

```typescript
const { events, loading, error } = useEvents(userId);
```

### useMemories(userId)
Fetches memories for a specific user

```typescript
const { memories, loading, error } = useMemories(userId);
```

## API Service (`services/api.ts`)

Provides methods for interacting with the backend API:

- `getHealth()` - Check server status
- `getEvents(userId)` - Fetch user events
- `getMemories(userId)` - Fetch user memories
- `getMemory(id)` - Get specific memory
- `generateMemory(userId, eventId)` - Generate a new memory
- `processAll()` - Trigger batch processing

## Styling

The frontend uses CSS Modules for scoped styling:

- **Gradient backgrounds** - Purple/pink gradient theme
- **Card-based layout** - Clean, organized display
- **Responsive design** - Works on mobile and desktop
- **Smooth transitions** - Hover effects and animations
- **Color coding** - Emotions use color psychology

## Features

### 1. Memory Exploration
- View all your generated memories
- See memory details including emotion and score
- Sort by creation date (newest first)

### 2. Event Management
- Browse all available events
- View event details
- Generate memories for specific events

### 3. Batch Processing
- Process all active users' memories
- Monitor processing status
- See processed memory count

### 4. Responsive UI
- Mobile-friendly design
- Adaptive layouts
- Touch-friendly buttons and inputs

## Environment Variables

No specific environment variables needed for frontend. API calls are proxied to backend via `package.json` proxy setting.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- **Lazy Loading** - Components load on demand
- **Memoization** - Prevent unnecessary re-renders
- **Code Splitting** - Automatic with React Router
- **CSS Modules** - Minimal CSS footprint
- **API Caching** - Data cached at component level

## Troubleshooting

### "Cannot connect to backend"
- Ensure backend server is running on port 3000
- Check `proxy` setting in `package.json`
- Verify firewall isn't blocking requests

### "Blank page loading"
- Check browser console for errors
- Verify React is properly loaded
- Clear browser cache and reload

### "No memories displayed"
- Verify database has memory records
- Check employee ID is correct
- Try generating a memory from an event

## Development Tips

### Adding New Components
1. Create file in appropriate directory
2. Use CSS Modules for styling
3. Add TypeScript types for props
4. Export from appropriate index file

### Adding New API Endpoints
1. Add method to `services/api.ts`
2. Update backend Express routes
3. Create hook if needed
4. Use in components

### Styling Guidelines
- Use CSS Modules for component styles
- Use CSS variables for consistent colors
- Maintain responsive design
- Test on mobile devices

## Testing

```bash
npm test
```

Launches test runner in interactive mode.

## Building for Production

```bash
# Build frontend
npm run build

# Build entire project
cd ..
npm run build
```

This will:
1. Compile TypeScript
2. Build React app
3. Create production-ready bundle

## Deployment

The built frontend is served by the Express backend. After building:

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Contributing

1. Follow existing code style
2. Use TypeScript for type safety
3. Write responsive CSS
4. Test on multiple devices
5. Update documentation

## License

MIT
