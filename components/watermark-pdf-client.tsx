'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, Download, Trash2, Loader2, Settings2, AlertCircle, FileOutput, CheckSquare, Type, Image as ImageIcon, Grid3X3, Layers
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type Position = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

type WatermarkConfig = {
  type: 'text' | 'image';
  text: string;
  fontFamily: 'Helvetica' | 'TimesRoman' | 'Courier';
  fontSize: number;
  color: string;
  opacity: number;
  rotation: number;
  position: Position;
  margin: number;
  imageFile: File | null;
  imageScale: number;
  pages: 'all' | 'odd' | 'even' | 'custom';
  customRange: string;
};

export default function WatermarkPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'processing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
  const [numPages, setNumPages] = useState(0);

  const [config, setConfig] = useState<WatermarkConfig>({
    type: 'text',
    text: 'CONFIDENTIAL',
    fontFamily: 'Helvetica',
    fontSize: 48,
    color: '#000000',
    opacity: 50,
    rotation: 45,
    position: 'center',
    margin: 30,
    imageFile: null,
    imageScale: 50,
    pages: 'all',
    customRange: ''
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (resultPdfUrl) URL.revokeObjectURL(resultPdfUrl);
      if (previewThumbnail) URL.revokeObjectURL(previewThumbnail);
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, []);

  const handleFileUpload = async (uploadedFile: File) => {
    if (uploadedFile.type !== 'application/pdf') {
      setErrorMsg('Please upload a valid PDF file.');
      setStatus('error');
      return;
    }
    
    if (previewThumbnail) URL.revokeObjectURL(previewThumbnail);
    if (resultPdfUrl) URL.revokeObjectURL(resultPdfUrl);
    
    setFile(uploadedFile);
    setStatus('loading');
    setErrorMsg('');
    
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      setPdfBytes(uint8Array);
      
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array.slice(0) });
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);
      
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      if (ctx) {
        await page.render({ canvasContext: ctx, viewport }).promise;
      }
      
      setPreviewThumbnail(canvas.toDataURL('image/jpeg', 0.9));
      setPreviewDimensions({ width: viewport.width, height: viewport.height });
      setStatus('ready');
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load PDF.');
      setStatus('error');
    }
  };

  const handleImageUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      setConfig({ ...config, imageFile: file });
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  const parsePagesRange = (rangeStr: string, maxPages: number): Set<number> => {
    const pages = new Set<number>();
    if (!rangeStr.trim()) return pages;
    
    const parts = rangeStr.split(',');
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr.trim());
        const end = parseInt(endStr.trim());
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= maxPages) pages.add(i);
          }
        }
      } else {
        const page = parseInt(part.trim());
        if (!isNaN(page) && page > 0 && page <= maxPages) {
          pages.add(page);
        }
      }
    }
    return pages;
  };

  const handleApply = async () => {
    if (!pdfBytes) return;
    setStatus('processing');
    
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      
      let font;
      if (config.type === 'text') {
        if (config.fontFamily === 'Courier') font = await pdfDoc.embedFont(StandardFonts.Courier);
        else if (config.fontFamily === 'TimesRoman') font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        else font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      }

      let imageEmbed;
      let imgDims;
      if (config.type === 'image' && config.imageFile) {
        const imageBytes = await config.imageFile.arrayBuffer();
        if (config.imageFile.type === 'image/png') {
          imageEmbed = await pdfDoc.embedPng(imageBytes);
        } else if (config.imageFile.type === 'image/jpeg' || config.imageFile.type === 'image/jpg') {
          imageEmbed = await pdfDoc.embedJpg(imageBytes);
        } else {
          throw new Error('Only PNG and JPG images are supported for PDF watermarks.');
        }
      }

      const targetPages = new Set<number>();
      if (config.pages === 'all') {
        for (let i = 1; i <= numPages; i++) targetPages.add(i);
      } else if (config.pages === 'odd') {
        for (let i = 1; i <= numPages; i += 2) targetPages.add(i);
      } else if (config.pages === 'even') {
        for (let i = 2; i <= numPages; i += 2) targetPages.add(i);
      } else if (config.pages === 'custom') {
        const custom = parsePagesRange(config.customRange, numPages);
        custom.forEach(p => targetPages.add(p));
      }
      
      const rgbColor = hexToRgb(config.color);
      const opacity = config.opacity / 100;

      for (let i = 0; i < pages.length; i++) {
        if (!targetPages.has(i + 1)) continue;
        const page = pages[i];
        const { width, height } = page.getSize();
        
        let itemWidth = 0;
        let itemHeight = 0;

        if (config.type === 'text' && font) {
          itemWidth = font.widthOfTextAtSize(config.text, config.fontSize);
          itemHeight = font.heightAtSize(config.fontSize);
        } else if (config.type === 'image' && imageEmbed) {
          const dims = imageEmbed.scale(config.imageScale / 100);
          itemWidth = dims.width;
          itemHeight = dims.height;
          imgDims = dims;
        }

        if (itemWidth === 0) continue;

        let x = 0;
        let y = 0;
        const margin = config.margin;

        // Position mapping
        switch (config.position) {
          case 'top-left':
            x = margin;
            y = height - itemHeight - margin;
            break;
          case 'top-center':
            x = width / 2;
            y = height - itemHeight - margin;
            break;
          case 'top-right':
            x = width - margin;
            y = height - itemHeight - margin;
            break;
          case 'center-left':
            x = margin;
            y = height / 2;
            break;
          case 'center':
            x = width / 2;
            y = height / 2;
            break;
          case 'center-right':
            x = width - margin;
            y = height / 2;
            break;
          case 'bottom-left':
            x = margin;
            y = margin + itemHeight;
            break;
          case 'bottom-center':
            x = width / 2;
            y = margin + itemHeight;
            break;
          case 'bottom-right':
            x = width - margin;
            y = margin + itemHeight;
            break;
        }

        // Adjust for rotation and origin offsets to match center alignments
        // Actually, drawText and drawImage origins are bottom-left by default.
        // We will just draw them with some translation if needed, but pdf-lib allows specifying x, y.
        // Let's use simple logic: if it's 'center', 'top-center' etc, we need to adjust x and y so the text/img is centered at that point.
        
        let drawX = x;
        let drawY = y;
        
        if (config.position.includes('center') && !config.position.includes('left') && !config.position.includes('right')) {
          drawX = x - itemWidth / 2;
        }
        if (config.position === 'center-left' || config.position === 'center' || config.position === 'center-right') {
           drawY = y - itemHeight / 2;
        }
        if (config.position.includes('right')) {
           drawX = x - itemWidth;
        }
        
        if (config.type === 'text' && font) {
           page.drawText(config.text, {
             x: drawX,
             y: drawY,
             size: config.fontSize,
             font: font,
             color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
             opacity: opacity,
             rotate: degrees(config.rotation),
           });
        } else if (config.type === 'image' && imageEmbed && imgDims) {
           // For images, we can apply rotation around center by translating
           // But pdf-lib drawImage also supports rotation.
           // However drawImage rotate is around bottom-left corner of image.
           page.drawImage(imageEmbed, {
             x: drawX,
             y: drawY,
             width: imgDims.width,
             height: imgDims.height,
             opacity: opacity,
             rotate: degrees(config.rotation),
           });
        }
      }
      
      const newPdfBytes = await pdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultPdfUrl(url);
      setStatus('done');
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to process PDF.');
      setStatus('error');
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBytes(null);
    setStatus('idle');
    if (resultPdfUrl) URL.revokeObjectURL(resultPdfUrl);
    setResultPdfUrl(null);
  };

  // Helper to generate CSS based on config for the visual preview overlay
  const getPreviewOverlayStyle = () => {
    const style: React.CSSProperties = {
      position: 'absolute',
      opacity: config.opacity / 100,
      transform: `rotate(${-config.rotation}deg)`,
      transformOrigin: 'center center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
    };

    if (config.type === 'text') {
      style.color = config.color;
      style.fontFamily = config.fontFamily;
      // Approximate font size scale from pdf coordinates to the preview canvas coordinates
      // 1 pdf pt = 1/72 inch. Canvas scale might differ. 
      // We will just use a relative calculation.
      const scale = previewDimensions.width ? 100 / previewDimensions.width : 1;
      style.fontSize = `${config.fontSize * scale * 2}px`; // rough approximation
    }

    const m = `${config.margin}px`;

    switch (config.position) {
      case 'top-left':
        style.top = m; style.left = m;
        style.transformOrigin = 'top left';
        break;
      case 'top-center':
        style.top = m; style.left = '50%';
        style.transform += ' translateX(-50%)';
        break;
      case 'top-right':
        style.top = m; style.right = m;
        style.transformOrigin = 'top right';
        break;
      case 'center-left':
        style.top = '50%'; style.left = m;
        style.transform += ' translateY(-50%)';
        break;
      case 'center':
        style.top = '50%'; style.left = '50%';
        style.transform += ' translate(-50%, -50%)';
        break;
      case 'center-right':
        style.top = '50%'; style.right = m;
        style.transform += ' translateY(-50%)';
        break;
      case 'bottom-left':
        style.bottom = m; style.left = m;
        style.transformOrigin = 'bottom left';
        break;
      case 'bottom-center':
        style.bottom = m; style.left = '50%';
        style.transform += ' translateX(-50%)';
        break;
      case 'bottom-right':
        style.bottom = m; style.right = m;
        style.transformOrigin = 'bottom right';
        break;
    }

    return style;
  };

  const renderPositionButton = (pos: Position) => (
    <button
      key={pos}
      onClick={() => setConfig({ ...config, position: pos })}
      className={`w-full aspect-square border rounded flex items-center justify-center transition-colors ${
        config.position === pos ? 'bg-primary/20 border-primary text-primary' : 'hover:bg-muted/50 border-border text-muted-foreground'
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${config.position === pos ? 'bg-primary' : 'bg-muted-foreground/50'}`}></div>
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {(status === 'idle' || status === 'loading' || status === 'error') && (
        <div className="max-w-3xl mx-auto">
          <div 
            className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all ${
              status === 'loading' ? 'border-primary/50 bg-primary/5' : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50 cursor-pointer'
            }`}
            onClick={() => status !== 'loading' && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
              accept=".pdf,application/pdf" 
              className="hidden" 
            />
            
            {status === 'loading' ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analyzing PDF...</h3>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Upload your PDF</h3>
                <p className="text-muted-foreground mb-8 text-sm md:text-base">
                  Drag & Drop your file here or click to browse
                </p>
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
                  Select PDF File
                </button>
              </div>
            )}
          </div>
          
          {status === 'error' && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border border-red-100">
              <AlertCircle className="w-5 h-5 mr-2" />
              {errorMsg}
            </div>
          )}
        </div>
      )}

      {(status === 'ready' || status === 'processing' || status === 'done') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content: PDF Preview */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
             <div className="bg-card border rounded-xl p-4 shadow-sm mb-4 flex-1 flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{file?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {numPages} Pages • Page 1 Preview
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={resetAll}
                      className="text-sm text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" /> Close
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-muted/30 rounded-lg border flex items-center justify-center p-4 overflow-hidden relative min-h-[500px]">
                   {previewThumbnail && (
                     <div className="relative shadow-xl inline-block max-w-full max-h-full">
                       <img 
                         src={previewThumbnail} 
                         alt="PDF Preview"
                         className="max-w-full max-h-[600px] object-contain bg-white"
                       />
                       
                       {/* Overlay Preview */}
                       <div className="absolute inset-0 overflow-hidden border border-primary/20 pointer-events-none">
                          <div style={getPreviewOverlayStyle()}>
                            {config.type === 'text' ? (
                               <span>{config.text || 'Preview'}</span>
                            ) : config.type === 'image' && imagePreviewUrl ? (
                               <img 
                                 src={imagePreviewUrl} 
                                 alt="Watermark"
                                 style={{ width: `${config.imageScale}%`, height: 'auto' }} 
                               />
                            ) : (
                               <div className="px-4 py-2 border-2 border-dashed border-muted-foreground rounded text-muted-foreground bg-background/50 text-sm">
                                  No Image Selected
                               </div>
                            )}
                          </div>
                       </div>
                     </div>
                   )}
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
             <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center mb-6">
                  <Settings2 className="w-5 h-5 mr-2 text-primary" />
                  <h3 className="font-semibold text-lg">Watermark Settings</h3>
                </div>

                {/* Type Selection */}
                <div className="flex p-1 bg-muted rounded-lg mb-6">
                   <button 
                     onClick={() => setConfig({ ...config, type: 'text' })}
                     className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${config.type === 'text' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                   >
                     <Type className="w-4 h-4 mr-2" /> Text
                   </button>
                   <button 
                     onClick={() => setConfig({ ...config, type: 'image' })}
                     className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${config.type === 'image' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                   >
                     <ImageIcon className="w-4 h-4 mr-2" /> Image
                   </button>
                </div>

                {/* Content Settings */}
                {config.type === 'text' ? (
                  <div className="space-y-4 mb-6 pb-6 border-b">
                     <div>
                       <label className="block text-sm font-medium mb-1.5">Text Content</label>
                       <input 
                         type="text" 
                         value={config.text || ''}
                         onChange={(e) => setConfig({ ...config, text: e.target.value })}
                         className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                         placeholder="Enter text..."
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium mb-1.5">Font Family</label>
                         <select 
                           value={config.fontFamily}
                           onChange={(e) => setConfig({ ...config, fontFamily: e.target.value as any })}
                           className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                         >
                           <option value="Helvetica">Helvetica</option>
                           <option value="TimesRoman">Times Roman</option>
                           <option value="Courier">Courier</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-medium mb-1.5">Font Size</label>
                         <input 
                           type="number" 
                           value={config.fontSize ?? 48}
                           onChange={(e) => setConfig({ ...config, fontSize: Number(e.target.value) || 0 })}
                           className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                         />
                       </div>
                     </div>
                     <div>
                       <label className="block text-sm font-medium mb-1.5">Color</label>
                       <div className="flex gap-3">
                         <input 
                           type="color" 
                           value={config.color || '#000000'}
                           onChange={(e) => setConfig({ ...config, color: e.target.value })}
                           className="h-10 w-16 p-1 bg-background border rounded-lg cursor-pointer"
                         />
                         <input 
                           type="text" 
                           value={config.color || '#000000'}
                           onChange={(e) => setConfig({ ...config, color: e.target.value })}
                           className="flex-1 bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                         />
                       </div>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6 pb-6 border-b">
                     <div>
                       <label className="block text-sm font-medium mb-1.5">Upload Image</label>
                       <input 
                         type="file"
                         ref={imageInputRef}
                         accept="image/png, image/jpeg, image/jpg"
                         className="hidden"
                         onChange={(e) => e.target.files && e.target.files[0] && handleImageUpload(e.target.files[0])}
                       />
                       <button 
                         onClick={() => imageInputRef.current?.click()}
                         className="w-full py-2 px-3 border border-dashed rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium transition-colors flex items-center justify-center"
                       >
                         <UploadCloud className="w-4 h-4 mr-2" /> {config.imageFile ? config.imageFile.name : 'Select Image (PNG/JPG)'}
                       </button>
                     </div>
                     {config.imageFile && (
                       <div>
                         <label className="flex justify-between text-sm font-medium mb-1.5">
                           <span>Scale</span>
                           <span>{config.imageScale}%</span>
                         </label>
                         <input 
                           type="range" 
                           min="10" max="200" 
                           value={config.imageScale ?? 50}
                           onChange={(e) => setConfig({ ...config, imageScale: Number(e.target.value) || 0 })}
                           className="w-full accent-primary"
                         />
                       </div>
                     )}
                  </div>
                )}

                {/* Shared Settings */}
                <div className="space-y-6 mb-6 pb-6 border-b">
                   <div>
                     <label className="flex justify-between text-sm font-medium mb-1.5">
                       <span>Opacity</span>
                       <span>{config.opacity}%</span>
                     </label>
                     <input 
                       type="range" 
                       min="0" max="100" 
                       value={config.opacity ?? 50}
                       onChange={(e) => setConfig({ ...config, opacity: Number(e.target.value) || 0 })}
                       className="w-full accent-primary"
                     />
                   </div>
                   
                   <div>
                     <label className="flex justify-between text-sm font-medium mb-1.5">
                       <span>Rotation</span>
                       <span>{config.rotation}°</span>
                     </label>
                     <input 
                       type="range" 
                       min="-180" max="180" step="15"
                       value={config.rotation ?? 45}
                       onChange={(e) => setConfig({ ...config, rotation: Number(e.target.value) || 0 })}
                       className="w-full accent-primary"
                     />
                     <div className="flex gap-2 mt-3">
                       {[-90, -45, 0, 45, 90].map(deg => (
                         <button 
                           key={deg}
                           onClick={() => setConfig({ ...config, rotation: deg })}
                           className={`flex-1 py-1 text-xs border rounded transition-colors ${config.rotation === deg ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted bg-background'}`}
                         >
                           {deg}°
                         </button>
                       ))}
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium mb-3 flex items-center">
                       <Grid3X3 className="w-4 h-4 mr-2 text-muted-foreground" /> Position
                     </label>
                     <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
                       {renderPositionButton("top-left")}
                       {renderPositionButton("top-center")}
                       {renderPositionButton("top-right")}
                       {renderPositionButton("center-left")}
                       {renderPositionButton("center")}
                       {renderPositionButton("center-right")}
                       {renderPositionButton("bottom-left")}
                       {renderPositionButton("bottom-center")}
                       {renderPositionButton("bottom-right")}
                     </div>
                   </div>
                </div>

                {/* Apply Settings */}
                <div className="space-y-4 mb-8">
                   <label className="block text-sm font-medium mb-1.5 flex items-center">
                     <Layers className="w-4 h-4 mr-2 text-muted-foreground" /> Apply to Pages
                   </label>
                   <select 
                     value={config.pages}
                     onChange={(e) => setConfig({ ...config, pages: e.target.value as any })}
                     className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                   >
                     <option value="all">All Pages ({numPages})</option>
                     <option value="odd">Odd Pages</option>
                     <option value="even">Even Pages</option>
                     <option value="custom">Custom Range</option>
                   </select>

                   {config.pages === 'custom' && (
                     <input 
                       type="text" 
                       value={config.customRange || ''}
                       onChange={(e) => setConfig({ ...config, customRange: e.target.value })}
                       placeholder="e.g., 1-5, 8, 11-13"
                       className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                     />
                   )}
                </div>

                <div className="pt-2">
                  {status === 'ready' && (
                    <button 
                      onClick={handleApply}
                      disabled={config.type === 'image' && !config.imageFile}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      <FileOutput className="w-4 h-4 mr-2" /> Add Watermark
                    </button>
                  )}
                  
                  {status === 'processing' && (
                    <div className="text-center py-2">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                      <div className="text-sm font-medium">Processing Watermark...</div>
                    </div>
                  )}

                  {status === 'done' && resultPdfUrl && (
                    <div className="text-center py-2">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckSquare className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium mb-4">Success! PDF is ready.</div>
                      <a 
                        href={resultPdfUrl} 
                        download={`watermarked_${file?.name || 'document'}.pdf`}
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm transition-colors flex items-center justify-center mb-3"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </a>
                      <button 
                        onClick={() => setStatus('ready')}
                        className="w-full py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                      >
                        Make More Changes
                      </button>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
