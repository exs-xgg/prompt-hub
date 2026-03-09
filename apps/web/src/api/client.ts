const API_BASE = (import.meta.env.VITE_API_URL as string) || '';

export interface PromptListItem {
  id: string;
  title: string;
  platform: string;
  category: string;
  categorySlug?: string;
  votes: string;
  votesCount?: number;
  description: string;
  promptText: string;
  output: string;
  platformColor: string;
  author?: { name: string; avatar: string; role: string };
  createdAt?: string;
  createdAgo?: string;
}

export interface PromptDetail extends PromptListItem {
  createdAgo: string;
}

export interface ListParams {
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  q?: string;
}

export interface ListResponse {
  prompts: PromptListItem[];
  total: number;
  page: number;
  limit: number;
}

export async function getPrompts(params: ListParams = {}): Promise<ListResponse> {
  const search = new URLSearchParams();
  if (params.category) search.set('category', params.category);
  if (params.sort) search.set('sort', params.sort);
  if (params.page != null) search.set('page', String(params.page));
  if (params.limit != null) search.set('limit', String(params.limit));
  if (params.q) search.set('q', params.q);
  const res = await fetch(`${API_BASE}/api/prompts?${search.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch prompts');
  return res.json();
}

export async function getPrompt(id: string): Promise<PromptDetail | null> {
  const res = await fetch(`${API_BASE}/api/prompts/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch prompt');
  return res.json();
}

export interface CreatePromptPayload {
  title: string;
  category: string;
  platform: string;
  description: string;
  promptText: string;
  exampleOutput?: string;
}

export async function createPrompt(payload: CreatePromptPayload): Promise<PromptDetail> {
  const res = await fetch(`${API_BASE}/api/prompts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create prompt');
  }
  return res.json();
}

export async function votePrompt(id: string, direction: 'up' | 'down'): Promise<PromptDetail> {
  const res = await fetch(`${API_BASE}/api/prompts/${id}/vote`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction }),
  });
  if (!res.ok) throw new Error('Failed to vote');
  return res.json();
}

export async function getPromptsByIds(ids: string[]): Promise<PromptListItem[]> {
  if (ids.length === 0) return [];
  const search = new URLSearchParams({ ids: ids.join(',') });
  const res = await fetch(`${API_BASE}/api/prompts/by-ids?${search.toString()}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.prompts ?? [];
}
