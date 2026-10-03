import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import CopyButton from '../components/CopyButton';

type EscapeMode = 'json' | 'html' | 'url' | 'base64' | 'unicode';

const modeLabels: Record<EscapeMode, string> = {
  json: 'JSON',
  html: 'HTML',
  url: 'URL',
  base64: 'Base64',
  unicode: 'Unicode',
};

function escapeString(text: string, mode: EscapeMode): string {
  switch (mode) {
    case 'json':
      return JSON.stringify(text);
    case 'html':
      return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    case 'url':
      return encodeURIComponent(text);
    case 'base64':
      return btoa(unescape(encodeURIComponent(text)));
    case 'unicode':
      return Array.from(text).map((c) => {
        const code = c.codePointAt(0)!;
        return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : c;
      }).join('');
  }
}

function unescapeString(text: string, mode: EscapeMode): string {
  try {
    switch (mode) {
      case 'json':
        return JSON.parse(text);
      case 'html':
        const doc = new DOMParser().parseFromString(text, 'text/html');
        return doc.body.textContent || '';
      case 'url':
        return decodeURIComponent(text);
      case 'base64':
        return decodeURIComponent(escape(atob(text)));
      case 'unicode':
        return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    }
  } catch {
    return '[Error: invalid input for unescaping]';
  }
}

export default function StringEscape() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<EscapeMode>('json');
  const [direction, setDirection] = useState<'escape' | 'unescape'>('escape');

  const output = useMemo(() => {
    if (!input) return '';
    return direction === 'escape' ? escapeString(input, mode) : unescapeString(input, mode);
  }, [input, mode, direction]);

  return (
    <ToolPage title="String Escape/Unescape" description="Escape and unescape strings for JSON, HTML, URL, Base64, and Unicode">
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-1 bg-bg-secondary border border-border rounded-lg p-1">
          <button
            onClick={() => setDirection('escape')}
            className={`px-4 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
              direction === 'escape' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Escape
          </button>
          <button
            onClick={() => setDirection('unescape')}
            className={`px-4 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
              direction === 'unescape' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Unescape
          </button>
        </div>
        {(Object.keys(modeLabels) as EscapeMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
              mode === m ? 'bg-gold/20 text-gold' : 'bg-bg-secondary border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Input</span>
            <button onClick={() => setInput('')} className="text-xs text-text-muted hover:text-text-primary cursor-pointer">Clear</button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={direction === 'escape' ? 'Text to escape...' : 'Escaped text to decode...'}
            className="w-full h-56 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm resize-none focus:outline-none focus:border-accent font-mono"
          />
        </div>
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">{direction === 'escape' ? 'Escaped' : 'Unescaped'} — {modeLabels[mode]}</span>
            <CopyButton text={output} />
          </div>
          <div className="w-full h-56 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm overflow-auto whitespace-pre-wrap font-mono break-all">
            {output || <span className="text-text-muted">Output will appear here...</span>}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
