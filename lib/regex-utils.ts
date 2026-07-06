import { RegexToken } from './regex-utils';

export function explainRegex(regexStr: string): RegexToken[] {
  const tokens: RegexToken[] = [];
  if (!regexStr) return tokens;

  let i = 0;
  while (i < regexStr.length) {
    const char = regexStr[i];
    
    if (char === '\\') {
      const nextChar = regexStr[i + 1];
      if (nextChar) {
        const seq = '\\' + nextChar;
        let explanation = 'Escaped character';
        switch (nextChar) {
          case 'd': explanation = 'Digit (0-9)'; break;
          case 'D': explanation = 'Non-digit'; break;
          case 'w': explanation = 'Word character (a-z, A-Z, 0-9, _)'; break;
          case 'W': explanation = 'Non-word character'; break;
          case 's': explanation = 'Whitespace character'; break;
          case 'S': explanation = 'Non-whitespace character'; break;
          case 'b': explanation = 'Word boundary'; break;
          case 'B': explanation = 'Non-word boundary'; break;
          case 'n': explanation = 'Newline'; break;
          case 'r': explanation = 'Carriage return'; break;
          case 't': explanation = 'Tab'; break;
        }
        tokens.push({ part: seq, explanation });
        i += 2;
        continue;
      }
    }

    if (char === '^') { tokens.push({ part: '^', explanation: 'Start of string/line' }); i++; continue; }
    if (char === '$') { tokens.push({ part: '$', explanation: 'End of string/line' }); i++; continue; }
    if (char === '.') { tokens.push({ part: '.', explanation: 'Any character (except newline)' }); i++; continue; }
    if (char === '*') { tokens.push({ part: '*', explanation: 'Zero or more times' }); i++; continue; }
    if (char === '+') { tokens.push({ part: '+', explanation: 'One or more times' }); i++; continue; }
    if (char === '?') { tokens.push({ part: '?', explanation: 'Zero or one time (or lazy quantifier)' }); i++; continue; }

    if (char === '[') {
      let j = i + 1;
      let closed = false;
      while (j < regexStr.length) {
        if (regexStr[j] === '\\') j += 2;
        else if (regexStr[j] === ']') { closed = true; break; }
        else j++;
      }
      if (closed) {
        const part = regexStr.slice(i, j + 1);
        tokens.push({ part, explanation: part.startsWith('[^') ? 'Negated character set' : 'Character set' });
        i = j + 1;
        continue;
      }
    }

    if (char === '{') {
      let j = i + 1;
      let closed = false;
      while (j < regexStr.length) {
        if (regexStr[j] === '}') { closed = true; break; }
        j++;
      }
      if (closed && /^\{\d+(,\d*)?\}$/.test(regexStr.slice(i, j + 1))) {
        const part = regexStr.slice(i, j + 1);
        tokens.push({ part, explanation: 'Quantifier' });
        i = j + 1;
        continue;
      }
    }

    if (char === '(') {
      if (regexStr.startsWith('(?:', i)) { tokens.push({ part: '(?:', explanation: 'Start non-capturing group' }); i += 3; }
      else if (regexStr.startsWith('(?=', i)) { tokens.push({ part: '(?=', explanation: 'Start positive lookahead' }); i += 3; }
      else if (regexStr.startsWith('(?!', i)) { tokens.push({ part: '(?!', explanation: 'Start negative lookahead' }); i += 3; }
      else if (regexStr.startsWith('(?<=', i)) { tokens.push({ part: '(?<=', explanation: 'Start positive lookbehind' }); i += 4; }
      else if (regexStr.startsWith('(?<!', i)) { tokens.push({ part: '(?<!', explanation: 'Start negative lookbehind' }); i += 4; }
      else { tokens.push({ part: '(', explanation: 'Start capture group' }); i++; }
      continue;
    }
    if (char === ')') { tokens.push({ part: ')', explanation: 'End group' }); i++; continue; }
    if (char === '|') { tokens.push({ part: '|', explanation: 'Alternation (OR)' }); i++; continue; }

    tokens.push({ part: char, explanation: 'Literal character' });
    i++;
  }

  const coalesced: RegexToken[] = [];
  for (const token of tokens) {
    if (token.explanation === 'Literal character') {
      if (coalesced.length > 0 && coalesced[coalesced.length - 1].explanation === 'Literal characters') {
        coalesced[coalesced.length - 1].part += token.part;
      } else if (coalesced.length > 0 && coalesced[coalesced.length - 1].explanation === 'Literal character') {
        coalesced[coalesced.length - 1].part += token.part;
        coalesced[coalesced.length - 1].explanation = 'Literal characters';
      } else {
        coalesced.push({ ...token });
      }
    } else {
      coalesced.push(token);
    }
  }

  return coalesced;
}

export const TEMPLATES = [
  { name: 'Email', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', flags: 'gm' },
  { name: 'Phone Number (US)', pattern: '^\\+?1?\\s*\\(?-?\\d{3}\\)?-?\\s*\\d{3}-?\\s*\\d{4}$', flags: 'gm' },
  { name: 'URL', pattern: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$', flags: 'gm' },
  { name: 'Password (Strong)', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', flags: 'gm' },
  { name: 'Username', pattern: '^[a-zA-Z0-9_]{3,16}$', flags: 'gm' },
  { name: 'Date (YYYY-MM-DD)', pattern: '^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$', flags: 'gm' },
  { name: 'IP Address (IPv4)', pattern: '^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$', flags: 'gm' },
  { name: 'Hex Color', pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', flags: 'gm' },
  { name: 'UUID', pattern: '^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$', flags: 'gm' },
];
