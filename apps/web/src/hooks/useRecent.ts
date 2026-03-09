import { useState, useCallback } from 'react';

const STORAGE_KEY = 'prompt-hub-recent';
const MAX_RECENT = 50;

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as string[];
    return Array.isArray(arr) ? arr.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecent(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_RECENT)));
  } catch {
    // ignore
  }
}

export function useRecent() {
  const [recentIds, setRecentIds] = useState<string[]>(() => loadRecent());

  const addRecent = useCallback((id: string) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENT);
      saveRecent(next);
      return next;
    });
  }, []);

  return { recentIds, addRecent };
}
