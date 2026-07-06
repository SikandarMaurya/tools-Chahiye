'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Minimize2, AlertCircle, RefreshCcw, Settings, ChevronRight, FileArchive, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Setup pdf.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

type CompressionLevel = 'recommended' | 'extreme' | 'less';

export default function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  
  // Settings
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
  
  // Output
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number>(0);
  const [outputFilename, setOutputFilename] = useState<string>('compressed.pdf');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const loadFile = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    
    if (selectedFile.size > 100 * 1024 * 1024) {
      alert('File size exceeds the 100MB limit.');
      return;
    }

    setFile(selectedFile);
    setOutputUrl(null);
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      setPdfBytes(bytes);
      
      const loadedPdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      if (loadedPdf.isEncrypted) {
        alert('Password protected PDFs are not supported yet.');
        setFile(null);
        setIsProcessing(false);
        return;
      }
      
      setPdfDoc(loadedPdf);
      setPageCount(loadedPdf.getPageCount());
      
    } catch (err) {
      console.error(err);
      alert('Failed to read PDF file. It might be corrupted.');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadFile(e.target.files[0]);
    }
  };

  const handleCompress = async () => {
    if (!file || !pdfBytes) return;
    setIsProcessing(true);
    
    try {
      // Determine settings based on level
      let scale = 1.5;
      let quality = 0.7;
      
      if (compressionLevel === 'extreme') {
        scale = 1.0;
        quality = 0.5;
      } else if (compressionLevel === 'less') {
        scale = 2.0;
        quality = 0.85;
      }

      // Load PDF with pdf.js to rasterize
      const loadingTask = pdfjsLib.getDocument({ data: pdfBytes.slice(0) });
      const pdf = await loadingTask.promise;
      
      const newPdf = await PDFDocument.create();
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render the page on canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        // Convert to JPEG
        const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Fetch as buffer
        const response = await fetch(imgDataUrl);
        const imgBuffer = await response.arrayBuffer();
        
        const embeddedImage = await newPdf.embedJpg(imgBuffer);
        
        // Add a new page with original dimensions
        const originalViewport = page.getViewport({ scale: 1.0 });
        const pdfPage = newPdf.addPage([originalViewport.width, originalViewport.height]);
        
        pdfPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: originalViewport.width,
          height: originalViewport.height,
        });
        
        // Clean up
        page.cleanup();
      }
      
      const outputBytes = await newPdf.save({ useObjectStreams: true });
      const blob = new Blob([outputBytes], { type: 'application/pdf' });
      
      setOutputSize(blob.size);
      setOutputUrl(URL.createObjectURL(blob));
      setOutputFilename(`compressed_${file.name}`);
      
    } catch (err) {
      console.error(err);
      alert('An error occurred during compression.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfDoc(null);
    setPdfBytes(null);
    setPageCount(0);
    setOutputUrl(null);
    setOutputSize(0);
  };

  const getCompressionPercentage = () => {
    if (!file || !outputSize) return 0;
    return Math.round((1 - (outputSize / file.size)) * 100);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Minimize2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Compress PDF</h1>
              <p className="text-muted-foreground mt-1">Reduce file size while optimizing for maximal PDF quality.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!file ? (
          <div className="max-w-4xl mx-auto">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${isDraggingOver ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'}`}
            >
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileInput}
              />
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Drag & Drop PDF here</h3>
              <p className="text-muted-foreground mb-8">Or click to browse from your device (Max 100MB)</p>
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
                Select PDF File
              </button>
            </div>
          </div>
        ) : outputUrl ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden text-center p-8 md:p-12">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-2">PDF Compressed Successfully!</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Your PDF is now {getCompressionPercentage()}% smaller!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
                <div className="p-4 border rounded-xl bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-1">Original Size</div>
                  <div className="text-xl font-semibold line-through opacity-70">{formatBytes(file.size)}</div>
                </div>
                <div className="hidden sm:flex items-center justify-center">
                  <ChevronRight className="w-8 h-8 text-muted-foreground opacity-50" />
                </div>
                <div className="p-4 border rounded-xl bg-primary/5 border-primary/20">
                  <div className="text-sm text-primary font-medium mb-1">New Size</div>
                  <div className="text-2xl font-bold text-primary">{formatBytes(outputSize)}</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <a 
                   href={outputUrl}
                   download={outputFilename}
                   className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                 >
                   <Download className="w-5 h-5" /> Download Compressed PDF
                 </a>
                 <button 
                   onClick={resetAll}
                   className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium shadow-sm hover:bg-secondary/80 transition-colors"
                 >
                   Compress Another File
                 </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="lg:col-span-1 bg-card border rounded-2xl shadow-sm p-6 h-fit">
              <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-2xl mb-4 text-muted-foreground mx-auto">
                <FileArchive className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-center truncate mb-1" title={file.name}>{file.name}</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">{pageCount} pages • {formatBytes(file.size)}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original Size:</span>
                  <span className="font-medium">{formatBytes(file.size)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Compressed:</span>
                  <span className="font-medium text-primary">
                    ~{formatBytes(file.size * (compressionLevel === 'extreme' ? 0.4 : (compressionLevel === 'recommended' ? 0.6 : 0.85)))}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={resetAll}
                className="w-full py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                Remove File
              </button>
            </div>
            
            <div className="lg:col-span-2 bg-card border rounded-2xl shadow-sm flex flex-col">
              <div className="p-5 border-b bg-muted/30">
                <h3 className="font-semibold flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5" />
                  Compression Level
                </h3>
              </div>
              
              <div className="p-6 flex-grow space-y-4">
                
                <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${compressionLevel === 'extreme' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-transparent'}`}>
                  <input 
                    type="radio" 
                    name="compressionLevel" 
                    checked={compressionLevel === 'extreme'} 
                    onChange={() => setCompressionLevel('extreme')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold">Extreme Compression</div>
                    <div className="text-sm text-muted-foreground mt-1">Less quality, high compression. Best for uploading to strict portals or sending via email.</div>
                  </div>
                </label>
                
                <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${compressionLevel === 'recommended' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-transparent'}`}>
                  <input 
                    type="radio" 
                    name="compressionLevel" 
                    checked={compressionLevel === 'recommended'} 
                    onChange={() => setCompressionLevel('recommended')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      Recommended Compression
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider rounded">Default</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Good quality, good compression. Perfect balance for standard use.</div>
                  </div>
                </label>
                
                <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${compressionLevel === 'less' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-transparent'}`}>
                  <input 
                    type="radio" 
                    name="compressionLevel" 
                    checked={compressionLevel === 'less'} 
                    onChange={() => setCompressionLevel('less')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold">Less Compression</div>
                    <div className="text-sm text-muted-foreground mt-1">High quality, less compression. Best for official printing and high-res archiving.</div>
                  </div>
                </label>

              </div>
              
              <div className="px-6 pb-2 text-xs text-muted-foreground bg-card">
                <AlertCircle className="w-3 h-3 inline mr-1 mb-0.5" />
                Note: Client-side compression converts pages to images. The resulting PDF will not be text-searchable.
              </div>
              <div className="p-6 border-t bg-muted/10 flex justify-end">
                <button 
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Minimize2 className="w-5 h-5" />}
                  {isProcessing ? 'Compressing...' : 'Compress PDF'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
