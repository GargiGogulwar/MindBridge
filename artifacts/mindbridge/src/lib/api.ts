const BASE = `${import.meta.env.BASE_URL}api-server/api`;

async function req(method: string, path: string, body?: any) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw Object.assign(new Error(err.error || `API ${res.status}`), { status: res.status });
  }
  return res.json();
}

export function getUserId(): string {
  let id = localStorage.getItem("mindbridge_uid");
  if (!id) {
    id = `user_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem("mindbridge_uid", id);
  }
  return id;
}

export function setUserId(id: string) {
  localStorage.setItem("mindbridge_uid", id);
}

export const api = {
  createUser: (profile: any) => req("POST", "/users", { userId: getUserId(), ...profile }),
  getUser: () => req("GET", `/users/${getUserId()}`),
  getUserByEmail: (email: string) => req("GET", `/users/by-email/${encodeURIComponent(email)}`),
  updateUser: (data: any) => req("PUT", `/users/${getUserId()}`, data),

  getMoods: () => req("GET", `/moods/${getUserId()}`),
  saveMood: (entry: any) => req("POST", `/moods/${getUserId()}`, entry),
  deleteMood: (id: string) => req("DELETE", `/moods/${getUserId()}/${id}`),
  getMoodStats: () => req("GET", `/moods/${getUserId()}/stats/summary`),

  getSettings: () => req("GET", `/settings/${getUserId()}`),
  saveSettings: (settings: any) => req("PUT", `/settings/${getUserId()}`, settings),

  getAiStatus: () => req("GET", "/ai/status"),
  chatWithAi: (data: any) => req("POST", "/ai/chat", data),
  analyzeMood: (data: any) => req("POST", "/ai/analyze", data),
  getAiCheer: () => req("POST", "/ai/cheer", {}),

  healthz: () => req("GET", "/healthz"),
};
