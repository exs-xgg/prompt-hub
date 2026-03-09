import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getPrompts, votePrompt, type PromptListItem } from '../api/client';
import { useFavorites } from '../hooks/useFavorites';
import { useVoterId } from '../hooks/useVoterId';
import PromptList from '../components/PromptList';

const CATEGORY_MAP: Record<string, string> = {
  writing: 'Creative Writing',
  coding: 'Coding',
  data: 'Data Analysis',
  productivity: 'Productivity',
  other: 'Other',
};

const PAGE_SIZE = 10;

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = categorySlug ? CATEGORY_MAP[categorySlug] ?? categorySlug : '';
  const [prompts, setPrompts] = useState<PromptListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);
  const { favoriteIds, toggleFavorite } = useFavorites();
  const voterId = useVoterId();

  const loadPage = useCallback(
    async (pageNum: number, append: boolean) => {
      if (!category) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getPrompts({
          category: categorySlug ?? '',
          page: pageNum,
          limit: PAGE_SIZE,
          sort: 'newest',
          voterId,
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
    [category, categorySlug, voterId]
  );

  useEffect(() => {
    if (category) loadPage(1, false);
  }, [category, loadPage]);

  const handleVote = async (id: string, direction: 'up' | 'down') => {
    if (votingId) return;
    setVotingId(id);
    try {
      const updated = await votePrompt(id, direction, voterId);
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, votes: updated.votes, votesCount: updated.votesCount, userVote: updated.userVote }
            : p
        )
      );
    } finally {
      setVotingId(null);
    }
  };

  const hasMore = prompts.length < total;

  const title = category || 'Category';
  const description = `Prompts in ${title}.`;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{title} Prompts</h1>
        <p className="text-slate-500 text-sm mt-1">{description}</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && prompts.length === 0 ? (
        <div className="text-slate-500 text-center py-12">Loading prompts...</div>
      ) : (
        <>
          <PromptList
            prompts={prompts}
            expandedId={expandedId}
            onToggleExpand={(id) => setExpandedId((prev) => (prev === id ? null : id))}
            onVote={handleVote}
            onCopy={(text) => navigator.clipboard.writeText(text)}
            onToggleFavorite={toggleFavorite}
            favoriteIds={favoriteIds}
            votingId={votingId}
          />
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => {
                  const next = page + 1;
                  setPage(next);
                  loadPage(next, true);
                }}
                disabled={loading}
                className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Prompts'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
