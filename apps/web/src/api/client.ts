const API_BASE = (import.meta.env.VITE_API_URL as string) || '';

export type UserVote = 'up' | 'down' | null;

export interface PromptListItem {
  id: string;
  title: string;
  platform: string;
  category: string;
  categorySlug?: string;
  votes: string;
  votesCount?: number;
  userVote?: UserVote;
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
  voterId?: string;
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
  if (params.voterId) search.set('voterId', params.voterId);
  const res = await fetch(`${API_BASE}/api/prompts?${search.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch prompts');
  return res.json();
}

export async function getPrompt(id: string, voterId?: string): Promise<PromptDetail | null> {
  const search = new URLSearchParams();
  if (voterId) search.set('voterId', voterId);
  const url = `${API_BASE}/api/prompts/${id}${search.toString() ? `?${search.toString()}` : ''}`;
  const res = await fetch(url);
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

export async function votePrompt(
  id: string,
  direction: 'up' | 'down',
  voterId: string
): Promise<PromptDetail> {
  const res = await fetch(`${API_BASE}/api/prompts/${id}/vote`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction, voterId }),
  });
  if (!res.ok) throw new Error('Failed to vote');
  return res.json();
}

export async function getPromptsByIds(ids: string[], voterId?: string): Promise<PromptListItem[]> {
  if (ids.length === 0) return [];
  const search = new URLSearchParams({ ids: ids.join(',') });
  if (voterId) search.set('voterId', voterId);
  const res = await fetch(`${API_BASE}/api/prompts/by-ids?${search.toString()}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.prompts ?? [];
}
