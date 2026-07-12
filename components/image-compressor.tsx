'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, FileImage, Download, Trash2, Settings, ArrowRight, RefreshCcw, Image as ImageIcon, Zap, CheckCircle2, ChevronRight, X, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';
import Image from 'next/image';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

type FileItem = {
  id: string;
  file: File;
  originalUrl: string;
  originalSize: number;
  compressedBlob?: Blob;
  compressedUrl?: string;
  compressedSize?: number;
  status: 'pending' | 'compressing' | 'done' | 'error';
  error?: string;
};

export default function ImageCompressor() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const [outputFormat, setOutputFormat] = useState('original');
  const [compressionMode, setCompressionMode] = useState('smart');
  const [customQuality, setCustomQuality] = useState(80);
  const [targetSize, setTargetSize] = useState<number | ''>('');
  
  const [previewItem, setPreviewItem] = useState<FileItem | null>(null);
  const [isCompressingAll, setIsCompressingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => f.type.startsWith('image/') && f.size <= 20 * 1024 * 1024);
    
    if (validFiles.length !== newFiles.length) {
      alert('Some files were rejected. Only images under 20MB are supported.');
    }
    
    const items: FileItem[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      originalUrl: URL.createObjectURL(file),
      originalSize: file.size,
      status: 'pending'
    }));
    
    setFiles(prev => [...prev, ...items].slice(0, 30)); // Max 30 files
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const compressSingle = async (item: FileItem): Promise<FileItem> => {
    return new Promise((resolve) => {
      const img = new window.Image(); // Use native Image
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ ...item, status: 'error', error: 'Canvas not supported' });
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        let mimeType = item.file.type;
        if (outputFormat !== 'original') {
          mimeType = `image/${outputFormat}`;
        }
        if (mimeType === 'image/jpg') mimeType = 'image/jpeg';
        
        let quality = 0.8;
        if (compressionMode === 'lossless') quality = 1.0;
        else if (compressionMode === 'balanced') quality = 0.7;
        else if (compressionMode === 'maximum' || compressionMode === 'email') quality = 0.4;
        else if (compressionMode === 'web') quality = 0.75;
        else if (compressionMode === 'social') quality = 0.85;
        else if (compressionMode === 'custom') quality = customQuality / 100;
        else if (compressionMode === 'target' && targetSize) {
          const targetBytes = targetSize * 1024;
          const ratio = targetBytes / item.originalSize;
          quality = Math.max(0.1, Math.min(1.0, ratio));
        }

        canvas.toBlob((blob) => {
          if (blob) {
             resolve({
               ...item,
               status: 'done',
               compressedBlob: blob,
               compressedUrl: URL.createObjectURL(blob),
               compressedSize: blob.size
             });
          } else {
             resolve({ ...item, status: 'error', error: 'Compression failed' });
          }
        }, mimeType, quality);
      };
      img.onerror = () => resolve({ ...item, status: 'error', error: 'Invalid image data' });
      img.src = item.originalUrl;
    });
  };

  const compressAll = async () => {
    setIsCompressingAll(true);
    
    const newFiles = [...files];
    for (let i = 0; i < newFiles.length; i++) {
      if (newFiles[i].status !== 'done') {
        newFiles[i] = { ...newFiles[i], status: 'compressing' };
        setFiles([...newFiles]);
        
        newFiles[i] = await compressSingle(newFiles[i]);
        setFiles([...newFiles]);
      }
    }
    
    setIsCompressingAll(false);
  };

  const downloadFile = (item: FileItem) => {
    if (!item.compressedUrl || !item.compressedBlob) return;
    const a = document.createElement('a');
    a.href = item.compressedUrl;
    
    // determine extension
    let ext = item.file.name.split('.').pop() || 'jpg';
    if (outputFormat !== 'original') {
      ext = outputFormat;
    }
    const nameWithoutExt = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name;
    
    a.download = `${nameWithoutExt}-compressed.${ext}`;
    a.click();
  };

  const downloadAllZip = async () => {
    const doneFiles = files.filter(f => f.status === 'done' && f.compressedBlob);
    if (doneFiles.length === 0) return;
    
    const zip = new JSZip();
    doneFiles.forEach(item => {
      let ext = item.file.name.split('.').pop() || 'jpg';
      if (outputFormat !== 'original') ext = outputFormat;
      const nameWithoutExt = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name;
      zip.file(`${nameWithoutExt}-compressed.${ext}`, item.compressedBlob!);
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'compressed-images.zip';
    a.click();
  };

  const clearAll = () => {
    if(confirm('Clear all images?')) {
      setFiles([]);
      setPreviewItem(null);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (previewItem?.id === id) setPreviewItem(null);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      
      {/* Header */}
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Smart Image Compressor</h1>
              <p className="text-muted-foreground mt-1">Enterprise AI Compression Engine. Optimize, resize, and convert your images smartly.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Upload Zone */}
            {files.length === 0 ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragging ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'}`}
              >
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileInput}
                />
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drag & Drop your images here</h3>
                <p className="text-muted-foreground mb-6">Supports JPG, PNG, WebP, AVIF up to 20MB</p>
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors">
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                   <h3 className="font-semibold flex items-center gap-2">
                     <FileImage className="w-4 h-4 text-primary" /> 
                     Images ({files.length}/30)
                   </h3>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors"
                     >
                       Add More
                     </button>
                     <button 
                       onClick={clearAll}
                       className="px-3 py-1.5 text-muted-foreground hover:text-destructive text-sm font-medium transition-colors"
                     >
                       Clear All
                     </button>
                     <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileInput}
                      />
                   </div>
                </div>
                
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {files.map(item => (
                    <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group">
                       <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={item.originalUrl} alt={item.file.name} className="w-full h-full object-cover" />
                       </div>
                       
                       <div className="flex-grow min-w-0">
                         <h4 className="text-sm font-medium truncate mb-1" title={item.file.name}>{item.file.name}</h4>
                         <div className="flex items-center text-xs text-muted-foreground gap-3">
                           <span>{formatBytes(item.originalSize)}</span>
                           
                           {item.status === 'done' && item.compressedSize && (
                             <>
                               <ArrowRight className="w-3 h-3" />
                               <span className="text-primary font-medium">{formatBytes(item.compressedSize)}</span>
                               <span className="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded font-semibold">
                                 -{Math.round((1 - item.compressedSize / item.originalSize) * 100)}%
                               </span>
                             </>
                           )}
                           
                           {item.status === 'compressing' && (
                             <span className="text-primary animate-pulse">Compressing...</span>
                           )}
                           
                           {item.status === 'error' && (
                             <span className="text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {item.error}</span>
                           )}
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-2">
                         {item.status === 'done' && (
                           <>
                             <button onClick={() => setPreviewItem(item)} className="p-2 text-muted-foreground hover:text-primary transition-colors bg-secondary rounded-lg" title="Preview Comparison">
                               <ImageIcon className="w-4 h-4" />
                             </button>
                             <button onClick={() => downloadFile(item)} className="p-2 text-white bg-primary hover:bg-primary/90 transition-colors rounded-lg shadow-sm" title="Download">
                               <Download className="w-4 h-4" />
                             </button>
                           </>
                         )}
                         <button onClick={() => removeFile(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar - Settings */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden sticky top-24">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" /> 
                  Optimization Settings
                </h3>
              </div>
              
              <div className="p-5 space-y-6">
                 <div>
                   <label className="block text-sm font-medium mb-2">Compression Mode</label>
                   <div className="grid grid-cols-2 gap-2">
                     {[
                       { id: 'smart', name: 'Smart AI', desc: 'Auto optimization' },
                       { id: 'lossless', name: 'Lossless', desc: 'No quality loss' },
                       { id: 'balanced', name: 'Lossy', desc: 'Maximum reduction' },
                       { id: 'web', name: 'Web Mode', desc: 'For websites' },
                       { id: 'social', name: 'Social Media', desc: 'For posts' },
                       { id: 'email', name: 'Email Mode', desc: 'Smallest attachments' },
                       { id: 'target', name: 'Target Size', desc: 'Match file size' },
                       { id: 'custom', name: 'Custom', desc: 'Manual control' }
                     ].map(mode => (
                       <button 
                         key={mode.id}
                         onClick={() => setCompressionMode(mode.id)}
                         className={`p-2 text-left rounded-lg border text-sm transition-all ${
                           compressionMode === mode.id 
                             ? 'border-primary bg-primary text-primary-foreground shadow-md' 
                             : 'border-border hover:border-primary/50 text-muted-foreground bg-background hover:bg-muted/50'
                         }`}
                       >
                         <div className={`font-semibold ${compressionMode === mode.id ? 'text-primary-foreground' : 'text-foreground'}`}>{mode.name}</div>
                         <div className={`text-[10px] ${compressionMode === mode.id ? 'opacity-90' : 'opacity-80'}`}>{mode.desc}</div>
                       </button>
                     ))}
                   </div>
                 </div>

                 {compressionMode === 'custom' && (
                   <div className="bg-muted/50 p-3 rounded-lg border">
                     <div className="flex justify-between text-sm mb-2">
                       <label className="font-medium">Quality</label>
                       <span className="text-primary font-bold">{customQuality}%</span>
                     </div>
                     <input 
                       type="range" 
                       min="1" 
                       max="100" 
                       value={customQuality} 
                       onChange={(e) => setCustomQuality(parseInt(e.target.value))}
                       className="w-full accent-primary"
                     />
                   </div>
                 )}

                 {compressionMode === 'target' && (
                   <div className="bg-muted/50 p-3 rounded-lg border">
                     <div className="flex justify-between text-sm mb-2">
                       <label className="font-medium">Target Size (KB)</label>
                     </div>
                     <input 
                       type="number" 
                       value={targetSize} 
                       onChange={(e) => setTargetSize(e.target.value ? parseInt(e.target.value) : '')}
                       placeholder="e.g. 100"
                       className="w-full bg-background text-foreground border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                     />
                   </div>
                 )}

                 <div>
                   <label className="block text-sm font-medium mb-2">Convert Format (Optional)</label>
                   <select 
                     value={outputFormat} 
                     onChange={(e) => setOutputFormat(e.target.value)}
                     className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                   >
                     <option value="original">Keep Original Format</option>
                     <option value="jpg">JPG (Best for photos)</option>
                     <option value="png">PNG (Best for transparency)</option>
                     <option value="webp">WebP (Modern, highly compressed)</option>
                      <option value="avif">AVIF (Next-gen compression)</option>
                   </select>
                 </div>

                 <div className="pt-4 border-t space-y-3">
                   <button 
                     onClick={compressAll} 
                     disabled={files.length === 0 || isCompressingAll}
                     className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     {isCompressingAll ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                     {isCompressingAll ? 'Compressing...' : 'Compress Images'}
                   </button>
                   
                   {files.some(f => f.status === 'done') && (
                     <button 
                       onClick={downloadAllZip} 
                       className="w-full py-2.5 bg-secondary text-secondary-foreground rounded-xl font-semibold shadow-sm hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
                     >
                       <Download className="w-5 h-5" />
                       Download All (ZIP)
                     </button>
                   )}
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
          <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-4xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
             <div className="p-4 border-b flex justify-between items-center bg-muted/30">
               <h3 className="font-semibold">Before & After Comparison</h3>
               <button onClick={() => setPreviewItem(null)} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="p-6 flex-grow flex flex-col items-center justify-center bg-muted/10 overflow-hidden relative min-h-[400px]">
                <div className="flex w-full justify-between mb-4">
                  <div className="bg-muted px-4 py-1.5 rounded-full text-sm font-medium border shadow-sm">
                    Original: {formatBytes(previewItem.originalSize)}
                  </div>
                  <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium border border-primary/20 shadow-sm flex items-center gap-2">
                    Compressed: {formatBytes(previewItem.compressedSize || 0)}
                    <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                      -{Math.round((1 - (previewItem.compressedSize || 0) / previewItem.originalSize) * 100)}%
                    </span>
                  </div>
                </div>
                
                <div 
                  className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden cursor-ew-resize border shadow-sm bg-muted/30 select-none touch-none"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                    e.currentTarget.style.setProperty('--pos', `${(x / rect.width) * 100}%`);
                  }}
                  onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                    e.currentTarget.style.setProperty('--pos', `${(x / rect.width) * 100}%`);
                  }}
                  style={{ '--pos': '50%' } as React.CSSProperties}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewItem.compressedUrl} className="absolute inset-0 w-full h-full object-contain pointer-events-none" alt="Compressed" />
                  
                  <div className="absolute inset-0 overflow-hidden" style={{ width: 'var(--pos)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewItem.originalUrl} className="absolute top-0 left-0 h-full object-contain pointer-events-none" style={{ width: '100cqw', minWidth: '100%' }} alt="Original" />
                  </div>
                  
                  <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ left: 'var(--pos)', transform: 'translateX(-50%)' }}>
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <div className="flex gap-0.5">
                        <div className="w-0.5 h-3 bg-neutral-400 rounded-full"></div>
                        <div className="w-0.5 h-3 bg-neutral-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
             
             <div className="p-4 border-t bg-muted/30 flex justify-end">
               <button onClick={() => downloadFile(previewItem)} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                 <Download className="w-4 h-4" /> Download Compressed
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
