# AI Mock Interview Platform - MVP UI/UX Specification

## Design Principles

### Core Principles
- **Minimal Anxiety**: Reduce interview stress through calm, professional design
- **Zero Friction**: One-click to start, no sign-ups or complex setup
- **Familiar Patterns**: Mirror Zoom/Google Meet for instant recognition
- **Clear Progress**: Always show time remaining and interview phase
- **Professional Feel**: Clean, corporate aesthetic that feels like a real interview

## Visual Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #2563EB;      /* Trust, professionalism */
--primary-dark: #1E293B;      /* Text, headers */

/* Neutral Colors */
--gray-50: #F8FAFC;          /* Backgrounds */
--gray-100: #F1F5F9;         /* Cards */
--gray-400: #94A3B8;         /* Muted text */
--gray-600: #475569;         /* Body text */
--gray-900: #0F172A;         /* High contrast text */

/* Semantic Colors */
--success-green: #22C55E;    /* Ready states */
--warning-amber: #F59E0B;    /* Time warnings */
--error-red: #EF4444;        /* Errors */
```

### Typography
```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;

/* Type Scale */
--text-xs: 0.75rem;     /* Captions */
--text-sm: 0.875rem;    /* Secondary text */
--text-base: 1rem;      /* Body text */
--text-lg: 1.125rem;    /* Subheadings */
--text-xl: 1.25rem;     /* Section headers */
--text-2xl: 1.5rem;     /* Page titles */
--text-4xl: 2.25rem;    /* Hero text */
```

## Page Specifications

### 1. Landing Page

**Layout Structure**
```
┌─────────────────────────────────────┐
│          Mock Interview AI          │ <- Logo/Title
├─────────────────────────────────────┤
│                                     │
│   Practice Like It's Real          │ <- Hero headline
│                                     │
│   15-minute mock interviews with   │ <- Subtext
│   AI interviewer. Get transcript   │
│   and feedback instantly.          │
│                                     │
│  ┌────────────────────────────┐   │
│  │   Start Mock Interview      │   │ <- CTA button
│  └────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Component Details**
- Hero section: 100vh height, centered content
- CTA Button: Large (56px height), primary blue, hover effect
- Responsive: Stack vertically on mobile

### 2. Pre-Interview Setup

**Layout Structure**
```
┌─────────────────────────────────────┐
│        Interview Setup              │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │                               │   │
│  │     [Camera Preview]         │   │ <- Live camera feed
│  │                               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ✓ Camera working                  │ <- Status indicators
│  ✓ Microphone detected             │
│                                     │
│  Quick Tips:                       │
│  • Find a quiet space              │
│  • Look at the camera              │
│  • Speak clearly                   │
│                                     │
│  ┌────────────────────────────┐   │
│  │    Begin Interview          │   │
│  └────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Interaction Flow**
1. Auto-request camera/mic permissions on page load
2. Show live preview when permissions granted
3. Enable "Begin Interview" only when both camera and mic work
4. Loading state while creating Daily.co room

### 3. Interview Room

**Layout Structure**
```
┌─────────────────────────────────────────────┐
│ ┌─────────┐  Interview Room      15:00 ⏱️  │ <- Header with timer
├─┴─────────┴─────────────────────────────────┤
│                                             │
│  ┌──────────────────┐  ┌──────────────────┐│
│  │                  │  │                  ││
│  │   AI Interviewer │  │   You            ││ <- Video panels
│  │   [Logo/Image]   │  │   [Live Video]   ││
│  │                  │  │                  ││
│  └──────────────────┘  └──────────────────┘│
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Real-time Transcript                │   │ <- Collapsible
│  │ AI: Tell me about yourself...      │   │
│  │ You: I'm a software developer...   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│ [🔇] [📹] [End Interview]                  │ <- Controls
└─────────────────────────────────────────────┘
```

**Component Behavior**
- Timer: Counts down from 15:00, turns amber at 2:00, red at 0:30
- Video panels: Equal size, AI shows static professional image
- Transcript: Auto-scrolls, shows last 5 exchanges
- Controls: Minimal - just mute/camera toggle and end button

**Time-based UI Changes**
- 15:00-3:00: Normal state
- 3:00-1:00: Amber timer, "Wrapping up soon" indicator
- 1:00-0:00: Red timer, "Final question" indicator
- 0:00: Auto-end with "Thank you" message

### 4. Results Page

**Layout Structure**
```
┌─────────────────────────────────────┐
│       Interview Complete            │
├─────────────────────────────────────┤
│                                     │
│  Basic Metrics                      │
│  ┌────────────────────────────┐    │
│  │ Duration: 14:32             │    │
│  │ Words spoken: 847           │    │
│  │ Filler words: 12            │    │
│  │ Avg response time: 3.2s     │    │
│  └────────────────────────────┘    │
│                                     │
│  Transcript                        │
│  ┌────────────────────────────┐    │
│  │ AI: Tell me about yourself  │    │
│  │ You: [Your response...]     │    │
│  │ ...                         │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌──────────────┐ ┌──────────────┐│
│  │  Download    │ │  Try Again   ││
│  └──────────────┘ └──────────────┘│
└─────────────────────────────────────┘
```

**Data Display**
- Metrics cards: Large numbers with labels
- Transcript: Full conversation, clearly labeled speakers
- Download: Exports as formatted .txt file
- Try Again: Returns to landing page

## Responsive Behavior

### Desktop (>1024px)
- Side-by-side video panels in interview
- Full navigation and controls visible
- Optimal experience

### Tablet (768-1024px)
- Stack video panels vertically
- Maintain all functionality
- Adjust button sizes for touch

### Mobile (MVP - Display Only)
```
┌──────────────────┐
│                  │
│  Not Optimized   │
│  for Mobile      │
│                  │
│  Please use a    │
│  desktop browser │
│                  │
└──────────────────┘
```

## Interaction States

### Button States
- Default: Solid fill, sharp corners
- Hover: 10% darker, subtle shadow
- Active: Scale 0.98
- Disabled: 50% opacity, no cursor
- Loading: Spinner icon, disabled state

### Loading States
- Setup: "Preparing interview room..."
- Connecting: "Connecting to interview..."
- Processing: "Generating results..."

### Error States
- Connection lost: Modal with "Reconnecting..." 
- Service error: Banner with "Technical difficulty, please wait"
- Fatal error: Full page "Something went wrong" with restart button

## Micro-Interactions

### Transitions
- Page changes: 200ms fade
- Button clicks: 150ms scale
- Timer updates: No animation (avoid distraction)
- Transcript updates: Smooth scroll

### Feedback
- Mic detection: Green pulse when speaking
- AI thinking: Subtle typing indicator
- Time warnings: Gentle pulse on timer

## Component Library (Mantine)

### Core Components Used
```jsx
// Buttons
<Button size="xl" radius="md" color="blue">
  Start Interview
</Button>

// Cards
<Card shadow="sm" padding="lg" radius="md">
  <Text>Content</Text>
</Card>

// Progress
<RingProgress
  sections={[{ value: timePercent, color: 'blue' }]}
/>

// Modals
<Modal opened={showError} onClose={handleClose}>
  <Text>Error message</Text>
</Modal>
```

## Accessibility Considerations

### MVP Accessibility
- Keyboard navigation for all controls
- ARIA labels on interactive elements
- Sufficient color contrast (WCAG AA)
- Focus indicators visible
- Alt text for AI interviewer image

## User Flow Metrics

### Target Interaction Times
- Landing → Setup: <2 seconds
- Setup → Interview: <5 seconds  
- Interview end → Results: <3 seconds
- Full experience: ~16 minutes total

### Drop-off Prevention
- No sign-up friction
- Single-click start
- Clear progress indicators
- Immediate value (results without account)