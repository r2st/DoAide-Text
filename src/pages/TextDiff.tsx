import { useState, useMemo } from 'react';
import * as Diff from 'diff';
import ToolPage from '../components/ToolPage';

type DiffMode = 'chars' | 'words' | 'lines';

export default function TextDiff() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [mode, setMode] = useState<DiffMode>('words');

  const changes = useMemo(() => {
    if (!left && !right) return [];
    switch (mode) {
      case 'chars': return Diff.diffChars(left, right);
      case 'words': return Diff.diffWords(left, right);
      case 'lines': return Diff.diffLines(left, right);
    }
  }, [left, right, mode]);

  const stats = useMemo(() => {
    let added = 0, removed = 0;
    for (const c of changes) {
      if (c.added) added += (c.count || 0);
      else if (c.removed) removed += (c.count || 0);
    }
    return { added, removed };
  }, [changes]);

  return (
    <ToolPage title="Text Diff" description="Compare two texts and highlight the differences">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-text-secondary">Compare by:</span>
        {(['chars', 'words', 'lines'] as DiffMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-md text-sm capitalize cursor-pointer transition-colors ${
              mode === m ? 'bg-accent text-white' : 'bg-bg-secondary border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <span className="text-sm text-text-secondary block mb-3">Original</span>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original text..."
            className="w-full h-48 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm resize-none focus:outline-none focus:border-accent font-mono"
          />
        </div>
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <span className="text-sm text-text-secondary block mb-3">Modified</span>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste modified text..."
            className="w-full h-48 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm resize-none focus:outline-none focus:border-accent font-mono"
          />
        </div>
      </div>

      {changes.length > 0 && (
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-text-secondary">Diff Result</span>
            <span className="text-xs text-success">+{stats.added} added</span>
            <span className="text-xs text-error">-{stats.removed} removed</span>
          </div>
          <div className="bg-bg-tertiary rounded-lg p-4 max-h-[400px] overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {changes.map((part, i) => (
              <span
                key={i}
                className={
                  part.added
                    ? 'bg-success/20 text-success'
                    : part.removed
                    ? 'bg-error/20 text-error line-through'
                    : 'text-text-primary'
                }
              >
                {part.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </ToolPage>
  );
}
