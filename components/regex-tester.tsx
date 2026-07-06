'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Copy, Trash2, RefreshCcw, Search, Type, HelpCircle, Code, AlignLeft, History, Save, X, Clock } from 'lucide-react';
import { explainRegex, TEMPLATES } from '@/lib/regex-utils';

type RegexHistoryEntry = {
  id: string;
  pattern: string;
  flags: string;
  testString: string;
  replaceString: string;
  timestamp: number;
};

const COLORS = [
  'bg-blue-200/70 text-blue-900 border-blue-400',
  'bg-green-200/70 text-green-900 border-green-400',
  'bg-amber-200/70 text-amber-900 border-amber-400',
  'bg-purple-200/70 text-purple-900 border-purple-400',
  'bg-pink-200/70 text-pink-900 border-pink-400',
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('gm');
  const [testString, setTestString] = useState('');
  const [replaceString, setReplaceString] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<RegexHistoryEntry[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('regex-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHistory(parsed);
      } catch (e) {}
    }
  }, []);

  const saveToHistory = () => {
    if (!pattern && !testString) return;
    const newEntry: RegexHistoryEntry = {
      id: Date.now().toString(),
      pattern,
      flags,
      testString,
      replaceString,
      timestamp: Date.now(),
    };
    const newHistory = [newEntry, ...history].slice(0, 10); // Keep max 10
    setHistory(newHistory);
    localStorage.setItem('regex-history', JSON.stringify(newHistory));
  };

  const loadHistoryEntry = (entry: RegexHistoryEntry) => {
    setPattern(entry.pattern);
    setFlags(entry.flags);
    setTestString(entry.testString);
    setReplaceString(entry.replaceString);
    setHistoryOpen(false);
  };

  const deleteHistoryEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('regex-history', JSON.stringify(newHistory));
  };

  const clearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('regex-history');
    setConfirmClear(false);
  };
  
  // Highlight scrolling sync
  const textRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (textRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textRef.current.scrollTop;
      highlightRef.current.scrollLeft = textRef.current.scrollLeft;
    }
  };

  let error: string | null = null;
  let matches: RegExpMatchArray[] = [];
  let replaceResult = '';

  if (pattern) {
    try {
      const execFlags = flags.includes('g') ? flags : flags + 'g';
      const regex = new RegExp(pattern, execFlags);
      
      const foundMatches = Array.from(testString.matchAll(regex));
      if (!flags.includes('g') && foundMatches.length > 0) {
        matches = [foundMatches[0]];
      } else {
        matches = foundMatches;
      }

      if (replaceString) {
        const replaceRegex = new RegExp(pattern, flags);
        replaceResult = testString.replace(replaceRegex, replaceString);
      }
    } catch (err: any) {
      error = err.message;
    }
  }

  const toggleFlag = (f: string) => {
    if (flags.includes(f)) {
      setFlags(flags.replace(f, ''));
    } else {
      setFlags(flags + f);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    const data = JSON.stringify({
      pattern,
      flags,
      testString,
      matches: matches.map(m => ({
        match: m[0],
        index: m.index,
        groups: m.slice(1)
      }))
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regex-results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (tmpl: { pattern: string, flags: string }) => {
    setPattern(tmpl.pattern);
    setFlags(tmpl.flags);
  };

  const renderHighlight = () => {
    if (!pattern || error || matches.length === 0) return <>{testString}</>;

    const nodes = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      const index = match.index!;
      const matchStr = match[0];
      
      if (index > lastIndex) {
        nodes.push(<span key={`t-${i}`}>{testString.substring(lastIndex, index)}</span>);
      }

      const color = COLORS[i % COLORS.length];
      
      if (matchStr.length === 0) {
        nodes.push(
          <span key={`m-${i}`} className="inline-block w-0.5 h-4 bg-rose-500 align-middle -ml-[1px] shadow-[0_0_4px_rgba(244,63,94,0.5)] z-10 relative"></span>
        );
      } else {
        nodes.push(
          <mark key={`m-${i}`} className={`rounded-[3px] border border-transparent ${color} bg-clip-padding`}>
            {matchStr}
          </mark>
        );
      }

      lastIndex = index + matchStr.length;
    });

    if (lastIndex < testString.length) {
      nodes.push(<span key="t-end">{testString.substring(lastIndex)}</span>);
    }

    return nodes;
  };

  const tokens = explainRegex(pattern);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-200">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">Regex Tester</h1>
              <p className="text-xs text-neutral-500">Real-time regular expression validator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setHistoryOpen(true)} className="flex items-center gap-2 p-2 px-3 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors" title="View History">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
            <button onClick={saveToHistory} className="flex items-center gap-2 p-2 px-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm" title="Save to History">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <div className="w-px h-6 bg-neutral-200 mx-1"></div>
            <button onClick={() => setTestString('')} className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors" title="Clear Text">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={handleDownload} className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors" title="Export JSON">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Config */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Regex Input Card */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                  <Search className="w-4 h-4" /> Expression
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600">
                  <span className="flex select-none items-center pl-3 text-neutral-500 sm:text-lg font-mono">
                    /
                  </span>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="block flex-1 border-0 bg-transparent py-2.5 pl-1 pr-3 text-neutral-900 placeholder:text-neutral-400 focus:ring-0 sm:text-lg font-mono outline-none"
                    placeholder="Enter regex..."
                    spellCheck={false}
                  />
                  <span className="flex select-none items-center pr-3 text-neutral-500 sm:text-lg font-mono">
                    /
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['g', 'i', 'm', 's', 'u', 'y'].map(f => (
                    <button
                      key={f}
                      onClick={() => toggleFlag(f)}
                      className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${flags.includes(f) ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                      title={f === 'g' ? 'Global' : f === 'i' ? 'Case insensitive' : f === 'm' ? 'Multiline' : f === 's' ? 'Dot all' : f === 'u' ? 'Unicode' : 'Sticky'}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100 flex items-start gap-2">
                    <span className="mt-0.5">⚠️</span>
                    <span className="font-mono text-xs break-all">{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Replace Card */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                  <RefreshCcw className="w-4 h-4" /> Replace
                </h2>
              </div>
              <div className="p-4">
                <input
                  type="text"
                  value={replaceString}
                  onChange={(e) => setReplaceString(e.target.value)}
                  className="block w-full rounded-md border-0 py-2 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 font-mono outline-none px-3"
                  placeholder="Substitution string (e.g. $1-$2)"
                />
              </div>
            </div>

            {/* Templates Card */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                  <AlignLeft className="w-4 h-4" /> Common Patterns
                </h2>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.name}
                    onClick={() => loadTemplate(tmpl)}
                    className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs rounded-md border border-neutral-200 transition-colors"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Test Text */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden flex-1 flex flex-col min-h-[400px]">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                  <Type className="w-4 h-4" /> Test String
                </h2>
                <div className="text-xs text-neutral-500 font-medium bg-white px-2 py-1 rounded border border-neutral-200 shadow-sm">
                  {matches.length} {matches.length === 1 ? 'match' : 'matches'}
                </div>
              </div>
              
              <div className="relative flex-1 bg-white">
                <div 
                  ref={highlightRef}
                  className="absolute inset-0 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-transparent overflow-hidden pointer-events-none"
                  aria-hidden="true"
                >
                  {renderHighlight()}
                </div>
                <textarea
                  ref={textRef}
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  onScroll={handleScroll}
                  className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-relaxed bg-transparent text-neutral-800 resize-none outline-none caret-blue-600"
                  spellCheck={false}
                  placeholder="Paste your test text here..."
                />
              </div>
            </div>

            {replaceString && (
               <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden h-48 flex flex-col">
                 <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                    <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                      <RefreshCcw className="w-4 h-4" /> Replaced Output
                    </h2>
                    <button onClick={() => handleCopy(replaceResult)} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                 </div>
                 <div className="flex-1 p-4 overflow-auto">
                    <pre className="font-mono text-sm text-neutral-800 whitespace-pre-wrap break-words font-medium">{replaceResult}</pre>
                 </div>
               </div>
            )}
          </div>
        </div>

        {/* Bottom Panel: Explanation & Matches Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
             <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                  <HelpCircle className="w-4 h-4" /> Explanation
                </h2>
              </div>
              <div className="p-4">
                {!pattern ? (
                  <p className="text-sm text-neutral-500 italic">Enter a regex pattern to see its explanation.</p>
                ) : (
                  <div className="space-y-2">
                    {tokens.map((token, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-2 border-b border-neutral-100 last:border-0">
                        <code className="bg-neutral-100 text-blue-700 px-2 py-0.5 rounded font-mono text-sm shrink-0 font-medium shadow-sm border border-neutral-200/60">
                          {token.part}
                        </code>
                        <span className="text-sm text-neutral-600">{token.explanation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
             <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                  <Code className="w-4 h-4" /> Match Details
                </h2>
              </div>
              <div className="p-0 max-h-[500px] overflow-y-auto">
                {matches.length === 0 ? (
                  <div className="p-4 text-sm text-neutral-500 italic">No matches found.</div>
                ) : (
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-neutral-50 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-4 py-3 font-medium text-neutral-500 border-b border-neutral-200 w-16">#</th>
                        <th className="px-4 py-3 font-medium text-neutral-500 border-b border-neutral-200">Match</th>
                        <th className="px-4 py-3 font-medium text-neutral-500 border-b border-neutral-200 w-24">Index</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {matches.slice(0, 100).map((m, i) => (
                        <tr key={i} className="hover:bg-neutral-50/50">
                          <td className="px-4 py-3 text-neutral-400 font-mono text-xs">{i + 1}</td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200 break-all inline-block max-w-full">
                              {m[0] === '' ? <span className="text-neutral-400 italic font-sans">&lt;empty&gt;</span> : m[0]}
                            </span>
                            {m.length > 1 && (
                              <div className="mt-2 space-y-1 pl-2 border-l-2 border-neutral-200">
                                {Array.from(m).slice(1).map((group, gi) => (
                                  <div key={gi} className="text-xs text-neutral-500 flex gap-2">
                                    <span className="font-medium">Group {gi + 1}:</span>
                                    <span className="font-mono break-all">{group === undefined ? 'undefined' : (group === '' ? '<empty>' : group)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-neutral-500 font-mono text-xs">
                            {m.index} - {m.index! + m[0].length}
                          </td>
                        </tr>
                      ))}
                      {matches.length > 100 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-center text-xs text-neutral-500 bg-neutral-50">
                            Showing first 100 of {matches.length} matches
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
          </div>
        </div>
      </main>

      {/* History Sidebar */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex">
          <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm transition-opacity" onClick={() => setHistoryOpen(false)}></div>
          <div className="relative ml-auto w-full max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 border-l border-neutral-200">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="font-semibold flex items-center gap-2 text-neutral-800">
                <History className="w-4 h-4 text-neutral-500" /> Saved Patterns
              </h2>
              <button onClick={() => setHistoryOpen(false)} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="text-center text-sm text-neutral-500 mt-10">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-neutral-300" />
                  <p>No saved patterns yet.</p>
                  <p className="mt-1">Click &quot;Save&quot; to add your current regex to history.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-neutral-500 font-medium">Recent ({history.length})</span>
                    {!confirmClear ? (
                      <button 
                        onClick={() => setConfirmClear(true)}
                        className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                      >
                        Clear All
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Are you sure?</span>
                        <button onClick={clearAllHistory} className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded transition-colors">Yes</button>
                        <button onClick={() => setConfirmClear(false)} className="text-xs text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded transition-colors">No</button>
                      </div>
                    )}
                  </div>
                  {history.map(entry => (
                    <div 
                      key={entry.id}
                      onClick={() => loadHistoryEntry(entry)}
                      className="group relative bg-white border border-neutral-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="font-mono text-sm text-blue-700 truncate max-w-[200px] font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                          /{entry.pattern}/{entry.flags}
                        </div>
                        <button 
                          onClick={(e) => deleteHistoryEntry(entry.id, e)}
                          className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {entry.testString && (
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed break-words">
                          {entry.testString}
                        </p>
                      )}
                      <div className="mt-2 text-[10px] text-neutral-400 font-medium">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
