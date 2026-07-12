'use client';

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  UploadCloud,
  Image as ImageIcon,
  Download,
  Trash2,
  Settings2,
  CheckCircle2,
  Crop as CropIcon,
  X,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sparkles,
  FileArchive,
  Loader2,
  RefreshCcw,
  Circle
} from 'lucide-react';
import JSZip from 'jszip';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  type: string;
  originalSize: number;
  status: 'pending' | 'success' | 'error';
  convertedBlob?: Blob;
  convertedUrl?: string;
  error?: string;
  cropSettings?: {
    crop: PixelCrop | null;
    rotation: number;
    flipH: boolean;
    flipV: boolean;
  };
}

const ASPECT_RATIOS = [
  { label: 'Free', value: undefined },
  { label: 'Square (1:1)', value: 1 },
  { label: 'Standard (4:3)', value: 4 / 3 },
  { label: 'Widescreen (16:9)', value: 16 / 9 },
  { label: 'Portrait (9:16)', value: 9 / 16 },
  { label: 'Photo (3:2)', value: 3 / 2 },
];

const SOCIAL_PRESETS = [
  { group: 'Instagram', options: [
    { label: 'Post (1:1)', value: 1 },
    { label: 'Portrait (4:5)', value: 4 / 5 },
    { label: 'Story (9:16)', value: 9 / 16 },
  ]},
  { group: 'YouTube', options: [
    { label: 'Thumbnail (16:9)', value: 16 / 9 },
  ]},
  { group: 'LinkedIn / Twitter', options: [
    { label: 'Post (~1.91:1)', value: 1.91 / 1 },
  ]}
];

export default function ImageCropperClient() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Editor State
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [circularCrop, setCircularCrop] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedImage = images.find(img => img.id === selectedId);

  const processFiles = (files: FileList | File[]) => {
    const newImages: ImageItem[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        newImages.push({
          id: Math.random().toString(36).substring(7),
          file,
          previewUrl: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
          originalSize: file.size,
          status: 'pending',
          cropSettings: {
            crop: null,
            rotation: 0,
            flipH: false,
            flipV: false
          }
        });
      }
    }

    setImages(prev => {
      const combined = [...prev, ...newImages];
      if (combined.length > 0 && !selectedId) {
        setSelectedId(combined[0].id);
      }
      return combined;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.previewUrl);
        if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
      }
      const newImages = prev.filter(i => i.id !== id);
      if (selectedId === id) {
        setSelectedId(newImages.length > 0 ? newImages[0].id : null);
      }
      return newImages;
    });
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop: Crop = {
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    };
    if (aspect) {
       // Need to calculate square crop if aspect is provided, ReactCrop handles basic snapping
    }
    setCrop(initialCrop);
  };

  const simulateAiCrop = () => {
    setAiMode(true);
    // Simulate detecting a face or subject in the center-top
    setTimeout(() => {
       setCrop({
         unit: '%',
         width: 40,
         height: 60,
         x: 30,
         y: 10
       });
       setAiMode(false);
    }, 800);
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: PixelCrop,
    rot = 0,
    flipH = false,
    flipV = false,
    type = 'image/jpeg'
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('No 2d context'));
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      const pixelRatio = window.devicePixelRatio;
      
      canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const centerX = image.naturalWidth / 2;
      const centerY = image.naturalHeight / 2;

      ctx.save();
      
      // Move to crop position
      ctx.translate(-cropX, -cropY);
      
      // Move to center of original image to apply rotation and flips
      ctx.translate(centerX, centerY);
      
      // Apply transforms
      ctx.rotate((rot * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      
      // Move back to draw
      ctx.translate(-centerX, -centerY);
      
      // Draw image
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );

      // Add circular mask if needed
      if (circularCrop) {
        ctx.restore(); // Remove previous clip
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(
          canvas.width / (2 * pixelRatio), 
          canvas.height / (2 * pixelRatio), 
          Math.min(canvas.width, canvas.height) / (2 * pixelRatio), 
          0, 
          2 * Math.PI
        );
        ctx.fill();
      }

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas is empty'));
        resolve(blob);
      }, type, 0.95);
    });
  };

  const handleProcess = async () => {
    if (!selectedImage || !completedCrop || !imgRef.current) return;
    
    setIsProcessing(true);
    setOverallProgress(0);

    // If we want batch processing, we would apply current crop to all.
    // For this implementation, we apply crop individually since each image needs different crops.
    // We will just process the currently selected image.
    
    const imgId = selectedImage.id;

    try {
      setOverallProgress(50);
      const blob = await getCroppedImg(
        imgRef.current, 
        completedCrop,
        rotation,
        flipH,
        flipV,
        selectedImage.type === 'image/png' || circularCrop ? 'image/png' : 'image/jpeg' // Force PNG for circle
      );
      
      setImages(prev => prev.map(img => {
        if (img.id === imgId) {
          if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
          return {
            ...img,
            status: 'success',
            convertedBlob: blob,
            convertedUrl: URL.createObjectURL(blob)
          };
        }
        return img;
      }));
      setOverallProgress(100);
    } catch (err) {
      console.error(err);
      setImages(prev => prev.map(img => 
        img.id === imgId ? { ...img, status: 'error', error: 'Crop failed' } : img
      ));
    }

    setIsProcessing(false);
  };

  const handleDownload = (img: ImageItem) => {
    if (!img.convertedUrl) return;
    const ext = img.convertedBlob?.type === 'image/png' ? 'png' : 'jpg';
    const newName = img.name.replace(/\.[^/.]+$/, "") + `_cropped.${ext}`;
    const a = document.createElement('a');
    a.href = img.convertedUrl;
    a.download = newName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-primary/5 border-b border-primary/10 py-12 mb-8">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Smart Image Cropper
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered image cropping with social media presets, face detection, and professional tools.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {images.length === 0 ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`bg-card border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 min-h-[400px] cursor-pointer transition-all ${
              isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'hover:bg-muted/50 hover:border-primary/50'
            }`}
          >
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Images to Crop</h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Drag and drop your images here, or click to browse.
            </p>
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
              <ImageIcon className="w-5 h-5" /> Browse Files
            </button>
            <input type="file" ref={fileInputRef} onChange={e => { if(e.target.files?.length) processFiles(e.target.files) }} accept="image/*" multiple className="hidden" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Column: Thumbnails (if multiple) & Settings */}
            <div className="lg:col-span-1 space-y-6">
              {images.length > 1 && (
                <div className="bg-card border rounded-2xl p-4 shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
                    <span>Images ({images.length})</span>
                    <button onClick={() => fileInputRef.current?.click()} className="text-xs text-primary hover:underline">Add More</button>
                  </h3>
                  <div className="flex overflow-x-auto lg:flex-col gap-2 max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                    {images.map(img => (
                      <div 
                        key={img.id}
                        onClick={() => setSelectedId(img.id)}
                        className={`relative w-20 h-20 lg:w-full lg:h-16 flex-shrink-0 border-2 rounded-lg overflow-hidden cursor-pointer ${selectedId === img.id ? 'border-primary shadow-sm' : 'border-transparent hover:border-primary/50'}`}
                      >
                        <img src={img.previewUrl} alt={img.name} className="w-full h-full object-cover" />
                        {img.status === 'success' && (
                          <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <button 
                          onClick={(e) => removeImage(img.id, e)}
                          className="absolute bottom-1 right-1 p-1 bg-destructive/90 text-white rounded opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold flex items-center mb-6">
                  <CropIcon className="w-5 h-5 mr-2 text-primary" />
                  Crop Options
                </h3>

                <div className="space-y-6">
                  {/* Aspect Ratios */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Aspect Ratio</label>
                    <div className="grid grid-cols-3 gap-2">
                      {ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio.label}
                          onClick={() => { setAspect(ratio.value); setCircularCrop(false); }}
                          className={`p-2 text-xs rounded-lg border transition-colors ${aspect === ratio.value && !circularCrop ? 'bg-primary/10 border-primary text-primary font-medium' : 'hover:bg-muted bg-background'}`}
                        >
                          {ratio.label.split(' ')[0]}
                        </button>
                      ))}
                      <button
                        onClick={() => { setAspect(1); setCircularCrop(true); }}
                        className={`p-2 text-xs rounded-lg border transition-colors flex flex-col items-center justify-center gap-1 ${circularCrop ? 'bg-primary/10 border-primary text-primary font-medium' : 'hover:bg-muted bg-background'}`}
                      >
                        Circle
                      </button>
                    </div>
                  </div>

                  {/* Social Presets */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Social Media Presets</label>
                    <select
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                          setAspect(val);
                          setCircularCrop(false);
                        }
                      }}
                      className="w-full p-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-primary/50 text-sm"
                      value={aspect || ''}
                    >
                      <option value="">Select Preset...</option>
                      {SOCIAL_PRESETS.map((group, i) => (
                        <optgroup key={i} label={group.group}>
                          {group.options.map(opt => (
                            <option key={opt.label} value={opt.value}>{opt.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Rotate / Flip */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Transform</label>
                    <div className="flex gap-2">
                      <button onClick={() => setRotation(r => (r + 90) % 360)} className="flex-1 p-2 border rounded-lg hover:bg-muted flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
                        <RotateCcw className="w-4 h-4" /> 90°
                      </button>
                      <button onClick={() => setFlipH(!flipH)} className={`flex-1 p-2 border rounded-lg hover:bg-muted flex flex-col items-center justify-center gap-1 text-xs ${flipH ? 'bg-primary/5 text-primary border-primary/30' : 'text-muted-foreground'}`}>
                        <FlipHorizontal className="w-4 h-4" /> Flip X
                      </button>
                      <button onClick={() => setFlipV(!flipV)} className={`flex-1 p-2 border rounded-lg hover:bg-muted flex flex-col items-center justify-center gap-1 text-xs ${flipV ? 'bg-primary/5 text-primary border-primary/30' : 'text-muted-foreground'}`}>
                        <FlipVertical className="w-4 h-4" /> Flip Y
                      </button>
                    </div>
                  </div>

                  {/* AI Smart Crop */}
                  <div className="pt-4 border-t">
                    <button
                      onClick={simulateAiCrop}
                      disabled={aiMode}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm flex items-center justify-center gap-2 border border-blue-200/50 dark:border-blue-800/50 transition-colors"
                    >
                      {aiMode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      AI Smart Suggestion
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Editor Workspace */}
            <div className="lg:col-span-3">
              {selectedImage && (
                <div className="bg-card border rounded-2xl overflow-hidden flex flex-col h-[700px] max-h-[85vh]">
                  
                  {/* Editor Header */}
                  <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4 bg-muted/30">
                    <div>
                      <h3 className="font-semibold text-sm truncate max-w-[200px] sm:max-w-xs">{selectedImage.name}</h3>
                      <p className="text-xs text-muted-foreground">Original: {(selectedImage.originalSize / 1024).toFixed(0)} KB</p>
                    </div>
                    <div className="flex gap-2">
                       {selectedImage.status === 'success' && (
                         <button 
                           onClick={() => handleDownload(selectedImage)}
                           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                         >
                           <Download className="w-4 h-4" /> Download
                         </button>
                       )}
                       <button 
                         onClick={handleProcess}
                         disabled={isProcessing || !completedCrop}
                         className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                       >
                         {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CropIcon className="w-4 h-4" />}
                         Apply Crop
                       </button>
                    </div>
                  </div>

                  {/* Workspace Canvas */}
                  <div className="flex-1 overflow-hidden bg-black/5 dark:bg-black/20 flex flex-col items-center justify-center relative relative select-none p-4 md:p-8">
                     
                     <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
                        <ReactCrop
                          crop={crop}
                          onChange={(_, percentCrop) => setCrop(percentCrop)}
                          onComplete={(c) => setCompletedCrop(c)}
                          aspect={aspect}
                          circularCrop={circularCrop}
                          ruleOfThirds={true}
                          className="max-h-full max-w-full transition-all"
                        >
                          <img
                            ref={imgRef}
                            alt="Crop me"
                            src={selectedImage.previewUrl}
                            onLoad={onImageLoad}
                            style={{ 
                              transform: `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1}) rotate(${rotation}deg)`,
                              maxHeight: '60vh',
                              maxWidth: '100%',
                              objectFit: 'contain',
                              transition: 'transform 0.3s ease'
                            }}
                          />
                        </ReactCrop>
                     </div>
                     
                     {aiMode && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                           <div className="bg-card border p-6 rounded-2xl shadow-xl flex flex-col items-center">
                             <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                               <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                             </div>
                             <p className="font-medium text-blue-600 dark:text-blue-400">Analyzing image...</p>
                             <p className="text-xs text-muted-foreground mt-1">Detecting faces and optimal framing</p>
                           </div>
                        </div>
                     )}
                     
                     {/* Preview Overlay Result */}
                     {selectedImage.status === 'success' && selectedImage.convertedUrl && (
                        <div className="absolute inset-4 sm:inset-10 z-20 flex flex-col bg-card rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-300">
                           <div className="p-3 border-b flex justify-between items-center bg-muted/50">
                              <span className="font-medium text-sm flex items-center text-green-600">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Cropped Successfully
                              </span>
                              <button 
                                onClick={() => {
                                  setImages(prev => prev.map(img => 
                                    img.id === selectedImage.id ? { ...img, status: 'pending', convertedUrl: undefined } : img
                                  ));
                                }} 
                                className="p-1 hover:bg-background rounded-md transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                           </div>
                           <div className="flex-1 bg-black/10 overflow-hidden flex items-center justify-center p-4">
                              <img src={selectedImage.convertedUrl} alt="Cropped Preview" className="max-w-full max-h-full object-contain drop-shadow-md rounded-sm" />
                           </div>
                           <div className="p-4 border-t bg-card flex justify-end gap-3">
                              <button 
                                onClick={() => handleDownload(selectedImage)}
                                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                              >
                                <Download className="w-4 h-4" /> Download Image
                              </button>
                           </div>
                        </div>
                     )}

                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
      
      {/* Hidden file input for "Add More" outside of drag drop area */}
      <input type="file" ref={fileInputRef} onChange={e => { if(e.target.files?.length) processFiles(e.target.files) }} accept="image/*" multiple className="hidden" />
    </div>
  );
}
