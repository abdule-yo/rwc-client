"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PredictionResponse } from "@/lib/api";

interface ResultDisplayProps {
  result: PredictionResponse | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [displayResult, setDisplayResult] = useState<PredictionResponse | null>(
    null
  );

  useEffect(() => {
    if (result) {
      setDisplayResult(result);
    }
  }, [result]);

  if (!displayResult) return null;

  const confidenceColor =
    displayResult.confidence >= 0.85
      ? "text-accent"
      : displayResult.confidence >= 0.7
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayResult.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center space-y-2"
        >
          {/* Main Label with Glitch Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.1,
            }}
            className="relative"
          >
            <h1 className="text-6xl font-bold text-foreground font-orbitron tracking-tight">
              {displayResult.label}
            </h1>
            {/* Glitch overlay effect */}
            <motion.div
              className="absolute inset-0 text-6xl font-bold text-accent mix-blend-screen"
              initial={{ opacity: 0, x: -2, y: 2 }}
              animate={{
                opacity: [0, 0.3, 0],
                x: [-2, 2, -2],
                y: [2, -2, 2],
              }}
              transition={{
                duration: 0.3,
                times: [0, 0.5, 1],
              }}
            >
              {displayResult.label}
            </motion.div>
          </motion.div>

          {/* Confidence Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
            <span className={`font-orbitron text-2xl font-semibold ${confidenceColor}`}>
              {(displayResult.confidence * 100).toFixed(1)}%
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent" />
          </motion.div>

          {/* Confidence Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="font-roboto text-xs text-foreground/60 uppercase tracking-widest"
          >
            CONFIDENCE LEVEL
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-accent to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
