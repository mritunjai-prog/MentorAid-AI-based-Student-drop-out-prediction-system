# 🤖 MentorAid AI Chatbot Documentation

## Overview

MentorBot is an intelligent AI assistant integrated into MentorAid that provides context-aware guidance, helps users navigate the platform, and answers questions about student dropout predictions.

## Features

### ✨ **Intelligent AI Responses**
- **Google Gemini Integration**: Uses Gemini Pro for natural language understanding
- **Context-Aware**: Knows which page you're on and adapts responses
- **Fallback System**: Works offline with rule-based responses when API is unavailable

### 🎯 **Quick Actions**
Four pre-defined buttons for common tasks:
1. **Check Dropout Risk** - Guide on checking student predictions
2. **Upload Students** - Instructions for CSV batch upload
3. **View Insights** - Get AI-powered insights about at-risk students
4. **Interventions** - Suggested intervention strategies

### 💾 **Chat History**
- Automatic saving to localStorage
- Persistent across sessions
- Clear chat option available

### 🎨 **Beautiful UI**
- Floating chat button with pulse animation
- Smooth animations with Framer Motion
- Dark mode support
- Minimized/expanded states
- Typing indicators
- Message timestamps

## Technical Implementation

### Technologies Used

```json
{
  "AI": "@google/generative-ai@^0.21.0",
  "Animations": "framer-motion@^11.15.0",
  "UI": "lucide-react (icons)",
  "Storage": "localStorage API"
}
```

### File Structure

```
src/
├── components/ui/
│   └── ChatBot.tsx          # Main chatbot component
├── services/
│   └── chatbotService.ts    # AI service & logic
└── pages/
    ├── Dashboard.tsx         # Chatbot integrated
    └── StudentDetails.tsx    # Chatbot integrated
```

### Environment Setup

Add to `.env`:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**Get your free API key:**
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and paste into `.env`

## Usage

### Basic Implementation

```tsx
import ChatBot from "../components/ui/ChatBot";

// In your component
<ChatBot
  context={{
    page: "Dashboard",
    userRole: "Teacher",
    stats: {
      total: 150,
      highRisk: 20,
      mediumRisk: 45,
      lowRisk: 85,
    },
  }}
/>
```

### Context Properties

| Property | Type | Description |
|----------|------|-------------|
| `page` | string | Current page name (Dashboard, Student Details, etc.) |
| `userRole` | string | User's role (Teacher, Admin) |
| `stats` | object | Relevant statistics for AI context |

## Chatbot Capabilities

### What It Can Do

✅ **Navigation Guidance**
- "How do I check dropout risk?"
- "Where can I upload CSV files?"
- "Show me the dashboard"

✅ **Feature Explanations**
- "What does risk level mean?"
- "How accurate is the ML model?"
- "What are the intervention options?"

✅ **Context-Specific Help**
- On Dashboard: Provides stats overview, upload help
- On Student Details: Gives insights about specific student

✅ **Technical Questions**
- "How does the AI model work?"
- "What features are used for prediction?"
- "What's the accuracy rate?"

### Sample Conversations

**Example 1: New User**
```
User: Hi
Bot: 👋 Hello! I'm MentorBot, your AI guide for MentorAid!

I can help you:
📊 Check student dropout risks
📤 Upload CSV files
💡 Get insights on at-risk students
🎯 Suggest interventions

What would you like to do today?
```

**Example 2: Checking Dropout**
```
User: How do I check a student's dropout percentage?
Bot: 📊 To check a student's dropout risk:

1. Go to Dashboard
2. Click on any student card
3. View their risk percentage and AI insights

Or upload a CSV with student data for batch predictions! [Upload CSV]
```

**Example 3: Interventions**
```
User: What interventions work best?
Bot: 🎯 Recommended interventions for at-risk students:

📚 Academic Support:
- One-on-one tutoring sessions
- Study skills workshops
- Peer mentoring programs

💰 Financial Assistance:
- Scholarship opportunities
- Fee payment plans
- Emergency funds

🤝 Personal Support:
- Academic counseling
- Mental health resources
- Career guidance

Click on any student to log interventions!
```

## AI Service Architecture

### System Prompt Structure

The chatbot uses a carefully crafted system prompt that includes:

1. **Role Definition**: "You are MentorBot, an intelligent AI assistant..."
2. **Context Injection**: Page, user role, current stats
3. **Capabilities**: What the bot can help with
4. **Communication Style**: Friendly, concise, action-oriented
5. **Rules**: Don't make up data, be supportive, suggest next steps

### Fallback System

When Gemini API is unavailable or no API key is provided:

```typescript
const getRuleBasedResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("dropout")) {
    return "📊 To check dropout risk: ...";
  }
  // ... more rules
}
```

### Response Flow

```
User Input
    ↓
Check API Key Available?
    ├─ Yes → Gemini AI Response
    └─ No  → Rule-Based Response
    ↓
Format & Display
    ↓
Save to Chat History
```

## Customization Guide

### Adding New Quick Actions

Edit `src/services/chatbotService.ts`:

```typescript
export const quickActions: QuickAction[] = [
  // ... existing actions
  {
    id: "my-action",
    label: "My Action",
    icon: "🎯",
    prompt: "Tell me about my custom feature",
  },
];
```

### Adding New Rule-Based Responses

Add keywords and responses:

```typescript
if (lowerMessage.includes("my-keyword")) {
  return "🎯 My custom response with instructions...";
}
```

### Customizing UI Colors

Edit `ChatBot.tsx`:

```tsx
// Change floating button gradient
className="... bg-gradient-to-r from-blue-600 to-purple-600 ..."

// Change message bubble colors
className="... bg-blue-600 ..." // User messages
className="... bg-white dark:bg-gray-800 ..." // Bot messages
```

## Performance Optimization

### Chat History Limits

```typescript
// Keep only last 5 messages for AI context
const conversationHistory = context.chatHistory?.slice(-5);
```

### Response Caching

```typescript
// Prevent duplicate API calls
const [isLoading, setIsLoading] = useState(false);
if (isLoading) return;
```

### Lazy Loading

The chatbot only loads when opened:

```tsx
<AnimatePresence>
  {isOpen && <motion.div> ... </motion.div>}
</AnimatePresence>
```

## Security Considerations

✅ **API Key Protection**
- Stored in environment variables
- Never exposed to client code
- Can be rotated easily

✅ **Input Sanitization**
- Trims whitespace
- Validates message length
- No script injection possible

✅ **Rate Limiting**
- Gemini API has built-in limits
- Fallback system prevents failures

## Testing the Chatbot

### Local Testing

```bash
# 1. Add API key to .env
echo "VITE_GEMINI_API_KEY=your_key" >> .env

# 2. Run development server
npm run dev

# 3. Open http://localhost:5173
# 4. Click chatbot button (bottom-right)
# 5. Try quick actions or type questions
```

### Testing Without API Key

The chatbot works perfectly without Gemini API using rule-based responses!

```typescript
// Automatically falls back to rules
if (!API_KEY) {
  return getRuleBasedResponse(message);
}
```

### Test Scenarios

- [ ] Click floating button → Chat opens
- [ ] Click quick action → Sends pre-defined message
- [ ] Type message → Receives response
- [ ] Close and reopen → Chat history preserved
- [ ] Clear chat → History deleted
- [ ] Switch pages → Context updates
- [ ] Dark mode → Colors adjust properly

## Deployment

### Production Build

```bash
npm run build
```

### Netlify Deployment

Add environment variable in Netlify dashboard:
1. Site settings → Environment variables
2. Add `VITE_GEMINI_API_KEY`
3. Redeploy

### Environment Variables

```env
# Production
VITE_GEMINI_API_KEY=your_production_key
VITE_API_URL=https://your-backend.onrender.com/api

# Development
VITE_GEMINI_API_KEY=your_dev_key
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Chatbot Not Appearing

**Check:**
- ChatBot component is imported in page
- No console errors
- `isOpen` state is managed correctly

### AI Responses Not Working

**Check:**
- API key is set in `.env`
- API key is valid (test at https://makersuite.google.com)
- Network requests not blocked
- Fallback to rule-based responses

### Build Errors

**Common fixes:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Import Errors

**Verify paths:**
```tsx
// From Dashboard.tsx
import ChatBot from "../components/ui/ChatBot";

// From ChatBot.tsx
import { ... } from "../../services/chatbotService";
```

## Future Enhancements

### Planned Features

🔮 **Voice Input**
- Speech-to-text using Web Speech API
- Voice responses with text-to-speech

🔮 **Multi-language Support**
- i18n integration
- Auto-detect user language

🔮 **Advanced Analytics**
- Track common questions
- Improve responses based on usage
- A/B testing for prompts

🔮 **Suggested Actions**
- Clickable navigation links in responses
- Direct actions (e.g., "Upload CSV" button)
- Deep linking to specific features

🔮 **Context Awareness++**
- Remember previous conversations
- User preferences learning
- Personalized recommendations

## Support & Contribution

### Getting Help

- Check this documentation
- Review code comments in `chatbotService.ts`
- Test with rule-based responses first

### Contributing

To improve the chatbot:

1. **Add more rule-based responses** for common questions
2. **Improve system prompt** for better AI responses
3. **Add new quick actions** for frequent tasks
4. **Enhance UI/UX** with animations or features

## License

Part of MentorAid - AI-Based Student Dropout Prediction System
© 2025 All Rights Reserved

---

**Made with ❤️ using Google Gemini AI**
