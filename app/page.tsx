'use client'

import { useState } from "react";
import { LiveScanner } from "@/components/LiveScanner";
import { UploadAnalysis } from "@/components/Upload/UploadAnalysis";
import { Contributors } from "@/components/Contributors";
import { Camera, Image as ImageIcon, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [viewMode, setViewMode] = useState<"SELECTION" | "UPLOAD" | "LIVE" | "CONTRIBUTORS">("SELECTION");

  if (viewMode === "LIVE") {
    return <LiveScanner onBack={() => setViewMode("SELECTION")} />;
  }

  if (viewMode === "UPLOAD") {
    return <UploadAnalysis onBack={() => setViewMode("SELECTION")} />;
  }

  if (viewMode === "CONTRIBUTORS") {
    return <Contributors onBack={() => setViewMode("SELECTION")} />;
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="absolute top-8 right-8 z-20">
            <button 
                onClick={() => setViewMode("CONTRIBUTORS")}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-accent/40 transition-all group"
            >
                <Users className="w-4 h-4 text-foreground/60 group-hover:text-accent transition-colors" />
                <span className="text-xs font-orbitron text-foreground/60 group-hover:text-accent transition-colors tracking-wider">MEET THE TEAM</span>
            </button>
        </div>

        <div className="z-10 text-center space-y-12">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-accent text-xs font-orbitron tracking-widest uppercase">Demo Day Ready</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-white tracking-tight">
                    WASTE<span className="text-accent">CLASSIFIER</span>
                </h1>
                <p className="text-foreground/60 max-w-lg mx-auto font-light text-lg">
                    Select your preferred classification interface.
                </p>
                <div className="text-xs font-mono text-foreground/30 uppercase tracking-[0.2em] pt-2">
                    POWERED BY GOOGLE VIT-BASE-PATCH16-224
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <motion.button
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setViewMode("UPLOAD")}
                    className="group relative p-8 rounded-3xl bg-slate-900/50 backdrop-blur-md border border-slate-800 hover:border-accent/50 transition-all duration-300 text-left space-y-6 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                        <ImageIcon className="w-8 h-8 text-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-orbitron text-white mb-2">Analysis Mode</h3>
                        <p className="text-foreground/50 text-sm">High-precision classification for uploaded images. Features detailed processing visualization.</p>
                    </div>
                    <div className="flex items-center gap-2 text-accent text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        <span>LAUNCH MODULE</span>
                        <span>→</span>
                    </div>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setViewMode("LIVE")}
                    className="group relative p-8 rounded-3xl bg-slate-900/50 backdrop-blur-md border border-slate-800 hover:border-red-500/50 transition-all duration-300 text-left space-y-6 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
                        <Camera className="w-8 h-8 text-foreground group-hover:text-red-500 transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-orbitron text-white mb-2">Live Scanner</h3>
                        <p className="text-foreground/50 text-sm">Real-time AR experience with simulated HUD and lock-on effects. For demonstration purposes.</p>
                    </div>
                    <div className="flex items-center gap-2 text-red-500 text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        <span>ACTIVATE SCANNER</span>
                        <span>→</span>
                    </div>
                </motion.button>
            </div>
        </div>
    </main>
  );
}

