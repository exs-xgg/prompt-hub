import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPromptsByIds, votePrompt, type PromptListItem } from '../api/client';
import { useFavorites } from '../hooks/useFavorites';
import PromptList from '../components/PromptList';

export default function FavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [prompts, setPrompts] = useState<PromptListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const ids = [...favoriteIds];
    if (ids.length === 0) {
      setPrompts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await getPromptsByIds(ids);
      setPrompts(list);
    } catch {
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  }, [favoriteIds]);

  useEffect(() => {
    load();
  }, [load]);

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

  if (favoriteIds.size === 0 && !loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Favorites</h1>
        <p className="text-slate-500 text-sm mb-6">Prompts you save will appear here.</p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-600">
          <p>You haven&apos;t saved any prompts yet.</p>
          <Link to="/" className="mt-4 inline-block text-vault-primary font-semibold hover:underline">
            Browse prompts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Favorites</h1>
      <p className="text-slate-500 text-sm mb-6">Your saved prompts.</p>
      {loading ? (
        <div className="text-slate-500 text-center py-12">Loading...</div>
      ) : (
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
      )}
    </div>
  );
}
