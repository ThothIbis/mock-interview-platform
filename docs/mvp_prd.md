# AI Mock Interview Platform - MVP Product Requirements Document

## Goals and Background Context

### Goals
- Create a functional 15-minute mock interview experience with AI interviewer
- Achieve seamless real-time conversation with <3 second response latency
- Provide basic transcript and feedback after interview completion
- Validate technical integration of video, speech, and AI services
- Launch quickly to test core concept with real users

### Background Context
Job seekers need practice for interviews but lack access to realistic simulation. Current solutions either provide static questions or real-time cheating assistance, neither of which builds genuine interview skills. This platform provides authentic practice through natural conversation with an AI interviewer, followed by constructive feedback - similar to practicing with a career coach.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-01-10 | 1.0 | Initial MVP PRD | PM |

## Requirements

### Functional Requirements
- FR1: System displays a simple landing page with "Start Interview" button
- FR2: System presents pre-interview setup screen to check camera/microphone
- FR3: System creates a video call interface resembling Zoom/Google Meet
- FR4: AI interviewer joins call with static professional image/logo
- FR5: AI conducts 15-minute behavioral interview with 5-7 questions
- FR6: AI asks contextual follow-up questions based on user responses
- FR7: System maintains natural conversation flow with <3 second response time
- FR8: System automatically ends interview after 15 minutes
- FR9: System provides downloadable transcript after interview
- FR10: System displays basic analysis (word count, filler words, response time)

### Non-Functional Requirements
- NFR1: Response latency must be under 3 seconds for natural conversation
- NFR2: System architecture must support scaling from 1 to 1000 concurrent users without code changes
- NFR3: Audio quality must be clear and natural (no robotic voice)
- NFR4: System must work on desktop Chrome/Firefox/Safari
- NFR5: Total cost per interview must be under $0.50
- NFR6: Backend services deployable to Railway/Render ($5-20/month initially)
- NFR7: Use queue-based architecture for reliability and scale

## MVP Scope Definition

### In Scope
- Single behavioral interview persona (works for any job type)
- Pre-built question bank (no job description parsing)
- Basic transcript with simple metrics
- Desktop web browsers only
- Anonymous sessions (no user accounts)
- 15-minute time limit
- English language only

### Out of Scope (Future Iterations)
- Multiple personas (technical, sales, marketing)
- Job description upload/parsing
- Advanced AI analysis and feedback
- Mobile support
- User authentication and history
- Payment processing
- Multiple languages
- Video recording/playback
- Resume parsing
- Practice mode or question preview

## User Flow

### Critical Path
1. User lands on homepage → Clicks "Start Mock Interview"
2. Setup screen → Tests camera/mic → Clicks "Begin Interview"
3. Video call starts → AI interviewer appears with welcome message
4. AI asks first question → User responds
5. AI asks follow-up or next question → Conversation continues
6. At 15 minutes → AI wraps up interview
7. Call ends → Results page shows transcript and basic metrics
8. User can download transcript → Session ends

## Technical Approach

### Service Integration Flow
```
User Speech → Daily.co → Deepgram → Claude 3.5 → ElevenLabs → Daily.co → User Hears
                ↓                        ↓
            Transcript              Store Context
                ↓                        ↓
            Results Page          Next Question Logic
```

### Response Time Budget
- Deepgram transcription: 300-500ms
- Claude 3.5 response: 800-1500ms
- ElevenLabs synthesis: 400-800ms
- Network overhead: 200-400ms
- **Total: 1.7-3.2 seconds**

## Success Metrics

### Primary KPIs
- Technical: Average response latency <3 seconds
- Completion: >70% of started interviews reach 10+ minutes
- Quality: >80% of users rate experience as "realistic"

### MVP Validation Criteria
- Successfully complete 50 interviews without critical failures
- Achieve target latency in 90% of interactions
- Positive feedback on conversation naturalness
- Cost per interview remains under $0.50

## Question Bank (MVP)

### Opening
"Tell me about yourself and what brings you here today."

### Core Behavioral Questions
1. "Describe a challenging situation you faced and how you handled it."
2. "Tell me about a time you worked with a difficult team member."
3. "What's your greatest professional achievement?"
4. "Where do you see yourself in 5 years?"
5. "Why are you interested in making a career change?" (if applicable)
6. "What questions do you have for me?"

### Follow-up Patterns
- "Can you elaborate on [specific point]?"
- "What was the outcome of that situation?"
- "How did that experience shape your approach?"
- "What would you do differently?"