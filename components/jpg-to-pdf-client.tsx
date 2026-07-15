'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, PageSizes, rgb, degrees } from 'pdf-lib';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Settings2,
  ArrowRight,
  Trash2,
  MoveVertical,
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type FileItem = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
};

type PageSizeOption = 'A4' | 'Letter' | 'Fit';
type OrientationOption = 'Portrait' | 'Landscape' | 'Auto';
type MarginOption = 'None' | 'Small' | 'Large';

export default function JpgToPdfClient() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [pageSize, setPageSize] = useState<PageSizeOption>('A4');
  const [orientation, setOrientation] = useState<OrientationOption>('Portrait');
  const [margin, setMargin] = useState<MarginOption>('Small');
  
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultPdf, setResultPdf] = useState<string | null>(null);
  
  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      if (resultPdf) URL.revokeObjectURL(resultPdf);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 }); // Fallback
        URL.revokeObjectURL(url);
      }
      img.src = url;
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newItems: FileItem[] = [];
    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        const dims = await getImageDimensions(file);
        newItems.push({
          id: Math.random().toString(36).substring(7),
          file,
          previewUrl: URL.createObjectURL(file),
          width: dims.width,
          height: dims.height,
        });
      }
    }
    setFiles((prev) => [...prev, ...newItems]);
    setStatus('idle');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.bmp']
    }
  });

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => {
      const item = prev.find(i => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  };
  
  const handleClearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
    setStatus('idle');
    setResultPdf(null);
  };
  
  const getMarginPoints = (marginType: MarginOption, pw: number, ph: number) => {
    switch(marginType) {
      case 'None': return 0;
      case 'Small': return Math.min(pw, ph) * 0.05; // 5% of smallest dimension
      case 'Large': return Math.min(pw, ph) * 0.1; // 10%
      default: return 0;
    }
  };

  const fileToImageBytes = async (file: File): Promise<Uint8Array> => {
    const buffer = await file.arrayBuffer();
    return new Uint8Array(buffer);
  };

  // Convert non-standard images (webp, avif, bmp) to PNG using canvas
  const convertImageToPngBytes = (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
           reject(new Error("Could not get canvas context"));
           return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const buffer = await blob.arrayBuffer();
            resolve(new Uint8Array(buffer));
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
          URL.revokeObjectURL(url);
        }, 'image/png');
      };
      img.onerror = () => {
        reject(new Error("Failed to load image for conversion"));
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress(0);
    setErrorMsg('');
    
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i];
        let image;
        
        try {
          if (fileItem.file.type === 'image/jpeg' || fileItem.file.type === 'image/jpg') {
            const bytes = await fileToImageBytes(fileItem.file);
            image = await pdfDoc.embedJpg(bytes);
          } else if (fileItem.file.type === 'image/png') {
             const bytes = await fileToImageBytes(fileItem.file);
             image = await pdfDoc.embedPng(bytes);
          } else {
             // WEBP, AVIF, BMP, GIF, etc.
             const pngBytes = await convertImageToPngBytes(fileItem.file);
             image = await pdfDoc.embedPng(pngBytes);
          }
        } catch (err) {
          console.error("Failed to embed image", err);
          throw new Error(`Failed to process image ${fileItem.file.name}`);
        }

        let pw = 0;
        let ph = 0;
        
        // Determine Page Size
        if (pageSize === 'Fit') {
          pw = image.width;
          ph = image.height;
        } else {
          const dims = pageSize === 'A4' ? PageSizes.A4 : PageSizes.Letter;
          
          // Determine Orientation
          let isLandscape = false;
          if (orientation === 'Auto') {
            isLandscape = image.width > image.height;
          } else {
            isLandscape = orientation === 'Landscape';
          }
          
          if (isLandscape) {
            pw = dims[1];
            ph = dims[0];
          } else {
            pw = dims[0];
            ph = dims[1];
          }
        }
        
        const page = pdfDoc.addPage([pw, ph]);
        const marginPts = getMarginPoints(margin, pw, ph);
        
        const safeW = pw - marginPts * 2;
        const safeH = ph - marginPts * 2;
        
        // Fit image into safe area
        const scale = Math.min(safeW / image.width, safeH / image.height);
        const imgW = image.width * scale;
        const imgH = image.height * scale;
        
        const x = marginPts + (safeW - imgW) / 2;
        const y = marginPts + (safeH - imgH) / 2;

        page.drawImage(image, {
          x,
          y,
          width: imgW,
          height: imgH,
        });
        
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultPdf(url);
      setStatus('done');
      
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'An error occurred during conversion');
      setStatus('error');
    }
  };

  const activeItem = activeId ? files.find(f => f.id === activeId) : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">Convert Images to PDF</h2>
           <p className="text-muted-foreground text-sm mt-1">
             Drag & drop images to reorder. Configure settings below.
           </p>
        </div>
        {files.length > 0 && status !== 'processing' && (
          <div className="flex gap-2">
             <button 
               onClick={handleClearAll}
               className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 text-sm font-medium transition-colors"
             >
               Clear All
             </button>
             <button 
               onClick={handleConvert}
               className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium shadow-sm transition-colors flex items-center"
             >
               Convert to PDF
               <ArrowRight className="w-4 h-4 ml-2" />
             </button>
          </div>
        )}
      </div>

      {files.length === 0 ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all cursor-pointer ${
            isDragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">
            {isDragActive ? 'Drop images here' : 'Drag & Drop Images here'}
          </h3>
          <p className="text-muted-foreground mb-8 text-sm md:text-base">
            Supports JPG, PNG, WEBP, AVIF, BMP. Up to 30 images.
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
            Select Images
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content: Images List */}
          <div className="lg:col-span-3">
             <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="bg-card border rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b">
                    <span className="font-medium text-sm text-muted-foreground">{files.length} Image{files.length !== 1 && 's'} Added</span>
                    <button 
                      {...getRootProps()}
                      className="text-sm font-medium text-primary hover:underline flex items-center"
                    >
                      <input {...getInputProps()} />
                      <Upload className="w-4 h-4 mr-1" /> Add More
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
                      {files.map((file) => (
                        <SortableImageItem 
                          key={file.id} 
                          file={file} 
                          onRemove={() => handleRemove(file.id)} 
                        />
                      ))}
                    </SortableContext>
                  </div>
                </div>

                {/* Drag Overlay for smooth sorting */}
                <DragOverlay>
                  {activeItem ? (
                    <div className="relative rounded-lg overflow-hidden border-2 border-primary shadow-2xl opacity-80 cursor-grabbing bg-background">
                       <img src={activeItem.previewUrl} alt="preview" className="w-full aspect-[3/4] object-cover" />
                       <div className="absolute inset-0 bg-primary/10" />
                    </div>
                  ) : null}
                </DragOverlay>
             </DndContext>
          </div>

          {/* Sidebar: Settings */}
          <div className="lg:col-span-1">
             <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center mb-6">
                  <Settings2 className="w-5 h-5 mr-2 text-primary" />
                  <h3 className="font-semibold">PDF Settings</h3>
                </div>

                <div className="space-y-5 text-sm">
                  <div>
                    <label className="block text-muted-foreground mb-2 font-medium">Page Size</label>
                    <select 
                      className="w-full p-2.5 bg-background text-foreground border border-input rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
                      disabled={status === 'processing'}
                    >
                      <option value="A4">A4</option>
                      <option value="Letter">US Letter</option>
                      <option value="Fit">Fit to Image</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground mb-2 font-medium">Orientation</label>
                    <select 
                      className="w-full p-2.5 bg-background text-foreground border border-input rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value as OrientationOption)}
                      disabled={status === 'processing' || pageSize === 'Fit'}
                    >
                      <option value="Auto">Auto (Based on Image)</option>
                      <option value="Portrait">Portrait</option>
                      <option value="Landscape">Landscape</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground mb-2 font-medium">Margin</label>
                    <select 
                      className="w-full p-2.5 bg-background text-foreground border border-input rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      value={margin}
                      onChange={(e) => setMargin(e.target.value as MarginOption)}
                      disabled={status === 'processing'}
                    >
                      <option value="None">None</option>
                      <option value="Small">Small</option>
                      <option value="Large">Large</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  {status === 'idle' && (
                    <button 
                      onClick={handleConvert}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium shadow-sm transition-colors flex items-center justify-center"
                    >
                      Convert to PDF
                    </button>
                  )}
                  
                  {status === 'processing' && (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                      <div className="text-sm font-medium">Converting... {progress}%</div>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-3">
                        <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="text-center text-red-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm font-medium mb-4">{errorMsg}</div>
                      <button 
                        onClick={() => setStatus('idle')}
                        className="w-full py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 text-sm font-medium transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {status === 'done' && resultPdf && (
                    <div className="text-center">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <div className="text-sm font-medium mb-4">PDF Ready!</div>
                      <a 
                        href={resultPdf} 
                        download="converted_images.pdf"
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm transition-colors flex items-center justify-center mb-3"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </a>
                      <button 
                        onClick={() => setStatus('idle')}
                        className="w-full py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                      >
                        Convert More
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

// Sub-component for sortable item
function SortableImageItem({ file, onRemove }: { file: FileItem, onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group relative rounded-lg overflow-hidden border bg-background flex flex-col items-center justify-center aspect-[3/4] ${isDragging ? 'opacity-50 ring-2 ring-primary' : 'hover:border-primary/50 hover:shadow-md transition-all'}`}
    >
      <img 
        src={file.previewUrl} 
        alt={file.file.name} 
        className="w-full h-full object-cover select-none"
      />
      
      {/* Overlay controls */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
        <div className="flex justify-between">
          <button 
            className="p-1.5 bg-background/80 hover:bg-destructive hover:text-destructive-foreground text-foreground rounded-md backdrop-blur-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <div 
            {...attributes} 
            {...listeners}
            className="p-1.5 bg-background/80 text-foreground rounded-md backdrop-blur-sm cursor-grab active:cursor-grabbing hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Drag to reorder"
          >
            <MoveVertical className="w-4 h-4" />
          </div>
        </div>
        
        <div className="text-[10px] bg-background/80 backdrop-blur-sm px-1.5 py-1 rounded shadow-sm text-foreground truncate w-full text-center">
          {file.file.name}
        </div>
      </div>
    </div>
  );
}
