'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Minimize2, AlertCircle, RefreshCcw, Settings, ChevronRight, FileArchive, CheckCircle2, FileEdit } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { Document, Packer, Paragraph, TextRun } from 'docx';

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

type ConversionMode = 'standard' | 'high_accuracy' | 'ocr';

export default function PdfToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  
  // Settings
  const [conversionMode, setConversionMode] = useState<ConversionMode>('standard');
  const [conversionProgress, setConversionProgress] = useState(0);
  
  // Output
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFilename, setOutputFilename] = useState<string>('document.docx');
  
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
    setConversionProgress(0);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      setPdfBytes(bytes);
      
      const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
      const loadedPdf = await loadingTask.promise;
      setPageCount(loadedPdf.numPages);
      
    } catch (err) {
      console.error(err);
      alert('Failed to read PDF file. It might be corrupted or password protected.');
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

  const handleConvert = async () => {
    if (!file || !pdfBytes) return;
    setIsProcessing(true);
    setConversionProgress(10);
    
    try {
      // Basic text extraction for client-side demo
      // In a real enterprise app, this would be sent to a backend API doing layout parsing, OCR, etc.
      
      const loadingTask = pdfjsLib.getDocument({ data: pdfBytes.slice(0) });
      const pdf = await loadingTask.promise;
      
      const allTextPages = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let lastY, text = '';
        for (const item of textContent.items) {
          if ('str' in item) {
             if (lastY !== item.transform[5] && text.length > 0) {
                text += '\n';
             }
             text += item.str;
             lastY = item.transform[5];
          }
        }
        
        allTextPages.push(text);
        
        setConversionProgress(10 + Math.floor((i / pdf.numPages) * 60)); // Up to 70%
      }
      
      // Create Word Document
      setConversionProgress(80);
      
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: allTextPages.flatMap(pageText => 
              pageText.split('\n').map(line => 
                new Paragraph({
                  children: [new TextRun(line)],
                })
              )
            ),
          },
        ],
      });
      
      const blob = await Packer.toBlob(doc);
      setConversionProgress(100);
      
      setOutputUrl(URL.createObjectURL(blob));
      setOutputFilename(file.name.replace('.pdf', '.docx'));
      
    } catch (err) {
      console.error(err);
      alert('An error occurred during conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBytes(null);
    setPageCount(0);
    setOutputUrl(null);
    setConversionProgress(0);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <FileEdit className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">PDF to Word Converter</h1>
              <p className="text-muted-foreground mt-1">Convert PDF files into editable Word documents with high accuracy.</p>
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
              <h2 className="text-3xl font-bold mb-2">Conversion Successful!</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Your PDF has been converted to an editable Word document.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <a 
                   href={outputUrl}
                   download={outputFilename}
                   className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                 >
                   <Download className="w-5 h-5" /> Download DOCX
                 </a>
                 <button 
                   onClick={resetAll}
                   className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium shadow-sm hover:bg-secondary/80 transition-colors"
                 >
                   Convert Another File
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
                  Conversion Mode
                </h3>
              </div>
              
              <div className="p-6 flex-grow space-y-4">
                
                <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${conversionMode === 'standard' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-transparent'}`}>
                  <input 
                    type="radio" 
                    name="conversionMode" 
                    checked={conversionMode === 'standard'} 
                    onChange={() => setConversionMode('standard')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      Standard Text
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider rounded">Default</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Fast conversion. Extracts text and basic paragraphs. Client-side processing.</div>
                  </div>
                </label>
                
                <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${conversionMode === 'high_accuracy' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-transparent'}`}>
                  <input 
                    type="radio" 
                    name="conversionMode" 
                    checked={conversionMode === 'high_accuracy'} 
                    onChange={() => setConversionMode('high_accuracy')}
                    className="mt-1"
                    disabled
                  />
                  <div className="opacity-70">
                    <div className="font-semibold flex items-center gap-2">
                      High Accuracy
                      <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] uppercase font-bold tracking-wider rounded">Pro</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Maximum layout preservation. Keeps tables, images, and fonts intact (Server required).</div>
                  </div>
                </label>
                
                <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${conversionMode === 'ocr' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-transparent'}`}>
                  <input 
                    type="radio" 
                    name="conversionMode" 
                    checked={conversionMode === 'ocr'} 
                    onChange={() => setConversionMode('ocr')}
                    className="mt-1"
                    disabled
                  />
                  <div className="opacity-70">
                    <div className="font-semibold flex items-center gap-2">
                      OCR Mode
                      <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] uppercase font-bold tracking-wider rounded">Pro</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">For scanned PDFs. Uses AI to recognize text from images.</div>
                  </div>
                </label>

              </div>
              
              <div className="px-6 pb-2 text-xs text-muted-foreground bg-card">
                <AlertCircle className="w-3 h-3 inline mr-1 mb-0.5" />
                Note: Client-side demo uses basic text extraction. Layout and images may not be fully preserved without server-side processing.
              </div>
              
              <div className="p-6 border-t bg-muted/10">
                {isProcessing && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Converting...</span>
                      <span className="font-medium">{conversionProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${conversionProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button 
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <FileEdit className="w-5 h-5" />}
                    {isProcessing ? 'Converting...' : 'Convert to Word'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
