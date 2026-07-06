'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Minimize2, AlertCircle, RefreshCcw, Settings, ChevronRight, FileArchive, CheckCircle2, FileEdit } from 'lucide-react';
import * as mammoth from 'mammoth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

type ConversionQuality = 'standard' | 'high' | 'print';

export default function WordToPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  
  // Settings
  const [quality, setQuality] = useState<ConversionQuality>('standard');
  const [pageSize, setPageSize] = useState('A4');
  
  // Output
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFilename, setOutputFilename] = useState<string>('document.pdf');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const loadFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.docx') && !selectedFile.name.endsWith('.doc')) {
      alert('Please upload a Word document (.docx or .doc).');
      return;
    }
    
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert('File size exceeds the 50MB limit.');
      return;
    }

    setFile(selectedFile);
    setOutputUrl(null);
    setConversionProgress(0);
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
    if (!file) return;
    setIsProcessing(true);
    setConversionProgress(10);
    
    try {
      // 1. Extract text using mammoth
      const arrayBuffer = await file.arrayBuffer();
      setConversionProgress(30);
      
      const result = await mammoth.extractRawText({ arrayBuffer });
      // Sanitize text to remove characters not supported by WinAnsi encoding
      const sanitizeWinAnsi = (str: string) => {
        return str
          .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
          .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
          .replace(/[\u2013\u2014]/g, "-")
          .replace(/[\u2026]/g, "...")
          .replace(/[\u00A0]/g, " ")
          .replace(/[^\x00-\x7F]/g, "*"); // Replace other non-ASCII chars with *
      };
      const text = sanitizeWinAnsi(result.value);
      setConversionProgress(60);
      
      // 2. Generate PDF using pdf-lib
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const margin = 50;
      
      // Basic text wrapping simulation
      const lines = text.split('\n');
      let page = pdfDoc.addPage([595.28, 841.89]); // A4
      let { width, height } = page.getSize();
      let y = height - margin;
      
      for (let i = 0; i < lines.length; i++) {
        let currentLine = lines[i];
        
        if (currentLine.trim() === '') {
          y -= fontSize * 1.5;
        } else {
          // simple line breaks if too long
          const words = currentLine.split(' ');
          let tempLine = '';
          
          for (let j = 0; j < words.length; j++) {
             const testLine = tempLine + words[j] + ' ';
             const textWidth = font.widthOfTextAtSize(testLine, fontSize);
             if (textWidth > width - margin * 2 && tempLine !== '') {
               page.drawText(tempLine, { x: margin, y, size: fontSize, font });
               y -= fontSize * 1.5;
               tempLine = words[j] + ' ';
               
               if (y < margin) {
                 page = pdfDoc.addPage([595.28, 841.89]);
                 y = height - margin;
               }
             } else {
               tempLine = testLine;
             }
          }
          if (tempLine.trim() !== '') {
            page.drawText(tempLine, { x: margin, y, size: fontSize, font });
            y -= fontSize * 1.5;
          }
        }
        
        if (y < margin) {
           page = pdfDoc.addPage([595.28, 841.89]);
           y = height - margin;
        }
      }
      
      setConversionProgress(85);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      setConversionProgress(100);
      setOutputUrl(URL.createObjectURL(blob));
      setOutputFilename(file.name.replace(/\.docx?$/, '.pdf'));
      
    } catch (err) {
      console.error(err);
      alert('An error occurred during conversion. Note: Only .docx files are fully supported for text extraction in the browser.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setOutputUrl(null);
    setConversionProgress(0);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Word to PDF Converter</h1>
              <p className="text-muted-foreground mt-1">Convert Word documents to professional PDF files with high quality.</p>
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
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileInput}
              />
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Drag & Drop Word file here</h3>
              <p className="text-muted-foreground mb-8">Or click to browse from your device (Max 50MB, .docx or .doc)</p>
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
                Select Word File
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
                Your Word document has been converted to a PDF.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <a 
                   href={outputUrl}
                   download={outputFilename}
                   className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                 >
                   <Download className="w-5 h-5" /> Download PDF
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
              <p className="text-sm text-muted-foreground text-center mb-6">{formatBytes(file.size)}</p>
              
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
                  PDF Settings
                </h3>
              </div>
              
              <div className="p-6 flex-grow space-y-6">
                
                <div className="space-y-3">
                  <label className="text-sm font-medium">Conversion Quality</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${quality === 'standard' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-transparent bg-muted/20'}`}>
                      <input type="radio" name="quality" checked={quality === 'standard'} onChange={() => setQuality('standard')} className="sr-only" />
                      <span className="font-medium text-sm">Standard</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${quality === 'high' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-transparent bg-muted/20'}`}>
                      <input type="radio" name="quality" checked={quality === 'high'} onChange={() => setQuality('high')} className="sr-only" />
                      <span className="font-medium text-sm">High Quality</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${quality === 'print' ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-transparent bg-muted/20'}`}>
                      <input type="radio" name="quality" checked={quality === 'print'} onChange={() => setQuality('print')} className="sr-only" disabled />
                      <span className="font-medium text-sm opacity-50">Print Ready (Pro)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Page Size</label>
                  <select 
                    className="w-full p-3 bg-background border rounded-xl"
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                  >
                    <option value="A4">A4</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>
                
              </div>
              
              <div className="px-6 pb-2 text-xs text-muted-foreground bg-card">
                <AlertCircle className="w-3 h-3 inline mr-1 mb-0.5" />
                Note: Client-side demo extracts text only and applies basic formatting. Rich layouts, images, and tables may require backend processing.
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
                    {isProcessing ? 'Converting...' : 'Convert to PDF'}
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
