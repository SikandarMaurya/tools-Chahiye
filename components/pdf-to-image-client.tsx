'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { UploadCloud, FileImage, Settings, Download, Trash2, Loader2, Image as ImageIcon, Sparkles, CheckCircle2, ChevronRight, Layers, Layout, ZoomIn, Maximize2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'motion/react';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type OutputFormat = 'jpg' | 'png' | 'webp' | 'avif' | 'tiff';
type DPISetting = 72 | 96 | 150 | 300 | 600 | 1200;
type PageSelectionType = 'all' | 'custom' | 'odd' | 'even';
type ColorMode = 'rgb' | 'grayscale' | 'bw';

interface ExportSettings {
  format: OutputFormat;
  dpi: DPISetting;
  quality: number; // 1-100
  transparent: boolean; // For PNG
  colorMode: ColorMode;
  pageSelection: PageSelectionType;
  customPages: string; // e.g., "1,3,5-10"
}

export default function PDFToImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  
  // Previews
  const [previews, setPreviews] = useState<string[]>([]);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPreviewPage, setSelectedPreviewPage] = useState(1);

  const [settings, setSettings] = useState<ExportSettings>({
    format: 'jpg',
    dpi: 300,
    quality: 90,
    transparent: false,
    colorMode: 'rgb',
    pageSelection: 'all',
    customPages: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);


  const generatePreview = useCallback(async (doc: pdfjsLib.PDFDocumentProxy, pageNum: number) => {
    try {
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 }); // low res for preview
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      
      // Calculate a reasonable preview scale (e.g. max width 400px)
      const scale = Math.min(400 / viewport.width, 1.0);
      const scaledViewport = page.getViewport({ scale });
      
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: scaledViewport,
      }).promise;
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setPreviews(prev => {
        const newPreviews = [...prev];
        newPreviews[pageNum - 1] = dataUrl;
        return newPreviews;
      });
      setSelectedPreviewPage(pageNum);
    } catch (e) {
      console.error('Failed to generate preview', e);
    }
  }, []);

  const loadPDF = useCallback(async (pdfFile: File) => {
    try {
      setIsProcessing(true);
      setStatusText('Analyzing PDF...');
      const arrayBuffer = await pdfFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
      const doc = await loadingTask.promise;
      
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      
      // Generate preview for first page
      await generatePreview(doc, 1);
      
      setIsProcessing(false);
      setStatusText('');
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Failed to load PDF file. It might be corrupted or password-protected.');
      setIsProcessing(false);
      setFile(null);
    }
  }, [generatePreview]);
  useEffect(() => {
    if (file) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadPDF(file);
    }
  }, [file, loadPDF]);


  const handleConvert = async () => {
    if (!pdfDoc) return;
    setIsProcessing(true);
    setProgress(0);
    setStatusText('Converting pages...');
    
    try {
      const zip = new JSZip();
      
      let pagesToConvert: number[] = [];
      if (settings.pageSelection === 'all') {
        for (let i = 1; i <= numPages; i++) pagesToConvert.push(i);
      } else if (settings.pageSelection === 'odd') {
        for (let i = 1; i <= numPages; i += 2) pagesToConvert.push(i);
      } else if (settings.pageSelection === 'even') {
        for (let i = 2; i <= numPages; i += 2) pagesToConvert.push(i);
      } else if (settings.pageSelection === 'custom' && settings.customPages) {
        const parts = settings.customPages.split(',');
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map(s => parseInt(s.trim()));
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) {
                if (i >= 1 && i <= numPages) pagesToConvert.push(i);
              }
            }
          } else {
            const num = parseInt(part.trim());
            if (!isNaN(num) && num >= 1 && num <= numPages) pagesToConvert.push(num);
          }
        }
      }
      
      if (pagesToConvert.length === 0) {
        for (let i = 1; i <= numPages; i++) pagesToConvert.push(i);
      }
      
      // Deduplicate and sort
      pagesToConvert = Array.from(new Set(pagesToConvert)).sort((a, b) => a - b);
      
      for (let i = 0; i < pagesToConvert.length; i++) {
        const pageNum = pagesToConvert[i];
        setStatusText(`Converting page ${pageNum} of ${numPages}...`);
        
        const page = await pdfDoc.getPage(pageNum);
        const scale = settings.dpi / 72; // default PDF points is 72 dpi
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Fill background if not transparent
        if (!settings.transparent || settings.format !== 'png') {
          context.fillStyle = 'white';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
        
        let mimeType = 'image/jpeg';
        if (settings.format === 'png') mimeType = 'image/png';
        if (settings.format === 'webp') mimeType = 'image/webp';
        
        const dataUrl = canvas.toDataURL(mimeType, settings.quality / 100);
        const base64Data = dataUrl.split(',')[1];
        
        const filename = `${file?.name.replace('.pdf', '')}_page-${pageNum}.${settings.format}`;
        zip.file(filename, base64Data, { base64: true });
        
        setProgress(Math.round(((i + 1) / pagesToConvert.length) * 100));
      }
      
      setStatusText('Zipping images...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${file?.name.replace('.pdf', '')}_images.zip`);
      
      setIsFinished(true);
      setIsProcessing(false);
      setStatusText('');
    } catch (e) {
      console.error(e);
      alert('Failed to convert PDF.');
      setIsProcessing(false);
      setStatusText('');
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfDoc(null);
    setNumPages(0);
    setIsProcessing(false);
    setProgress(0);
    setStatusText('');
    setIsFinished(false);
    setPreviews([]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Convert PDF to Image</h2>
        <p className="text-muted-foreground text-lg">
          Extract pages from your PDF as high-quality JPG, PNG, or WEBP images.
        </p>
      </div>

      {!file ? (
        <div className="max-w-3xl mx-auto">
          <div 
            className="border-2 border-dashed rounded-2xl p-16 text-center transition-all border-border bg-card hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => e.target.files && e.target.files[0] && setFile(e.target.files[0])}
              accept=".pdf,application/pdf" 
              className="hidden" 
            />
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
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-semibold text-lg">{file.name}</span>
                <span className="text-sm text-muted-foreground">{numPages} Pages</span>
              </div>
              <button 
                onClick={resetAll}
                className="text-sm text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1.5" /> Remove
              </button>
            </div>
            
            {previews.length > 0 && (
              <div className="bg-card border rounded-xl p-6 shadow-sm text-center">
                <h3 className="font-semibold mb-4 text-left">Preview (Page {selectedPreviewPage})</h3>
                <img src={previews[selectedPreviewPage - 1]} alt={`Preview of page ${selectedPreviewPage}`} className="mx-auto border shadow-sm max-h-[400px] object-contain" />
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                Export Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Format</label>
                  <select 
                    className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={settings.format}
                    onChange={(e) => setSettings({...settings, format: e.target.value as OutputFormat})}
                    disabled={isProcessing}
                  >
                    <option value="jpg">JPG (Best for photos)</option>
                    <option value="png">PNG (Best for text/transparency)</option>
                    <option value="webp">WEBP (Smallest file size)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Quality (DPI)</label>
                  <select 
                    className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={settings.dpi}
                    onChange={(e) => setSettings({...settings, dpi: parseInt(e.target.value) as DPISetting})}
                    disabled={isProcessing}
                  >
                    <option value="72">72 DPI (Web)</option>
                    <option value="150">150 DPI (Medium)</option>
                    <option value="300">300 DPI (Print Quality)</option>
                    <option value="600">600 DPI (High Quality)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Pages</label>
                  <select 
                    className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
                    value={settings.pageSelection}
                    onChange={(e) => setSettings({...settings, pageSelection: e.target.value as PageSelectionType})}
                    disabled={isProcessing}
                  >
                    <option value="all">All Pages</option>
                    <option value="odd">Odd Pages</option>
                    <option value="even">Even Pages</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  
                  {settings.pageSelection === 'custom' && (
                    <input 
                      type="text"
                      placeholder="e.g. 1-5, 8, 11-13"
                      className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={settings.customPages}
                      onChange={(e) => setSettings({...settings, customPages: e.target.value})}
                      disabled={isProcessing}
                    />
                  )}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                {isProcessing ? (
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                    <div className="text-sm font-medium mb-2">{statusText}</div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                ) : isFinished ? (
                  <div className="text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <div className="text-sm font-medium mb-4">Conversion complete!</div>
                    <button 
                      onClick={resetAll}
                      className="w-full py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                    >
                      Convert Another File
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleConvert}
                    disabled={!pdfDoc}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    Convert to {settings.format.toUpperCase()}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
