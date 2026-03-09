import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPrompts, votePrompt, type PromptListItem } from '../api/client';
import { useFavorites } from '../hooks/useFavorites';
import PromptList from '../components/PromptList';

const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'top', label: 'Top Rated' },
] as const;

const PAGE_SIZE = 10;

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [prompts, setPrompts] = useState<PromptListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string>('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);
  const { favoriteIds, toggleFavorite } = useFavorites();

  const loadPage = useCallback(
    async (pageNum: number, append: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPrompts({
          page: pageNum,
          limit: PAGE_SIZE,
          sort,
          q: q.trim() || undefined,
        });
        if (append) {
          setPrompts((prev) => [...prev, ...data.prompts]);
        } else {
          setPrompts(data.prompts);
        }
        setTotal(data.total);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load prompts');
        if (!append) setPrompts([]);
      } finally {
        setLoading(false);
      }
    },
    [sort, q]
  );

  useEffect(() => {
    setPage(1);
    loadPage(1, false);
  }, [sort, q, loadPage]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    loadPage(next, true);
  };

  const handleVote = async (id: string, direction: 'up' | 'down') => {
    if (votingId) return;
    setVotingId(id);
    try {
      const updated = await votePrompt(id, direction);
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, votes: updated.votes, votesCount: updated.votesCount } : p))
      );
    } finally {
      setVotingId(null);
    }
  };

  const handleCopy = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const hasMore = prompts.length < total;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coding Prompts</h1>
          <p className="text-slate-500 text-sm mt-1">Discover and share high-performing prompts for software development.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-slate-200 rounded-lg focus:ring-vault-primary focus:border-vault-primary px-3 py-1.5 outline-none bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && prompts.length === 0 ? (
        <div className="text-slate-500 text-center py-12">Loading prompts...</div>
      ) : (
        <PromptList
          prompts={prompts}
          expandedId={expandedId}
          onToggleExpand={(id) => setExpandedId((prev) => (prev === id ? null : id))}
          onVote={handleVote}
          onCopy={handleCopy}
          onToggleFavorite={toggleFavorite}
          favoriteIds={favoriteIds}
          votingId={votingId}
        />
      )}

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Prompts'}
          </button>
        </div>
      )}
    </div>
  );
}
