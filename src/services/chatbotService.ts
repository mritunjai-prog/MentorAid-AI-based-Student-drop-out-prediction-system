import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-pro" });
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  action?: {
    type: "navigate" | "upload" | "predict";
    data?: any;
  };
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
}

// Quick action buttons
export const quickActions: QuickAction[] = [
  {
    id: "check-dropout",
    label: "Check Dropout Risk",
    icon: "📊",
    prompt: "How can I check a student's dropout risk percentage?",
  },
  {
    id: "upload-csv",
    label: "Upload Students",
    icon: "📤",
    prompt: "How do I upload multiple students using CSV?",
  },
  {
    id: "risk-predictor",
    label: "Risk Predictor",
    icon: "🎯",
    prompt: "I want to use the quick risk predictor tool",
  },
  {
    id: "view-insights",
    label: "View Insights",
    icon: "💡",
    prompt: "Show me the key insights about at-risk students",
  },
];

// System prompt for context-aware responses
const getSystemPrompt = (context: {
  page: string;
  userRole?: string;
  stats?: any;
}) => {
  return `You are MentorBot, an intelligent AI assistant for MentorAid - a student dropout prediction system.

Current Context:
- Page: ${context.page}
- User Role: ${context.userRole || "Teacher"}
${context.stats ? `- Dashboard Stats: ${JSON.stringify(context.stats)}` : ""}

Your Capabilities:
1. Guide users through the MentorAid platform
2. Explain dropout risk predictions and ML model insights
3. Help with CSV uploads and batch predictions
4. Suggest interventions for at-risk students
5. Navigate users to specific features

Communication Style:
- Be friendly, helpful, and concise
- Use emojis occasionally for engagement
- Provide actionable steps with clear instructions
- When suggesting navigation, end with: "✨ Taking you to [page] now..." or "✨ Redirecting you now..."
- Keep responses under 150 words unless explaining complex topics

Key Features to Highlight:
- Dashboard: View all students, risk levels, statistics
- Upload CSV: Batch predict up to 1000 students
- Student Details: Individual student insights, intervention history
- AI Predictions: 76.61% accuracy Random Forest model
- Risk Levels: Low (green), Medium (yellow), High (red)

Auto-Navigation Triggers:
- When user asks about "check dropout" or "predict risk" → End with "✨ Taking you to the Dashboard now..."
- When user asks about "upload CSV" → End with "✨ Taking you to the Dashboard now..."
- When user asks about "risk predictor" or "quick assessment" → End with "✨ Taking you to the Risk Predictor now..."
- This triggers automatic page navigation

Rules:
- Never make up statistics or student data
- Always be supportive and educational
- Suggest practical next steps
- If asked about technical details, explain in simple terms`;
};

// Fallback rule-based responses when AI is unavailable
const getRuleBasedResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("dropout") &&
    (lowerMessage.includes("check") || lowerMessage.includes("predict"))
  ) {
    return "📊 To check a student's dropout risk:\n\n1. Go to Dashboard\n2. Click on any student card\n3. View their risk percentage and AI insights\n\n✨ Taking you to the Dashboard now...";
  }

  if (lowerMessage.includes("upload") || lowerMessage.includes("csv")) {
    return "📤 To upload students via CSV:\n\n1. Click the 'Upload CSV' button on Dashboard\n2. Select your CSV file (must include: attendance, marks, class, etc.)\n3. Click 'Predict All Students'\n4. View results instantly!\n\n✨ Taking you to the Dashboard now...";
  }

  if (lowerMessage.includes("intervention")) {
    return "🎯 Recommended interventions for at-risk students:\n\n📚 Academic Support:\n- One-on-one tutoring sessions\n- Study skills workshops\n- Peer mentoring programs\n\n💰 Financial Assistance:\n- Scholarship opportunities\n- Fee payment plans\n- Emergency funds\n\n🤝 Personal Support:\n- Academic counseling\n- Mental health resources\n- Career guidance\n\nClick on any student to log interventions!";
  }

  if (
    lowerMessage.includes("accuracy") ||
    lowerMessage.includes("model") ||
    lowerMessage.includes("ml")
  ) {
    return "🤖 MentorAid uses a Random Forest ML model with:\n\n✅ 76.61% Test Accuracy\n📊 35+ Original Features\n🔧 20 Engineered Features\n⚖️ SMOTE for Class Balancing\n\nThe model analyzes:\n- Academic performance (grades, attendance)\n- Enrollment patterns\n- Financial stability\n- Demographic factors\n\nPredictions help identify at-risk students early!";
  }

  if (
    lowerMessage.includes("risk level") ||
    lowerMessage.includes("low") ||
    lowerMessage.includes("medium") ||
    lowerMessage.includes("high")
  ) {
    return "🎯 Risk Level Meanings:\n\n🟢 Low Risk (0-33%): Student is on track, minimal intervention needed\n\n🟡 Medium Risk (34-66%): Monitor closely, consider preventive interventions\n\n🔴 High Risk (67-100%): Immediate attention required, implement comprehensive support\n\nRisk is calculated using 47 features including grades, attendance, and engagement!";
  }

  if (
    lowerMessage.includes("risk predictor") ||
    lowerMessage.includes("quick assessment") ||
    lowerMessage.includes("predictor tool") ||
    lowerMessage.includes("predict risk") ||
    lowerMessage.includes("risk prediction") ||
    lowerMessage.includes("check risk")
  ) {
    return "🎯 Quick Risk Predictor Tool!\n\nUse this for fast, simplified risk assessments. Just enter:\n- Student name & ID\n- Attendance %\n- Average marks\n- Fee status\n\nGet instant predictions with recommendations!\n\n✨ Taking you to the Risk Predictor now...";
  }

  if (lowerMessage.includes("dashboard") || lowerMessage.includes("navigate")) {
    return "🧭 MentorAid Navigation:\n\n📊 Dashboard: View all students, stats, upload CSV\n👤 Student Details: Click any student for detailed insights\n📈 Charts: Visual analytics on risk distribution\n⚙️ Filters: Sort by class, risk level, department\n\nWhat would you like to explore? [Go to Dashboard]";
  }

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return "👋 Hello! I'm MentorBot, your AI guide for MentorAid!\n\nI can help you:\n📊 Check student dropout risks\n📤 Upload CSV files\n💡 Get insights on at-risk students\n🎯 Suggest interventions\n\nWhat would you like to do today?";
  }

  if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
    return "💡 I'm here to help! I can assist with:\n\n📊 Checking dropout predictions\n📤 Uploading student data\n👥 Understanding risk levels\n🎯 Implementing interventions\n🤖 Explaining the AI model\n\nTry asking:\n- 'How do I check dropout risk?'\n- 'How to upload CSV?'\n- 'What interventions work best?'\n\nOr click a quick action button below!";
  }

  // Default response
  return "🤖 I'm MentorBot! I can help you with:\n\n✨ Student dropout predictions\n📊 Platform navigation\n📤 CSV uploads\n💡 AI insights\n🎯 Intervention strategies\n\nWhat would you like to know? Try the quick action buttons below or ask me anything!";
};

// Generate AI response using Gemini
export const generateChatResponse = async (
  message: string,
  context: {
    page: string;
    userRole?: string;
    stats?: any;
    chatHistory?: ChatMessage[];
  }
): Promise<string> => {
  try {
    // If no API key, use rule-based responses
    if (!model) {
      console.log("Using rule-based response (no API key)");
      return getRuleBasedResponse(message);
    }

    // Build conversation history for context
    const conversationHistory =
      context.chatHistory
        ?.slice(-5)
        .map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        )
        .join("\n") || "";

    const prompt = `${getSystemPrompt(context)}

Conversation History:
${conversationHistory}

User: ${message}

Assistant (respond naturally, be helpful):`;

    // Generate response from Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Gemini API error:", error);
    // Fallback to rule-based on error
    return getRuleBasedResponse(message);
  }
};

// Save chat history to localStorage
export const saveChatHistory = (messages: ChatMessage[]) => {
  try {
    localStorage.setItem("mentoraid_chat_history", JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
};

// Load chat history from localStorage
export const loadChatHistory = (): ChatMessage[] => {
  try {
    const saved = localStorage.getItem("mentoraid_chat_history");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert timestamp strings back to Date objects
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (error) {
    console.error("Error loading chat history:", error);
  }
  return [];
};

// Clear chat history
export const clearChatHistory = () => {
  localStorage.removeItem("mentoraid_chat_history");
};
