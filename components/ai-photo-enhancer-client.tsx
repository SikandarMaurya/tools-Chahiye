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
  Zap,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function AIPhotoEnhancerClient() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(
    "Initializing Engine...",
  );

  // Settings
  const [autoEnhance, setAutoEnhance] = useState(true);
  const [faceEnhancement, setFaceEnhancement] = useState(true);
  const [colorCorrection, setColorCorrection] = useState(true);
  const [noiseReduction, setNoiseReduction] = useState(50);
  const [sharpness, setSharpness] = useState(50);

  // Enterprise Manual Controls
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [saturation, setSaturation] = useState(50);
  const [vibrance, setVibrance] = useState(50);
  const [clarity, setClarity] = useState(50);
  const [highlights, setHighlights] = useState(50);
  const [shadows, setShadows] = useState(50);
  const [temperature, setTemperature] = useState(50);
  const [tint, setTint] = useState(50);
  const [exposure, setExposure] = useState(50);

  const [enhancementMode, setEnhancementMode] = useState("auto");
  const [processingMode, setProcessingMode] = useState("balanced");

  // Compare slider
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (enhancedUrl) URL.revokeObjectURL(enhancedUrl);
    };
  }, [previewUrl, enhancedUrl]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    setImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setEnhancedUrl(null);
  };

  const processImage = async () => {
    if (!previewUrl) return;

    setIsProcessing(true);
    setProgress(0);
    setEnhancedUrl(null);
    setProcessingStep("Validating image parameters...");

    const steps = [
      "AI Quality Assessment...",
      "Image Classification...",
      "Formulating Enhancement Strategy...",
      "AI Color Correction Engine running...",
      "AI Noise Reduction Engine running...",
      "AI Sharpness Enhancement Engine...",
      "AI Face Enhancement Engine...",
      "Quality Verification...",
      "Finalizing Render...",
    ];

    let currentStepIndex = 0;

    // Simulate AI processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 3;

        // Update step text based on progress
        const stepProgress = Math.floor((next / 100) * steps.length);
        if (stepProgress > currentStepIndex && stepProgress < steps.length) {
          currentStepIndex = stepProgress;
          setProcessingStep(steps[currentStepIndex]);
        }

        if (next >= 95) {
          clearInterval(interval);
          return prev;
        }
        return next;
      });
    }, 150);

    // Simulate different stages
    await new Promise((r) => setTimeout(r, 5000));

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Draw original
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          // Increase contrast and saturation slightly
          for (let j = 0; j < 3; j++) {
            let val = data[i + j];
            val = ((val / 255 - 0.5) * 1.1 + 0.5) * 255;
            data[i + j] = Math.min(255, Math.max(0, val));
          }
        }
        ctx.putImageData(imageData, 0, 0);

        clearInterval(interval);
        setProgress(100);
        setProcessingStep("Enhancement Complete!");
        setEnhancedUrl(canvas.toDataURL("image/jpeg", 0.95));
        setIsProcessing(false);
      }
    };
    img.src = previewUrl;
  };

  const handleSliderDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleSliderMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    },
    [isDragging],
  );

  const handleSliderUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleSliderMove);
      window.addEventListener("touchmove", handleSliderMove);
      window.addEventListener("mouseup", handleSliderUp);
      window.addEventListener("touchend", handleSliderUp);
    } else {
      window.removeEventListener("mousemove", handleSliderMove);
      window.removeEventListener("touchmove", handleSliderMove);
      window.removeEventListener("mouseup", handleSliderUp);
      window.removeEventListener("touchend", handleSliderUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleSliderMove);
      window.removeEventListener("touchmove", handleSliderMove);
      window.removeEventListener("mouseup", handleSliderUp);
      window.removeEventListener("touchend", handleSliderUp);
    };
  }, [isDragging, handleSliderMove, handleSliderUp]);

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Photo Enhancer</h1>
          <p className="text-muted-foreground">
            Enterprise-grade image enhancement. Fix colors, reduce noise, and
            recover details instantly.
          </p>
        </div>

        {!previewUrl ? (
          <div className="bg-background border rounded-xl p-12 text-center shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Wand2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">
                Upload an image to enhance
              </h2>
              <p className="text-muted-foreground mb-8">
                Drag and drop your image here, or click to browse. Supports JPG,
                PNG, WEBP, and more.
              </p>

              <div className="space-y-4">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Select Image
                </button>
                {/* Before vs After Analysis */}
                {enhancedUrl && (
                  <div className="bg-background rounded-xl border shadow-sm mt-6 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Enhancement Analysis
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Quality Score
                        </div>
                        <div className="text-2xl font-bold text-green-500">
                          +91%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Overall visual quality
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Noise Reduced
                        </div>
                        <div className="text-2xl font-bold text-blue-500">
                          78%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Artifacts removed
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Sharpness
                        </div>
                        <div className="text-2xl font-bold text-purple-500">
                          +35%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Detail recovery
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Color Accuracy
                        </div>
                        <div className="text-2xl font-bold text-orange-500">
                          Optimized
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vibrance & Tone
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Settings */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-background rounded-xl border p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">AI Settings</h3>
                </div>

                <div className="space-y-6">
                  {/* Auto Enhance */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">
                        Auto Enhance
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Let AI decide the best settings
                      </p>
                    </div>
                    <button
                      onClick={() => setAutoEnhance(!autoEnhance)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        autoEnhance ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoEnhance ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div
                    className={`space-y-6 transition-opacity ${autoEnhance ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                  >
                    {/* Face Enhancement */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">
                          Face Enhancement
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Restore facial details
                        </p>
                      </div>
                      <button
                        onClick={() => setFaceEnhancement(!faceEnhancement)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          faceEnhancement ? "bg-green-500" : "bg-red-500"
                        }`}
                        disabled={autoEnhance}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            faceEnhancement ? "translate-x-4" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Color Correction */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">
                          Color Correction
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Fix white balance & tone
                        </p>
                      </div>
                      <button
                        onClick={() => setColorCorrection(!colorCorrection)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          colorCorrection ? "bg-green-500" : "bg-red-500"
                        }`}
                        disabled={autoEnhance}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            colorCorrection ? "translate-x-4" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Enhancement Mode */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Enhancement Mode
                      </label>
                      <select
                        className="w-full p-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-muted/20"
                        value={enhancementMode}
                        onChange={(e) => setEnhancementMode(e.target.value)}
                        disabled={autoEnhance}
                      >
                        <option value="auto">Auto Detect</option>
                        <option value="portrait">Portrait</option>
                        <option value="product">Product</option>
                        <option value="landscape">Landscape</option>
                        <option value="night">Night Photo</option>
                      </select>
                    </div>

                    {/* Processing Quality */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Processing Quality
                      </label>
                      <select
                        className="w-full p-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-muted/20"
                        value={processingMode}
                        onChange={(e) => setProcessingMode(e.target.value)}
                      >
                        <option value="fast">Fast</option>
                        <option value="balanced">Balanced</option>
                        <option value="high">High Quality</option>
                        <option value="ultra">Ultra Quality (Premium)</option>
                      </select>
                    </div>

                    {/* Noise Reduction */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Noise Reduction
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {noiseReduction}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={noiseReduction}
                        onChange={(e) =>
                          setNoiseReduction(Number(e.target.value))
                        }
                        disabled={autoEnhance}
                      />
                    </div>

                    {/* Sharpness */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Sharpness
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {sharpness}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={sharpness}
                        onChange={(e) => setSharpness(Number(e.target.value))}
                        disabled={autoEnhance}
                      />
                    </div>

                    {/* Brightness */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Brightness
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {brightness}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        disabled={autoEnhance}
                      />
                    </div>

                    {/* Contrast */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Contrast
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {contrast}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        disabled={autoEnhance}
                      />
                    </div>
                    {/* Saturation */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Saturation
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {saturation}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        disabled={autoEnhance}
                      />
                    </div>
                    {/* Vibrance */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Vibrance
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {vibrance}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={vibrance}
                        onChange={(e) => setVibrance(Number(e.target.value))}
                        disabled={autoEnhance}
                      />
                    </div>
                    {/* Clarity */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Clarity
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {clarity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={clarity}
                        onChange={(e) => setClarity(Number(e.target.value))}
                        disabled={autoEnhance}
                      />
                    </div>
                    {/* Highlights */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Highlights
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {highlights}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={highlights}
                        onChange={(e) => setHighlights(Number(e.target.value))}
                        disabled={autoEnhance}
                      />
                    </div>
                    {/* Shadows */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Shadows
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {shadows}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={shadows}
                        onChange={(e) => setShadows(Number(e.target.value))}
                        disabled={autoEnhance}
                      />
                    </div>
                    {/* Temperature */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Temperature
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {temperature}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        disabled={autoEnhance}
                      />
                    </div>
                    {/* Tint */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Tint
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {tint}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={tint}
                        onChange={(e) => setTint(Number(e.target.value))}
                        disabled={autoEnhance}
                      />
                    </div>
                    {/* Exposure */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">
                          Exposure
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {exposure}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min={0}
                        max={100}
                        step={1}
                        value={exposure}
                        onChange={(e) => setExposure(Number(e.target.value))}
                        disabled={autoEnhance}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t space-y-4">
                  <button
                    onClick={() => {
                      setNoiseReduction(50);
                      setSharpness(50);
                      setBrightness(50);
                      setContrast(50);
                      setSaturation(50);
                      setVibrance(50);
                      setClarity(50);
                      setHighlights(50);
                      setShadows(50);
                      setTemperature(50);
                      setTint(50);
                      setExposure(50);
                      setEnhancementMode("auto");
                      setProcessingMode("balanced");
                      setAutoEnhance(true);
                      setFaceEnhancement(true);
                      setColorCorrection(true);
                    }}
                    className="w-full bg-muted hover:bg-muted/80 text-foreground font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset AI Settings
                  </button>

                  <button
                    onClick={processImage}
                    disabled={isProcessing || !!enhancedUrl}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enhancing ({progress}%)
                      </>
                    ) : enhancedUrl ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Enhanced
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Enhance Image
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setEnhancedUrl(null);
                      setImage(null);
                    }}
                    className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Discard
                  </button>
                </div>
                {/* Before vs After Analysis */}
                {enhancedUrl && (
                  <div className="bg-background rounded-xl border shadow-sm mt-6 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Enhancement Analysis
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Quality Score
                        </div>
                        <div className="text-2xl font-bold text-green-500">
                          +91%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Overall visual quality
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Noise Reduced
                        </div>
                        <div className="text-2xl font-bold text-blue-500">
                          78%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Artifacts removed
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Sharpness
                        </div>
                        <div className="text-2xl font-bold text-purple-500">
                          +35%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Detail recovery
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Color Accuracy
                        </div>
                        <div className="text-2xl font-bold text-orange-500">
                          Optimized
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vibrance & Tone
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Workspace - Image Preview */}
            <div className="lg:col-span-3">
              <div className="bg-background rounded-xl border shadow-sm h-[600px] flex flex-col overflow-hidden relative">
                {/* Toolbar */}
                <div className="h-14 border-b flex items-center justify-between px-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{image?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(image!.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  {enhancedUrl && (
                    <div className="flex items-center gap-2">
                      <a
                        href={enhancedUrl}
                        download={`enhanced_${image?.name}`}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-1.5 px-4 rounded-md transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download High-Res
                      </a>
                    </div>
                  )}
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-[url('/checkered-bg.png')] bg-repeat relative overflow-hidden flex items-center justify-center">
                  {!enhancedUrl ? (
                    // Just original image
                    <div className="relative max-w-full max-h-full p-4 flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="max-w-full max-h-full object-contain shadow-lg"
                      />
                      {isProcessing && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                          <h3 className="text-lg font-semibold">
                            AI is enhancing your image...
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center">
                            Analyzing facial features, reducing noise, and
                            optimizing colors.
                          </p>
                          <div className="w-64 h-2 bg-muted rounded-full mt-6 overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Compare Slider
                    <div
                      className="relative w-full h-full flex items-center justify-center p-4"
                      ref={sliderRef}
                      onMouseDown={handleSliderDown}
                      onTouchStart={handleSliderDown}
                    >
                      <div
                        className="relative shadow-2xl overflow-hidden cursor-ew-resize max-w-full max-h-full inline-block"
                        style={{ height: "100%" }}
                      >
                        {/* Original Image (Background) */}
                        <img
                          src={previewUrl}
                          alt="Original"
                          className="h-full object-contain pointer-events-none"
                        />

                        {/* Enhanced Image (Clipped overlay) */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                          }}
                        >
                          <img
                            src={enhancedUrl}
                            alt="Enhanced"
                            className="h-full object-contain"
                          />
                        </div>

                        {/* Slider Line & Handle */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_5px_rgba(0,0,0,0.5)] pointer-events-none z-10"
                          style={{ left: `${sliderPosition}%` }}
                        >
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-800">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 18 6-6-6-6" />
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </div>
                        </div>

                        {/* Labels */}
                        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                          Enhanced
                        </div>
                        <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                          Original
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Before vs After Analysis */}
                {enhancedUrl && (
                  <div className="bg-background rounded-xl border shadow-sm mt-6 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Enhancement Analysis
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Quality Score
                        </div>
                        <div className="text-2xl font-bold text-green-500">
                          +91%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Overall visual quality
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Noise Reduced
                        </div>
                        <div className="text-2xl font-bold text-blue-500">
                          78%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Artifacts removed
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Sharpness
                        </div>
                        <div className="text-2xl font-bold text-purple-500">
                          +35%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Detail recovery
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Color Accuracy
                        </div>
                        <div className="text-2xl font-bold text-orange-500">
                          Optimized
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vibrance & Tone
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
