import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import CopyButton from '../components/CopyButton';

const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
  }
  return words.join(' ');
}

function generateSentence(minWords = 6, maxWords = 15): string {
  const len = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
  const words: string[] = [];
  for (let i = 0; i < len; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateParagraph(sentenceCount = 5): string {
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
}

type Mode = 'paragraphs' | 'sentences' | 'words';

export default function LoremIpsum() {
  const [mode, setMode] = useState<Mode>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);

  const output = useMemo(() => {
    let result: string;
    if (mode === 'words') {
      result = generateWords(count);
    } else if (mode === 'sentences') {
      result = Array.from({ length: count }, () => generateSentence()).join(' ');
    } else {
      result = Array.from({ length: count }, () => generateParagraph()).join('\n\n');
    }
    if (startWithLorem && result.length > 0) {
      const prefix = 'Lorem ipsum dolor sit amet';
      if (mode === 'words') {
        const words = result.split(' ');
        const prefixWords = prefix.split(' ');
        for (let i = 0; i < Math.min(prefixWords.length, words.length); i++) {
          words[i] = prefixWords[i];
        }
        result = words.join(' ');
      } else {
        const firstPeriod = result.indexOf('.');
        if (firstPeriod > 0) {
          result = prefix + ', ' + result.slice(0, 1).toLowerCase() + result.slice(1);
        }
      }
    }
    return result;
  }, [mode, count, startWithLorem]);

  return (
    <ToolPage title="Lorem Ipsum Generator" description="Generate placeholder text in paragraphs, sentences, or words">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-bg-secondary border border-border rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Type</label>
              <div className="flex flex-col gap-2">
                {(['paragraphs', 'sentences', 'words'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-2 rounded-md text-sm capitalize cursor-pointer transition-colors ${
                      mode === m ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Count</label>
              <input
                type="number"
                min={1}
                max={mode === 'words' ? 5000 : 100}
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="accent-accent"
              />
              Start with "Lorem ipsum..."
            </label>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-muted">
                {output.split(/\s+/).filter(Boolean).length} words
              </span>
              <CopyButton text={output} />
            </div>
            <div className="bg-bg-tertiary rounded-lg p-4 max-h-[600px] overflow-y-auto">
              <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">{output}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
