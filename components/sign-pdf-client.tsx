'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, Download, Trash2, Loader2, FileSignature, 
  PenTool, Type, Image as ImageIcon, Calendar, X, Plus, 
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Edit3
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import SignatureCanvas from 'react-signature-canvas';
import { Rnd } from 'react-rnd';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type SigElement = {
  id: string;
  type: 'draw' | 'type' | 'image' | 'date';
  pageIndex: number;
  x: number; // percentage (0-100) or absolute based on container size
  y: number; // percentage (0-100) or absolute based on container size
  width: number;
  height: number;
  content?: string; // base64 for draw/image, text for type/date
  fontFamily?: string;
  color?: string;
  fontSize?: number;
};

export default function SignPdfClient() {
  const [file, setFile] = useState<{ name: string; bytes: Uint8Array } | null>(null);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'ready' | 'processing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageViewport, setPageViewport] = useState<any>(null);
  
  const [elements, setElements] = useState<SigElement[]>([]);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigPadRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Load PDF when file is selected
  useEffect(() => {
    if (!file) return;
    
    let isMounted = true;
    const loadPdf = async () => {
      setStatus('analyzing');
      try {
        const loadingTask = pdfjsLib.getDocument({ data: file.bytes.slice(0) });
        const pdf = await loadingTask.promise;
        if (isMounted) {
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          setCurrentPage(1);
          setStatus('ready');
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus('error');
          setErrorMsg(err.message || 'Failed to load PDF');
        }
      }
    };
    loadPdf();
    return () => { isMounted = false; };
  }, [file]);

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || status !== 'ready') return;
    
    let renderTask: any = null;
    let isMounted = true;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        // Calculate scale to fit container width (approx 800px max)
        const containerWidth = containerRef.current?.clientWidth || 800;
        let unscaledViewport = page.getViewport({ scale: 1 });
        const scale = Math.min((containerWidth - 32) / unscaledViewport.width, 1.5);
        const viewport = page.getViewport({ scale });
        
        if (isMounted) {
          setPageViewport(viewport);
          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context!,
              viewport: viewport,
            };
            renderTask = page.render(renderContext);
            await renderTask.promise;
          }
        }
      } catch (err) {
        console.error('Render error', err);
      }
    };
    
    renderPage();
    
    return () => {
      isMounted = false;
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, currentPage, status]);

  const handleFileUpload = async (uploadedFiles: FileList | File[]) => {
    const f = Array.from(uploadedFiles).find(f => f.type === 'application/pdf');
    if (!f) return;
    
    try {
      const arrayBuffer = await f.arrayBuffer();
      setFile({ name: f.name, bytes: new Uint8Array(arrayBuffer) });
      setElements([]);
    } catch (err) {
      console.error(err);
    }
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

  const addElement = (type: 'draw' | 'type' | 'image' | 'date', content?: string) => {
    if (!pageViewport) return;
    
    // Default sizes based on type
    let width = 200;
    let height = type === 'draw' || type === 'image' ? 100 : 50;
    
    if (type === 'date') {
      const today = new Date().toLocaleDateString();
      content = content || today;
      width = 120;
      height = 40;
    }

    const newElement: SigElement = {
      id: Math.random().toString(36).substring(7),
      type,
      pageIndex: currentPage,
      x: (pageViewport.width - width) / 2,
      y: (pageViewport.height - height) / 2,
      width,
      height,
      content,
      color: '#000000',
      fontFamily: 'Helvetica',
      fontSize: 24,
    };
    
    setElements([...elements, newElement]);
    setActiveElement(newElement.id);
    setShowSignatureModal(false);
    setTypedSignature('');
  };

  const saveSignature = () => {
    if (signatureType === 'draw' && sigPadRef.current && !sigPadRef.current.isEmpty()) {
      const dataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
      addElement('draw', dataUrl);
    } else if (signatureType === 'type' && typedSignature) {
      addElement('type', typedSignature);
    }
  };

  const updateElement = (id: string, updates: Partial<SigElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (activeElement === id) setActiveElement(null);
  };

  const handleExport = async () => {
    if (!file || elements.length === 0) return;
    setStatus('processing');
    
    try {
      const pdfDocLib = await PDFDocument.load(file.bytes.slice(0), { ignoreEncryption: true });
      const pages = pdfDocLib.getPages();
      
      const helveticaFont = await pdfDocLib.embedFont(StandardFonts.Helvetica);
      
      for (const el of elements) {
        const page = pages[el.pageIndex - 1]; // 0-indexed
        // We need to map coordinates from our viewport to the actual PDF page size
        
        // Let's get the unscaled original page size from pdfjs to know the mapping
        const pdfjsPage = await pdfDoc?.getPage(el.pageIndex);
        const unscaledViewport = pdfjsPage?.getViewport({ scale: 1 });
        
        if (!unscaledViewport) continue;
        
        const scaleX = unscaledViewport.width / pageViewport.width;
        const scaleY = unscaledViewport.height / pageViewport.height;
        
        const actualX = el.x * scaleX;
        // PDF coordinate system is from bottom-left
        const actualY = page.getHeight() - ((el.y + el.height) * scaleY);
        
        const actualWidth = el.width * scaleX;
        const actualHeight = el.height * scaleY;
        
        if ((el.type === 'draw' || el.type === 'image') && el.content) {
          // Embed image
          const imageBytes = await fetch(el.content).then(res => res.arrayBuffer());
          let embeddedImage;
          if (el.content.startsWith('data:image/png')) {
            embeddedImage = await pdfDocLib.embedPng(imageBytes);
          } else if (el.content.startsWith('data:image/jpeg')) {
            embeddedImage = await pdfDocLib.embedJpg(imageBytes);
          } else {
             // Default to PNG attempt
             embeddedImage = await pdfDocLib.embedPng(imageBytes);
          }
          
          page.drawImage(embeddedImage, {
            x: actualX,
            y: actualY,
            width: actualWidth,
            height: actualHeight,
          });
        } else if ((el.type === 'type' || el.type === 'date') && el.content) {
          // Embed text
          page.drawText(el.content, {
            x: actualX,
            y: actualY + 10, // Slight adjustment for baseline
            size: (el.fontSize || 24) * scaleY,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        }
      }
      
      const pdfBytes = await pdfDocLib.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed_${file.name}`;
      a.click();
      
      setStatus('ready');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Failed to sign PDF');
    }
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
            accept=".pdf,application/pdf" 
            className="hidden" 
          />
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <FileSignature className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Upload PDF to Sign</h3>
          <p className="text-muted-foreground mb-8 text-sm md:text-base max-w-md mx-auto">
            Add signatures, dates, text, and stamps to your PDF documents securely in your browser.
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
            Select PDF File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-muted/10">
      {/* Left sidebar - Tools */}
      <div className="w-full md:w-64 bg-card border-r flex flex-col shrink-0 z-10 shadow-sm">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="font-semibold flex items-center">
            <Edit3 className="w-4 h-4 mr-2" /> Signature Tools
          </h3>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <button 
              onClick={() => setShowSignatureModal(true)}
              className="w-full py-2.5 px-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              <PenTool className="w-4 h-4 mr-2" /> Add Signature
            </button>
            
            <button 
              onClick={() => imageInputRef.current?.click()}
              className="w-full py-2.5 px-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center border font-medium"
            >
              <ImageIcon className="w-4 h-4 mr-2" /> Upload Stamp
            </button>
            <input 
              type="file" 
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/png,image/jpeg,image/webp" 
              className="hidden" 
            />
            
            <button 
              onClick={() => addElement('date')}
              className="w-full py-2.5 px-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center border font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" /> Add Date
            </button>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wider">Document Outline</h4>
            <div className="flex items-center justify-between bg-muted/50 p-2 rounded-lg border">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 hover:bg-background rounded disabled:opacity-50 border shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium">Page {currentPage} of {numPages}</span>
              <button 
                onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                disabled={currentPage === numPages}
                className="p-1 hover:bg-background rounded disabled:opacity-50 border shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wider">Added Elements</h4>
            {elements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg border border-dashed">No elements added yet.</p>
            ) : (
              <div className="space-y-2">
                {elements.map((el, i) => (
                  <div 
                    key={el.id} 
                    className={`flex justify-between items-center p-2 rounded-lg border text-sm ${activeElement === el.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'bg-background hover:border-primary/50'}`}
                    onClick={() => {
                      setCurrentPage(el.pageIndex);
                      setActiveElement(el.id);
                    }}
                  >
                    <div className="flex items-center truncate cursor-pointer">
                      {el.type === 'draw' ? <PenTool className="w-3.5 h-3.5 mr-2 text-primary" /> : 
                       el.type === 'type' ? <Type className="w-3.5 h-3.5 mr-2 text-blue-500" /> :
                       el.type === 'image' ? <ImageIcon className="w-3.5 h-3.5 mr-2 text-green-500" /> :
                       <Calendar className="w-3.5 h-3.5 mr-2 text-orange-500" />}
                      <span className="truncate">
                        {el.type === 'draw' ? 'Signature' : el.type === 'type' ? `Text: ${el.content?.substring(0,10)}...` : el.type === 'image' ? 'Image/Stamp' : 'Date Stamp'} 
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded text-muted-foreground">P{el.pageIndex}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
                        className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t bg-muted/30">
          <button 
            onClick={handleExport}
            disabled={status !== 'ready' || elements.length === 0}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {status === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {status === 'processing' ? 'Processing...' : 'Download Signed PDF'}
          </button>
        </div>
      </div>

      {/* Main content - PDF viewer */}
      <div className="flex-1 relative overflow-auto bg-muted/30 p-4 md:p-8 flex justify-center custom-scrollbar" ref={containerRef}>
        {status === 'analyzing' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center bg-card p-6 rounded-xl shadow-lg border">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="font-medium">Loading PDF...</p>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center bg-card p-6 rounded-xl shadow-lg border max-w-sm">
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <p className="font-medium mb-2">Error loading PDF</p>
              <p className="text-sm text-muted-foreground mb-4">{errorMsg}</p>
              <button onClick={() => setFile(null)} className="px-4 py-2 bg-muted rounded-lg font-medium">Go Back</button>
            </div>
          </div>
        )}

        <div className="relative shadow-xl ring-1 ring-border bg-white inline-block max-w-full">
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
              onClick={() => setActiveElement(el.id)}
            >
              <div className="w-full h-full relative group">
                {el.type === 'draw' || el.type === 'image' ? (
                  <img src={el.content} alt="Signature" className="w-full h-full object-contain pointer-events-none" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center leading-tight whitespace-nowrap overflow-hidden text-black font-medium" style={{ fontSize: `${el.fontSize}px` }}>
                    {el.content}
                  </div>
                )}
                
                {/* Delete button (visible on active/hover) */}
                {activeElement === el.id && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
                    className="absolute -top-3 -right-3 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </Rnd>
          ))}
        </div>
      </div>

      {/* Signature Creation Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <h3 className="font-semibold text-lg">Create Signature</h3>
              <button onClick={() => setShowSignatureModal(false)} className="p-1 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b">
              <div className="flex bg-muted p-1 rounded-lg">
                <button 
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${signatureType === 'draw' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setSignatureType('draw')}
                >
                  Draw
                </button>
                <button 
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${signatureType === 'type' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setSignatureType('type')}
                >
                  Type
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-background flex-1">
              {signatureType === 'draw' ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-xl bg-white shadow-inner relative overflow-hidden h-[200px]">
                    <SignatureCanvas 
                      ref={sigPadRef} 
                      penColor="black" 
                      canvasProps={{className: 'w-full h-full cursor-crosshair'}} 
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <button 
                        onClick={() => sigPadRef.current?.clear()}
                        className="text-xs bg-muted/80 text-foreground px-2 py-1 rounded shadow-sm hover:bg-muted transition-colors font-medium backdrop-blur"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">Draw your signature inside the box above</p>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  <input 
                    type="text" 
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    placeholder="Type your name..."
                    className="w-full border-b-2 border-primary/20 bg-transparent py-4 text-center text-4xl focus:outline-none focus:border-primary transition-colors font-serif"
                    autoFocus
                  />
                  <p className="text-xs text-center text-muted-foreground mt-4">This will be rendered using standard PDF fonts</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-muted/20 flex justify-end gap-3">
              <button 
                onClick={() => setShowSignatureModal(false)}
                className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveSignature}
                disabled={signatureType === 'type' && !typedSignature}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
