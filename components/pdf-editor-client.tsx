'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Loader2, Type, Image as ImageIcon, Square, MousePointer2, Settings, Sparkles, 
  ZoomIn, ZoomOut, ChevronRight, ChevronLeft, X, Trash2, Save, LayoutTemplate,
  RotateCw, RotateCcw, Copy, Download, FileText, Grid, FileEdit, CheckCircle2,
  Maximize2
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { Rnd } from 'react-rnd';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type EditorElement = {
  id: string;
  type: 'text' | 'image' | 'rect' | 'circle';
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  color?: string;
  fontSize?: number;
  opacity?: number;
};

type PageThumbnail = {
  pageIndex: number; // 0-based
  url: string;
  width: number;
  height: number;
  rotation: number;
};

export default function PdfEditorClient() {
  const [file, setFile] = useState<{ name: string; bytes: Uint8Array } | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'processing' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [viewMode, setViewMode] = useState<'upload' | 'dashboard' | 'editor'>('upload');
  
  // AI Panel State
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiMode, setAiMode] = useState<'summary' | 'ocr' | 'chat'>('summary');
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [aiResult, setAiResult] = useState('');
  
  // PDF State
  const [pdfLibDoc, setPdfLibDoc] = useState<PDFDocument | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  
  // Editor State
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [scale, setScale] = useState(1);
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'image' | 'shape'>('select');
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [pageViewport, setPageViewport] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load PDF and generate thumbnails
  const loadPdf = async (bytes: Uint8Array) => {
    setStatus('loading');
    try {
      // 1. Load in pdf-lib for manipulation
      const doc = await PDFDocument.load(bytes.slice(0), { ignoreEncryption: true });
      setPdfLibDoc(doc);
      
      // 2. Generate Thumbnails using pdfjs
      await generateThumbnails(bytes);
      
      setViewMode('dashboard');
      setStatus('ready');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load PDF');
      setStatus('error');
    }
  };

  const generateThumbnails = async (bytes: Uint8Array) => {
    const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
    const pdf = await loadingTask.promise;
    const thumbs: PageThumbnail[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.5 }); // low res for thumbnail
      
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await page.render({ canvasContext: ctx, viewport }).promise;
        thumbs.push({
          pageIndex: i - 1,
          url: canvas.toDataURL('image/jpeg', 0.8),
          width: viewport.width,
          height: viewport.height,
          rotation: page.rotate || 0,
        });
      }
    }
    setThumbnails(thumbs);
  };

  const handleFileUpload = async (uploadedFiles: FileList | File[]) => {
    const f = Array.from(uploadedFiles).find(f => f.type === 'application/pdf');
    if (!f) return;
    try {
      const arrayBuffer = await f.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      setFile({ name: f.name, bytes });
      setElements([]);
      setSelectedPages(new Set());
      await loadPdf(bytes);
    } catch (err) {
      console.error(err);
    }
  };

  // ---- DASHBOARD ACTIONS ----
  const togglePageSelection = (index: number) => {
    const newSet = new Set(selectedPages);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setSelectedPages(newSet);
  };

  const selectAllPages = () => {
    if (selectedPages.size === thumbnails.length) {
      setSelectedPages(new Set());
    } else {
      setSelectedPages(new Set(thumbnails.map((_, i) => i)));
    }
  };

  const rotatePages = async (direction: 'left' | 'right') => {
    if (!pdfLibDoc || selectedPages.size === 0) return;
    setStatus('processing');
    const pages = pdfLibDoc.getPages();
    for (const idx of Array.from(selectedPages)) {
      const page = pages[idx];
      const currentRotation = page.getRotation().angle;
      const newRotation = direction === 'right' ? currentRotation + 90 : currentRotation - 90;
      page.setRotation(degrees(newRotation));
    }
    await refreshPdf();
  };

  const deletePages = async () => {
    if (!pdfLibDoc || selectedPages.size === 0) return;
    setStatus('processing');
    // Delete in reverse order to not mess up indices
    const indices = Array.from(selectedPages).sort((a, b) => b - a);
    for (const idx of indices) {
      pdfLibDoc.removePage(idx);
    }
    // Remove elements associated with deleted pages, and shift pageIndex
    setElements(prev => prev.filter(el => !selectedPages.has(el.pageIndex - 1)).map(el => {
      const deletedBefore = indices.filter(i => i < el.pageIndex - 1).length;
      return { ...el, pageIndex: el.pageIndex - deletedBefore };
    }));
    setSelectedPages(new Set());
    await refreshPdf();
  };

  const extractPages = async () => {
    if (!pdfLibDoc || selectedPages.size === 0) return;
    setStatus('processing');
    try {
      const newPdf = await PDFDocument.create();
      const indices = Array.from(selectedPages).sort((a, b) => a - b);
      const copiedPages = await newPdf.copyPages(pdfLibDoc, indices);
      copiedPages.forEach(p => newPdf.addPage(p));
      
      const pdfBytes = await newPdf.save();
      downloadBytes(pdfBytes, `extracted_${file?.name || 'document.pdf'}`);
      setStatus('ready');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const refreshPdf = async () => {
    if (!pdfLibDoc) return;
    const bytes = await pdfLibDoc.save();
    setFile(prev => prev ? { ...prev, bytes } : null);
    await generateThumbnails(bytes);
    setStatus('ready');
  };

  // ---- EDITOR ACTIONS ----
  const openEditor = (pageIndex: number) => {
    setCurrentPage(pageIndex + 1);
    setViewMode('editor');
    setTimeout(() => renderEditorPage(), 100);
  };

  const renderEditorPage = useCallback(async () => {
    if (!file || !canvasRef.current || viewMode !== 'editor') return;
    try {
      const loadingTask = pdfjsLib.getDocument({ data: file.bytes.slice(0) });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(currentPage);
      
      const unscaledViewport = page.getViewport({ scale: 1 });
      const containerWidth = containerRef.current?.clientWidth || 800;
      const baseScale = Math.min((containerWidth - 64) / unscaledViewport.width, 2.0);
      const viewport = page.getViewport({ scale: baseScale * scale });
      
      setPageViewport(viewport);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({ canvasContext: context, viewport }).promise;
    } catch (err: any) {
      console.error('Render error', err);
    }
  }, [file, currentPage, scale, viewMode]);

  useEffect(() => {
    if (viewMode === 'editor') {
      renderEditorPage();
    }
  }, [renderEditorPage, viewMode, scale, currentPage]);

  const addElement = (type: 'text' | 'image' | 'rect' | 'circle', content?: string) => {
    if (!pageViewport) return;
    let width = 150; let height = 50;
    if (type === 'rect' || type === 'circle') { width = 100; height = 100; } 
    else if (type === 'image') { width = 200; height = 150; }
    
    const newElement: EditorElement = {
      id: Math.random().toString(36).substring(7),
      type,
      pageIndex: currentPage,
      x: (pageViewport.width - width) / 2,
      y: (pageViewport.height - height) / 2,
      width,
      height,
      content: content || (type === 'text' ? 'Double click to edit text' : undefined),
      color: type === 'text' ? '#000000' : '#3b82f6',
      fontSize: 16,
      opacity: 1
    };
    setElements([...elements, newElement]);
    setActiveElement(newElement.id);
    setActiveTool('select');
  };

  const updateElement = (id: string, updates: Partial<EditorElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        addElement('image', event.target.result as string);
      }
    };
    reader.readAsDataURL(f);
  };

  const handleSummarize = async () => {
    if (!file) return;
    setAiStatus('loading');
    setAiResult('');
    try {
      const loadingTask = pdfjsLib.getDocument({ data: file.bytes.slice(0) });
      const pdf = await loadingTask.promise;
      let fullText = '';
      for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((s: any) => s.str).join(' ') + '\n';
      }
      
      const response = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: fullText.substring(0, 8000), tone: 'Professional', format: 'Paragraph', length: 'Detailed' })
      });
      const data = await response.json();
      setAiResult(data.summary || data.text || 'No summary generated.');
      setAiStatus('done');
    } catch (e) {
      console.error(e);
      setAiResult('Failed to generate summary.');
      setAiStatus('done');
    }
  };

  const downloadBytes = (bytes: Uint8Array, filename: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const handleExport = async () => {
    if (!pdfLibDoc || !file) return;
    setStatus('processing');
    
    try {
      // Re-load to ensure we start clean before applying annotations
      const cleanDoc = await PDFDocument.load(file.bytes.slice(0), { ignoreEncryption: true });
      const pages = cleanDoc.getPages();
      const helveticaFont = await cleanDoc.embedFont(StandardFonts.Helvetica);
      
      const loadingTask = pdfjsLib.getDocument({ data: file.bytes.slice(0) });
      const pdfjsDoc = await loadingTask.promise;
      
      for (const el of elements) {
        if (el.pageIndex > pages.length) continue;
        const page = pages[el.pageIndex - 1]; 
        const pdfjsPage = await pdfjsDoc.getPage(el.pageIndex);
        const unscaledViewport = pdfjsPage.getViewport({ scale: 1 });
        
        // We rendered elements relative to pageViewport which had `scale * baseScale` applied.
        // We need to map coordinates back to the unscaled PDF coords.
        const containerWidth = containerRef.current?.clientWidth || 800;
        const baseScale = Math.min((containerWidth - 64) / unscaledViewport.width, 2.0);
        const renderScale = baseScale * scale;
        
        const unscaledX = el.x / renderScale;
        const unscaledY = el.y / renderScale;
        const unscaledWidth = el.width / renderScale;
        const unscaledHeight = el.height / renderScale;
        
        // PDF coordinate system originates from bottom-left
        const actualX = unscaledX;
        const actualY = page.getHeight() - (unscaledY + unscaledHeight);
        
        if (el.type === 'image' && el.content) {
          const imageBytes = await fetch(el.content).then(res => res.arrayBuffer());
          let embeddedImage;
          if (el.content.startsWith('data:image/png')) {
            embeddedImage = await cleanDoc.embedPng(imageBytes);
          } else {
             embeddedImage = await cleanDoc.embedJpg(imageBytes);
          }
          page.drawImage(embeddedImage, {
            x: actualX, y: actualY, width: unscaledWidth, height: unscaledHeight,
          });
        } else if (el.type === 'text' && el.content) {
          page.drawText(el.content, {
            x: actualX,
            y: actualY + (unscaledHeight / 2),
            size: el.fontSize || 16,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        } else if (el.type === 'rect') {
           page.drawRectangle({
             x: actualX, y: actualY, width: unscaledWidth, height: unscaledHeight,
             color: rgb(0.2, 0.5, 0.9), opacity: el.opacity || 0.5
           });
        }
      }
      
      const pdfBytes = await cleanDoc.save();
      downloadBytes(pdfBytes, `edited_${file.name}`);
      setStatus('ready');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Failed to export PDF');
    }
  };

  // ---- RENDERS ----
  if (viewMode === 'upload' || !file) {
    return (
      <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl flex items-center justify-center">
        <div 
          className="w-full border-2 border-dashed rounded-2xl p-16 text-center transition-all border-border bg-card hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            accept=".pdf,application/pdf" className="hidden" 
          />
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutTemplate className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Upload PDF to Workspace</h3>
          <p className="text-muted-foreground mb-8 text-sm md:text-base max-w-md mx-auto">
            Open our enterprise visual workspace to edit, organize, rotate, and annotate PDF pages securely.
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
            Select PDF File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-muted/10">
      {/* GLOBAL HEADER */}
      <div className="bg-card border-b flex flex-wrap items-center justify-between p-3 shadow-sm z-20 gap-2">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2 rounded-lg text-primary mr-2">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-sm truncate max-w-[200px] md:max-w-md">{file.name}</h2>
            <div className="flex space-x-4 text-xs text-muted-foreground mt-0.5">
              <span>{thumbnails.length} pages</span>
              <span>{(file.bytes.byteLength / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
        </div>

        {/* View Mode Toggles */}
        <div className="flex items-center p-1 bg-muted rounded-lg border order-3 md:order-none w-full md:w-auto justify-center">
          <button 
            onClick={() => setViewMode('dashboard')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${viewMode === 'dashboard' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Grid className="w-4 h-4 mr-2" />
            Dashboard
          </button>
          <button 
            onClick={() => setViewMode('editor')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${viewMode === 'editor' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <FileEdit className="w-4 h-4 mr-2" />
            Editor
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className={`px-3 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center text-sm border ${showAIPanel ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted/50 hover:bg-muted text-foreground border-transparent'}`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assistant
          </button>
          
          <button 
            onClick={handleExport}
            disabled={status !== 'ready'}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center text-sm disabled:opacity-50"
          >
            {status === 'processing' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Export
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-row overflow-hidden relative">
        {status === 'processing' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center bg-card p-6 rounded-xl shadow-lg border">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="font-medium">Processing...</p>
            </div>
          </div>
        )}

        {errorMsg && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg flex items-center">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg('')} className="ml-4 hover:opacity-80"><X className="w-4 h-4" /></button>
           </div>
        )}

        {viewMode === 'dashboard' ? (
          /* ================= DASHBOARD VIEW ================= */
          <div className="flex-1 flex flex-col bg-muted/30 overflow-hidden">
            {/* Dashboard Toolbar */}
            <div className="bg-card border-b p-2 flex flex-wrap items-center justify-between shadow-sm gap-2">
               <div className="flex items-center space-x-2">
                 <button onClick={selectAllPages} className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-md font-medium border flex items-center transition-colors">
                   <CheckCircle2 className={`w-4 h-4 mr-2 ${selectedPages.size === thumbnails.length ? 'text-primary' : 'text-muted-foreground'}`} />
                   {selectedPages.size === thumbnails.length ? 'Deselect All' : 'Select All'}
                 </button>
                 <span className="text-sm text-muted-foreground ml-2">
                   {selectedPages.size} selected
                 </span>
               </div>
               
               <div className="flex items-center space-x-2">
                 <button 
                   onClick={() => rotatePages('left')} disabled={selectedPages.size === 0}
                   className="p-2 bg-muted hover:bg-muted/80 rounded-md text-foreground disabled:opacity-50 transition-colors" title="Rotate Left"
                 >
                   <RotateCcw className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => rotatePages('right')} disabled={selectedPages.size === 0}
                   className="p-2 bg-muted hover:bg-muted/80 rounded-md text-foreground disabled:opacity-50 transition-colors" title="Rotate Right"
                 >
                   <RotateCw className="w-4 h-4" />
                 </button>
                 <div className="w-px h-6 bg-border mx-1"></div>
                 <button 
                   onClick={extractPages} disabled={selectedPages.size === 0}
                   className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-md text-sm font-medium disabled:opacity-50 transition-colors flex items-center"
                 >
                   <Copy className="w-4 h-4 mr-2" /> Extract
                 </button>
                 <button 
                   onClick={deletePages} disabled={selectedPages.size === 0}
                   className="px-3 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md text-sm font-medium disabled:opacity-50 transition-colors flex items-center"
                 >
                   <Trash2 className="w-4 h-4 mr-2" /> Delete
                 </button>
               </div>
            </div>
            
            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {thumbnails.map((thumb, idx) => (
                  <div key={idx} className="flex flex-col relative group">
                    <div 
                      onClick={() => togglePageSelection(idx)}
                      className={`relative aspect-[1/1.414] bg-white border-2 rounded-xl overflow-hidden cursor-pointer shadow-sm transition-all
                        ${selectedPages.has(idx) ? 'border-primary ring-2 ring-primary/20 ring-offset-2' : 'border-border hover:border-primary/50'}`}
                    >
                      {/* Checkbox overlay */}
                      <div className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${selectedPages.has(idx) ? 'bg-primary border-primary text-primary-foreground' : 'bg-background/80 border-muted-foreground/50 opacity-0 group-hover:opacity-100'}`}>
                        {selectedPages.has(idx) && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      
                      <img 
                        src={thumb.url} 
                        alt={`Page ${idx + 1}`} 
                        className="w-full h-full object-contain p-2"
                        style={{ transform: `rotate(${thumb.rotation}deg)` }}
                      />
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openEditor(idx); }}
                          className="p-2 bg-white text-black rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                          title="Open in Editor"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-center mt-2 text-sm font-medium text-muted-foreground">
                      Page {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ================= EDITOR VIEW ================= */
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Editor Toolbar */}
            <div className="bg-card border-b flex flex-wrap items-center justify-between p-2 shadow-sm z-20 gap-2">
              <div className="flex items-center space-x-1 pl-2">
                <button 
                  className={`p-2 rounded-md transition-colors ${activeTool === 'select' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                  onClick={() => setActiveTool('select')} title="Select Tool"
                >
                  <MousePointer2 className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-border mx-1"></div>
                <button 
                  className={`p-2 rounded-md transition-colors ${activeTool === 'text' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                  onClick={() => { setActiveTool('text'); addElement('text'); }} title="Add Text"
                >
                  <Type className="w-5 h-5" />
                </button>
                <button 
                  className={`p-2 rounded-md transition-colors ${activeTool === 'image' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                  onClick={() => { setActiveTool('image'); imageInputRef.current?.click(); }} title="Add Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input 
                  type="file" ref={imageInputRef} onChange={handleImageUpload}
                  accept="image/png,image/jpeg,image/webp" className="hidden" 
                />
                <button 
                  className={`p-2 rounded-md transition-colors ${activeTool === 'shape' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                  onClick={() => { setActiveTool('shape'); addElement('rect'); }} title="Add Rectangle"
                >
                  <Square className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-2 bg-muted/50 rounded-lg p-1 border">
                <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-1 hover:bg-background rounded text-muted-foreground">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(s => Math.min(3, s + 0.1))} className="p-1 hover:bg-background rounded text-muted-foreground">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 pr-2">
                {/* Page Navigation */}
                <div className="flex items-center bg-muted/50 rounded-lg p-1 border">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 hover:bg-background rounded disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium px-2">Pg {currentPage} / {thumbnails.length}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(thumbnails.length, p + 1))}
                    disabled={currentPage === thumbnails.length}
                    className="p-1 hover:bg-background rounded disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-row overflow-hidden relative">
              {/* Main Canvas Area */}
              <div 
                className="flex-1 relative overflow-auto bg-muted/30 p-4 md:p-8 flex justify-center custom-scrollbar" 
                ref={containerRef}
                onClick={(e) => { if (e.target === containerRef.current) setActiveElement(null); }}
              >
                <div className="relative shadow-xl ring-1 ring-border bg-white inline-block max-w-full transition-transform origin-top">
                  <canvas ref={canvasRef} className="block max-w-full h-auto" />
                  
                  {/* Overlay elements for current page */}
                  {elements.filter(el => el.pageIndex === currentPage).map(el => (
                    <Rnd
                      key={el.id}
                      size={{ width: el.width, height: el.height }}
                      position={{ x: el.x, y: el.y }}
                      onDragStop={(e, d) => updateElement(el.id, { x: d.x, y: d.y })}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        updateElement(el.id, {
                          width: parseInt(ref.style.width),
                          height: parseInt(ref.style.height),
                          ...position
                        });
                      }}
                      bounds="parent"
                      className={`absolute border-2 ${activeElement === el.id ? 'border-primary ring-2 ring-primary/20 ring-offset-1 border-dashed z-50 bg-primary/5' : 'border-transparent hover:border-primary/50 hover:border-dashed z-40'}`}
                      onClick={(e) => { e.stopPropagation(); setActiveElement(el.id); }}
                    >
                      <div className="w-full h-full relative group flex items-center justify-center">
                        {el.type === 'text' && (
                          <textarea 
                            value={el.content}
                            onChange={(e) => updateElement(el.id, { content: e.target.value })}
                            className="w-full h-full bg-transparent border-none resize-none outline-none overflow-hidden"
                            style={{ fontSize: `${el.fontSize}px`, color: el.color, pointerEvents: activeElement === el.id ? 'auto' : 'none' }}
                          />
                        )}
                        {el.type === 'image' && el.content && (
                          <img src={el.content} alt="User added" className="w-full h-full object-fill pointer-events-none" />
                        )}
                        {el.type === 'rect' && (
                          <div className="w-full h-full bg-blue-500/50 pointer-events-none" style={{ opacity: el.opacity }}></div>
                        )}
                        
                        {/* Delete Button (visible when active) */}
                        {activeElement === el.id && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setElements(elements.filter(e => e.id !== el.id)); }}
                            className="absolute -top-3 -right-3 p-1 bg-destructive text-destructive-foreground rounded-full shadow-sm hover:scale-110 transition-transform"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </Rnd>
                  ))}
                </div>
              </div>
              
              {/* Right Panel (Properties) */}
              {activeElement && elements.find(e => e.id === activeElement) && (
                <div className="w-64 bg-card border-l flex flex-col z-10 shrink-0 absolute right-0 inset-y-0 shadow-2xl lg:relative lg:shadow-none">
                  <div className="p-3 border-b bg-muted/30">
                     <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Properties</h3>
                  </div>
                  <div className="p-4 space-y-4">
                     {(() => {
                       const el = elements.find(e => e.id === activeElement)!;
                       return (
                         <>
                           {el.type === 'text' && (
                             <>
                               <div>
                                 <label className="text-xs font-medium text-muted-foreground block mb-1">Font Size</label>
                                 <input 
                                   type="number" value={el.fontSize || 16} 
                                   onChange={e => updateElement(el.id, { fontSize: parseInt(e.target.value) })}
                                   className="w-full px-2 py-1 bg-background border rounded text-sm"
                                 />
                               </div>
                               <div>
                                 <label className="text-xs font-medium text-muted-foreground block mb-1">Color</label>
                                 <input 
                                   type="color" value={el.color || '#000000'} 
                                   onChange={e => updateElement(el.id, { color: e.target.value })}
                                   className="w-full h-8 bg-background border rounded p-0 cursor-pointer"
                                 />
                               </div>
                             </>
                           )}
                           {el.type === 'rect' && (
                             <div>
                               <label className="text-xs font-medium text-muted-foreground block mb-1">Opacity (%)</label>
                               <input 
                                 type="range" min="0" max="1" step="0.1" value={el.opacity || 0.5} 
                                 onChange={e => updateElement(el.id, { opacity: parseFloat(e.target.value) })}
                                 className="w-full"
                               />
                             </div>
                           )}
                           <button 
                             onClick={() => setElements(elements.filter(e => e.id !== el.id))}
                             className="w-full px-3 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md text-sm font-medium transition-colors flex items-center justify-center mt-4"
                           >
                             <Trash2 className="w-4 h-4 mr-2" /> Delete Element
                           </button>
                         </>
                       );
                     })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showAIPanel && (
        <div className="w-full sm:w-80 bg-card border-l flex flex-col z-30 shrink-0 shadow-2xl absolute right-0 inset-y-0">
          <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
             <div className="flex items-center">
               <Sparkles className="w-4 h-4 text-primary mr-2" />
               <h3 className="font-semibold text-sm">AI Assistant</h3>
             </div>
             <button onClick={() => setShowAIPanel(false)} className="text-muted-foreground hover:text-foreground">
               <X className="w-4 h-4" />
             </button>
          </div>
          <div className="flex p-2 space-x-1 border-b">
            <button 
              onClick={() => setAiMode('summary')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md ${aiMode === 'summary' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            >
              Summary
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {aiMode === 'summary' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Generate an AI summary of this PDF (up to first 10 pages).</p>
                <button 
                  onClick={handleSummarize}
                  disabled={aiStatus === 'loading'}
                  className="w-full py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  {aiStatus === 'loading' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                  Generate Summary
                </button>
                {aiResult && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg border text-sm prose prose-sm dark:prose-invert">
                    {aiResult}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
