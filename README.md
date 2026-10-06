\# 🧠 MindBridge



> \*\*A compassionate digital companion for mental wellness, self-awareness, and emotional support.\*\*



MindBridge is a full-stack mental-wellness web application designed to give users a safe and approachable space to understand their emotions, track their mood, access wellness resources, and interact with an AI-powered companion.



The project combines a modern \*\*React + TypeScript + Vite\*\* frontend with a \*\*Node.js + Express + TypeScript\*\* backend and AI capabilities powered through \*\*Groq\*\*.



\---



\## ✨ Features



\### 🏠 Personalized Dashboard

\- Centralized view of the user's wellness journey

\- Quick access to wellness features

\- Clean and responsive interface



\### 😊 Mood Tracking

\- Log and track moods

\- Monitor emotional patterns

\- Store wellness-related information



\### 🤖 AI Companion

\- AI-powered supportive conversations

\- Emotion-aware interactions

\- Fast AI inference through Groq



\### 💬 AI Chat

\- Dedicated conversational interface

\- Supportive AI interactions

\- AI status handling



\### 🧘 Wellness Activities

\- Wellness-focused activities

\- Relaxation and self-care resources

\- Easy access from the application



\### 🚨 Crisis Support

\- Dedicated crisis-support section

\- Important support resources

\- Designed for quick access when needed



\### 👥 Caregiver Support

\- Support-oriented caregiver functionality

\- Resources for people supporting others



\### 📚 Resources

\- Mental-wellness resources

\- Easy navigation and access



\### ⚙️ Settings

\- User preferences

\- Application configuration

\- Personalized experience controls



\---



\# 🏗️ Architecture



```text

┌──────────────────────────────────────────────┐

│              MindBridge Frontend             │

│           React + TypeScript + Vite          │

│                                              │

│ Dashboard • Mood • AI Chat • Activities     │

│ Resources • Crisis • Caregiver • Settings   │

└──────────────────────┬───────────────────────┘

&#x20;                      │

&#x20;                      │ REST API

&#x20;                      ▼

┌──────────────────────────────────────────────┐

│                 API Server                   │

│            Node.js + Express + TS            │

│                                              │

│ Users • Moods • Settings • AI • Health      │

└───────────────┬──────────────────┬───────────┘

&#x20;               │                  │

&#x20;               ▼                  ▼

&#x20;       ┌──────────────┐   ┌───────────────┐

&#x20;       │ Data / DB    │   │   Groq / AI   │

&#x20;       │ Drizzle ORM  │   │ Integration   │

&#x20;       └──────────────┘   └───────────────┘

