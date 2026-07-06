'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, File, Type, Sparkles, Copy, Download, RefreshCcw, Trash2, CheckCircle2, Clock, AlignLeft, List, Activity, Settings2, X } from 'lucide-react';

const MODES = [
  'Short Summary', 'Medium Summary', 'Detailed Summary', 'Bullet Point Summary', 
  'Executive Summary', 'Academic Summary', 'Key Takeaways Only', 'TL;DR'
];

const STYLES = [
  'Professional', 'Simple', 'Student Friendly', 'Business', 'Technical', 'Casual'
];

const LANGUAGES = ['Auto Detect', 'English', 'Hindi'];

function calculateReadingTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export default function ContentSummarizer() {
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState('');
  const [mode, setMode] = useState('Medium Summary');
  const [style, setStyle] = useState('Professional');
  const [language, setLanguage] = useState('Auto Detect');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setIsLoading(true);

    try {
      if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const text = await file.text();
        setInputText(text);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\\n';
        }
        setInputText(fullText);
      } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setInputText(result.value);
      } else {
        throw new Error('Unsupported file format. Please upload TXT, PDF, DOCX, or MD files.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to read file');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const generateSummary = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text or upload a document to summarize.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          mode,
          style,
          language
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    if (!result) return;
    
    let content = `${result.title}\\n\\n`;
    content += `SUMMARY\\n${result.summary}\\n\\n`;
    content += `KEY TAKEAWAYS\\n${result.bulletPoints.map((p: string) => '- ' + p).join('\\n')}\\n\\n`;
    content += `KEYWORDS: ${result.keywords.join(', ')}\\n\\n`;
    
    if (result.keyInformation) {
       content += `KEY INFORMATION\\n`;
       if (result.keyInformation.mainIdea) content += `Main Idea: ${result.keyInformation.mainIdea}\\n`;
       if (result.keyInformation.actionItems?.length) content += `Action Items: ${result.keyInformation.actionItems.join(', ')}\\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const origTime = inputText ? calculateReadingTime(inputText) : 0;
  const sumTime = result?.summary ? calculateReadingTime(result.summary) : 0;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-200 pb-12">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">AI Content Summarizer</h1>
              <p className="text-xs text-neutral-500">Transform long text into concise insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={() => { setInputText(''); setFileName(''); setResult(null); setError(null); }} 
                className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors bg-neutral-100 rounded-md" 
                title="Clear All"
             >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
            <span className="mt-0.5 text-xl">⚠️</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel - Input & Settings */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Input Card */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                  <Type className="w-4 h-4" /> Source Content
                </h2>
                <div className="flex gap-2">
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="text-xs flex items-center gap-1.5 text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 px-2.5 py-1.5 rounded shadow-sm transition-colors font-medium"
                   >
                     <Upload className="w-3.5 h-3.5" /> Upload File
                   </button>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleFileUpload}
                     className="hidden" 
                     accept=".txt,.pdf,.docx,.md" 
                   />
                </div>
              </div>
              
              {fileName && (
                <div className="px-4 py-2 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-blue-700 font-medium truncate">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </div>
                  <button onClick={() => { setFileName(''); setInputText(''); }} className="text-blue-400 hover:text-blue-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex-1 relative p-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your article, report, or text here..."
                  className="w-full h-full resize-none bg-transparent outline-none text-sm text-neutral-800 leading-relaxed placeholder:text-neutral-400"
                />
              </div>
              <div className="p-3 border-t border-neutral-100 bg-neutral-50/50 text-xs text-neutral-500 flex justify-between">
                 <span>{inputText.length} characters</span>
                 <span>{origTime} min read</span>
              </div>
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
               <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                  <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                    <Settings2 className="w-4 h-4" /> AI Settings
                  </h2>
               </div>
               <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1.5">Summary Mode</label>
                    <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full text-sm border-neutral-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2">
                       {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5">Style</label>
                      <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full text-sm border-neutral-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2">
                         {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5">Output Language</label>
                      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full text-sm border-neutral-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2">
                         {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <button 
                    onClick={generateSummary} 
                    disabled={isLoading || !inputText.trim()}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    {isLoading ? (
                      <><RefreshCcw className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Generate Summary</>
                    )}
                  </button>
               </div>
            </div>

          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-7">
            {!result ? (
               <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden h-[500px] flex flex-col items-center justify-center text-center p-8 lg:sticky lg:top-24">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                     <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Ready to Summarize</h3>
                  <p className="text-sm text-neutral-500 max-w-sm">
                    Enter your text or upload a document on the left, adjust your settings, and click Generate to see the AI summary here.
                  </p>
               </div>
            ) : (
               <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                     <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                        <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                          <AlignLeft className="w-4 h-4" /> Output
                        </h2>
                        <div className="flex gap-2">
                           <button onClick={() => handleCopy(result.summary)} className="text-xs flex items-center gap-1.5 text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 px-2 py-1 rounded shadow-sm transition-colors font-medium">
                             <Copy className="w-3.5 h-3.5" /> Copy
                           </button>
                           <button onClick={handleDownload} className="text-xs flex items-center gap-1.5 text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 px-2 py-1 rounded shadow-sm transition-colors font-medium">
                             <Download className="w-3.5 h-3.5" /> Export
                           </button>
                        </div>
                     </div>
                     <div className="p-6">
                        <h1 className="text-xl font-bold text-neutral-900 mb-4">{result.title}</h1>
                        <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
                     </div>
                  </div>

                  {/* Bullet Points */}
                  {result.bulletPoints && result.bulletPoints.length > 0 && (
                     <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                       <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                          <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                            <List className="w-4 h-4" /> Key Takeaways
                          </h2>
                          <button onClick={() => handleCopy(result.bulletPoints.join('\\n'))} className="text-neutral-400 hover:text-neutral-700">
                             <Copy className="w-4 h-4" />
                          </button>
                       </div>
                       <div className="p-6">
                          <ul className="space-y-3">
                             {result.bulletPoints.map((point: string, i: number) => (
                               <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">{point}</span>
                               </li>
                             ))}
                          </ul>
                       </div>
                     </div>
                  )}

                  {/* Grid for extra info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     
                     {/* Keywords */}
                     {result.keywords && result.keywords.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                           <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                              <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                                <File className="w-4 h-4" /> Keywords
                              </h2>
                           </div>
                           <div className="p-4 flex flex-wrap gap-2">
                              {result.keywords.map((kw: string, i: number) => (
                                 <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium border border-blue-100">
                                    {kw}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Stats */}
                     <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                           <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                             <Activity className="w-4 h-4" /> Statistics
                           </h2>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-4">
                           <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 text-center">
                              <div className="text-xs text-neutral-500 mb-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Original Time</div>
                              <div className="text-lg font-semibold text-neutral-800">~{origTime} min</div>
                           </div>
                           <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100 text-center">
                              <div className="text-xs text-blue-600/70 mb-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Read Time</div>
                              <div className="text-lg font-semibold text-blue-700">~{sumTime} min</div>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Key Info */}
                  {result.keyInformation && Object.keys(result.keyInformation).length > 0 && (
                      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                         <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                            <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                              <Sparkles className="w-4 h-4" /> Extracted Entities
                            </h2>
                         </div>
                         <div className="p-4 space-y-4">
                            {result.keyInformation.mainIdea && (
                               <div>
                                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Main Idea</h4>
                                  <p className="text-sm text-neutral-800">{result.keyInformation.mainIdea}</p>
                               </div>
                            )}
                            {result.keyInformation.actionItems && result.keyInformation.actionItems.length > 0 && (
                               <div>
                                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Action Items</h4>
                                  <ul className="list-disc list-inside text-sm text-neutral-800 space-y-1">
                                     {result.keyInformation.actionItems.map((item: string, i: number) => <li key={i}>{item}</li>)}
                                  </ul>
                               </div>
                            )}
                            {result.keyInformation.names && result.keyInformation.names.length > 0 && (
                               <div>
                                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">People / Organizations</h4>
                                  <div className="flex flex-wrap gap-2">
                                     {result.keyInformation.names.map((name: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded border border-neutral-200">{name}</span>
                                     ))}
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>
                  )}

               </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
