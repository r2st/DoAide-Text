import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import CopyButton from '../components/CopyButton';

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab';

const caseLabels: Record<CaseType, string> = {
  upper: 'UPPERCASE',
  lower: 'lowercase',
  title: 'Title Case',
  sentence: 'Sentence case',
  camel: 'camelCase',
  pascal: 'PascalCase',
  snake: 'snake_case',
  kebab: 'kebab-case',
};

function splitWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function convertCase(text: string, target: CaseType): string {
  if (target === 'upper') return text.toUpperCase();
  if (target === 'lower') return text.toLowerCase();
  if (target === 'title') {
    return text.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (target === 'sentence') {
    return text
      .toLowerCase()
      .replace(/(^\s*|[.!?]\s+)(\w)/g, (_, p, c) => p + c.toUpperCase());
  }

  const lines = text.split('\n');
  return lines.map((line) => {
    const words = splitWords(line).map((w) => w.toLowerCase());
    if (words.length === 0) return '';
    switch (target) {
      case 'camel':
        return words[0] + words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
      case 'pascal':
        return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
      case 'snake':
        return words.join('_');
      case 'kebab':
        return words.join('-');
    }
  }).join('\n');
}

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [caseType, setCaseType] = useState<CaseType>('upper');
  const output = useMemo(() => convertCase(input, caseType), [input, caseType]);

  return (
    <ToolPage title="Case Converter" description="Convert text between 8 different cases">
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(caseLabels) as CaseType[]).map((c) => (
          <button
            key={c}
            onClick={() => setCaseType(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              caseType === c ? 'bg-accent text-white' : 'bg-bg-secondary border border-border text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
            }`}
          >
            {caseLabels[c]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Input</span>
            <button
              onClick={() => setInput('')}
              className="text-xs text-text-muted hover:text-text-primary cursor-pointer"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text here..."
            className="w-full h-64 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm resize-none focus:outline-none focus:border-accent"
          />
        </div>

        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Output — {caseLabels[caseType]}</span>
            <CopyButton text={output} />
          </div>
          <div className="w-full h-64 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm overflow-auto whitespace-pre-wrap">
            {output || <span className="text-text-muted">Converted text will appear here...</span>}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
