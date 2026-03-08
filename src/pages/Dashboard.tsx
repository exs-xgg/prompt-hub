import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Copy, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Prompt {
  id: string;
  title: string;
  platform: string;
  category: string;
  votes: string;
  description: string;
  output: string;
  platformColor: string;
}

const prompts: Prompt[] = [
  {
    id: '1',
    title: 'Clean Code Refactorer',
    platform: 'ChatGPT',
    category: 'Coding',
    votes: '1.2k',
    description: 'Act as a Senior Software Engineer. Review the following code snippet for potential performance bottlenecks, security vulnerabilities, and adherence to SOLID principles. Provide a refactored version that...',
    output: `// Refactored Version\nconst optimizeData = (items) => {\n  return items.reduce((acc, curr) => { ... });\n};`,
    platformColor: 'bg-green-100 text-green-800'
  },
  {
    id: '2',
    title: 'Advanced Technical Writer',
    platform: 'Claude',
    category: 'Creative Writing',
    votes: '842',
    description: 'Use the provided documentation to draft a detailed API guide. The tone should be instructional yet professional. Use markdown formatting for code blocks and ensure that...',
    output: `# API Documentation Guide\n\nWelcome to the developer portal. Follow these steps to authenticate your request...`,
    platformColor: 'bg-purple-100 text-purple-800'
  },
  {
    id: '3',
    title: 'SQL Query Generator',
    platform: 'Copilot',
    category: 'Data Analysis',
    votes: '320',
    description: "Generate a complex SQL query that joins the users, orders, and products tables to find the average order value per user in the 'Electronics' category...",
    output: `SELECT u.name, AVG(o.total_price)\nFROM users u\nJOIN orders o ON u.id = o.user_id ...`,
    platformColor: 'bg-blue-100 text-blue-800'
  }
];

export default function Dashboard() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coding Prompts</h1>
          <p className="text-slate-500 text-sm mt-1">Discover and share high-performing prompts for software development.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Sort by:</span>
          <select className="text-sm border border-slate-200 rounded-lg focus:ring-vault-primary focus:border-vault-primary px-3 py-1.5 outline-none bg-white">
            <option>Trending</option>
            <option>Newest</option>
            <option>Top Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {prompts.map((prompt) => (
          <article key={prompt.id} className="bg-white border border-vault-border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link to={`/prompt/${prompt.id}`}>
                    <h3 className="text-lg font-bold text-slate-900 hover:text-vault-primary cursor-pointer">{prompt.title}</h3>
                  </Link>
                  <div className="flex gap-2 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prompt.platformColor}`}>
                      Best used in: {prompt.platform}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {prompt.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-100">
                  <button className="p-1 hover:text-vault-primary transition-colors cursor-pointer">
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-semibold px-1">{prompt.votes}</span>
                  <button className="p-1 hover:text-red-500 transition-colors cursor-pointer">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative mb-4">
                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                  {prompt.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <button 
                  className="text-sm font-semibold text-vault-primary flex items-center hover:underline cursor-pointer"
                  onClick={() => toggleExpand(prompt.id)}
                >
                  {expandedId === prompt.id ? 'Hide Example Output' : 'View Example Output'}
                  <ChevronRight className={`ml-1 w-4 h-4 transition-transform ${expandedId === prompt.id ? 'rotate-90' : ''}`} />
                </button>
                <div className="flex gap-4">
                  <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="Copy Prompt">
                    <Copy className="w-5 h-5" />
                  </button>
                  <button className="text-slate-400 hover:text-pink-500 transition-colors cursor-pointer" title="Save to Favorites">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {expandedId === prompt.id && (
                <div className="mt-4 p-4 bg-slate-900 rounded-lg text-slate-300 text-xs font-mono whitespace-pre-wrap">
                  {prompt.output}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
          Load More Prompts
        </button>
      </div>
    </div>
  );
}
