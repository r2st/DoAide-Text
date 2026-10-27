import { Link, Outlet, useLocation } from 'react-router-dom';
import { tools } from '../utils/tools';
import { useState } from 'react';
import useSEO from '../hooks/useSEO';

export default function Layout() {
  const location = useLocation();
  useSEO(location.pathname.replace(/\/+$/, '') || '/');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-bg-secondary border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-xl font-bold text-accent">DoAide</span>
            <span className="text-xl text-text-muted font-light">|</span>
            <span className="text-xl font-bold text-text-primary">Text</span>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {tools.slice(0, 6).map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className={`px-3 py-1.5 rounded-md text-sm no-underline transition-colors ${
                  location.pathname === tool.path
                    ? 'bg-accent/15 text-accent-hover'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                }`}
              >
                {tool.name}
              </Link>
            ))}
            <div className="relative group">
              <button className="px-3 py-1.5 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary cursor-pointer">
                More ▾
              </button>
              <div className="absolute right-0 top-full mt-1 bg-bg-secondary border border-border rounded-lg shadow-xl py-2 w-56 hidden group-hover:block">
                {tools.slice(6).map((tool) => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className={`block px-4 py-2 text-sm no-underline ${
                      location.pathname === tool.path
                        ? 'bg-accent/15 text-accent-hover'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                    }`}
                  >
                    <span className="mr-2">{tool.icon}</span>
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-border bg-bg-secondary px-4 py-2 max-h-[70vh] overflow-y-auto">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm no-underline ${
                  location.pathname === tool.path
                    ? 'bg-accent/15 text-accent-hover'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="mr-2">{tool.icon}</span>
                {tool.name}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-bg-secondary border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <Link to="/" className="flex items-center gap-2 no-underline">
                <span className="text-sm font-bold text-accent">DoAide</span>
                <span className="text-sm text-text-muted font-light">|</span>
                <span className="text-sm font-bold text-text-primary">Text</span>
              </Link>
              <p className="text-text-muted text-xs">
                Free text tools. No login. All processing in your browser.
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-3">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-text-secondary">
                <a href="https://doaide.com" className="hover:text-accent no-underline transition-colors">DoAide Home</a>
                <a href="https://json.doaide.com" className="hover:text-accent no-underline transition-colors">JSON Tools</a>
                <a href="https://image.doaide.com" className="hover:text-accent no-underline transition-colors">Image Tools</a>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-bg-tertiary px-3 py-1 rounded-full">
                A <a href="https://doaide.com" className="text-accent font-semibold no-underline hover:text-accent-hover transition-colors">DoAide</a> Product
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
