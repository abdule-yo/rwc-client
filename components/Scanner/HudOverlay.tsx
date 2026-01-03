"use client";

import React from "react";
import { motion } from "framer-motion";

interface HudOverlayProps {
  isAnalyzing: boolean;
  hasError: boolean;
  confidence?: number;
}

export const HudOverlay: React.FC<HudOverlayProps> = ({
  isAnalyzing,
  hasError,
  confidence = 0,
}) => {
  const isLocked = confidence > 0.8;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Glowing Frame */}
      <div 
        className={`absolute inset-4 border border-accent/20 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-colors duration-500 ${isLocked ? 'border-green-500/50 shadow-green-500/20' : ''}`} 
      />
      
      {/* Scanning Grid */}
      <div className="absolute inset-0 scanning-grid opacity-30" />

      {/* Center Simulated Scanning Box */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
        {/* Corner Brackets */}
        <CornerBrackets isLocked={isLocked} />
        
        {/* Fake Laser Scan - Only when NOT locked */}
        {!isLocked && (
            <div className="absolute left-0 right-0 h-0.5 bg-accent/80 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-laser-scan blur-[1px]" />
        )}
        
        {/* Locked text */}
        {isLocked && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-green-500 font-mono text-xs tracking-[0.3em] font-bold animate-pulse">
                TARGET LOCKED
            </div>
        )}
      </div>

      {/* Scanning Line (Full Screen) - Optional, kept subtle */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        animate={{
          y: ["0vh", "100vh", "0vh"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Status Indicator */}
      <div className="absolute top-8 left-8">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              hasError
                ? "bg-red-500"
                : isAnalyzing
                ? "bg-accent animate-pulse"
                : "bg-green-500"
            }`}
          />
          <span className="font-orbitron text-sm text-foreground/80 uppercase tracking-wider">
            {hasError ? "Signal Lost" : isAnalyzing ? "Scanning..." : "Active"}
          </span>
        </motion.div>
      </div>

      {/* HUD Info Bar - Top Right */}
      <div className="absolute top-8 right-8 font-orbitron text-xs text-accent/80 space-y-1 bg-slate-950/50 backdrop-blur-md border border-accent/20 p-4 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.1)]">
        <div className="flex justify-between gap-8">
          <span>SYSTEM</span>
          <span className="text-accent">RW-01</span>
        </div>
        <div className="flex justify-between gap-8">
          <span>MODEL</span>
          <span className="text-accent">VIT-BASE</span>
        </div>
        <div className="flex justify-between gap-8">
          <span>MODE</span>
          <span className="text-accent">LIVE</span>
        </div>
        <div className="flex justify-between gap-8">
          <span>SCAN</span>
          <span className={`${isLocked ? 'text-green-500' : 'text-accent animate-pulse'}`}>
            {isLocked ? 'LOCKED' : 'SEARCHING'}
          </span>
        </div>
      </div>
      
      {/* Decorative 'Geometry' Angles */}
      <div className="absolute bottom-8 right-8 w-32 h-32 border-b-2 border-r-2 border-accent/20 rounded-br-3xl" />
      <div className="absolute bottom-8 left-8 w-32 h-32 border-b-2 border-l-2 border-accent/20 rounded-bl-3xl" />
    </div>
  );
};

const CornerBrackets: React.FC<{ isLocked: boolean }> = ({ isLocked }) => {
  const bracketSize = 20;
  const strokeWidth = 2;
  const color = isLocked ? "text-green-500" : "text-accent";

  return (
    <>
      <svg className={`absolute top-0 left-0 transition-colors duration-300 ${color}`} width={bracketSize} height={bracketSize} viewBox={`0 0 ${bracketSize} ${bracketSize}`}>
        <path d={`M ${bracketSize} 0 L 0 0 L 0 ${bracketSize}`} stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
      </svg>

      <svg className={`absolute top-0 right-0 transition-colors duration-300 ${color}`} width={bracketSize} height={bracketSize} viewBox={`0 0 ${bracketSize} ${bracketSize}`}>
        <path d={`M 0 0 L ${bracketSize} 0 L ${bracketSize} ${bracketSize}`} stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
      </svg>

      <svg className={`absolute bottom-0 left-0 transition-colors duration-300 ${color}`} width={bracketSize} height={bracketSize} viewBox={`0 0 ${bracketSize} ${bracketSize}`}>
        <path d={`M 0 0 L 0 ${bracketSize} L ${bracketSize} ${bracketSize}`} stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
      </svg>

      <svg className={`absolute bottom-0 right-0 transition-colors duration-300 ${color}`} width={bracketSize} height={bracketSize} viewBox={`0 0 ${bracketSize} ${bracketSize}`}>
        <path d={`M ${bracketSize} 0 L ${bracketSize} ${bracketSize} L 0 ${bracketSize}`} stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
      </svg>
    </>
  );
};
