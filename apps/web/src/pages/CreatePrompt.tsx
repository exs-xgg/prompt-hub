import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPrompt } from '../api/client';

export default function CreatePrompt() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Coding',
    platform: 'ChatGPT',
    description: '',
    promptText: '',
    exampleOutput: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const created = await createPrompt({
        title: formData.title.trim(),
        category: formData.category,
        platform: formData.platform,
        description: formData.description.trim(),
        promptText: formData.promptText.trim(),
        exampleOutput: formData.exampleOutput.trim() || undefined,
      });
      navigate(`/prompt/${created.id}`, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create prompt');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Prompt</h1>
          <p className="text-slate-500 text-sm mt-1">Share your best prompt with the community.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-vault-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                Prompt Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-vault-primary focus:ring-1 focus:ring-vault-primary sm:text-sm outline-none transition-shadow"
                placeholder="e.g., Clean Code Refactorer"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-vault-primary focus:ring-1 focus:ring-vault-primary sm:text-sm outline-none transition-shadow bg-white"
              >
                <option value="Coding">Coding</option>
                <option value="Creative Writing">Creative Writing</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Productivity">Productivity</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="platform" className="block text-sm font-semibold text-slate-700 mb-2">
                Best Used In
              </label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-vault-primary focus:ring-1 focus:ring-vault-primary sm:text-sm outline-none transition-shadow bg-white"
              >
                <option value="ChatGPT">ChatGPT</option>
                <option value="Claude">Claude</option>
                <option value="Copilot">Copilot</option>
                <option value="Gemini">Gemini</option>
                <option value="Midjourney">Midjourney</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                Short Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-vault-primary focus:ring-1 focus:ring-vault-primary sm:text-sm outline-none transition-shadow"
                placeholder="Briefly describe what this prompt does..."
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="promptText" className="block text-sm font-semibold text-slate-700 mb-2">
                The Prompt
              </label>
              <textarea
                id="promptText"
                name="promptText"
                value={formData.promptText}
                onChange={handleChange}
                rows={6}
                className="block w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 focus:border-vault-primary focus:ring-1 focus:ring-vault-primary sm:text-sm outline-none transition-shadow font-mono text-sm resize-y"
                placeholder="Act as a Senior Software Engineer..."
                required
              />
              <p className="mt-2 text-xs text-slate-500">Tip: Use [brackets] for variables users should replace.</p>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="exampleOutput" className="block text-sm font-semibold text-slate-700 mb-2">
                Example Output (Optional)
              </label>
              <textarea
                id="exampleOutput"
                name="exampleOutput"
                value={formData.exampleOutput}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 focus:border-vault-primary focus:ring-1 focus:ring-vault-primary sm:text-sm outline-none transition-shadow font-mono text-sm resize-y bg-slate-50"
                placeholder="Paste an example of what the AI generates..."
              />
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-vault-border flex items-center justify-end gap-3">
          <Link
            to="/"
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-vault-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Publishing...' : 'Publish Prompt'}
          </button>
        </div>
      </form>
    </div>
  );
}
