"use client";

import React from "react";
import { useWasteDetection } from "@/hooks/useWasteDetection";
import { CameraFeed } from "@/components/Scanner/CameraFeed";
import { HudOverlay } from "@/components/Scanner/HudOverlay";
import { ResultDisplay } from "@/components/Scanner/ResultDisplay";
import { AlertCircle } from "lucide-react";

export const LiveScanner = ({ onBack }: { onBack: () => void }) => {
  const { videoRef, prediction, confidence, loading, error } = useWasteDetection();

  const result = prediction
    ? { label: prediction, confidence, id: 0 }
    : null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
        {/* Back Button Overlay */}
        <div className="absolute top-8 left-8 z-50">
             <button
                onClick={onBack}
                className="bg-slate-950/80 backdrop-blur border border-accent/30 text-accent px-6 py-2 rounded-full font-orbitron text-xs hover:bg-accent hover:text-slate-950 transition-all uppercase tracking-widest"
             >
                Exit Detection
             </button>
        </div>

      {error ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center space-y-6 max-w-md px-8">
            <div className="flex justify-center">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Signal Lost
            </h1>
            <p className="text-foreground/60 font-mono text-sm">
              {error}
            </p>
          </div>
        </div>
      ) : (
        <>
          <CameraFeed videoRef={videoRef} />
          
          {/* Pass confidence to HUD for visual effects */}
          <HudOverlay 
            isAnalyzing={loading} 
            hasError={!!error} 
            confidence={result?.confidence || 0}
          />
          
          <ResultDisplay result={result} />

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="font-orbitron text-xs text-foreground/30 uppercase tracking-[0.3em]">
              Real-Time Detection System
            </div>
          </div>
        </>
      )}
    </div>
  );
};
