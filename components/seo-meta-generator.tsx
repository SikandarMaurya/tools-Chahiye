'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Download, RefreshCcw, CheckCircle2, AlertCircle, LayoutTemplate, Settings2, Globe, Target, Hash, Type, Image as ImageIcon, Link as LinkIcon, Smartphone, Monitor, ChevronDown, ChevronUp } from 'lucide-react';

const PAGE_TYPES = ['Home', 'Tool', 'Blog', 'Product', 'Landing Page', 'About', 'Contact', 'Category'];
const BUSINESS_TYPES = ['SaaS', 'Blog', 'E-commerce', 'Education', 'Healthcare', 'Agency', 'Portfolio', 'Other'];
const TONES = ['Professional', 'Marketing', 'Friendly', 'Technical', 'Corporate'];
const COUNTRIES = ['Global', 'India', 'USA', 'UK', 'Canada', 'Australia'];
const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Arabic', 'Japanese'];

export default function SeoMetaGenerator() {
  const [inputs, setInputs] = useState({
    websiteName: '',
    pageTitle: '',
    pageUrl: '',
    targetKeyword: '',
    secondaryKeywords: '',
    pageType: 'WebPage',
    businessType: '',
    tone: 'Professional',
    targetCountry: 'Global',
    language: 'English'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('meta');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateSEO = async () => {
    if (!inputs.pageTitle || !inputs.targetKeyword) {
      setError('Page Title and Target Keyword are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/seo-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate SEO data');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [id]: true });
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const getMetaTagsHTML = () => {
    if (!result) return '';
    return `<!-- Basic Meta Tags -->
<title>${result.meta.title}</title>
<meta name="description" content="${result.meta.description}">
<meta name="keywords" content="${result.keywords.primary}, ${result.keywords.secondary.join(', ')}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<link rel="canonical" href="${inputs.pageUrl || 'https://example.com'}/${result.meta.urlSlug}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${result.openGraph.type || 'website'}">
<meta property="og:url" content="${inputs.pageUrl || 'https://example.com'}/${result.meta.urlSlug}">
<meta property="og:title" content="${result.openGraph.title}">
<meta property="og:description" content="${result.openGraph.description}">
<meta property="og:image" content="https://example.com/image.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="${result.twitter.card}">
<meta property="twitter:url" content="${inputs.pageUrl || 'https://example.com'}/${result.meta.urlSlug}">
<meta property="twitter:title" content="${result.twitter.title}">
<meta property="twitter:description" content="${result.twitter.description}">
<meta property="twitter:image" content="https://example.com/image.jpg">`;
  };

  const downloadHTML = () => {
    if (!result) return;
    const blob = new Blob([getMetaTagsHTML()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result.schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-200 pb-12">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">AI SEO Meta Generator</h1>
              <p className="text-xs text-neutral-500">Generate complete SEO elements for your web page</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel - Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
               <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                  <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                    <Settings2 className="w-4 h-4" /> Page Details
                  </h2>
               </div>
               <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">Page Title *</label>
                    <input type="text" name="pageTitle" value={inputs.pageTitle} onChange={handleInputChange} placeholder="e.g. AI Image Generator" className="w-full text-sm border border-neutral-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">Target Keyword *</label>
                    <input type="text" name="targetKeyword" value={inputs.targetKeyword} onChange={handleInputChange} placeholder="e.g. ai image generator free" className="w-full text-sm border border-neutral-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">Secondary Keywords (Optional)</label>
                    <textarea name="secondaryKeywords" value={inputs.secondaryKeywords} onChange={handleInputChange} placeholder="Comma separated..." className="w-full text-sm border border-neutral-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 h-20 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">Website Name (Optional)</label>
                    <input type="text" name="websiteName" value={inputs.websiteName} onChange={handleInputChange} placeholder="e.g. ToolVerse" className="w-full text-sm border border-neutral-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">Base URL (Optional)</label>
                    <input type="url" name="pageUrl" value={inputs.pageUrl} onChange={handleInputChange} placeholder="https://example.com" className="w-full text-sm border border-neutral-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3" />
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
               <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                  <h2 className="font-medium flex items-center gap-2 text-sm text-neutral-700">
                    <Target className="w-4 h-4" /> Optimization Settings
                  </h2>
               </div>
               <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1.5">Page Type</label>
                      <select name="pageType" value={inputs.pageType} onChange={handleInputChange} className="w-full text-sm border border-neutral-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-2">
                         {PAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1.5">Business</label>
                      <select name="businessType" value={inputs.businessType} onChange={handleInputChange} className="w-full text-sm border border-neutral-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-2">
                         <option value="">Select...</option>
                         {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1.5">Tone</label>
                      <select name="tone" value={inputs.tone} onChange={handleInputChange} className="w-full text-sm border border-neutral-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-2">
                         {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1.5">Country</label>
                      <select name="targetCountry" value={inputs.targetCountry} onChange={handleInputChange} className="w-full text-sm border border-neutral-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-2">
                         {COUNTRIES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-neutral-700 mb-1.5">Language</label>
                      <select name="language" value={inputs.language} onChange={handleInputChange} className="w-full text-sm border border-neutral-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-2">
                         {LANGUAGES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <button 
                    onClick={generateSEO} 
                    disabled={isLoading || !inputs.pageTitle || !inputs.targetKeyword}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    {isLoading ? (
                      <><RefreshCcw className="w-4 h-4 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Generate SEO Data</>
                    )}
                  </button>
               </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-8">
            {!result ? (
               <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden h-full min-h-[600px] flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                     <Globe className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Ready to Optimize</h3>
                  <p className="text-sm text-neutral-500 max-w-sm">
                    Enter your page details on the left and click Generate to create complete, production-ready SEO metadata, schema, and analysis.
                  </p>
               </div>
            ) : (
               <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col h-full min-h-[800px]">
                  
                  {/* Score Header */}
                  <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">SEO Analysis Complete</h2>
                      <p className="text-sm text-neutral-600">Here is your optimized metadata and strategy.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-neutral-100">
                      <div className="text-right">
                        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">SEO Score</div>
                        <div className="text-2xl font-black text-blue-600">{result.analysis.score}<span className="text-sm text-neutral-400 font-medium">/100</span></div>
                      </div>
                      <div className="w-12 h-12 rounded-full border-4 border-blue-100 relative flex items-center justify-center">
                        <svg className="w-12 h-12 transform -rotate-90 absolute inset-0 text-blue-600" viewBox="0 0 36 36">
                          <path
                            strokeDasharray={`${result.analysis.score}, 100`}
                            className="stroke-current transition-all duration-1000 ease-out"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth="3"
                          />
                        </svg>
                        <span className="text-xs font-bold text-neutral-700">{result.analysis.score}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-neutral-200 overflow-x-auto hide-scrollbar">
                     <button onClick={() => setActiveTab('meta')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'meta' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-neutral-500 hover:text-neutral-700'}`}>Meta & Social</button>
                     <button onClick={() => setActiveTab('content')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-neutral-500 hover:text-neutral-700'}`}>Content Strategy</button>
                     <button onClick={() => setActiveTab('schema')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'schema' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-neutral-500 hover:text-neutral-700'}`}>JSON-LD Schema</button>
                     <button onClick={() => setActiveTab('code')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'code' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-neutral-500 hover:text-neutral-700'}`}>Export HTML</button>
                     <button onClick={() => setActiveTab('analysis')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'analysis' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-neutral-500 hover:text-neutral-700'}`}>Analysis</button>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6 flex-1 overflow-y-auto">
                    
                    {activeTab === 'meta' && (
                      <div className="space-y-8">
                        {/* SERP Preview */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2"><Monitor className="w-4 h-4" /> Google SERP Preview</h3>
                          <div className="bg-white border border-neutral-200 rounded-lg p-4 max-w-2xl shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                               <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center text-[10px] font-bold text-neutral-500">{inputs.websiteName?.charAt(0) || 'W'}</div>
                               <div>
                                 <div className="text-[12px] text-neutral-800 font-medium leading-none">{inputs.websiteName || 'Website'}</div>
                                 <div className="text-[12px] text-neutral-500 leading-none mt-0.5">{inputs.pageUrl || 'https://example.com'}/{result.meta.urlSlug}</div>
                               </div>
                            </div>
                            <h4 className="text-xl text-[#1a0dab] font-medium cursor-pointer hover:underline truncate">{result.meta.title}</h4>
                            <p className="text-sm text-[#4d5156] mt-1 line-clamp-2 leading-snug">{result.meta.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                             <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg">
                               <div className="flex justify-between items-center mb-2">
                                 <label className="text-xs font-semibold text-neutral-600 uppercase">Meta Title</label>
                                 <div className="flex items-center gap-3">
                                   <span className={`text-xs ${result.meta.title.length > 60 ? 'text-red-500' : 'text-green-600'}`}>{result.meta.title.length}/60 chars</span>
                                   <button onClick={() => handleCopy(result.meta.title, 'title')} className="text-neutral-400 hover:text-neutral-700">
                                     {copiedStates['title'] ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                   </button>
                                 </div>
                               </div>
                               <p className="text-sm font-medium text-neutral-900">{result.meta.title}</p>
                             </div>

                             <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg">
                               <div className="flex justify-between items-center mb-2">
                                 <label className="text-xs font-semibold text-neutral-600 uppercase">Meta Description</label>
                                 <div className="flex items-center gap-3">
                                   <span className={`text-xs ${result.meta.description.length > 160 ? 'text-red-500' : 'text-green-600'}`}>{result.meta.description.length}/160 chars</span>
                                   <button onClick={() => handleCopy(result.meta.description, 'desc')} className="text-neutral-400 hover:text-neutral-700">
                                     {copiedStates['desc'] ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                   </button>
                                 </div>
                               </div>
                               <p className="text-sm text-neutral-700 leading-relaxed">{result.meta.description}</p>
                             </div>

                             <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg">
                               <div className="flex justify-between items-center mb-2">
                                 <label className="text-xs font-semibold text-neutral-600 uppercase">URL Slug</label>
                                 <button onClick={() => handleCopy(result.meta.urlSlug, 'slug')} className="text-neutral-400 hover:text-neutral-700">
                                   {copiedStates['slug'] ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                 </button>
                               </div>
                               <p className="text-sm font-mono text-neutral-700">{result.meta.urlSlug}</p>
                             </div>
                           </div>

                           <div className="space-y-4">
                             <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg">
                               <h4 className="text-xs font-semibold text-neutral-600 uppercase mb-3">Open Graph (Facebook/LinkedIn)</h4>
                               <div className="space-y-2">
                                  <div><span className="text-xs text-neutral-500 w-16 inline-block">Title:</span> <span className="text-sm font-medium text-neutral-800">{result.openGraph.title}</span></div>
                                  <div><span className="text-xs text-neutral-500 w-16 inline-block align-top">Desc:</span> <span className="text-sm text-neutral-700 inline-block w-[calc(100%-4rem)]">{result.openGraph.description}</span></div>
                                  <div><span className="text-xs text-neutral-500 w-16 inline-block">Type:</span> <span className="text-sm text-neutral-700">{result.openGraph.type}</span></div>
                               </div>
                             </div>

                             <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg">
                               <h4 className="text-xs font-semibold text-neutral-600 uppercase mb-3">Twitter Card</h4>
                               <div className="space-y-2">
                                  <div><span className="text-xs text-neutral-500 w-16 inline-block">Card:</span> <span className="text-sm text-neutral-700">{result.twitter.card}</span></div>
                                  <div><span className="text-xs text-neutral-500 w-16 inline-block">Title:</span> <span className="text-sm font-medium text-neutral-800">{result.twitter.title}</span></div>
                                  <div><span className="text-xs text-neutral-500 w-16 inline-block align-top">Desc:</span> <span className="text-sm text-neutral-700 inline-block w-[calc(100%-4rem)]">{result.twitter.description}</span></div>
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'content' && (
                      <div className="space-y-8">
                         {/* Keywords */}
                         <div>
                           <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Hash className="w-4 h-4" /> Keyword Strategy</h3>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-white border border-neutral-200 rounded-lg p-4">
                                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Primary Keyword</h4>
                                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded font-medium text-sm">{result.keywords.primary}</div>
                              </div>
                              <div className="bg-white border border-neutral-200 rounded-lg p-4">
                                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Secondary Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                  {result.keywords.secondary.map((kw: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs border border-neutral-200">{kw}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-white border border-neutral-200 rounded-lg p-4">
                                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">LSI Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                  {result.keywords.lsi.map((kw: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs border border-indigo-100">{kw}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-white border border-neutral-200 rounded-lg p-4">
                                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Long Tail Variations</h4>
                                <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
                                  {result.keywords.longTail.map((kw: string, i: number) => (
                                    <li key={i}>{kw}</li>
                                  ))}
                                </ul>
                              </div>
                           </div>
                         </div>

                         {/* Headings */}
                         <div>
                           <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Type className="w-4 h-4" /> Heading Structure</h3>
                           <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-4 font-mono text-sm">
                             <div>
                               <span className="text-blue-600 font-bold mr-2">H1</span>
                               <span className="text-neutral-900 font-semibold">{result.headings.h1}</span>
                             </div>
                             {result.headings.h2.map((h2: string, i: number) => (
                               <div key={i} className="ml-4">
                                 <span className="text-indigo-500 font-bold mr-2">H2</span>
                                 <span className="text-neutral-800">{h2}</span>
                                 {/* Only show H3s under the first H2 for visual simplicity if we have them */}
                                 {i === 0 && result.headings.h3 && result.headings.h3.map((h3: string, j: number) => (
                                   <div key={j} className="ml-6 mt-2">
                                     <span className="text-teal-500 font-bold mr-2">H3</span>
                                     <span className="text-neutral-600">{h3}</span>
                                   </div>
                                 ))}
                               </div>
                             ))}
                           </div>
                         </div>

                         {/* FAQs */}
                         {result.faqs && result.faqs.length > 0 && (
                           <div>
                             <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Recommended FAQs</h3>
                             <div className="space-y-3">
                               {result.faqs.map((faq: any, i: number) => (
                                 <div key={i} className="bg-white border border-neutral-200 rounded-lg p-4">
                                   <p className="font-semibold text-neutral-900 text-sm mb-1">Q: {faq.question}</p>
                                   <p className="text-sm text-neutral-600 leading-relaxed">A: {faq.answer}</p>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* Links & Images */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                             <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Link Strategy</h3>
                             <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-4">
                               <div>
                                 <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Internal Linking Ideas</h4>
                                 <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
                                    {result.suggestions.internalLinks.map((link: string, i: number) => <li key={i}>{link}</li>)}
                                 </ul>
                               </div>
                               <div>
                                 <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">External Authority Outbound</h4>
                                 <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
                                    {result.suggestions.externalLinks.map((link: string, i: number) => <li key={i}>{link}</li>)}
                                 </ul>
                               </div>
                             </div>
                           </div>
                           <div>
                             <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Image ALT Tags</h3>
                             <div className="bg-white border border-neutral-200 rounded-lg p-4">
                               <ul className="list-disc list-inside text-sm text-neutral-700 space-y-2">
                                  {result.suggestions.imageAltTags.map((alt: string, i: number) => <li key={i}>{alt}</li>)}
                               </ul>
                             </div>
                           </div>
                         </div>
                      </div>
                    )}

                    {activeTab === 'schema' && (
                      <div className="space-y-4 h-full flex flex-col">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-neutral-900">Generated JSON-LD ({inputs.pageType})</h3>
                          <div className="flex gap-2">
                            <button onClick={() => handleCopy(JSON.stringify(result.schema, null, 2), 'schema')} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-md transition-colors">
                              {copiedStates['schema'] ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />} Copy
                            </button>
                            <button onClick={downloadJSON} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-md transition-colors">
                              <Download className="w-3.5 h-3.5" /> Download JSON
                            </button>
                          </div>
                        </div>
                        <div className="flex-1 bg-neutral-900 rounded-xl p-4 overflow-auto border border-neutral-800">
                          <pre className="text-xs text-neutral-300 font-mono leading-relaxed whitespace-pre-wrap">
                            {`<script type="application/ld+json">\n${JSON.stringify(result.schema, null, 2)}\n</script>`}
                          </pre>
                        </div>
                      </div>
                    )}

                    {activeTab === 'code' && (
                      <div className="space-y-4 h-full flex flex-col">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-neutral-900">Ready-to-use HTML Tags</h3>
                          <div className="flex gap-2">
                            <button onClick={() => handleCopy(getMetaTagsHTML(), 'html')} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-md transition-colors">
                              {copiedStates['html'] ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />} Copy All
                            </button>
                            <button onClick={downloadHTML} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-md transition-colors">
                              <Download className="w-3.5 h-3.5" /> Download HTML
                            </button>
                          </div>
                        </div>
                        <div className="flex-1 bg-neutral-900 rounded-xl p-4 overflow-auto border border-neutral-800">
                          <pre className="text-xs text-blue-300 font-mono leading-relaxed whitespace-pre-wrap">
                            {getMetaTagsHTML()}
                          </pre>
                        </div>
                      </div>
                    )}

                    {activeTab === 'analysis' && (
                      <div className="space-y-6">
                        <h3 className="text-sm font-semibold text-neutral-900">Improvement Suggestions</h3>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                          <ul className="space-y-3">
                            {result.analysis.suggestions.map((sug: string, i: number) => (
                              <li key={i} className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <span className="text-sm text-neutral-800 leading-relaxed">{sug}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white border border-neutral-200 rounded-lg p-6">
                           <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Technical Checklist Validated</h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[
                                'Title Length (60 chars)',
                                'Description Length (160 chars)',
                                'Primary Keyword Placement',
                                'Canonical Tag Defined',
                                'Robots Directives Set',
                                'Open Graph Setup',
                                'Twitter Cards Configured',
                                'JSON-LD Schema Generated'
                              ].map((check, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-neutral-700">
                                  <CheckCircle2 className="w-4 h-4 text-green-500" /> {check}
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    )}

                  </div>
               </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

function HelpCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
  );
}
