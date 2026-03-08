import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Heart, Share2, MessageSquare, ChevronUp, ChevronDown, Check } from 'lucide-react';

// Mock data - in a real app this would come from an API based on the ID
const mockPrompt = {
  id: '1',
  title: 'Clean Code Refactorer',
  platform: 'ChatGPT',
  category: 'Coding',
  votes: '1.2k',
  description: 'Act as a Senior Software Engineer. Review the following code snippet for potential performance bottlenecks, security vulnerabilities, and adherence to SOLID principles. Provide a refactored version that improves readability and maintainability without changing the core functionality.',
  promptText: `Act as a Senior Software Engineer. Review the following code snippet for potential performance bottlenecks, security vulnerabilities, and adherence to SOLID principles. 

Provide a refactored version that improves readability and maintainability without changing the core functionality.

Please structure your response as follows:
1. **Analysis**: Briefly explain the issues found.
2. **Refactored Code**: Provide the complete refactored code block.
3. **Explanation**: Explain why the changes were made.

Code to review:
\`\`\`[language]
[paste your code here]
\`\`\``,
  output: `// Refactored Version
const optimizeData = (items) => {
  if (!items || !items.length) return [];
  
  return items.reduce((acc, curr) => { 
    // Optimized processing logic
    if (curr.isValid) {
      acc.push(transform(curr));
    }
    return acc;
  }, []);
};`,
  platformColor: 'bg-green-100 text-green-800',
  author: {
    name: 'Alex Rivera',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK566JG9QijWnMZHApk4XHEn43_BHoYtgj7bUOpreC6kPYaEvhW1j__U_RvLakJ9gt_fFQw16l-mpf4ohbtj3Uenc8mppTfZvF32vcrfyvWMVat7OjFSD3uT1DbwAF53EWN8ZLksTJyj2p5vIFz5zDvkpqre8D2QWCBujlVwvQsWEolZoU2q0uMBN_fBeMV831Mh_aOnkZlSPxWE8DoOQ0dLU1gPOr5ECXiFjjgDhkroCJ9m_QuTeOjrf0XDDEikO5ZNqcYc5j8XM',
    role: 'Pro Member'
  },
  createdAt: '2 days ago'
};

export default function ViewPrompt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // In a real app, fetch the prompt using the id
  const prompt = mockPrompt;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/" className="hover:text-vault-primary">Prompts</Link>
            <span>/</span>
            <Link to={`/category/${prompt.category.toLowerCase()}`} className="hover:text-vault-primary">{prompt.category}</Link>
          </div>
        </div>
      </div>

      <div className="bg-white border border-vault-border rounded-xl shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{prompt.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prompt.platformColor}`}>
                  Best used in: {prompt.platform}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  {prompt.category}
                </span>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  Added {prompt.createdAt}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed">
                {prompt.description}
              </p>
            </div>

            {/* Voting & Actions */}
            <div className="flex md:flex-col items-center gap-4 md:gap-2">
              <div className="flex md:flex-col items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                <button className="p-2 hover:text-vault-primary transition-colors cursor-pointer rounded-md hover:bg-slate-200">
                  <ChevronUp className="w-5 h-5" />
                </button>
                <span className="text-sm font-bold px-3 py-1 md:py-0">{prompt.votes}</span>
                <button className="p-2 hover:text-red-500 transition-colors cursor-pointer rounded-md hover:bg-slate-200">
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer" title="Save to Favorites">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-vault-primary hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Author Info */}
        <div className="px-6 md:px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              alt={prompt.author.name} 
              className="h-10 w-10 rounded-full bg-slate-200 object-cover border-2 border-white shadow-sm" 
              src={prompt.author.avatar}
            />
            <div>
              <p className="text-sm font-bold text-slate-900">{prompt.author.name}</p>
              <p className="text-xs text-slate-500">{prompt.author.role}</p>
            </div>
          </div>
          <button className="text-sm font-semibold text-vault-primary hover:text-blue-700 transition-colors cursor-pointer">
            View Profile
          </button>
        </div>

        {/* Prompt Content */}
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

          {/* Example Output */}
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
