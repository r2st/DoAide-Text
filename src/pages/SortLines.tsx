import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import CopyButton from '../components/CopyButton';

type SortMode = 'alpha' | 'alpha-desc' | 'numeric' | 'numeric-desc' | 'length' | 'length-desc' | 'reverse' | 'shuffle';

const sortLabels: Record<SortMode, string> = {
  alpha: 'A → Z',
  'alpha-desc': 'Z → A',
  numeric: '0 → 9',
  'numeric-desc': '9 → 0',
  length: 'Short → Long',
  'length-desc': 'Long → Short',
  reverse: 'Reverse Order',
  shuffle: 'Shuffle',
};

function sortLines(text: string, mode: SortMode): string {
  const lines = text.split('\n');
  switch (mode) {
    case 'alpha':
      return lines.sort((a, b) => a.localeCompare(b)).join('\n');
    case 'alpha-desc':
      return lines.sort((a, b) => b.localeCompare(a)).join('\n');
    case 'numeric':
      return lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)).join('\n');
    case 'numeric-desc':
      return lines.sort((a, b) => (parseFloat(b) || 0) - (parseFloat(a) || 0)).join('\n');
    case 'length':
      return lines.sort((a, b) => a.length - b.length).join('\n');
    case 'length-desc':
      return lines.sort((a, b) => b.length - a.length).join('\n');
    case 'reverse':
      return lines.reverse().join('\n');
    case 'shuffle':
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      return lines.join('\n');
  }
}

export default function SortLines() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<SortMode>('alpha');
  const output = useMemo(() => sortLines(input, mode), [input, mode]);

  return (
    <ToolPage title="Sort Lines" description="Sort lines alphabetically, numerically, by length, or reverse">
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(sortLabels) as SortMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
              mode === m ? 'bg-accent text-white' : 'bg-bg-secondary border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {sortLabels[m]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Input ({input.split('\n').length} lines)</span>
            <button onClick={() => setInput('')} className="text-xs text-text-muted hover:text-text-primary cursor-pointer">Clear</button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste lines to sort..."
            className="w-full h-72 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm resize-none focus:outline-none focus:border-accent font-mono"
          />
        </div>
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Sorted Output</span>
            <CopyButton text={output} />
          </div>
          <div className="w-full h-72 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm overflow-auto whitespace-pre-wrap font-mono">
            {output || <span className="text-text-muted">Sorted lines will appear here...</span>}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
