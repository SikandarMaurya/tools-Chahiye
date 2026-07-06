'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Trash2, GripVertical, AlertCircle, RefreshCcw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

type PdfFileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  status: 'pending' | 'error' | 'loaded';
  error?: string;
  pdfDoc?: PDFDocument;
};

function SortablePdfItem({ 
  item, 
  onRemove,
  index 
}: { 
  item: PdfFileItem; 
  onRemove: (id: string) => void;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-xl mb-3 bg-card shadow-sm ${isDragging ? 'shadow-md border-primary/50 opacity-90' : 'hover:border-primary/30'} transition-colors group`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <span className="font-bold text-sm">{index + 1}</span>
      </div>
      
      <div className="flex-grow min-w-0">
        <h4 className="text-sm font-medium truncate" title={item.name}>{item.name}</h4>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <span>{formatBytes(item.size)}</span>
          {item.status === 'loaded' && (
            <span className="bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground font-medium">
              {item.pageCount} page{item.pageCount !== 1 ? 's' : ''}
            </span>
          )}
          {item.status === 'error' && (
             <span className="text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {item.error}</span>
          )}
          {item.status === 'pending' && (
             <span className="text-muted-foreground animate-pulse">Reading file...</span>
          )}
        </div>
      </div>
      
      <button 
        onClick={() => onRemove(item.id)} 
        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
        title="Remove file"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function MergePdfClient() {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [mergedPdfSize, setMergedPdfSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const addFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => f.type === 'application/pdf');
    if (validFiles.length !== newFiles.length) {
      alert('Some files were ignored. Only PDF files are supported.');
    }
    
    const items: PdfFileItem[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: file.size,
      pageCount: 0,
      status: 'pending'
    }));
    
    setFiles(prev => [...prev, ...items].slice(0, 30));
    setMergedPdfUrl(null);
    
    for (const item of items) {
      try {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        
        if (pdfDoc.isEncrypted) {
          setFiles(prev => prev.map(f => f.id === item.id ? { 
            ...f, 
            status: 'error', 
            error: 'Password protected PDF not supported yet' 
          } : f));
          continue;
        }

        const pageCount = pdfDoc.getPageCount();
        setFiles(prev => prev.map(f => f.id === item.id ? { 
          ...f, 
          status: 'loaded', 
          pageCount,
          pdfDoc
        } : f));
      } catch (err) {
        setFiles(prev => prev.map(f => f.id === item.id ? { 
          ...f, 
          status: 'error', 
          error: 'Failed to read PDF' 
        } : f));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };
  
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setMergedPdfUrl(null);
  };
  
  const clearAll = () => {
    if (confirm('Clear all files?')) {
      setFiles([]);
      setMergedPdfUrl(null);
    }
  };

  const handleMerge = async () => {
    const validFiles = files.filter(f => f.status === 'loaded' && f.pdfDoc);
    if (validFiles.length < 2) {
      alert('Please add at least 2 valid PDFs to merge.');
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const item of validFiles) {
        const copiedPages = await mergedPdf.copyPages(item.pdfDoc!, item.pdfDoc!.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setMergedPdfSize(blob.size);
      setMergedPdfUrl(url);
    } catch (err) {
      alert('An error occurred while merging PDFs.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPages = files.filter(f => f.status === 'loaded').reduce((acc, curr) => acc + curr.pageCount, 0);

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Merge PDF</h1>
              <p className="text-muted-foreground mt-1">Combine multiple PDF files in exactly the order you want.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!mergedPdfUrl ? (
          <div className="space-y-6">
            
            {files.length === 0 ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${isDraggingOver ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'}`}
              >
                <input 
                  type="file" 
                  multiple 
                  accept="application/pdf" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileInput}
                />
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Drag & Drop PDFs here</h3>
                <p className="text-muted-foreground mb-8">Or click to browse from your device</p>
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
                  Select PDF Files
                </button>
              </div>
            ) : (
              <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> 
                    Files ({files.length})
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
                      accept="application/pdf" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileInput}
                    />
                  </div>
                </div>
                
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-muted/10">
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={files.map(f => f.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {files.map((item, index) => (
                        <SortablePdfItem 
                          key={item.id} 
                          item={item} 
                          index={index}
                          onRemove={removeFile}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
                
                <div className="p-4 border-t bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{totalPages}</span> total pages
                  </div>
                  <button 
                    onClick={handleMerge}
                    disabled={isProcessing || files.filter(f => f.status === 'loaded').length < 2}
                    className="w-full sm:w-auto px-8 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                    {isProcessing ? 'Merging PDFs...' : 'Merge PDFs'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden text-center p-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">PDFs Merged Successfully!</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Your new PDF file ({formatBytes(mergedPdfSize)}) is ready to download.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <a 
                 href={mergedPdfUrl}
                 download="merged-document.pdf"
                 className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
               >
                 <Download className="w-5 h-5" /> Download Merged PDF
               </a>
               <button 
                 onClick={() => {
                   setMergedPdfUrl(null);
                   setFiles([]);
                 }}
                 className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium shadow-sm hover:bg-secondary/80 transition-colors"
               >
                 Merge More PDFs
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
