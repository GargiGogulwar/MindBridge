import { api, getUserId, setUserId } from './api';

const MOODS_KEY = 'mindbridge_moods';
const USER_KEY = 'mindbridge_user';
const SETTINGS_KEY = 'mindbridge_settings';
const AUTH_KEY = 'mindbridge_auth';
const LOCAL_PROFILE_KEY = 'mindbridge_local_profile';

export function getAuthUser() {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function loginUser(profile: any) {
  const auth = { ...profile, loggedInAt: new Date().toISOString() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
  saveUser({ name: profile.name, avatar: profile.avatar, streak: profile.streak ?? 0, lastCheckin: profile.lastCheckin ?? null, role: profile.role });
  api.createUser({ name: profile.name, avatar: profile.avatar, role: profile.role, email: profile.email || '' }).catch(() => {});
  return auth;
}

export async function signInWithEmail(email: string): Promise<any | null> {
  const normalizedEmail = email.toLowerCase().trim();
  const signInLocally = () => {
    try {
      const profile = JSON.parse(localStorage.getItem(LOCAL_PROFILE_KEY) || 'null');
      if (profile?.email?.toLowerCase().trim() !== normalizedEmail) return null;
      const auth = { ...profile, loggedInAt: new Date().toISOString() };
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      saveUser({ name: profile.name, avatar: profile.avatar, streak: profile.streak ?? 0, lastCheckin: profile.lastCheckin ?? null, role: profile.role });
      return auth;
    } catch {
      return null;
    }
  };

  try {
    const user = await api.getUserByEmail(normalizedEmail);
    if (user && user.userId) {
      setUserId(user.userId);
      const auth = { name: user.name, avatar: user.avatar, role: user.role, email: user.email, loggedInAt: new Date().toISOString() };
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(auth));
      saveUser({ name: user.name, avatar: user.avatar, streak: user.streak ?? 0, lastCheckin: user.lastCheckin ?? null, role: user.role });
      return auth;
    }
    return signInLocally();
  } catch (err: any) {
    if (err?.status === 404) return signInLocally();
    const localProfile = signInLocally();
    if (localProfile) return localProfile;
    throw err;
  }
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
}

export function getMoods() {
  try {
    const data = localStorage.getItem(MOODS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function setMoodsLocal(moods: any[]) {
  localStorage.setItem(MOODS_KEY, JSON.stringify(moods.slice(0, 100)));
}

export async function getMoodsAsync(): Promise<any[]> {
  try {
    const remote = await api.getMoods();
    if (remote && Array.isArray(remote)) {
      const normalized = remote.map((m: any) => ({ ...m, id: m._id || m.id }));
      setMoodsLocal(normalized);
      return normalized;
    }
  } catch {
    // Keep the app usable from its local copy while the API/database is unavailable.
  }
  return getMoods();
}

export async function saveMoodAsync(entry: any): Promise<any> {
  const newEntry = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...entry };
  const moods = getMoods();
  moods.unshift(newEntry);
  setMoodsLocal(moods);

  try {
    const remote = await api.saveMood(entry);
    if (remote && remote._id) {
      const updated = getMoods().map((m: any) => m.id === newEntry.id ? { ...remote, id: remote._id } : m);
      setMoodsLocal(updated);
      return { ...remote, id: remote._id };
    }
  } catch {
    // The local entry is already saved; a failed sync must not discard it.
  }
  return newEntry;
}

export function saveMood(entry: any) {
  const moods = getMoods();
  const newEntry = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...entry };
  moods.unshift(newEntry);
  setMoodsLocal(moods);
  api.saveMood(entry).catch(() => {});
  return newEntry;
}

export async function deleteMoodAsync(id: string): Promise<void> {
  const moods = getMoods().filter((m: any) => m.id !== id && m._id !== id);
  setMoodsLocal(moods);
  await api.deleteMood(id).catch(() => {});
}

export function deleteMood(id: string) {
  const moods = getMoods().filter((m: any) => m.id !== id);
  setMoodsLocal(moods);
  api.deleteMood(id).catch(() => {});
}

export function getUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : { name: 'User', streak: 0, lastCheckin: null };
  } catch { return { name: 'User', streak: 0, lastCheckin: null }; }
}

export function saveUser(user: any) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUserAsync(): Promise<any> {
  try {
    const remote = await api.getUser();
    if (remote && remote.userId) {
      saveUser(remote);
      return remote;
    }
  } catch {
    // Fall back to the profile already stored in this browser.
  }
  return getUser();
}

export function updateStreak() {
  const user = getUser();
  const today = new Date().toDateString();
  if (user.lastCheckin !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = user.lastCheckin === yesterday.toDateString();
    user.streak = wasYesterday ? (user.streak || 0) + 1 : 1;
    user.lastCheckin = today;
    saveUser(user);
    api.updateUser({ streak: user.streak, lastCheckin: today }).catch(() => {});
  }
  return user;
}

export function getSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { notifications: true, caregiverEmail: '', userName: 'User', theme: 'dark' };
  } catch { return { notifications: true, caregiverEmail: '', userName: 'User', theme: 'dark' }; }
}

export function saveSettings(settings: any) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  api.saveSettings(settings).catch(() => {});
}

export async function getSettingsAsync(): Promise<any> {
  try {
    const remote = await api.getSettings();
    if (remote && remote.userId) {
      const s = { notifications: remote.notifications, caregiverEmail: remote.caregiverEmail, userName: remote.userName, theme: remote.theme };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
      return s;
    }
  } catch {
    // Fall back to local settings while the API/database is unavailable.
  }
  return getSettings();
}

export function getMoodStats() {
  const moods = getMoods();
  if (!moods.length) return null;

  const emotionCounts: Record<string, number> = {};
  let totalIntensity = 0;

  moods.forEach((m: any) => {
    emotionCounts[m.emotion] = (emotionCounts[m.emotion] || 0) + 1;
    totalIntensity += m.intensity || 5;
  });

  const avgIntensity = Math.round(totalIntensity / moods.length);
  const dominantEmotion = Object.entries(emotionCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0];

  const dailyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toDateString();
    const dayMoods = moods.filter((m: any) => new Date(m.timestamp).toDateString() === dayStr);
    const avgDay = dayMoods.length
      ? Math.round(dayMoods.reduce((acc: number, m: any) => acc + (m.intensity || 5), 0) / dayMoods.length)
      : null;
    dailyData.push({ day: d.toLocaleDateString('en', { weekday: 'short' }), intensity: avgDay, count: dayMoods.length });
  }

  return { avgIntensity, dominantEmotion, emotionCounts, dailyData, total: moods.length, last7: moods.slice(0, 7) };
}

export async function getMoodStatsAsync(): Promise<any> {
  try {
    const remote = await api.getMoodStats();
    if (remote) return remote;
  } catch {
    // Derive analytics from the locally saved mood entries.
  }
  return getMoodStats();
}

export function seedDemoData() {
  const moods = getMoods();
  if (moods.length > 0) return;

  const emotions = ['happy', 'calm', 'anxious', 'sad', 'stressed', 'excited', 'neutral'];
  const texts = [
    'Feeling good today, had a productive morning!',
    'A bit anxious about the upcoming exam',
    'Really calm and peaceful after meditation',
    'Stressed from work, need a break',
    'Excited about the weekend plans',
    'Feeling a little low today',
    'Just checking in, feeling okay',
  ];

  const demo = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(10 + Math.floor(Math.random() * 8));
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    demo.push({
      id: `demo-${i}`,
      timestamp: d.toISOString(),
      text: texts[Math.floor(Math.random() * texts.length)],
      emojis: [],
      emotion,
      intensity: Math.floor(Math.random() * 5) + 4,
      sentiment: ['happy', 'calm', 'excited'].includes(emotion) ? 'positive' : emotion === 'neutral' ? 'neutral' : 'negative',
      crisisRisk: 'none',
      suggestions: ['Try a breathing exercise', 'Journal your thoughts', 'Take a short walk'],
      summary: 'Demo mood entry',
    });
  }

  setMoodsLocal(demo);
}

export { getUserId };
