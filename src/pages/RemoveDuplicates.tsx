import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import CopyButton from '../components/CopyButton';

export default function RemoveDuplicates() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);

  const { output, stats } = useMemo(() => {
    const lines = input.split('\n');
    const seen = new Set<string>();
    const result: string[] = [];
    let duplicates = 0;
    let empties = 0;

    for (const line of lines) {
      const processed = trimLines ? line.trim() : line;
      if (removeEmpty && processed === '') {
        empties++;
        continue;
      }
      const key = caseSensitive ? processed : processed.toLowerCase();
      if (seen.has(key)) {
        duplicates++;
      } else {
        seen.add(key);
        result.push(processed);
      }
    }
    return { output: result.join('\n'), stats: { total: lines.length, unique: result.length, duplicates, empties } };
  }, [input, caseSensitive, trimLines, removeEmpty]);

  return (
    <ToolPage title="Remove Duplicates" description="Remove duplicate lines from text">
      <div className="flex flex-wrap gap-4 mb-6">
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="accent-accent" />
          Case sensitive
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} className="accent-accent" />
          Trim whitespace
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input type="checkbox" checked={removeEmpty} onChange={(e) => setRemoveEmpty(e.target.checked)} className="accent-accent" />
          Remove empty lines
        </label>
      </div>

      {input && (
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="text-sm text-text-muted">Total: {stats.total}</span>
          <span className="text-sm text-success">Unique: {stats.unique}</span>
          <span className="text-sm text-error">Duplicates: {stats.duplicates}</span>
          {stats.empties > 0 && <span className="text-sm text-warning">Empty: {stats.empties}</span>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Input</span>
            <button onClick={() => setInput('')} className="text-xs text-text-muted hover:text-text-primary cursor-pointer">Clear</button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste lines of text..."
            className="w-full h-72 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm resize-none focus:outline-none focus:border-accent font-mono"
          />
        </div>
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Output</span>
            <CopyButton text={output} />
          </div>
          <div className="w-full h-72 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm overflow-auto whitespace-pre-wrap font-mono">
            {output || <span className="text-text-muted">Unique lines will appear here...</span>}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
