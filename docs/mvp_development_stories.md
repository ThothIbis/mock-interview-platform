# MVP Development Stories - Implementation Roadmap

## Epic 1: Foundation Setup (Days 1-3)

### Story 1.1: Project Initialization
**As a** developer  
**I want** to set up the Next.js project with all core dependencies  
**So that** I have a working foundation to build on

**Acceptance Criteria:**
- Next.js 14 project created with TypeScript
- Mantine UI installed and configured
- Tailwind CSS integrated
- ESLint and Prettier configured
- Git repository initialized
- Project deploys successfully to Vercel

**Dev Notes for Claude Code:**
```bash
npx create-next-app@latest mock-interview-platform --typescript --app
cd mock-interview-platform
npm install @mantine/core @mantine/hooks @mantine/next
npm install -D @types/node
```

### Story 1.2: Environment Configuration
**As a** developer  
**I want** to configure all environment variables and API keys  
**So that** services can connect properly

**Acceptance Criteria:**
- .env.local file created with all service keys
- Environment variables typed in TypeScript
- Vercel environment variables configured
- Configuration helper functions created

**Required Environment Variables:**
```
DAILY_API_KEY=
DEEPGRAM_API_KEY=
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
NEXT_PUBLIC_APP_URL=
```

### Story 1.3: Basic Page Structure
**As a** user  
**I want** to see the core pages of the application  
**So that** I can navigate through the interview flow

**Acceptance Criteria:**
- Landing page created at `/`
- Setup page created at `/interview/setup`
- Interview room page created at `/interview/room`
- Results page created at `/interview/results`
- Basic navigation working between pages

---

## Epic 2: Video Infrastructure (Days 4-6)

### Story 2.1: Daily.co Integration
**As a** developer  
**I want** to integrate Daily.co for video calls  
**So that** users can have a video interview experience

**Acceptance Criteria:**
- Daily.co SDK installed and configured
- API route created to generate room URLs
- Room creation with 15-minute expiry
- Token generation for participants

**Implementation Notes:**
```javascript
// /app/api/interview/create-room/route.ts
export async function POST() {
  const room = await createDailyRoom({
    properties: {
      exp: Math.floor(Date.now() / 1000) + 3600,
      max_participants: 2,
      enable_chat: false
    }
  });
  return Response.json({ roomUrl: room.url });
}
```

### Story 2.2: Video UI Components
**As a** user  
**I want** to see myself and the AI interviewer in a video interface  
**So that** it feels like a real interview

**Acceptance Criteria:**
- Video grid layout with 2 panels
- User's camera feed displays correctly
- AI interviewer shows static professional image
- Mute/unmute controls work
- Camera on/off toggle works

### Story 2.3: Pre-Interview Setup
**As a** user  
**I want** to test my camera and microphone before starting  
**So that** I know my equipment works

**Acceptance Criteria:**
- Camera permission requested and handled
- Microphone permission requested and handled
- Live preview of user's camera
- Audio level indicator
- "Begin Interview" only enabled when both work

---

## Epic 3: Real-Time Audio Pipeline (Days 7-10)

### Story 3.1: Backend Service Setup
**As a** developer  
**I want** to establish WebSocket server with queue system  
**So that** the system can handle concurrent users and scale

**Acceptance Criteria:**
- Node.js backend service created (separate from Next.js)
- Socket.io server configured with CORS
- Redis connected for session state
- BullMQ configured for job processing
- Service deploys to Railway/Render

**Implementation Structure:**
```javascript
// /backend/server.js (separate service)
import { Server } from 'socket.io';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);
const audioQueue = new Queue('audio-processing', { connection: redis });

const io = new Server(3001, { 
  cors: { origin: process.env.FRONTEND_URL }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on('audio-stream', async (data) => {
    // For MVP: Process directly
    // For scale: Add to queue
    await handleAudioData(socket.id, data);
  });
});
```

**Deployment Note:**
This runs as a separate service on Railway/Render, not on Vercel.

### Story 3.2: Deepgram Integration
**As a** user  
**I want** my speech to be transcribed in real-time  
**So that** the AI can understand what I'm saying

**Acceptance Criteria:**
- Deepgram WebSocket connection established
- Audio stream from Daily.co captured
- Real-time transcription working
- End-of-utterance detection configured
- Transcripts stored in session state

### Story 3.3: Claude Integration
**As a** system  
**I want** Claude to respond to user statements  
**So that** the interview feels conversational

**Acceptance Criteria:**
- Claude 3.5 Sonnet API integrated
- System prompt for interviewer persona configured
- Context management (previous Q&A tracked)
- Response generated within 2 seconds
- Follow-up questions based on user answers

**System Prompt Template:**
```javascript
const systemPrompt = `You are a professional interviewer.
Current question number: ${questionCount}/7
Time elapsed: ${timeElapsed} minutes
Previous context: ${conversationHistory}
Generate a follow-up question based on their answer.
Keep responses under 50 words.`;
```

### Story 3.4: ElevenLabs Integration
**As a** user  
**I want** to hear the AI interviewer speak naturally  
**So that** it feels like a real conversation

**Acceptance Criteria:**
- ElevenLabs API integrated
- Voice selection configured (professional voice)
- Streaming audio working
- Audio plays through Daily.co
- Latency under 1 second

---

## Epic 4: Interview Flow Management (Days 11-12)

### Story 4.1: Interview State Machine
**As a** system  
**I want** to manage interview phases and timing  
**So that** interviews follow a consistent structure

**Acceptance Criteria:**
- 15-minute timer implemented
- Question count tracked (5-7 questions)
- Interview phases managed (greeting, questions, closing)
- Graceful ending at time limit
- Warning at 2 minutes remaining

**State Structure:**
```javascript
const interviewState = {
  phase: 'greeting' | 'questions' | 'closing',
  startTime: Date,
  questionCount: number,
  timeRemaining: number,
  transcript: Array,
  isAISpeaking: boolean
};
```

### Story 4.2: Conversation Orchestration
**As a** user  
**I want** natural conversation flow without interruptions  
**So that** the interview feels professional

**Acceptance Criteria:**
- AI waits for user to finish speaking
- No interruptions while AI is speaking
- Natural pause detection (1 second silence)
- Smooth turn-taking between user and AI
- Error recovery without breaking flow

### Story 4.3: Real-time UI Updates
**As a** user  
**I want** to see the interview progress in real-time  
**So that** I know how much time remains

**Acceptance Criteria:**
- Timer counts down from 15:00
- Timer changes color at warnings (2:00, 0:30)
- Current transcript displays (optional toggle)
- Speaking indicator when AI is thinking
- Connection status visible

---

## Epic 5: Results and Analytics (Days 13-14)

### Story 5.1: Interview Completion
**As a** user  
**I want** the interview to end gracefully  
**So that** I have a proper conclusion

**Acceptance Criteria:**
- AI delivers closing statement at 15 minutes
- Room automatically closes
- User redirected to results page
- Transcript saved to session storage
- Thank you message displayed

### Story 5.2: Basic Analytics
**As a** user  
**I want** to see basic metrics about my interview  
**So that** I can understand my performance

**Acceptance Criteria:**
- Total words spoken calculated
- Filler words counted ("um", "uh", "like")
- Average response time calculated
- Speaking time ratio shown
- Metrics displayed in cards

### Story 5.3: Transcript Download
**As a** user  
**I want** to download my interview transcript  
**So that** I can review it later

**Acceptance Criteria:**
- Full transcript formatted with timestamps
- Speaker labels clear (You: / Interviewer:)
- Download as .txt file
- Include basic metrics at top
- Clean, readable formatting

---

## Epic 6: Testing and Polish (Days 15-16)

### Story 6.1: End-to-End Testing
**As a** developer  
**I want** to test the complete interview flow  
**So that** I can ensure everything works together

**Test Scenarios:**
- Complete 15-minute interview successfully
- Handle connection drops gracefully
- Recover from service errors
- Test with different network speeds
- Verify all metrics calculate correctly

### Story 6.2: Error Handling
**As a** user  
**I want** clear error messages and recovery options  
**So that** technical issues don't ruin my practice

**Acceptance Criteria:**
- Connection lost message with retry
- Service timeout fallbacks
- Graceful degradation (continue without video if needed)
- Error logging for debugging
- User-friendly error messages

### Story 6.3: Performance Optimization
**As a** user  
**I want** responses within 3 seconds  
**So that** conversation feels natural

**Optimization Targets:**
- Audio capture to transcription: <500ms
- Transcription to AI response: <1500ms
- AI response to speech: <800ms
- Total round-trip: <3000ms

---

## Implementation Order for Claude Code

### Week 1: Foundation
1. Story 1.1: Project setup
2. Story 1.2: Environment config
3. Story 1.3: Page structure
4. Story 2.1: Daily.co integration
5. Story 2.2: Video UI

### Week 2: Core Pipeline
6. Story 3.1: WebSocket setup
7. Story 3.2: Deepgram integration
8. Story 3.3: Claude integration
9. Story 3.4: ElevenLabs integration
10. Story 4.2: Conversation orchestration

### Week 3: Polish
11. Story 4.1: State management
12. Story 4.3: Real-time UI
13. Story 5.1-5.3: Results and analytics
14. Story 6.1-6.3: Testing and optimization

---

## How to Use This with Claude Code

### For Each Story:
1. **Copy the story** to Claude Code
2. **Add context**: "I'm building a mock interview platform. Here's the current story to implement: [paste story]"
3. **Provide the architecture context** if needed
4. **Test after each story** before moving to the next

### Example Claude Code Prompts:

**Starting a story:**
"I need to implement Story 2.1: Daily.co Integration. Create an API route that generates Daily.co rooms with 15-minute expiry."

**Debugging:**
"The Deepgram transcription is working but has high latency. How can we optimize the streaming configuration?"

**Testing:**
"Create a test script to verify the complete audio pipeline from microphone to AI response to speaker."

### Progress Tracking:
- [ ] Epic 1: Foundation Setup
- [ ] Epic 2: Video Infrastructure  
- [ ] Epic 3: Real-Time Audio Pipeline
- [ ] Epic 4: Interview Flow Management
- [ ] Epic 5: Results and Analytics
- [ ] Epic 6: Testing and Polish

Mark each story complete as you build it with Claude Code.