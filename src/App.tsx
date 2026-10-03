import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LoremIpsum from './pages/LoremIpsum';
import WordCounter from './pages/WordCounter';
import CaseConverter from './pages/CaseConverter';
import TextDiff from './pages/TextDiff';
import RemoveDuplicates from './pages/RemoveDuplicates';
import SortLines from './pages/SortLines';
import FindReplace from './pages/FindReplace';
import TextToSlug from './pages/TextToSlug';
import StringEscape from './pages/StringEscape';
import RandomGenerator from './pages/RandomGenerator';
import WhitespaceTools from './pages/WhitespaceTools';
import NumberToWords from './pages/NumberToWords';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lorem-ipsum" element={<LoremIpsum />} />
        <Route path="word-counter" element={<WordCounter />} />
        <Route path="case-converter" element={<CaseConverter />} />
        <Route path="text-diff" element={<TextDiff />} />
        <Route path="remove-duplicates" element={<RemoveDuplicates />} />
        <Route path="sort-lines" element={<SortLines />} />
        <Route path="find-replace" element={<FindReplace />} />
        <Route path="text-to-slug" element={<TextToSlug />} />
        <Route path="string-escape" element={<StringEscape />} />
        <Route path="random-generator" element={<RandomGenerator />} />
        <Route path="whitespace-tools" element={<WhitespaceTools />} />
        <Route path="number-to-words" element={<NumberToWords />} />
      </Route>
    </Routes>
  );
}
