import { useState, useMemo } from 'react';
import ToolPage from '../components/ToolPage';
import CopyButton from '../components/CopyButton';

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function convertChunkEN(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '');
  return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + convertChunkEN(n % 100) : '');
}

function numberToEnglish(num: number): string {
  if (num === 0) return 'zero';
  const neg = num < 0;
  num = Math.abs(num);
  const intPart = Math.floor(num);
  const decStr = num.toString().includes('.') ? num.toString().split('.')[1] : '';

  const scales = ['', 'thousand', 'million', 'billion', 'trillion'];
  const parts: string[] = [];
  let n = intPart;
  let i = 0;
  while (n > 0) {
    const chunk = n % 1000;
    if (chunk > 0) {
      const s = convertChunkEN(chunk) + (scales[i] ? ' ' + scales[i] : '');
      parts.unshift(s);
    }
    n = Math.floor(n / 1000);
    i++;
  }

  let result = parts.join(', ') || 'zero';
  if (decStr) {
    result += ' point ' + decStr.split('').map((d) => ones[parseInt(d)] || 'zero').join(' ');
  }
  return (neg ? 'negative ' : '') + result;
}

const onesHI = ['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
  'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस',
  'बीस', 'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस',
  'तीस', 'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस',
  'चालीस', 'इकतालीस', 'बयालीस', 'तैंतालीस', 'चौवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास',
  'पचास', 'इक्यावन', 'बावन', 'तिरपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ',
  'साठ', 'इकसठ', 'बासठ', 'तिरसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सड़सठ', 'अड़सठ', 'उनहत्तर',
  'सत्तर', 'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उनासी',
  'अस्सी', 'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सतासी', 'अट्ठासी', 'नवासी',
  'नब्बे', 'इक्यानबे', 'बानबे', 'तिरानबे', 'चौरानबे', 'पचानबे', 'छियानबे', 'सत्तानबे', 'अट्ठानबे', 'निन्यानबे'];

function numberToHindi(num: number): string {
  if (num === 0) return 'शून्य';
  const neg = num < 0;
  num = Math.abs(num);
  const intPart = Math.floor(num);
  const decStr = num.toString().includes('.') ? num.toString().split('.')[1] : '';

  const parts: string[] = [];
  let n = intPart;

  const hundreds = n % 1000;
  const rem100 = hundreds % 100;
  const h = Math.floor(hundreds / 100);
  if (h > 0) {
    if (rem100 > 0) {
      parts.unshift(onesHI[rem100]);
    }
    parts.unshift(onesHI[h] + ' सौ');
  } else if (rem100 > 0) {
    parts.unshift(onesHI[rem100]);
  }
  n = Math.floor(n / 1000);

  const scales = ['हज़ार', 'लाख', 'करोड़', 'अरब', 'खरब'];
  for (let i = 0; n > 0 && i < scales.length; i++) {
    const chunk = i === 0 ? n % 100 : n % 100;
    if (chunk > 0) {
      parts.unshift(onesHI[chunk] + ' ' + scales[i]);
    }
    n = Math.floor(n / 100);
  }

  let result = parts.join(' ') || 'शून्य';
  if (decStr) {
    const hiDigits = ['शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ'];
    result += ' दशमलव ' + decStr.split('').map((d) => hiDigits[parseInt(d)]).join(' ');
  }
  return (neg ? 'ऋण ' : '') + result;
}

type Lang = 'english' | 'hindi';

export default function NumberToWords() {
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<Lang>('english');
  const [currency, setCurrency] = useState(false);

  const result = useMemo(() => {
    const num = parseFloat(input);
    if (isNaN(num)) return '';
    if (Math.abs(num) > 999999999999999) return 'Number too large';

    let words = lang === 'english' ? numberToEnglish(num) : numberToHindi(num);

    if (currency) {
      const intPart = Math.floor(Math.abs(num));
      const decPart = input.includes('.') ? input.split('.')[1]?.slice(0, 2).padEnd(2, '0') : '00';
      const paise = parseInt(decPart);
      if (lang === 'english') {
        words = numberToEnglish(intPart) + ' rupees';
        if (paise > 0) words += ' and ' + numberToEnglish(paise) + ' paise';
        words += ' only';
      } else {
        words = numberToHindi(intPart) + ' रुपये';
        if (paise > 0) words += ' और ' + numberToHindi(paise) + ' पैसे';
        words += ' मात्र';
      }
    }

    return words.charAt(0).toUpperCase() + words.slice(1);
  }, [input, lang, currency]);

  return (
    <ToolPage title="Number to Words" description="Convert numbers to words in English and Hindi">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-bg-secondary border border-border rounded-xl p-6">
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex gap-1 bg-bg-tertiary rounded-lg p-1">
              <button
                onClick={() => setLang('english')}
                className={`px-4 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                  lang === 'english' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hindi')}
                className={`px-4 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                  lang === 'hindi' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                हिन्दी
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={currency} onChange={(e) => setCurrency(e.target.checked)} className="accent-accent" />
              Currency (₹ Rupees)
            </label>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Enter a number</label>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '' || v === '-' || /^-?\d*\.?\d*$/.test(v)) setInput(v);
              }}
              placeholder="e.g. 1234567.89"
              className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text-primary text-lg font-mono focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {result && (
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">
                {lang === 'english' ? 'In English' : 'हिन्दी में'}
                {currency ? (lang === 'english' ? ' (Currency)' : ' (मुद्रा)') : ''}
              </span>
              <CopyButton text={result} />
            </div>
            <p className="text-text-primary text-lg leading-relaxed">{result}</p>
          </div>
        )}
      </div>
    </ToolPage>
  );
}
