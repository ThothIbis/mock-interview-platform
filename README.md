# AI Mock Interview Platform

A Next.js application that provides realistic mock interview practice with an AI interviewer. Get real-time feedback and improve your interview skills through natural conversation.

## 🚀 Features

- **15-minute mock interviews** with behavioral questions
- **Real-time AI conversation** using Claude 3.5 Sonnet
- **Natural speech synthesis** with ElevenLabs
- **Live transcription** powered by Deepgram
- **Video call interface** via Daily.co
- **Instant feedback** with basic analytics
- **TypeScript** for type safety
- **Responsive design** with Mantine UI and Tailwind CSS

## 🏗️ Architecture

```
User Speech → Daily.co → Deepgram → Claude 3.5 → ElevenLabs → Daily.co → User Hears
```

- **Frontend**: Next.js 14 with App Router, Mantine UI, Tailwind CSS
- **AI Services**: Claude 3.5 (conversation), ElevenLabs (TTS), Deepgram (STT)
- **Video/Audio**: Daily.co WebRTC infrastructure
- **Deployment**: Vercel (frontend), Railway/Render (backend services)

## 📋 Prerequisites

- Node.js 18+ and npm
- API keys for:
  - Daily.co (video infrastructure)
  - Deepgram (speech-to-text)
  - Anthropic Claude (AI conversation)
  - ElevenLabs (text-to-speech)

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mock-interview-platform.git
   cd mock-interview-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your API keys:
   ```bash
   DAILY_API_KEY=your_daily_api_key
   DEEPGRAM_API_KEY=your_deepgram_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   # ... see .env.example for all variables
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DAILY_API_KEY` | Yes | Daily.co API key for video calls |
| `DEEPGRAM_API_KEY` | Yes | Deepgram API key for speech recognition |
| `ANTHROPIC_API_KEY` | Yes | Claude API key for AI conversation |
| `ELEVENLABS_API_KEY` | Yes | ElevenLabs API key for voice synthesis |
| `ELEVENLABS_VOICE_ID` | No | Voice ID (default: professional female) |
| `REDIS_URL` | No | Redis URL for session storage |

### Configuration Validation

Check your configuration status:
- Visit `/config-test` in development
- Call `/api/config/status` for programmatic access
- Console logs show validation on startup

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── interview/         # Interview flow pages
│   │   ├── setup/        # Camera/mic testing
│   │   ├── room/         # Video interview room  
│   │   └── results/      # Post-interview results
│   └── api/              # API routes
├── lib/                   # Utilities and configuration
│   ├── config.ts         # Environment variable management
│   ├── config-validator.ts # Configuration validation
│   └── hooks/            # React hooks
docs/                      # Project documentation
├── mvp_prd.md            # Product requirements
├── mvp_architecture.md   # Technical architecture
└── mvp_development_stories.md # Development roadmap
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to GitHub**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will auto-deploy on push to main

2. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all required API keys from `.env.example`

3. **Deploy**
   - Automatic deployment on every push
   - Preview deployments for pull requests

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Git hooks** for pre-commit checks (optional)

## 📊 Cost Analysis

Approximate costs per 15-minute interview:
- Daily.co: ~$0.105
- Deepgram: ~$0.065  
- Claude 3.5: ~$0.045
- ElevenLabs: ~$0.110
- **Total: ~$0.34 per interview**

## 🔒 Security

- Environment variables properly secured
- API keys never exposed to client
- CORS configuration for Daily.co
- Rate limiting on API routes
- No persistent data storage (stateless MVP)

## 🐛 Troubleshooting

### Common Issues

1. **Configuration errors**
   - Visit `/config-test` to check your setup
   - Ensure all required API keys are set
   - Check console for validation warnings

2. **Build failures**
   - Run `npm run lint` to check for code issues
   - Verify TypeScript compilation with `npm run build`

3. **Camera/microphone issues**
   - Ensure HTTPS in production (required for WebRTC)
   - Check browser permissions
   - Test on `/interview/setup` page

## 📚 Documentation

- [Product Requirements](./docs/mvp_prd.md)
- [Technical Architecture](./docs/mvp_architecture.md)
- [Development Stories](./docs/mvp_development_stories.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋 Support

For questions or issues:
- Check the troubleshooting section above
- Review the documentation in `/docs`
- Open an issue on GitHub