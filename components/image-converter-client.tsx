'use client';

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileImage, Download, Trash2, Loader2, Sparkles, AlertCircle, Settings2, CheckCircle2, ChevronRight, X, Maximize2, RefreshCcw, FileArchive, Image as ImageIcon } from 'lucide-react';
import JSZip from 'jszip';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedSize?: number;
  error?: string;
  recommendedFormat?: string;
}

const SUPPORTED_FORMATS = [
  { id: 'image/jpeg', label: 'JPG / JPEG', ext: 'jpg' },
  { id: 'image/png', label: 'PNG', ext: 'png' },
  { id: 'image/webp', label: 'WEBP', ext: 'webp' },
  { id: 'image/avif', label: 'AVIF', ext: 'avif' },
  { id: 'image/bmp', label: 'BMP', ext: 'bmp' },
];

export default function ImageConverterClient() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [targetFormat, setTargetFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(0.8);
  const [aiMode, setAiMode] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (files: FileList | File[]) => {
    const newImages: ImageItem[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        let recommended = 'image/jpeg';
        if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
          recommended = 'image/webp';
        } else if (file.size > 2 * 1024 * 1024) {
          recommended = 'image/webp';
        }

        newImages.push({
          id: Math.random().toString(36).substring(7),
          file,
          previewUrl: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'pending',
          recommendedFormat: recommended
        });
      }
    });

    setImages(prev => [...prev, ...newImages]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.previewUrl);
        if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
      }
      return prev.filter(i => i.id !== id);
    });
    if (previewImage?.id === id) {
      setPreviewImage(null);
    }
  };

  const clearAll = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.previewUrl);
      if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
    });
    setImages([]);
    setPreviewImage(null);
  };

  const convertImage = (img: ImageItem, format: string, q: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failed'));
          return;
        }

        // Fill white background for formats that don't support transparency
        if (format === 'image/jpeg' || format === 'image/bmp') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(image, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Blob conversion failed'));
          }
        }, format, q);
      };
      image.onerror = () => reject(new Error('Image load failed'));
      image.src = img.previewUrl;
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsConverting(true);
    setOverallProgress(0);

    const updatedImages = [...images];

    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      if (img.status === 'success') continue;

      updatedImages[i].status = 'processing';
      setImages([...updatedImages]);

      try {
        const outFormat = aiMode ? (img.recommendedFormat || targetFormat) : targetFormat;
        const blob = await convertImage(img, outFormat, quality);
        
        updatedImages[i].status = 'success';
        updatedImages[i].convertedBlob = blob;
        updatedImages[i].convertedSize = blob.size;
        updatedImages[i].convertedUrl = URL.createObjectURL(blob);
        updatedImages[i].type = outFormat; // Update type to output type
      } catch (err) {
        console.error(err);
        updatedImages[i].status = 'error';
        updatedImages[i].error = 'Conversion failed';
      }

      setOverallProgress(((i + 1) / updatedImages.length) * 100);
      setImages([...updatedImages]);
    }

    setIsConverting(false);
  };

  const downloadFile = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = async () => {
    const successfulImages = images.filter(img => img.status === 'success' && img.convertedBlob);
    if (successfulImages.length === 0) return;

    if (successfulImages.length === 1) {
      const img = successfulImages[0];
      const ext = SUPPORTED_FORMATS.find(f => f.id === img.type)?.ext || 'jpg';
      const newName = img.name.replace(/\.[^/.]+$/, "") + `_converted.${ext}`;
      downloadFile(img.convertedUrl!, newName);
      return;
    }

    const zip = new JSZip();
    successfulImages.forEach(img => {
      const ext = SUPPORTED_FORMATS.find(f => f.id === img.type)?.ext || 'jpg';
      const newName = img.name.replace(/\.[^/.]+$/, "") + `_converted.${ext}`;
      zip.file(newName, img.convertedBlob!);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    downloadFile(url, 'converted_images.zip');
    URL.revokeObjectURL(url);
  };

  const getFormatLabel = (mime: string) => {
    return SUPPORTED_FORMATS.find(f => f.id === mime)?.label || mime.split('/')[1].toUpperCase();
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-primary/5 border-b border-primary/10 py-12 mb-8">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Universal Image Converter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert images between JPG, PNG, WebP, AVIF, BMP, and more using AI-powered optimization. Enterprise-grade batch conversion in your browser.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Tools & Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold flex items-center mb-4">
                <Settings2 className="w-5 h-5 mr-2 text-primary" />
                Conversion Settings
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">AI Smart Mode</label>
                    <button
                      onClick={() => setAiMode(!aiMode)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${aiMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiMode ? 'translate-x-4' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Automatically recommends the best format and compression for each image.
                  </p>
                </div>

                {!aiMode && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Format</label>
                    <select
                      value={targetFormat}
                      onChange={(e) => setTargetFormat(e.target.value)}
                      className="w-full p-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-primary/50 text-sm"
                    >
                      {SUPPORTED_FORMATS.map(f => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Quality ({Math.round(quality * 100)}%)</label>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Smaller Size</span>
                    <span>High Quality</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
               <div className="flex items-start gap-3">
                 <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                 <div>
                   <h4 className="font-medium text-primary text-sm mb-1">Enterprise Engine</h4>
                   <p className="text-xs text-muted-foreground">Conversions happen entirely in your browser. No files are uploaded to external servers, ensuring complete privacy.</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: Main Workspace */}
          <div className="lg:col-span-3">
            {images.length === 0 ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`bg-card border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 min-h-[400px] cursor-pointer transition-all ${
                  isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'hover:bg-muted/50 hover:border-primary/50'
                }`}
              >
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Images to Convert</h3>
                <p className="text-muted-foreground text-center max-w-md mb-8">
                  Drag and drop your images here, or click to browse. Supports JPG, PNG, WEBP, AVIF, and more.
                </p>
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Browse Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-card border rounded-2xl overflow-hidden flex flex-col h-[700px] max-h-[85vh]">
                <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4 bg-muted/30">
                  <div>
                    <h3 className="font-semibold flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                      {images.length} Image{images.length !== 1 ? 's' : ''} Selected
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total size: {(images.reduce((acc, img) => acc + img.size, 0) / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                      disabled={isConverting}
                    >
                      Add More
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <button 
                      onClick={clearAll}
                      className="px-4 py-2 text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg text-sm font-medium transition-colors"
                      disabled={isConverting}
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-muted/10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 content-start">
                  {images.map((img) => (
                    <div 
                      key={img.id} 
                      className={`relative group bg-background border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md cursor-pointer ${previewImage?.id === img.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setPreviewImage(img)}
                    >
                      <div className="aspect-[4/3] bg-muted/30 relative overflow-hidden flex items-center justify-center">
                        <img src={img.previewUrl} alt={img.name} className="w-full h-full object-cover" />
                        
                        {/* Overlay status */}
                        {img.status === 'processing' && (
                          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          </div>
                        )}
                        {img.status === 'success' && (
                          <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <CheckCircle2 className="w-8 h-8 text-green-600 drop-shadow-md" />
                          </div>
                        )}

                        {!isConverting && img.status !== 'success' && (
                           <button 
                             onClick={(e) => removeImage(img.id, e)}
                             className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive shadow-sm"
                           >
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                        )}
                      </div>
                      
                      <div className="p-3">
                        <p className="text-xs font-medium truncate mb-1" title={img.name}>{img.name}</p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="bg-muted px-1.5 py-0.5 rounded uppercase">{img.type.split('/')[1]}</span>
                          <span>{(img.size / 1024).toFixed(0)} KB</span>
                        </div>
                        
                        {img.status === 'success' && img.convertedSize && (
                          <div className="mt-2 pt-2 border-t flex flex-col gap-1">
                             <div className="flex items-center justify-between text-[10px] font-medium text-green-600 dark:text-green-500">
                               <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> {getFormatLabel(img.type)}</span>
                               <span>{(img.convertedSize / 1024).toFixed(0)} KB</span>
                             </div>
                             {img.convertedSize < img.size && (
                               <span className="text-[9px] text-green-600 font-semibold bg-green-500/10 px-1 rounded-sm w-fit">
                                 -{Math.round((1 - img.convertedSize / img.size) * 100)}%
                               </span>
                             )}
                          </div>
                        )}
                        
                        {img.status === 'pending' && aiMode && img.recommendedFormat && (
                          <div className="mt-2 pt-2 border-t flex items-center text-[10px] text-primary">
                            <Sparkles className="w-3 h-3 mr-1" />
                            <span>Auto: {getFormatLabel(img.recommendedFormat)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t bg-card">
                  {images.some(i => i.status === 'success') ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-600 flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Conversion Complete
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {images.filter(i => i.status === 'success').length} of {images.length} images successfully converted.
                        </p>
                      </div>
                      <button 
                        onClick={handleDownloadAll}
                        className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <FileArchive className="w-5 h-5" /> Download All (ZIP)
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="w-full sm:w-1/2">
                        {isConverting && (
                           <div className="w-full flex items-center gap-3">
                             <div className="flex-1 bg-muted rounded-full h-2">
                               <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${overallProgress}%` }} />
                             </div>
                             <span className="text-xs font-medium min-w-[40px]">{Math.round(overallProgress)}%</span>
                           </div>
                        )}
                      </div>
                      <button 
                        onClick={handleConvert}
                        disabled={isConverting}
                        className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isConverting ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                        ) : (
                          <><RefreshCcw className="w-5 h-5" /> Convert {images.length} Images</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Interactive Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8" onClick={() => setPreviewImage(null)}>
           <div className="bg-card w-full max-w-5xl h-full max-h-[800px] rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
             <div className="p-4 border-b flex items-center justify-between bg-muted/30">
               <h3 className="font-semibold text-lg flex items-center">
                 <Maximize2 className="w-5 h-5 mr-2 text-primary" />
                 Image Inspector
               </h3>
               <button onClick={() => setPreviewImage(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="flex-1 overflow-hidden p-6 bg-muted/10 flex flex-col lg:flex-row gap-6">
                {/* Original */}
                <div className="flex-1 flex flex-col">
                   <h4 className="font-medium text-sm text-center mb-3 text-muted-foreground flex items-center justify-center">
                     Original <span className="ml-2 bg-muted px-2 py-0.5 rounded text-xs">{previewImage.type.split('/')[1].toUpperCase()}</span>
                   </h4>
                   <div className="flex-1 border bg-muted/30 rounded-xl overflow-hidden relative flex items-center justify-center">
                     <img src={previewImage.previewUrl} alt="Original" className="max-w-full max-h-full object-contain p-2" />
                   </div>
                   <div className="mt-3 text-center text-sm font-medium">
                     {(previewImage.size / 1024).toFixed(1)} KB
                   </div>
                </div>
                
                {/* Converted or Preview */}
                <div className="flex-1 flex flex-col">
                   <h4 className="font-medium text-sm text-center mb-3 text-primary flex items-center justify-center">
                     Converted {previewImage.status === 'success' ? (
                       <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">{getFormatLabel(previewImage.type)}</span>
                     ) : (
                       <span className="ml-2 bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs">Preview</span>
                     )}
                   </h4>
                   <div className="flex-1 border-2 border-primary/20 bg-muted/30 rounded-xl overflow-hidden relative flex items-center justify-center shadow-inner">
                     {previewImage.status === 'success' && previewImage.convertedUrl ? (
                       <img src={previewImage.convertedUrl} alt="Converted" className="max-w-full max-h-full object-contain p-2" />
                     ) : (
                       <div className="text-center p-8">
                         <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                         <p className="text-sm text-muted-foreground">Click Convert to view the optimized image</p>
                       </div>
                     )}
                   </div>
                   <div className="mt-3 text-center text-sm font-medium">
                     {previewImage.status === 'success' && previewImage.convertedSize ? (
                       <span className="text-green-600">{(previewImage.convertedSize / 1024).toFixed(1)} KB</span>
                     ) : (
                       <span className="text-muted-foreground">Estimating...</span>
                     )}
                   </div>
                </div>
             </div>
             
             {previewImage.status === 'success' && previewImage.convertedUrl && (
               <div className="p-4 border-t flex justify-end bg-card">
                 <button 
                   onClick={() => {
                     const ext = SUPPORTED_FORMATS.find(f => f.id === previewImage.type)?.ext || 'jpg';
                     const newName = previewImage.name.replace(/\.[^/.]+$/, "") + `_converted.${ext}`;
                     downloadFile(previewImage.convertedUrl!, newName);
                   }}
                   className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2"
                 >
                   <Download className="w-4 h-4" /> Download Single
                 </button>
               </div>
             )}
           </div>
        </div>
      )}

    </div>
  );
}
