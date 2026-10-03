import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import CopyButton from '../components/CopyButton';

interface Stats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: string;
  speakingTime: string;
}

function analyze(text: string): Stats {
  if (!text.trim()) {
    return { characters: 0, charactersNoSpaces: 0, words: 0, sentences: 0, paragraphs: 0, lines: 0, readingTime: '0 sec', speakingTime: '0 sec' };
  }
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const lines = text.split('\n').length;
  const readingMinutes = words / 200;
  const speakingMinutes = words / 130;
  const formatTime = (mins: number) => {
    if (mins < 1) return `${Math.ceil(mins * 60)} sec`;
    const m = Math.floor(mins);
    const s = Math.round((mins - m) * 60);
    return s > 0 ? `${m} min ${s} sec` : `${m} min`;
  };
  return { characters, charactersNoSpaces, words, sentences, paragraphs, lines, readingTime: formatTime(readingMinutes), speakingTime: formatTime(speakingMinutes) };
}

function topWords(text: string, n: number): [string, number][] {
  const words = text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => analyze(text), [text]);
  const top = useMemo(() => topWords(text, 10), [text]);
  const statsReport = useMemo(() =>
    `Words: ${stats.words}\nCharacters: ${stats.characters}\nCharacters (no spaces): ${stats.charactersNoSpaces}\nSentences: ${stats.sentences}\nParagraphs: ${stats.paragraphs}\nLines: ${stats.lines}\nReading Time: ${stats.readingTime}\nSpeaking Time: ${stats.speakingTime}`,
    [stats]
  );

  const statCards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.characters },
    { label: 'No Spaces', value: stats.charactersNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Lines', value: stats.lines },
  ];

  return (
    <ToolPage title="Word Counter" description="Count words, characters, sentences, paragraphs, and reading time">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {statCards.map((s) => (
          <div key={s.label} className="bg-bg-secondary border border-border rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-gold">{s.value.toLocaleString()}</div>
            <div className="text-xs text-text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">Paste or type your text</span>
              <CopyButton text={statsReport} label="Copy Stats" />
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="w-full h-80 bg-bg-tertiary border border-border rounded-lg p-4 text-text-primary text-sm leading-relaxed resize-none focus:outline-none focus:border-accent font-mono"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Reading & Speaking Time</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Reading (~200 wpm)</span>
                <span className="text-text-primary">{stats.readingTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Speaking (~130 wpm)</span>
                <span className="text-text-primary">{stats.speakingTime}</span>
              </div>
            </div>
          </div>

          {top.length > 0 && (
            <div className="bg-bg-secondary border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-text-secondary mb-3">Top Words</h3>
              <div className="space-y-1">
                {top.map(([word, count]) => (
                  <div key={word} className="flex justify-between text-sm">
                    <span className="text-text-primary font-mono">{word}</span>
                    <span className="text-text-muted">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolPage>
  );
}
