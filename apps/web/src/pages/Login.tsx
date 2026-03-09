import React from 'react';
import { Terminal, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 mesh-gradient tech-grid">
      <main className="w-full max-w-md">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl shadow-lg mb-4">
            <Terminal className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">PromptVault</h1>
          <p className="text-slate-500 mt-2 font-medium">Your ultimate AI prompt repository</p>
        </header>

        <section className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">Email Address</label>
              <input 
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-brand-500 focus:ring-brand-500 sm:text-sm outline-none" 
                id="email" 
                name="email" 
                placeholder="name@example.com" 
                required 
                type="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                <a className="text-xs font-medium text-brand-600 hover:text-brand-700" href="#">Forgot password?</a>
              </div>
              <input 
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-brand-500 focus:ring-brand-500 sm:text-sm outline-none" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                type="password"
              />
            </div>

            <button 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors cursor-pointer" 
              type="submit"
            >
              Sign In
            </button>

            <div className="relative py-4">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer" type="button">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.162-1.908 4.162-1.092 1.092-2.8 2.254-5.932 2.254-4.812 0-8.634-3.922-8.634-8.734s3.822-8.734 8.634-8.734c2.59 0 4.6 1.022 5.998 2.344l2.32-2.32C18.43 1.132 15.657 0 12.48 0 6.867 0 2.228 4.59 2.228 10.204s4.639 10.204 10.252 10.204c3.033 0 5.332-1 7.152-2.892 1.848-1.848 2.433-4.43 2.433-6.592 0-.642-.054-1.246-.153-1.8H12.48z" fill="currentColor"></path>
                </svg>
                <span>Google</span>
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer" type="button">
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </button>
            </div>
          </form>
        </section>

        <footer className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? 
          <a className="font-bold text-brand-600 hover:text-brand-700 ml-1" href="#">Create a free vault</a>
        </footer>
      </main>
    </div>
  );
}
