import type { Comment } from "@/lib/types";

export interface HistoryItem {
  id: string;
  date: string;
  postPreview: string;
  postText: string;
  comments: Comment[];
}

export interface SavedComment {
  id: string;
  text: string;
  label: string;
  savedAt: string;
}

export interface UserProfile {
  name: string;
  role: string;
}

const HISTORY_KEY = "wcm_history";
const SAVED_KEY = "wcm_saved";
const PROFILE_KEY = "wcm_profile";

export function getHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveToHistory(item: Omit<HistoryItem, "id" | "date">): void {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  localStorage.setItem(HISTORY_KEY, JSON.stringify([newItem, ...history].slice(0, 50)));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function getSaved(): SavedComment[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveComment(comment: Omit<SavedComment, "id" | "savedAt">): void {
  const saved = getSaved();
  const newItem: SavedComment = {
    ...comment,
    id: Date.now().toString(),
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(SAVED_KEY, JSON.stringify([newItem, ...saved]));
}

export function deleteSaved(id: string): void {
  const saved = getSaved().filter((s) => s.id !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
}

export function getProfile(): UserProfile {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{"name":"","role":""}');
  } catch {
    return { name: "", role: "" };
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
