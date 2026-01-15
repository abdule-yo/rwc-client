"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, CheckCircle2, Scan, Link, X } from "lucide-react";
import { predictObject, predictObjectFromUrl, PredictionResponse } from "@/lib/api";

export const UploadAnalysis = ({ onBack }: { onBack: () => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<"file" | "url" | null>(null);
  const [loadingState, setLoadingState] = useState<
    "IDLE" | "UPLOADING" | "PROCESSING" | "CLASSIFYING" | "DONE"
  >("IDLE");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const isValidImageUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData("text")?.trim();
      
      if (pastedText && isValidImageUrl(pastedText)) {
        e.preventDefault();
        handleUrlSubmit(pastedText);
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  const handleUrlSubmit = async (url: string) => {
    setImage(url);
    setImageSource("url");
    setError(null);
    setLoadingState("UPLOADING");

    setTimeout(() => {
      setLoadingState("PROCESSING");

      setTimeout(async () => {
        setLoadingState("CLASSIFYING");

        try {
          const response = await predictObjectFromUrl(url);
          setResult(response);
          setTimeout(() => setLoadingState("DONE"), 300);
        } catch (err) {
          setLoadingState("IDLE");
          setError("Analysis Failed. Could not fetch or classify the image.");
        }
      }, 500);
    }, 500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);

    setImageSource("file");
    setError(null);
    setLoadingState("UPLOADING");

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const TARGET_SIZE = 224;
      canvas.width = TARGET_SIZE;
      canvas.height = TARGET_SIZE;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, TARGET_SIZE, TARGET_SIZE);

        canvas.toBlob((blob) => {
          if (!blob) {
             setError("Image processing failed");
             setLoadingState("IDLE");
             return;
          }

          setTimeout(() => {
            setLoadingState("PROCESSING");

            setTimeout(async () => {
              setLoadingState("CLASSIFYING");

              try {
                const response = await predictObject(blob);
                setResult(response);
                setTimeout(() => setLoadingState("DONE"), 300); 
              } catch (err) {
                setLoadingState("IDLE");
                setError("Analysis Failed. Please try again.");
              }
            }, 500);
          }, 500);
        }, "image/jpeg", 0.8);
      }
    };
  };

  const handleReset = () => {
    setImage(null);
    setImageSource(null);
    setResult(null);
    setError(null);
    setLoadingState("IDLE");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-foreground p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <button
          onClick={onBack}
          className="text-foreground/60 hover:text-accent transition-colors font-orbitron text-sm uppercase tracking-wider"
        >
          ← Return to Menu
        </button>
        <h1 className="font-orbitron text-2xl text-accent">Laboratory Mode</h1>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
            <div 
                ref={dropZoneRef}
                onClick={() => !image && fileInputRef.current?.click()}
                className={`
                    relative h-96 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                    ${image ? 'border-accent/50 bg-slate-900/50' : 'border-slate-700 hover:border-accent hover:bg-slate-900 cursor-pointer'}
                `}
            >
                <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                
                {image ? (
                    <div className="relative h-full w-full">
                        <img 
                            src={image} 
                            alt="Analyzed Item" 
                            className="h-full w-full object-contain rounded-xl p-4"
                            onError={() => {
                              if (imageSource === "url") {
                                setError("Could not load image from URL. Please check the link.");
                                setImage(null);
                                setLoadingState("IDLE");
                              }
                            }}
                        />
                        {loadingState === "DONE" && (
                          <button
                            onClick={handleReset}
                            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-red-500/80 transition-colors"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        )}
                        {imageSource === "url" && (
                          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30">
                            <Link className="w-3 h-3 text-accent" />
                            <span className="text-xs font-mono text-accent">URL</span>
                          </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
                            <Upload className="w-10 h-10 text-accent" />
                        </div>
                        <div>
                            <p className="font-orbitron text-lg">Drop Specimen Here</p>
                            <p className="text-sm text-foreground/40 mt-2">or click to browse</p>
                        </div>
                        <div className="flex items-center gap-2 justify-center pt-4 border-t border-slate-800 mx-8">
                          <Link className="w-4 h-4 text-accent/60" />
                          <p className="text-xs text-foreground/40 font-mono">
                            Or paste an image URL (Ctrl+V / Cmd+V)
                          </p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="flex flex-col justify-center space-y-8 min-h-[400px]">
            <AnimatePresence mode="wait">
                {loadingState === "IDLE" && !error && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-foreground/40 font-mono"
                    >
                        Waiting for input...
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center space-y-2"
                    >
                        <p className="text-red-500 font-bold font-orbitron">ANALYSIS FAILED</p>
                        <p className="text-foreground/60 text-sm">{error}</p>
                        <button
                          onClick={handleReset}
                          className="mt-4 px-4 py-2 text-xs font-mono text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors"
                        >
                          TRY AGAIN
                        </button>
                    </motion.div>
                )}

                {(loadingState !== "IDLE" && loadingState !== "DONE") && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <Step 
                                label={imageSource === "url" ? "Fetching from URL..." : "Uploading Specimen..."} 
                                status={loadingState === "UPLOADING" ? "active" : "complete"} 
                            />
                            <Step 
                                label="Processing Neural Matrix..." 
                                status={loadingState === "PROCESSING" ? "active" : loadingState === "UPLOADING" ? "pending" : "complete"} 
                            />
                            <Step 
                                label="Classifying Waste Type..." 
                                status={loadingState === "CLASSIFYING" ? "active" : "pending"} 
                            />
                        </div>

                        <div className="flex justify-center pt-8">
                            <Scan className="w-16 h-16 text-accent animate-pulse" />
                        </div>
                    </motion.div>
                )}

                {loadingState === "DONE" && result && (
                        <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Primary Prediction Card */}
                        <motion.div 
                            className="relative overflow-hidden bg-slate-900/80 border border-accent/20 rounded-3xl p-8 backdrop-blur-xl group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-slate-950 font-bold font-orbitron text-xl">
                                            01
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono text-accent/60 uppercase tracking-widest block mb-1">
                                                Top Prediction
                                            </span>
                                            <h2 className="text-3xl sm:text-4xl font-orbitron font-bold text-white tracking-tight">
                                                {result.top_prediction.label}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-4xl font-bold font-orbitron text-accent">
                                            {Math.round((result.top_prediction.confidence || 0) * 100)}<span className="text-lg">%</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(result.top_prediction.confidence || 0) * 100}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                                            className="h-full bg-accent relative"
                                        >
                                            <motion.div 
                                                className="absolute inset-0 bg-white/20"
                                                animate={{ x: ["-100%", "100%"] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            />
                                        </motion.div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                     <div className="h-1 w-1 rounded-full bg-accent/50" />
                                     <p className="text-xs font-mono text-foreground/40">
                                        Identified with high confidence using Google ViT model
                                     </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Alternative Predictions */}
                        {result.predictions && result.predictions.length > 1 && (
                            <div className="space-y-4">
                                <motion.h4 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-xs font-mono text-foreground/40 uppercase tracking-widest pl-2"
                                >
                                    Alternative Classifications
                                </motion.h4>
                                
                                <div className="grid gap-3">
                                    {result.predictions.slice(1, 3).map((alt, index) => (
                                        <motion.div
                                            key={alt.label}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 + (index * 0.1) }}
                                            className="group relative overflow-hidden bg-slate-900/40 border border-slate-800 hover:border-slate-600 rounded-xl p-4 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-2 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-800 text-[10px] font-mono text-foreground/60">
                                                        {index + 2}
                                                    </span>
                                                    <span className="font-medium text-foreground/80 group-hover:text-white transition-colors">
                                                        {alt.label}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-mono text-foreground/40">
                                                    {((alt.confidence || 0) * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            
                                            {/* Progress Bar Background */}
                                            <div className="absolute bottom-0 left-0 h-0.5 bg-slate-800 w-full">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(alt.confidence || 0) * 100}%` }}
                                                    transition={{ duration: 1, delay: 0.8 + (index * 0.1) }}
                                                    className="h-full bg-foreground/20 group-hover:bg-accent/50 transition-colors"
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Step = ({ label, status }: { label: string; status: "pending" | "active" | "complete" }) => {
    return (
        <div className={`flex items-center gap-4 ${status === "pending" ? "opacity-30" : "opacity-100"}`}>
            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center border
                ${status === "complete" ? "bg-accent border-accent text-slate-950" : "border-foreground/20 text-foreground/40"}
                ${status === "active" ? "border-accent text-accent animate-pulse" : ""}
            `}>
                {status === "complete" ? <CheckCircle2 size={16} /> : status === "active" ? <Loader2 size={16} className="animate-spin" /> : <div className="w-2 h-2 rounded-full bg-current" />}
            </div>
            <span className={`font-mono text-sm ${status === "active" ? "text-accent" : "text-foreground"}`}>{label}</span>
        </div>
    )
}

