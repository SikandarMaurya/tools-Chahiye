'use client';

import { useState, useEffect } from 'react';
import { 
  Wand2, Image as ImageIcon, Settings2, Download, Copy, Share2, 
  Trash2, RefreshCcw, Maximize2, Zap, History, Sparkles, Layers,
  AlertCircle, CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

const MODELS = [
  { id: 'gemini-3.1-flash-lite-image', name: 'Gemini Flash Lite (Fast)' },
  { id: 'gemini-3.1-flash-image', name: 'Gemini Flash (Pro/HD)' },
];

const ASPECT_RATIOS = [
  { id: '1:1', name: 'Square (1:1)' },
  { id: '4:3', name: 'Standard (4:3)' },
  { id: '3:4', name: 'Portrait (3:4)' },
  { id: '16:9', name: 'Widescreen (16:9)' },
  { id: '9:16', name: 'Stories (9:16)' },
];

const STYLES = [
  'None', 'Realistic', 'Cinematic', 'Anime', 'Pixar', 'Disney Inspired', 'Cartoon',
  'Oil Painting', 'Watercolor', 'Sketch', 'Low Poly', 'Fantasy', 'Cyberpunk',
  'Pixel Art', '3D Render', 'Neon', 'Abstract'
];

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export default function AiImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [model, setModel] = useState(MODELS[0].id);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].id);
  const [imageSize, setImageSize] = useState('1K');
  const [style, setStyle] = useState('None');
  const [numImages, setNumImages] = useState(1);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [copiedState, setCopiedState] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ai-image-history');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const enhancePrompt = async () => {
    if (!prompt) return;
    setIsEnhancing(true);
    setError(null);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPrompt(data.enhancedPrompt);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateImages = async () => {
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }
    setIsGenerating(true);
    setError(null);
    setCurrentImages([]);

    try {
      let finalPrompt = prompt;
      if (style !== 'None') {
        finalPrompt = `${finalPrompt}, ${style} style`;
      }
      if (negativePrompt) {
        finalPrompt = `${finalPrompt} | Exclude: ${negativePrompt}`;
      }

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          model,
          aspectRatio,
          imageSize,
          numImages
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (data.images && data.images.length > 0) {
        setCurrentImages(data.images);
        
        // Save to history
        const newHistory = [...data.images.map((url: string) => ({
          id: Math.random().toString(36).substring(7),
          url,
          prompt,
          timestamp: Date.now()
        })), ...history].slice(0, 50);
        
        setHistory(newHistory);
        localStorage.setItem('ai-image-history', JSON.stringify(newHistory));
      } else {
         throw new Error("No image generated");
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate image. Please ensure you have access to the selected model.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const downloadImage = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-image-${Date.now()}.png`;
    a.click();
  };

  const clearHistory = () => {
    if(confirm('Are you sure you want to clear your image history?')) {
      setHistory([]);
      localStorage.removeItem('ai-image-history');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans selection:bg-purple-500/30">
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setFullscreenImage(null)}>
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            <button className="absolute top-4 right-4 text-white p-2 bg-black/50 hover:bg-black/80 rounded-full transition-colors z-10" onClick={(e) => {e.stopPropagation(); setFullscreenImage(null);}}>
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="relative w-full h-[80vh]">
              <Image src={fullscreenImage} alt="Fullscreen Output" fill className="object-contain" referrerPolicy="no-referrer" unoptimized />
            </div>
            <button className="absolute bottom-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium shadow-lg transition-colors z-10 flex items-center gap-2" onClick={(e) => {e.stopPropagation(); downloadImage(fullscreenImage);}}>
               <Download className="w-4 h-4" /> Download HD
            </button>
          </div>
        </div>
      )}

      <header className="bg-[#111] border-b border-neutral-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-2 rounded-lg shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight text-white">AI Image Generator</h1>
              <p className="text-xs text-neutral-400">Enterprise Creative Studio</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Prompt Editor */}
            <div className="bg-[#111] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
               <div>
                 <div className="flex justify-between items-center mb-2">
                   <label className="block text-sm font-medium text-neutral-300 flex-1">Image Prompt</label>
                   <button 
                      onClick={enhancePrompt} 
                      disabled={isEnhancing || !prompt}
                      className="text-xs flex items-center gap-1.5 text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors bg-purple-500/10 px-2.5 py-1 rounded-md font-medium"
                    >
                      {isEnhancing ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                      Enhance
                   </button>
                 </div>
                 <textarea 
                   value={prompt} 
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="A futuristic cyberpunk city at sunset with flying cars, ultra realistic, cinematic lighting, 8K..."
                   className="w-full h-32 bg-[#1a1a1a] text-sm text-neutral-200 border border-neutral-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-3 px-3 resize-none transition-colors placeholder:text-neutral-600" 
                 />
               </div>
               
               <div>
                 <label className="block text-xs font-medium text-neutral-400 mb-1.5">Negative Prompt (Optional)</label>
                 <input 
                   type="text" 
                   value={negativePrompt} 
                   onChange={(e) => setNegativePrompt(e.target.value)}
                   placeholder="blurry, distorted, watermark..."
                   className="w-full bg-[#1a1a1a] text-sm text-neutral-200 border border-neutral-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-2 px-3 transition-colors placeholder:text-neutral-600" 
                 />
               </div>
            </div>

            {/* Settings */}
            <div className="bg-[#111] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-5">
               <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2 border-b border-neutral-800 pb-3">
                 <Settings2 className="w-4 h-4 text-neutral-400" /> Generation Settings
               </h3>
               
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-2">AI Model</label>
                    <div className="grid grid-cols-1 gap-2">
                       {MODELS.map(m => (
                         <button 
                           key={m.id}
                           onClick={() => setModel(m.id)}
                           className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${model === m.id ? 'bg-purple-500/10 border-purple-500/50 text-purple-300' : 'bg-[#1a1a1a] border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}
                         >
                           {m.name}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-2">Style</label>
                    <select 
                      value={style} 
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-[#1a1a1a] text-sm text-neutral-200 border border-neutral-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-2 px-3 transition-colors"
                    >
                       {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-2">Aspect Ratio</label>
                      <select 
                        value={aspectRatio} 
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="w-full bg-[#1a1a1a] text-sm text-neutral-200 border border-neutral-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-2 px-3 transition-colors"
                      >
                         {ASPECT_RATIOS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-2">Resolution</label>
                      <select 
                        value={imageSize} 
                        onChange={(e) => setImageSize(e.target.value)}
                        className="w-full bg-[#1a1a1a] text-sm text-neutral-200 border border-neutral-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-2 px-3 transition-colors"
                        disabled={model !== 'gemini-3.1-flash-image'} // Only pro supports higher res natively in this UI logic
                      >
                         <option value="512px">512px (Fast)</option>
                         <option value="1K">1K (Standard)</option>
                         <option value="2K">2K (HD)</option>
                         <option value="4K">4K (Ultra)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                     <label className="block text-xs font-medium text-neutral-400 mb-2">Number of Images</label>
                     <div className="flex bg-[#1a1a1a] border border-neutral-800 rounded-lg overflow-hidden p-1">
                        {[1, 2, 4].map(num => (
                          <button 
                            key={num}
                            onClick={() => setNumImages(num)}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${numImages === num ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                          >
                            {num}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>

               <button 
                 onClick={generateImages} 
                 disabled={isGenerating || !prompt}
                 className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
               >
                 {isGenerating ? (
                   <><RefreshCcw className="w-5 h-5 animate-spin" /> Generating Image...</>
                 ) : (
                   <><ImageIcon className="w-5 h-5" /> Generate Image</>
                 )}
               </button>
            </div>
          </div>

          {/* Right Area - Canvas & Gallery */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Canvas */}
            <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
               <div className="p-4 border-b border-neutral-800 bg-[#151515] flex justify-between items-center">
                 <h2 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                   <Layers className="w-4 h-4 text-purple-400" /> Generation Canvas
                 </h2>
                 {currentImages.length > 0 && (
                   <div className="flex gap-2">
                     <button onClick={() => downloadImage(currentImages[0])} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors" title="Download First">
                       <Download className="w-4 h-4" />
                     </button>
                     <button onClick={() => copyPrompt(prompt)} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors" title="Copy Prompt">
                       {copiedState ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                     </button>
                   </div>
                 )}
               </div>
               
               <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center p-6 relative">
                 {isGenerating ? (
                    <div className="text-center">
                       <div className="relative w-24 h-24 mx-auto mb-6">
                         <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                         <Wand2 className="absolute inset-0 m-auto w-8 h-8 text-purple-500 animate-pulse" />
                       </div>
                       <p className="text-purple-400 font-medium text-lg animate-pulse">Crafting your vision...</p>
                       <p className="text-neutral-500 text-sm mt-2">Running AI inference on {model === 'gemini-3.1-flash-image' ? 'Pro' : 'Lite'} models</p>
                    </div>
                 ) : currentImages.length > 0 ? (
                    <div className={`grid gap-4 w-full h-full max-h-[600px] ${currentImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                       {currentImages.map((img, i) => (
                         <div key={i} className="relative group rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl flex items-center justify-center">
                           <div className="relative w-full h-full min-h-[300px]">
                             <Image 
                               src={img} 
                               alt={`Generated ${i}`} 
                               fill
                               className="object-contain"
                               unoptimized
                               referrerPolicy="no-referrer"
                             />
                           </div>
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                             <button onClick={() => setFullscreenImage(img)} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-colors">
                               <Maximize2 className="w-5 h-5" />
                             </button>
                             <button onClick={() => downloadImage(img)} className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg transition-colors">
                               <Download className="w-5 h-5" />
                             </button>
                           </div>
                         </div>
                       ))}
                    </div>
                 ) : (
                    <div className="text-center max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-800">
                        <ImageIcon className="w-8 h-8 text-neutral-600" />
                      </div>
                      <h3 className="text-neutral-300 font-medium text-lg mb-2">No Image Generated</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed">
                        Enter a detailed prompt in the left sidebar and click Generate to create stunning AI visuals.
                      </p>
                    </div>
                 )}
               </div>
            </div>

            {/* History Gallery */}
            {history.length > 0 && (
              <div className="bg-[#111] border border-neutral-800 rounded-xl p-5 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                     <History className="w-4 h-4 text-neutral-400" /> Recent Creations
                   </h3>
                   <button onClick={clearHistory} className="text-xs text-neutral-500 hover:text-red-400 transition-colors">
                     Clear History
                   </button>
                 </div>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                   {history.map(item => (
                     <div key={item.id} className="group relative aspect-square bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 cursor-pointer" onClick={() => {
                        setPrompt(item.prompt);
                        setCurrentImages([item.url]);
                     }}>
                        <Image 
                          src={item.url} 
                          alt="History thumbnail" 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                           <p className="text-xs text-white line-clamp-2 leading-tight mb-2">{item.prompt}</p>
                           <div className="flex gap-2">
                             <button onClick={(e) => { e.stopPropagation(); downloadImage(item.url); }} className="p-1.5 bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm text-white">
                               <Download className="w-3.5 h-3.5" />
                             </button>
                             <button onClick={(e) => { e.stopPropagation(); setFullscreenImage(item.url); }} className="p-1.5 bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm text-white">
                               <Maximize2 className="w-3.5 h-3.5" />
                             </button>
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
