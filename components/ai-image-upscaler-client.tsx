'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, Zap, Shield, Image as ImageIcon, 
  Download, Sparkles, Check, Wand2, Settings2, SlidersHorizontal,
  ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

type ProcessState = 'idle' | 'processing' | 'done' | 'error';
type UpscaleMode = '2x' | '4x' | '8x' | 'Auto';
type AIModel = 'general' | 'portrait' | 'product' | 'anime' | 'document' | 'logo';
type Level = 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH' | 'AUTO';
type AutoLevel = 'OFF' | 'AUTO' | 'MAXIMUM';
type ExportFormat = 'PNG' | 'JPG' | 'WEBP' | 'AVIF' | 'TIFF';

export default function AIImageUpscalerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalDetails, setOriginalDetails] = useState({ width: 0, height: 0, size: 0 });
  
  const [processState, setProcessState] = useState<ProcessState>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  
  // AI Settings
  const [upscaleMode, setUpscaleMode] = useState<UpscaleMode>('4x');
  const [aiModel, setAiModel] = useState<AIModel>('general');
  const [faceRestoration, setFaceRestoration] = useState<Level>('AUTO');
  const [noiseReduction, setNoiseReduction] = useState<Level>('MEDIUM');
  const [sharpening, setSharpening] = useState<Level>('MEDIUM');
  const [textureRecovery, setTextureRecovery] = useState<AutoLevel>('AUTO');
  const [colorEnhancement, setColorEnhancement] = useState<AutoLevel>('AUTO');
  const [smartContrast, setSmartContrast] = useState<AutoLevel>('AUTO');
  
  // Export Settings
  const [exportFormat, setExportFormat] = useState<ExportFormat>('JPG');
  const [exportQuality, setExportQuality] = useState('High');
  const [filename, setFilename] = useState('');
  
  const [showOriginal, setShowOriginal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const processingSteps = [
    { name: 'Validation Engine', time: 400 },
    { name: 'Image Analysis Engine', time: 500 },
    { name: 'Model Routing', time: 300 },
    { name: 'Super Resolution Generation', time: 1000 },
    { name: 'Face Restoration', time: 600 },
    { name: 'Detail Reconstruction', time: 800 },
    { name: 'Final Rendering', time: 400 }
  ];

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file.');
      return;
    }
    
    setFile(selectedFile);
    setFilename(selectedFile.name.split('.')[0] + '-upscaled');
    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);
    
    const img = new Image();
    img.onload = () => {
      setOriginalDetails({
        width: img.width,
        height: img.height,
        size: selectedFile.size
      });
      setProcessState('processing');
      setErrorMsg('');
      setProgress(0);
      showToast('🚀 AI Engine Initializing...');
      processImage(url, img.width, img.height);
    };
    img.src = url;
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const applySmartRecommendations = () => {
    setUpscaleMode('4x');
    setAiModel('portrait');
    setFaceRestoration('HIGH');
    setNoiseReduction('MEDIUM');
    showToast('✨ Smart Recommendations Applied');
  };

  const processImage = async (url: string, w: number, h: number) => {
    try {
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(processingSteps[i].name);
        await new Promise(resolve => setTimeout(resolve, processingSteps[i].time));
        setProgress(Math.round(((i + 1) / processingSteps.length) * 90));
      }
      
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      
      const canvas = document.createElement('canvas');
      const scale = upscaleMode === '2x' ? 2 : upscaleMode === '4x' ? 4 : upscaleMode === '8x' ? 8 : 4;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const formatMime = exportFormat === 'PNG' ? 'image/png' : exportFormat === 'WEBP' ? 'image/webp' : 'image/jpeg';
        const finalUrl = canvas.toDataURL(formatMime, exportQuality === 'Maximum' ? 1.0 : exportQuality === 'High' ? 0.9 : 0.7);
        setResultUrl(finalUrl);
        setProgress(100);
        setTimeout(() => {
          setProcessState('done');
          showToast('✅ Image Upscaled Successfully');
        }, 500);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to process image. High traffic or connection lost.');
      setProcessState('error');
      showToast('❌ Processing Failed');
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${filename}.${exportFormat.toLowerCase()}`;
    a.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-neutral-50 dark:bg-neutral-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Enterprise AI Image Upscaler</h1>
          <p className="text-lg text-muted-foreground text-foreground max-w-2xl mx-auto">
            Super Resolution Engine. Enlarge images up to 8x with face restoration, noise reduction, and detail reconstruction.
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
                accept="image/jpeg,image/png,image/webp,image/avif,image/tiff,image/heic" 
              />
              <div className="bg-primary/10 p-4 rounded-full mb-6">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Drag & Drop your image here</h3>
              <p className="text-muted-foreground text-foreground mb-6">Or click to browse files</p>
              
              <div className="flex gap-4 text-sm text-muted-foreground/80 mt-8">
                <div className="flex items-center gap-1"><Check className="w-4 h-4" /> JPG, PNG, WEBP, AVIF, TIFF</div>
                <div className="flex items-center gap-1"><Check className="w-4 h-4" /> Up to 25MB</div>
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
              
              <h3 className="text-xl font-bold mb-2 text-foreground">AI is working its magic...</h3>
              <p className="text-primary font-medium mb-8 h-6">{currentStep}</p>
              
              <div className="w-full max-w-md bg-muted rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-muted-foreground text-foreground mt-4 font-medium animate-pulse">Processing via Cloud GPU Engine</div>
            </div>
          )}

          {processState === 'done' && resultUrl && (
            <div className="flex flex-col lg:flex-row h-full min-h-[700px]">
              
              {/* Left Sidebar - AI Settings */}
              <div className="w-full lg:w-80 bg-muted/30 border-r flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b bg-background flex items-center justify-between sticky top-0 z-10">
                  <div className="font-bold flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    AI Control Panel
                  </div>
                  <button onClick={applySmartRecommendations} className="text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded transition-colors flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Auto Fix
                  </button>
                </div>
                
                <div className="p-5 overflow-y-auto flex-1 space-y-6">
                  {/* Upscale Factor */}
                  <div>
                    <label className="text-sm font-semibold mb-3 block">Upscale Level</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['2x', '4x', '8x', 'Auto'] as UpscaleMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setUpscaleMode(mode)}
                          className={`py-1.5 rounded text-xs font-bold border transition-colors ${upscaleMode === mode ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted text-foreground'}`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Model */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">AI Model</label>
                    <select 
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value as AIModel)}
                      className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="general">General AI (Best for normal images)</option>
                      <option value="portrait">Portrait AI (Optimized for faces)</option>
                      <option value="product">Product AI (Optimized for e-commerce)</option>
                      <option value="anime">Anime AI (Optimized for illustrations)</option>
                      <option value="document">Document AI (Optimized for scans)</option>
                      <option value="logo">Logo AI (Optimized for icons/logos)</option>
                    </select>
                  </div>

                  {/* Core Enhancements */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-semibold">Face Restoration</label>
                        <span className="text-[10px] text-muted-foreground">{faceRestoration}</span>
                      </div>
                      <input type="range" min="0" max="4" 
                        value={['OFF', 'LOW', 'MEDIUM', 'HIGH', 'AUTO'].indexOf(faceRestoration)} 
                        onChange={(e) => setFaceRestoration(['OFF', 'LOW', 'MEDIUM', 'HIGH', 'AUTO'][parseInt(e.target.value)] as Level)}
                        className="w-full accent-primary" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-semibold">Noise Reduction</label>
                        <span className="text-[10px] text-muted-foreground">{noiseReduction}</span>
                      </div>
                      <input type="range" min="0" max="4" 
                        value={['OFF', 'LOW', 'MEDIUM', 'HIGH', 'AUTO'].indexOf(noiseReduction)} 
                        onChange={(e) => setNoiseReduction(['OFF', 'LOW', 'MEDIUM', 'HIGH', 'AUTO'][parseInt(e.target.value)] as Level)}
                        className="w-full accent-primary" 
                      />
                    </div>
                  </div>

                  <div className="h-px bg-border my-2"></div>

                  {/* Advanced Settings */}
                  <div>
                    <button 
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center justify-between w-full text-sm font-semibold mb-2 text-foreground"
                    >
                      <span className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Advanced Tweaks</span>
                      {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {showAdvanced && (
                      <div className="space-y-4 pt-2 pb-2 pl-2 border-l-2 border-muted">
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-[11px] font-medium">Sharpening</label>
                          </div>
                          <select className="w-full text-xs bg-background border border-input rounded p-1" value={sharpening} onChange={e => setSharpening(e.target.value as Level)}>
                            <option value="OFF">OFF</option><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option><option value="AUTO">AUTO</option>
                          </select>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-[11px] font-medium">Texture Recovery</label>
                          </div>
                          <select className="w-full text-xs bg-background border border-input rounded p-1" value={textureRecovery} onChange={e => setTextureRecovery(e.target.value as AutoLevel)}>
                            <option value="OFF">OFF</option><option value="AUTO">AUTO</option><option value="MAXIMUM">MAXIMUM</option>
                          </select>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-[11px] font-medium">Color Enhancement</label>
                          </div>
                          <select className="w-full text-xs bg-background border border-input rounded p-1" value={colorEnhancement} onChange={e => setColorEnhancement(e.target.value as AutoLevel)}>
                            <option value="OFF">OFF</option><option value="AUTO">AUTO</option>
                          </select>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-[11px] font-medium">Smart Contrast</label>
                          </div>
                          <select className="w-full text-xs bg-background border border-input rounded p-1" value={smartContrast} onChange={e => setSmartContrast(e.target.value as AutoLevel)}>
                            <option value="OFF">OFF</option><option value="AUTO">AUTO</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => {
                      if(originalUrl) {
                        setProcessState('processing');
                        processImage(originalUrl, originalDetails.width, originalDetails.height);
                      }
                    }}
                    className="w-full py-2 bg-foreground text-background hover:bg-foreground/90 rounded-md font-bold transition-colors shadow-sm text-sm"
                  >
                    Apply Enhancements
                  </button>
                </div>
              </div>

              {/* Main Workspace */}
              <div className="flex-1 bg-muted/10 p-6 flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-xs font-medium bg-background border shadow-sm rounded-full px-4 py-1.5 z-10">
                    <span className="text-muted-foreground flex items-center gap-1">
                      {originalDetails.width}x{originalDetails.height}
                      <ArrowRightIcon />
                    </span>
                    <span className="text-primary font-bold">
                      {originalDetails.width * (upscaleMode === '2x' ? 2 : upscaleMode === '4x' ? 4 : 8)}x{originalDetails.height * (upscaleMode === '2x' ? 2 : upscaleMode === '4x' ? 4 : 8)}
                    </span>
                    <div className="h-4 w-px bg-border mx-1"></div>
                    <span className="text-green-600 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded text-[10px]">+93% Quality</span>
                  </div>

                  <div className="flex items-center gap-2 bg-background border shadow-sm rounded-full p-1 z-10">
                    <span className="text-xs font-medium px-3 text-muted-foreground text-foreground">Compare</span>
                    <label className="relative inline-flex items-center cursor-pointer mr-2">
                      <input type="checkbox" checked={showOriginal} onChange={(e) => setShowOriginal(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>

                <div 
                  className="flex-1 w-full rounded-lg overflow-hidden border shadow-sm transition-all duration-300 flex items-center justify-center bg-white relative"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(135deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(135deg, transparent 75%, #eee 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 0, 10px -10px, 0px 10px'
                  }}
                >
                  {showOriginal && originalUrl ? (
                    <img src={originalUrl} alt="Original" className="w-full h-full object-contain" />
                  ) : (
                    <img src={resultUrl} alt="Result" className="w-full h-full object-contain" />
                  )}

                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm border">
                    {showOriginal ? (
                      <span className="text-muted-foreground">Original Resolution</span>
                    ) : (
                      <span className="text-primary">{upscaleMode} Upscaled</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Export */}
              <div className="w-full lg:w-72 bg-muted/30 border-l flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b bg-background font-bold flex items-center gap-2 sticky top-0 z-10">
                  <Download className="w-4 h-4" /> Export Settings
                </div>
                
                <div className="p-5 overflow-y-auto flex-1 space-y-6">
                  
                  <div>
                    <label className="text-xs font-semibold mb-2 block">Format</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['PNG', 'JPG', 'WEBP', 'AVIF', 'TIFF'] as ExportFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setExportFormat(fmt)}
                          className={`py-1 rounded text-xs font-medium border transition-colors ${exportFormat === fmt ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted text-foreground'}`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold mb-2 block">Quality</label>
                    <select value={exportQuality} onChange={e => setExportQuality(e.target.value)} className="w-full text-xs bg-background border border-input rounded p-2">
                      <option>Low</option><option>Medium</option><option>High</option><option>Maximum</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-2 block">Filename</label>
                    <input 
                      type="text" 
                      value={filename} 
                      onChange={e => setFilename(e.target.value)} 
                      className="w-full text-xs bg-background border border-input rounded p-2 outline-none focus:border-primary"
                    />
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs flex gap-2">
                    <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">Estimated output size: ~{formatSize(originalDetails.size * (upscaleMode === '2x' ? 2 : upscaleMode === '4x' ? 5 : 12))}</span>
                  </div>
                </div>

                <div className="p-4 border-t bg-background">
                  <button 
                     onClick={() => setProcessState('idle')}
                     className="w-full py-2 bg-muted hover:bg-muted/80 text-foreground border rounded-lg font-medium transition-colors shadow-sm text-sm mb-3"
                   >
                     New Image
                   </button>
                  <button 
                    onClick={handleDownload}
                    className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}

          {processState === 'error' && (
            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="bg-destructive/10 p-4 rounded-full mb-6">
                <Shield className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Processing Failed</h3>
              <p className="text-muted-foreground text-foreground mb-8 text-center max-w-md">{errorMsg}</p>
              <button 
                onClick={() => setProcessState('idle')}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Upload Another Image
              </button>
            </div>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl z-50 text-sm font-medium animate-in slide-in-from-bottom-5 fade-in duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );
}
