import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import CopyButton from '../components/CopyButton';

type WhitespaceOp = 'trim' | 'trim-lines' | 'normalize' | 'remove-blank' | 'remove-all-ws' | 'tabs-to-spaces' | 'spaces-to-tabs' | 'squeeze';

const opLabels: Record<WhitespaceOp, string> = {
  trim: 'Trim Start & End',
  'trim-lines': 'Trim Each Line',
  normalize: 'Normalize Spaces',
  'remove-blank': 'Remove Blank Lines',
  'remove-all-ws': 'Remove All Whitespace',
  'tabs-to-spaces': 'Tabs → Spaces',
  'spaces-to-tabs': 'Spaces → Tabs',
  squeeze: 'Squeeze Blank Lines',
};

function applyOp(text: string, op: WhitespaceOp): string {
  switch (op) {
    case 'trim': return text.trim();
    case 'trim-lines': return text.split('\n').map((l) => l.trim()).join('\n');
    case 'normalize': return text.split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim()).join('\n');
    case 'remove-blank': return text.split('\n').filter((l) => l.trim() !== '').join('\n');
    case 'remove-all-ws': return text.replace(/\s+/g, '');
    case 'tabs-to-spaces': return text.replace(/\t/g, '    ');
    case 'spaces-to-tabs': return text.replace(/ {4}/g, '\t');
    case 'squeeze': return text.replace(/\n{3,}/g, '\n\n');
  }
}

export default function WhitespaceTools() {
  const [input, setInput] = useState('');
  const [ops, setOps] = useState<WhitespaceOp[]>(['trim-lines', 'remove-blank']);

  const toggleOp = (op: WhitespaceOp) => {
    setOps((prev) => prev.includes(op) ? prev.filter((o) => o !== op) : [...prev, op]);
  };

  const output = useMemo(() => {
    let result = input;
    for (const op of ops) {
      result = applyOp(result, op);
    }
    return result;
  }, [input, ops]);

  const removedChars = input.length - output.length;

  return (
    <ToolPage title="Whitespace Tools" description="Trim, normalize, remove blank lines, and clean up whitespace">
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(opLabels) as WhitespaceOp[]).map((op) => (
          <button
            key={op}
            onClick={() => toggleOp(op)}
            className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
              ops.includes(op) ? 'bg-accent text-white' : 'bg-bg-secondary border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {opLabels[op]}
          </button>
        ))}
      </div>

      {input && removedChars !== 0 && (
        <div className="mb-4 text-sm text-text-muted">
          {removedChars > 0 ? `Removed ${removedChars} characters` : `Added ${Math.abs(removedChars)} characters`}
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
            placeholder="Paste text with whitespace issues..."
            className="w-full h-72 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm resize-none focus:outline-none focus:border-accent font-mono"
          />
        </div>
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Cleaned Output</span>
            <CopyButton text={output} />
          </div>
          <div className="w-full h-72 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm overflow-auto whitespace-pre-wrap font-mono">
            {output || <span className="text-text-muted">Cleaned text will appear here...</span>}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
