"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Download,
  Trash2,
  Loader2,
  Sparkles,
  Settings2,
  CheckCircle2,
  X,
  Maximize2,
  RefreshCcw,
  FileArchive,
  Lock,
  Unlock,
  Crop,
  AlertCircle,
} from "lucide-react";
import JSZip from "jszip";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  type: string;
  status: "pending" | "processing" | "success" | "error";
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedSize?: number;
  convertedWidth?: number;
  convertedHeight?: number;
  error?: string;
}

const PLATFORM_PRESETS = [
  {
    group: "Custom",
    options: [
      { label: "Custom Size", width: 0, height: 0 },
      { label: "Percentage", isPercent: true },
    ],
  },
  {
    group: "Social Media",
    options: [
      { label: "Instagram Post (1:1)", width: 1080, height: 1080 },
      { label: "Instagram Portrait (4:5)", width: 1080, height: 1350 },
      { label: "Instagram Story (9:16)", width: 1080, height: 1920 },
      { label: "Facebook Post", width: 1200, height: 630 },
      { label: "X (Twitter) Post", width: 1200, height: 675 },
      { label: "YouTube Thumbnail", width: 1280, height: 720 },
      { label: "LinkedIn Post", width: 1200, height: 627 },
    ],
  },
  {
    group: "Web & UI",
    options: [
      { label: "Hero Banner (16:9)", width: 1920, height: 1080 },
      { label: "Blog Featured", width: 1200, height: 630 },
      { label: "Favicon", width: 32, height: 32 },
    ],
  },
  {
    group: "Standard Presets",
    options: [
      { label: "64 × 64", width: 64, height: 64 },
      { label: "256 × 256", width: 256, height: 256 },
      { label: "1024 × 1024", width: 1024, height: 1024 },
    ],
  },
];

const SUPPORTED_FORMATS = [
  { id: "original", label: "Keep Original" },
  { id: "image/jpeg", label: "JPG / JPEG", ext: "jpg" },
  { id: "image/png", label: "PNG", ext: "png" },
  { id: "image/webp", label: "WEBP", ext: "webp" },
];

export default function ImageResizerClient() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [preset, setPreset] = useState<string>("Custom Size");
  const [customWidth, setCustomWidth] = useState<number | string>("");
  const [customHeight, setCustomHeight] = useState<number | string>("");
  const [percent, setPercent] = useState<number>(100);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);

  const [targetFormat, setTargetFormat] = useState("original");
  const [quality, setQuality] = useState(0.8);
  const [aiMode, setAiMode] = useState(true);
  const [bgColor, setBgColor] = useState<string>("transparent");

  const [isProcessing, setIsProcessing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getImageDimensions = (
    url: string,
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = url;
    });
  };

  const processFiles = async (files: FileList | File[]) => {
    const newImages: ImageItem[] = [];

    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file);
        try {
          const dims = await getImageDimensions(previewUrl);
          newImages.push({
            id: Math.random().toString(36).substring(7),
            file,
            previewUrl,
            name: file.name,
            originalSize: file.size,
            originalWidth: dims.width,
            originalHeight: dims.height,
            type: file.type,
            status: "pending",
          });
        } catch (e) {
          console.error("Failed to load dimensions for", file.name);
          URL.revokeObjectURL(previewUrl);
        }
      }
    }

    setImages((prev) => {
      const combined = [...prev, ...newImages];
      if (
        combined.length > 0 &&
        preset === "Custom Size" &&
        !customWidth &&
        !customHeight
      ) {
        // Set initial custom dimensions to match the first image if not set
        setCustomWidth(combined[0].originalWidth);
        setCustomHeight(combined[0].originalHeight);
      }
      return combined;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.previewUrl);
        if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
    if (previewImage?.id === id) {
      setPreviewImage(null);
    }
  };

  const clearAll = () => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.previewUrl);
      if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
    });
    setImages([]);
    setPreviewImage(null);
  };

  const handleWidthChange = (val: string) => {
    const num = parseInt(val);
    setCustomWidth(val);
    if (lockAspectRatio && !isNaN(num) && images.length > 0) {
      const ratio = images[0].originalHeight / images[0].originalWidth;
      setCustomHeight(Math.round(num * ratio));
    }
  };

  const handleHeightChange = (val: string) => {
    const num = parseInt(val);
    setCustomHeight(val);
    if (lockAspectRatio && !isNaN(num) && images.length > 0) {
      const ratio = images[0].originalWidth / images[0].originalHeight;
      setCustomWidth(Math.round(num * ratio));
    }
  };

  const handlePresetSelect = (selectedLabel: string) => {
    setPreset(selectedLabel);
    for (const group of PLATFORM_PRESETS) {
      for (const opt of group.options) {
        if (opt.label === selectedLabel && opt.width && opt.height) {
          setCustomWidth(opt.width);
          setCustomHeight(opt.height);
          setLockAspectRatio(false);
          return;
        }
      }
    }
  };

  const calculateTargetDimensions = (img: ImageItem) => {
    let w = img.originalWidth;
    let h = img.originalHeight;

    if (preset === "Percentage" || aiMode) {
      const scale = percent / 100;
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    } else {
      if (
        typeof customWidth === "number" ||
        (typeof customWidth === "string" && customWidth !== "")
      ) {
        w = parseInt(customWidth.toString());
      }
      if (
        typeof customHeight === "number" ||
        (typeof customHeight === "string" && customHeight !== "")
      ) {
        h = parseInt(customHeight.toString());
      }
    }

    return { w: Math.max(1, w), h: Math.max(1, h) };
  };

  const resizeImage = (
    img: ImageItem,
    w: number,
    h: number,
    format: string,
    q: number,
  ): Promise<{ blob: Blob; type: string }> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context failed"));
          return;
        }

        const outFormat = format === "original" ? img.type : format;

        // Background fill for formats that don't support transparency or if specific color requested
        if (
          outFormat === "image/jpeg" ||
          outFormat === "image/bmp" ||
          bgColor !== "transparent"
        ) {
          ctx.fillStyle = bgColor === "transparent" ? "#FFFFFF" : bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw image stretched to dimensions (if lock aspect ratio was off, it distorts. If on, it scales)
        // If we want to contain/cover we could add options, but for strict resizing it stretches:
        ctx.drawImage(image, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, type: outFormat });
            } else {
              reject(new Error("Blob conversion failed"));
            }
          },
          outFormat,
          q,
        );
      };
      image.onerror = () => reject(new Error("Image load failed"));
      image.src = img.previewUrl;
    });
  };

  const handleProcess = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setOverallProgress(0);

    const updatedImages = [...images];

    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      if (img.status === "success" && img.convertedBlob) continue;

      updatedImages[i].status = "processing";
      setImages([...updatedImages]);

      try {
        const { w, h } = calculateTargetDimensions(img);
        const outFormat = aiMode ? "image/webp" : targetFormat; // AI suggests WEBP for web optimization
        const q = aiMode ? 0.85 : quality;

        const { blob, type } = await resizeImage(img, w, h, outFormat, q);

        updatedImages[i].status = "success";
        updatedImages[i].convertedBlob = blob;
        updatedImages[i].convertedSize = blob.size;
        updatedImages[i].convertedUrl = URL.createObjectURL(blob);
        updatedImages[i].type = type;
        updatedImages[i].convertedWidth = w;
        updatedImages[i].convertedHeight = h;
      } catch (err) {
        console.error(err);
        updatedImages[i].status = "error";
        updatedImages[i].error = "Processing failed";
      }

      setOverallProgress(((i + 1) / updatedImages.length) * 100);
      setImages([...updatedImages]);
    }

    setIsProcessing(false);
  };

  const downloadFile = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = async () => {
    const successfulImages = images.filter(
      (img) => img.status === "success" && img.convertedBlob,
    );
    if (successfulImages.length === 0) return;

    if (successfulImages.length === 1) {
      const img = successfulImages[0];
      const ext =
        SUPPORTED_FORMATS.find((f) => f.id === img.type)?.ext ||
        img.type.split("/")[1] ||
        "jpg";
      const newName = img.name.replace(/\.[^/.]+$/, "") + `_resized.${ext}`;
      downloadFile(img.convertedUrl!, newName);
      return;
    }

    const zip = new JSZip();
    successfulImages.forEach((img) => {
      const ext =
        SUPPORTED_FORMATS.find((f) => f.id === img.type)?.ext ||
        img.type.split("/")[1] ||
        "jpg";
      const newName = img.name.replace(/\.[^/.]+$/, "") + `_resized.${ext}`;
      zip.file(newName, img.convertedBlob!);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    downloadFile(url, "resized_images.zip");
    URL.revokeObjectURL(url);
  };

  const getFormatLabel = (mime: string) => {
    if (mime === "original") return "Original";
    return (
      SUPPORTED_FORMATS.find((f) => f.id === mime)?.label ||
      mime.split("/")[1].toUpperCase()
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-primary/5 border-b border-primary/10 py-12 mb-8">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Universal Image Resizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade image scaling engine. Resize, optimize, and export
            for Social Media and Web perfectly in your browser.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold flex items-center mb-4">
                <Crop className="w-5 h-5 mr-2 text-primary" />
                Sizing Options
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">
                      AI Smart Scale
                    </label>
                    <button
                      onClick={() => setAiMode(!aiMode)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${aiMode ? "bg-green-500" : "bg-red-500"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiMode ? "translate-x-4" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    AI suggests best settings based on contents and use-case.
                  </p>
                </div>

                {!aiMode && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Platform Preset
                      </label>
                      <select
                        value={preset}
                        onChange={(e) => handlePresetSelect(e.target.value)}
                        className="w-full p-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 hover:border-primary/50 transition-all text-sm dark:bg-muted/20 dark:text-foreground"
                      >
                        {PLATFORM_PRESETS.map((group, i) => (
                          <optgroup key={i} label={group.group}>
                            {group.options.map((opt) => (
                              <option key={opt.label} value={opt.label}>
                                {opt.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {preset === "Percentage" ? (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium">
                            Scale ({percent}%)
                          </label>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="300"
                          step="1"
                          value={percent}
                          onChange={(e) => setPercent(parseInt(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-muted-foreground">
                            Dimensions (px)
                          </label>
                          <button
                            onClick={() => setLockAspectRatio(!lockAspectRatio)}
                            className={`p-1.5 rounded-md transition-all border-2 focus:outline-none focus:ring-2 focus:ring-primary/50 ${lockAspectRatio ? "bg-green-500/10 text-green-600 border-green-500 shadow-sm" : "bg-red-500/10 text-red-500 border-red-200 dark:border-red-900/50 hover:bg-red-500/20"}`}
                            title={
                              lockAspectRatio
                                ? "Unlock aspect ratio"
                                : "Lock aspect ratio"
                            }
                          >
                            {lockAspectRatio ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Width
                            </label>
                            <input
                              type="number"
                              value={customWidth}
                              onChange={(e) =>
                                handleWidthChange(e.target.value)
                              }
                              className="w-full p-2 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 hover:border-primary/50 transition-all dark:bg-muted/20 dark:text-foreground"
                            />
                          </div>
                          <span className="text-muted-foreground font-medium pt-5">
                            ×
                          </span>
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Height
                            </label>
                            <input
                              type="number"
                              value={customHeight}
                              onChange={(e) =>
                                handleHeightChange(e.target.value)
                              }
                              className="w-full p-2 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 hover:border-primary/50 transition-all dark:bg-muted/20 dark:text-foreground"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <label className="block text-sm font-medium mb-2">
                        Export Format
                      </label>
                      <select
                        value={targetFormat}
                        onChange={(e) => setTargetFormat(e.target.value)}
                        className="w-full p-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 hover:border-primary/50 transition-all text-sm mb-4 dark:bg-muted/20 dark:text-foreground"
                      >
                        {SUPPORTED_FORMATS.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">
                          Quality ({Math.round(quality * 100)}%)
                        </label>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary text-sm mb-1">
                    Privacy First
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    All images are resized in your browser securely. Zero
                    uploads to external servers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Workspace */}
          <div className="lg:col-span-3">
            {images.length === 0 ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`bg-card border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 min-h-[400px] cursor-pointer transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "hover:bg-muted/50 hover:border-primary/50"
                }`}
              >
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Upload Images to Resize
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-8">
                  Drag and drop your images here, or click to browse. Supported
                  formats: JPG, PNG, WEBP, AVIF.
                </p>
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Browse Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-card border rounded-2xl overflow-hidden flex flex-col h-[700px] max-h-[85vh]">
                <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4 bg-muted/30">
                  <div>
                    <h3 className="font-semibold flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                      {images.length} Image{images.length !== 1 ? "s" : ""}{" "}
                      Selected
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                      disabled={isProcessing}
                    >
                      Add More
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg text-sm font-medium transition-colors"
                      disabled={isProcessing}
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-muted/10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 content-start">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className={`relative group bg-background border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md cursor-pointer ${previewImage?.id === img.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setPreviewImage(img)}
                    >
                      <div className="aspect-[4/3] bg-muted/30 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={img.previewUrl}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Overlay status */}
                        {img.status === "processing" && (
                          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          </div>
                        )}
                        {img.status === "success" && (
                          <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <CheckCircle2 className="w-8 h-8 text-green-600 drop-shadow-md" />
                          </div>
                        )}

                        {!isProcessing && img.status !== "success" && (
                          <button
                            onClick={(e) => removeImage(img.id, e)}
                            className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="p-3">
                        <p
                          className="text-xs font-medium truncate mb-1"
                          title={img.name}
                        >
                          {img.name}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>
                            {img.originalWidth} × {img.originalHeight}
                          </span>
                          <span>{(img.originalSize / 1024).toFixed(0)} KB</span>
                        </div>

                        {img.status === "success" && img.convertedWidth && (
                          <div className="mt-2 pt-2 border-t flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px] font-medium text-green-600 dark:text-green-500">
                              <span className="flex items-center">
                                <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                                {img.convertedWidth} × {img.convertedHeight}
                              </span>
                              <span>
                                {(img.convertedSize! / 1024).toFixed(0)} KB
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t bg-card">
                  {images.some((i) => i.status === "success") ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-600 flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Processing Complete
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {images.filter((i) => i.status === "success").length}{" "}
                          of {images.length} images scaled.
                        </p>
                      </div>
                      <button
                        onClick={handleDownloadAll}
                        className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <FileArchive className="w-5 h-5" /> Download All (ZIP)
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="w-full sm:w-1/2">
                        {isProcessing && (
                          <div className="w-full flex items-center gap-3">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${overallProgress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium min-w-[40px]">
                              {Math.round(overallProgress)}%
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleProcess}
                        disabled={isProcessing}
                        className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />{" "}
                            Processing...
                          </>
                        ) : (
                          <>
                            <RefreshCcw className="w-5 h-5" /> Resize{" "}
                            {images.length} Images
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-card w-full max-w-5xl h-full max-h-[800px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
              <h3 className="font-semibold text-lg flex items-center">
                <Maximize2 className="w-5 h-5 mr-2 text-primary" />
                Inspector
              </h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-6 bg-muted/10 flex flex-col lg:flex-row gap-6">
              <div className="flex-1 flex flex-col">
                <h4 className="font-medium text-sm text-center mb-3 text-muted-foreground flex items-center justify-center">
                  Original
                  <span className="ml-2 bg-muted px-2 py-0.5 rounded text-xs">
                    {previewImage.originalWidth} × {previewImage.originalHeight}
                  </span>
                </h4>
                <div className="flex-1 border bg-muted/30 rounded-xl overflow-hidden relative flex items-center justify-center">
                  <img
                    src={previewImage.previewUrl}
                    alt="Original"
                    className="max-w-full max-h-full object-contain p-2"
                  />
                </div>
                <div className="mt-3 text-center text-sm font-medium">
                  {(previewImage.originalSize / 1024).toFixed(1)} KB
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <h4 className="font-medium text-sm text-center mb-3 text-primary flex items-center justify-center">
                  Resized
                  {previewImage.status === "success" ? (
                    <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                      {previewImage.convertedWidth} ×{" "}
                      {previewImage.convertedHeight}
                    </span>
                  ) : (
                    <span className="ml-2 bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs">
                      Preview
                    </span>
                  )}
                </h4>
                <div className="flex-1 border-2 border-primary/20 bg-muted/30 rounded-xl overflow-hidden relative flex items-center justify-center shadow-inner">
                  {previewImage.status === "success" &&
                  previewImage.convertedUrl ? (
                    <img
                      src={previewImage.convertedUrl}
                      alt="Resized"
                      className="max-w-full max-h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <Crop className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Click Resize to generate final image
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-center text-sm font-medium">
                  {previewImage.status === "success" &&
                  previewImage.convertedSize ? (
                    <span className="text-green-600">
                      {(previewImage.convertedSize / 1024).toFixed(1)} KB
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Estimating...</span>
                  )}
                </div>
              </div>
            </div>

            {previewImage.status === "success" && previewImage.convertedUrl && (
              <div className="p-4 border-t flex justify-end bg-card">
                <button
                  onClick={() => {
                    const ext =
                      SUPPORTED_FORMATS.find((f) => f.id === previewImage.type)
                        ?.ext || "jpg";
                    const newName =
                      previewImage.name.replace(/\.[^/.]+$/, "") +
                      `_resized.${ext}`;
                    downloadFile(previewImage.convertedUrl!, newName);
                  }}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Single
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
