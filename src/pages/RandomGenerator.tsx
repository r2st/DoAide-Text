import { useState, useCallback } from 'react';
import ToolPage from '../components/ToolPage';
import CopyButton from '../components/CopyButton';

type GenMode = 'string' | 'password' | 'uuid' | 'hex';

const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function randomString(length: number, charset: string): string {
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (v) => charset[v % charset.length]).join('');
}

function generateUUID(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function generateHex(length: number): string {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').slice(0, length);
}

export default function RandomGenerator() {
  const [mode, setMode] = useState<GenMode>('string');
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [include, setInclude] = useState({ lowercase: true, uppercase: true, numbers: true, symbols: false });
  const [results, setResults] = useState<string[]>([]);

  const generate = useCallback(() => {
    const items: string[] = [];
    for (let i = 0; i < count; i++) {
      switch (mode) {
        case 'uuid':
          items.push(generateUUID());
          break;
        case 'hex':
          items.push(generateHex(length));
          break;
        case 'password': {
          const charset = Object.entries(CHARSETS).filter(([k]) => include[k as keyof typeof include]).map(([, v]) => v).join('') || CHARSETS.lowercase;
          items.push(randomString(length, charset));
          break;
        }
        default: {
          const charset = Object.entries(CHARSETS).filter(([k]) => include[k as keyof typeof include]).map(([, v]) => v).join('') || CHARSETS.lowercase;
          items.push(randomString(length, charset));
          break;
        }
      }
    }
    setResults(items);
  }, [mode, length, count, include]);

  const allText = results.join('\n');

  return (
    <ToolPage title="Random String Generator" description="Generate random strings, passwords, UUIDs, and hex values">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-bg-secondary border border-border rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Type</label>
              <div className="flex flex-col gap-2">
                {([['string', 'Random String'], ['password', 'Password'], ['uuid', 'UUID v4'], ['hex', 'Hex String']] as [GenMode, string][]).map(([m, label]) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-2 rounded-md text-sm cursor-pointer transition-colors text-left ${
                      mode === m ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {mode !== 'uuid' && (
              <div>
                <label className="block text-sm text-text-secondary mb-1">Length</label>
                <input
                  type="number"
                  min={1}
                  max={256}
                  value={length}
                  onChange={(e) => setLength(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-text-secondary mb-1">Count</label>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {(mode === 'string' || mode === 'password') && (
              <div>
                <label className="block text-sm text-text-secondary mb-2">Characters</label>
                <div className="space-y-2">
                  {Object.keys(CHARSETS).map((key) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer capitalize">
                      <input
                        type="checkbox"
                        checked={include[key as keyof typeof include]}
                        onChange={(e) => setInclude({ ...include, [key]: e.target.checked })}
                        className="accent-accent"
                      />
                      {key}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={generate}
              className="w-full py-2.5 bg-accent text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-accent-hover transition-colors"
            >
              Generate
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-muted">{results.length} generated</span>
              <CopyButton text={allText} label="Copy All" />
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-text-muted text-sm text-center py-12">Click Generate to create random strings</div>
              ) : (
                results.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 bg-bg-tertiary rounded-lg px-4 py-2.5 group">
                    <span className="text-text-muted text-xs w-6 shrink-0">{i + 1}</span>
                    <code className="text-text-primary text-sm font-mono flex-1 break-all">{r}</code>
                    <CopyButton text={r} label="Copy" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
