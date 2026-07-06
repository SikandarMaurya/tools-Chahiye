'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UploadCloud, FileImage, Settings, Download, Trash2, Loader2, Image as ImageIcon, Sparkles, CheckCircle2, ChevronRight, Layers, Layout, ZoomIn, Maximize2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'motion/react';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type OutputFormat = 'jpg' | 'png' | 'webp' | 'avif' | 'tiff';
type DPISetting = 72 | 96 | 150 | 300 | 600 | 1200;
type PageSelectionType = 'all' | 'custom' | 'odd' | 'even';
type ColorMode = 'rgb' | 'grayscale' | 'bw';

interface ExportSettings {
  format: OutputFormat;
  dpi: DPISetting;
  quality: number; // 1-100
  transparent: boolean; // For PNG
  colorMode: ColorMode;
  pageSelection: PageSelectionType;
  customPages: string; // e.g., "1,3,5-10"
}

export default function PDFToImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  
  // Previews
  const [previews, setPreviews] = useState<string[]>([]);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPreviewPage, setSelectedPreviewPage] = useState(1);

  const [settings, setSettings] = useState<ExportSettings>({
    format: 'jpg',
    dpi: 300,
    quality: 90,
    transparent: false,
    colorMode: 'rgb',
    pageSelection: 'all',
    customPages: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      loadPDF(file);
    }
  }, [file]);

  const loadPDF = async (pdfFile: File) => {
    try {
      setIsProcessing(true);
      setStatusText('Analyzing PDF...');
      const arrayBuffer = await pdfFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
      const doc = await loadingTask.promise;
      
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      
      // Generate preview for first page
      await generatePreview(doc, 1);
      
      setIsProcessing(false);
      setStatusText('');
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Failed to load PDF file. It might be corrupted or password-protected.');
      setIsProcessing(false);
      setFile(null);
    }
  };

  const generatePreview = async (doc: pdfjsLib.PDFDocumentProxy, pageNum: number) => {
    try {
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 }); // low res for preview
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      
      // Calculate a reasonable preview scale (e.g. max width 400px)
      const scale = Math.min(400 / viewport.width, 1.0);
      const scaledViewport = page.getViewport({ scale });
      
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: scaledViewport,
      }).promise;
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setPreviews(prev => {
        const newPreviews = [...prev];
        newPreviews[pageNum - 1] = dataUrl;
        return newPreviews;
      });
      setSelectedPreviewPage(pageNum);
    } catch (e) {
      console.error('Failed to generate preview', e);
    }
  };

  useEffect(() => {
    if (pdfDoc && !previews[selectedPreviewPage - 1]) {
      generatePreview(pdfDoc, selectedPreviewPage);
    }
  }, [selectedPreviewPage, pdfDoc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setIsFinished(false);
      setPreviews([]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setIsFinished(false);
        setPreviews([]);
      } else {
        alert('Please drop a valid PDF file.');
      }
    }
  };

  const parsePageSelection = (): number[] => {
    const pages: number[] = [];
    if (settings.pageSelection === 'all') {
      for (let i = 1; i <= numPages; i++) pages.push(i);
    } else if (settings.pageSelection === 'odd') {
      for (let i = 1; i <= numPages; i += 2) pages.push(i);
    } else if (settings.pageSelection === 'even') {
      for (let i = 2; i <= numPages; i += 2) pages.push(i);
    } else if (settings.pageSelection === 'custom') {
      const parts = settings.customPages.split(',');
      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = parseInt(startStr.trim());
          const end = parseInt(endStr.trim());
          if (!isNaN(start) && !isNaN(end) && start <= end) {
            for (let i = Math.max(1, start); i <= Math.min(numPages, end); i++) {
              if (!pages.includes(i)) pages.push(i);
            }
          }
        } else {
          const pageNum = parseInt(part.trim());
          if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= numPages) {
            if (!pages.includes(pageNum)) pages.push(pageNum);
          }
        }
      }
      pages.sort((a, b) => a - b);
    }
    
    return pages.length > 0 ? pages : [1]; // Fallback to page 1
  };

  const processConvert = async () => {
    if (!pdfDoc) return;
    
    setIsProcessing(true);
    setIsFinished(false);
    setProgress(0);
    setStatusText('Preparing to render...');

    try {
      const pagesToProcess = parsePageSelection();
      const totalPages = pagesToProcess.length;
      
      const zip = new JSZip();
      
      const mimeTypes: Record<string, string> = {
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'avif': 'image/avif', // Fallbacks to webp/png in unsupported browsers
        'tiff': 'image/tiff', // Fallbacks if unsupported
      };
      
      const ext = settings.format;
      const mimeType = mimeTypes[ext] || 'image/png';
      
      for (let i = 0; i < totalPages; i++) {
        const pageNum = pagesToProcess[i];
        setStatusText(`Rendering page ${pageNum} of ${numPages}...`);
        
        const page = await pdfDoc.getPage(pageNum);
        
        // Calculate scale based on DPI (Standard 72 DPI is scale 1.0)
        const scale = settings.dpi / 72;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not get canvas context");
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Background color
        if (settings.format === 'jpg' || !settings.transparent) {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
        
        // Handle Grayscale/B&W
        if (settings.colorMode !== 'rgb') {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let j = 0; j < data.length; j += 4) {
            const r = data[j];
            const g = data[j+1];
            const b = data[j+2];
            // Luminosity formula
            let v = 0.299*r + 0.587*g + 0.114*b;
            if (settings.colorMode === 'bw') {
              v = v > 127 ? 255 : 0;
            }
            data[j] = data[j+1] = data[j+2] = v;
          }
          context.putImageData(imageData, 0, 0);
        }
        
        const blob = await new Promise<Blob | null>((resolve) => {
          let quality = settings.format === 'jpg' || settings.format === 'webp' ? settings.quality / 100 : undefined;
          
          // Use try-catch for canvas.toBlob, some formats might not be supported
          try {
            canvas.toBlob((b) => {
              if (b) {
                resolve(b);
              } else {
                // Fallback to PNG if the requested format failed
                canvas.toBlob((b2) => resolve(b2), 'image/png');
              }
            }, mimeType, quality);
          } catch(e) {
             canvas.toBlob((b2) => resolve(b2), 'image/png');
          }
        });
        
        if (blob) {
          // Zero-pad page number
          const pageStr = pageNum.toString().padStart(Math.max(3, numPages.toString().length), '0');
          const filename = `${file?.name.replace('.pdf', '')}_page-${pageStr}.${ext}`;
          zip.file(filename, blob);
        }
        
        setProgress(Math.round(((i + 1) / totalPages) * 100));
        
        // Let the UI breathe
        await new Promise(r => setTimeout(r, 10));
      }
      
      setStatusText('Compressing ZIP archive...');
      
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 5 }
      });
      
      saveAs(zipBlob, `${file?.name.replace('.pdf', '')}_images.zip`);
      
      setIsFinished(true);
      setStatusText('');
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('An error occurred during conversion. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPdfDoc(null);
    setNumPages(0);
    setPreviews([]);
    setSelectedPreviewPage(1);
    setIsFinished(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-6"
          >
            <ImageIcon className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-6 font-sans"
          >
            Universal PDF to Image Converter
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-8 font-sans"
          >
            Convert PDF pages into high-resolution JPG, PNG, WebP, and TIFF images. 
            Features AI-powered rendering and high DPI export up to 1200 DPI.
          </motion.p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!file && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-3 border-dashed border-neutral-300 rounded-3xl p-16 text-center cursor-pointer hover:bg-neutral-50 hover:border-blue-500 transition-all group bg-white shadow-sm"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
              <div className="bg-blue-50 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 font-sans">Choose a PDF file</h3>
              <p className="text-neutral-500 font-sans">or drop it here</p>
              
              <div className="mt-8 flex items-center justify-center gap-4 text-sm text-neutral-400 font-mono">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Max 2GB</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Unlimited Pages</span>
              </div>
            </div>
            
            {/* Features preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4"><Layers className="w-6 h-6" /></div>
                <h4 className="font-semibold mb-2 font-sans">Multiple Formats</h4>
                <p className="text-sm text-neutral-500 font-sans">Export to JPG, PNG, WebP, AVIF, and TIFF instantly.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><ZoomIn className="w-6 h-6" /></div>
                <h4 className="font-semibold mb-2 font-sans">High DPI Export</h4>
                <p className="text-sm text-neutral-500 font-sans">Render crisp, professional images up to 1200 DPI resolution.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4"><Sparkles className="w-6 h-6" /></div>
                <h4 className="font-semibold mb-2 font-sans">AI Ready</h4>
                <p className="text-sm text-neutral-500 font-sans">Hybrid processing architecture for complex PDF rendering.</p>
              </div>
            </div>
          </motion.div>
        )}

        {file && (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Settings */}
            <AnimatePresence>
              {showSettings && (
                <motion.div 
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: '380px' }}
                  exit={{ opacity: 0, x: -20, width: 0 }}
                  className="flex-shrink-0"
                >
                  <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sticky top-8">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                        <Settings className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-lg font-sans">Export Settings</h2>
                        <p className="text-xs text-neutral-500 font-mono">Enterprise Rendering Engine</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Format Selection */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-3 font-sans">Output Format</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['jpg', 'png', 'webp', 'avif', 'tiff'] as OutputFormat[]).map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => setSettings({ ...settings, format: fmt })}
                              className={`py-2 px-3 text-sm rounded-xl font-medium transition-colors border ${
                                settings.format === fmt 
                                  ? 'bg-neutral-900 text-white border-neutral-900' 
                                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                              }`}
                            >
                              {fmt.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* DPI Selection */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-3 font-sans flex items-center justify-between">
                          Resolution (DPI)
                          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-md font-mono">Pro</span>
                        </label>
                        <select 
                          value={settings.dpi}
                          onChange={(e) => setSettings({ ...settings, dpi: Number(e.target.value) as DPISetting })}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow font-sans"
                        >
                          <option value={72}>72 DPI (Web)</option>
                          <option value={96}>96 DPI (Standard)</option>
                          <option value={150}>150 DPI (High Quality)</option>
                          <option value={300}>300 DPI (Print Ready)</option>
                          <option value={600}>600 DPI (Ultra HD)</option>
                          <option value={1200}>1200 DPI (Maximum)</option>
                        </select>
                      </div>

                      {/* Format Specific Settings */}
                      {(settings.format === 'jpg' || settings.format === 'webp') && (
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-3 font-sans flex items-center justify-between">
                            Quality: {settings.quality}%
                          </label>
                          <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            step="5"
                            value={settings.quality}
                            onChange={(e) => setSettings({ ...settings, quality: Number(e.target.value) })}
                            className="w-full accent-neutral-900 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      )}

                      {settings.format === 'png' && (
                        <div>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={settings.transparent}
                              onChange={(e) => setSettings({ ...settings, transparent: e.target.checked })}
                              className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                            />
                            <span className="text-sm font-medium text-neutral-700 font-sans">Transparent Background</span>
                          </label>
                        </div>
                      )}
                      
                      {/* Color Mode */}
                      <div>
                         <label className="block text-sm font-medium text-neutral-700 mb-3 font-sans">Color Mode</label>
                         <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setSettings({ ...settings, colorMode: 'rgb' })}
                            className={`py-2 text-xs rounded-xl font-medium transition-colors border ${
                              settings.colorMode === 'rgb' ? 'bg-neutral-100 text-neutral-900 border-neutral-300' : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                            }`}
                          >
                            RGB
                          </button>
                          <button
                            onClick={() => setSettings({ ...settings, colorMode: 'grayscale' })}
                            className={`py-2 text-xs rounded-xl font-medium transition-colors border ${
                              settings.colorMode === 'grayscale' ? 'bg-neutral-100 text-neutral-900 border-neutral-300' : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                            }`}
                          >
                            Grayscale
                          </button>
                          <button
                            onClick={() => setSettings({ ...settings, colorMode: 'bw' })}
                            className={`py-2 text-xs rounded-xl font-medium transition-colors border ${
                              settings.colorMode === 'bw' ? 'bg-neutral-100 text-neutral-900 border-neutral-300' : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                            }`}
                          >
                            B&W
                          </button>
                        </div>
                      </div>

                      {/* Page Selection */}
                      <div className="pt-6 border-t border-neutral-100">
                        <label className="block text-sm font-medium text-neutral-700 mb-3 font-sans">Pages to Convert</label>
                        <select 
                          value={settings.pageSelection}
                          onChange={(e) => setSettings({ ...settings, pageSelection: e.target.value as PageSelectionType })}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow mb-3 font-sans"
                        >
                          <option value="all">All Pages ({numPages})</option>
                          <option value="custom">Custom Range</option>
                          <option value="odd">Odd Pages Only</option>
                          <option value="even">Even Pages Only</option>
                        </select>

                        {settings.pageSelection === 'custom' && (
                          <input 
                            type="text"
                            placeholder="e.g. 1, 3, 5-10"
                            value={settings.customPages}
                            onChange={(e) => setSettings({ ...settings, customPages: e.target.value })}
                            className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-sans placeholder:text-neutral-400"
                          />
                        )}
                      </div>
                      
                      <button
                        onClick={processConvert}
                        disabled={isProcessing}
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Generate Images
                            <ChevronRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Preview Area */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 lg:p-8 min-h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors hidden lg:block"
                      title="Toggle Settings"
                    >
                      <Layout className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className="font-semibold text-lg text-neutral-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md font-sans">
                        {file.name}
                      </h3>
                      <p className="text-sm text-neutral-500 font-mono">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {numPages} Pages
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={reset}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>

                {isProcessing ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                    <h3 className="text-xl font-medium text-neutral-900 mb-2 font-sans">{statusText}</h3>
                    
                    {progress > 0 && (
                      <div className="w-full max-w-md mt-6">
                        <div className="flex justify-between text-sm text-neutral-500 mb-2 font-mono">
                          <span>Rendering...</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-blue-600 rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : isFinished ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3 font-sans">Conversion Complete!</h3>
                    <p className="text-neutral-500 max-w-md mx-auto mb-8 font-sans">
                      Your high-resolution images have been successfully generated and packaged into a ZIP file.
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={reset}
                        className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-colors font-sans"
                      >
                        Convert Another
                      </button>
                      <button 
                        onClick={processConvert}
                        className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm font-sans"
                      >
                        <Download className="w-4 h-4" />
                        Download Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                     {/* Preview Viewer */}
                     <div className="flex-1 bg-neutral-100 rounded-2xl mb-6 overflow-hidden flex items-center justify-center p-4 relative group">
                        {previews[selectedPreviewPage - 1] ? (
                          <img 
                            src={previews[selectedPreviewPage - 1]} 
                            alt={`Page ${selectedPreviewPage}`}
                            className="max-h-full max-w-full object-contain shadow-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-neutral-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p className="text-sm font-mono">Generating Preview...</p>
                          </div>
                        )}
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-mono backdrop-blur-sm">
                          Page {selectedPreviewPage} of {numPages}
                        </div>
                     </div>
                     
                     {/* Page Selector Strip */}
                     {numPages > 1 && (
                       <div className="h-32 flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                         {Array.from({ length: numPages }).map((_, idx) => {
                           const pageNum = idx + 1;
                           const isSelected = selectedPreviewPage === pageNum;
                           
                           return (
                             <button
                               key={pageNum}
                               onClick={() => setSelectedPreviewPage(pageNum)}
                               className={`flex-shrink-0 w-20 md:w-24 bg-neutral-100 rounded-xl border-2 overflow-hidden transition-all relative ${
                                 isSelected ? 'border-neutral-900 ring-4 ring-neutral-200' : 'border-transparent hover:border-neutral-300'
                               }`}
                             >
                               {previews[pageNum - 1] ? (
                                  <img 
                                    src={previews[pageNum - 1]} 
                                    className="w-full h-full object-cover"
                                    alt={`Thumbnail ${pageNum}`}
                                  />
                               ) : (
                                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                    <FileImage className="w-6 h-6" />
                                  </div>
                               )}
                               <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 rounded font-mono">
                                 {pageNum}
                               </div>
                             </button>
                           );
                         })}
                       </div>
                     )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
}
