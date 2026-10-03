import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import CopyButton from '../components/CopyButton';

export default function FindReplace() {
  const [input, setInput] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [globalMatch, setGlobalMatch] = useState(true);

  const { output, matchCount, error } = useMemo(() => {
    if (!find || !input) return { output: input, matchCount: 0, error: '' };
    try {
      if (useRegex) {
        const flags = (globalMatch ? 'g' : '') + (caseSensitive ? '' : 'i');
        const regex = new RegExp(find, flags);
        const matches = input.match(new RegExp(find, 'g' + (caseSensitive ? '' : 'i')));
        return { output: input.replace(regex, replace), matchCount: matches?.length || 0, error: '' };
      } else {
        const flags = caseSensitive ? '' : 'i';
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, (globalMatch ? 'g' : '') + flags);
        const matches = input.match(new RegExp(escaped, 'g' + flags));
        return { output: input.replace(regex, replace), matchCount: matches?.length || 0, error: '' };
      }
    } catch (e) {
      return { output: input, matchCount: 0, error: (e as Error).message };
    }
  }, [input, find, replace, useRegex, caseSensitive, globalMatch]);

  const highlighted = useMemo(() => {
    if (!find || !input) return null;
    try {
      const flags = 'g' + (caseSensitive ? '' : 'i');
      const pattern = useRegex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${pattern})`, flags);
      const parts = input.split(regex);
      return parts.map((part, i) => (
        regex.test(part) ? <mark key={i} className="bg-warning/30 text-warning rounded px-0.5">{part}</mark> : part
      ));
    } catch {
      return null;
    }
  }, [input, find, useRegex, caseSensitive]);

  return (
    <ToolPage title="Find & Replace" description="Find and replace text with full regex support">
      <div className="bg-bg-secondary border border-border rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Find</label>
            <input
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder={useRegex ? 'Regular expression...' : 'Text to find...'}
              className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent font-mono"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Replace with</label>
            <input
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Replacement text..."
              className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent font-mono"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} className="accent-accent" />
            Regex
          </label>
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="accent-accent" />
            Case sensitive
          </label>
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input type="checkbox" checked={globalMatch} onChange={(e) => setGlobalMatch(e.target.checked)} className="accent-accent" />
            Replace all
          </label>
          {matchCount > 0 && <span className="text-sm text-gold">{matchCount} match{matchCount !== 1 ? 'es' : ''}</span>}
          {error && <span className="text-sm text-error">{error}</span>}
        </div>
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
            placeholder="Type or paste text here..."
            className="w-full h-56 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm resize-none focus:outline-none focus:border-accent font-mono"
          />
          {highlighted && (
            <div className="mt-3">
              <span className="text-xs text-text-muted block mb-1">Matches highlighted:</span>
              <div className="bg-bg-tertiary rounded-lg p-3 text-sm max-h-32 overflow-auto whitespace-pre-wrap font-mono text-text-primary">
                {highlighted}
              </div>
            </div>
          )}
        </div>
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Result</span>
            <CopyButton text={output} />
          </div>
          <div className="w-full h-56 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm overflow-auto whitespace-pre-wrap font-mono">
            {output || <span className="text-text-muted">Result will appear here...</span>}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
