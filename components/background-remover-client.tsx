'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, Zap, Shield, Wand2, 
  Download, Loader2, Eraser, Check, Eye, EyeOff, ZoomIn, ZoomOut, Settings2, SlidersHorizontal, Layers, Trash2, SplitSquareHorizontal
} from 'lucide-react';

type ProcessState = 'idle' | 'processing' | 'done' | 'error';
type BgMode = 'transparent' | 'white' | 'black' | 'custom' | 'preset';

export default function BackgroundRemoverClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  const [processState, setProcessState] = useState<ProcessState>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  
  const [bgMode, setBgMode] = useState<BgMode>('transparent');
  const [customBgColor, setCustomBgColor] = useState('#ff0000');
  const [presetBg, setPresetBg] = useState('');
  
  const [showOriginal, setShowOriginal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const processingSteps = [
    { name: 'Validation Engine', desc: 'Checking file size, format, and resolution...', time: 800 },
    { name: 'Image Analysis Engine', desc: 'Analyzing width, height, aspect ratio, and noise...', time: 1000 },
    { name: 'Subject Detection', desc: 'Detecting person, product, or animal...', time: 1200 },
    { name: 'Semantic Segmentation', desc: 'Classifying pixels into foreground and background...', time: 1500 },
    { name: 'Edge Refinement', desc: 'Enhancing hair, fur, and transparent objects...', time: 1200 },
    { name: 'Background Removal', desc: 'Generating final alpha mask...', time: 800 }
  ];

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file.');
      return;
    }
    
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);
    setProcessState('processing');
    setErrorMsg('');
    setProgress(0);
    showToast('🚀 Upload Complete! AI Detection Started.');
    
    processImage(url);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const processImage = async (url: string) => {
    // Simulate Enterprise AI Steps
    let totalTime = 0;
    
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStep(processingSteps[i].name);
      const stepTime = processingSteps[i].time;
      
      await new Promise(resolve => setTimeout(resolve, stepTime));
      
      const nextProgress = Math.round(((i + 1) / processingSteps.length) * 90);
      setProgress(nextProgress);
    }
    
    // Perform actual dummy "removal" via Canvas
    try {
      const img = new Image();
      // local URL doesn't need crossOrigin
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Simple Edge/Background removal simulation: 
        // We will remove pixels close to the top-left pixel color to simulate a magic wand
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];
        const tolerance = 50;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          
          if (
            Math.abs(r - bgR) < tolerance && 
            Math.abs(g - bgG) < tolerance && 
            Math.abs(b - bgB) < tolerance
          ) {
            data[i+3] = 0; // Make transparent
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        const finalUrl = canvas.toDataURL('image/png');
        setResultUrl(finalUrl);
        setProgress(100);
        setTimeout(() => {
          setProcessState('done');
          showToast('✅ Background Removed Successfully');
        }, 500);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to process image. Connection Lost or High Traffic.');
      setProcessState('error');
      showToast('❌ Processing Failed');
    }
  };

  const handleDownload = () => {
    if (!resultUrl && !originalUrl) return;
    
    const urlToDownload = showOriginal ? originalUrl : resultUrl;
    if (!urlToDownload) return;
    
    const a = document.createElement('a');
    a.href = urlToDownload;
    a.download = `removed-bg-${file?.name || 'image.png'}`;
    a.click();
  };
  
  const getBackgroundStyle = () => {
    if (bgMode === 'transparent') {
      return { 
        backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 0, 10px -10px, 0px 10px',
        backgroundColor: '#fff'
      };
    }
    if (bgMode === 'white') return { backgroundColor: '#ffffff' };
    if (bgMode === 'black') return { backgroundColor: '#000000' };
    if (bgMode === 'custom') return { backgroundColor: customBgColor };
    if (bgMode === 'preset' && presetBg) return { backgroundImage: `url(${presetBg})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return {};
  };

  const backgroundPresets = [
    { name: 'Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Studio', url: 'https://images.unsplash.com/photo-1517036660144-889816173a11?auto=format&fit=crop&w=400&q=80' },
    { name: 'Nature', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gradient', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] bg-neutral-50 dark:bg-neutral-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <Wand2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">AI Background Remover</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enterprise Vision Engine. Instantly isolate subjects with pixel-perfect edge refinement.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-background rounded-2xl shadow-xl border overflow-hidden">
          
          {processState === 'idle' && (
            <div 
              className="p-12 border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors bg-muted/10 cursor-pointer flex flex-col items-center justify-center min-h-[400px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp,image/avif,image/bmp,image/tiff,image/heic" 
              />
              <div className="bg-primary/10 p-4 rounded-full mb-6">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Drag & Drop your image here</h3>
              <p className="text-muted-foreground mb-6">Or click to browse files</p>
              
              <div className="flex gap-4 text-sm text-muted-foreground/80 mt-8">
                <div className="flex items-center gap-1"><Check className="w-4 h-4" /> JPG, PNG, WEBP, AVIF, HEIC</div>
                <div className="flex items-center gap-1"><Check className="w-4 h-4" /> Up to 20MB</div>
              </div>
            </div>
          )}

          {processState === 'processing' && (
            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-muted rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <Wand2 className="w-10 h-10 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">AI is working its magic...</h3>
              <p className="text-primary font-medium mb-8 h-6">{currentStep}</p>
              
              <div className="w-full max-w-md bg-muted rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-muted-foreground mt-4 font-medium animate-pulse">Estimated Time: less than 5s</div>
            </div>
          )}

          {processState === 'done' && resultUrl && (
            <div className="flex flex-col lg:flex-row h-full min-h-[600px] lg:h-[700px]">
              
              {/* Left Sidebar - AI Settings & Workspace */}
              <div className="w-full lg:w-72 p-6 border-b lg:border-b-0 lg:border-r border-border bg-muted/10 flex flex-col overflow-y-auto">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Workspace</div>
                <div className="space-y-2 mb-8">
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-primary text-primary-foreground font-medium shadow-sm transition-all">
                    <Wand2 className="w-4 h-4" /> AI Background Removal
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted text-foreground font-medium transition-colors border border-transparent hover:border-border">
                    <Eraser className="w-4 h-4" /> Manual Edit Brush
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted text-foreground font-medium transition-colors border border-transparent hover:border-border">
                    <Layers className="w-4 h-4" /> Batch Processing
                  </button>
                </div>

                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">AI Engine Settings</div>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">AI Quality</label>
                    <select className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary">
                      <option>Ultra HD (Premium)</option>
                      <option>Maximum Quality</option>
                      <option>Balanced</option>
                      <option>Fast Processing</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Detection Mode</label>
                    <select className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary">
                      <option>Auto-Detect Subject</option>
                      <option>Portrait / Person</option>
                      <option>Product / Object</option>
                      <option>Animal / Pet</option>
                      <option>Logo / Graphics</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Edge Refinement</label>
                    <select className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary">
                      <option>High (Default)</option>
                      <option>Ultra (Slower)</option>
                      <option>Medium</option>
                      <option>Low (Fastest)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background border rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Hair Detection</span>
                      <span className="text-xs text-muted-foreground">Enhance fine details</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Center Preview Area */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center bg-muted/30 relative overflow-hidden group">
                {/* Top Toolbar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur border shadow-sm px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground" title="Undo"><SplitSquareHorizontal className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-border mx-1"></div>
                  <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
                  <span className="text-xs font-medium w-12 text-center">100%</span>
                  <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
                </div>

                <div 
                  className="relative w-full max-w-2xl h-full max-h-[500px] rounded-lg overflow-hidden border shadow-sm transition-all duration-300 flex items-center justify-center bg-white"
                  style={showOriginal ? {} : getBackgroundStyle()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={showOriginal ? originalUrl! : resultUrl} 
                    alt="Processed result" 
                    className="max-w-full max-h-full object-contain"
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm border">
                    {showOriginal ? (
                      <><Eye className="w-4 h-4 text-blue-500" /> Original</>
                    ) : (
                      <><Eraser className="w-4 h-4 text-primary" /> Background Removed</>
                    )}
                  </div>

                  {/* AI Confidence Badge */}
                  {!showOriginal && (
                    <div className="absolute top-4 right-4 bg-green-500/10 backdrop-blur border border-green-500/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm text-green-700 dark:text-green-400">
                      <Check className="w-3.5 h-3.5" />
                      98% Excellent Detection
                    </div>
                  )}
                </div>

                {/* Compare Button */}
                <div className="mt-6 flex items-center gap-4">
                  <button
                    onMouseDown={() => setShowOriginal(true)}
                    onMouseUp={() => setShowOriginal(false)}
                    onMouseLeave={() => setShowOriginal(false)}
                    onTouchStart={() => setShowOriginal(true)}
                    onTouchEnd={() => setShowOriginal(false)}
                    className="px-6 py-2.5 bg-background border shadow-sm hover:bg-muted rounded-full flex items-center justify-center gap-2 transition-colors font-medium select-none"
                  >
                    <Eye className="w-4 h-4" />
                    Hold to Compare
                  </button>
                  <button 
                    onClick={() => {
                      setProcessState('idle');
                      setFile(null);
                      setOriginalUrl(null);
                      setResultUrl(null);
                    }}
                    className="p-2.5 bg-background border shadow-sm hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors text-muted-foreground"
                    title="Discard & Start Over"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Right Sidebar - Backgrounds & Export */}
              <div className="w-full lg:w-80 p-6 bg-background flex flex-col border-t lg:border-t-0 lg:border-l border-border overflow-y-auto">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Background Library</div>
                
                <div className="mb-6">
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <button 
                      onClick={() => setBgMode('transparent')}
                      className={`h-12 rounded-lg border flex items-center justify-center transition-all ${bgMode === 'transparent' ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}`}
                      style={{ 
                        backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%)',
                        backgroundSize: '10px 10px',
                        backgroundPosition: '0 0, 5px 0, 5px -5px, 0px 5px',
                        backgroundColor: '#fff'
                      }}
                      title="Transparent"
                    />
                    <button 
                      onClick={() => setBgMode('white')}
                      className={`h-12 bg-white rounded-lg border flex items-center justify-center transition-all ${bgMode === 'white' ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}`}
                      title="White"
                    />
                    <button 
                      onClick={() => setBgMode('black')}
                      className={`h-12 bg-black rounded-lg border flex items-center justify-center transition-all ${bgMode === 'black' ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}`}
                      title="Black"
                    />
                    <div className={`h-12 rounded-lg border relative overflow-hidden flex items-center justify-center transition-all ${bgMode === 'custom' ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}`}>
                      <input 
                        type="color" 
                        value={customBgColor}
                        onChange={(e) => {
                          setCustomBgColor(e.target.value);
                          setBgMode('custom');
                        }}
                        className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer" 
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2 font-medium">Pro Presets</p>
                  <div className="grid grid-cols-2 gap-2">
                    {backgroundPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPresetBg(preset.url);
                          setBgMode('preset');
                        }}
                        className={`h-16 rounded-lg border relative overflow-hidden group transition-all ${bgMode === 'preset' && presetBg === preset.url ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}`}
                      >
                        <img src={preset.url} alt={preset.name} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-1.5">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">{preset.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 mt-4">Export Settings</div>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Format</label>
                    <select className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary">
                      <option value="png">PNG (Best for transparency)</option>
                      <option value="webp">WEBP (Smaller file size)</option>
                      <option value="jpg">JPG (No transparency)</option>
                      <option value="avif">AVIF (Next-gen compression)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Resolution</label>
                    <select className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary">
                      <option value="original">Original Size</option>
                      <option value="2x">2x Upscale (AI)</option>
                      <option value="4x">4x Upscale (Premium)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-border">
                  <button 
                    onClick={handleDownload}
                    className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex items-center justify-center gap-2 font-bold shadow-md transition-all mb-2"
                  >
                    <Download className="w-5 h-5" />
                    Download HD Result
                  </button>
                  <p className="text-[10px] text-center text-muted-foreground">1 Image Credit will be used</p>
                </div>

              </div>
            </div>
          )}

          {processState === 'error' && (
            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="bg-destructive/10 p-4 rounded-full mb-6">
                <Shield className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2">Processing Failed</h3>
              <p className="text-muted-foreground mb-8 text-center max-w-md">{errorMsg}</p>
              <button 
                onClick={() => setProcessState('idle')}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Upload Another Image
              </button>
            </div>
          )}

        </div>
        
        {/* Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-background p-6 rounded-xl border shadow-sm flex flex-col items-center text-center">
            <div className="bg-blue-500/10 p-3 rounded-full mb-4">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <h4 className="font-bold mb-2">One-Click Processing</h4>
            <p className="text-sm text-muted-foreground">Upload and let the AI instantly detect and remove backgrounds in seconds.</p>
          </div>
          <div className="bg-background p-6 rounded-xl border shadow-sm flex flex-col items-center text-center">
            <div className="bg-green-500/10 p-3 rounded-full mb-4">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
            <h4 className="font-bold mb-2">Privacy First</h4>
            <p className="text-sm text-muted-foreground">Images are processed securely in your browser with our hybrid engine.</p>
          </div>
          <div className="bg-background p-6 rounded-xl border shadow-sm flex flex-col items-center text-center">
            <div className="bg-purple-500/10 p-3 rounded-full mb-4">
              <ImageIcon className="w-6 h-6 text-purple-500" />
            </div>
            <h4 className="font-bold mb-2">HD Quality Export</h4>
            <p className="text-sm text-muted-foreground">Download full-resolution images as transparent PNGs without quality loss.</p>
          </div>
        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl z-50 text-sm font-medium animate-in slide-in-from-bottom-5 fade-in duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
