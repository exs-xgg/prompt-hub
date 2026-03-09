import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Heart, Share2, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { getPrompt, votePrompt, type PromptDetail } from '../api/client';
import { useFavorites } from '../hooks/useFavorites';
import { useRecent } from '../hooks/useRecent';
import { useVoterId } from '../hooks/useVoterId';

export default function ViewPrompt() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<PromptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [voting, setVoting] = useState(false);
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { addRecent } = useRecent();
  const voterId = useVoterId();

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getPrompt(id, voterId)
      .then((p) => {
        if (!cancelled && p) {
          setPrompt(p);
          addRecent(id);
        } else if (!cancelled) {
          setError('Prompt not found');
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load prompt');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, addRecent, voterId]);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = async (direction: 'up' | 'down') => {
    if (!id || voting) return;
    setVoting(true);
    try {
      const updated = await votePrompt(id, direction, voterId);
      setPrompt((prev) =>
        prev ? { ...prev, votes: updated.votes, votesCount: updated.votesCount, userVote: updated.userVote } : null
      );
    } finally {
      setVoting(false);
    }
  };

  const handleShare = () => {
    if (typeof navigator.share === 'function' && prompt) {
      navigator.share({
        title: prompt.title,
        text: prompt.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading && !prompt) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-slate-500 text-center py-12">Loading prompt...</div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error || 'Prompt not found'}
        </div>
      </div>
    );
  }

  const categorySlug = prompt.categorySlug ?? prompt.category.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/" className="hover:text-vault-primary">Prompts</Link>
            <span>/</span>
            <Link to={`/category/${categorySlug}`} className="hover:text-vault-primary">
              {prompt.category}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white border border-vault-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{prompt.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prompt.platformColor}`}
                >
                  Best used in: {prompt.platform}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  {prompt.category}
                </span>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  Added {prompt.createdAgo ?? 'recently'}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{prompt.description}</p>
            </div>
            <div className="flex md:flex-col items-center gap-4 md:gap-2">
              <div className="flex md:flex-col items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                <button
                  onClick={() => handleVote('up')}
                  disabled={voting}
                  className={`p-2 transition-colors cursor-pointer rounded-md hover:bg-slate-200 disabled:opacity-50 ${
                    prompt.userVote === 'up' ? 'text-vault-primary' : 'hover:text-vault-primary'
                  }`}
                  title={prompt.userVote === 'up' ? 'Remove vote' : 'Upvote'}
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <span className="text-sm font-bold px-3 py-1 md:py-0">{prompt.votes}</span>
                <button
                  onClick={() => handleVote('down')}
                  disabled={voting}
                  className={`p-2 transition-colors cursor-pointer rounded-md hover:bg-slate-200 disabled:opacity-50 ${
                    prompt.userVote === 'down' ? 'text-red-500' : 'hover:text-red-500'
                  }`}
                  title={prompt.userVote === 'down' ? 'Remove vote' : 'Downvote'}
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(prompt.id)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    favoriteIds.has(prompt.id)
                      ? 'text-pink-500 bg-pink-50'
                      : 'text-slate-400 hover:text-pink-500 hover:bg-pink-50'
                  }`}
                  title="Save to Favorites"
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-slate-400 hover:text-vault-primary hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {prompt.author && (
          <div className="px-6 md:px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
            {prompt.author.avatar ? (
              <img
                alt={prompt.author.name}
                className="h-10 w-10 rounded-full bg-slate-200 object-cover border-2 border-white shadow-sm"
                src={prompt.author.avatar}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                {prompt.author.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-slate-900">{prompt.author.name}</p>
              <p className="text-xs text-slate-500">{prompt.author.role}</p>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">The Prompt</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm font-semibold text-vault-primary hover:text-blue-700 transition-colors cursor-pointer bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>
          <div className="bg-slate-900 rounded-xl p-6 relative group">
            <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
              {prompt.promptText}
            </pre>
          </div>
          {prompt.output && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Example Output</h2>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <pre className="text-slate-700 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                  {prompt.output}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
