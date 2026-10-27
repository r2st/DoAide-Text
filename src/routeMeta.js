/**
 * SEO metadata for every indexable route. Shared by the useSEO hook (wired in
 * Layout) and scripts/prerender-routes.mjs (static HTML, sitemap, serve.json),
 * so keep it plain JS with no JSX/TS or browser-only imports.
 * Paths must match src/utils/tools.ts and the routes in App.tsx.
 */

export const SITE = {
  name: 'DoAide Text',
  baseUrl: 'https://text.doaide.com',
  ogImage: 'https://text.doaide.com/og-text.png',
}

const tool = (path, h1, title, description) => ({ path, h1, title: `${title} | DoAide Text`, description })

export const routes = [
  {
    path: '/',
    h1: 'DoAide | Text',
    title: 'DoAide Text — Free Online Text Tools (Word Counter, Case Converter)',
    description:
      'Free online text tools: word counter, case converter, text diff, find & replace, lorem ipsum, slug generator and more. Runs in your browser, no login.',
  },
  tool('/lorem-ipsum', 'Lorem Ipsum Generator', 'Lorem Ipsum Generator — Paragraphs, Words',
    'Generate lorem ipsum placeholder text by paragraphs, sentences or words and copy it in one click. Free, runs in your browser.'),
  tool('/word-counter', 'Word Counter', 'Word Counter — Characters, Sentences, Reading Time',
    'Count words, characters, sentences and paragraphs, and see estimated reading time as you type. Free online word counter.'),
  tool('/case-converter', 'Case Converter', 'Case Converter — Upper, Lower, Title, camelCase',
    'Convert text between upper, lower, title, sentence, camelCase, PascalCase, snake_case and kebab-case. Free online case converter.'),
  tool('/text-diff', 'Text Diff', 'Text Diff — Compare Two Texts Online',
    'Compare two texts side by side and highlight every addition and deletion. Free online text diff checker, nothing is uploaded.'),
  tool('/remove-duplicates', 'Remove Duplicates', 'Remove Duplicate Lines Online',
    'Remove duplicate lines from a list, with options for case sensitivity and trimming whitespace. Free online duplicate line remover.'),
  tool('/sort-lines', 'Sort Lines', 'Sort Lines — Alphabetical, Numeric, by Length',
    'Sort lines of text alphabetically, numerically or by length, or reverse their order. Free online line sorter.'),
  tool('/find-replace', 'Find & Replace', 'Find and Replace Text Online — Regex Support',
    'Find and replace text with full regular expression support and match highlighting. Free online find and replace tool.'),
  tool('/text-to-slug', 'Text to Slug', 'Text to Slug Generator — URL-Friendly Slugs',
    'Convert titles and text to clean, URL-friendly slugs with a custom separator. Free online slug generator.'),
  tool('/string-escape', 'String Escape/Unescape', 'String Escape & Unescape — JSON, HTML, URL',
    'Escape and unescape strings for JSON, HTML, URL, Base64 and Unicode. Free online string escaper for developers.'),
  tool('/random-generator', 'Random String Generator', 'Random String, Password & UUID Generator',
    'Generate random strings, strong passwords, UUIDs and hex values in your browser. Free online random string generator.'),
  tool('/whitespace-tools', 'Whitespace Tools', 'Whitespace Remover — Trim & Clean Up Text',
    'Trim lines, collapse spaces, remove blank lines and normalise whitespace in any text. Free online whitespace cleaner.'),
  tool('/number-to-words', 'Number to Words', 'Number to Words Converter — English & Hindi',
    'Convert numbers to words in English or Hindi, with an option to write amounts in rupees. Free online number to words converter.'),
]

export const canonicalFor = (path) => `${SITE.baseUrl}${path}`

export const metaForPath = (path) => routes.find((r) => r.path === path)

export function jsonLdFor(route) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: route.path === '/' ? SITE.name : route.h1,
    url: canonicalFor(route.path),
    description: route.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    author: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
  }
}
