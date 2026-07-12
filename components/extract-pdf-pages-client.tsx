'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Download, 
  Trash2, 
  Loader2, 
  CheckSquare, 
  Square, 
  Settings2,
  AlertCircle,
  FileOutput
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion } from 'motion/react';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type PageData = {
  pageIndex: number;
  thumbnailUrl: string;
  isSelected: boolean;
  width: number;
  height: number;
};

export default function ExtractPdfPagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'processing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);
  const [exportMode, setExportMode] = useState<'single' | 'multiple'>('single');
  
  const [rangeInput, setRangeInput] = useState('');

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
    setRangeInput('');
    
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      setPdfBytes(uint8Array);
      
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array.slice(0) });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      
      const pageDataList: PageData[] = [];
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        
        // Render thumbnail
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scale = 250 / Math.max(viewport.width, viewport.height);
        const thumbViewport = page.getViewport({ scale });
        
        canvas.width = thumbViewport.width;
        canvas.height = thumbViewport.height;
        
        if (ctx) {
          await page.render({
            canvasContext: ctx,
            viewport: thumbViewport
          }).promise;
        }
        
        pageDataList.push({
          pageIndex: i - 1, // 0-based
          thumbnailUrl: canvas.toDataURL('image/jpeg', 0.8),
          isSelected: false,
          width: viewport.width,
          height: viewport.height,
        });
      }
      
      setPages(pageDataList);
      setStatus('ready');
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load PDF.');
      setStatus('error');
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
    setPages(prev => prev.map((p, i) => ({ ...p, isSelected: i % 2 === 0 })));
  };

  const selectEven = () => {
    setPages(prev => prev.map((p, i) => ({ ...p, isSelected: i % 2 !== 0 })));
  };

  const applyRangeSelect = () => {
    if (!rangeInput.trim()) return;
    
    const newPages = [...pages];
    let changed = false;
    
    // Clear selection first
    newPages.forEach(p => p.isSelected = false);
    
    const ranges = rangeInput.split(',');
    ranges.forEach(r => {
      if (r.includes('-')) {
        const [startStr, endStr] = r.split('-');
        const start = parseInt(startStr.trim());
        const end = parseInt(endStr.trim());
        
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= newPages.length) {
              newPages[i - 1].isSelected = true;
              changed = true;
            }
          }
        }
      } else {
        const pageNum = parseInt(r.trim());
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= newPages.length) {
          newPages[pageNum - 1].isSelected = true;
          changed = true;
        }
      }
    });
    
    if (changed) {
      setPages(newPages);
    }
  };

  const handleExport = async () => {
    if (!pdfBytes) return;
    setStatus('processing');
    
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      
      const pagesToExtract = pages.filter(p => p.isSelected).map(p => p.pageIndex);
      
      if (pagesToExtract.length === 0) {
        throw new Error('Please select at least one page to extract.');
      }
      
      if (exportMode === 'single') {
        const newPdfDoc = await PDFDocument.create();
        const copiedPages = await newPdfDoc.copyPages(pdfDoc, pagesToExtract);
        copiedPages.forEach(page => newPdfDoc.addPage(page));
        
        const newPdfBytes = await newPdfDoc.save();
        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResultPdfUrl(url);
        setStatus('done');
      } else {
        // Zip package with multiple PDFs
        const zip = new JSZip();
        const baseFileName = file?.name.replace('.pdf', '') || 'document';
        
        for (const pageIndex of pagesToExtract) {
          const newPdfDoc = await PDFDocument.create();
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);
          newPdfDoc.addPage(copiedPage);
          
          const newPdfBytes = await newPdfDoc.save();
          zip.file(`${baseFileName}_page-${pageIndex + 1}.pdf`, newPdfBytes);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        setResultPdfUrl(url);
        setStatus('done');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to process PDF.');
      setStatus('error');
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBytes(null);
    setPages([]);
    setStatus('idle');
    if (resultPdfUrl) URL.revokeObjectURL(resultPdfUrl);
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
                <p className="text-muted-foreground text-sm">Extracting pages</p>
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
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{file?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {pages.length} Pages Total • {selectedCount} Selected for Extraction
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

                <div className="flex flex-wrap gap-2 mb-6">
                  <button 
                    onClick={selectAll}
                    className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {selectedCount === pages.length ? <CheckSquare className="w-4 h-4 mr-1.5" /> : <Square className="w-4 h-4 mr-1.5" />}
                    Select All
                  </button>
                  <button 
                    onClick={selectOdd}
                    className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors flex items-center"
                  >
                    Odd Pages
                  </button>
                  <button 
                    onClick={selectEven}
                    className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors flex items-center"
                  >
                    Even Pages
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
                  {pages.map((page, i) => (
                    <div 
                      key={page.pageIndex}
                      onClick={() => toggleSelection(i)}
                      className={`relative rounded-xl border-2 transition-all cursor-pointer group aspect-[3/4] flex flex-col items-center justify-center overflow-hidden ${
                        page.isSelected ? 'bg-primary/5 border-primary ring-2 ring-primary/20' : 
                        'bg-muted/30 border-transparent hover:border-border'
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
                      
                      <div className="w-full h-full p-4 flex items-center justify-center">
                        <img 
                          src={page.thumbnailUrl} 
                          alt={`Page ${page.pageIndex + 1}`}
                          className="max-w-full max-h-full object-contain shadow-sm border bg-white rounded-sm"
                        />
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
                  <h3 className="font-semibold">Extraction Settings</h3>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Select by Range</label>
                  <p className="text-xs text-muted-foreground mb-3">e.g., 1-5, 8, 11-13</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                      placeholder="Enter pages..."
                      className="flex-1 bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      disabled={status !== 'ready'}
                    />
                    <button 
                      onClick={applyRangeSelect}
                      disabled={!rangeInput.trim() || status !== 'ready'}
                      className="px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                
                <div className="mb-6 border-t pt-6">
                  <label className="block text-sm font-medium mb-3">Export Mode</label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <input 
                        type="radio" 
                        name="exportMode" 
                        value="single" 
                        checked={exportMode === 'single'}
                        onChange={() => setExportMode('single')}
                        className="mr-3"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Merge into Single PDF</span>
                        <span className="text-xs text-muted-foreground">All extracted pages in one file</span>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <input 
                        type="radio" 
                        name="exportMode" 
                        value="multiple" 
                        checked={exportMode === 'multiple'}
                        onChange={() => setExportMode('multiple')}
                        className="mr-3"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Extract as Separate PDFs</span>
                        <span className="text-xs text-muted-foreground">Download as ZIP archive</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 border-t pt-6">
                  {status === 'ready' && (
                    <button 
                      onClick={handleExport}
                      disabled={selectedCount === 0}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      <FileOutput className="w-4 h-4 mr-2" />
                      Extract Pages ({selectedCount})
                    </button>
                  )}
                  
                  {status === 'processing' && (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                      <div className="text-sm font-medium">Processing...</div>
                    </div>
                  )}

                  {status === 'done' && resultPdfUrl && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckSquare className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium mb-4">Success! {exportMode === 'single' ? 'PDF' : 'ZIP'} is ready.</div>
                      <a 
                        href={resultPdfUrl} 
                        download={`extracted_${file?.name || 'document'}${exportMode === 'single' ? '.pdf' : '.zip'}`}
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm transition-colors flex items-center justify-center mb-3"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download {exportMode === 'single' ? 'PDF' : 'ZIP'}
                      </a>
                      <button 
                        onClick={() => setStatus('ready')}
                        className="w-full py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                      >
                        Extract More Pages
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
