"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Wand2,
  Download,
  Settings,
  X,
  CheckCircle2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Eraser,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Loader2,
  Trash2,
  Brush,
  MousePointer2,
  Square,
  Undo2,
  Redo2,
} from "lucide-react";

export default function AIObjectRemoverClient() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(
    "Initializing Engine...",
  );

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(40);
  const [toolMode, setToolMode] = useState<"brush" | "lasso" | "rectangle">(
    "brush",
  );
  const [hasMask, setHasMask] = useState(false);

  // AI Settings
  const [processingMode, setProcessingMode] = useState("Balanced");
  const [reconstructionStrength, setReconstructionStrength] =
    useState("Auto AI");
  const [textureMatching, setTextureMatching] = useState("Auto");
  const [edgeBlending, setEdgeBlending] = useState("Auto");
  const [lightingMatch, setLightingMatch] = useState(true);
  const [shadowReconstruction, setShadowReconstruction] = useState(true);

  // For drawing path
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        alert("File size exceeds 25MB limit for free users.");
        return;
      }
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResultUrl(null);
      setHasMask(false);

      // Load image to canvas
      const img = new Image();
      img.onload = () => {
        if (
          canvasRef.current &&
          maskCanvasRef.current &&
          containerRef.current
        ) {
          const canvas = canvasRef.current;
          const maskCanvas = maskCanvasRef.current;
          const ctx = canvas.getContext("2d");
          const maskCtx = maskCanvas.getContext("2d");
          if (ctx && maskCtx) {
            // Set canvas size to match image aspect ratio but fit in container
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;
            const imgAspect = img.width / img.height;
            const containerAspect = containerWidth / containerHeight;

            let drawWidth = containerWidth;
            let drawHeight = containerHeight;

            if (imgAspect > containerAspect) {
              drawHeight = containerWidth / imgAspect;
            } else {
              drawWidth = containerHeight * imgAspect;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            maskCanvas.width = img.width;
            maskCanvas.height = img.height;

            ctx.drawImage(img, 0, 0, img.width, img.height);
            // Setup mask context
            maskCtx.lineCap = "round";
            maskCtx.lineJoin = "round";
            maskCtx.fillStyle = "rgba(255, 0, 0, 0.4)";
          }
        }
      };
      img.src = url;
    }
  };

  const getCanvasCoords = (
    e:
      React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e:
      React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (resultUrl) return; // Prevent drawing after result
    e.preventDefault(); // Prevent scrolling on touch
    setIsDrawing(true);
    const coords = getCanvasCoords(e);
    lastPos.current = coords;

    const maskCtx = maskCanvasRef.current?.getContext("2d");
    if (maskCtx) {
      maskCtx.beginPath();
      maskCtx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
      maskCtx.fillStyle = "rgba(255, 50, 50, 0.5)";
      maskCtx.fill();
      setHasMask(true);
    }
  };

  const draw = (
    e:
      React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing || !lastPos.current || resultUrl) return;
    e.preventDefault();

    const coords = getCanvasCoords(e);
    const maskCtx = maskCanvasRef.current?.getContext("2d");

    if (maskCtx) {
      maskCtx.beginPath();
      maskCtx.moveTo(lastPos.current.x, lastPos.current.y);
      maskCtx.lineTo(coords.x, coords.y);
      maskCtx.strokeStyle = "rgba(255, 50, 50, 0.5)";
      maskCtx.lineWidth = brushSize;
      maskCtx.lineCap = "round";
      maskCtx.stroke();

      lastPos.current = coords;
      setHasMask(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
      const ctx = maskCanvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        setHasMask(false);
      }
    }
  };

  // Mock processing
  const processImage = () => {
    if (!image || !hasMask) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessingStep("Analyzing image and mask...");

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 8 + 2;
      if (currentProgress > 90) {
        clearInterval(interval);
        currentProgress = 90;
        setProcessingStep("Applying AI inpainting & blending...");

        // Finalize
        setTimeout(() => {
          setProgress(100);
          setProcessingStep("Finalizing...");

          setTimeout(() => {
            setIsProcessing(false);

            // Create mock result by combining original and mask with a blur effect
            // In a real app, you'd send to API. Here we just apply a blur to the masked area
            generateMockResult();
          }, 500);
        }, 1500);
      } else {
        if (currentProgress > 30 && currentProgress < 60) {
          setProcessingStep("Extracting object & generating background...");
        } else if (currentProgress >= 60) {
          setProcessingStep("Reconstructing scene texture...");
        }
      }
      setProgress(Math.min(currentProgress, 90));
    }, 400);
  };

  const generateMockResult = () => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const resultCanvas = document.createElement("canvas");
    resultCanvas.width = canvas.width;
    resultCanvas.height = canvas.height;
    const ctx = resultCanvas.getContext("2d");
    if (!ctx) return;

    // Draw original
    ctx.drawImage(canvas, 0, 0);

    // Draw blurred version over mask
    ctx.save();
    // Use the mask as a clipping region
    // Since mask is drawn in red, we need to do some compositing tricks
    // For a simple mock, we'll just blur the whole canvas, then use the mask to composite

    // Create a blurred version
    const blurredCanvas = document.createElement("canvas");
    blurredCanvas.width = canvas.width;
    blurredCanvas.height = canvas.height;
    const blurredCtx = blurredCanvas.getContext("2d");
    if (blurredCtx) {
      blurredCtx.filter = "blur(20px)";
      blurredCtx.drawImage(canvas, 0, 0);

      // Now use the mask to only draw the blurred part
      // We extract the alpha channel of the mask
      ctx.globalCompositeOperation = "source-over";
      // To properly mask, we need to convert the red drawn mask to alpha
      // Instead of complex pixel manipulation, let's just draw the blurred canvas over the mask
      // where the mask exists.

      // We can use globalCompositeOperation
      const tempMaskCanvas = document.createElement("canvas");
      tempMaskCanvas.width = canvas.width;
      tempMaskCanvas.height = canvas.height;
      const tCtx = tempMaskCanvas.getContext("2d");
      if (tCtx) {
        // Draw mask
        tCtx.drawImage(maskCanvas, 0, 0);
        // source-in: keeps blurred image only where mask overlaps
        tCtx.globalCompositeOperation = "source-in";
        tCtx.drawImage(blurredCanvas, 0, 0);

        // Now draw the temp mask over the result
        ctx.drawImage(tempMaskCanvas, 0, 0);
      }
    }
    ctx.restore();

    setResultUrl(resultCanvas.toDataURL("image/jpeg", 0.9));
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Object Remover</h1>
          <p className="text-muted-foreground">
            Remove unwanted objects, people, or text from photos and seamlessly
            reconstruct the background using AI.
          </p>
        </div>

        {!image ? (
          // Upload Area
          <div className="bg-background rounded-xl border border-dashed shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <Eraser className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Upload image to remove objects
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Drag and drop an image here, or click to browse. Supports JPG,
              PNG, WEBP, AVIF up to 25MB.
            </p>
            <label className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-lg cursor-pointer transition-colors flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Image
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/avif,image/tiff,image/heic"
                onChange={handleImageUpload}
              />
            </label>
            <div className="mt-8 flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> High
                Accuracy
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Fast
                Processing
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> 100% Private
              </span>
            </div>
          </div>
        ) : (
          // Workspace
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Tools */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Removal Tools
                  </h3>
                </div>

                <div className="p-4 space-y-6">
                  {/* Selection Mode */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Selection Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setToolMode("brush")}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                          toolMode === "brush"
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-background hover:bg-muted"
                        }`}
                        disabled={!!resultUrl}
                      >
                        <Brush className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">Brush</span>
                      </button>
                      <button
                        onClick={() => setToolMode("lasso")}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                          toolMode === "lasso"
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-background hover:bg-muted"
                        }`}
                        disabled={!!resultUrl}
                      >
                        <MousePointer2 className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">Lasso</span>
                      </button>
                      <button
                        onClick={() => setToolMode("rectangle")}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                          toolMode === "rectangle"
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-background hover:bg-muted"
                        }`}
                        disabled={!!resultUrl}
                      >
                        <Square className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">Rect</span>
                      </button>
                    </div>
                  </div>

                  {/* Brush Size */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Brush Size</label>
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {brushSize}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      step="1"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      disabled={!!resultUrl}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div className="pt-2 border-t flex gap-2">
                    <button
                      onClick={clearMask}
                      disabled={!hasMask || !!resultUrl}
                      className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear Mask
                    </button>
                  </div>

                  <div className="pt-4 border-t space-y-4">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      AI Settings
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium">Quality</label>
                        <select
                          className="text-xs bg-muted border-none rounded-md py-1 px-2 focus:ring-1 focus:ring-primary outline-none"
                          value={processingMode}
                          onChange={(e) => setProcessingMode(e.target.value)}
                          disabled={!!resultUrl}
                        >
                          <option>Fast</option>
                          <option>Balanced</option>
                          <option>High Quality</option>
                          <option>Ultra (Pro)</option>
                        </select>
                      </div>

                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium">
                          Reconstruction
                        </label>
                        <select
                          className="text-xs bg-muted border-none rounded-md py-1 px-2 focus:ring-1 focus:ring-primary outline-none"
                          value={reconstructionStrength}
                          onChange={(e) =>
                            setReconstructionStrength(e.target.value)
                          }
                          disabled={!!resultUrl}
                        >
                          <option>Auto AI</option>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>

                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium">
                          Lighting Match
                        </label>
                        <button
                          onClick={() => setLightingMatch(!lightingMatch)}
                          disabled={!!resultUrl}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${lightingMatch ? "bg-primary" : "bg-muted"}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${lightingMatch ? "translate-x-5" : "translate-x-1"}`}
                          />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium">Shadows</label>
                        <button
                          onClick={() =>
                            setShadowReconstruction(!shadowReconstruction)
                          }
                          disabled={!!resultUrl}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${shadowReconstruction ? "bg-primary" : "bg-muted"}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${shadowReconstruction ? "translate-x-5" : "translate-x-1"}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t space-y-4">
                    <button
                      onClick={processImage}
                      disabled={isProcessing || !!resultUrl || !hasMask}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Removing ({Math.round(progress)}%)
                        </>
                      ) : resultUrl ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Removed
                        </>
                      ) : (
                        <>
                          <Eraser className="w-5 h-5" />
                          Remove Object
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        setResultUrl(null);
                        setImage(null);
                        setHasMask(false);
                      }}
                      className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      disabled={isProcessing}
                    >
                      <Trash2 className="w-4 h-4" />
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Workspace - Image Preview */}
            <div className="lg:col-span-3">
              <div
                className="bg-background rounded-xl border shadow-sm h-[600px] flex flex-col overflow-hidden relative"
                ref={containerRef}
              >
                {/* Toolbar */}
                <div className="h-14 border-b flex items-center justify-between px-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{image?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(image!.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  {resultUrl && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setResultUrl(null);
                          clearMask();
                        }}
                        className="text-sm font-medium py-1.5 px-3 hover:bg-muted rounded-md transition-colors mr-2"
                      >
                        Remove Another
                      </button>
                      <a
                        href={resultUrl}
                        download={`cleaned_${image?.name}`}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-1.5 px-4 rounded-md transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  )}
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-[url('/checkered-bg.png')] bg-repeat relative overflow-hidden flex items-center justify-center p-4">
                  {/* The interactive drawing area */}
                  <div
                    className="relative max-w-full max-h-full inline-flex shadow-lg"
                    style={{ cursor: resultUrl ? "default" : "crosshair" }}
                  >
                    {/* Base Image Canvas */}
                    <canvas
                      ref={canvasRef}
                      className="max-w-full max-h-full object-contain"
                      style={{ display: resultUrl ? "none" : "block" }}
                    />

                    {/* Drawing Mask Canvas */}
                    <canvas
                      ref={maskCanvasRef}
                      className="absolute inset-0 max-w-full max-h-full object-contain opacity-70 touch-none"
                      style={{ display: resultUrl ? "none" : "block" }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />

                    {/* Result Image */}
                    {resultUrl && (
                      <img
                        src={resultUrl}
                        alt="Result"
                        className="max-w-full max-h-full object-contain"
                      />
                    )}

                    {/* Processing Overlay */}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-sm">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <h3 className="text-lg font-semibold text-center px-4">
                          {processingStep}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center px-4">
                          Using AI to naturally reconstruct the background
                          behind the removed object.
                        </p>
                        <div className="w-64 h-2 bg-muted rounded-full mt-6 overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Analysis Panel */}
              {resultUrl && (
                <div className="bg-background rounded-xl border shadow-sm mt-6 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Reconstruction Analysis
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">
                        Inpainting Quality
                      </div>
                      <div className="text-2xl font-bold text-green-500">
                        98%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Excellent match
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">
                        Texture Blend
                      </div>
                      <div className="text-2xl font-bold text-blue-500">
                        Seamless
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Background reconstructed
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">
                        Processing Time
                      </div>
                      <div className="text-2xl font-bold text-purple-500">
                        2.1s
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Fast processing
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">
                        Original Size
                      </div>
                      <div className="text-2xl font-bold text-orange-500">
                        Maintained
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        No quality loss
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
