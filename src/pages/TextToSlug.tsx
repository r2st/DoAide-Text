import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import CopyButton from '../components/CopyButton';

function toSlug(text: string, separator: string, lowercase: boolean, maxLength: number): string {
  let slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, separator)
    .replace(new RegExp(`[${separator.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}]+`, 'g'), separator)
    .replace(new RegExp(`^${separator.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}+|${separator.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}+$`, 'g'), '');
  if (lowercase) slug = slug.toLowerCase();
  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(new RegExp(`${separator.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}+$`), '');
  }
  return slug;
}

export default function TextToSlug() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(0);

  const output = useMemo(() => {
    return input.split('\n').map((line) => toSlug(line, separator, lowercase, maxLength)).join('\n');
  }, [input, separator, lowercase, maxLength]);

  return (
    <ToolPage title="Text to Slug" description="Convert text to URL-friendly slugs">
      <div className="bg-bg-secondary border border-border rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-xs text-text-muted mb-1">Separator</label>
            <div className="flex gap-2">
              {['-', '_', '.'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSeparator(s)}
                  className={`w-10 h-8 rounded text-sm font-mono cursor-pointer transition-colors ${
                    separator === s ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary border border-border'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} className="accent-accent" />
            Lowercase
          </label>
          <div>
            <label className="block text-xs text-text-muted mb-1">Max length (0 = unlimited)</label>
            <input
              type="number"
              min={0}
              max={500}
              value={maxLength}
              onChange={(e) => setMaxLength(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-24 bg-bg-tertiary border border-border rounded-md px-3 py-1.5 text-text-primary text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <span className="text-sm text-text-secondary block mb-3">Input (one per line for batch)</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="My Blog Post Title&#10;Another Article Name&#10;Product Feature Update"
            className="w-full h-56 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm resize-none focus:outline-none focus:border-accent"
          />
        </div>
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Slugs</span>
            <CopyButton text={output} />
          </div>
          <div className="w-full h-56 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm overflow-auto whitespace-pre-wrap font-mono text-gold">
            {output || <span className="text-text-muted">Slugs will appear here...</span>}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
