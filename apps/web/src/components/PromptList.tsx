import React from 'react';
import { ChevronUp, ChevronDown, Copy, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PromptListItem } from '../api/client';

interface PromptListProps {
  prompts: PromptListItem[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onVote: (id: string, direction: 'up' | 'down') => void;
  onCopy: (promptText: string) => void;
  onToggleFavorite: (id: string) => void;
  favoriteIds: Set<string>;
  votingId: string | null;
}

export default function PromptList({
  prompts,
  expandedId,
  onToggleExpand,
  onVote,
  onCopy,
  onToggleFavorite,
  favoriteIds,
  votingId,
}: PromptListProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {prompts.map((prompt) => (
        <article
          key={prompt.id}
          className="bg-white border border-vault-border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Link to={`/prompt/${prompt.id}`}>
                  <h3 className="text-lg font-bold text-slate-900 hover:text-vault-primary cursor-pointer">
                    {prompt.title}
                  </h3>
                </Link>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prompt.platformColor}`}
                  >
                    Best used in: {prompt.platform}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {prompt.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-100">
                <button
                  onClick={() => onVote(prompt.id, 'up')}
                  disabled={votingId !== null}
                  className={`p-1 transition-colors cursor-pointer disabled:opacity-50 ${
                    prompt.userVote === 'up' ? 'text-vault-primary' : 'hover:text-vault-primary'
                  }`}
                  title={prompt.userVote === 'up' ? 'Remove vote' : 'Upvote'}
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold px-1">{prompt.votes}</span>
                <button
                  onClick={() => onVote(prompt.id, 'down')}
                  disabled={votingId !== null}
                  className={`p-1 transition-colors cursor-pointer disabled:opacity-50 ${
                    prompt.userVote === 'down' ? 'text-red-500' : 'hover:text-red-500'
                  }`}
                  title={prompt.userVote === 'down' ? 'Remove vote' : 'Downvote'}
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative mb-4">
              <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">{prompt.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <button
                className="text-sm font-semibold text-vault-primary flex items-center hover:underline cursor-pointer"
                onClick={() => onToggleExpand(prompt.id)}
              >
                {expandedId === prompt.id ? 'Hide Example Output' : 'View Example Output'}
                <ChevronRight
                  className={`ml-1 w-4 h-4 transition-transform ${expandedId === prompt.id ? 'rotate-90' : ''}`}
                />
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() => onCopy(prompt.promptText)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title="Copy Prompt"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onToggleFavorite(prompt.id)}
                  className={`transition-colors cursor-pointer ${
                    favoriteIds.has(prompt.id) ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'
                  }`}
                  title="Save to Favorites"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
            {expandedId === prompt.id && (
              <div className="mt-4 p-4 bg-slate-900 rounded-lg text-slate-300 text-xs font-mono whitespace-pre-wrap">
                {prompt.output || 'No example output.'}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
