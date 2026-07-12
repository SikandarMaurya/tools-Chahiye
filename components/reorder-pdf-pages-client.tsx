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
  Copy,
  RotateCw,
  Undo,
  Redo,
  LayoutGrid
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PDFDocument, degrees } from 'pdf-lib';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type PageData = {
  id: string; // unique id for dnd-kit
  originalIndex: number;
  thumbnailUrl: string;
  rotation: number;
  isSelected: boolean;
  width: number;
  height: number;
};

// Sortable item component
function SortableItem(props: {
  page: PageData;
  index: number;
  toggleSelection: (id: string, e: React.MouseEvent) => void;
  rotatePage: (id: string, e: React.MouseEvent) => void;
  deletePage: (id: string, e: React.MouseEvent) => void;
  duplicatePage: (id: string, e: React.MouseEvent) => void;
}) {
  const { page, index, toggleSelection, rotatePage, deletePage, duplicatePage } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative rounded-xl border-2 transition-colors cursor-grab active:cursor-grabbing group aspect-[3/4] flex flex-col items-center justify-center overflow-hidden bg-muted/30 ${
        page.isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-transparent hover:border-border'
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="absolute top-2 left-2 z-10" onPointerDown={(e) => toggleSelection(page.id, e as any)}>
        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
          page.isSelected ? 'bg-primary border-primary text-primary-foreground' : 'bg-background/80 border-muted-foreground/30 text-transparent'
        }`}>
          <CheckSquare className="w-3.5 h-3.5" />
        </div>
      </div>
      
      <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm border text-xs font-medium shadow-sm">
        {index + 1}
      </div>
      
      <div className="w-full h-full p-4 flex items-center justify-center" style={{ transform: `rotate(${page.rotation}deg)` }}>
        <img 
          src={page.thumbnailUrl} 
          alt={`Page ${index + 1}`}
          className="max-w-full max-h-full object-contain shadow-sm border bg-white rounded-sm pointer-events-none"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-1 z-30 pointer-events-none">
         <div className="flex bg-background/90 backdrop-blur-sm rounded-lg border p-1 shadow-sm pointer-events-auto">
            <button 
              onPointerDown={(e) => rotatePage(page.id, e as any)}
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button 
              onPointerDown={(e) => duplicatePage(page.id, e as any)}
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              onPointerDown={(e) => deletePage(page.id, e as any)}
              className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
}

export default function ReorderPdfPagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  
  const [pages, setPages] = useState<PageData[]>([]);
  const [history, setHistory] = useState<PageData[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'processing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // minimum distance to trigger drag (allows clicks)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    return () => {
      // Don't revoke object URLs until we completely reset or unmount, because they are reused
      // between history states. We'll just revoke all on unmount.
      pages.forEach(p => URL.revokeObjectURL(p.thumbnailUrl));
      if (resultPdfUrl) URL.revokeObjectURL(resultPdfUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pushHistory = (newPages: PageData[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPages);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPages(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPages(history[newIndex]);
    }
  };

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
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        
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
          id: `page-${i - 1}-${Date.now()}`,
          originalIndex: i - 1, // 0-based index in the original document
          thumbnailUrl: canvas.toDataURL('image/jpeg', 0.8),
          rotation: 0,
          isSelected: false,
          width: viewport.width,
          height: viewport.height,
        });
      }
      
      setPages(pageDataList);
      setHistory([pageDataList]);
      setHistoryIndex(0);
      setStatus('ready');
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load PDF.');
      setStatus('error');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newPages = arrayMove(items, oldIndex, newIndex);
        pushHistory(newPages);
        return newPages;
      });
    }
  };

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPages = pages.map(p => p.id === id ? { ...p, isSelected: !p.isSelected } : p);
    setPages(newPages);
    // Note: Selection change isn't added to undo history to save memory and avoid confusing undo states
  };

  const rotatePage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPages = pages.map(p => {
       if (p.id === id) {
           return { ...p, rotation: (p.rotation + 90) % 360 };
       }
       return p;
    });
    setPages(newPages);
    pushHistory(newPages);
  };

  const deletePage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPages = pages.filter(p => p.id !== id);
    setPages(newPages);
    pushHistory(newPages);
  };

  const duplicatePage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = pages.findIndex(p => p.id === id);
    if (index !== -1) {
      const pageToDuplicate = pages[index];
      const newPages = [...pages];
      newPages.splice(index + 1, 0, {
        ...pageToDuplicate,
        id: `page-${pageToDuplicate.originalIndex}-${Date.now()}`,
        isSelected: false
      });
      setPages(newPages);
      pushHistory(newPages);
    }
  };

  const selectAll = () => {
    const allSelected = pages.every(p => p.isSelected);
    setPages(pages.map(p => ({ ...p, isSelected: !allSelected })));
  };

  const deleteSelected = () => {
    const newPages = pages.filter(p => !p.isSelected);
    setPages(newPages);
    pushHistory(newPages);
  };

  const rotateSelected = () => {
    const newPages = pages.map(p => p.isSelected ? { ...p, rotation: (p.rotation + 90) % 360 } : p);
    setPages(newPages);
    pushHistory(newPages);
  };

  const duplicateSelected = () => {
    const newPages = [...pages];
    let inserted = 0;
    
    pages.forEach((p, index) => {
      if (p.isSelected) {
        newPages.splice(index + inserted + 1, 0, {
          ...p,
          id: `page-${p.originalIndex}-${Date.now()}`,
          isSelected: false
        });
        inserted++;
      }
    });
    
    setPages(newPages);
    pushHistory(newPages);
  };

  const handleExport = async () => {
    if (!pdfBytes) return;
    setStatus('processing');
    
    try {
      const originalPdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const newPdfDoc = await PDFDocument.create();
      
      if (pages.length === 0) {
        throw new Error('Your document has no pages.');
      }
      
      for (const p of pages) {
        const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [p.originalIndex]);
        if (p.rotation !== 0) {
           const currentRotation = copiedPage.getRotation().angle;
           copiedPage.setRotation(degrees(currentRotation + p.rotation));
        }
        newPdfDoc.addPage(copiedPage);
      }
      
      const newPdfBytes = await newPdfDoc.save();
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
    setPages([]);
    setHistory([]);
    setHistoryIndex(-1);
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
                      {pages.length} Pages • Drag and drop to reorder
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

                <div className="flex flex-wrap gap-2 mb-6">
                  <button 
                    onClick={selectAll}
                    className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {selectedCount === pages.length ? <CheckSquare className="w-4 h-4 mr-1.5" /> : <Square className="w-4 h-4 mr-1.5" />}
                    Select All
                  </button>
                  
                  {selectedCount > 0 && (
                    <>
                       <div className="w-px h-6 bg-border mx-1 self-center"></div>
                       <button 
                         onClick={rotateSelected}
                         className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors flex items-center"
                       >
                         <RotateCw className="w-4 h-4 mr-1.5" /> Rotate ({selectedCount})
                       </button>
                       <button 
                         onClick={duplicateSelected}
                         className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors flex items-center"
                       >
                         <Copy className="w-4 h-4 mr-1.5" /> Copy ({selectedCount})
                       </button>
                       <button 
                         onClick={deleteSelected}
                         className="text-sm px-3 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg font-medium transition-colors flex items-center"
                       >
                         <Trash2 className="w-4 h-4 mr-1.5" /> Delete ({selectedCount})
                       </button>
                    </>
                  )}
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={pages.map(p => p.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {pages.map((page, index) => (
                        <SortableItem 
                           key={page.id} 
                           page={page} 
                           index={index} 
                           toggleSelection={toggleSelection}
                           rotatePage={rotatePage}
                           deletePage={deletePage}
                           duplicatePage={duplicatePage}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                
             </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center mb-6">
                  <LayoutGrid className="w-5 h-5 mr-2 text-primary" />
                  <h3 className="font-semibold">Save Changes</h3>
                </div>

                <div className="text-sm text-muted-foreground mb-6">
                   Reorder pages by dragging and dropping them into the correct position. You can also rotate, delete, or duplicate individual pages.
                </div>
                
                <div className="pt-2">
                  {status === 'ready' && (
                    <button 
                      onClick={handleExport}
                      disabled={pages.length === 0}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      Apply & Save
                    </button>
                  )}
                  
                  {status === 'processing' && (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                      <div className="text-sm font-medium">Generating PDF...</div>
                    </div>
                  )}

                  {status === 'done' && resultPdfUrl && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckSquare className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium mb-4">Success! PDF is ready.</div>
                      <a 
                        href={resultPdfUrl} 
                        download={`reordered_${file?.name || 'document'}.pdf`}
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
