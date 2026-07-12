'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, FileText, Download, Trash2, Loader2, Sparkles, AlertCircle, FileSearch, Globe, ChevronRight, Type, Activity } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import Tesseract from 'tesseract.js';
import JSZip from 'jszip';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export default function OcrPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [language, setLanguage] = useState('eng');
  const [ocrMode, setOcrMode] = useState<'fast' | 'standard'>('fast');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileUpload = (uploadedFiles: FileList | File[]) => {
    const f = Array.from(uploadedFiles).find(f => f.type === 'application/pdf' || f.type.startsWith('image/'));
    if (!f) {
      setErrorMsg('Please select a valid PDF or Image file.');
      return;
    }
    
    if (f.size > 100 * 1024 * 1024) {
      setErrorMsg('File size exceeds 100MB limit for Free tier.');
      return;
    }

    setFile(f);
    setErrorMsg('');
    setExtractedText('');
    setProgress(0);
  };

  const extractTextFromImage = async (imageUrl: string, lang: string) => {
    const worker = await Tesseract.createWorker(lang, 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
        }
      }
    });
    const { data: { text } } = await worker.recognize(imageUrl);
    await worker.terminate();
    return text;
  };

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatusText('Initializing AI OCR Engine...');
    setProgress(0);
    setErrorMsg('');
    setExtractedText('');

    try {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        setStatusText('Recognizing text...');
        const text = await extractTextFromImage(imageUrl, language);
        setExtractedText(text);
        URL.revokeObjectURL(imageUrl);
      } else if (file.type === 'application/pdf') {
        setStatusText('Parsing PDF Document...');
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
        const doc = await loadingTask.promise;
        
        let fullText = '';
        const numPages = doc.numPages;
        
        for (let i = 1; i <= numPages; i++) {
          setStatusText(`Processing Page ${i} of ${numPages}...`);
          setProgress(Math.round(((i - 1) / numPages) * 100));
          
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: ocrMode === 'fast' ? 1.5 : 2.5 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          if (context) {
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            await page.render(renderContext).promise;
            
            const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
            const text = await extractTextFromImage(imageUrl, language);
            fullText += `--- Page ${i} ---\n\n${text}\n\n`;
          }
        }
        setExtractedText(fullText);
        setProgress(100);
      }
      
      setStatusText('Extraction Complete!');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during OCR processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (format: 'txt' | 'json') => {
    if (!extractedText) return;
    
    let content = extractedText;
    let mimeType = 'text/plain';
    let extension = 'txt';
    
    if (format === 'json') {
      content = JSON.stringify({ filename: file?.name, text: extractedText }, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr_result_${file?.name}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!file) {
    return (
      <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl flex items-center justify-center">
        <div 
          className="w-full border-2 border-dashed rounded-2xl p-16 text-center transition-all border-border bg-card hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            accept=".pdf,image/*" 
            className="hidden" 
          />
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <FileSearch className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Upload File for OCR</h3>
          <p className="text-muted-foreground mb-8 text-sm md:text-base max-w-md mx-auto">
            Drag and drop a PDF or Image here to extract text using our Enterprise AI Engine. Supported formats: PDF, JPG, PNG, WEBP.
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
            Select File
          </button>
          
          {errorMsg && (
            <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center text-sm">
              <AlertCircle className="w-4 h-4 mr-2" /> {errorMsg}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl flex flex-col h-full">
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px]">
        {/* Settings Panel */}
        <div className="w-full md:w-80 bg-muted/20 border-r p-6 flex flex-col overflow-y-auto shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              OCR Settings
            </h3>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center">
                <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                Document Language
              </label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                disabled={isProcessing || !!extractedText}
              >
                <option value="eng">English</option>
                <option value="hin">Hindi</option>
                <option value="fra">French</option>
                <option value="deu">German</option>
                <option value="spa">Spanish</option>
                <option value="ara">Arabic</option>
                <option value="jpn">Japanese</option>
                <option value="chi_sim">Chinese (Simplified)</option>
                <option value="kor">Korean</option>
                <option value="rus">Russian</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center">
                <Activity className="w-4 h-4 mr-2 text-muted-foreground" />
                OCR Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${ocrMode === 'fast' ? 'bg-primary/10 border-primary text-primary' : 'bg-background hover:bg-muted'}`}
                  onClick={() => setOcrMode('fast')}
                  disabled={isProcessing || !!extractedText}
                >
                  Fast OCR
                </button>
                <button
                  className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${ocrMode === 'standard' ? 'bg-primary/10 border-primary text-primary' : 'bg-background hover:bg-muted'}`}
                  onClick={() => setOcrMode('standard')}
                  disabled={isProcessing || !!extractedText}
                >
                  High Accuracy
                </button>
              </div>
            </div>
            
            {errorMsg && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg flex items-start text-xs">
                <AlertCircle className="w-4 h-4 mr-1.5 shrink-0 mt-0.5" /> 
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
          
          <div className="pt-6 border-t mt-6">
            {!extractedText ? (
              <button 
                onClick={processFile}
                disabled={isProcessing}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileSearch className="w-5 h-5 mr-2" />
                    Start AI OCR
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={() => {
                  setFile(null);
                  setExtractedText('');
                }}
                className="w-full py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear & Start Over
              </button>
            )}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 bg-background flex flex-col relative overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-muted/10">
            <div className="flex items-center text-sm font-medium">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded flex items-center justify-center mr-3">
                <Type className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[200px] md:max-w-xs">{file.name}</span>
            </div>
            
            {extractedText && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownload('txt')}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-1.5" /> TXT
                </button>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 relative bg-muted/5 p-4 flex flex-col">
            {isProcessing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 p-6">
                <div className="w-full max-w-md bg-card border rounded-2xl p-8 shadow-xl text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <svg className="animate-spin w-full h-full text-primary/20" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75 text-primary" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold">{progress}%</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Analyzing Document</h3>
                  <p className="text-muted-foreground text-sm">{statusText}</p>
                </div>
              </div>
            ) : extractedText ? (
              <textarea
                ref={textAreaRef}
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full h-full p-4 border rounded-xl resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none font-mono text-sm leading-relaxed custom-scrollbar bg-white"
                placeholder="Extracted text will appear here..."
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Ready to Extract</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Click &apos;Start AI OCR&apos; to begin analyzing your document.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
