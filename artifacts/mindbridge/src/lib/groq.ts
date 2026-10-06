import { api } from './api';

export async function checkAIAvailability(): Promise<boolean> {
  try {
    const status = await api.getAiStatus();
    return status?.available === true;
  } catch {
    return false;
  }
}

export async function analyzeEmotion(text: string, emojis: string[] = []) {
  try {
    return await api.analyzeMood({ text, emojis });
  } catch {
    return simulateEmotionAnalysis(text, emojis);
  }
}

export async function chatWithAI(messages: any[], userMessage: string) {
  const history = messages.slice(-10).map((m: any) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.content,
  }));

  try {
    const result = await api.chatWithAi({ messages: history, userMessage });
    return {
      response: result.response,
      sadnessDetected: result.sadnessDetected === true,
      crisisDetected: result.crisisDetected === true,
    };
  } catch {
    const lower = userMessage.toLowerCase();
    const crisisDetected = [
      'hurt myself', 'kill myself', 'end my life', 'suicide',
      "can't go on", 'cannot go on', 'not safe',
    ].some(phrase => lower.includes(phrase));
    const sadnessDetected = crisisDetected || [
      'sad', 'depressed', 'hopeless', 'worthless', 'lonely', 'miserable',
      'crying', 'cry', 'down', 'empty', 'heartbroken', 'devastated',
      'unhappy', 'grief', 'numb', 'feeling bad', 'feeling horrible',
      'feeling terrible', 'nothing matters', 'no one cares',
    ].some(phrase => lower.includes(phrase));

    return {
      response: simulateChat(userMessage),
      sadnessDetected,
      crisisDetected,
    };
  }
}

export async function getFunnyCheer() {
  const prompts = [
    "Tell me one short, genuinely funny joke (2-3 sentences max). Make it light-hearted and wholesome.",
    "Share one uplifting funny observation about life in 2-3 sentences. Keep it warm and silly.",
    "Give me a ridiculously wholesome fun fact about animals that would make someone smile. 2 sentences.",
  ];
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  try {
    const result = await api.getAiCheer();
    return result.message;
  } catch {
    return getOfflineCheer();
  }
}

function getOfflineCheer() {
  const cheers = [
    "Why did the scarecrow win an award? Because he was outstanding in his field! Hope that made you smile, even just a little.",
    "Fun fact: otters hold hands while sleeping so they don't drift apart. You are loved just like that.",
    "A day without laughter is a day wasted — and today is NOT wasted because you are here, and that matters.",
    "What do you call a fish without eyes? A fsh! It's okay to laugh — your brain literally releases happy chemicals when you do!",
    "Did you know dogs sneeze to show they are playing and not being aggressive? Even nature wants things to stay chill. Like you will too.",
  ];
  return cheers[Math.floor(Math.random() * cheers.length)];
}

function simulateEmotionAnalysis(text: string, emojis: string[]) {
  const lower = (text || '').toLowerCase();
  const negWords = ['sad', 'bad', 'awful', 'terrible', 'stressed', 'anxious', 'worried', 'scared', 'cry', 'hurt', 'pain', 'angry'];
  const posWords = ['happy', 'great', 'good', 'wonderful', 'excited', 'joy', 'love', 'amazing', 'calm', 'peaceful', 'grateful'];
  const crisisWords = ['hurt myself', 'end it', 'give up', 'hopeless', 'worthless', 'suicide', "can't go on"];

  if (crisisWords.some(w => lower.includes(w))) {
    return { emotion: 'distressed', intensity: 9, sentiment: 'negative', crisisRisk: 'high',
      suggestions: ['Please call 988 now', 'Reach out to someone you trust', 'You are not alone'],
      summary: 'It sounds like you are in serious pain right now — please reach out for help immediately.' };
  }

  const neg = negWords.filter(w => lower.includes(w)).length;
  const pos = posWords.filter(w => lower.includes(w)).length;
  let sentiment = 'neutral', emotion = 'neutral', crisisRisk = 'none', intensity = 5;

  if (neg > pos) {
    sentiment = 'negative'; emotion = neg > 2 ? 'stressed' : 'sad';
    intensity = Math.min(4 + neg * 2, 8); crisisRisk = neg >= 3 ? 'medium' : 'low';
  } else if (pos > neg) {
    sentiment = 'positive'; emotion = pos > 2 ? 'happy' : 'calm';
    intensity = Math.max(8 - pos, 3);
  }

  const suggestions = sentiment === 'positive'
    ? ['Continue your positive momentum with mindfulness', 'Share your good mood with someone close', 'Celebrate this moment mindfully']
    : ['Try a 5-minute deep breathing exercise', 'Write down 3 things you are grateful for', 'Reach out to someone you trust'];

  return { emotion, intensity, sentiment, crisisRisk, suggestions,
    summary: sentiment === 'positive'
      ? 'You seem to be in a positive place — keep nurturing this feeling!'
      : sentiment === 'negative'
        ? 'It sounds like you are going through a tough time. You are not alone.'
        : 'Your mood seems balanced today. Keep checking in with yourself.' };
}

function simulateChat(message: string) {
  const lower = message.toLowerCase();
  if (['hurt myself', 'end it', 'suicide', "can't go on", 'hopeless'].some(w => lower.includes(w)))
    return "I hear that you're in a lot of pain. Please reach out to the 988 Suicide & Crisis Lifeline — call or text 988 now. You deserve support. 💙";
  if (['anxious', 'anxiety', 'panic'].some(w => lower.includes(w)))
    return "Anxiety can feel overwhelming, but you can get through this. Try breathing in for 4 counts, holding for 7, and exhaling for 8. Would you like to try a guided breathing exercise? 🌿";
  if (['sad', 'cry', 'depressed'].some(w => lower.includes(w)))
    return "I'm sorry you're feeling this way — your feelings are completely valid. It won't always feel this heavy. Is there one small thing that usually brings you comfort? 💙";
  if (['stress', 'overwhelm', 'too much'].some(w => lower.includes(w)))
    return "Let's take it one breath at a time. Place your feet flat on the floor and take three slow, deep breaths. You don't have to solve everything today. 🌊";
  if (['happy', 'good', 'great', 'better'].some(w => lower.includes(w)))
    return "That's wonderful! 🌟 Moments of joy are precious — what brought about this positive feeling? Noticing these moments helps us find more of them.";
  const fallbacks = [
    "Thank you for sharing that. I'm here to listen. How are you feeling right now on a scale from 1 to 10? 💙",
    "Your feelings matter and you deserve support. Would you like to try a short calming activity? 🌿",
    "It takes courage to check in with yourself. Tell me more about what's been on your mind. 🌟",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
