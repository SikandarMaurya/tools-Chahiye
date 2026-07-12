'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Download, Scissors, AlertCircle, RefreshCcw, CheckSquare, Square, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
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

type SplitMethod = 'custom' | 'range' | 'fixed';

export default function SplitPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
  
  // Split settings
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('custom');
  const [rangeInput, setRangeInput] = useState('');
  const [fixedInput, setFixedInput] = useState('1');
  
  // Output
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFilename, setOutputFilename] = useState<string>('split.pdf');
  
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
    
    setFile(selectedFile);
    setThumbnails({});
    setSelectedPages(new Set());
    setOutputUrl(null);
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      setPdfBytes(bytes);
      
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      if (pdfDoc.isEncrypted) {
        alert('Password protected PDFs are not supported yet.');
        setFile(null);
        setIsProcessing(false);
        return;
      }
      
      const pages = pdfDoc.getPageCount();
      setPageCount(pages);
      
      // Load thumbnails in background
      generateThumbnails(bytes, pages);
      
    } catch (err) {
      console.error(err);
      alert('Failed to read PDF file.');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateThumbnails = async (bytes: Uint8Array, totalPages: number) => {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
      const pdf = await loadingTask.promise;
      
      const newThumbnails: Record<number, string> = {};
      
      for (let i = 1; i <= Math.min(totalPages, 50); i++) { // Limit initial thumbnails for performance
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context!,
          viewport: viewport
        }).promise;
        
        newThumbnails[i] = canvas.toDataURL();
      }
      
      setThumbnails(newThumbnails);
      
    } catch (err) {
      console.error("Failed to generate thumbnails", err);
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

  const togglePageSelection = (pageNum: number) => {
    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageNum)) {
      newSelection.delete(pageNum);
    } else {
      newSelection.add(pageNum);
    }
    setSelectedPages(newSelection);
  };
  
  const selectAll = () => {
    const all = new Set<number>();
    for (let i = 1; i <= pageCount; i++) all.add(i);
    setSelectedPages(all);
  };
  
  const deselectAll = () => {
    setSelectedPages(new Set());
  };

  const handleSplit = async () => {
    if (!pdfBytes) return;
    setIsProcessing(true);
    
    try {
      const sourcePdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      
      if (splitMethod === 'custom') {
        if (selectedPages.size === 0) {
          alert('Please select at least one page to extract.');
          setIsProcessing(false);
          return;
        }
        
        const newPdf = await PDFDocument.create();
        const pagesToExtract = Array.from(selectedPages).sort((a, b) => a - b).map(p => p - 1);
        const copiedPages = await newPdf.copyPages(sourcePdf, pagesToExtract);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const outputBytes = await newPdf.save();
        const blob = new Blob([outputBytes], { type: 'application/pdf' });
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFilename(`extracted_${file?.name || 'document'}`);
        
      } else if (splitMethod === 'range') {
        // e.g. "1-5, 8, 11-13"
        const pagesToExtract = new Set<number>();
        const parts = rangeInput.split(',');
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.includes('-')) {
            const [start, end] = trimmed.split('-').map(Number);
            if (start && end && start <= end && start >= 1 && end <= pageCount) {
              for (let i = start; i <= end; i++) pagesToExtract.add(i - 1);
            }
          } else {
            const num = Number(trimmed);
            if (num >= 1 && num <= pageCount) pagesToExtract.add(num - 1);
          }
        }
        
        if (pagesToExtract.size === 0) {
          alert('Invalid page range.');
          setIsProcessing(false);
          return;
        }
        
        const newPdf = await PDFDocument.create();
        const sortedPages = Array.from(pagesToExtract).sort((a, b) => a - b);
        const copiedPages = await newPdf.copyPages(sourcePdf, sortedPages);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const outputBytes = await newPdf.save();
        const blob = new Blob([outputBytes], { type: 'application/pdf' });
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFilename(`extracted_${file?.name || 'document'}`);
        
      } else if (splitMethod === 'fixed') {
        const interval = parseInt(fixedInput);
        if (isNaN(interval) || interval < 1 || interval > pageCount) {
          alert('Invalid interval.');
          setIsProcessing(false);
          return;
        }
        
        const zip = new JSZip();
        
        for (let i = 0; i < pageCount; i += interval) {
          const end = Math.min(i + interval, pageCount);
          const newPdf = await PDFDocument.create();
          const pagesToExtract = [];
          for (let j = i; j < end; j++) pagesToExtract.push(j);
          
          const copiedPages = await newPdf.copyPages(sourcePdf, pagesToExtract);
          copiedPages.forEach(page => newPdf.addPage(page));
          
          const outputBytes = await newPdf.save();
          zip.file(`split_${i + 1}-${end}.pdf`, outputBytes);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setOutputUrl(URL.createObjectURL(zipBlob));
        setOutputFilename(`split_${file?.name.replace('.pdf', '') || 'document'}.zip`);
      }
      
    } catch (err) {
      console.error(err);
      alert('An error occurred during splitting.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBytes(null);
    setPageCount(0);
    setThumbnails({});
    setSelectedPages(new Set());
    setOutputUrl(null);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Scissors className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Split PDF</h1>
              <p className="text-muted-foreground mt-1">Extract pages or split your PDF into multiple files easily.</p>
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
          <div className="max-w-4xl mx-auto bg-card border rounded-2xl shadow-sm overflow-hidden text-center p-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">PDF Split Successfully!</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Your new file is ready to download.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <a 
                 href={outputUrl}
                 download={outputFilename}
                 className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
               >
                 <Download className="w-5 h-5" /> Download File
               </a>
               <button 
                 onClick={resetAll}
                 className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium shadow-sm hover:bg-secondary/80 transition-colors"
               >
                 Split Another PDF
               </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-card border rounded-2xl shadow-sm flex flex-col h-[70vh]">
              <div className="p-4 border-b bg-muted/30 flex flex-wrap justify-between items-center gap-4 shrink-0">
                <div>
                  <h3 className="font-semibold">{file.name}</h3>
                  <p className="text-xs text-muted-foreground">{pageCount} pages • {formatBytes(file.size)}</p>
                </div>
                
                {splitMethod === 'custom' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={selectAll}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors"
                    >
                      Select All
                    </button>
                    <button 
                      onClick={deselectAll}
                      className="px-3 py-1.5 text-muted-foreground hover:bg-muted text-sm font-medium rounded-md transition-colors"
                    >
                      Deselect All
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-4 flex-grow overflow-y-auto bg-muted/10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-max">
                {Array.from({ length: pageCount }).map((_, i) => {
                  const pageNum = i + 1;
                  const isSelected = selectedPages.has(pageNum);
                  
                  return (
                    <div 
                      key={pageNum}
                      onClick={() => splitMethod === 'custom' && togglePageSelection(pageNum)}
                      className={`relative aspect-[1/1.4] border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col items-center justify-center cursor-pointer transition-all ${splitMethod === 'custom' ? 'hover:border-primary/50' : 'opacity-70'} ${isSelected && splitMethod === 'custom' ? 'ring-2 ring-primary border-primary' : ''}`}
                    >
                      {thumbnails[pageNum] ? (
                        <img src={thumbnails[pageNum]} alt={`Page ${pageNum}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileText className="w-8 h-8 opacity-20 mb-2" />
                          <span className="text-xs">Loading...</span>
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 inset-x-0 bg-background/90 backdrop-blur text-center py-1 text-xs font-medium border-t">
                        Page {pageNum}
                      </div>
                      
                      {splitMethod === 'custom' && (
                        <div className={`absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-background/80 border border-muted-foreground/30 text-transparent'}`}>
                          <CheckSquare className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-card border rounded-2xl shadow-sm flex flex-col h-[70vh]">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Split Settings
                </h3>
              </div>
              
              <div className="p-4 flex-grow overflow-y-auto space-y-6">
                
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${splitMethod === 'custom' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'}`}>
                    <input 
                      type="radio" 
                      name="splitMethod" 
                      checked={splitMethod === 'custom'} 
                      onChange={() => setSplitMethod('custom')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-sm">Extract Selected Pages</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Click pages to extract them into a new PDF.</div>
                      
                      {splitMethod === 'custom' && (
                        <div className="mt-2 text-xs font-semibold text-primary">
                          {selectedPages.size} pages selected
                        </div>
                      )}
                    </div>
                  </label>
                  
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${splitMethod === 'range' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'}`}>
                    <input 
                      type="radio" 
                      name="splitMethod" 
                      checked={splitMethod === 'range'} 
                      onChange={() => setSplitMethod('range')}
                      className="mt-1"
                    />
                    <div className="w-full">
                      <div className="font-medium text-sm">Custom Ranges</div>
                      <div className="text-xs text-muted-foreground mt-0.5">E.g. 1-5, 8, 11-13</div>
                      
                      {splitMethod === 'range' && (
                        <input 
                          type="text" 
                          value={rangeInput}
                          onChange={(e) => setRangeInput(e.target.value)}
                          placeholder="1-5, 8, 11-13"
                          className="mt-2 w-full px-3 py-1.5 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      )}
                    </div>
                  </label>
                  
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${splitMethod === 'fixed' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'}`}>
                    <input 
                      type="radio" 
                      name="splitMethod" 
                      checked={splitMethod === 'fixed'} 
                      onChange={() => setSplitMethod('fixed')}
                      className="mt-1"
                    />
                    <div className="w-full">
                      <div className="font-medium text-sm">Fixed Intervals</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Split every N pages</div>
                      
                      {splitMethod === 'fixed' && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm">Every</span>
                          <input 
                            type="number" 
                            min="1"
                            max={pageCount}
                            value={fixedInput}
                            onChange={(e) => setFixedInput(e.target.value)}
                            className="w-16 px-2 py-1 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <span className="text-sm">pages</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

              </div>
              
              <div className="p-4 border-t bg-muted/30 flex flex-col gap-2 shrink-0">
                <button 
                  onClick={handleSplit}
                  disabled={isProcessing || (splitMethod === 'custom' && selectedPages.size === 0)}
                  className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
                  {isProcessing ? 'Processing...' : 'Split PDF'}
                </button>
                <button 
                  onClick={resetAll}
                  className="w-full px-4 py-2 text-muted-foreground hover:bg-muted font-medium rounded-xl transition-colors text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
