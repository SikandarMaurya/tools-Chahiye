'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  UploadCloud, 
  RotateCw, 
  RotateCcw, 
  Download, 
  Trash2, 
  Loader2, 
  FileText, 
  Undo, 
  Redo, 
  CheckSquare, 
  Square, 
  Settings2,
  AlertCircle, CheckCircle2
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PDFDocument, degrees } from 'pdf-lib';
import { motion, AnimatePresence } from 'motion/react';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type PageData = {
  pageIndex: number;
  thumbnailUrl: string;
  originalRotation: number;
  currentRotation: number;
  isSelected: boolean;
  width: number;
  height: number;
};

export default function RotatePdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'processing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  // History stack for undo/redo
  const [history, setHistory] = useState<number[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup URLs
      pages.forEach(p => URL.revokeObjectURL(p.thumbnailUrl));
      if (resultPdfUrl) URL.revokeObjectURL(resultPdfUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileUpload = async (uploadedFile: File) => {
    if (uploadedFile.type !== 'application/pdf') {
      setErrorMsg('Please upload a valid PDF file.');
      setStatus('error');
      return;
    }
    
    // Clear previous
    pages.forEach(p => URL.revokeObjectURL(p.thumbnailUrl));
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
      const numPages = pdf.numPages;
      
      const pageDataList: PageData[] = [];
      const initialRotations: number[] = [];
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        
        // Render thumbnail
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scale = 250 / Math.max(viewport.width, viewport.height); // max dimension 250px
        const thumbViewport = page.getViewport({ scale });
        
        canvas.width = thumbViewport.width;
        canvas.height = thumbViewport.height;
        
        if (ctx) {
          await page.render({
            canvasContext: ctx,
            viewport: thumbViewport
          }).promise;
        }
        
        const originalRotation = page.rotate || 0;
        
        pageDataList.push({
          pageIndex: i - 1, // 0-based
          thumbnailUrl: canvas.toDataURL('image/jpeg', 0.8),
          originalRotation,
          currentRotation: originalRotation,
          isSelected: false,
          width: viewport.width,
          height: viewport.height,
        });
        
        initialRotations.push(originalRotation);
      }
      
      setPages(pageDataList);
      setHistory([initialRotations]);
      setHistoryIndex(0);
      setStatus('ready');
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load PDF.');
      setStatus('error');
    }
  };

  const pushHistory = (newRotations: number[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newRotations);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const applyRotations = (newRotations: number[]) => {
    setPages(prev => prev.map((p, i) => ({
      ...p,
      currentRotation: newRotations[i]
    })));
  };

  const rotatePage = (index: number, direction: 'cw' | 'ccw', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const newRotations = pages.map(p => p.currentRotation);
    const change = direction === 'cw' ? 90 : -90;
    
    // If the page is selected, rotate all selected pages
    if (pages[index].isSelected) {
      pages.forEach((p, i) => {
        if (p.isSelected) {
           newRotations[i] = (newRotations[i] + change + 360) % 360;
        }
      });
    } else {
      // Just rotate this single page
      newRotations[index] = (newRotations[index] + change + 360) % 360;
    }
    
    applyRotations(newRotations);
    pushHistory(newRotations);
  };

  const rotateAll = (direction: 'cw' | 'ccw') => {
    const change = direction === 'cw' ? 90 : -90;
    const newRotations = pages.map(p => (p.currentRotation + change + 360) % 360);
    applyRotations(newRotations);
    pushHistory(newRotations);
  };
  
  const rotateSelected = (direction: 'cw' | 'ccw') => {
    const change = direction === 'cw' ? 90 : -90;
    const newRotations = [...pages.map(p => p.currentRotation)];
    let hasSelected = false;
    pages.forEach((p, i) => {
      if (p.isSelected) {
        newRotations[i] = (newRotations[i] + change + 360) % 360;
        hasSelected = true;
      }
    });
    
    if (hasSelected) {
      applyRotations(newRotations);
      pushHistory(newRotations);
    }
  };

  const toggleSelection = (index: number) => {
    setPages(prev => {
      const next = [...prev];
      next[index] = { ...next[index], isSelected: !next[index].isSelected };
      return next;
    });
  };

  const selectAll = () => {
    const allSelected = pages.every(p => p.isSelected);
    setPages(prev => prev.map(p => ({ ...p, isSelected: !allSelected })));
  };

  const selectOdd = () => {
    setPages(prev => prev.map((p, i) => ({ ...p, isSelected: (i % 2 === 0) })));
  };

  const selectEven = () => {
    setPages(prev => prev.map((p, i) => ({ ...p, isSelected: (i % 2 !== 0) })));
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      applyRotations(history[prevIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      applyRotations(history[nextIndex]);
    }
  };

  const handleExport = async () => {
    if (!pdfBytes) return;
    setStatus('processing');
    
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const pdfPages = pdfDoc.getPages();
      
      for (let i = 0; i < pdfPages.length; i++) {
        // PDF-lib rotate is relative to current rotation, or absolute if we set it.
        // Actually setRotation sets absolute rotation.
        pdfPages[i].setRotation(degrees(pages[i].currentRotation));
      }
      
      const newPdfBytes = await pdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultPdfUrl(url);
      setStatus('done');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to process PDF.');
      setStatus('error');
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBytes(null);
    setPages([]);
    setHistory([]);
    setHistoryIndex(-1);
    setStatus('idle');
    setResultPdfUrl(null);
  };

  const selectedCount = pages.filter(p => p.isSelected).length;

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
                <p className="text-muted-foreground text-sm">Extracting pages and orientations</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content: Thumbnail Grid */}
          <div className="lg:col-span-3">
             <div className="bg-card border rounded-xl p-4 shadow-sm mb-4">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{file?.name}</span>
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                      {pages.length} Pages
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={undo} 
                      disabled={historyIndex <= 0 || status !== 'ready'}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Undo"
                    >
                      <Undo className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={redo} 
                      disabled={historyIndex >= history.length - 1 || status !== 'ready'}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Redo"
                    >
                      <Redo className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-border mx-2"></div>
                    <button 
                      onClick={resetAll}
                      className="text-sm text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" /> Close
                    </button>
                  </div>
                </div>

                {/* Batch Tools */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button 
                    onClick={selectAll}
                    className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {selectedCount === pages.length ? <CheckSquare className="w-4 h-4 mr-1.5" /> : <Square className="w-4 h-4 mr-1.5" />}
                    All
                  </button>
                  <button 
                    onClick={selectOdd}
                    className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors"
                  >
                    Odd
                  </button>
                  <button 
                    onClick={selectEven}
                    className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors"
                  >
                    Even
                  </button>
                  
                  <div className="w-px h-6 bg-border mx-1 self-center"></div>
                  
                  <button 
                    onClick={() => rotateAll('ccw')}
                    disabled={status !== 'ready'}
                    className="text-sm px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-1.5" /> All Left
                  </button>
                  <button 
                    onClick={() => rotateAll('cw')}
                    disabled={status !== 'ready'}
                    className="text-sm px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <RotateCw className="w-4 h-4 mr-1.5" /> All Right
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
                  {pages.map((page, i) => (
                    <div 
                      key={page.pageIndex}
                      onClick={() => toggleSelection(i)}
                      className={`relative rounded-xl border-2 transition-all cursor-pointer group aspect-[3/4] flex flex-col items-center justify-center bg-muted/30 overflow-hidden ${
                        page.isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'
                      }`}
                    >
                      <div className="absolute top-2 left-2 z-10">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          page.isSelected ? 'bg-primary border-primary text-primary-foreground' : 'bg-background/80 border-muted-foreground/30 text-transparent'
                        }`}>
                          <CheckSquare className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      
                      <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm border text-xs font-medium shadow-sm">
                        {page.pageIndex + 1}
                      </div>
                      
                      {/* Image container rotated */}
                      <div className="w-full h-full p-4 flex items-center justify-center">
                        <motion.img 
                          src={page.thumbnailUrl} 
                          alt={`Page ${page.pageIndex + 1}`}
                          className="max-w-full max-h-full object-contain shadow-sm border bg-white rounded-sm"
                          animate={{ rotate: page.currentRotation - page.originalRotation }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        />
                      </div>
                      
                      {/* Hover Controls */}
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
                        <button 
                          onClick={(e) => rotatePage(i, 'ccw', e)}
                          className="p-2 bg-background/90 hover:bg-background text-foreground rounded-full shadow-sm transition-transform hover:scale-110"
                          title="Rotate Left"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => rotatePage(i, 'cw', e)}
                          className="p-2 bg-background/90 hover:bg-background text-foreground rounded-full shadow-sm transition-transform hover:scale-110"
                          title="Rotate Right"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center mb-6">
                  <Settings2 className="w-5 h-5 mr-2 text-primary" />
                  <h3 className="font-semibold">Action Panel</h3>
                </div>

                {selectedCount > 0 && (
                  <div className="mb-6 p-4 bg-muted/50 border rounded-lg">
                    <p className="text-sm font-medium mb-3">{selectedCount} Pages Selected</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => rotateSelected('ccw')}
                        disabled={status !== 'ready'}
                        className="w-full py-2 bg-background border hover:bg-muted rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                      >
                        <RotateCcw className="w-4 h-4 mr-1.5" /> Left
                      </button>
                      <button 
                        onClick={() => rotateSelected('cw')}
                        disabled={status !== 'ready'}
                        className="w-full py-2 bg-background border hover:bg-muted rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                      >
                        <RotateCw className="w-4 h-4 mr-1.5" /> Right
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  {status === 'ready' && (
                    <button 
                      onClick={handleExport}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium shadow-sm transition-colors flex items-center justify-center"
                    >
                      Apply Changes & Save
                    </button>
                  )}
                  
                  {status === 'processing' && (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                      <div className="text-sm font-medium">Generating Rotated PDF...</div>
                    </div>
                  )}

                  {status === 'done' && resultPdfUrl && (
                    <div className="text-center">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <div className="text-sm font-medium mb-4">Success! PDF is ready.</div>
                      <a 
                        href={resultPdfUrl} 
                        download={`rotated_${file?.name || 'document'}.pdf`}
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
