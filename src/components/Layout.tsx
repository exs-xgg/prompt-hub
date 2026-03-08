import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Lock, Home, PenTool, Code, BarChart2, Zap, Heart, Clock } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: 'All Prompts', icon: Home, path: '/', activeColor: 'bg-blue-50 text-vault-primary' },
    { name: 'Creative Writing', icon: PenTool, path: '/category/writing' },
    { name: 'Coding', icon: Code, path: '/category/coding' },
    { name: 'Data Analysis', icon: BarChart2, path: '/category/data' },
    { name: 'Productivity', icon: Zap, path: '/category/productivity' },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-vault-border h-16 flex items-center px-6 justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-vault-primary rounded-lg flex items-center justify-center">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">PromptVault</span>
        </Link>

        <div className="flex-1 max-w-2xl px-8 hidden md:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </span>
            <input 
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full bg-slate-100 focus:bg-white focus:ring-2 focus:ring-vault-primary focus:border-transparent transition-all sm:text-sm outline-none" 
              placeholder="Search prompts for coding, writing, or analysis..." 
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-vault-primary hidden sm:block">Log In</Link>
          <Link to="/create" className="bg-vault-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            Create Prompt
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-vault-border hidden md:flex flex-col">
          <nav className="p-4 space-y-1 overflow-y-auto flex-1">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/' && location.pathname.startsWith('/category'));
              return (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
                    isActive 
                      ? 'bg-blue-50 text-vault-primary' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? '' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-8">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">My Vault</p>
              <Link to="/favorites" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 group">
                <Heart className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                Favorites
              </Link>
              <Link to="/recent" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 group">
                <Clock className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                Recent
              </Link>
            </div>
          </nav>

          <div className="p-4 border-t border-vault-border">
            <div className="flex items-center gap-3">
              <img 
                alt="User avatar" 
                className="h-8 w-8 rounded-full bg-slate-200 object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK566JG9QijWnMZHApk4XHEn43_BHoYtgj7bUOpreC6kPYaEvhW1j__U_RvLakJ9gt_fFQw16l-mpf4ohbtj3Uenc8mppTfZvF32vcrfyvWMVat7OjFSD3uT1DbwAF53EWN8ZLksTJyj2p5vIFz5zDvkpqre8D2QWCBujlVwvQsWEolZoU2q0uMBN_fBeMV831Mh_aOnkZlSPxWE8DoOQ0dLU1gPOr5ECXiFjjgDhkroCJ9m_QuTeOjrf0XDDEikO5ZNqcYc5j8XM"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Alex Rivera</p>
                <p className="text-xs text-slate-500 truncate">Pro Member</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
