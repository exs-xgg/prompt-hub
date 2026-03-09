import { useState } from 'react';

const STORAGE_KEY = 'prompt-hub-voter-id';

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function loadOrCreateVoterId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = genId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return genId();
  }
}

export function useVoterId(): string {
  const [voterId] = useState(() => loadOrCreateVoterId());
  return voterId;
}
