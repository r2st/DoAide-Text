export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  category: 'generate' | 'analyze' | 'transform' | 'convert';
}

export const tools: Tool[] = [
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text in paragraphs, sentences, or words',
    icon: '¶',
    path: '/lorem-ipsum',
    category: 'generate',
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, paragraphs, and reading time',
    icon: '#',
    path: '/word-counter',
    category: 'analyze',
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between 8 cases: upper, lower, title, sentence, camel, pascal, snake, kebab',
    icon: 'Aa',
    path: '/case-converter',
    category: 'transform',
  },
  {
    id: 'text-diff',
    name: 'Text Diff',
    description: 'Compare two texts side by side and highlight the differences',
    icon: '±',
    path: '/text-diff',
    category: 'analyze',
  },
  {
    id: 'remove-duplicates',
    name: 'Remove Duplicates',
    description: 'Remove duplicate lines from text, with options for case sensitivity and trimming',
    icon: '⊘',
    path: '/remove-duplicates',
    category: 'transform',
  },
  {
    id: 'sort-lines',
    name: 'Sort Lines',
    description: 'Sort lines alphabetically, numerically, by length, or reverse order',
    icon: '↕',
    path: '/sort-lines',
    category: 'transform',
  },
  {
    id: 'find-replace',
    name: 'Find & Replace',
    description: 'Find and replace text with full regex support and match highlighting',
    icon: '⌕',
    path: '/find-replace',
    category: 'transform',
  },
  {
    id: 'text-to-slug',
    name: 'Text to Slug',
    description: 'Convert text to URL-friendly slugs with customizable separators',
    icon: '🔗',
    path: '/text-to-slug',
    category: 'convert',
  },
  {
    id: 'string-escape',
    name: 'String Escape/Unescape',
    description: 'Escape and unescape strings for JSON, HTML, URL, Base64, and Unicode',
    icon: '\\n',
    path: '/string-escape',
    category: 'convert',
  },
  {
    id: 'random-generator',
    name: 'Random String Generator',
    description: 'Generate random strings, passwords, UUIDs, and hex values',
    icon: '🎲',
    path: '/random-generator',
    category: 'generate',
  },
  {
    id: 'whitespace-tools',
    name: 'Whitespace Tools',
    description: 'Trim, normalize, remove blank lines, and clean up whitespace in text',
    icon: '⎵',
    path: '/whitespace-tools',
    category: 'transform',
  },
  {
    id: 'number-to-words',
    name: 'Number to Words',
    description: 'Convert numbers to words in English and Hindi with currency support',
    icon: '१',
    path: '/number-to-words',
    category: 'convert',
  },
];
